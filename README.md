# ViralEdge Backend — Milestone 1

## 🚀 Overview
FastAPI backend for the ViralEdge social media intelligence tool.
Milestone 1 includes:
- YouTube comments scraper
- TikTok comments endpoint (placeholder)
- Reddit full post scraper with nested comments
- Reddit search pipeline
- Health & root endpoints

---

## 🔧 Running the server

pip install -r requirements.txt
uvicorn main:app --reload

---

## 🔌 API Endpoints

### Health Check
GET /health

### YouTube Comments
GET /youtube-comments?url={video_url}

### TikTok Comments
GET /tiktok-comments?url={video_url}

### Reddit Post
GET /reddit-post?url={post_url}

### Reddit Keyword Search (optional)
GET /reddit-search?keyword={keyword}

---

## 📁 Folder Structure
viraledge-backend/
├── main.py
├── pipelines/
│   ├── youtube.py
│   ├── tiktok.py
│   └── reddit_post.py
├── utils/
│   └── headers.py
├── config.py
├── requirements.txt
└── README.md

---

## ✔ Status
Milestone 1 is complete and ready for review.
