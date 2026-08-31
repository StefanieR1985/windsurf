#!/usr/bin/env bash
#
# setup-ki-tools.sh — installiert die KI-Werkzeuge, die wir bei move-in2stay nutzen.
#
# Unterstuetzt macOS (Homebrew) und Debian/Ubuntu-Linux. Das Skript ist idempotent:
# Es kann beliebig oft laufen und ueberspringt, was bereits installiert ist.
#
#   ./scripts/setup-ki-tools.sh              # CLI-Agenten, Python-Umgebung, Ollama, Playwright
#   ./scripts/setup-ki-tools.sh --all        # zusaetzlich Desktop-Apps und lokale Modelle
#   ./scripts/setup-ki-tools.sh --desktop    # nur die Desktop-Apps (Wispr Flow, Perplexity, ...)
#   ./scripts/setup-ki-tools.sh --dry-run    # nur anzeigen, nichts installieren
#
set -eo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KI_VENV="${KI_VENV:-$HOME/.ki-tools/venv}"
OLLAMA_MODELS="${OLLAMA_MODELS:-llama3.2 qwen2.5-coder:7b}"
PLAYWRIGHT_BROWSERS="${PLAYWRIGHT_BROWSERS:-chromium}"

DO_CLI=0
DO_PYTHON=0
DO_DESKTOP=0
DO_PLAYWRIGHT=0
DO_MODELS=0
DRY_RUN=0
FAILED_COUNT=0
FAILED_LIST=""

# ---------------------------------------------------------------- Ausgabe ---

BOLD=""; DIM=""; GREEN=""; YELLOW=""; RED=""; RESET=""
if [ -t 1 ]; then
  BOLD="$(printf '\033[1m')"; DIM="$(printf '\033[2m')"; GREEN="$(printf '\033[32m')"
  YELLOW="$(printf '\033[33m')"; RED="$(printf '\033[31m')"; RESET="$(printf '\033[0m')"
fi

section() { printf '\n%s==> %s%s\n' "$BOLD" "$1" "$RESET"; }
info()    { printf '    %s\n' "$1"; }
ok()      { printf '    %s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
skip()    { printf '    %s·%s %s\n' "$DIM" "$RESET" "$1"; }
warn()    { printf '    %s!%s %s\n' "$YELLOW" "$RESET" "$1"; }
fail() {
  printf '    %s✗%s %s\n' "$RED" "$RESET" "$1"
  FAILED_COUNT=$((FAILED_COUNT + 1))
  FAILED_LIST="${FAILED_LIST}    - $1"$'\n'
}

have() { command -v "$1" >/dev/null 2>&1; }

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '    %s[dry-run]%s %s\n' "$DIM" "$RESET" "$*"
    return 0
  fi
  "$@"
}

usage() {
  cat <<'EOF'
setup-ki-tools.sh — installiert die KI-Werkzeuge fuer move-in2stay.

Aufruf:
  ./scripts/setup-ki-tools.sh [Optionen]

Ohne Optionen: CLI-Agenten, Python-Umgebung, Ollama und Playwright.

Optionen:
  --cli        CLI-Agenten (Claude Code, Codex, Gemini CLI, Kimi CLI)
  --python     Python-Umgebung mit KI-SDKs und lokalem Whisper
  --desktop    Desktop-Apps (Wispr Flow, Perplexity, Claude, ChatGPT, LM Studio, Ollama)
  --playwright Playwright samt Browsern fuer automatisierte Klicktests
  --models     lokale Ollama-Modelle herunterladen (mehrere GB!)
  --all        alle Gruppen
  --dry-run    nur anzeigen, was passieren wuerde
  -h, --help   diese Hilfe

Umgebungsvariablen:
  KI_VENV              Pfad der Python-Umgebung (Standard: ~/.ki-tools/venv)
  OLLAMA_MODELS        Modelle fuer --models (Standard: "llama3.2 qwen2.5-coder:7b")
  PLAYWRIGHT_BROWSERS  Browser fuer --playwright (Standard: chromium)
EOF
}

# ----------------------------------------------------------------- System ---

detect_os() {
  case "$(uname -s)" in
    Darwin) OS=macos ;;
    Linux)  OS=linux ;;
    *)      OS=unsupported ;;
  esac
}

pkg_install() {
  # Installiert ein System-Paket ueber den jeweiligen Paketmanager.
  local pkg="$1"
  case "$OS" in
    macos)
      have brew || { fail "Homebrew fehlt – siehe https://brew.sh"; return 1; }
      run brew install "$pkg"
      ;;
    linux)
      if have apt-get; then
        if [ "$(id -u)" -eq 0 ]; then
          run apt-get install -y "$pkg"
        elif have sudo; then
          run sudo apt-get install -y "$pkg"
        else
          fail "$pkg braucht root-Rechte (kein sudo gefunden)"; return 1
        fi
      else
        fail "$pkg bitte manuell installieren (kein apt-get gefunden)"; return 1
      fi
      ;;
    *) fail "$pkg: Betriebssystem nicht unterstuetzt"; return 1 ;;
  esac
}

check_prereqs() {
  section "Voraussetzungen pruefen"
  info "Betriebssystem: $OS"

  if have node; then
    local major
    major="$(node -p 'process.versions.node.split(".")[0]')"
    if [ "$major" -ge 20 ]; then
      ok "Node.js $(node -v)"
    else
      warn "Node.js $(node -v) ist zu alt – die CLI-Agenten brauchen Node 20+"
    fi
  else
    fail "Node.js fehlt – https://nodejs.org (LTS) oder 'brew install node'"
  fi

  if have python3; then
    ok "Python $(python3 -V 2>&1 | awk '{print $2}')"
  else
    fail "Python 3 fehlt – 'brew install python' bzw. 'apt-get install python3'"
  fi

  if [ "$OS" = macos ] && ! have brew; then
    warn "Homebrew fehlt – Desktop-Apps und ffmpeg lassen sich nicht installieren"
    info "Installation: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
  fi
}

# ------------------------------------------------------------ CLI-Agenten ---

npm_global_install() {
  local pkg="$1" bin="$2"
  if have "$bin"; then
    skip "$bin ist bereits installiert ($pkg)"
    return 0
  fi
  if ! have npm; then
    fail "$pkg: npm fehlt"
    return 1
  fi
  if run npm install -g "$pkg"; then
    ok "$pkg installiert"
  else
    fail "$pkg konnte nicht installiert werden"
    info "Tipp bei Rechte-Fehlern: npm config set prefix ~/.npm-global && export PATH=\$HOME/.npm-global/bin:\$PATH"
  fi
}

install_uv() {
  # uv ist der von Moonshot empfohlene Installer fuer die Kimi CLI.
  if have uv; then
    skip "uv ist bereits installiert"
    return 0
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '    %s[dry-run]%s curl -LsSf https://astral.sh/uv/install.sh | sh\n' "$DIM" "$RESET"
    return 0
  fi
  if curl -LsSf https://astral.sh/uv/install.sh | sh; then
    export PATH="$HOME/.local/bin:$PATH"
    ok "uv installiert"
  else
    fail "uv konnte nicht installiert werden (https://docs.astral.sh/uv/)"
    return 1
  fi
}

install_cli_agents() {
  section "CLI-Agenten"
  npm_global_install "@anthropic-ai/claude-code" claude
  npm_global_install "@openai/codex" codex
  npm_global_install "@google/gemini-cli" gemini

  if have kimi; then
    skip "Kimi CLI ist bereits installiert"
  elif install_uv; then
    if run uv tool install --python 3.13 kimi-cli; then
      ok "Kimi CLI installiert"
    else
      fail "Kimi CLI konnte nicht installiert werden"
    fi
  fi
}

# ----------------------------------------------------- Python-KI-Umgebung ---

install_python_env() {
  section "Python-Umgebung fuer KI-SDKs und Whisper"
  local req="$REPO_ROOT/requirements-ai.txt"

  if [ ! -f "$req" ]; then
    fail "requirements-ai.txt nicht gefunden ($req)"
    return 1
  fi
  if ! have python3; then
    fail "Python 3 fehlt"
    return 1
  fi

  if [ ! -d "$KI_VENV" ]; then
    run mkdir -p "$(dirname "$KI_VENV")"
    if run python3 -m venv "$KI_VENV"; then
      ok "virtuelle Umgebung angelegt: $KI_VENV"
    else
      fail "venv konnte nicht angelegt werden (evtl. 'apt-get install python3-venv')"
      return 1
    fi
  else
    skip "virtuelle Umgebung existiert: $KI_VENV"
  fi

  if run "$KI_VENV/bin/python" -m pip install --quiet --upgrade pip &&
     run "$KI_VENV/bin/python" -m pip install --quiet -r "$req"; then
    ok "KI-Pakete installiert (anthropic, openai, google-genai, faster-whisper, ...)"
    info "Aktivieren mit: source $KI_VENV/bin/activate"
  else
    fail "Python-Pakete konnten nicht installiert werden"
  fi

  # ffmpeg wird von Whisper zum Dekodieren der Audiodateien gebraucht.
  if have ffmpeg; then
    skip "ffmpeg ist bereits installiert"
  else
    pkg_install ffmpeg && ok "ffmpeg installiert"
  fi
}

# ------------------------------------------------------------ Lokale LLMs ---

install_ollama() {
  section "Ollama (lokale Modelle – ohne API-Kosten, Daten bleiben im Haus)"
  if have ollama; then
    skip "Ollama ist bereits installiert ($(ollama --version 2>/dev/null | head -1))"
  else
    case "$OS" in
      macos) pkg_install ollama && ok "Ollama installiert" ;;
      linux)
        if [ "$DRY_RUN" -eq 1 ]; then
          printf '    %s[dry-run]%s curl -fsSL https://ollama.com/install.sh | sh\n' "$DIM" "$RESET"
        elif curl -fsSL https://ollama.com/install.sh | sh; then
          ok "Ollama installiert"
        else
          fail "Ollama konnte nicht installiert werden (https://ollama.com/download)"
          return 1
        fi
        ;;
      *) fail "Ollama: Betriebssystem nicht unterstuetzt"; return 1 ;;
    esac
  fi

  if [ "$DO_MODELS" -eq 1 ]; then
    for model in $OLLAMA_MODELS; do
      info "lade Modell $model (kann mehrere GB gross sein) ..."
      run ollama pull "$model" && ok "Modell $model bereit"
    done
  else
    info "Modelle holen mit: ollama pull llama3.2   (oder --models beim Setup)"
  fi
}

# ------------------------------------------------------------- Playwright ---

install_playwright() {
  section "Playwright (Browser-Automatisierung fuer Tests und KI-Agenten)"
  if ! have npm; then
    fail "Playwright: npm fehlt"
    return 1
  fi

  # Playwright steckt als devDependency im Projekt – ohne node_modules geht nichts.
  if [ ! -d "$REPO_ROOT/node_modules/@playwright/test" ]; then
    info "installiere die Projekt-Abhaengigkeiten ..."
    if ! run npm --prefix "$REPO_ROOT" install; then
      fail "npm install im Projekt fehlgeschlagen"
      return 1
    fi
  else
    skip "@playwright/test ist bereits im Projekt installiert"
  fi

  # Unter Linux brauchen die Browser Systembibliotheken – das geht nur mit
  # root-Rechten. Auf macOS ist nichts weiter noetig.
  if [ "$OS" = linux ]; then
    if [ "$(id -u)" -eq 0 ]; then
      run npx --prefix "$REPO_ROOT" playwright install-deps $PLAYWRIGHT_BROWSERS ||
        warn "Systembibliotheken fuer Playwright fehlen moeglicherweise"
    elif have sudo; then
      run sudo npx --prefix "$REPO_ROOT" playwright install-deps $PLAYWRIGHT_BROWSERS ||
        warn "Systembibliotheken fuer Playwright fehlen moeglicherweise"
    else
      warn "ohne sudo koennen die Systembibliotheken nicht installiert werden"
      info "spaeter nachholen mit: sudo npx playwright install-deps"
    fi
  fi

  if run npx --prefix "$REPO_ROOT" playwright install $PLAYWRIGHT_BROWSERS; then
    ok "Playwright-Browser installiert ($PLAYWRIGHT_BROWSERS)"
    info "Test starten mit: npm run test:e2e"
  else
    fail "Playwright-Browser konnten nicht installiert werden"
  fi
}

# ----------------------------------------------------------- Desktop-Apps ---

install_desktop_apps() {
  section "Desktop-Apps"
  if [ "$OS" != macos ]; then
    warn "Automatische Installation gibt es nur auf macOS. Direkte Downloads:"
    info "Wispr Flow (Diktieren) ... https://wisprflow.ai/"
    info "Perplexity .............. https://www.perplexity.ai/personal-computer"
    info "Claude Desktop .......... https://claude.com/download"
    info "ChatGPT Desktop ......... https://chatgpt.com/download"
    info "LM Studio ............... https://lmstudio.ai/"
    info "Ollama .................. https://ollama.com/download"
    return 0
  fi
  if ! have brew; then
    fail "Homebrew fehlt – Desktop-Apps koennen nicht installiert werden"
    return 1
  fi

  local casks="wispr-flow perplexity claude chatgpt lm-studio ollama-app"
  for cask in $casks; do
    if brew list --cask "$cask" >/dev/null 2>&1; then
      skip "$cask ist bereits installiert"
    elif run brew install --cask "$cask"; then
      ok "$cask installiert"
    else
      fail "$cask konnte nicht installiert werden"
    fi
  done
  info "Wispr Flow braucht nach dem Start die Rechte fuer Mikrofon und Bedienungshilfen."
}

# -------------------------------------------------------------- Abschluss ---

print_summary() {
  section "Zusammenfassung"
  if [ "$FAILED_COUNT" -gt 0 ]; then
    warn "$FAILED_COUNT Punkt(e) haben nicht geklappt:"
    printf '%s' "$FAILED_LIST"
  else
    ok "Alles durchgelaufen."
  fi

  cat <<EOF

  API-Keys hinterlegen (einmalig, z. B. in ~/.zshrc):

    export ANTHROPIC_API_KEY=...    # https://console.anthropic.com/settings/keys
    export OPENAI_API_KEY=...       # https://platform.openai.com/api-keys
    export GEMINI_API_KEY=...       # https://aistudio.google.com/apikey
    export MOONSHOT_API_KEY=...     # https://platform.moonshot.ai/console/api-keys
    export PERPLEXITY_API_KEY=...   # https://www.perplexity.ai/account/api/keys

  Fuer die Website die Datei .env.example nach .env.local kopieren und ausfuellen.
  Details und Kostenuebersicht: docs/KI-SOFTWARE.md
EOF
}

# ------------------------------------------------------------------ Main ---

main() {
  if [ $# -eq 0 ]; then
    DO_CLI=1; DO_PYTHON=1; DO_PLAYWRIGHT=1
  fi
  while [ $# -gt 0 ]; do
    case "$1" in
      --cli)     DO_CLI=1 ;;
      --python)  DO_PYTHON=1 ;;
      --desktop) DO_DESKTOP=1 ;;
      --playwright) DO_PLAYWRIGHT=1 ;;
      --models)  DO_MODELS=1 ;;
      --all)     DO_CLI=1; DO_PYTHON=1; DO_DESKTOP=1; DO_PLAYWRIGHT=1; DO_MODELS=1 ;;
      --dry-run) DRY_RUN=1 ;;
      -h|--help) usage; exit 0 ;;
      *) printf 'Unbekannte Option: %s\n\n' "$1"; usage; exit 1 ;;
    esac
    shift
  done

  detect_os
  if [ "$OS" = unsupported ]; then
    printf '%sDieses Skript laeuft nur auf macOS und Linux.%s\n' "$RED" "$RESET"
    printf 'Unter Windows bitte WSL2 nutzen oder die Links in docs/KI-SOFTWARE.md.\n'
    exit 1
  fi
  [ "$DRY_RUN" -eq 1 ] && warn "dry-run: es wird nichts wirklich installiert"

  check_prereqs
  [ "$DO_CLI" -eq 1 ] && install_cli_agents
  [ "$DO_PYTHON" -eq 1 ] && install_python_env
  { [ "$DO_CLI" -eq 1 ] || [ "$DO_MODELS" -eq 1 ]; } && install_ollama
  [ "$DO_PLAYWRIGHT" -eq 1 ] && install_playwright
  [ "$DO_DESKTOP" -eq 1 ] && install_desktop_apps
  print_summary

  [ "$FAILED_COUNT" -eq 0 ]
}

main "$@"
