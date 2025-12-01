from typing import List, Dict, Any
import re
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def clean(text: str) -> str:
    if not text:
        return ""
    # Remove URLs, mentions, hashtags
    text = re.sub(r"http\S+|@\w+|#\w+", "", text)
    # Remove non-alphanumeric characters (except basic punctuation) to kill morse code/garbage
    text = re.sub(r"[^a-zA-Z0-9\s.,!?']", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.lower()

def extract_questions(comments: List[Dict]) -> List[Dict]:
    patterns = ["how", "what", "why", "when", "where", "who", "which", "?", "can you", "should", "could"]
    seen = set()
    result = []
    for c in comments:
        txt = clean(c.get("text", ""))
        if any(p in txt for p in patterns) and len(txt) > 20:
            key = txt[:70]
            if key not in seen:
                seen.add(key)
                result.append({"text": c["text"], "author": c.get("author", "unknown")})
    return result[:12]

def extract_topics(comments: List[Dict]) -> List[Dict]:
    texts = [clean(c.get("text", "")) for c in comments if len(clean(c.get("text", ""))) > 30]
    phrases = []
    for text in texts:
        words = text.split()
        phrases.extend([" ".join(words[i:i+2]) for i in range(len(words)-1)])
        phrases.extend([" ".join(words[i:i+3]) for i in range(len(words)-2)])
    
    banned = {
        "to be", "is a", "can be", "going to", "need to", "at the", "this is", "that is", "what do",
        "how to", "thank you", "great video", "good video", "love this", "you are", "i am", "i think"
    }
    
    counter = Counter(p for p in phrases if p not in banned and len(p.split()) >= 2)
    total = sum(counter.values()) or 1
    
    topics = []
    for phrase, count in counter.most_common(15):
        # Ensure topic has at least one letter and isn't just numbers/symbols
        if not re.search(r"[a-zA-Z]", phrase):
            continue
        topics.append({
            "topic": phrase.title(),
            "score": round(count / total * 100, 1)
        })
        
    # Fallback to strong single words
    if len(topics) < 5:
        words = re.findall(r"[a-z]{5,}", " ".join(texts))
        word_count = Counter(w for w in words if w not in {"video", "youtube", "people", "really", "think"})
        for w, c in word_count.most_common(10):
            if not any(w in t["topic"].lower() for t in topics):
                topics.append({"topic": w.title(), "score": round(c / len(words) * 100, 1)})
                
    return topics[:10]

# Alias for compatibility with analyze_all
top_topics = lambda comments, top_k=10: extract_topics(comments)[:top_k]

def analyze_comments(comments: List[Dict], video_url: str = "") -> Dict[str, Any]:
    if not comments:
        return {"error": "No comments"}
        
    questions = extract_questions(comments)
    topics = extract_topics(comments)
    
    # Sentiment
    scores = [analyzer.polarity_scores(clean(c.get("text", "")))["compound"] for c in comments[:300]]
    pos = len([s for s in scores if s >= 0.05])
    neg = len([s for s in scores if s <= -0.05])
    neu = len(scores) - pos - neg
    total = len(scores) or 1
    
    sentiment = {
        "positive": round(pos / total * 100),
        "negative": round(neg / total * 100),
        "neutral": round(neu / total * 100),
        "positive_ratio": round(pos / total, 2)
    }
    
    # Engagement Stats
    total_likes = sum(c.get("likes", 0) for c in comments)
    avg_likes = total_likes / len(comments) if comments else 0
    
    # --- REAL VIRAL SCORE CALCULATION ---
    # 1. Sentiment Score (30%): Positive ratio * 100
    score_sentiment = sentiment["positive_ratio"] * 100
    
    # 2. Question Density (25%): Ratio of questions to comments * 200 (capped at 100)
    q_ratio = len(questions) / max(1, len(comments))
    score_questions = min(100, q_ratio * 300) # Increased sensitivity
    
    # 3. Engagement Intensity (25%): Avg likes vs baseline (baseline=20 for shorts/tiktok)
    # Lowered baseline to make high scores achievable but dynamic
    score_engagement = min(100, (avg_likes / 20) * 100)
    
    # 4. Topic Diversity (10%): Number of strong topics * 10 (capped at 100)
    score_topics = min(100, len(topics) * 12)
    
    # 5. Volume/Velocity (10%): 
    score_velocity = min(100, (len(comments) / 200) * 100)
    
    # Weighted Sum
    raw_score = (
        0.30 * score_sentiment +
        0.25 * score_questions +
        0.25 * score_engagement +
        0.10 * score_topics +
        0.10 * score_velocity
    )
    
    # Normalize to 40-99 range (Wider range for more variation)
    final_score = int(40 + (raw_score / 100) * 59)
    
    viral_score_breakdown = {
        "positive_vibe": int(0.30 * score_sentiment),
        "question_intent": int(0.25 * score_questions),
        "engagement_depth": int(0.25 * score_engagement),
        "topic_richness": int(0.10 * score_topics),
        "velocity": int(0.10 * score_velocity)
    }

    return {
        "video_url": video_url,
        "total_comments": len(comments),
        "avg_likes": round(avg_likes, 2),
        "viral_score": final_score,
        "viral_score_breakdown": viral_score_breakdown,
        "questions": questions,
        "topics": topics,
        "sentiment": sentiment,
        "engagement": {
            "comments_count": len(comments),
            "avg_likes": round(avg_likes, 2),
            "top_comments": []
        }
    }

def overall_sentiment_summary(sentiments: List[Dict]) -> Dict[str, Any]:
    if not sentiments:
        return {"positive": 0, "negative": 0, "neutral": 0}
    pos = len([s for s in sentiments if s["label"] == "positive"])
    neg = len([s for s in sentiments if s["label"] == "negative"])
    total = len(sentiments)
    return {
        "positive": round(pos/total * 100),
        "negative": round(neg/total * 100),
        "neutral": round((total - pos - neg)/total * 100)
    }
