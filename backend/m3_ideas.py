import json
import re
import requests
import time
from config import CONFIG
from datetime import datetime

# Rate limiting (AI/ML API free tier: 50 RPM)
last_call = 0
DELAY = 1.2

def call_aimlapi_deepseek(prompt: str) -> str:
    global last_call
    while time.time() - last_call < DELAY:
        time.sleep(0.1)
    
    if not CONFIG.AIMLAPI_API_KEY:
        raise ValueError("AI/ML API key missing in .env")
        
    url = "https://api.aimlapi.com/v1/chat/completions" # AI/ML API endpoint
    headers = {
        "Authorization": f"Bearer {CONFIG.AIMLAPI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat", # DeepSeek via AI/ML API (free tier supported)
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4000
    }
    
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=60)
        last_call = time.time()
        
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"]
        elif r.status_code == 402:
            raise ValueError("Free tier quota exhausted — top up at https://aimlapi.com/app/billing")
        elif r.status_code == 429:
            time.sleep(10)
            return call_aimlapi_deepseek(prompt) # Retry
        else:
            raise ValueError(f"AI/ML API error {r.status_code}: {r.text}")
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Network error: {str(e)}")

def generate_fallback_ideas(analysis: dict, tier: str = "Free") -> dict:
    """Generates fallback ideas if LLM fails, using scraped data."""
    topics = [t["topic"] for t in analysis.get("topics", [])]
    questions = [q["text"] for q in analysis.get("questions", [])]
    
    # Ensure we have enough data for fallback
    if not topics: topics = ["Viral Trends", "Hidden Secrets", "Pro Tips", "Mistakes to Avoid", "Industry News"]
    if not questions: questions = ["How do I do this?", "Is this worth it?", "What is the secret?", "Why does this happen?", "Can you explain more?"]
    
    fallback_ideas = []
    templates = [
        ("Stop doing {topic} like this (Do this instead)", "The Secret to {topic} nobody tells you"),
        ("I tried {topic} for 7 days", "Is {topic} actually worth it?"),
        ("3 {topic} mistakes killing your growth", "Why 99% fail at {topic}"),
        ("The ultimate guide to {topic}", "How to master {topic} in 2025"),
        ("Answered: {question}", "The truth about {topic}"),
        ("Why everyone is wrong about {topic}", "The {topic} lie you believe"),
        ("{topic} vs The World", "How {topic} changed everything")
    ]
    
    idea_count = 7 if tier == "Solitaire" else 5
    
    for i in range(idea_count):
        t = topics[i % len(topics)]
        q = questions[i % len(questions)]
        tmpl_title, tmpl_hook = templates[i % len(templates)]
        
        fallback_ideas.append({
            "title": tmpl_title.format(topic=t, question=q),
            "hook": tmpl_hook.format(topic=t, question=q),
            "format": "Shorts/Reels",
            "score": 8.5 + (i * 0.2),
            "script": f"Stop scrolling! If you want to master {t}, you need to hear this..."
        })
        
    return {
        "viral_prediction_engine": {
            "score": analysis.get("viral_score", 85),
            "category": "High",
            "reasons": ["Fallback Engine Active", "High Topic Relevance", "Strong Engagement Signals"]
        },
        "content_category_classifier": {
            "best_format": "Shorts/Reels",
            "alternative_formats": ["Long-form", "Carousel"],
            "reason": "High engagement on short-form content detected."
        },
        "competitor_analysis": [
            {
                "channel": "Top Creator 1",
                "title": f"Why {topics[0]} is viral",
                "views": "1.5M",
                "viral_reason": "High controversy",
                "score": 95
            },
            {
                "channel": "Top Creator 2",
                "title": f"The truth about {topics[0]}",
                "views": "800K",
                "viral_reason": "Strong storytelling",
                "score": 88
            },
            {
                "channel": "Top Creator 3",
                "title": f"How to master {topics[0]}",
                "views": "2.1M",
                "viral_reason": "Unique editing style",
                "score": 92
            },
            {
                "channel": "Top Creator 4",
                "title": f"Never do this with {topics[0]}",
                "views": "3.5M",
                "viral_reason": "Shock value",
                "score": 96
            },
            {
                "channel": "Top Creator 5",
                "title": f"{topics[0]} changed my life",
                "views": "900K",
                "viral_reason": "Emotional story",
                "score": 89
            }
        ],
        "viral_pattern_detection": {
            "detected_patterns": ["Controversy", "Educational", "Storytelling"],
            "confidence": 0.85
        },
        "ai_recommendations": {
            "next_best_content": fallback_ideas
        },
        "seo_keyword_generator": {
            "primary_keywords": topics[:5],
            "secondary_keywords": ["viral", "trending", "guide", "tips", "hack"],
            "search_volume": {"high": topics[0] if topics else "viral"}
        },
        "generated_by": "ViralEdge Fallback Engine"
    }

def generate_m3(analysis: dict, tier: str = "Free") -> dict:
    topics = [t["topic"] for t in analysis.get("topics", [])[:12]]
    questions = [q["text"][:140] for q in analysis.get("questions", [])[:10]]
    sentiment = analysis["sentiment"]["positive"]
    viral_score = analysis.get("viral_score", 80)
    platform = analysis.get("platform", "youtube")
    
    # Solitaire gets 7 ideas, others get 5 (or 3 for free, but usually 5 is standard for paid)
    idea_count = 7 if tier == "Solitaire" else 5
    
    prompt = f'''You are ViralEdge-M3 — advanced viral content engine for {platform}.
Real data from video comments:
- Topics: {", ".join(topics)}
- Top questions: {" | ".join(questions)}
- Positive sentiment: {sentiment}%
- Viral score: {viral_score}/100

Return ONLY this exact JSON structure. No markdown, no extra text.
Generate exactly {idea_count} HIGH-VIRALITY content ideas.

IMPORTANT: For "competitor_analysis", identify 5 REAL viral videos in this niche (e.g. from MrBeast, Ali Abdaal, or top creators in this topic). Estimate their views and give a reason for their virality.

{{
  "viral_prediction_engine": {{
    "score": {viral_score},
    "category": "High",
    "reasons": ["High question intent", "Strong topic relevance", "Positive audience vibe"]
  }},
  "content_category_classifier": {{
    "best_format": "Shorts/Reels",
    "alternative_formats": ["YouTube Long-form", "Instagram Reel", "X Thread"],
    "reason": "Based on comment length and sentiment"
  }},
  "competitor_analysis": [
      {{
        "channel": "Channel Name",
        "title": "Real Viral Video Title",
        "views": "1.2M",
        "viral_reason": "Controversial hook + fast pacing",
        "score": 95
      }},
      {{
        "channel": "Channel Name",
        "title": "Real Viral Video Title",
        "views": "850K",
        "viral_reason": "Strong storytelling",
        "score": 88
      }},
      {{
        "channel": "Channel Name",
        "title": "Real Viral Video Title",
        "views": "2.5M",
        "viral_reason": "Unique visual style",
        "score": 92
      }},
      {{
        "channel": "Channel Name",
        "title": "Real Viral Video Title",
        "views": "3.1M",
        "viral_reason": "Extreme challenge",
        "score": 97
      }},
      {{
        "channel": "Channel Name",
        "title": "Real Viral Video Title",
        "views": "500K",
        "viral_reason": "Relatable humor",
        "score": 85
      }}
  ],
  "viral_pattern_detection": {{
    "detected_patterns": ["Pattern 1", "Pattern 2"],
    "confidence": 0.92
  }},
  "ai_recommendations": {{
    "next_best_content": [
      {{
        "title": "Clickbait but true title",
        "hook": "First 3 seconds hook text",
        "format": "Shorts",
        "score": 9.5,
        "script": "Brief script outline..."
      }}
    ]
  }},
  "seo_keyword_generator": {{
    "primary_keywords": ["kw1", "kw2"],
    "secondary_keywords": ["kw3", "kw4"],
    "search_volume": {{}}
  }}
}}
Generate real titles, hooks, keywords, etc. from the data. START JSON NOW:'''

    # Retry logic
    max_retries = 1
    for attempt in range(max_retries + 1):
        try:
            raw = call_aimlapi_deepseek(prompt)
            
            # Extract JSON
            match = re.search(r"\{.*\}", raw.replace("\n", " ").replace("```", ""), re.DOTALL)
            if not match:
                raise ValueError("No valid JSON found")
                
            result = json.loads(match.group(0))
            
            # Validate ideas count
            ideas = result.get("ai_recommendations", {}).get("next_best_content", [])
            if len(ideas) < 5:
                raise ValueError(f"Insufficient ideas generated: {len(ideas)}")
                
            result["generated_by"] = "DeepSeek via AI/ML API"
            return result
            
        except Exception as e:
            print(f"Generation attempt {attempt+1} failed: {e}")
            if attempt == max_retries:
                print("All AI attempts failed. Engaging Fallback Engine.")
                return generate_fallback_ideas(analysis, tier)
            time.sleep(1)

# Alias for compatibility if needed
generate_content_ideas = generate_m3
