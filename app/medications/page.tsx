"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Clock, Pill, Plus, Trash2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MedicationsPage() {
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "08:00",
      reminderEnabled: true,
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      notes: "Take with food",
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "08:00, 20:00",
      reminderEnabled: true,
      prescribedBy: "Dr. Michael Chen",
      startDate: "2024-02-01",
      endDate: "Ongoing",
      notes: "Monitor blood sugar levels",
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      time: "09:00",
      reminderEnabled: false,
      prescribedBy: "Self-prescribed",
      startDate: "2024-03-01",
      endDate: "Ongoing",
      notes: "Take with breakfast",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    reminderEnabled: true,
    prescribedBy: "",
    notes: "",
  })

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication = {
        id: medications.length + 1,
        ...newMedication,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "Ongoing",
      }
      setMedications([...medications, medication])
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        reminderEnabled: true,
        prescribedBy: "",
        notes: "",
      })
      setShowAddForm(false)
    }
  }

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
  }

  const toggleReminder = (id: number) => {
    setMedications(medications.map((med) => (med.id === id ? { ...med, reminderEnabled: !med.reminderEnabled } : med)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
                <p className="text-gray-600">Manage your medications and reminders</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Pill className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Medications</p>
                  <p className="text-2xl font-bold text-gray-900">{medications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bell className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reminders Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {medications.filter((med) => med.reminderEnabled).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Next Dose</p>
                  <p className="text-2xl font-bold text-gray-900">2:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Medication</CardTitle>
              <CardDescription>Enter the details of your new medication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder="e.g., Aspirin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="e.g., 100mg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={newMedication.frequency}
                    onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Once daily">Once daily</SelectItem>
                      <SelectItem value="Twice daily">Twice daily</SelectItem>
                      <SelectItem value="Three times daily">Three times daily</SelectItem>
                      <SelectItem value="Four times daily">Four times daily</SelectItem>
                      <SelectItem value="As needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time(s)</Label>
                  <Input
                    id="time"
                    value={newMedication.time}
                    onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                    placeholder="e.g., 08:00 or 08:00, 20:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescribed-by">Prescribed By</Label>
                <Input
                  id="prescribed-by"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                  placeholder="e.g., Dr. Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })}
                  placeholder="e.g., Take with food"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reminder"
                  checked={newMedication.reminderEnabled}
                  onCheckedChange={(checked) => setNewMedication({ ...newMedication, reminderEnabled: checked })}
                />
                <Label htmlFor="reminder">Enable reminders</Label>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleAddMedication}>Add Medication</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medications List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Medications</h2>

          {medications.map((medication) => (
            <Card key={medication.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                      <Badge variant="outline" className="ml-2">
                        {medication.dosage}
                      </Badge>
                      {medication.reminderEnabled && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          <Bell className="h-3 w-3 mr-1" />
                          Reminders On
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Frequency:</span> {medication.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Time(s):</span> {medication.time}
                      </div>
                      <div>
                        <span className="font-medium">Prescribed by:</span> {medication.prescribedBy}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                      <div>
                        <span className="font-medium">Start Date:</span> {medication.startDate}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {medication.endDate}
                      </div>
                    </div>

                    {medication.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{medication.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={medication.reminderEnabled}
                        onCheckedChange={() => toggleReminder(medication.id)}
                      />
                      <span className="text-sm text-gray-600">Reminders</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMedication(medication.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {medications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications added</h3>
              <p className="text-gray-600 mb-4">
                Start by adding your current medications to track them and set up reminders.
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Medication
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
