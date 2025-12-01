from pipelines.youtube import fetch_youtube_comments

url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
print(f"Testing {url}")
result = fetch_youtube_comments(url, limit=10)
print(result)
