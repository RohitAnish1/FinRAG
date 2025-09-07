import pandas as pd
import json
import os
from sentence_transformers import SentenceTransformer
import torch
from tqdm import tqdm
import re
# The 'use_safetensors=True' is a new, important parameter
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import numpy as np

# --- Ticker Map for Entity Recognition ---
TICKER_MAP = {
    'adani enterprises': 'ADANIENT.NS', 'adani ports': 'ADANIPORTS.NS', 'apollo hospitals': 'APOLLOHOSP.NS',
    'asian paints': 'ASIANPAINT.NS', 'axis bank': 'AXISBANK.NS', 'bajaj auto': 'BAJAJ-AUTO.NS',
    'bajaj finance': 'BAJFINANCE.NS', 'bajaj finserv': 'BAJAJFINSV.NS', 'bharat petroleum': 'BPCL.NS',
    'bharti airtel': 'BHARTIARTL.NS', 'britannia': 'BRITANNIA.NS', 'cipla': 'CIPLA.NS',
    'coal india': 'COALINDIA.NS', 'divis laboratories': 'DIVISLAB.NS', "dr. reddy's laboratories": 'DRREDDY.NS',
    'eicher motors': 'EICHERMOT.NS', 'grasim': 'GRASIM.NS', 'hcl technologies': 'HCLTECH.NS',
    'hdfc bank': 'HDFCBANK.NS', 'hdfc life': 'HDFCLIFE.NS', 'hero motocorp': 'HEROMOTOCO.NS',
    'hindalco': 'HINDALCO.NS', 'hindustan unilever': 'HINDUNILVR.NS', 'icici bank': 'ICICIBANK.NS',
    'itc': 'ITC.NS', 'indusind bank': 'INDUSINDBK.NS', 'infosys': 'INFY.NS', 'jsw steel': 'JSWSTEEL.NS',
    'kotak mahindra bank': 'KOTAKBANK.NS', 'larsen & toubro': 'LT.NS', 'ltimindtree': 'LTIM.NS',
    'mahindra & mahindra': 'M&M.NS', 'maruti suzuki': 'MARUTI.NS', 'ntpc': 'NTPC.NS',
    'nestle india': 'NESTLEIND.NS', 'ongc': 'ONGC.NS', 'power grid': 'POWERGRID.NS',
    'reliance industries': 'RELIANCE.NS', 'reliance': 'RELIANCE.NS', 'sbi life': 'SBILIFE.NS',
    'state bank of india': 'SBIN.NS', 'sun pharma': 'SUNPHARMA.NS', 'tata consultancy services': 'TCS.NS',
    'tata consumer products': 'TATACONSUM.NS', 'tata motors': 'TATAMOTORS.NS', 'tata steel': 'TATASTEEL.NS',
    'tech mahindra': 'TECHM.NS', 'titan': 'TITAN.NS', 'ultratech cement': 'ULTRACEMCO.NS',
    'wipro': 'WIPRO.NS', 'shree cement': 'SHREECEM.NS'
}

def find_tickers_in_text(text: str) -> list:
    found_tickers = set()
    text_lower = text.lower()
    for name, ticker in TICKER_MAP.items():
        if re.search(r'\b' + re.escape(name) + r'\b', text_lower):
            found_tickers.add(ticker)
    return list(found_tickers)

def get_sentiment(texts: list, tokenizer, model, device='cpu') -> list:
    """Calculates sentiment scores for a list of texts and returns a list of scores."""
    if not texts or all(t is None or t.strip() == '' for t in texts):
        return [0.0] * len(texts)
    
    inputs = tokenizer(texts, padding=True, truncation=True, return_tensors='pt', max_length=512).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=-1)
    
    positive_scores = scores[:, 0]
    negative_scores = scores[:, 1]
    sentiment_scores = positive_scores - negative_scores
    
    return sentiment_scores.cpu().numpy().tolist()

def load_news_data(news_dir: str) -> pd.DataFrame:
    """Loads all news JSON files, finds mentioned tickers, and returns a DataFrame."""
    all_articles = []
    print(f"Searching for news files in: {news_dir}")
    for filename in os.listdir(news_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(news_dir, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                news_data = json.load(f)
                for article in news_data:
                    tickers = find_tickers_in_text(article['title']) # Focus on title for relevance
                    if tickers:
                        for ticker in tickers:
                            all_articles.append({
                                'Date': pd.to_datetime(article['publish_timestamp']).strftime('%Y-%m-%d'),
                                'Ticker': ticker,
                                'text': article['title']
                            })
    print(f"Found {len(all_articles)} news articles mentioning tracked stocks.")
    return pd.DataFrame(all_articles)

def load_market_data(market_dir: str) -> pd.DataFrame:
    """Loads and combines all featured market data CSVs into one DataFrame."""
    all_market_data = []
    for filename in os.listdir(market_dir):
        if filename.endswith(".csv"):
            file_path = os.path.join(market_dir, filename)
            df = pd.read_csv(file_path, parse_dates=['Date'])
            df['Ticker'] = filename.replace('.csv', '')
            all_market_data.append(df)
    combined_df = pd.concat(all_market_data, ignore_index=True)
    print(f"Loaded data for {len(all_market_data)} stocks, with {len(combined_df)} total daily records.")
    return combined_df

def align_and_merge_data():
    """Main function to run the data alignment and merging pipeline."""
    # --- Configuration ---
    SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
    BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
    MARKET_DATA_DIR = os.path.join(BACKEND_ROOT, "data", "featured_data")
    NEWS_DATA_DIR = os.path.join(BACKEND_ROOT, "data", "raw_news")
    OUTPUT_FILE = os.path.join(BACKEND_ROOT, "data", "combined_ml_dataset.csv")

    # --- 1. Setup Models ---
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    print("Loading FinBERT sentiment model (using safetensors)...")
    sentiment_tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
    # --- THIS IS THE KEY CHANGE ---
    sentiment_model = AutoModelForSequenceClassification.from_pretrained(
        "ProsusAI/finbert", 
        use_safetensors=True
    ).to(device)

    print("Loading sentence embedding model...")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

    # --- 2. Load and Process News Data ---
    news_df = load_news_data(NEWS_DATA_DIR)
    if news_df.empty:
        print("Warning: No relevant news found. Proceeding with market data only.")
        daily_news_df = pd.DataFrame(columns=['Date', 'Ticker', 'sentiment_mean', 'sentiment_max', 'sentiment_min'] + [f'embed_{i}' for i in range(384)])
    else:
        print(f"Calculating sentiment for {len(news_df)} news snippets...")
        news_df['sentiment'] = get_sentiment(news_df['text'].tolist(), sentiment_tokenizer, sentiment_model, device)

        print(f"Embedding {len(news_df)} news snippets...")
        embeddings = embedding_model.encode(news_df['text'].tolist(), show_progress_bar=True, device=device)
        embedding_df = pd.DataFrame(embeddings, columns=[f'embed_{i}' for i in range(embeddings.shape[1])])
        
        news_df = pd.concat([news_df.reset_index(drop=True), embedding_df], axis=1)

        # Aggregate news data by day and ticker
        daily_news_df = news_df.groupby(['Date', 'Ticker']).agg(
            sentiment_mean=('sentiment', 'mean'),
            sentiment_max=('sentiment', 'max'),
            sentiment_min=('sentiment', 'min'),
            **{f'embed_{i}': (f'embed_{i}', 'mean') for i in range(embeddings.shape[1])}
        ).reset_index()
        print(f"Processed news data, resulting in {len(daily_news_df)} daily records with embeddings and sentiment.")

    # --- 3. Load Market Data ---
    print("\nLoading and combining all market data...")
    market_df = load_market_data(MARKET_DATA_DIR)
    market_df['Date'] = market_df['Date'].dt.strftime('%Y-%m-%d') # Standardize date format for merging

    # --- 4. Merge Data ---
    print("\nMerging market and news data...")
    combined_df = pd.merge(market_df, daily_news_df, on=['Date', 'Ticker'], how='left')
    
    # Fill missing news/sentiment with 0 (meaning no news)
    fill_cols = [col for col in combined_df.columns if 'embed_' in col or 'sentiment_' in col]
    combined_df[fill_cols] = combined_df[fill_cols].fillna(0)
    print("Merge complete. Filled missing news/sentiment data with zeros.")
    
    combined_df = combined_df.copy() # De-fragment

    # --- 5. Create Target Variable ---
    print("\nCreating the target variable (next-day price movement)...")
    combined_df = combined_df.sort_values(by=['Ticker', 'Date'])
    combined_df['Next_Close'] = combined_df.groupby('Ticker')['Close'].shift(-1)
    combined_df['Target'] = (combined_df['Next_Close'] > combined_df['Close']).astype(int)
    combined_df.dropna(subset=['Next_Close'], inplace=True)
    combined_df.drop(columns=['Next_Close'], inplace=True)
    print("Target variable created.")

    # --- 6. Save Final Dataset ---
    combined_df.to_csv(OUTPUT_FILE, index=False)
    print(f"\n✅ Final combined dataset created successfully!")
    print(f"  -> Shape of the dataset: {combined_df.shape}")
    print(f"  -> Saved to: {OUTPUT_FILE}")

if __name__ == '__main__':
    align_and_merge_data()

