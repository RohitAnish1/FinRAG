import re
from data_processing.data_aligner import TICKER_MAP

PREDICTIVE_KEYWORDS = [
    'forecast', 'predict', 'prediction',
    'outlook', 'will', 'what is the future of'
]

ANALYTICAL_KEYWORDS = [
    'performance', 'performing',
    'increase in price', 'decrease in price',
    'best stocks', 'worst stocks',
    'top stocks', 'bottom stocks',
    'dramatic increase', 'significant drop',
    'trending'
]


def is_predictive_query(query: str) -> bool:
    query_clean = re.sub(r"[\'\"\?\.,]", "", query.lower())
    return any(keyword in query_clean for keyword in PREDICTIVE_KEYWORDS)


def is_analytical_query(query: str) -> bool:
    return any(keyword in query.lower() for keyword in ANALYTICAL_KEYWORDS)


def find_ticker_in_query(query: str) -> str | None:
    query_lower = query.lower()

    # Company names
    for name, ticker in TICKER_MAP.items():
        if re.search(r'\b' + re.escape(name.lower()) + r'\b', query_lower):
            return ticker

    # Ticker symbols
    for ticker in TICKER_MAP.values():
        symbol = ticker.replace('.NS', '').lower()
        if re.search(r'\b' + re.escape(symbol) + r'\b', query_lower):
            return ticker

    return None


def parse_max_price(query: str) -> float | None:
    match = re.search(r'(under|below|less than)\s*(\d+\.?\d*)', query.lower())
    if match:
        try:
            return float(match.group(2))
        except ValueError:
            return None
    return None
