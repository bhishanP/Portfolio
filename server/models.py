from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProjectSchema(BaseModel):
    # --- Compulsory Fields ---
    title: str = Field(..., min_length=1)
    slug: str = Field(..., description="Unique URL identifier (e.g., 'autism-prediction')")
    summary: str = Field(..., max_length=500, description="Short description for the home page card")
    thumbnail_url: str = Field(..., description="Main image for the card")
    tech_stack: List[str] = Field(..., description="Technologies used")
    
    # --- Categorization & Track ---
    track: str = Field(default="Both", description="Category track: 'Industry', 'Research', or 'Both'")
    paper_link: Optional[str] = None # ArXiv, preprint, or whitepaper link

    # --- Optional / Detailed Fields ---
    gallery_images: List[str] = []  # List of URLs for a slideshow
    video_url: Optional[str] = None # URL to a demo video
    
    accomplishments: List[str] = []  # List of accomplishment points
    notable_features: List[str] = []
    future_improvements: List[str] = []
    project_highlights: List[str] = []
    
    live_link: Optional[str] = None
    github_link: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.now)

class StatItem(BaseModel):
    label: str
    value: str

class ProfileSchema(BaseModel):
    # Badges & Real-time Status
    availability_badge: str = "Available for Hire"
    collaboration_status: str = "Actively Searching for Researcher for collaboration"
    current_status: str = "Open to Work"
    
    # Hero Copy
    hero_title_prefix: str = "Hi, I'm"
    hero_name: str = "Bhishan"
    hero_subtitle: str = "AI Engineer & Machine Learning Researcher"
    hero_bio: str = "Bridging production-grade software engineering and applied machine learning research. Building intelligent systems from conceptual research to scalable deployment."
    
    # Dual Focus Tracks (Industry & Research)
    industry_summary: str = "Full-stack development, scalable backend architecture, and production-ready machine learning services engineered for industry scale."
    research_summary: str = "Exploring natural language processing, LLM domain fine-tuning (PEFT/LoRA), retrieval-augmented architectures, and clinical AI diagnostics."
    
    # Research Interests (tags)
    research_interests: List[str] = [
        "LLMs & Parameter-Efficient Fine-Tuning (PEFT/LoRA)",
        "Domain-Specific Retrieval-Augmented Generation (RAG)",
        "Constitutional AI & Domain Adaptation",
        "Clinical & Medical AI Diagnostics",
        "Cryptographic Integrity & Decentralized Systems"
    ]
    
    # Hero Stats
    stats: List[StatItem] = [
        StatItem(label="Years Coding", value="4+"),
        StatItem(label="Projects Done", value="11+"),
        StatItem(label="Research Domains", value="4+")
    ]
    
    # Image
    hero_image_url: str = "https://bhishanpangeni.com.np/images/BhishanPangeni_photo_half.jpg"
    
    # Research Collaboration Section Banner
    show_collab_banner: bool = True
    collab_banner_title: str = "Interested in Research Collaboration?"
    collab_banner_text: str = "I am actively seeking researchers, co-authors, and lab collaborators for empirical machine learning studies, paper submissions, and open-source benchmarks. If you're working on NLP, healthcare AI, or applied deep learning, let's talk!"
    contact_email: str = "bhishanpangeni2003@gmail.com"

class ResumeSchema(BaseModel):
    url: str
    updated_at: datetime = Field(default_factory=datetime.now)

class UserLogin(BaseModel):
    username: str
    password: str

class SkillSchema(BaseModel):
    category: str
    items: List[str]
