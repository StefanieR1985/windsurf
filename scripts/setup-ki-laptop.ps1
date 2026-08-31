<#
.SYNOPSIS
    Richtet einen Windows-Laptop fuer die Arbeit mit KI ein und legt ein
    Arbeitsprojekt an.

.DESCRIPTION
    Installiert die Werkzeuge ueber winget und npm, legt danach unter
    %USERPROFILE%\KI-Arbeitsplatz ein fertiges Projekt an: Python-Umgebung,
    Vorlage fuer die API-Keys, zwei Beispielskripte und Playwright.

    Das Skript ist idempotent - ein zweiter Durchlauf ueberspringt alles,
    was schon da ist. Es ueberschreibt keine vorhandenen Dateien.

.PARAMETER ProjectPath
    Ordner fuer das Projekt. Standard: %USERPROFILE%\KI-Arbeitsplatz

.PARAMETER Desktop
    Zusaetzlich die Desktop-Apps installieren (Wispr Flow, Perplexity,
    Claude, ChatGPT, LM Studio).

.PARAMETER SkipTools
    Die Installation der Werkzeuge ueberspringen, nur das Projekt anlegen.

.PARAMETER SkipProject
    Nur die Werkzeuge installieren, kein Projekt anlegen.

.PARAMETER SkipPlaywright
    Playwright und die Browser auslassen.

.PARAMETER DryRun
    Nur anzeigen, was passieren wuerde.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\setup-ki-laptop.ps1

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\setup-ki-laptop.ps1 -Desktop
#>
[CmdletBinding()]
param(
    [string] $ProjectPath = (Join-Path $env:USERPROFILE 'KI-Arbeitsplatz'),
    [switch] $Desktop,
    [switch] $SkipTools,
    [switch] $SkipProject,
    [switch] $SkipPlaywright,
    [switch] $DryRun
)

$ErrorActionPreference = 'Continue'
$script:Failures = @()

# ------------------------------------------------------------------ Ausgabe --

function Write-Section { param([string] $Text) Write-Host ''; Write-Host "==> $Text" -ForegroundColor White }
function Write-Info    { param([string] $Text) Write-Host "    $Text" }
function Write-Ok      { param([string] $Text) Write-Host "    [ok]   $Text" -ForegroundColor Green }
function Write-Skipped { param([string] $Text) Write-Host "    [--]   $Text" -ForegroundColor DarkGray }
function Write-Note    { param([string] $Text) Write-Host "    [!]    $Text" -ForegroundColor Yellow }
function Write-Failure {
    param([string] $Text)
    Write-Host "    [fail] $Text" -ForegroundColor Red
    $script:Failures += $Text
}

# ------------------------------------------------------------------ Helfer ---

function Test-Command {
    param([string] $Name)
    return [bool] (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-Step {
    # Fuehrt ein externes Programm aus und meldet, ob es geklappt hat.
    param(
        [Parameter(Mandatory = $true)][string] $FilePath,
        [string[]] $Arguments = @()
    )
    if ($DryRun) {
        Write-Host "    [dry]  $FilePath $($Arguments -join ' ')" -ForegroundColor DarkGray
        return $true
    }
    try {
        & $FilePath @Arguments
        return ($LASTEXITCODE -eq 0)
    } catch {
        Write-Info $_.Exception.Message
        return $false
    }
}

function Update-SessionPath {
    # Frisch installierte Programme stehen erst nach einem PATH-Neuaufbau zur
    # Verfuegung - sonst wuerde "node" in dieser Sitzung noch nicht gefunden.
    $machine = [Environment]::GetEnvironmentVariable('Path', 'Machine')
    $user    = [Environment]::GetEnvironmentVariable('Path', 'User')
    $parts   = @($machine, $user) | Where-Object { $_ }
    if ($parts) { $env:Path = ($parts -join ';') }
}

function Test-WingetPackageInstalled {
    param([string] $Id)
    winget list --id $Id --exact --accept-source-agreements 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Test-WingetPackageExists {
    param([string] $Id)
    winget show --id $Id --exact --source winget --accept-source-agreements 2>&1 | Out-Null
    return ($LASTEXITCODE -eq 0)
}

function Install-WingetApp {
    <#
        Installiert ein Paket ueber winget. Paket-IDs aendern sich gelegentlich,
        deshalb werden mehrere Kandidaten der Reihe nach geprueft und bei
        Misserfolg der Download-Link ausgegeben, statt still zu scheitern.
    #>
    param(
        [Parameter(Mandatory = $true)][string]   $Name,
        [Parameter(Mandatory = $true)][string[]] $Ids,
        [string] $Url
    )

    foreach ($id in $Ids) {
        if (Test-WingetPackageInstalled -Id $id) {
            Write-Skipped "$Name ist bereits installiert"
            return $true
        }
    }

    foreach ($id in $Ids) {
        if ($DryRun) {
            Write-Host "    [dry]  winget install --id $id" -ForegroundColor DarkGray
            return $true
        }
        if (-not (Test-WingetPackageExists -Id $id)) { continue }

        $ok = Invoke-Step -FilePath 'winget' -Arguments @(
            'install', '--id', $id, '--exact', '--source', 'winget',
            '--accept-package-agreements', '--accept-source-agreements'
        )
        if ($ok) {
            Write-Ok "$Name installiert ($id)"
            return $true
        }
    }

    Write-Failure "$Name konnte nicht ueber winget installiert werden"
    if ($Url) { Write-Info "Direkt herunterladen: $Url" }
    return $false
}

function New-FileIfMissing {
    # Legt eine Datei an, ueberschreibt aber nie eine vorhandene.
    param(
        [Parameter(Mandatory = $true)][string] $Path,
        [Parameter(Mandatory = $true)][string] $Content,
        [string] $Label
    )
    if (-not $Label) { $Label = Split-Path $Path -Leaf }
    if (Test-Path $Path) {
        Write-Skipped "$Label existiert bereits"
        return
    }
    if ($DryRun) {
        Write-Host "    [dry]  schreibe $Path" -ForegroundColor DarkGray
        return
    }
    Set-Content -Path $Path -Value $Content -Encoding UTF8
    Write-Ok "$Label angelegt"
}

# ----------------------------------------------------------- Voraussetzungen --

function Test-Prerequisites {
    Write-Section 'Voraussetzungen pruefen'
    Write-Info "Windows: $([Environment]::OSVersion.VersionString)"
    Write-Info "PowerShell: $($PSVersionTable.PSVersion)"

    if (-not (Test-Command 'winget')) {
        Write-Failure 'winget fehlt - ohne den Paketmanager geht es nicht weiter'
        Write-Info 'Im Microsoft Store nach "App Installer" suchen und installieren,'
        Write-Info 'danach dieses Fenster schliessen und das Skript neu starten.'
        return $false
    }
    Write-Ok 'winget ist vorhanden'
    return $true
}

# --------------------------------------------------------------- Werkzeuge ---

function Install-Tools {
    Write-Section 'Werkzeuge installieren'

    Install-WingetApp -Name 'Git'     -Ids @('Git.Git') -Url 'https://git-scm.com/download/win' | Out-Null
    Install-WingetApp -Name 'Node.js' -Ids @('OpenJS.NodeJS.LTS', 'OpenJS.NodeJS') -Url 'https://nodejs.org/' | Out-Null
    Install-WingetApp -Name 'Python'  -Ids @('Python.Python.3.13', 'Python.Python.3.12', 'Python.Python.3.14') -Url 'https://www.python.org/downloads/windows/' | Out-Null
    Install-WingetApp -Name 'uv'      -Ids @('astral-sh.uv') -Url 'https://docs.astral.sh/uv/' | Out-Null
    Install-WingetApp -Name 'Ollama'  -Ids @('Ollama.Ollama') -Url 'https://ollama.com/download' | Out-Null

    Update-SessionPath
}

function Install-CliAgents {
    Write-Section 'KI-Agenten fuers Terminal'

    if (-not (Test-Command 'npm') -and -not $DryRun) {
        Write-Failure 'npm nicht gefunden - Node.js scheint zu fehlen'
        Write-Info 'Nach der Node-Installation hilft ein Neustart von PowerShell.'
        return
    }

    $agents = @(
        @{ Name = 'Claude Code'; Package = '@anthropic-ai/claude-code'; Command = 'claude' },
        @{ Name = 'Codex CLI';   Package = '@openai/codex';             Command = 'codex'  },
        @{ Name = 'Gemini CLI';  Package = '@google/gemini-cli';        Command = 'gemini' }
    )

    foreach ($agent in $agents) {
        if (Test-Command $agent.Command) {
            Write-Skipped "$($agent.Name) ist bereits installiert"
            continue
        }
        if (Invoke-Step -FilePath 'npm' -Arguments @('install', '-g', $agent.Package)) {
            Write-Ok "$($agent.Name) installiert"
        } else {
            Write-Failure "$($agent.Name) konnte nicht installiert werden"
        }
    }

    # Kimi CLI kommt von Moonshot und wird ueber uv installiert.
    if (Test-Command 'kimi') {
        Write-Skipped 'Kimi CLI ist bereits installiert'
    } elseif (Test-Command 'uv') {
        if (Invoke-Step -FilePath 'uv' -Arguments @('tool', 'install', '--python', '3.13', 'kimi-cli')) {
            Write-Ok 'Kimi CLI installiert'
        } else {
            Write-Failure 'Kimi CLI konnte nicht installiert werden'
        }
    } elseif (-not $DryRun) {
        Write-Note 'uv fehlt - Kimi CLI uebersprungen'
    }

    Update-SessionPath
}

# ------------------------------------------------------------ Desktop-Apps ---

function Install-DesktopApps {
    Write-Section 'Desktop-Apps'

    $apps = @(
        @{ Name = 'Wispr Flow (Diktieren)'; Ids = @('WisprAI.WisprFlow', 'Wispr.Flow');           Url = 'https://wisprflow.ai/downloads' },
        @{ Name = 'Perplexity';             Ids = @('Perplexity.Perplexity');                      Url = 'https://www.perplexity.ai/hub/products/computer-for-windows' },
        @{ Name = 'Claude';                 Ids = @('Anthropic.Claude');                           Url = 'https://claude.com/download' },
        @{ Name = 'ChatGPT';                Ids = @('OpenAI.ChatGPT');                             Url = 'https://chatgpt.com/download' },
        @{ Name = 'LM Studio';              Ids = @('ElementLabs.LMStudio', 'LMStudio.LMStudio');  Url = 'https://lmstudio.ai/' }
    )

    foreach ($app in $apps) {
        Install-WingetApp -Name $app.Name -Ids $app.Ids -Url $app.Url | Out-Null
    }

    Write-Info 'Wispr Flow braucht beim ersten Start die Freigabe fuer das Mikrofon.'
}

# ---------------------------------------------------------------- Projekt ---

function New-Project {
    Write-Section "Projekt anlegen: $ProjectPath"

    if (-not (Test-Path $ProjectPath)) {
        if ($DryRun) {
            Write-Host "    [dry]  lege $ProjectPath an" -ForegroundColor DarkGray
        } else {
            New-Item -ItemType Directory -Path $ProjectPath -Force | Out-Null
            Write-Ok 'Projektordner angelegt'
        }
    } else {
        Write-Skipped 'Projektordner existiert bereits'
    }

    if (-not $DryRun) {
        New-Item -ItemType Directory -Path (Join-Path $ProjectPath 'beispiele') -Force | Out-Null
        New-Item -ItemType Directory -Path (Join-Path $ProjectPath 'notizen')   -Force | Out-Null
        Write-Ok 'Unterordner beispiele\ und notizen\ angelegt'
    }

    $requirements = @'
# KI-Bibliotheken fuer dieses Projekt.
# Installation: .venv\Scripts\python.exe -m pip install -r requirements.txt

anthropic>=1.2,<2          # Claude
openai>=3.6,<4             # GPT und Whisper-Transkription
google-genai>=2.20,<3      # Gemini

# Kimi (Moonshot), Perplexity und Ollama sprechen die OpenAI-API und brauchen
# kein eigenes Paket - nur eine andere base_url.

faster-whisper>=1.2,<2     # Spracherkennung lokal
python-dotenv>=1.0         # .env einlesen
httpx>=0.27
'@

    $envTemplate = @'
# API-Keys. Diese Datei bleibt auf dem Rechner und gehoert in kein Repository.
# Es muss nicht jeder Key gesetzt sein - nur die Anbieter, die genutzt werden.

# Claude (Anthropic) ....... https://console.anthropic.com/settings/keys
ANTHROPIC_API_KEY=
# GPT (OpenAI) ............. https://platform.openai.com/api-keys
OPENAI_API_KEY=
# Gemini (Google) .......... https://aistudio.google.com/apikey
GEMINI_API_KEY=
# Perplexity ............... https://www.perplexity.ai/account/api/keys
PERPLEXITY_API_KEY=
# Kimi (Moonshot AI) ....... https://platform.moonshot.ai/console/api-keys
MOONSHOT_API_KEY=
'@

    $readme = @'
# KI-Arbeitsplatz

Arbeitsordner fuer alles, was mit KI zu tun hat.

## Was hier liegt

    .venv\           Python-Umgebung mit den KI-Bibliotheken
    .env             API-Keys (bleibt lokal, nie weitergeben)
    beispiele\       zwei Skripte zum Ausprobieren
    notizen\         Platz fuer Audiodateien, Texte, Zwischenstaende
    requirements.txt Liste der Python-Pakete

## Erste Schritte

1. Keys eintragen: `.env` im Editor oeffnen und mindestens einen Key ausfuellen.

2. Umgebung aktivieren (in PowerShell, im Projektordner):

       .\.venv\Scripts\Activate.ps1

   Meldet PowerShell dabei einen Fehler wegen der Ausfuehrungsrichtlinie:

       Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

3. Erstes Skript starten:

       python beispiele\frage-claude.py "Fasse mir diesen Text zusammen: ..."

4. Sprachaufnahme in Text verwandeln (laeuft komplett lokal, ohne Internet):

       python beispiele\transkribiere.py notizen\aufnahme.m4a

## Terminal-Agenten

Installiert sind `claude`, `codex`, `gemini` und `kimi`. Einfach im
Projektordner starten:

    claude

## Lokale Modelle

    ollama pull llama3.2
    ollama run llama3.2

Laeuft auf dem eigenen Rechner: keine Kosten pro Anfrage, keine Daten nach
aussen. Gut fuer alles, was personenbezogene Daten enthaelt.
'@

    $askClaude = @'
"""Kleines Beispiel: eine Frage an Claude schicken.

    python beispiele/frage-claude.py "Deine Frage"
"""
import os
import sys

from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

if not os.environ.get("ANTHROPIC_API_KEY"):
    sys.exit("ANTHROPIC_API_KEY fehlt - bitte in der Datei .env eintragen.")

frage = " ".join(sys.argv[1:]) or "Erklaere mir in drei Saetzen, was du kannst."

client = Anthropic()
antwort = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": frage}],
)

for block in antwort.content:
    if block.type == "text":
        print(block.text)
'@

    $transcribe = @'
"""Sprachaufnahme in Text verwandeln - komplett lokal, ohne Internet.

    python beispiele/transkribiere.py notizen/aufnahme.m4a

Der erste Lauf laedt das Modell herunter (einige hundert MB) und dauert
entsprechend laenger.
"""
import sys
from pathlib import Path

from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    sys.exit("Aufruf: python transkribiere.py <audiodatei>")

datei = Path(sys.argv[1])
if not datei.exists():
    sys.exit(f"Datei nicht gefunden: {datei}")

model = WhisperModel("base", device="cpu", compute_type="int8")
segmente, info = model.transcribe(str(datei), language="de")

print(f"Erkannte Sprache: {info.language}\n")
text = " ".join(segment.text.strip() for segment in segmente)
print(text)

ziel = datei.with_suffix(".txt")
ziel.write_text(text, encoding="utf-8")
print(f"\nGespeichert unter: {ziel}")
'@

    New-FileIfMissing -Path (Join-Path $ProjectPath 'requirements.txt')            -Content $requirements -Label 'requirements.txt'
    New-FileIfMissing -Path (Join-Path $ProjectPath '.env')                        -Content $envTemplate  -Label '.env (Vorlage fuer die Keys)'
    New-FileIfMissing -Path (Join-Path $ProjectPath 'README.md')                   -Content $readme       -Label 'README.md'
    $samples = Join-Path $ProjectPath 'beispiele'
    New-FileIfMissing -Path (Join-Path $samples 'frage-claude.py')  -Content $askClaude  -Label 'beispiele\frage-claude.py'
    New-FileIfMissing -Path (Join-Path $samples 'transkribiere.py') -Content $transcribe -Label 'beispiele\transkribiere.py'

    New-PythonEnvironment
    if (-not $SkipPlaywright) { Install-Playwright }
}

function New-PythonEnvironment {
    Write-Section 'Python-Umgebung im Projekt'

    $venv   = Join-Path $ProjectPath '.venv'
    $python = Join-Path $venv 'Scripts\python.exe'

    if (Test-Path $python) {
        Write-Skipped 'Python-Umgebung existiert bereits'
    } else {
        if (-not (Test-Command 'python') -and -not $DryRun) {
            Write-Failure 'python nicht gefunden - PowerShell neu starten und Skript erneut ausfuehren'
            return
        }
        if (Invoke-Step -FilePath 'python' -Arguments @('-m', 'venv', $venv)) {
            Write-Ok "Umgebung angelegt: $venv"
        } else {
            Write-Failure 'Python-Umgebung konnte nicht angelegt werden'
            return
        }
    }

    if ($DryRun) {
        Write-Host "    [dry]  pip install -r requirements.txt" -ForegroundColor DarkGray
        return
    }

    Invoke-Step -FilePath $python -Arguments @('-m', 'pip', 'install', '--quiet', '--upgrade', 'pip') | Out-Null
    $req = Join-Path $ProjectPath 'requirements.txt'
    if (Invoke-Step -FilePath $python -Arguments @('-m', 'pip', 'install', '--quiet', '-r', $req)) {
        Write-Ok 'KI-Bibliotheken installiert (anthropic, openai, google-genai, faster-whisper)'
    } else {
        Write-Failure 'Python-Pakete konnten nicht installiert werden'
    }
}

function Install-Playwright {
    Write-Section 'Playwright (Browser-Automatisierung)'

    if (-not (Test-Command 'npm') -and -not $DryRun) {
        Write-Failure 'npm nicht gefunden - Playwright uebersprungen'
        return
    }
    if (-not (Test-Path $ProjectPath)) {
        if ($DryRun) {
            Write-Host "    [dry]  npm init und playwright install in $ProjectPath" -ForegroundColor DarkGray
        } else {
            Write-Failure 'Projektordner fehlt - Playwright uebersprungen'
        }
        return
    }

    Push-Location $ProjectPath
    try {
        if (-not (Test-Path (Join-Path $ProjectPath 'package.json'))) {
            Invoke-Step -FilePath 'npm' -Arguments @('init', '-y') | Out-Null
        }
        if (Test-Path (Join-Path $ProjectPath 'node_modules\@playwright\test')) {
            Write-Skipped 'Playwright ist bereits installiert'
        } elseif (Invoke-Step -FilePath 'npm' -Arguments @('install', '-D', '@playwright/test')) {
            Write-Ok 'Playwright installiert'
        } else {
            Write-Failure 'Playwright konnte nicht installiert werden'
            return
        }

        # Die Browser kommen nach dem Paket - unter Windows ohne Sonderrechte.
        if (Invoke-Step -FilePath 'npx' -Arguments @('playwright', 'install', 'chromium')) {
            Write-Ok 'Browser installiert (Chromium)'
        } else {
            Write-Failure 'Browser konnten nicht installiert werden'
            Write-Info 'Spaeter nachholen mit: npx playwright install chromium'
        }
    } finally {
        Pop-Location
    }
}

# -------------------------------------------------------------- Abschluss ---

function Write-Summary {
    Write-Section 'Zusammenfassung'

    if ($script:Failures.Count -gt 0) {
        Write-Note "$($script:Failures.Count) Punkt(e) haben nicht geklappt:"
        foreach ($failure in $script:Failures) { Write-Info "- $failure" }
    } else {
        Write-Ok 'Alles durchgelaufen.'
    }

    Write-Host ''
    Write-Host '  Naechste Schritte:' -ForegroundColor White
    Write-Host ''
    Write-Host "  1. API-Keys eintragen in: $ProjectPath\.env"
    Write-Host '     (Links zu den Anbietern stehen in der Datei)'
    Write-Host ''
    Write-Host '  2. Fuer die Terminal-Agenten die Keys zusaetzlich als'
    Write-Host '     Umgebungsvariable setzen - einmalig, dauerhaft:'
    Write-Host ''
    Write-Host '       setx ANTHROPIC_API_KEY "sk-ant-..."' -ForegroundColor DarkGray
    Write-Host ''
    Write-Host '  3. PowerShell neu starten, damit alles im PATH liegt.'
    Write-Host ''
    Write-Host "  4. Loslegen:  cd $ProjectPath" -ForegroundColor DarkGray
    Write-Host '                claude' -ForegroundColor DarkGray
    Write-Host ''
}

# ------------------------------------------------------------------- Main ---

Write-Host ''
Write-Host '  KI-Arbeitsplatz einrichten' -ForegroundColor Cyan
if ($DryRun) { Write-Note 'dry-run: es wird nichts wirklich installiert' }

if (-not (Test-Prerequisites)) { exit 1 }

if (-not $SkipTools) {
    Install-Tools
    Install-CliAgents
}
if ($Desktop)      { Install-DesktopApps }
if (-not $SkipProject) { New-Project }

Write-Summary

if ($script:Failures.Count -gt 0) { exit 1 }
exit 0
