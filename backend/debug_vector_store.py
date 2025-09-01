# debug_vector_store.py
import pickle
import os
from collections import Counter

def analyze_vector_store():
    """Analyze what's in the vector store"""
    chunks_path = "embeddings/vector_store/chunks.pkl"
    
    if not os.path.exists(chunks_path):
        print("❌ Vector store not found!")
        return
    
    with open(chunks_path, "rb") as f:
        chunks = pickle.load(f)
    
    print(f"📊 Total chunks in vector store: {len(chunks)}")
    print("\n" + "="*50)
    
    # Analyze sources
    sources = [chunk.get('source', 'unknown') for chunk in chunks]
    source_counts = Counter(sources)
    print("\n📁 Sources breakdown:")
    for source, count in source_counts.items():
        print(f"  {source}: {count} chunks")
    
    # Show sample chunks
    print("\n📄 Sample chunks:")
    for i, chunk in enumerate(chunks[:5]):
        print(f"\n{i+1}. Title: {chunk.get('title', 'No title')}")
        print(f"   Source: {chunk.get('source', 'No source')}")
        print(f"   Content: {chunk.get('content', 'No content')[:200]}...")
    
    # Search for Reliance-related content
    reliance_chunks = [chunk for chunk in chunks 
                      if 'reliance' in chunk.get('content', '').lower() or 
                         'reliance' in chunk.get('title', '').lower()]
    
    print(f"\n🔍 Reliance-related chunks found: {len(reliance_chunks)}")
    
    if reliance_chunks:
        print("\n📰 Reliance content samples:")
        for i, chunk in enumerate(reliance_chunks[:3]):
            print(f"\n{i+1}. Title: {chunk.get('title', 'No title')}")
            print(f"   Content: {chunk.get('content', 'No content')[:300]}...")
    else:
        print("❌ No Reliance-related content found in vector store!")
        
    # Show what companies ARE mentioned
    print("\n🏢 Companies mentioned in content:")
    company_keywords = ['hdfc', 'icici', 'tcs', 'infy', 'sbin', 'itc', 'bank', 'stock', 'reliance']
    for keyword in company_keywords:
        matching_chunks = [chunk for chunk in chunks 
                         if keyword in chunk.get('content', '').lower()]
        if matching_chunks:
            print(f"  {keyword.upper()}: {len(matching_chunks)} chunks")

def test_query_retrieval():
    """Test what chunks are retrieved for the Reliance query"""
    import sys
    import os
    sys.path.append('..')
    
    try:
        from rag_pipeline import RAGPipeline, configure_genai
        
        print("\n" + "="*60)
        print("🔍 TESTING QUERY RETRIEVAL")
        print("="*60)
        
        configure_genai()
        rag = RAGPipeline()
        
        query = "What is the market sentiment around Reliance Industries based on recent news?"
        print(f"\nQuery: '{query}'")
        
        # Get retrieved chunks
        retrieved_chunks = rag.retrieve_relevant_chunks(query, k=7)
        
        print(f"\n📊 Retrieved {len(retrieved_chunks)} chunks:")
        print("-" * 50)
        
        for i, chunk in enumerate(retrieved_chunks):
            print(f"\n{i+1}. Title: {chunk.get('title', 'No title')[:80]}...")
            print(f"   Source: {chunk.get('source', 'No source')}")
            content = chunk.get('content', 'No content')
            print(f"   Content: {content[:200]}...")
            
            # Check if it mentions Reliance
            has_reliance = 'reliance' in content.lower() or 'reliance' in chunk.get('title', '').lower()
            print(f"   Contains 'Reliance': {has_reliance} ✅" if has_reliance else f"   Contains 'Reliance': {has_reliance} ❌")
        
        # Test different queries
        test_queries = [
            "Reliance stock price analysis",
            "RELIANCE Industries performance", 
            "What is Reliance stock doing?",
            "RIL recent trends"
        ]
        
        for test_query in test_queries:
            print(f"\n" + "="*60)
            print(f"🔍 Testing query: '{test_query}'")
            print("="*60)
            
            test_chunks = rag.retrieve_relevant_chunks(test_query, k=3)
            
            for i, chunk in enumerate(test_chunks):
                content = chunk.get('content', 'No content')
                has_reliance = 'reliance' in content.lower() or 'reliance' in chunk.get('title', '').lower()
                print(f"\n{i+1}. {chunk.get('title', 'No title')[:60]}...")
                print(f"   Contains Reliance: {has_reliance} {'✅' if has_reliance else '❌'}")
                if has_reliance:
                    print(f"   Content: {content[:150]}...")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"❌ Error testing retrieval: {e}")
        print("Make sure rag_pipeline.py is working and vector store exists.")

if __name__ == "__main__":
    analyze_vector_store()
    test_query_retrieval()
