import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables early
load_dotenv()

if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY is not set in the .env file")

# Initialize the Groq model instance
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    temperature=0.2, 
    api_key=os.getenv("GROQ_API_KEY")
)