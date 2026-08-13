from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.v1 import router 
import app.models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Acreage API",
    description="Vacation Rental Marketplace API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                    
        "https://acreage-seven.vercel.app",        
        "https://acreage.vercel.app",              
        "https://acreage-wek1.onrender.com",        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Welcome to Acreage API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}