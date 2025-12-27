import pandas as pd
import pandas_ta as ta
import os
from typing import Optional

def add_features(df: pd.DataFrame) -> Optional[pd.DataFrame]:
    """
    Adds a comprehensive set of technical analysis features to the stock data DataFrame.
    """
    try:
        # Flatten MultiIndex if present
        if isinstance(df.index, pd.MultiIndex):
            df = df.reset_index()
        # Create a new 'ta' strategy
        MyStrategy = ta.Strategy(
            name="Comprehensive Indicators",
            description="SMA, EMA, RSI, MACD, ATR, and OBV",
            ta=[
                {"kind": "sma", "length": 20},
                {"kind": "ema", "length": 50},
                {"kind": "rsi", "length": 14},
                {"kind": "macd", "fast": 12, "slow": 26, "signal": 9},
                # --- NEW: Add Volatility and Volume Indicators ---
                {"kind": "atr", "length": 14}, # Average True Range (Volatility)
                {"kind": "obv"}               # On-Balance Volume (Volume-based momentum)
            ]
        )
        # Apply the strategy to the DataFrame
        df.ta.strategy(MyStrategy)
        # Calculate daily return separately
        df['Daily_Return'] = (df['Close'] - df['Open']) / df['Open']
        # Drop rows with NaN values created by the indicators
        df.dropna(inplace=True)
        return df
    except Exception as e:
        print(f"  -> Error adding features: {e}")
        return None

if __name__ == "__main__":
    # --- Configuration ---
    # Use robust paths that work regardless of where the script is run from
    SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
    BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
    INPUT_DIR = os.path.join(BACKEND_ROOT, "data", "stock_data")
    OUTPUT_DIR = os.path.join(BACKEND_ROOT, "data", "featured_data")

    # --- Execution ---
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Reading raw data from: {INPUT_DIR}")
    print(f"Saving featured data to: {OUTPUT_DIR}")

    if not os.path.isdir(INPUT_DIR):
        print(f"Error: Input directory not found at {INPUT_DIR}. Please run the market_data_fetcher.py script.")
    else:
        for filename in os.listdir(INPUT_DIR):
            if filename.endswith(".csv"):
                file_path = os.path.join(INPUT_DIR, filename)
                stock_df = pd.read_csv(file_path)
                
                # Add features
                featured_df = add_features(stock_df)
                
                if featured_df is not None and not featured_df.empty:
                    output_path = os.path.join(OUTPUT_DIR, filename)
                    featured_df.to_csv(output_path, index=False)
                    print(f"  -> Processed {filename} | Added SMA, EMA, RSI, MACD, ATR, OBV")
                else:
                    print(f"  -> Skipping {filename} due to an error or no data after processing.")
        print("\n Feature generation process complete.")
