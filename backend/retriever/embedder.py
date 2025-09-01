import os
import json
import google.generativeai as genai
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Configure Google AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

CLEANED_DIR = "../data/cleaned_news/"
RAW_NEWS_DIR = "../data/raw_news/"
STOCK_DATA = "../data/stock_data/"
VECTOR_DIR = "../embeddings/vector_store/"
os.makedirs(VECTOR_DIR, exist_ok=True)

def load_docs():
    docs = []
    
    # First try to load from cleaned news
    if os.path.exists(CLEANED_DIR) and os.listdir(CLEANED_DIR):
        print(f"Loading from cleaned news directory: {CLEANED_DIR}")
        for file in os.listdir(CLEANED_DIR):
            if file.endswith('.json'):
                with open(os.path.join(CLEANED_DIR, file), "r", encoding="utf-8") as f:
                    data = json.load(f)
                    
                    # Handle both list and single article formats
                    if isinstance(data, list):
                        for article in data:
                            text = article.get("cleaned_text", "") or article.get("text", "")
                            if text:
                                docs.append({"content": text, "metadata": article})
                    elif isinstance(data, dict):
                        text = data.get("cleaned_text", "") or data.get("text", "")
                        if text:
                            docs.append({"content": text, "metadata": data})
    else:
        # Fallback to raw news if no cleaned news available
        print(f"No cleaned news found, loading from raw news: {RAW_NEWS_DIR}")
        if os.path.exists(RAW_NEWS_DIR):
            for file in os.listdir(RAW_NEWS_DIR):
                if file.endswith(('.json', '.json.txt')):
                    with open(os.path.join(RAW_NEWS_DIR, file), "r", encoding="utf-8") as f:
                        data = json.load(f)
                        
                        if isinstance(data, list):
                            for article in data:
                                text = article.get("text", "")
                                if text:
                                    docs.append({"content": text, "metadata": article})
    
    print(f"Loaded {len(docs)} documents")
    return docs

def embed():
    """Create embeddings using LangChain + FAISS + Google Gemini"""
    print("🚀 Starting embedding process with LangChain + FAISS + Google Gemini...")
    
    # Load documents
    raw_docs = load_docs()
    
    # Advanced text splitting with LangChain
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=512, 
        chunk_overlap=64,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""]
    )
    
    # Process documents
    texts, metadatas = [], []
    for d in raw_docs:
        chunks = splitter.split_text(d["content"])
        texts.extend(chunks)
        metadatas.extend([d["metadata"]] * len(chunks))
    
    print(f"📝 Created {len(texts)} text chunks from {len(raw_docs)} documents")
    
    # Use Google Gemini embeddings (FREE!)
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    print("🔄 Creating FAISS vector store with Google Gemini embeddings...")
    
    # Create FAISS vector store
    vectordb = FAISS.from_texts(
        texts=texts, 
        embedding=embeddings, 
        metadatas=metadatas
    )
    
    # Save to disk
    vectordb.save_local(VECTOR_DIR)
    print(f"✅ Vector store saved to: {VECTOR_DIR}")
    print(f"📊 Total vectors: {vectordb.index.ntotal}")

def search_test():
    """Test the vector store search functionality"""
    print("\n🔍 Testing vector search...")
    
    # Load the saved vector store
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    vectordb = FAISS.load_local(VECTOR_DIR, embeddings, allow_dangerous_deserialization=True)
    
    # Test queries
    test_queries = [
        "Reliance Industries stock performance",
        "What is happening with TCS?",
        "Banking sector news",
        "Market sentiment analysis"
    ]
    
    for query in test_queries:
        print(f"\n📋 Query: '{query}'")
        docs = vectordb.similarity_search(query, k=3)
        
        for i, doc in enumerate(docs, 1):
            print(f"  {i}. {doc.page_content[:100]}...")
            if 'title' in doc.metadata:
                print(f"     Title: {doc.metadata['title'][:60]}...")

if __name__ == "__main__":
    # First install required package
    print("📦 Make sure you have installed: pip install langchain-google-genai")
    
    try:
        embed()
        search_test()
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure your GOOGLE_API_KEY is set in .env file")