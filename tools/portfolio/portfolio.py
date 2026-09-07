#!/usr/bin/env python3
"""Portfolio-Toolkit fuer Aktien und ETFs.

Befehle:
  fetch      Kurse und Wechselkurse von Yahoo Finance laden und lokal cachen
  report     Bestand, Wert, Gewinn/Verlust, Gewichtung vs. Ziel
  risk       Volatilitaet, Sharpe, Max Drawdown, Beta, Korrelationen
  rebalance  Kauf-/Verkaufsvorschlaege, um die Zielgewichtung zu erreichen
  dividends  Dividenden der letzten 12 Monate je Position

Beispiele:
  python portfolio.py fetch --period 5y
  python portfolio.py report
  python portfolio.py risk --benchmark ^GDAXI
  python portfolio.py rebalance --cash 2000
"""

from __future__ import annotations

import argparse
import sys
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
DATA_DIR = HERE / "data"
PRICES_FILE = DATA_DIR / "prices.csv"
FX_FILE = DATA_DIR / "fx.csv"
DIVIDENDS_FILE = DATA_DIR / "dividends.csv"
DEFAULT_PORTFOLIO = HERE / "portfolio.csv"

TRADING_DAYS = 252


# ---------------------------------------------------------------------------
# Laden und Vorbereiten
# ---------------------------------------------------------------------------


def load_portfolio(path: Path) -> pd.DataFrame:
    required = {"ticker", "name", "type", "shares", "avg_cost", "currency", "target_weight"}
    df = pd.read_csv(path, dtype={"ticker": str, "name": str, "type": str, "currency": str})
    missing = required - set(df.columns)
    if missing:
        sys.exit(f"portfolio.csv: fehlende Spalten {sorted(missing)}")
    df["ticker"] = df["ticker"].str.strip()
    df["currency"] = df["currency"].str.strip()
    df["shares"] = pd.to_numeric(df["shares"], errors="coerce").fillna(0.0)
    df["avg_cost"] = pd.to_numeric(df["avg_cost"], errors="coerce").fillna(0.0)
    df["target_weight"] = pd.to_numeric(df["target_weight"], errors="coerce").fillna(0.0)
    if df["ticker"].duplicated().any():
        dupes = df.loc[df["ticker"].duplicated(), "ticker"].tolist()
        sys.exit(f"portfolio.csv: doppelte Ticker {dupes}")
    return df.set_index("ticker")


def fx_ticker(currency: str, base: str) -> str:
    return f"{currency}{base}=X"


def normalize_currency(currency: str) -> tuple[str, float]:
    """Liefert (ISO-Waehrung, Faktor). GBp/ZAc werden in Pence notiert."""
    if currency in ("GBp", "GBX"):
        return "GBP", 0.01
    if currency == "ZAc":
        return "ZAR", 0.01
    return currency, 1.0


def load_cache(base: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    if not PRICES_FILE.exists():
        sys.exit(
            "Kein Kurs-Cache gefunden. Erst `python portfolio.py fetch` ausfuehren "
            "(braucht Internetzugang zu Yahoo Finance)."
        )
    prices = pd.read_csv(PRICES_FILE, index_col=0, parse_dates=True).sort_index()
    if FX_FILE.exists():
        fx = pd.read_csv(FX_FILE, index_col=0, parse_dates=True).sort_index()
    else:
        fx = pd.DataFrame(index=prices.index)
    fx[base] = 1.0
    return prices, fx


def to_base(prices: pd.DataFrame, fx: pd.DataFrame, portfolio: pd.DataFrame, base: str) -> pd.DataFrame:
    """Kurse aller Positionen in die Basiswaehrung umrechnen."""
    fx = fx.reindex(prices.index).ffill().bfill()
    out = pd.DataFrame(index=prices.index)
    for ticker, row in portfolio.iterrows():
        if ticker not in prices.columns:
            print(f"Warnung: keine Kurse fuer {ticker} im Cache, Position wird ignoriert.", file=sys.stderr)
            continue
        iso, factor = normalize_currency(row["currency"])
        if iso not in fx.columns:
            sys.exit(f"Kein Wechselkurs {iso}->{base} im Cache. `fetch` erneut ausfuehren.")
        out[ticker] = prices[ticker] * factor * fx[iso]
    return out.dropna(how="all")


def cost_in_base(portfolio: pd.DataFrame, fx: pd.DataFrame, base: str) -> pd.Series:
    """Einstandskosten je Position in Basiswaehrung, zum aktuellen Wechselkurs."""
    latest_fx = fx.ffill().iloc[-1]
    cost = {}
    for ticker, row in portfolio.iterrows():
        iso, factor = normalize_currency(row["currency"])
        rate = latest_fx.get(iso, np.nan)
        cost[ticker] = row["shares"] * row["avg_cost"] * factor * rate
    return pd.Series(cost, name="cost")


# ---------------------------------------------------------------------------
# Befehle
# ---------------------------------------------------------------------------


def cmd_fetch(args: argparse.Namespace) -> None:
    try:
        import yfinance as yf
    except ImportError:
        sys.exit("yfinance fehlt: pip install -r requirements.txt")

    portfolio = load_portfolio(args.portfolio)
    tickers = list(portfolio.index)
    if args.benchmark and args.benchmark not in tickers:
        tickers.append(args.benchmark)

    currencies = sorted({normalize_currency(c)[0] for c in portfolio["currency"]} - {args.base})
    fx_tickers = [fx_ticker(c, args.base) for c in currencies]

    print(f"Lade Kurse fuer {len(tickers)} Ticker, Zeitraum {args.period} ...")
    raw = yf.download(tickers, period=args.period, auto_adjust=True, progress=False, group_by="column")
    prices = raw["Close"] if isinstance(raw.columns, pd.MultiIndex) else raw[["Close"]].rename(columns={"Close": tickers[0]})
    prices = prices.dropna(how="all")
    missing = [t for t in tickers if t not in prices.columns or prices[t].dropna().empty]
    if missing:
        print(f"Warnung: keine Daten fuer {missing}", file=sys.stderr)

    DATA_DIR.mkdir(exist_ok=True)
    prices.to_csv(PRICES_FILE)
    print(f"Kurse gespeichert: {PRICES_FILE} ({len(prices)} Tage, bis {prices.index[-1].date()})")

    if fx_tickers:
        print(f"Lade Wechselkurse {currencies} -> {args.base} ...")
        raw_fx = yf.download(fx_tickers, period=args.period, auto_adjust=True, progress=False, group_by="column")
        fx = raw_fx["Close"] if isinstance(raw_fx.columns, pd.MultiIndex) else raw_fx[["Close"]].rename(columns={"Close": fx_tickers[0]})
        fx = fx.rename(columns={fx_ticker(c, args.base): c for c in currencies})
        fx.to_csv(FX_FILE)
        print(f"Wechselkurse gespeichert: {FX_FILE}")
    elif FX_FILE.exists():
        FX_FILE.unlink()


def build_report(portfolio: pd.DataFrame, prices: pd.DataFrame, fx: pd.DataFrame, base: str) -> pd.DataFrame:
    values = to_base(prices, fx, portfolio, base)
    latest = values.ffill().iloc[-1]
    latest_local = prices.ffill().iloc[-1]
    held = portfolio.loc[[t for t in portfolio.index if t in latest.index]].copy()

    held["price"] = latest_local.reindex(held.index)
    held["value"] = held["shares"] * latest.reindex(held.index)
    held["cost"] = cost_in_base(held, fx, base)
    held["pnl"] = held["value"] - held["cost"]
    held["pnl_pct"] = np.where(held["cost"] > 0, held["pnl"] / held["cost"] * 100, np.nan)
    total = held["value"].sum()
    held["weight"] = held["value"] / total * 100 if total else 0.0
    held["diff"] = held["weight"] - held["target_weight"]
    return held


def print_money_table(df: pd.DataFrame, cols: list[str], base: str) -> None:
    fmt = {
        "shares": "{:,.3f}".format,
        "price": "{:,.2f}".format,
        "value": "{:,.0f}".format,
        "cost": "{:,.0f}".format,
        "pnl": "{:+,.0f}".format,
        "pnl_pct": "{:+.1f}%".format,
        "weight": "{:.1f}%".format,
        "target_weight": "{:.1f}%".format,
        "diff": "{:+.1f}".format,
    }
    out = df[cols].rename(
        columns={
            "name": "Name",
            "type": "Typ",
            "shares": "Stueck",
            "price": "Kurs",
            "currency": "Whg",
            "value": f"Wert {base}",
            "cost": f"Einstand {base}",
            "pnl": f"G/V {base}",
            "pnl_pct": "G/V %",
            "weight": "Gewicht",
            "target_weight": "Ziel",
            "diff": "Abw.",
        }
    )
    renamed_fmt = {}
    for k, v in fmt.items():
        for old, new in zip(df[cols].columns, out.columns):
            if old == k:
                renamed_fmt[new] = v
    print(out.to_string(formatters=renamed_fmt, na_rep="-"))


def cmd_report(args: argparse.Namespace) -> None:
    portfolio = load_portfolio(args.portfolio)
    prices, fx = load_cache(args.base)
    rep = build_report(portfolio, prices, fx, args.base)

    as_of = prices.index[-1].date()
    print(f"\nPortfolio-Report (Stand {as_of}, Basiswaehrung {args.base})\n")
    print_money_table(
        rep,
        ["name", "type", "shares", "price", "currency", "value", "cost", "pnl", "pnl_pct", "weight", "target_weight", "diff"],
        args.base,
    )

    total_value, total_cost = rep["value"].sum(), rep["cost"].sum()
    pnl = total_value - total_cost
    pnl_pct = pnl / total_cost * 100 if total_cost else float("nan")
    print(f"\nGesamtwert:   {total_value:,.0f} {args.base}")
    print(f"Einstand:     {total_cost:,.0f} {args.base}")
    print(f"Gewinn/Verl.: {pnl:+,.0f} {args.base} ({pnl_pct:+.1f}%)")

    by_type = rep.groupby("type")[["value"]].sum()
    by_type["weight"] = by_type["value"] / total_value * 100
    print("\nAllokation nach Typ")
    print(by_type.rename(columns={"value": f"Wert {args.base}", "weight": "Gewicht"}).to_string(
        formatters={f"Wert {args.base}": "{:,.0f}".format, "Gewicht": "{:.1f}%".format}
    ))

    if args.csv:
        rep.to_csv(args.csv)
        print(f"\nReport exportiert: {args.csv}")


def drawdown(series: pd.Series) -> float:
    peak = series.cummax()
    return float(((series - peak) / peak).min())


def cmd_risk(args: argparse.Namespace) -> None:
    portfolio = load_portfolio(args.portfolio)
    prices, fx = load_cache(args.base)
    values = to_base(prices, fx, portfolio, args.base).ffill()
    if args.lookback:
        values = values.loc[values.index >= values.index[-1] - pd.Timedelta(days=args.lookback * 365)]
    returns = values.pct_change().dropna(how="all")
    if len(returns) < 20:
        sys.exit("Zu wenige Kursdaten fuer eine Risikoanalyse (mindestens 20 Handelstage).")

    rep = build_report(portfolio, prices, fx, args.base)
    weights = (rep["weight"] / 100).reindex(values.columns).fillna(0.0)
    port_ret = (returns.fillna(0.0) * weights).sum(axis=1)

    bench_ret = None
    if args.benchmark:
        if args.benchmark in prices.columns:
            bench_ret = prices[args.benchmark].ffill().reindex(returns.index).pct_change()
        else:
            print(f"Warnung: Benchmark {args.benchmark} nicht im Cache. `fetch --benchmark {args.benchmark}` ausfuehren.", file=sys.stderr)

    def stats(r: pd.Series, v: pd.Series) -> dict:
        r = r.dropna()
        ann_ret = float((1 + r).prod() ** (TRADING_DAYS / len(r)) - 1) if len(r) else np.nan
        ann_vol = float(r.std() * np.sqrt(TRADING_DAYS))
        sharpe = (ann_ret - args.rf) / ann_vol if ann_vol else np.nan
        beta = np.nan
        if bench_ret is not None:
            joined = pd.concat([r, bench_ret], axis=1).dropna()
            if len(joined) > 20 and joined.iloc[:, 1].var() > 0:
                beta = float(joined.cov().iloc[0, 1] / joined.iloc[:, 1].var())
        return {
            "Rendite p.a.": ann_ret * 100,
            "Vola p.a.": ann_vol * 100,
            "Sharpe": sharpe,
            "Max DD": drawdown(v.dropna()) * 100,
            "Beta": beta,
        }

    rows = {t: stats(returns[t], values[t]) for t in values.columns}
    rows["PORTFOLIO"] = stats(port_ret, (1 + port_ret).cumprod())
    table = pd.DataFrame(rows).T
    table.insert(0, "Gewicht", (weights * 100).reindex(table.index).fillna(100.0))

    span = f"{returns.index[0].date()} bis {returns.index[-1].date()}"
    print(f"\nRisikokennzahlen ({span}, risikofrei {args.rf*100:.1f}%)\n")
    print(table.to_string(
        formatters={
            "Gewicht": "{:.1f}%".format,
            "Rendite p.a.": "{:+.1f}%".format,
            "Vola p.a.": "{:.1f}%".format,
            "Sharpe": "{:.2f}".format,
            "Max DD": "{:.1f}%".format,
            "Beta": "{:.2f}".format,
        },
        na_rep="-",
    ))

    print("\nKorrelation der Tagesrenditen")
    print(returns.corr().round(2).to_string())

    contrib = (returns.fillna(0.0) * weights).std() * np.sqrt(TRADING_DAYS)
    contrib = contrib / contrib.sum() * 100 if contrib.sum() else contrib
    print("\nAnteil am Portfoliorisiko (naiv, ohne Korrelation)")
    print(contrib.sort_values(ascending=False).map("{:.1f}%".format).to_string())


def cmd_rebalance(args: argparse.Namespace) -> None:
    portfolio = load_portfolio(args.portfolio)
    prices, fx = load_cache(args.base)
    rep = build_report(portfolio, prices, fx, args.base)

    target_sum = rep["target_weight"].sum()
    if abs(target_sum - 100) > 0.01:
        print(f"Hinweis: Zielgewichte summieren sich auf {target_sum:.1f}%, werden auf 100% normiert.", file=sys.stderr)
    targets = rep["target_weight"] / target_sum if target_sum else rep["target_weight"]

    total = rep["value"].sum() + args.cash
    latest_base_price = rep["value"] / rep["shares"].replace(0, np.nan)
    latest_base_price = latest_base_price.fillna(
        to_base(prices, fx, portfolio, args.base).ffill().iloc[-1].reindex(rep.index)
    )

    plan = pd.DataFrame(index=rep.index)
    plan["name"] = rep["name"]
    plan["ist"] = rep["weight"]
    plan["ziel"] = targets * 100
    plan["zielwert"] = targets * total
    plan["delta"] = plan["zielwert"] - rep["value"]
    plan["stueck"] = plan["delta"] / latest_base_price
    if not args.fractional:
        plan["stueck"] = np.trunc(plan["stueck"])
        plan["delta"] = plan["stueck"] * latest_base_price
    plan.loc[plan["delta"].abs() < args.min_trade, ["delta", "stueck"]] = 0.0
    plan["aktion"] = np.select([plan["stueck"] > 0, plan["stueck"] < 0], ["KAUFEN", "VERKAUFEN"], "halten")

    print(f"\nRebalancing-Plan (Gesamt {total:,.0f} {args.base}, davon neu {args.cash:,.0f}, Mindestorder {args.min_trade:,.0f})\n")
    print(plan.rename(columns={
        "name": "Name", "ist": "Ist", "ziel": "Ziel", "zielwert": f"Zielwert {args.base}",
        "delta": f"Umsatz {args.base}", "stueck": "Stueck", "aktion": "Aktion",
    }).to_string(formatters={
        "Ist": "{:.1f}%".format, "Ziel": "{:.1f}%".format,
        f"Zielwert {args.base}": "{:,.0f}".format, f"Umsatz {args.base}": "{:+,.0f}".format,
        "Stueck": "{:+,.2f}".format if args.fractional else "{:+,.0f}".format,
    }))
    net = plan["delta"].sum()
    rest = args.cash - net
    print(f"\nNetto-Kapitaleinsatz: {net:+,.0f} {args.base}  (Restcash nach Plan: {rest:,.0f})")
    if rest < 0:
        print("Hinweis: Plan uebersteigt das verfuegbare Kapital leicht (Rundung auf ganze Stuecke). Eine Kauforder um ein Stueck kuerzen.")


def cmd_dividends(args: argparse.Namespace) -> None:
    try:
        import yfinance as yf
    except ImportError:
        sys.exit("yfinance fehlt: pip install -r requirements.txt")

    portfolio = load_portfolio(args.portfolio)
    _, fx = load_cache(args.base) if PRICES_FILE.exists() else (None, pd.DataFrame({args.base: [1.0]}))
    latest_fx = fx.ffill().iloc[-1]
    since = datetime.now() - timedelta(days=365)

    rows = []
    for ticker, row in portfolio.iterrows():
        divs = yf.Ticker(ticker).dividends
        if divs.empty:
            rows.append({"ticker": ticker, "name": row["name"], "zahlungen": 0, "je_stueck": 0.0, "summe": 0.0})
            continue
        divs.index = divs.index.tz_localize(None)
        recent = divs[divs.index >= since]
        iso, factor = normalize_currency(row["currency"])
        rate = latest_fx.get(iso, np.nan)
        per_share = float(recent.sum()) * factor
        rows.append({
            "ticker": ticker, "name": row["name"], "zahlungen": len(recent),
            "je_stueck": per_share, "summe": per_share * row["shares"] * rate,
        })

    table = pd.DataFrame(rows).set_index("ticker")
    DATA_DIR.mkdir(exist_ok=True)
    table.to_csv(DIVIDENDS_FILE)
    print(f"\nDividenden der letzten 12 Monate (in {args.base})\n")
    print(table.rename(columns={"name": "Name", "zahlungen": "Zahlungen", "je_stueck": "je Stueck (lokal)", "summe": f"Summe {args.base}"})
          .to_string(formatters={"je Stueck (lokal)": "{:.2f}".format, f"Summe {args.base}": "{:,.0f}".format}))
    print(f"\nGesamt: {table['summe'].sum():,.0f} {args.base}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--portfolio", type=Path, default=DEFAULT_PORTFOLIO, help="Pfad zur portfolio.csv")
    parser.add_argument("--base", default="EUR", help="Basiswaehrung (Standard: EUR)")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("fetch", help="Kurse und Wechselkurse laden")
    p.add_argument("--period", default="5y", help="Yahoo-Zeitraum, z.B. 1y, 5y, max")
    p.add_argument("--benchmark", default="^GDAXI", help="Benchmark-Ticker mitladen (leer = keiner)")
    p.set_defaults(func=cmd_fetch)

    p = sub.add_parser("report", help="Bestand und Gewinn/Verlust")
    p.add_argument("--csv", type=Path, help="Report zusaetzlich als CSV speichern")
    p.set_defaults(func=cmd_report)

    p = sub.add_parser("risk", help="Risikokennzahlen")
    p.add_argument("--benchmark", default="^GDAXI", help="Benchmark fuer Beta")
    p.add_argument("--rf", type=float, default=0.02, help="risikofreier Zins p.a. (Standard 0.02)")
    p.add_argument("--lookback", type=int, default=0, help="nur die letzten N Jahre betrachten (0 = alles)")
    p.set_defaults(func=cmd_risk)

    p = sub.add_parser("rebalance", help="Kauf-/Verkaufsplan")
    p.add_argument("--cash", type=float, default=0.0, help="zusaetzlich investierbares Kapital")
    p.add_argument("--min-trade", type=float, default=100.0, help="Orders unter diesem Betrag ignorieren")
    p.add_argument("--fractional", action="store_true", help="Bruchstuecke erlauben (Sparplan-Broker)")
    p.set_defaults(func=cmd_rebalance)

    p = sub.add_parser("dividends", help="Dividenden der letzten 12 Monate (braucht Internet)")
    p.set_defaults(func=cmd_dividends)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
