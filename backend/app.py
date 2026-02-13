from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from src.modules.chat.router import router as chat_router
from src.modules.market.prices import router as prices_router

app = FastAPI(
    title="FinRAG AI Service",
    description="AI / RAG / Market Intelligence service for FinRAG",
    version="1.0.0",
)

logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(prices_router, prefix="/api")

for route in app.routes:
    print(f"Path: {route.path}, Methods: {route.methods}")

@app.get("/health")
def health_check():
    return {"status": "ok"}