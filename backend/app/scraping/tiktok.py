import yt_dlp
from typing import Dict, Any

def scrape_tiktok(url: str) -> Dict[str, Any]:
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
        'dump_single_json': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            return {
                "platform": "tiktok",
                "title": info.get("title", ""),
                "description": info.get("description", ""),
                "view_count": info.get("view_count", 0),
                "like_count": info.get("like_count", 0),
                "comment_count": info.get("comment_count", 0),
                "tags": info.get("tags", []),
                "comments": []
            }
    except Exception as e:
        print(f"TikTok Scrape Error: {e}")
        return {}
