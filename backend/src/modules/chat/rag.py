from rag_pipeline.rag_pipeline import RAGPipeline

rag_pipeline = RAGPipeline()


def run_rag(query: str):
    return rag_pipeline.generate_answer(query)


def run_augmented_rag(query: str, ticker: str, prediction_data: dict):
    return rag_pipeline.generate_augmented_answer(
        query,
        ticker,
        prediction_data
    )
