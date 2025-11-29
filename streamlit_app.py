import streamlit as st
import time
from datetime import datetime
import asyncio
import pandas as pd
from pipelines.youtube import fetch_youtube_comments
from utils.nlp_utils import analyze_comments
from m3_ideas import generate_m3

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="ViralEdge M3",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- CUSTOM CSS ---
st.markdown("""
<style>
    /* Main Background */
    .stApp {
        background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
        color: white;
        font-family: 'Inter', sans-serif;
    }
    
    /* Hero Text */
    .hero-text {
        text-align: center;
        font-size: 3.5rem;
        font-weight: 800;
        background: -webkit-linear-gradient(45deg, #00f2ff, #ff0099);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.5rem;
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    /* Subtitle */
    .subtitle {
        text-align: center;
        font-size: 1.2rem;
        color: #e0e0e0;
        margin-bottom: 3rem;
    }

    /* Input Box */
    .stTextInput > div > div > input {
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid #00f2ff;
        border-radius: 10px;
        padding: 10px;
        font-size: 1.1rem;
    }
    
    /* Buttons */
    .stButton > button {
        background: linear-gradient(90deg, #00f2ff, #ff0099);
        color: white;
        border: none;
        border-radius: 30px;
        padding: 12px 30px;
        font-size: 1.1rem;
        font-weight: bold;
        transition: transform 0.2s, box-shadow 0.2s;
        width: 100%;
    }
    .stButton > button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(0, 242, 255, 0.6);
    }

    /* Cards */
    .result-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
    }
    
    /* Metrics */
    .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: #00f2ff;
    }
    
    /* Tags */
    .tag {
        display: inline-block;
        background: rgba(255, 0, 153, 0.2);
        border: 1px solid #ff0099;
        color: white;
        padding: 5px 15px;
        border-radius: 20px;
        margin: 5px;
        font-size: 0.9rem;
    }

    /* Credits Display */
    .credits-display {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.6);
        padding: 10px 20px;
        border-radius: 20px;
        border: 1px solid #ff0099;
        z-index: 1000;
    }

    /* Animations */
    @keyframes glow {
        from { text-shadow: 0 0 10px rgba(0, 242, 255, 0.5); }
        to { text-shadow: 0 0 20px rgba(255, 0, 153, 0.5); }
    }
    
    /* Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
    }
    .stTabs [data-baseweb="tab"] {
        background-color: rgba(255,255,255,0.05);
        border-radius: 10px;
        color: white;
        padding: 10px 20px;
    }
    .stTabs [aria-selected="true"] {
        background-color: #ff0099 !important;
        color: white !important;
    }
</style>
""", unsafe_allow_html=True)

# --- SESSION STATE ---
if 'credits' not in st.session_state:
    st.session_state.credits = 3
if 'user_tier' not in st.session_state:
    st.session_state.user_tier = 'Free'
if 'history' not in st.session_state:
    st.session_state.history = []
if 'show_upgrade_modal' not in st.session_state:
    st.session_state.show_upgrade_modal = False
if 'current_report' not in st.session_state:
    st.session_state.current_report = None

# --- HELPER FUNCTIONS ---
def analyze_video(url):
    try:
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        status_text.text("Fetching comments...")
        progress_bar.progress(20)
        
        # 1. Fetch Comments
        comments_data = fetch_youtube_comments(url, limit=200)
        if "error" in comments_data:
            return None, comments_data["error"]
            
        progress_bar.progress(50)
        status_text.text("Analyzing sentiment & viral patterns...")
        
        # 2. NLP Analysis (M2)
        m2 = analyze_comments(comments_data["comments"], url)
        
        progress_bar.progress(80)
        status_text.text("Generating viral concepts with DeepSeek-V3...")
        
        # 3. Idea Generation (M3)
        m3 = generate_m3(m2)
        
        progress_bar.progress(100)
        status_text.empty()
        
        return {
            "m2_analysis": {
                "topics": m2["topics"],
                "questions": m2["questions"],
                "sentiment": m2["sentiment"],
                "engagement": m2["engagement"],
                "trend_probability": m2["viral_score"]
            },
            "m3_generation": m3,
            "video_url": url,
            "generated_at": datetime.utcnow().isoformat()
        }, None
        
    except Exception as e:
        return None, str(e)

def generate_production_report(idea, m3_data):
    """Generates a detailed production blueprint for a selected idea."""
    format_type = m3_data["content_category_classifier"]["best_format"]
    keywords = m3_data["seo_keyword_generator"]["primary_keywords"]
    patterns = m3_data["viral_pattern_detection"]["detected_patterns"]
    
    report = f"""
    # 🎬 PRODUCTION BLUEPRINT
    
    ## 🎯 Concept: {idea}
    **Format:** {format_type}
    **Viral Pattern:** {patterns[0] if patterns else 'General Trend'}
    
    ---
    
    ## 🔑 SEO Strategy
    **Primary Keywords:** {', '.join(keywords[:3])}
    **Title Structure:** [Adjective] + [Keyword] + [Benefit]
    
    ---
    
    ## 📝 Script Outline ({format_type})
    
    **1. The Hook (0-3s):**
    "Stop scrolling if you care about {keywords[0] if keywords else 'this topic'}..."
    *(Visual: Fast cuts, text overlay)*
    
    **2. The Problem (3-15s):**
    "Most people think {patterns[0] if patterns else 'this'} is true, but here's the reality..."
    
    **3. The Solution/Value (15-45s):**
    - Point 1: [Explain key insight]
    - Point 2: [Show proof/example]
    - Point 3: [Actionable tip]
    
    **4. The CTA (45-60s):**
    "Comment '{keywords[0].split()[0] if keywords else 'YES'}' for my full guide."
    
    ---
    
    *Generated by Agentic Eye via DeepSeek-V3*
    """
    return report

def show_upgrade_modal():
    with st.container():
        st.markdown("""
        <div style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.9); z-index: 9999; 
            display: flex; align-items: center; justify-content: center;
            flex-direction: column;
        ">
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e); 
                padding: 40px; border-radius: 20px; border: 2px solid #ff0099;
                text-align: center; max-width: 600px;
            ">
                <h1 style="color: #ff0099; font-size: 3rem; margin-bottom: 10px;">⚠️ OUT OF CREDITS</h1>
                <p style="font-size: 1.5rem; margin-bottom: 30px;">
                    You've used all your free analyses.<br>
                    Upgrade to <b>Diamond</b> to unlock the content empire machine.
                </p>
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px; text-align: left;">
                    <h3 style="color: #00f2ff;">💎 Diamond Plan ($20/mo)</h3>
                    <ul style="list-style: none; padding: 0; font-size: 1.1rem;">
                        <li>✅ 100 Analyses / Month</li>
                        <li>✅ Priority Processing</li>
                        <li>✅ Full History Access</li>
                        <li>✅ Viral Score Predictions</li>
                    </ul>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns([1, 1])
        with col1:
            if st.button("💎 UPGRADE NOW ($20)", key="upgrade_btn_modal"):
                st.session_state.user_tier = "Diamond"
                st.session_state.credits = 100
                st.session_state.show_upgrade_modal = False
                st.rerun()
        with col2:
            if st.button("Remind me later", key="close_modal"):
                st.session_state.show_upgrade_modal = False
                st.rerun()

# --- MAIN APP ---

# Header
st.markdown(f"""
<div class="credits-display">
    <span style="color: #e0e0e0;">Plan: <b>{st.session_state.user_tier}</b></span> | 
    <span style="color: #00f2ff;">Credits: <b>{st.session_state.credits}</b></span>
</div>
""", unsafe_allow_html=True)

st.markdown('<div class="hero-text">Agentic Eye</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Paste any video link. Get a viral content strategy in seconds.</div>', unsafe_allow_html=True)

# Input
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    video_url = st.text_input("Paste YouTube URL here...", placeholder="https://youtube.com/watch?v=...")
    analyze_btn = st.button("🚀 Analyze Video")

# Analysis Logic
if analyze_btn:
    if not video_url:
        st.warning("Please paste a valid URL first.")
    elif st.session_state.credits <= 0:
        st.session_state.show_upgrade_modal = True
        st.rerun()
    else:
        st.session_state.credits -= 1
        result, error = analyze_video(video_url)
        
        if error:
            st.error(f"Analysis Failed: {error}")
            st.session_state.credits += 1
        else:
            st.session_state.history.append(result)
            st.session_state.current_result = result # Store for display
            st.rerun() # Rerun to show results

# Display Results (if available)
if 'current_result' in st.session_state:
    res = st.session_state.current_result
    m2 = res["m2_analysis"]
    m3 = res["m3_generation"]
    
    st.markdown("---")
    
    # 1. Top Level Metrics
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        score = m3["viral_prediction_engine"]["score"]
        st.markdown(f"""
        <div class="result-card" style="text-align: center;">
            <div style="color: #888;">Viral Score</div>
            <div class="metric-value" style="color: #ff0099;">{score}/100</div>
            <div style="font-size: 0.8rem; color: #00f2ff;">{m3["viral_prediction_engine"]["category"]} Potential</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        sentiment = m2["sentiment"]["positive"]
        st.markdown(f"""
        <div class="result-card" style="text-align: center;">
            <div style="color: #888;">Positive Vibe</div>
            <div class="metric-value">{sentiment}%</div>
            <div style="font-size: 0.8rem;">Audience Sentiment</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        comments_count = m2["engagement"]["comments_count"]
        st.markdown(f"""
        <div class="result-card" style="text-align: center;">
            <div style="color: #888;">Engagement</div>
            <div class="metric-value">{comments_count}</div>
            <div style="font-size: 0.8rem;">Active Comments</div>
        </div>
        """, unsafe_allow_html=True)
    with c4:
        best_format = m3["content_category_classifier"]["best_format"]
        st.markdown(f"""
        <div class="result-card" style="text-align: center;">
            <div style="color: #888;">Best Format</div>
            <div class="metric-value" style="font-size: 1.5rem; margin-top: 10px;">{best_format}</div>
            <div style="font-size: 0.8rem;">Recommended</div>
        </div>
        """, unsafe_allow_html=True)

    # 2. Deep Dive Tabs
    tab1, tab2, tab3, tab4 = st.tabs(["🔥 Viral Insights", "💡 Content Strategy", "🔑 SEO Vault", "🎬 Production Report"])
    
    with tab1:
        col_a, col_b = st.columns(2)
        with col_a:
            st.subheader("Detected Patterns")
            for p in m3["viral_pattern_detection"]["detected_patterns"]:
                st.markdown(f"- **{p}**")
            
            st.subheader("Why it's Viral?")
            for r in m3["viral_prediction_engine"]["reasons"]:
                st.markdown(f"✅ {r}")
                
        with col_b:
            st.subheader("Top Topics")
            topics_html = ""
            for t in m2["topics"][:8]:
                topics_html += f'<span class="tag">{t["topic"]}</span>'
            st.markdown(topics_html, unsafe_allow_html=True)
            
            st.subheader("Real User Questions (Goldmine)")
            for q in m2["questions"][:5]:
                st.info(f"❓ \"{q['text']}\"")

    with tab2:
        st.subheader("AI Recommendations (Next Best Content)")
        
        ideas = m3["ai_recommendations"]["next_best_content"]
        selected_idea = st.radio("Select an idea to generate a report:", ideas)
        
        st.markdown("### Alternative Formats")
        st.write(", ".join(m3["content_category_classifier"]["alternative_formats"]))
        st.info(f"**Strategy Note:** {m3['content_category_classifier']['reason']}")

    with tab3:
        st.subheader("High Volume Keywords")
        keywords = m3["seo_keyword_generator"]["primary_keywords"]
        volumes = m3["seo_keyword_generator"]["search_volume"]
        
        # Create a nice table
        data = []
        for k in keywords:
            vol = volumes.get(k, "N/A")
            data.append({"Keyword": k, "Search Volume": vol})
        
        st.table(pd.DataFrame(data))
        
        st.subheader("Secondary Keywords")
        st.write(", ".join(m3["seo_keyword_generator"]["secondary_keywords"]))

    with tab4:
        st.subheader("🎬 Production Blueprint Generator")
        st.markdown("Turn your selected idea into a step-by-step filming guide.")
        
        if st.button("📄 Generate Report for Selected Idea"):
            report = generate_production_report(selected_idea, m3)
            st.session_state.current_report = report
        
        if st.session_state.current_report:
            st.markdown("---")
            st.markdown(st.session_state.current_report)
            st.download_button(
                label="📥 Download Report as Markdown",
                data=st.session_state.current_report,
                file_name="viral_production_report.md",
                mime="text/markdown"
            )

# Upgrade Modal Trigger
if st.session_state.show_upgrade_modal:
    show_upgrade_modal()
