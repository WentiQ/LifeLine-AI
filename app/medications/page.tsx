// Updated MedicationsPage.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Bell,
  Trash2,
  AlertCircle,
  Plus,
  ImageIcon,
  Pencil,
  X,
  Clock,
  Pill,
} from "lucide-react"

export default function MedicationsPage() {
  const [medications, setMedications] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    reminderEnabled: true,
    prescribedBy: "",
    notes: "",
    images: [] as string[],
  })
  const [nextDoseTime, setNextDoseTime] = useState("N/A")

  // Notification sound
  const notificationSound = typeof window !== "undefined"
    ? new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3")
    : null;

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Function to calculate next dose time
  const calculateNextDoseTime = () => {
    if (medications.length === 0) return "N/A";
    const now = new Date();
    let doseTimes: Date[] = [];
    medications.forEach((med) => {
      if (med.time) {
        med.time
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => /^\d{2}:\d{2}$/.test(t))
          .forEach((t: string) => {
            const [hours, minutes] = t.split(":").map(Number);
            const dose = new Date(now);
            dose.setHours(hours, minutes, 0, 0);
            doseTimes.push(dose);
          });
      }
    });
    const upcoming = doseTimes.filter((dt) => dt > now);
    if (upcoming.length > 0) {
      const next = new Date(Math.min(...upcoming.map((d) => d.getTime())));
      return next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (doseTimes.length > 0) {
      const earliest = doseTimes.sort((a, b) => a.getHours() - b.getHours() || a.getMinutes() - b.getMinutes())[0];
      return earliest.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " (tomorrow)";
    }
    return "N/A";
  };

  // Update nextDoseTime every second
  useEffect(() => {
    setNextDoseTime(calculateNextDoseTime());
    const interval = setInterval(() => {
      setNextDoseTime(calculateNextDoseTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [medications]);

  // Helper to check if a time is "now" (within 1 minute)
  const isDoseNow = (doseDate: Date) => {
    const now = new Date();
    return (
      doseDate.getHours() === now.getHours() &&
      doseDate.getMinutes() === now.getMinutes()
    );
  };

  // Notification effect
  useEffect(() => {
    if (!("Notification" in window)) return;

    const interval = setInterval(() => {
      medications.forEach((med) => {
        if (!med.reminderEnabled || !med.time) return;
        med.time
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => /^\d{2}:\d{2}$/.test(t))
          .forEach((t: string) => {
            const [hours, minutes] = t.split(":").map(Number);
            const dose = new Date();
            dose.setHours(hours, minutes, 0, 0);
            if (isDoseNow(dose)) {
              // Prevent duplicate notifications in the same minute
              const key = `notified_${med.id}_${hours}_${minutes}_${dose.getDate()}`;
              if (!window.localStorage.getItem(key)) {
                // Show notification
                if (Notification.permission === "granted") {
                  new Notification(`Time for ${med.name}`, {
                    body: `Take your dose: ${med.dosage} (${med.frequency})`,
                    icon: "/favicon.ico",
                  });
                }
                // Play sound
                notificationSound?.play();
                // Mark as notified for this minute
                window.localStorage.setItem(key, "1");
                // Remove the flag after 70 seconds
                setTimeout(() => window.localStorage.removeItem(key), 70000);
              }
            }
          });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [medications]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const readers = Array.from(files).map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })
      Promise.all(readers).then((images) => {
        setNewMedication({ ...newMedication, images: [...newMedication.images, ...images] })
      })
    }
  }

  const handleAddOrUpdateMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const updated = {
        id: editingId || medications.length + 1,
        ...newMedication,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "Ongoing",
      }
      const updatedList = editingId
        ? medications.map((m) => (m.id === editingId ? updated : m))
        : [...medications, updated]
      setMedications(updatedList)
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        time: "",
        reminderEnabled: true,
        prescribedBy: "",
        notes: "",
        images: [],
      })
      setShowAddForm(false)
      setEditingId(null)
    }
  }

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((m) => m.id !== id))
  }

  const handleEditMedication = (id: number) => {
    const med = medications.find((m) => m.id === id)
    if (med) {
      setNewMedication(med)
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  const toggleReminder = (id: number) => {
    setMedications(
      medications.map((m) =>
        m.id === id ? { ...m, reminderEnabled: !m.reminderEnabled } : m
      )
    )
  }

  const openImagePopup = (src: string) => {
    const popup = window.open()
    popup?.document.write(`<img src="${src}" style="max-width: 100%; height: auto;" />`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>
              </Link>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
                <p className="text-gray-600">Manage your medications and reminders</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Medication
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
                  <p className="text-2xl font-bold text-gray-900">{nextDoseTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Medication" : "Add New Medication"}</CardTitle>
              <CardDescription>
                {editingId ? "Modify your medication details" : "Enter the details of your new medication"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder="e.g., Lisinopril, Metformin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="e.g., 10mg, 500mg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  placeholder="e.g., Once daily, Custom pattern"
                />
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

              <div className="space-y-2">
                <Label htmlFor="prescribed-by">Prescribed By</Label>
                <Input
                  id="prescribed-by"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                  placeholder="e.g., Dr. Dinesh"
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

              <div className="space-y-2">
                <Label htmlFor="images">Upload Medicine Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white text-black file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-100"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {newMedication.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      onClick={() => openImagePopup(img)}
                      alt="Preview"
                      className="w-20 h-20 rounded object-cover border cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reminder"
                  checked={newMedication.reminderEnabled}
                  onCheckedChange={(checked) =>
                    setNewMedication({ ...newMedication, reminderEnabled: checked })
                  }
                />
                <Label htmlFor="reminder">Enable reminders</Label>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleAddOrUpdateMedication}>
                  {editingId ? "Update Medication" : "Add Medication"}
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                  setNewMedication({
                    name: "",
                    dosage: "",
                    frequency: "",
                    time: "",
                    reminderEnabled: true,
                    prescribedBy: "",
                    notes: "",
                    images: [],
                  })
                }}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Medications</h2>
          {medications.map((med) => (
            <Card key={med.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{med.name}</h3>
                      <Badge variant="outline" className="ml-2">
                        {med.dosage}
                      </Badge>
                      {med.reminderEnabled && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          <Bell className="h-3 w-3 mr-1" /> Reminders On
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {med.images.map((img: string, index: number) => (
                        <img
                          key={index}
                          src={img}
                          onClick={() => openImagePopup(img)}
                          alt={med.name}
                          className="w-20 h-20 object-cover rounded border cursor-pointer"
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div><span className="font-medium">Frequency:</span> {med.frequency}</div>
                      <div><span className="font-medium">Time(s):</span> {med.time}</div>
                      <div><span className="font-medium">Prescribed by:</span> {med.prescribedBy}</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                      <div><span className="font-medium">Start Date:</span> {med.startDate}</div>
                      <div><span className="font-medium">End Date:</span> {med.endDate}</div>
                    </div>
                    {med.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{med.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <Switch checked={med.reminderEnabled} onCheckedChange={() => toggleReminder(med.id)} />
                    <span className="text-sm text-gray-600">Reminders</span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEditMedication(med.id)}>
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedication(med.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
