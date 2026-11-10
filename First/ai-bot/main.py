from fastapi import FastAPI
from routes.medicines import router as medicines_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Medical AI Bot - Modular")

origins = [
    "http://localhost:3000",      # React/Next.js default development port
    "http://127.0.0.1:3000",
    "http://localhost:5173",      # Vite default development port
    "http://127.0.0.1:5173",
    # "*" # Uncomment to allow any origin
]

# 2. Add the CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # List of origins that are allowed to make requests
    allow_credentials=True,       # Allow cookies and credentials
    allow_methods=["*"],          # Allow all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],          # Allow all headers
)

# Register the router(s)
app.include_router(medicines_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

