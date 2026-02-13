import logging
import yfinance as yf

from agents.market_anayser import analyze_performance
from features.market_feature_generator import add_features
from models.predictor import get_latest_model_and_features, make_prediction

from .intent import (
    is_predictive_query,
    is_analytical_query,
    find_ticker_in_query,
    parse_max_price
)
from .rag import run_rag, run_augmented_rag

PREDICTOR_MODEL, MODEL_FEATURES = get_latest_model_and_features()

RESTRICTED_PHRASES = [
    "should i buy",
    "should i sell",
    "buy today",
    "intraday",
    "target price",
    "recommend"
]


async def handle_query(query: str):
    logging.info(f"Received query: {query}")

    if any(p in query.lower() for p in RESTRICTED_PHRASES):
        return {
            "answer": (
                "I can’t provide buy or sell recommendations. However, I can help by:\n"
                "• Summarizing recent performance\n"
                "• Explaining key factors affecting the stock\n"
                "• Comparing it with peers\n"
                "• Highlighting recent news and risks"
            ),
            "sources": []
        }

    is_predictive = is_predictive_query(query)
    is_analytical = is_analytical_query(query)
    ticker = find_ticker_in_query(query)
    max_price = parse_max_price(query)

    logging.info(
        f"Intent: predictive={is_predictive}, analytical={is_analytical}, "
        f"ticker={ticker}, max_price={max_price}"
    )

    # ---- Predictive ----
    if is_predictive and ticker:
        try:
            df = yf.download(ticker, period="6mo", interval="1d")
            if df.empty:
                return {"answer": "No market data found.", "sources": []}

            feature_data = add_features(df)
            result = make_prediction(
                PREDICTOR_MODEL,
                feature_data,
                MODEL_FEATURES
            )

            prediction_data = {
                "prediction": result.get("prediction"),
                "confidence": result.get("confidence_pct")
            }

            answer, sources = run_augmented_rag(
                query, ticker, prediction_data
            )

            return {"answer": answer, "sources": sources}

        except Exception as e:
            logging.error(f"Prediction error: {e}")
            return {
                "answer": "An error occurred during predictive analysis.",
                "sources": []
            }

    # ---- Analytical ----
    if is_analytical:
        try:
            period_days = 3 if "trending" in query.lower() else 90

            top_stocks = analyze_performance(
                period_days=period_days,
                top_n=5,
                max_price=max_price
            )

            if not top_stocks:
                return {
                    "answer": "Unable to calculate market performance.",
                    "sources": []
                }

            lines = [
                f"Based on market data from the last {period_days} days:"
            ]
            for i, (ticker, change) in enumerate(top_stocks, 1):
                lines.append(
                    f"{i}. {ticker.replace('.NS','')}: Gained {change:.2f}%"
                )

            return {
                "answer": "\n".join(lines),
                "sources": ["Internal Market Analysis"]
            }

        except Exception as e:
            logging.error(f"Analysis error: {e}")
            return {
                "answer": "An error occurred during market analysis.",
                "sources": []
            }

    # ---- Factual / RAG ----
    try:
        answer, sources = run_rag(query)
        return {"answer": answer, "sources": sources}
    except Exception as e:
        logging.error(f"RAG error: {e}")
        return {
            "answer": "An error occurred while processing your query.",
            "sources": []
        }
