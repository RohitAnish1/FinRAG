from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import yfinance as yf

router = APIRouter()

class PriceRequest(BaseModel):
    symbols: List[str]

class PriceResponse(BaseModel):
    symbol: str
    currentPrice: float
    previousClose: float

@router.post("/prices", response_model=List[PriceResponse])
async def get_prices(request: PriceRequest):
    if not request.symbols:
        raise HTTPException(status_code=400, detail="No symbols provided")

    prices = []
    for symbol in request.symbols:
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")
            current_price = data["Close"].iloc[-1]
            previous_close = data["Close"].iloc[-2] if len(data) > 1 else current_price
            prices.append({
                "symbol": symbol,
                "currentPrice": current_price,
                "previousClose": previous_close,
            })
        except Exception as e:
            print(f"Failed to fetch data for {symbol}: {e}")
            prices.append({
                "symbol": symbol,
                "currentPrice": 0.0,
                "previousClose": 0.0,
            })

    return prices