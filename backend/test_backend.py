import asyncio
from pipelines.youtube import fetch_youtube_comments
from utils.nlp_utils import analyze_comments
from m3_ideas import generate_m3
import os

# Mock config if needed
os.environ["AIMLAPI_API_KEY"] = "120fff974340473bbc99109a51b3a293"

async def test():
    url = "https://www.youtube.com/watch?v=9bZkp7q19f0" # Gangnam Style or something popular
    print(f"Testing fetch for {url}...")
    
    try:
        comments_data = await asyncio.to_thread(fetch_youtube_comments, url, limit=50)
        if "error" in comments_data:
            print("Scraping Error:", comments_data["error"])
            return
            
        print(f"Fetched {comments_data['comments_count']} comments.")
        
        print("Running NLP...")
        m2 = analyze_comments(comments_data["comments"], url)
        print("NLP Stats:", m2["sentiment"])
        
        print("Running M3 Generation...")
        m3 = generate_m3(m2)
        print("M3 Result Keys:", m3.keys())
        print("Success!")
        
    except Exception as e:
        print(f"Test Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
