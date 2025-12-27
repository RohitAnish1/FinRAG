import feedparser
from newspaper import Article, Config
import logging
import json
from datetime import datetime, timezone
import os
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
config = Config()
config.browser_user_agent = USER_AGENT
config.request_timeout = 20

def fetch_and_parse_articles(rss_feeds):
    """
    Fetches articles from a list of RSS feeds, parses them,
    and returns a list of dictionaries with title, url, clean text, and a precise timestamp.
    """
    articles_data = []
    for url in rss_feeds:
        logging.info(f"Fetching feed from: {url}")
        feed = feedparser.parse(url)
        for entry in feed.entries:
            try:
                article = Article(entry.link, config=config)
                article.download()
                if article.download_state != 2:
                    logging.warning(f"Failed to download article: {entry.link}")
                    continue
                
                article.parse()

                publish_timestamp = None
                if hasattr(entry, 'published_parsed') and entry.published_parsed:
                    publish_timestamp = datetime.fromtimestamp(time.mktime(entry.published_parsed)).astimezone(timezone.utc)
                elif hasattr(article, 'publish_date') and article.publish_date:
                    publish_timestamp = article.publish_date.astimezone(timezone.utc)
                else:
                    publish_timestamp = datetime.now(timezone.utc)
                    logging.warning(f"Using current time for article with no publish date: {entry.link}")

                articles_data.append({
                    'title': entry.title,
                    'url': entry.link,
                    'text': article.text,
                    'publish_timestamp': publish_timestamp.isoformat()
                })
                logging.info(f"Successfully parsed: {entry.title}")

            except Exception as e:
                logging.error(f"Error processing article {entry.link}: {e}")

    return articles_data

if __name__ == '__main__':
    financial_feeds = [
        # Major Indian Business News
        'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
        'https://www.livemint.com/rss/markets',
        'https://www.thehindubusinessline.com/markets/feeder/default.rss',
        'https://www.business-standard.com/rss/markets-106.rss',
        'https://www.financialexpress.com/market/feed/',
        
        # International News with focus on Indian Business
        'http://feeds.reuters.com/reuters/businessNews',
        'https://www.reuters.com/site-search/?query=india&sort=relevance&section=business&feed=atom',
        'https://feeds.bbci.co.uk/news/business/rss.xml',
        
        # Stock Exchanges & Regulators
        'https://www.bseindia.com/RssReader/corpann.aspx', # BSE Corporate Announcements
        
        # Market Analysis & Opinion
        'https://www.moneycontrol.com/rss/marketreports.xml',
        'https://www.moneycontrol.com/rss/business.xml'
    ]
    
    scraped_articles = fetch_and_parse_articles(financial_feeds)
    
    SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
    BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
    output_dir = os.path.join(BACKEND_ROOT, "data", "raw_news")
    os.makedirs(output_dir, exist_ok=True)
    
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = os.path.join(output_dir, f"news_{date_str}.json")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(scraped_articles, f, ensure_ascii=False, indent=4)
        
    print(f"\n Successfully scraped {len(scraped_articles)} articles and saved to {filename}")

