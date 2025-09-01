import yfinance as yf
import pandas as pd
import os

STOCKS = {
    "RELIANCE.NS": "Reliance",
    "TCS.NS": "TCS",
    "INFY.NS": "Infosys",
    "ITC.NS": "ITC",
    "HDFCBANK.NS": "HDFC Bank",
}

OUTPUT_DIR = "data/stock_data/"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def calculate_indicators(df):
    df["RSI"] = df["Close"].rolling(window=14).mean()
    df["Returns"] = df["Close"].pct_change() * 100
    df["Perf"] = df["Close"].pct_change(periods=5) * 100
    return df

def fetch():
    for ticker, name in STOCKS.items():
        stock = yf.download(ticker, period="1mo", interval="1d")
        if stock.empty: continue
        stock = calculate_indicators(stock)
        stock.to_csv(os.path.join(OUTPUT_DIR, f"{name}.csv"))

if __name__ == "__main__":
    fetch()