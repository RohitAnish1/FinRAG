import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# --- Configuration and Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
print("GOOGLE_API_KEY loaded for Gemini:", api_key)  # Debug print

genai.configure(api_key=api_key)

class RAGPipeline:
    def __init__(self, vector_store_path="embeddings/vector_store"):
        self.vector_store_path = vector_store_path
        self.llm = genai.GenerativeModel('gemini-1.5-flash-latest')
        self.vectordb = None
        self.embeddings = None
        self._load_vector_store()

    def _load_vector_store(self):
        """Loads the LangChain FAISS vector store from disk."""
        try:
            logging.info("Loading LangChain FAISS vector store from disk...")
            
            # Initialize embeddings (same as used in embedder)
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
            
            # Load the FAISS vector store
            self.vectordb = FAISS.load_local(
                self.vector_store_path, 
                self.embeddings,
                allow_dangerous_deserialization=True
            )
            
            logging.info("Vector store loaded successfully.")
            logging.info(f"Total vectors in store: {self.vectordb.index.ntotal}")
            
        except Exception as e:
            logging.error(f"Error loading vector store: {e}")
            raise FileNotFoundError(
                "LangChain FAISS vector store not found. "
                "Please run the embedder.py first to create embeddings."
            )
            
    def retrieve_relevant_chunks(self, query, k=15):  # Increased k for more chunks
        """
        Retrieves the top-k most relevant chunks using LangChain FAISS.
        """
        try:
            # Use LangChain's similarity search
            docs = self.vectordb.similarity_search(query, k=k)

            # Convert LangChain documents to our expected format
            retrieved_chunks = []
            for i, doc in enumerate(docs, 1):
                chunk = {
                    'content': doc.page_content,
                    'source': doc.metadata.get('url', 'Unknown'),
                    'title': doc.metadata.get('title', 'No title'),
                    'metadata': doc.metadata
                }
                retrieved_chunks.append(chunk)
                # Debug log for chunk content
                logging.info(f"Chunk {i}: Title: {chunk['title']} | Source: {chunk['source']} | Content: {chunk['content'][:200]}")

            logging.info(f"Retrieved {len(retrieved_chunks)} chunks for query")
            # Check for 'reliance' in any chunk
            found = any('reliance' in chunk['content'].lower() or 'reliance' in chunk['title'].lower() for chunk in retrieved_chunks)
            if found:
                logging.info("At least one chunk contains 'Reliance'.")
            else:
                logging.warning("No chunk contains 'Reliance'.")
            return retrieved_chunks

        except Exception as e:
            logging.error(f"Error during chunk retrieval: {e}")
            return []

    def generate_answer(self, query):
        """
        The main RAG function. Retrieves context and generates an answer.
        """
        logging.info(f"Received query: {query}")
        retrieved_chunks = self.retrieve_relevant_chunks(query)

        if not retrieved_chunks:
            return "Sorry, I couldn't find relevant information to answer your question."

        # Format the retrieved context for the prompt
        context = "\n\n---\n\n".join([
            f"Source: {chunk['source']}\nTitle: {chunk['title']}\nContent: {chunk['content']}" 
            for chunk in retrieved_chunks
        ])

        # Improved prompt for Gemini
        prompt = f"""
        You are FinRAG, a specialized financial AI assistant.

        Your task is to answer the user's question based **only** on the context provided below. The context contains snippets from recent news articles and stock market data.

        - Synthesize the information from all provided sources to form a coherent answer.
        - If the context does not contain enough information to answer the question, state that clearly.
        - Do not use any external knowledge or information you were trained on.
        - Quote or reference the source of the information where possible.
        - If you find information about 'Reliance', highlight it in your answer.

        CONTEXT:
        ---
        {context}
        ---

        QUESTION: {query}

        ANSWER:
        """

        try:
            logging.info("Generating answer with Gemini Pro...")
            response = self.llm.generate_content(prompt)
            logging.info(f"Generated answer: {response.text[:200]}...")  # Log the start of the generated answer
            return response.text
        except Exception as e:
            logging.error(f"Error during answer generation: {e}")
            return "Sorry, I encountered an error while generating the answer. Please check the logs."

    def debug_search(self, query, k=3):
        """Debug method to see what chunks are being retrieved"""
        print(f"\n🔍 Debug Search for: '{query}'")
        print("=" * 60)
        
        chunks = self.retrieve_relevant_chunks(query, k)
        
        for i, chunk in enumerate(chunks, 1):
            print(f"\n{i}. Title: {chunk['title'][:80]}...")
            print(f"   Source: {chunk['source']}")
            print(f"   Content: {chunk['content'][:200]}...")
            
            # Check if it contains key terms
            content_lower = chunk['content'].lower()
            title_lower = chunk['title'].lower()
            
            key_terms = ['reliance', 'tcs', 'hdfc', 'icici', 'bank']
            found_terms = [term for term in key_terms if term in content_lower or term in title_lower]
            
            if found_terms:
                print(f"   Contains: {', '.join(found_terms)} ✅")
            else:
                print(f"   Contains: No key financial terms ❌")

# --- Main Execution for Testing ---
if __name__ == '__main__':
    configure_genai()
    
    try:
        rag_pipeline = RAGPipeline()
        
        # Test the Reliance query that was problematic before
        test_queries = [
            "What is the market sentiment around Reliance Industries based on recent news?",
            "Reliance Industries stock performance analysis",
            "Give me 10 stocks that are performing well in the market below price of 1000.",
        ]
        
        for i, example_query in enumerate(test_queries, 1):
            print(f"🔍 Test {i}: '{example_query}'")
            print("=" * 60)
            
            # Debug what chunks are retrieved
            rag_pipeline.debug_search(example_query)
            
            # Generate the answer
            answer = rag_pipeline.generate_answer(example_query)
            
            print(f"\n📝 Generated Answer:")
            print(answer)
            print("\n" + "=" * 80 + "\n")
        
    except FileNotFoundError as e:
        print(f"❌ {e}")
        print("💡 Run 'python retriever/embedder.py' first to create the vector store")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")