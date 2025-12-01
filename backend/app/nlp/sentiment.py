from textblob import TextBlob
from typing import Dict

def analyze_sentiment(text: str) -> Dict[str, int]:
    if not text:
        return {"positive": 0, "negative": 0, "neutral": 100}
        
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity # -1 to 1
    
    # Convert to 0-100 scale buckets
    if polarity > 0.1:
        return {"positive": int(polarity * 100), "negative": 0, "neutral": int((1-polarity)*100)}
    elif polarity < -0.1:
        return {"positive": 0, "negative": int(abs(polarity) * 100), "neutral": int((1-abs(polarity))*100)}
    else:
        return {"positive": 10, "negative": 10, "neutral": 80}
