import os
import re
import json
from bs4 import BeautifulSoup

# Use absolute paths relative to the project root
RAW_DIR = "../data/raw_news/"
CLEANED_DIR = "../data/cleaned_news/"
os.makedirs(CLEANED_DIR, exist_ok=True)

def clean_text(html):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def clean_articles():
    """Clean all articles from raw news files"""
    print(f"Looking for files in: {os.path.abspath(RAW_DIR)}")
    
    if not os.path.exists(RAW_DIR):
        print(f"❌ Raw news directory not found: {RAW_DIR}")
        return
        
    files_found = [f for f in os.listdir(RAW_DIR) if f.endswith(('.json', '.json.txt'))]
    print(f"Found {len(files_found)} files to process: {files_found}")
    
    for file in files_found:
        file_path = os.path.join(RAW_DIR, file)
        print(f"\n📄 Processing: {file}")
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Handle array of articles
            if isinstance(data, list):
                cleaned_articles = []
                for i, article in enumerate(data):
                    if article.get("text"):
                        cleaned_article = article.copy()
                        cleaned_article["cleaned_text"] = clean_text(article["text"])
                        cleaned_articles.append(cleaned_article)
                        print(f"  ✅ Cleaned article {i+1}: {article.get('title', 'No title')[:50]}...")
                
                # Save cleaned articles
                out_file = file.replace('.json.txt', '.json').replace('.json', '_cleaned.json')
                out_path = os.path.join(CLEANED_DIR, out_file)
                
                with open(out_path, "w", encoding="utf-8") as out:
                    json.dump(cleaned_articles, out, ensure_ascii=False, indent=2)
                
                print(f"  💾 Saved {len(cleaned_articles)} cleaned articles to: {out_file}")
            
            # Handle single article (legacy support)
            elif isinstance(data, dict) and data.get("text"):
                data["cleaned_text"] = clean_text(data["text"])
                out_path = os.path.join(CLEANED_DIR, file)
                with open(out_path, "w", encoding="utf-8") as out:
                    json.dump(data, out, ensure_ascii=False, indent=2)
                print(f"  ✅ Cleaned single article: {data.get('title', 'No title')[:50]}...")
            
            else:
                print(f"  ⚠️  Skipped {file}: No text content found")
                
        except Exception as e:
            print(f"  ❌ Error processing {file}: {e}")
    
    print(f"\n🎉 Cleaning complete! Check results in: {os.path.abspath(CLEANED_DIR)}")

if __name__ == "__main__":
    clean_articles()