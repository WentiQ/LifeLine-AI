"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Phone, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

const EMERGENCY_GUIDES: Record<string, any> = {
  "Snake Bite": {
    condition: "Snake Bite",
    immediateActions: {
      dos: [
        { action: "Move away from the snake", priority: "High", timing: "Immediately", reason: "To prevent further bites." },
        { action: "Keep the person still and calm", priority: "High", timing: "Immediately", reason: "Slows venom spread." },
        { action: "Immobilize the bitten limb", priority: "Medium", timing: "As soon as possible", reason: "Reduces venom movement." },
        { action: "Remove tight clothing/jewelry", priority: "Medium", timing: "Immediately", reason: "Prevents swelling issues." },
        { action: "Call emergency services (911)", priority: "High", timing: "Immediately", reason: "Professional help needed." },
      ],
      donts: [
        { action: "Do not suck out venom", priority: "High", reason: "Ineffective and dangerous.", consequence: "Can worsen injury." },
        { action: "Do not apply a tourniquet", priority: "High", reason: "Can cause tissue damage.", consequence: "May lead to amputation." },
        { action: "Do not give the person anything to eat or drink", priority: "Medium", reason: "May complicate treatment.", consequence: "Delays medical care." },
        { action: "Do not cut the wound", priority: "High", reason: "Increases risk of infection.", consequence: "Worsens injury." },
      ],
    },
    stepByStep: [
      { step: 1, instruction: "Move the person to safety", duration: "Immediate", signs: "Snake is gone" },
      { step: 2, instruction: "Keep the person calm and still", duration: "Until help arrives", signs: "Stable breathing, no movement" },
      { step: 3, instruction: "Immobilize the bitten limb at heart level", duration: "Until help arrives", signs: "No movement" },
      { step: 4, instruction: "Remove tight items", duration: "Immediate", signs: "No constriction" },
      { step: 5, instruction: "Call 911", duration: "Immediate", signs: "Help is on the way" },
    ],
    warningSignsigns: {
      deterioration: [
        "Difficulty breathing",
        "Severe swelling",
        "Loss of consciousness",
        "Uncontrollable bleeding",
      ],
      improvement: [
        "Stable vital signs",
        "No progression of swelling",
      ],
      whenToCall911: [
        "Any snake bite",
        "Difficulty breathing",
        "Loss of consciousness",
      ],
    },
    commonMistakes: [
      { mistake: "Applying ice to the bite", whyBad: "Can worsen tissue damage.", instead: "Keep limb at heart level." },
      { mistake: "Trying to catch the snake", whyBad: "Risks more bites.", instead: "Describe the snake to responders." },
    ],
    followUp: {
      immediateNext: "Monitor vital signs and keep the person calm.",
      monitoring: "Watch for signs of shock or allergic reaction.",
      medicalCare: "Antivenom may be needed at the hospital.",
    },
    prevention: {
      futureAvoidance: [
        "Wear boots and long pants in snake areas.",
        "Be cautious in tall grass or under rocks.",
      ],
      riskFactors: [
        "Walking barefoot outdoors",
        "Reaching into hidden areas",
      ],
      preparedness: [
        "Know local emergency numbers",
        "Carry a first aid kit outdoors",
      ],
    },
  },
  "Heart Attack": {
    condition: "Heart Attack",
    immediateActions: {
      dos: [
        { action: "Call emergency services (911)", priority: "High", timing: "Immediately", reason: "Immediate medical help is critical." },
        { action: "Keep the person calm and seated", priority: "High", timing: "Immediately", reason: "Reduces heart strain." },
        { action: "Loosen tight clothing", priority: "Medium", timing: "As soon as possible", reason: "Helps breathing." },
        { action: "Give aspirin if not allergic", priority: "Medium", timing: "If available", reason: "Helps prevent clotting." },
      ],
      donts: [
        { action: "Do not leave the person alone", priority: "High", reason: "They may need help.", consequence: "Delayed response to cardiac arrest." },
        { action: "Do not allow physical activity", priority: "High", reason: "Increases heart strain.", consequence: "Worsens heart damage." },
      ],
    },
    stepByStep: [
      { step: 1, instruction: "Call 911", duration: "Immediate", signs: "Help is on the way" },
      { step: 2, instruction: "Keep the person calm and seated", duration: "Until help arrives", signs: "Stable breathing" },
      { step: 3, instruction: "Loosen tight clothing", duration: "Immediate", signs: "Easier breathing" },
      { step: 4, instruction: "Give aspirin if available", duration: "If not allergic", signs: "Chewed and swallowed" },
    ],
    warningSignsigns: {
      deterioration: [
        "Chest pain spreading to arm/jaw",
        "Shortness of breath",
        "Loss of consciousness",
      ],
      improvement: [
        "Pain subsides",
        "Normal breathing returns",
      ],
      whenToCall911: [
        "Any chest pain lasting >5 min",
        "Loss of consciousness",
      ],
    },
    commonMistakes: [
      { mistake: "Ignoring chest pain", whyBad: "Delays treatment.", instead: "Call 911 immediately." },
    ],
    followUp: {
      immediateNext: "Monitor breathing and pulse.",
      monitoring: "Watch for cardiac arrest.",
      medicalCare: "Hospitalization and further tests.",
    },
    prevention: {
      futureAvoidance: [
        "Manage blood pressure and cholesterol.",
        "Avoid smoking.",
      ],
      riskFactors: [
        "High blood pressure",
        "Smoking",
        "Obesity",
      ],
      preparedness: [
        "Know heart attack symptoms",
        "Keep emergency numbers handy",
      ],
    },
  },
  // ...add similar objects for all other listed emergencies...
}

export default function EmergencyGuidePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [guide, setGuide] = useState<any>(null)
  const [selectedCondition, setSelectedCondition] = useState("")
  // New state to hold the value of the custom emergency condition
  const [customCondition, setCustomCondition] = useState("")
  const [severity, setSeverity] = useState("")
  const [location, setLocation] = useState("")
  const [savedGuides, setSavedGuides] = useState<any[]>([])

  const emergencyConditions = [
    "Snake Bite",
    "Heart Attack",
    "Stroke",
    "Choking",
    "Severe Bleeding",
    "Burns",
    "Poisoning",
    "Allergic Reaction",
    "Seizure",
    "Fracture",
    "Drowning",
    "Electric Shock",
    "Heat Stroke",
    "Hypothermia",
    "Asthma Attack",
    "Diabetic Emergency",
    "Head Injury",
    "Spinal Injury",
    "Other", // Added "Other" to the list
  ]

  const generateGuide = async () => {
    setIsGenerating(true)
    const conditionToSend = selectedCondition === "Other" ? customCondition : selectedCondition

    // If the condition is in the hardcoded list, use it instantly
    if (EMERGENCY_GUIDES[conditionToSend]) {
      setGuide({ ...EMERGENCY_GUIDES[conditionToSend], condition: conditionToSend })
      setIsGenerating(false)
      return
    }

    // Otherwise, use the API for "Other"
    try {
      const response = await fetch("/api/emergency-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: conditionToSend,
          severity,
          location,
          availableResources: ["Phone", "First Aid Kit", "Other People"],
        }),
      })

      if (!response.ok) throw new Error("Failed to generate guide")
      const result = await response.json()
      setGuide({ ...result, condition: conditionToSend })
    } catch (error) {
      console.error("Error generating emergency guide:", error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Determine if the generate button should be disabled
  const isButtonDisabled = isGenerating || !selectedCondition || (selectedCondition === "Other" && !customCondition.trim());


  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedEmergencyGuides")
      if (saved) setSavedGuides(JSON.parse(saved))
    }
  }, [])

  const handleSaveGuide = () => {
    if (guide) {
      const newGuide = {
        ...guide,
        id: uuidv4(),
        savedAt: new Date().toISOString(),
      }
      const updated = [newGuide, ...savedGuides]
      setSavedGuides(updated)
      localStorage.setItem("savedEmergencyGuides", JSON.stringify(updated))
      alert("Guide saved! You can view it later even offline.")
    }
  }

  const handleDeleteGuide = (idx: number) => {
    const updated = savedGuides.filter((_, i) => i !== idx)
    setSavedGuides(updated)
    localStorage.setItem("savedEmergencyGuides", JSON.stringify(updated))
  }

  const handleShareGuide = (guide: any) => {
    const url = `${window.location.origin}/emergency-guide?share=${guide.id}`
    navigator.clipboard.writeText(url)
    alert("Sharable link copied to clipboard!")
  }

  const handleDownloadPDF = (guide: any, idx: number) => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.jsPDF({ unit: "pt", format: "a4" })
      let y = 40
      const left = 40
      const wrapWidth = 500
      const pageHeight = doc.internal.pageSize.height

      function addSectionHeader(text: string, color: [number, number, number] = [239, 68, 68]) {
        doc.setFont("helvetica", "bold")
        doc.setFontSize(15)
        doc.setTextColor(...color)
        doc.text(text, left, y)
        y += 24
        doc.setTextColor(33, 37, 41)
      }
      function addTextBlock(label: string, value: string | string[] | undefined) {
        if (!value || (Array.isArray(value) && value.length === 0)) return
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.text(label, left, y)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        y += 14
        let text = Array.isArray(value) ? value.join(", ") : value
        const lines = doc.splitTextToSize(text, wrapWidth)
        lines.forEach((line: string) => {
          if (y > pageHeight - 40) { doc.addPage(); y = 40 }
          doc.text(line, left + 20, y)
          y += 14
        })
        y += 4
      }
      function addBulletList(items: string[] | undefined, color: [number, number, number] = [33, 37, 41]) {
        if (!items || items.length === 0) return
        doc.setTextColor(...color)
        items.forEach((item) => {
          if (y > pageHeight - 40) { doc.addPage(); y = 40 }
          doc.circle(left + 8, y + 4, 3, "F")
          doc.text(item, left + 20, y + 8)
          y += 18
        })
        doc.setTextColor(33, 37, 41)
        y += 4
      }

      // Title
      doc.setFont("helvetica", "bold")
      doc.setFontSize(20)
      doc.text(`Emergency Guide: ${guide.condition}`, left, y)
      y += 30
      addTextBlock("Saved At:", new Date(guide.savedAt).toLocaleString())

      // Immediate Actions
      addSectionHeader("DO's - Take These Actions", [34, 197, 94])
      guide.immediateActions?.dos?.forEach((action: any) => {
        addTextBlock(`${action.action} (${action.priority})`, `${action.timing} - ${action.reason}`)
      })

      addSectionHeader("DON'Ts - Avoid These Actions", [239, 68, 68])
      guide.immediateActions?.donts?.forEach((action: any) => {
        addTextBlock(`${action.action} (${action.priority})`, `${action.reason}${action.consequence ? " Consequence: " + action.consequence : ""}`)
      })

      // Step by Step
      addSectionHeader("Step-by-Step Instructions", [37, 99, 235])
      guide.stepByStep?.forEach((step: any) => {
        addTextBlock(`Step ${step.step}: ${step.instruction}`, `Duration: ${step.duration} | Watch for: ${step.signs}`)
      })

      // Warning Signs
      addSectionHeader("Warning Signs to Monitor", [251, 191, 36])
      addTextBlock("Signs of Deterioration:", "")
      addBulletList(guide.warningSignsigns?.deterioration, [239, 68, 68])
      addTextBlock("Signs of Improvement:", "")
      addBulletList(guide.warningSignsigns?.improvement, [34, 197, 94])
      addTextBlock("Call 911 If:", "")
      addBulletList(guide.warningSignsigns?.whenToCall911, [251, 191, 36])

      // Common Mistakes
      addSectionHeader("Common Mistakes to Avoid", [239, 68, 68])
      guide.commonMistakes?.forEach((mistake: any) => {
        addTextBlock(`❌ ${mistake.mistake}`, `Why: ${mistake.whyBad} | ✅ Instead: ${mistake.instead}`)
      })

      // Follow-up Care
      addSectionHeader("Follow-up Care", [139, 92, 246])
      addTextBlock("Immediate Next Steps:", guide.followUp?.immediateNext)
      addTextBlock("Monitoring:", guide.followUp?.monitoring)
      addTextBlock("Medical Care:", guide.followUp?.medicalCare)

      // Prevention
      addSectionHeader("Prevention & Preparedness", [34, 197, 94])
      addTextBlock("Future Prevention:", "")
      addBulletList(guide.prevention?.futureAvoidance, [34, 197, 94])
      addTextBlock("Risk Factors:", "")
      addBulletList(guide.prevention?.riskFactors, [239, 68, 68])
      addTextBlock("Be Prepared:", "")
      addBulletList(guide.prevention?.preparedness, [37, 99, 235])

      // Disclaimer
      y += 20
      doc.setFontSize(10)
      doc.setTextColor(200, 100, 0)
      const disclaimer =
        "Disclaimer: This emergency guide is for informational purposes only and should not replace professional emergency medical services. Always call 911 for life-threatening emergencies."
      const disclaimerLines = doc.splitTextToSize(disclaimer, wrapWidth)
      disclaimerLines.forEach((line: string) => {
        doc.text(line, left, y)
        y += 14
      })

      doc.save(`emergency-guide-${guide.condition || idx}.pdf`)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Emergency Guide</h1>
              <p className="text-gray-600">Do's and Don'ts for medical emergencies</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isGenerating && !guide ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">Generating Emergency Guide</h3>
              <p className="text-gray-600 mb-4">
                Our AI is preparing step-by-step emergency instructions for you...
              </p>
              <div className="w-full max-w-md mx-auto mb-6">
                <div className="h-2.5 bg-red-200 rounded-full overflow-hidden relative">
                  <div
                    className="h-2.5 bg-red-600 rounded-full animate-ripple absolute left-0 top-0"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              {/* Emergency Contacts Block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Emergency Services</p>
                    <p className="text-red-700">112</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Poison Control</p>
                    <p className="text-red-700">1-800-222-1222</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800">Crisis Hotline</p>
                    <p className="text-red-700">988</p>
                  </div>
                </div>
              </div>

              <style jsx global>{`
                @keyframes ripple {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                .animate-ripple {
                  animation: ripple 1.2s linear infinite;
                  width: 100%;
                }
              `}</style>
            </CardContent>
          </Card>
        ) : !guide ? (
          <div className="space-y-8">
            {/* Emergency Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
                  Select Emergency Condition
                </CardTitle>
                <CardDescription>Choose the emergency situation to get specific guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Emergency Condition</Label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select emergency condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {emergencyConditions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition === "Other" ? "Other (Please specify below)" : condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                        <SelectItem value="life-threatening">Life-threatening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditionally render the custom condition input field */}
                {selectedCondition === "Other" && (
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="customCondition">Please Specify the Emergency</Label>
                        <Input
                            id="customCondition"
                            value={customCondition}
                            onChange={(e) => setCustomCondition(e.target.value)}
                            placeholder="e.g., Allergic reaction to peanuts"
                            autoFocus
                        />
                    </div>
                )}


                <div className="space-y-2">
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Home, Office, Outdoors, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Emergency Numbers */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Emergency Services</p>
                      <p className="text-red-700">112</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Poison Control</p>
                      <p className="text-red-700">1-800-222-1222</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800">Crisis Hotline</p>
                      <p className="text-red-700">988</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="text-center">
              <Button onClick={generateGuide} size="lg" disabled={isButtonDisabled} className="px-8">
                {isGenerating ? (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2 animate-pulse" />
                    Generating Emergency Guide...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Get Emergency Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Emergency Header */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                {/* Display the correct condition in the title */}
                <CardTitle className="text-red-800 text-2xl">Emergency Guide: {guide.condition}</CardTitle>
                <CardDescription className="text-red-700">
                  Follow these instructions carefully. Call 112 if situation is life-threatening.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Immediate Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* DO's */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    DO's - Take These Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.immediateActions.dos.map((action: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-green-800">{action.action}</h4>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {action.timing}
                        </p>
                        <p className="text-sm text-green-700">{action.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* DON'Ts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <XCircle className="h-6 w-6 mr-2" />
                    DON'Ts - Avoid These Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guide.immediateActions.donts.map((action: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-red-800">{action.action}</h4>
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            {action.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-red-700 mb-1">{action.reason}</p>
                        <p className="text-xs text-red-600">Consequence: {action.consequence}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step by Step Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-blue-600" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guide.stepByStep.map((step: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">{step.instruction}</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-800">Duration:</span>
                            <span className="text-blue-700 ml-1">{step.duration}</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Watch for:</span>
                            <span className="text-blue-700 ml-1">{step.signs}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Warning Signs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                  Warning Signs to Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Signs of Deterioration</h4>
                    <ul className="space-y-1">
                      {guide?.warningSignsigns?.deterioration.map((sign: string, index: number) => (
                        <li key={index} className="text-sm text-red-700">
                          • {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Signs of Improvement</h4>
                    <ul className="space-y-1">
                      {guide?.warningSignsigns?.improvement.map((sign: string, index: number) => (
                        <li key={index} className="text-sm text-green-700">
                          • {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Call 911 If</h4>
                    <ul className="space-y-1">
                      {guide?.warningSignsigns?.whenToCall911.map((condition: string, index: number) => (
                        <li key={index} className="text-sm text-orange-700">
                          • {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle>Common Mistakes to Avoid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guide.commonMistakes.map((mistake: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">❌ {mistake.mistake}</h4>
                      <p className="text-red-700 text-sm mb-2">Why it's problematic: {mistake.whyBad}</p>
                      <p className="text-green-700 text-sm">✅ Instead: {mistake.instead}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Care */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-purple-600" />
                  Follow-up Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Immediate Next Steps</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.immediateNext}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Monitoring</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.monitoring}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-2">Medical Care</h4>
                    <p className="text-sm text-purple-700">{guide.followUp.medicalCare}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prevention */}
            <Card>
              <CardHeader>
                <CardTitle>Prevention & Preparedness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Future Prevention</h4>
                    <ul className="space-y-1">
                      {guide.prevention.futureAvoidance.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Risk Factors</h4>
                    <ul className="space-y-1">
                      {guide.prevention.riskFactors.map((factor: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Be Prepared</h4>
                    <ul className="space-y-1">
                      {guide.prevention.preparedness.map((tip: string, index: number) => (
                        <li key={index} className="text-sm">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Updated onClick handler to reset custom condition as well */}
              <Button onClick={() => { setGuide(null); setCustomCondition(""); setSelectedCondition("");}} variant="outline">
                Get Guide for Different Emergency
              </Button>
              <Button className="bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Services (112)
              </Button>
            </div>

            {/* Save Button - Conditionally rendered if guide exists */}
            {guide && (
  <Button
    variant="default"
    onClick={handleSaveGuide}
    className="w-full sm:w-auto"
  >
    Save Emergency Guide
  </Button>
)}

            {/* Disclaimer */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <strong>Important Disclaimer:</strong> This emergency guide is for informational purposes only and
                    should not replace professional emergency medical services. Always call 112 for life-threatening
                    emergencies. This information is not a substitute for proper first aid training.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Guides Section - Conditionally rendered if no guide is currently being viewed */}
        {!guide && savedGuides.length > 0 && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">Saved Emergency Guides</h2>
    <div className="grid gap-4 md:grid-cols-2">
      {savedGuides.map((g, idx) => (
        <Card key={g.id || idx} className="relative border-2 border-gray-200 shadow-sm bg-white">
          <CardContent className="py-4">
            <div className="mb-2 text-xs text-gray-500">
              Saved: {new Date(g.savedAt).toLocaleString()}
            </div>
            <div className="font-bold mb-1">{g.condition}</div>
            <Button
              size="sm"
              className="mr-2"
              onClick={() => setGuide(g)}
            >
              View
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="mr-2"
              onClick={() => handleShareGuide(g)}
            >
              Share
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="mr-2"
              onClick={() => handleDownloadPDF(g, idx)}
            >
              Download PDF
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteGuide(idx)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  )
}