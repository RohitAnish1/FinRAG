
from fastapi import FastAPI, HTTPException
import os
from pydantic import BaseModel
from backend.rag_pipeline import RAGPipeline
import logging
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Initialize the RAG pipeline
rag_pipeline = RAGPipeline()

# Configure logging
logging.basicConfig(level=logging.INFO)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str
# Endpoint to list available Gemini models
@app.get("/api/models")
async def list_gemini_models():
    try:
        access_token = get_access_token()
        url = "https://generativelanguage.googleapis.com/v1/models"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return {"error": response.text}
        return response.json()
    except Exception as e:
        return {"error": str(e)}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Gemini OAuth2 setup
from google.oauth2 import service_account
import google.auth.transport.requests
import requests

# Path to your service account JSON file
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service-account.json")
SCOPES = ["https://www.googleapis.com/auth/generative-language"]

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    return credentials.token

@app.post("/api/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    try:
        logging.info(f"Received query: {request.query}")
        # Get OAuth2 access token
        access_token = get_access_token()
        url = "https://generativelanguage.googleapis.com/v1/models/models/gemini-2.5-pro:generateContent"
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": request.query}]}
            ]
        }
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            logging.error(f"Gemini API error: {response.text}")
            logging.error(f"Full Gemini API response: {response.content}")
            raise Exception(f"Gemini API error: {response.text}")
        data = response.json()
        # Parse Gemini's response
        answer = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No answer returned.")
        logging.info(f"Generated answer: {answer}")
        return QueryResponse(answer=answer)

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    