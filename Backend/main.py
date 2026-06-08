from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
print("API KEY =", os.getenv("GEMINI_API_KEY"))

print("KEY LENGTH =", len(os.getenv("GEMINI_API_KEY")))

# Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# FastAPI App
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class ChatRequest(BaseModel):
    message: str

# Chat Endpoint
@app.post("/chat")
def chat(req: ChatRequest):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=req.message
        )

        return {
            "reply": response.text
        }

    except Exception as e:
        return {
            "error": str(e)
        }

# Health Check Endpoint
@app.get("/")
def home():
    return {"message": "AI Chatbot Backend Running Successfully"}