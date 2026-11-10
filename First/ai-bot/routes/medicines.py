from fastapi import APIRouter, HTTPException
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Import your schema and initialized LLM
from schemas.patient import PatientData
from llm.groq_model import llm

# Create a router instance
router = APIRouter()

@router.post("/generate-medicines")
async def generate_medicines(patient: PatientData):
    try:
        # Format the medical history array into a readable string
        history_str = ", ".join(patient.medical_history)
        
        # Create a structured prompt template
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert medical AI assistant. Based on the provided medical history, suggest standard required medicines, supplements, or treatments. Include a disclaimer that this is AI-generated advice and they should consult a doctor. Format the output clearly."),
            ("human", "Patient Name: {name}\nMedical History: {history}\n\nWhat medicines or treatments are recommended?")
        ])
        
        # Chain the prompt, model, and output parser
        chain = prompt | llm | StrOutputParser()
        
        # Execute the chain
        response = chain.invoke({
            "name": patient.name,
            "history": history_str
        })
        
        return {
            "patient_name": patient.name,
            "medical_history": patient.medical_history,
            "suggested_medicines": response
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))