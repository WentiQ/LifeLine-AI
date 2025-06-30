import sys
import json
import pickle

if len(sys.argv) < 2:
    print("No symptoms provided.")
    sys.exit(1)

try:
    symptoms = json.loads(sys.argv[1])
except Exception as e:
    print(f"Invalid JSON input: {e}")
    sys.exit(1)

with open("symptom_diagnosis_model.pkl", "rb") as f:
    model = pickle.load(f)
with open("symptom_map.pkl", "rb") as f:
    symptom_map = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

X = [1 if s in symptoms else 0 for s in symptom_map]
pred = model.predict([X])
disease = label_encoder.inverse_transform(pred)[0]
confidence = max(model.predict_proba([X])[0]) * 100

output = {
    "symptoms": [disease],
    "confidence": confidence
}

print(json.dumps(output, indent=2))