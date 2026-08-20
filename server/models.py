from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from datetime import datetime

class ProjectSchema(BaseModel):
    # --- Compulsory Fields ---
    title: str = Field(..., min_length=1)
    slug: str = Field(..., description="Unique URL identifier (e.g., 'autism-prediction')")
    summary: str = Field(..., max_length=300, description="Short description for the home page card")
    thumbnail_url: str = Field(..., description="Main image for the card")
    tech_stack: List[str] = Field(..., description="Technologies used")
    
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

    class Config:
        json_schema_extra = {
            "example": {
                "title": "BaghChal Game",
                "slug": "bagh-chal",
                "summary": "A digital version of the traditional Nepali board game.",
                "thumbnail_url": "https://res.cloudinary.com/.../baghchal.jpg",
                "tech_stack": ["Python", "PyGame", "Minimax Algorithm"],
                "notable_features": ["AI Opponent", "Multiplayer support"]
            }
        }

class ResumeSchema(BaseModel):
    url: str
    updated_at: datetime = Field(default_factory=datetime.now)

class UserLogin(BaseModel):
    username: str
    password: str

class SkillSchema(BaseModel):
    category: str  # e.g., "Programming Languages"
    items: List[str] # e.g., ["Python", "JavaScript", "C++"]