import yfinance as yf
import pandas as pd
import os
from typing import List, Optional
from datetime import datetime

# The composition of the NIFTY50 index changes over time.
# This list is as of late 2024/early 2025.
# For a real-world application, you might want to dynamically scrape this list.
NIFTY50_SYMBOLS = [
    "ADANIENT", "ADANIPORTS", "APOLLOHOSP", "ASIANPAINT", "AXISBANK",
    "BAJAJ-AUTO", "BAJFINANCE", "BAJAJFINSV", "BPCL", "BHARTIARTL",
    "BRITANNIA", "CIPLA", "COALINDIA", "DIVISLAB", "DRREDDY",
    "EICHERMOT", "GRASIM", "HCLTECH", "HDFCBANK", "HDFCLIFE",
    "HEROMOTOCO", "HINDALCO", "HINDUNILVR", "ICICIBANK", "ITC",
    "INDUSINDBK", "INFY", "JSWSTEEL", "KOTAKBANK", "LTIM",
    "LT", "M&M", "MARUTI", "NTPC", "NESTLEIND",
    "ONGC", "POWERGRID", "RELIANCE", "SBILIFE", "SBIN",
    "SUNPHARMA", "TCS", "TATACONSUM", "TATAMOTORS", "TATASTEEL",
    "TECHM", "TITAN", "ULTRACEMCO", "WIPRO", "SHREECEM"
]

def fetch_stock_data(ticker: str, start_date: str, end_date: str) -> Optional[pd.DataFrame]:
    """
    Fetches historical stock data (OHLCV) for a given ticker from Yahoo Finance.

    Args:
        ticker (str): The stock ticker symbol (e.g., "RELIANCE.NS").
        start_date (str): The start date for the data in 'YYYY-MM-DD' format.
        end_date (str): The end date for the data in 'YYYY-MM-DD' format.

    Returns:
        Optional[pd.DataFrame]: A pandas DataFrame with the stock data,
                                or None if fetching fails or no data is found.
    """
    try:
        stock = yf.Ticker(ticker)
        # Fetch historical data for the specified period
        data = stock.history(start=start_date, end=end_date)

        if data.empty:
            print(f"Warning: No data found for {ticker} in the specified date range.")
            return None

        # The columns are typically: Open, High, Low, Close, Volume, Dividends, Stock Splits
        # We are mostly interested in OHLCV.
        return data

    except Exception as e:
        print(f"Error fetching data for {ticker}: {e}")
        return None

if __name__ == "__main__":
    # --- Configuration ---
    # Define the date range for the historical data
    START_DATE = "2020-01-01"
    END_DATE = datetime.now().strftime('%Y-%m-%d') # Fetch data up to today

    # Define the output directory. The '..' moves up one level from 'ingestion' to 'backend'.
    OUTPUT_DIR = os.path.join("..", "data", "stock_data")

    # --- Execution ---
    # Ensure the output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Data will be saved in: {os.path.abspath(OUTPUT_DIR)}")

    # Loop through all the NIFTY50 symbols
    for symbol in NIFTY50_SYMBOLS:
        # Yahoo Finance requires '.NS' suffix for stocks listed on the National Stock Exchange of India
        ticker = f"{symbol}.NS"
        print(f"\nFetching data for {ticker}...")

        stock_df = fetch_stock_data(ticker, START_DATE, END_DATE)

        # If data was successfully fetched, save it to a CSV file
        if stock_df is not None:
            file_path = os.path.join(OUTPUT_DIR, f"{ticker}.csv")
            stock_df.to_csv(file_path)
            print(f"  -> Successfully saved data to {file_path}")
        else:
            print(f"  -> Skipping {ticker} due to an error or no data.")

    print("\n---------------------------------")
    print("Data fetching process complete.")
    print("---------------------------------")