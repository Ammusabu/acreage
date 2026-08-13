from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
import app.models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Acreage API",
    description="Vacation Rental Marketplace API",
    version="1.0.0",
)

# CORS configuration - UPDATE THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local development
        "https://acreage-seven.vercel.app", # Your Vercel frontend URL
        "https://acreage.vercel.app",      # Your other Vercel URL
        "https://acreage-wek1.onrender.com", # Your Render backend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Acreage API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}