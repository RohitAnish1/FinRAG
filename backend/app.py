from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
import logging
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import re
import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
import xgboost as xgb

# --- Import Your Project Modules ---
from rag_pipeline import RAGPipeline
from agents.market_anayser import analyze_performance
from features.market_feature_generator import add_features
from data_processing.data_aligner import get_sentiment, TICKER_MAP
from models.predictor import get_latest_model_and_features, make_prediction

# --- Your Existing Auth Imports ---
from google.oauth2 import service_account
import google.auth.transport.requests
import requests
import json
import pytz
import sys
import platform

# --- Initialize Models and Pipelines at Startup ---
app = FastAPI()
logging.basicConfig(level=logging.INFO)
rag_pipeline = RAGPipeline()
PREDICTOR_MODEL, MODEL_FEATURES = get_latest_model_and_features()

# --- Your Existing CORS Setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Your Existing Pydantic Models (Updated) ---
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
    sources: list = []

# --- Your Existing Auth Functions (get_access_token, etc.) ---
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service-account.json")
SCOPES = ["https://www.googleapis.com/auth/generative-language"]
def get_access_token():
    # Your existing get_access_token function...
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        raise Exception(f"Service account file not found: {SERVICE_ACCOUNT_FILE}")
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    return credentials.token

# --- NEW & UPDATED: Intent Parsing Logic ---
PREDICTIVE_KEYWORDS = ['forecast', 'predict', 'prediction', 'outlook', 'will', 'what is the future of']
ANALYTICAL_KEYWORDS = [
    'performance', 'performing', 'increase in price', 'decrease in price', 
    'best stocks', 'worst stocks', 'top stocks', 'bottom stocks', 
    'dramatic increase', 'significant drop', 'trending'
]

def is_predictive_query(query: str) -> bool:
    query_lower = query.lower()
    # Remove punctuation for better matching
    import re
    query_clean = re.sub(r"[\'\"\?\.,]", "", query_lower)
    return any(keyword in query_clean for keyword in PREDICTIVE_KEYWORDS)

def is_analytical_query(query: str) -> bool:
    return any(keyword in query.lower() for keyword in ANALYTICAL_KEYWORDS)

def find_ticker_in_query(query: str) -> str | None:
    query_lower = query.lower()
    import re
    # Check for company names
    for name, ticker in TICKER_MAP.items():
        if re.search(r'\b' + re.escape(name.lower()) + r'\b', query_lower):
            return ticker
    # Check for ticker symbols and abbreviations
    for name, ticker in TICKER_MAP.items():
        symbol = ticker.replace('.NS', '').lower()
        if re.search(r'\b' + re.escape(symbol) + r'\b', query_lower):
            return ticker
        # Also check for partial matches (e.g., "adani" matches "ADANIENT")
        if symbol.startswith(query_lower) or query_lower.startswith(symbol):
            return ticker
    # Check for ticker symbols directly in query
    for ticker in TICKER_MAP.values():
        symbol = ticker.replace('.NS', '').lower()
        if re.search(r'\b' + re.escape(symbol) + r'\b', query_lower):
            return ticker
    return None

def parse_max_price(query: str) -> float | None:
    """Parses a maximum price constraint from the query."""
    query_lower = query.lower()
    match = re.search(r'(under|below|less than)\s*(\d+\.?\d*)', query_lower)
    if match:
        try:
            return float(match.group(2))
        except (ValueError, IndexError):
            return None
    return None

# --- Main API Endpoint: The Upgraded Smart Router ---
@app.post("/api/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    query = request.query
    logging.info(f"Received query: {query}")


    is_predictive = is_predictive_query(query)
    is_analytical = is_analytical_query(query)
    ticker = find_ticker_in_query(query)
    max_price = parse_max_price(query)

    logging.info(f"Intent detection: is_predictive={is_predictive}, is_analytical={is_analytical}, ticker={ticker}, max_price={max_price}")

    if is_predictive and ticker:
        logging.info(f"Predictive intent detected for ticker: {ticker}")
        try:
            # Download latest historical data for the ticker
            df = yf.download(ticker, period="6mo", interval="1d")
            if df.empty:
                logging.error(f"No market data found for ticker: {ticker}")
                return QueryResponse(answer="No market data found for this ticker.", sources=[])
            # Generate features from the DataFrame
            feature_data = add_features(df)
            # Call make_prediction from predictor.py
            result = make_prediction(PREDICTOR_MODEL, feature_data, MODEL_FEATURES)
            if isinstance(result, dict) and 'error' in result:
                logging.error(f"Prediction error: {result['error']}")
                return QueryResponse(answer="An error occurred during predictive analysis.", sources=[])
            prediction_data = {
                "prediction": result.get('prediction'),
                "confidence": result.get('confidence_pct')
            }
            answer, sources = rag_pipeline.generate_augmented_answer(query, ticker, prediction_data)
            return QueryResponse(answer=answer, sources=sources)
        except Exception as e:
            logging.error(f"Error during predictive analysis: {str(e)}")
            return QueryResponse(answer="An error occurred during predictive analysis.", sources=[])

    elif is_analytical:
        logging.info("Analytical intent detected. Running market analyzer.")
        try:
            period_days = 90
            if 'trending' in query.lower():
                period_days = 3
                logging.info("'Trending' keyword detected, setting period to 3 days.")

            if max_price:
                logging.info(f"Price filter detected: max_price={max_price}")

            top_stocks = analyze_performance(
                period_days=period_days, 
                top_n=5, 
                max_price=max_price
            )
            if not top_stocks:
                answer = "I was unable to calculate market performance with the given criteria."
                return QueryResponse(answer=answer, sources=[])
            title = f"Based on market data from the last {period_days} days"
            if max_price:
                title += f" for stocks under ₹{max_price}"
            title += ", the top 5 performing NIFTY50 stocks were:"
            answer_parts = [title]
            for i, (stock_ticker, change) in enumerate(top_stocks, 1):
                answer_parts.append(f"{i}. {stock_ticker.replace('.NS', '')}: Gained {change:.2f}%")
            answer = "\n".join(answer_parts)
            return QueryResponse(answer=answer, sources=["Internal Market Analysis"])
        except Exception as e:
            logging.error(f"Error during analysis: {str(e)}")
            return QueryResponse(answer="An error occurred during market analysis.", sources=[])

    else:
        logging.info("Standard factual query detected.")
        try:
            answer, sources = rag_pipeline.generate_answer(query)
            return QueryResponse(answer=answer, sources=sources)
        except Exception as e:
            logging.error(f"Error in RAG pipeline: {str(e)}")
            # Check if it's a model availability error
            if "404" in str(e) and "not found" in str(e).lower():
                return QueryResponse(
                    answer="I'm currently experiencing issues with the AI model. Please try again later or contact support if the issue persists.", 
                    sources=[]
                )
            return QueryResponse(answer="An error occurred while processing your query. Please try again.", sources=[])

