from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import AnalyzeRequest, AnalysisResponse
from app.scraping.youtube import scrape_youtube
from app.scraping.tiktok import scrape_tiktok
from app.nlp.sentiment import analyze_sentiment
from app.nlp.topics import extract_topics
from app.scoring import calculate_viral_score
from app.llm import call_openrouter_deepseek
import json
import re

app = FastAPI(title="AgenticEye Backend", root_path="/api/py")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "AgenticEye Backend"}

@app.get("/m3/analyze")
async def analyze_content(url: str, tier: str = "Free"):
    # 1. Scrape
    if "youtube.com" in url or "youtu.be" in url:
        data = scrape_youtube(url)
    elif "tiktok.com" in url:
        data = scrape_tiktok(url)
    else:
        raise HTTPException(status_code=400, detail="Unsupported URL")
        
    if not data:
        raise HTTPException(status_code=500, detail="Scraping failed")
        
    # 2. NLP
    combined_text = f"{data.get('title', '')} {data.get('description', '')}"
    sentiment = analyze_sentiment(combined_text)
    topics = extract_topics(combined_text)
    
    # 3. Score
    analysis_data = {
        "title": data.get("title", ""),
        "topics": topics,
        "sentiment": sentiment,
        "questions": ["What camera do you use?", "How did you edit this?", "Can you do a tutorial?", "Where is this location?", "What music is this?", "Is this real?"] # Mocked for now
    }
    viral_score = calculate_viral_score(analysis_data)
    
    # 4. LLM Generation
    idea_count = 5 if tier == "Free" else 10 if tier == "Diamond" else 15
    
    prompt = f"""
    You are ViralEdge-M3, an advanced viral content strategist.
    
    DATA:
    - Title: {data.get('title')}
    - Topics: {', '.join([t['topic'] for t in topics[:5]])}
    - Viral Score: {viral_score}/100
    
    TASK:
    Generate {idea_count} highly viral content ideas based on this data.
    
    RETURN JSON ONLY matching this structure:
    {{
        "ai_recommendations": {{
            "next_best_content": [
                {{
                    "title": "Viral Title Here",
                    "hook": "Strong hook here",
                    "score": {viral_score},
                    "script": "Brief script outline...",
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
        raw_llm = call_openrouter_deepseek(prompt)
        match = re.search(r"\{[\s\S]*\}", raw_llm)
        if match:
            llm_data = json.loads(match.group(0))
        else:
            raise ValueError("No JSON found in LLM response")
            
        # Construct Final Response
        reasons = []
        if viral_score > 80: reasons.append("High viral potential detected")
        if sentiment['positive'] > 50: reasons.append("Positive sentiment alignment")
        
        return {
            "engine": "AgenticEye v2.0",
            "video_url": url,
            "comment_count": data.get('comment_count', 1847),
            "m2_analysis": {
                "topics": [t['topic'] for t in topics],
                "sentiment": sentiment,
                "questions": analysis_data["questions"],
                "emotions": {"Excitement": 0.8, "Curiosity": 0.6, "Joy": 0.4, "Fear": 0.2} # Mocked for now
            },
            "m3_generation": {
                "viral_prediction_engine": {
                    "score": viral_score,
                    "category": "High" if viral_score > 80 else "Medium" if viral_score > 50 else "Low",
                    "reasons": reasons
                },
                "ai_recommendations": llm_data.get("ai_recommendations", {"next_best_content": []}),
                "seo_keyword_generator": llm_data.get("seo_keyword_generator", {
                    "primary_keywords": [], "secondary_keywords": [], "search_volume": {}
                })
            }
        }
        
    except Exception as e:
        print(f"Analysis Error: {e}")
        # Fallback
        return {
            "engine": "AgenticEye Fallback",
            "video_url": url,
            "m2_analysis": {
                "topics": [],
                "sentiment": {"positive": 0, "neutral": 0, "negative": 0},
                "questions": []
            },
            "m3_generation": {
                "viral_prediction_engine": {
                    "score": viral_score,
                    "category": "Medium",
                    "reasons": ["Fallback mode active"]
                },
                "ai_recommendations": {"next_best_content": []},
                "seo_keyword_generator": {"primary_keywords": [], "secondary_keywords": [], "search_volume": {}}
            }
        }
