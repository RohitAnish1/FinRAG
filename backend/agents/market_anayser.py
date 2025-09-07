import pandas as pd
import os
from datetime import datetime, timedelta

def analyze_performance(period_days: int = 90, top_n: int = 5, max_price: float | None = None):
    """
    Analyzes stock performance with an optional max price filter.

    Args:
        period_days (int): The number of days to look back.
        top_n (int): The number of top stocks to return.
        max_price (float | None): An optional filter for the stock's latest price.

    Returns:
        A list of tuples, where each tuple is (ticker, percentage_change).
    """
    try:
        SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
        BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
        DATA_DIR = os.path.join(BACKEND_ROOT, "data", "stock_data")

        if not os.path.isdir(DATA_DIR):
            return None

        end_date = datetime.now()
        start_date = end_date - timedelta(days=period_days)
        
        results = []
        print(f"Analyzing performance for all stocks from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}...")

        for filename in os.listdir(DATA_DIR):
            if filename.endswith(".csv"):
                ticker = filename.replace('.csv', '')
                file_path = os.path.join(DATA_DIR, filename)
                df = pd.read_csv(file_path, parse_dates=['Date'])
                df = df.sort_values('Date')
                
                start_row = df[df['Date'] >= start_date.strftime('%Y-%m-%d')].head(1)
                end_row = df[df['Date'] <= end_date.strftime('%Y-%m-%d')].tail(1)
                
                if not start_row.empty and not end_row.empty:
                    start_price = start_row['Close'].iloc[0]
                    latest_price = end_row['Close'].iloc[0]
                    
                    # --- NEW: Price Filter Logic ---
                    if max_price is not None and latest_price > max_price:
                        continue # Skip this stock if it's over the price limit

                    if start_price > 0:
                        percentage_change = ((latest_price - start_price) / start_price) * 100
                        results.append((ticker, percentage_change))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_n]

    except Exception as e:
        print(f"An error occurred during market analysis: {e}")
        return None

