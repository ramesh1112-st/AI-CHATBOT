from google import genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import time

# Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found!")

print("API KEY LOADED")
print("KEY LENGTH =", len(api_key))

# Gemini Client
client = genai.Client(api_key=api_key)

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


# Health Check
@app.get("/")
def home():
    return {
        "message": "AI Chatbot Backend Running Successfully"
    }


# Chat Endpoint
@app.post("/chat")
def chat(req: ChatRequest):

    print("User Message:", req.message)

    # Retry Gemini request up to 3 times
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=req.message
            )

            print("Gemini Success")

            return {
                "reply": response.text
            }

        except Exception as e:
            print(f"Attempt {attempt + 1} Failed")
            print("ERROR:", repr(e))

            if attempt < 2:
                time.sleep(2)

    return {
        "reply": "⚠️ AI service is currently busy. Please try again in a few seconds."
    }