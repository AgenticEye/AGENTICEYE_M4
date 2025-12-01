from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class VideoBlueprint(BaseModel):
    hooks: List[str]
    script_mini: str
    voiceover: Dict[str, str]
    scene_directions: List[str]

class ContentIdea(BaseModel):
    title: str
    score: int
    blueprint: VideoBlueprint

class AiRecommendations(BaseModel):
    next_best_content: List[ContentIdea]

class ViralPrediction(BaseModel):
    score: int
    category: str
    reasons: List[str]

class SeoGenerator(BaseModel):
    primary_keywords: List[str]
    secondary_keywords: List[str]
    search_volume: Dict[str, str]

class AnalysisResponse(BaseModel):
    viral_prediction_engine: ViralPrediction
    ai_recommendations: AiRecommendations
    seo_keyword_generator: SeoGenerator
    generated_by: str

class AnalyzeRequest(BaseModel):
    url: str
    tier: str = "Free"  # Free, Diamond, Solitaire
