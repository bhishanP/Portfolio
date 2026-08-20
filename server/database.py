import certifi
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_DETAILS, tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=5000)
database = client.portfolio_db
project_collection = database.get_collection("projects")
admin_collection = database.get_collection("admins")
resume_collection = database.get_collection("resumes")
skills_collection = database.get_collection("skills")