from fastapi import APIRouter
from pydantic import BaseModel
from .service import handle_query

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


class QueryResponse(BaseModel):
    answer: str
    sources: list = []


@router.post("/query", response_model=QueryResponse)
async def query_endpoint(req: QueryRequest):
    return await handle_query(req.query)
