import json
import re
import requests
import time
from .config import CONFIG
from datetime import datetime

# Rate limiting (AI/ML API free tier: 50 RPM)
last_call = 0
DELAY = 1.2

def call_openrouter_deepseek(prompt: str) -> str:
    global last_call
    while time.time() - last_call < DELAY:
        time.sleep(0.1)
    
    if not CONFIG.OPENROUTER_API_KEY:
        raise ValueError("OpenRouter API key missing in .env")

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {CONFIG.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://viraledge.ai", # Optional
        "X-Title": "ViralEdge" # Optional
    }
    payload = {
        "model": "deepseek/deepseek-chat", # OpenRouter model ID
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 4000
    }
    
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=60)
        last_call = time.time()
        
        if r.status_code == 200:
            return r.json()["choices"][0]["message"]["content"]
        else:
            raise ValueError(f"OpenRouter API error {r.status_code}: {r.text}")
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Network error: {str(e)}")

def repair_json(json_str: str) -> str:
    """Attempts to repair truncated JSON by closing open braces/brackets."""
    json_str = json_str.strip()
    # Remove any trailing incomplete strings (e.g. "abc...)
    if '"' in json_str and json_str.count('"') % 2 != 0:
        # Remove the last quote and everything after it
        last_quote = json_str.rfind('"')
        json_str = json_str[:last_quote]
    
    json_str = json_str.strip()
    if json_str.endswith(','):
        json_str = json_str[:-1]
    
    # Balance braces
    stack = []
    for char in json_str:
        if char == '{':
            stack.append('}')
        elif char == '[':
            stack.append(']')
        elif char == '}' or char == ']':
            if stack:
                if stack[-1] == char:
                    stack.pop()
    
    # Append missing closing characters in reverse order
    while stack:
        json_str += stack.pop()
        
    return json_str

def calculate_viral_score(m2_data):
    """
    Calculates a viral score (0-100) based on weighted factors:
    - Demand (30%): Topic relevance and volume
    - Engagement (25%): Sentiment intensity and comment count
    - Curiosity (15%): Question density
    - Trend (20%): (Simulated based on recency/velocity)
    - Gap (10%): (Simulated competition gap)
    """
    # 1. Demand Score (0-100)
    topic_count = len(m2_data.get("topics", []))
    demand_score = min(100, topic_count * 15)

    # 2. Engagement Score (0-100)
    sentiment = m2_data.get("sentiment", {})
    pos = sentiment.get("positive", 0)
    neg = sentiment.get("negative", 0)
    intensity = (pos + neg) / 100.0
    engagement_score = min(100, intensity * 100 + 20) 

    # 3. Curiosity Score (0-100)
    question_count = len(m2_data.get("questions", []))
    curiosity_score = min(100, question_count * 10)

    # 4. Trend Score (0-100)
    import random
    trend_score = random.randint(60, 95) 

    # 5. Gap Score (0-100)
    gap_score = random.randint(40, 90)

    # Weighted Sum
    raw_score = (
        0.30 * demand_score +
        0.25 * engagement_score +
        0.15 * curiosity_score +
        0.20 * trend_score +
        0.10 * gap_score
    )
    
    return round(min(100, max(0, raw_score)))

def generate_m3(m2_data, tier="Free"):
    """
    Generates M3 insights (Viral Score, Content Ideas) using DeepSeek or Fallback.
    """
    viral_score = calculate_viral_score(m2_data)
    
    # Generate reasons based on the score components
    reasons = []
    if len(m2_data.get("questions", [])) > 5:
        reasons.append("High audience curiosity detected (many questions)")
    if m2_data.get("sentiment", {}).get("positive", 0) > 70:
        reasons.append("Strong positive sentiment alignment")
    if m2_data.get("sentiment", {}).get("negative", 0) > 30:
        reasons.append("Controversial topic driving engagement")
    if len(m2_data.get("topics", [])) > 3:
        reasons.append("Rich topic density")
    
    if not reasons:
        reasons = ["Steady engagement flow", "Niche audience interest"]

    # Tier Logic for Idea Count
    idea_count = 5
    if tier == "Diamond": idea_count = 10
    if tier == "Solitaire": idea_count = 15

    # Prepare Prompt for DeepSeek
    topics = [t['topic'] for t in m2_data.get('topics', [])[:5]]
    questions = [q['text'] for q in m2_data.get('questions', [])[:5]]
    
    prompt = f"""
    You are ViralEdge-M3, an advanced viral content strategist.
    
    DATA:
    - Topics: {', '.join(topics)}
    - Top Questions: {', '.join(questions)}
    - Viral Score: {viral_score}/100
    
    TASK:
    Generate {idea_count} highly viral content ideas based on this data.
    
    RETURN JSON ONLY:
    {{
        "ai_recommendations": {{
            "next_best_content": [
                {{
                    "title": "Viral Title Here",
                    "score": {viral_score},
                    "blueprint": {{
                        "hooks": ["Hook 1", "Hook 2"],
                        "script_mini": "Brief script outline...",
                        "voiceover": {{ "tone": "Energetic", "gender": "Any" }},
                        "scene_directions": ["Scene 1...", "Scene 2..."]
                    }}
                }}
            ]
        }},
        "seo_keyword_generator": {{
            "primary_keywords": ["Key1", "Key2"],
            "secondary_keywords": ["Key3", "Key4"],
            "search_volume": {{ "Key1": "10K" }}
        }}
    }}
    """

    try:
        # Call DeepSeek
        raw_response = call_openrouter_deepseek(prompt)
        
        # Parse Response
        match = re.search(r"\{[\s\S]*\}", raw_response)
        if match:
            json_str = match.group(0)
            result = json.loads(json_str)
        else:
            raise ValueError("No JSON found")
            
        # Inject our calculated viral score and reasons
        result["viral_prediction_engine"] = {
            "score": viral_score,
            "category": "High" if viral_score > 80 else "Medium" if viral_score > 50 else "Low",
            "reasons": reasons
        }
        result["generated_by"] = "ViralEdge-M3 (DeepSeek Enhanced)"
        
        return result

    except Exception as e:
        print(f"DeepSeek Failed: {e}. Using Fallback.")
        # Fallback Logic (if AI fails)
        return {
            "viral_prediction_engine": {
                "score": viral_score,
                "category": "High" if viral_score > 80 else "Medium",
                "reasons": reasons
            },
            "ai_recommendations": {
                "next_best_content": [
                    {
                        "title": f"Why {topics[0] if topics else 'this'} is trending",
                        "score": viral_score,
                        "blueprint": {
                            "hooks": ["You need to see this...", "Secret revealed..."],
                            "script_mini": "Intro... Body... Conclusion...",
                            "voiceover": {"tone": "Neutral", "gender": "Any"},
                            "scene_directions": ["Talking head", "B-roll"]
                        }
                    }
                ]
            },
            "seo_keyword_generator": {
                "primary_keywords": topics[:5],
                "secondary_keywords": ["Viral", "Trending"],
                "search_volume": {"Key1": "Unknown"}
            },
            "generated_by": "ViralEdge-M3 (Fallback Engine)"
        }