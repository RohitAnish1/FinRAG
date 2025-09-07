import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# --- Configuration and Setup ---
# (Your existing setup code remains unchanged)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

class RAGPipeline:
    def __init__(self, vector_store_path="embeddings/vector_store"):
        # (Your existing __init__ code remains unchanged)
        self.vector_store_path = vector_store_path
        self.llm = genai.GenerativeModel('gemini-1.5-flash-latest')
        self.vectordb = None
        self.embeddings = None
        self._load_vector_store()

    def _load_vector_store(self):
        # (Your existing _load_vector_store method remains unchanged)
        try:
            logging.info("Loading LangChain FAISS vector store from disk...")
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
            self.vectordb = FAISS.load_local(
                self.vector_store_path, 
                self.embeddings,
                allow_dangerous_deserialization=True
            )
            logging.info("Vector store loaded successfully.")
        except Exception as e:
            logging.error(f"Error loading vector store: {e}")
            raise

    def retrieve_relevant_chunks(self, query, k=5):
        # (Your existing retrieve_relevant_chunks method is slightly modified to return sources)
        try:
            docs = self.vectordb.similarity_search(query, k=k)
            retrieved_chunks = []
            sources = set()
            for doc in docs:
                retrieved_chunks.append(doc.page_content)
                if 'url' in doc.metadata:
                    sources.add(doc.metadata['url'])
            logging.info(f"Retrieved {len(retrieved_chunks)} chunks for query.")
            return "\n\n---\n\n".join(retrieved_chunks), list(sources)
        except Exception as e:
            logging.error(f"Error during chunk retrieval: {e}")
            return "", []

    def generate_answer(self, query):
        # (Your existing RAG function for standard questions)
        logging.info(f"Received standard query: {query}")
        context, sources = self.retrieve_relevant_chunks(query)

        if not context:
            return "Sorry, I couldn't find relevant information to answer your question.", []

        prompt = f"""
        You are FinRAG, a specialized financial AI assistant. Your task is to answer the user's question based ONLY on the context provided below.
        
        CONTEXT:
        ---
        {context}
        ---
        
        QUESTION: {query}
        
        ANSWER:
        """
        try:
            response = self.llm.generate_content(prompt)
            return response.text, sources
        except Exception as e:
            logging.error(f"Error during standard answer generation: {e}")
            return "Sorry, an error occurred while generating the answer.", []

    # --- NEW METHOD FOR PREDICTIVE ANALYSIS ---
    def generate_augmented_answer(self, query, ticker, prediction_data):
        """
        Generates an answer that combines a quantitative prediction with qualitative news context.
        """
        logging.info(f"Received augmented query for {ticker}: {query}")
        
        # 1. Retrieve news context relevant to the query
        rag_query = f"What is the recent news and market sentiment for {ticker.replace('.NS', '')}?"
        context, sources = self.retrieve_relevant_chunks(rag_query)

        if not context:
            context = "No specific recent news articles were found in the database for this stock."
            sources = []

        # 2. Build the augmented prompt for Gemini
        prompt = f"""
        You are FinRAG, a specialized financial AI assistant. Your task is to synthesize a forecast for a stock by combining a quantitative prediction from a machine learning model with qualitative context from recent news articles.

        **ML Model Prediction:**
        - Stock Ticker: {ticker}
        - Forecast Direction: **{prediction_data['prediction']}**
        - Model Confidence: {prediction_data['confidence']:.2f}%

        **Recent News Context (from Vector Database):**
        ---
        {context}
        ---

        **User's Question:** {query}

        **Your Task:**
        1. Start with a direct statement about the model's forecast (e.g., "The quantitative model predicts a potential **{prediction_data['prediction']}** movement for {ticker}...").
        2. Analyze the provided "Recent News Context". Explain whether the news seems to SUPPORT or CONTRADICT the model's prediction. For example, if the model predicts "Up" and the news is positive, state that the sentiment aligns with the forecast. If the news is negative, point out the discrepancy.
        3. Synthesize everything into a coherent, brief analysis (2-4 sentences).
        4. **Crucially, end with a clear disclaimer:** "This is not financial advice. The prediction is based on a machine learning model and historical data, which does not guarantee future results."
        
        **Synthesized Analysis:**
        """
        
        try:
            logging.info("Generating augmented answer with Gemini...")
            response = self.llm.generate_content(prompt)
            return response.text, sources
        except Exception as e:
            logging.error(f"Error during augmented answer generation: {e}")
            return "Sorry, an error occurred while generating the augmented analysis.", []

# (Your __main__ block for testing can be removed or kept as is)
