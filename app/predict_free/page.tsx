"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, AlertTriangle, X, ArrowLeft } from "lucide-react"

const allSymptoms = [
  "abdominal_pain","abnormal_menstruation","acidity","acute_liver_failure","altered_sensorium","anxiety","back_pain","belly_pain","blackheads","bladder_discomfort","blister","blood_in_sputum","bloody_stool","blurred_and_distorted_vision","breathlessness","brittle_nails","bruising","burning_micturition","chest_pain","chills","cold_hands_and_feets","coma","congestion","constipation","continuous_feel_of_urine","continuous_sneezing","cough","cramps","dark_urine","dehydration","depression","diarrhoea","dischromic _patches","distention_of_abdomen","dizziness","drying_and_tingling_lips","enlarged_thyroid","excessive_hunger","extra_marital_contacts","family_history","fast_heart_rate","fatigue","fluid_overload","foul_smell_of urine","headache","high_fever","hip_joint_pain","history_of_alcohol_consumption","increased_appetite","indigestion","inflammatory_nails","internal_itching","irregular_sugar_level","irritability","irritation_in_anus","itching","joint_pain","knee_pain","lack_of_concentration","lethargy","loss_of_appetite","loss_of_balance","loss_of_smell","malaise","mild_fever","mood_swings","movement_stiffness","mucoid_sputum","muscle_pain","muscle_wasting","muscle_weakness","nausea","neck_pain","nodal_skin_eruptions","obesity","pain_behind_the_eyes","pain_during_bowel_movements","pain_in_anal_region","painful_walking","palpitations","passage_of_gases","patches_in_throat","phlegm","polyuria","prominent_veins_on_calf","puffy_face_and_eyes","pus_filled_pimples","receiving_blood_transfusion","receiving_unsterile_injections","red_sore_around_nose","red_spots_over_body","redness_of_eyes","restlessness","runny_nose","rusty_sputum","scurring","shivering","silver_like_dusting","sinus_pressure","skin_peeling","skin_rash","slurred_speech","small_dents_in_nails","spinning_movements","spotting_ urination","stiff_neck","stomach_bleeding","stomach_pain","sunken_eyes","sweating","swelled_lymph_nodes","swelling_joints","swelling_of_stomach","swollen_blood_vessels","swollen_extremeties","swollen_legs","throat_irritation","toxic_look_(typhos)","ulcers_on_tongue","unsteadiness","visual_disturbances","vomiting","watering_from_eyes","weakness_in_limbs","weakness_of_one_body_side","weight_gain","weight_loss","yellow_crust_ooze","yellow_urine","yellowing_of_eyes","yellowish_skin"
];

export default function FreePredictPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const searchRef = useRef<HTMLInputElement>(null)

  // Filter symptoms for live dropdown
  const filteredSymptoms = allSymptoms.filter(
    (s) =>
      s.toLowerCase().includes(search.toLowerCase()) &&
      !symptoms.includes(s)
  ).slice(0, 10) // Show max 10

  const handleAddSymptom = (symptom: string) => {
    setSymptoms((prev) => [...prev, symptom])
    setSearch("")
    setDropdownOpen(false)
    if (searchRef.current) searchRef.current.focus()
  }

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== symptom))
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setPrediction(null)
    try {
      const response = await fetch("/api/predict-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptom_names: symptoms }),
      })
      const result = await response.json()
      setPrediction(result)
      setStep(2)
    } catch {
      setPrediction({
        primaryDiagnosis: "Analysis Error",
        confidence: 0,
        rankedPredictions: [],
      })
      setStep(2)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setPrediction(null)
    setIsAnalyzing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 relative">
      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80 transition-opacity animate-fade-in">
          <div className="relative flex items-center justify-center h-32 w-32">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="z-10 animate-spin"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#2563eb"
                strokeWidth="4"
                strokeDasharray="60"
                strokeDashoffset="20"
                fill="none"
              />
            </svg>
          </div>
          <div className="mt-4 text-blue-700 font-semibold text-lg">Analyzing symptoms...</div>
        </div>
      )}

      <Card className="w-full max-w-xl transition-all duration-500">
        {step === 1 && (
          <div className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-6 w-6 mr-2 text-blue-600" />
                Free Disease Prediction
              </CardTitle>
              <CardDescription>
                Search and select your symptoms below. Get an instant AI-based prediction. No personal info required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Searchable symptom selector */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Search symptom (e.g. headache)..."
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value)
                      setDropdownOpen(true)
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  />
                  {dropdownOpen && search && filteredSymptoms.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-48 overflow-auto shadow">
                      {filteredSymptoms.map(symptom => (
                        <li
                          key={symptom}
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                          onMouseDown={() => handleAddSymptom(symptom)}
                        >
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Selected symptoms as badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {symptoms.map(symptom => (
                    <Badge key={symptom} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {symptom}
                      <button
                        type="button"
                        className="ml-1 text-blue-500 hover:text-red-500"
                        onClick={() => handleRemoveSymptom(symptom)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full mb-4"
                disabled={symptoms.length === 0 || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? "Analyzing..." : "Predict Disease"}
              </Button>
            </CardContent>
          </div>
        )}

        {step === 2 && prediction && (
          <div className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-600" />
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="mb-4 flex items-center"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Symptom Selection
              </Button>
              <div>
                <div className="font-semibold text-lg mb-2">
                  Primary Diagnosis: {prediction.primaryDiagnosis}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                  <Progress value={Math.round(prediction.confidence * 100)} className="flex-1 max-w-xs" />
                  <span className="text-sm font-medium ml-2">{Math.round(prediction.confidence * 100)}%</span>
                </div>
              </div>
              {prediction.rankedPredictions && prediction.rankedPredictions.length > 0 && (
                <div className="mt-4">
                  <div className="font-semibold mb-2">Other Possible Conditions:</div>
                  <ul className="list-decimal ml-6">
                    {prediction.rankedPredictions.slice(0, 10).map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.disease} ({Math.round(item.confidence * 100)}%)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Card className="border-orange-200 bg-orange-50 mt-6">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800">
                      <strong>Medical Disclaimer:</strong> This AI prediction is for informational purposes only and
                      should not replace professional medical advice. Please consult with a qualified healthcare
                      provider for proper diagnosis and treatment.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </div>
        )}
      </Card>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  )
}