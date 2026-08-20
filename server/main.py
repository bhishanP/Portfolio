from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import ProjectSchema, ResumeSchema, UserLogin, SkillSchema
from database import project_collection, admin_collection, resume_collection, skills_collection
from fastapi import UploadFile, File
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from datetime import datetime, timedelta
from security import verify_password, create_access_token, decode_access_token
from typing import List

load_dotenv()

cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET") 
)
app = FastAPI()

# Allow your React app to talk to this backend
origins = [
    "http://localhost:5173",  # Local React
    "https://bhishanpangeni.com.np",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Public Routes ---

# Health check or root endpoint
@app.get("/health")
async def health_check():
    return {"message": "Welcome to the Portfolio API"}

@app.get("/api/projects")
async def get_projects():
    projects = []
    async for project in project_collection.find():
        project["_id"] = str(project["_id"])
        projects.append(project)
    return projects

@app.get("/api/projects/{slug}")
async def get_project_by_slug(slug: str):
    project = await project_collection.find_one({"slug": slug})
    if project:
        project["_id"] = str(project["_id"])
        return project
    raise HTTPException(status_code=404, detail="Project not found")

# --- Admin/Secure Routes (Simplified) ---

ADMIN_USER = os.getenv("ADMIN_USER")
ADMIN_HASHED_PASS = os.getenv("ADMIN_HASHED_PASS")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def verify_token(token: str = Depends(oauth2_scheme)):
    username = decode_access_token(token)

    if username is None or username != ADMIN_USER:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return username


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USER:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, ADMIN_HASHED_PASS):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": ADMIN_USER},
        expires_delta=timedelta(minutes=60)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/projects")
async def create_project(project: ProjectSchema, username: str = Depends(verify_token)):
    new_project = await project_collection.insert_one(project.dict())
    return {"id": str(new_project.inserted_id)}

@app.put("/api/projects/{slug}")
async def update_project(slug: str, project: ProjectSchema, username: str = Depends(verify_token)):
    result = await project_collection.update_one(
        {"slug": slug},
        {"$set": project.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated", "modified_count": result.modified_count}

@app.delete("/api/projects/{slug}")
async def delete_project(slug: str, username: str = Depends(verify_token)):
    await project_collection.delete_one({"slug": slug})
    return {"message": "Deleted"}

# --- Helper: Upload to Cloudinary ---
async def upload_file_to_cloud(file: UploadFile, folder: str):
    await file.seek(0)
    
    # 2. Read the actual bytes
    content = await file.read()
    
    # 3. Upload the bytes directly
    result = cloudinary.uploader.upload(
        content, 
        folder=f"portfolio/{folder}", 
        resource_type="auto"
    )
    
    return result.get("secure_url")

# --- Routes ---

@app.post("/api/upload")
async def upload_media(file: UploadFile = File(...), username: str = Depends(verify_token)):
    """Generic upload endpoint for Admin panel to get a URL back"""
    url = await upload_file_to_cloud(file, "uploads")
    return {"url": url}

@app.post("/api/resume")
async def update_resume(file: UploadFile = File(...), username: str = Depends(verify_token)):
    """Specific endpoint to handle resume PDF upload"""
    url = await upload_file_to_cloud(file, "resume")
    await resume_collection.update_one(
        {"_id": "resume"}, 
        {"$set": {"url": url, "updated_at": datetime.now()}}, 
        upsert=True
    )
    return {"url": url}

@app.get("/api/resume")
async def get_resume():
    doc = await resume_collection.find_one({"_id": "resume"})
    if not doc:
        return {"url": "#", "message": "No resume uploaded yet"}
    return {"url": doc["url"]}

@app.get("/api/skills")
async def get_skills():
    # Fetch the single skills document
    doc = await skills_collection.find_one({"_id": "skills"})
    if not doc:
        return []
    return doc.get("data", [])

@app.post("/api/skills")
async def update_skills(skills: List[SkillSchema]):
    # Overwrite the existing skills document
    await skills_collection.update_one(
        {"_id": "skills"},
        {"$set": {"data": [skill.dict() for skill in skills]}},
        upsert=True
    )
    return {"message": "Skills updated successfully"}