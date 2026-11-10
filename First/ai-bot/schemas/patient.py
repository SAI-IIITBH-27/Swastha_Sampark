from pydantic import BaseModel
from typing import List

class PatientData(BaseModel):
    name: str
    medical_history: List[str]