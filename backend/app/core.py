import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "AgenticEye"
    API_V1_STR: str = "/api/v1"
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    DEEPSEEK_MODEL: str = "deepseek/deepseek-chat"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()
