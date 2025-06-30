# Save as app.py and run: uvicorn app:app --reload --port 5000
from fastapi import FastAPI, Request
from pydantic import BaseModel
import pickle

app = FastAPI()

# Load your models
with open("symptom_diagnosis_model.pkl", "rb") as f:
    model = pickle.load(f)
with open("symptom_map.pkl", "rb") as f:
    symptom_map = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

class PredictRequest(BaseModel):
    symptoms: list

@app.post("/predict")
async def predict(req: PredictRequest):
    # Convert symptoms to model input
    input_vector = [1 if s in req.symptoms else 0 for s in symptom_map]
    pred = model.predict([input_vector])[0]
    conf = max(model.predict_proba([input_vector])[0]) * 100
    disease = label_encoder.inverse_transform([pred])[0]
    return {"predictedDisease": disease, "confidence": round(conf)}

# Save with protocol=4 for better compatibility
with open("symptom_diagnosis_model.pkl", "wb") as f:
    pickle.dump(model, f, protocol=4)