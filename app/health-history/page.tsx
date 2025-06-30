"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Calendar, Activity, Heart, Weight, Droplets, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HealthRecord {
  id: string
  date: Date
  type: "vital" | "medication" | "appointment" | "test" | "symptom" | "exercise"
  title: string
  value?: string
  unit?: string
  notes?: string
  doctor?: string
  facility?: string
  attachments?: string[]
}

interface VitalSign {
  date: string
  bloodPressureSystolic: number
  bloodPressureDiastolic: number
  heartRate: number
  temperature: number
  weight: number
  height: number
  bloodSugar: number
}

export default function HealthHistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [isAddingRecord, setIsAddingRecord] = useState(false)
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    type: "vital",
    date: new Date(),
    title: "",
    value: "",
    unit: "",
    notes: "",
  })

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: "1",
      date: new Date("2024-01-15"),
      type: "appointment",
      title: "Annual Physical Exam",
      doctor: "Dr. Sarah Johnson",
      facility: "City Medical Center",
      notes: "Overall health is good. Blood pressure slightly elevated. Recommended lifestyle changes.",
    },
    {
      id: "2",
      date: new Date("2024-01-10"),
      type: "test",
      title: "Blood Work - Complete Panel",
      value: "Normal",
      doctor: "Dr. Sarah Johnson",
      facility: "City Medical Center",
      notes: "All values within normal range. Cholesterol levels improved from last year.",
    },
    {
      id: "3",
      date: new Date("2024-01-08"),
      type: "vital",
      title: "Blood Pressure",
      value: "140/90",
      unit: "mmHg",
      notes: "Measured at home in the morning",
    },
    {
      id: "4",
      date: new Date("2024-01-05"),
      type: "medication",
      title: "Started Lisinopril",
      value: "10mg",
      unit: "daily",
      doctor: "Dr. Sarah Johnson",
      notes: "Prescribed for blood pressure management",
    },
    {
      id: "5",
      date: new Date("2024-01-01"),
      type: "symptom",
      title: "Headache",
      notes: "Mild headache in the morning, resolved after coffee",
    },
  ])

  const vitalSigns: VitalSign[] = [
    {
      date: "2024-01-01",
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 95,
      heartRate: 72,
      temperature: 98.6,
      weight: 75,
      height: 180,
      bloodSugar: 95,
    },
    {
      date: "2024-01-08",
      bloodPressureSystolic: 140,
      bloodPressureDiastolic: 90,
      heartRate: 68,
      temperature: 98.4,
      weight: 74.5,
      height: 180,
      bloodSugar: 92,
    },
    {
      date: "2024-01-15",
      bloodPressureSystolic: 138,
      bloodPressureDiastolic: 88,
      heartRate: 70,
      temperature: 98.5,
      weight: 74,
      height: 180,
      bloodSugar: 88,
    },
    {
      date: "2024-01-22",
      bloodPressureSystolic: 135,
      bloodPressureDiastolic: 85,
      heartRate: 69,
      temperature: 98.6,
      weight: 73.5,
      height: 180,
      bloodSugar: 90,
    },
    {
      date: "2024-01-29",
      bloodPressureSystolic: 132,
      bloodPressureDiastolic: 82,
      heartRate: 67,
      temperature: 98.4,
      weight: 73,
      height: 180,
      bloodSugar: 87,
    },
  ]

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "vital":
        return <Activity className="h-5 w-5 text-red-500" />
      case "medication":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-green-500" />
      case "test":
        return <Eye className="h-5 w-5 text-purple-500" />
      case "symptom":
        return <Heart className="h-5 w-5 text-orange-500" />
      case "exercise":
        return <Activity className="h-5 w-5 text-teal-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "vital":
        return "bg-red-100 text-red-800"
      case "medication":
        return "bg-blue-100 text-blue-800"
      case "appointment":
        return "bg-green-100 text-green-800"
      case "test":
        return "bg-purple-100 text-purple-800"
      case "symptom":
        return "bg-orange-100 text-orange-800"
      case "exercise":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddRecord = () => {
    if (newRecord.title) {
      const record: HealthRecord = {
        id: Date.now().toString(),
        date: newRecord.date || new Date(),
        type: newRecord.type as any,
        title: newRecord.title,
        value: newRecord.value,
        unit: newRecord.unit,
        notes: newRecord.notes,
        doctor: newRecord.doctor,
        facility: newRecord.facility,
      }
      setHealthRecords((prev) => [record, ...prev])
      setNewRecord({
        type: "vital",
        date: new Date(),
        title: "",
        value: "",
        unit: "",
        notes: "",
      })
      setIsAddingRecord(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Activity className="h-6 w-6 mr-2" />
                  Health History
                </h1>
                <p className="text-gray-600">Track and manage your complete health records</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Health Record</DialogTitle>
                    <DialogDescription>Add a new entry to your health history.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newRecord.type}
                        onValueChange={(value) => setNewRecord((prev) => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vital">Vital Signs</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="test">Test/Lab</SelectItem>
                          <SelectItem value="symptom">Symptom</SelectItem>
                          <SelectItem value="exercise">Exercise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={newRecord.title}
                        onChange={(e) => setNewRecord((prev) => ({ ...prev, title: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        Value
                      </Label>
                      <Input
                        id="value"
                        value={newRecord.value}
                        onChange={(e) => setNewRecord((prev) => ({ ...prev, value: e.target.value }))}
                        className="col-span-2"
                      />
                      <Input
                        placeholder="Unit"
                        value={newRecord.unit}
                        onChange={(e) => setNewRecord((prev) => ({ ...prev, unit: e.target.value }))}
                        className="col-span-1"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newRecord.date?.toISOString().split("T")[0]}
                        onChange={(e) => setNewRecord((prev) => ({ ...prev, date: new Date(e.target.value) }))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        value={newRecord.notes}
                        onChange={(e) => setNewRecord((prev) => ({ ...prev, notes: e.target.value }))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddRecord}>
                      Add Record
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Health Timeline</CardTitle>
                    <CardDescription>Chronological view of your health records</CardDescription>
                  </div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">Last Month</SelectItem>
                      <SelectItem value="3months">Last 3 Months</SelectItem>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="1year">Last Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record, index) => (
                    <div key={record.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                      <div className="flex-shrink-0 mt-1">{getRecordIcon(record.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{record.title}</h3>
                          <Badge className={`text-xs ${getRecordTypeColor(record.type)}`}>{record.type}</Badge>
                        </div>
                        {record.value && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Value:</strong> {record.value} {record.unit}
                          </p>
                        )}
                        {record.doctor && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Doctor:</strong> {record.doctor}
                          </p>
                        )}
                        {record.facility && (
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Facility:</strong> {record.facility}
                          </p>
                        )}
                        {record.notes && <p className="text-sm text-gray-600 mb-2">{record.notes}</p>}
                        <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vitals Tab */}
          <TabsContent value="vitals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Blood Pressure Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalSigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bloodPressureSystolic" stroke="#ef4444" name="Systolic" />
                      <Line type="monotone" dataKey="bloodPressureDiastolic" stroke="#f97316" name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Heart Rate Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalSigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" name="Heart Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Weight className="h-5 w-5 mr-2 text-green-500" />
                    Weight Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalSigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#10b981" name="Weight (kg)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Droplets className="h-5 w-5 mr-2 text-purple-500" />
                    Blood Sugar Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalSigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bloodSugar" stroke="#8b5cf6" name="Blood Sugar" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Current Vitals Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Current Vital Signs</CardTitle>
                <CardDescription>Latest recorded measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">132/82</div>
                    <div className="text-sm text-gray-600">Blood Pressure</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">67</div>
                    <div className="text-sm text-gray-600">Heart Rate</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Weight className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">73</div>
                    <div className="text-sm text-gray-600">Weight (kg)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Droplets className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">87</div>
                    <div className="text-sm text-gray-600">Blood Sugar</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Medications</CardTitle>
                <CardDescription>Active prescriptions and supplements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Lisinopril</h3>
                        <p className="text-sm text-gray-600">10mg daily - Blood pressure medication</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="font-medium">Vitamin D3</h3>
                        <p className="text-sm text-gray-600">2000 IU daily - Supplement</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medication History</CardTitle>
                <CardDescription>Past medications and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords
                    .filter((record) => record.type === "medication")
                    .map((record) => (
                      <div key={record.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                        <Droplets className="h-5 w-5 text-blue-500 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{record.title}</h3>
                          {record.value && (
                            <p className="text-sm text-gray-600">
                              {record.value} {record.unit}
                            </p>
                          )}
                          {record.notes && <p className="text-sm text-gray-600 mt-1">{record.notes}</p>}
                          <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lab Reports & Tests</CardTitle>
                <CardDescription>Medical test results and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords
                    .filter((record) => record.type === "test")
                    .map((record) => (
                      <div key={record.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <Eye className="h-5 w-5 text-purple-500 mt-1" />
                          <div>
                            <h3 className="font-medium">{record.title}</h3>
                            {record.value && <p className="text-sm text-gray-600 mt-1">Result: {record.value}</p>}
                            {record.doctor && <p className="text-sm text-gray-600">Ordered by: {record.doctor}</p>}
                            {record.notes && <p className="text-sm text-gray-600 mt-2">{record.notes}</p>}
                            <span className="text-xs text-gray-500">{formatDate(record.date)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Summary Report</CardTitle>
                <CardDescription>Generate comprehensive health reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Calendar className="h-6 w-6 mb-2" />
                      Monthly Report
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Activity className="h-6 w-6 mb-2" />
                      Vitals Summary
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col">
                      <Droplets className="h-6 w-6 mb-2" />
                      Medication Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
