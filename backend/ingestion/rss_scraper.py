# ingestion/rss_scraper.py
import feedparser
from newspaper import Article, Config
import logging
import json
from datetime import datetime
import os

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# User agent to mimic a browser
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
config = Config()
config.browser_user_agent = USER_AGENT
config.request_timeout = 20

def fetch_and_parse_articles(rss_feeds):
    """
    Fetches articles from a list of RSS feeds, parses them,
    and returns a list of dictionaries with title, url, and clean text.
    """
    articles_data = []
    for url in rss_feeds:
        logging.info(f"Fetching feed from: {url}")
        feed = feedparser.parse(url)
        for entry in feed.entries:
            try:
                # Use newspaper3k to download and parse the article
                article = Article(entry.link, config=config)
                article.download()
                # Some articles might fail downloading, handle this
                if article.download_state != 2:
                    logging.warning(f"Failed to download article: {entry.link}")
                    continue
                
                article.parse()

                # Append cleaned data
                articles_data.append({
                    'title': entry.title,
                    'url': entry.link,
                    'text': article.text
                })
                logging.info(f"Successfully parsed: {entry.title}")

            except Exception as e:
                logging.error(f"Error processing article {entry.link}: {e}")

    return articles_data

if __name__ == '__main__':
    # Example financial RSS feeds (you can add more)
    financial_feeds = [
        'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
        'https://www.livemint.com/rss/markets',
        'http://feeds.reuters.com/reuters/businessNews'
    ]
    
    scraped_articles = fetch_and_parse_articles(financial_feeds)
    
    # --- SAVE THE DATA TO A JSON FILE ---
    output_dir = "data/raw_news"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create a filename with the current date
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = os.path.join(output_dir, f"news_{date_str}.json")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(scraped_articles, f, ensure_ascii=False, indent=4)
        
    print(f"\n✅ Successfully scraped {len(scraped_articles)} articles and saved to {filename}")