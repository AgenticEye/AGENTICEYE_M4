from textblob import TextBlob
from typing import List, Dict, Any

def extract_topics(text: str) -> List[Dict[str, Any]]:
    if not text:
        return []
        
    blob = TextBlob(text)
    # Use noun phrases as topics
    phrases = blob.noun_phrases
    
    # Count frequency
    counts = {}
    for p in phrases:
        counts[p] = counts.get(p, 0) + 1
        
    sorted_topics = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    
    return [{"topic": t, "count": c} for t, c in sorted_topics[:10]]
