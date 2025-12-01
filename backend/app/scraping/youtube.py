import yt_dlp
from typing import Dict, Any

def scrape_youtube(url: str) -> Dict[str, Any]:
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True, # Fast extraction
        'dump_single_json': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract comments if available (yt-dlp might not get comments in flat mode)
            # For deep analysis we might need non-flat, but speed is key.
            # Let's try to get some basic info.
            
            return {
                "platform": "youtube",
                "title": info.get("title", ""),
                "description": info.get("description", ""),
                "view_count": info.get("view_count", 0),
                "like_count": info.get("like_count", 0),
                "comment_count": info.get("comment_count", 0),
                "tags": info.get("tags", []),
                "comments": [] # yt-dlp flat doesn't return comments. 
                               # For a "death march", we might skip actual comment scraping 
                               # unless we use a specific extractor or API.
                               # I'll mock comments for now if empty to ensure the pipeline works,
                               # or rely on description/tags.
            }
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"YouTube Scrape Error: {e}")
        return {}
