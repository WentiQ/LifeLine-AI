"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Save, Camera, Shield, Bell } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    gender: "male",
    height: "180",
    weight: "75",
    bloodType: "O+",
    allergies: "None",
    chronicConditions: "None",
    emergencyContact: "Jane Doe (+1 555-987-6543)",
    preferredLanguage: "English",
    profilePicture: "/placeholder.svg?height=128&width=128",
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
      setProfileData((prev) => ({
        ...prev,
        ...user, // This will overwrite any matching fields with user data
      }))
    }
  }, [])

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    healthAlerts: true,
    medicationReminders: true,
    appointmentReminders: true,
    healthTips: true,
    weeklyReports: true,
  })

  const [privacy, setPrivacy] = useState({
    shareDataWithDoctors: true,
    shareAnonymousData: true,
    allowLocationAccess: true,
    allowHealthDataAccess: true,
    twoFactorAuth: false,
  })

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    setPrivacy((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save the data to a backend
    console.log("Saving profile data:", profileData)
    console.log("Saving notification settings:", notifications)
    console.log("Saving privacy settings:", privacy)

    setIsSaving(false)

    // Show success message
    alert("Profile updated successfully!")
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
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">View and manage your personal information</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={profileData.profilePicture || "/placeholder.svg"}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                      />
                      <AvatarFallback>
                        {profileData.firstName.charAt(0)}
                        {profileData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-500 mb-4">{profileData.email}</p>

                  <div className="w-full space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Blood Type:</span>
                      <span className="font-medium">{profileData.bloodType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Height:</span>
                      <span className="font-medium">{profileData.height} cm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium">{profileData.weight} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date of Birth:</span>
                      <span className="font-medium">{profileData.dateOfBirth}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving Changes...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save All Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Tabs */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="personal">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => handleProfileChange("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => handleProfileChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) => handleProfileChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Health Information</CardTitle>
                    <CardDescription>Update your health details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={profileData.height}
                          onChange={(e) => handleProfileChange("height", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={profileData.weight}
                          onChange={(e) => handleProfileChange("weight", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select
                          value={profileData.bloodType}
                          onValueChange={(value) => handleProfileChange("bloodType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        placeholder="List any allergies..."
                        value={profileData.allergies}
                        onChange={(e) => handleProfileChange("allergies", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                      <Textarea
                        id="chronicConditions"
                        placeholder="List any chronic conditions..."
                        value={profileData.chronicConditions}
                        onChange={(e) => handleProfileChange("chronicConditions", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="Name and phone number"
                        value={profileData.emergencyContact}
                        onChange={(e) => handleProfileChange("emergencyContact", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Channels</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch
                            id="emailNotifications"
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="pushNotifications">Push Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications on your device</p>
                          </div>
                          <Switch
                            id="pushNotifications"
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="smsNotifications">SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Receive notifications via text message</p>
                          </div>
                          <Switch
                            id="smsNotifications"
                            checked={notifications.smsNotifications}
                            onCheckedChange={(checked) => handleNotificationChange("smsNotifications", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="healthAlerts">Health Alerts</Label>
                            <p className="text-sm text-gray-500">Important alerts about your health</p>
                          </div>
                          <Switch
                            id="healthAlerts"
                            checked={notifications.healthAlerts}
                            onCheckedChange={(checked) => handleNotificationChange("healthAlerts", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="medicationReminders">Medication Reminders</Label>
                            <p className="text-sm text-gray-500">Reminders to take your medications</p>
                          </div>
                          <Switch
                            id="medicationReminders"
                            checked={notifications.medicationReminders}
                            onCheckedChange={(checked) => handleNotificationChange("medicationReminders", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
                            <p className="text-sm text-gray-500">Reminders about upcoming appointments</p>
                          </div>
                          <Switch
                            id="appointmentReminders"
                            checked={notifications.appointmentReminders}
                            onCheckedChange={(checked) => handleNotificationChange("appointmentReminders", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="healthTips">Health Tips</Label>
                            <p className="text-sm text-gray-500">Personalized health tips and advice</p>
                          </div>
                          <Switch
                            id="healthTips"
                            checked={notifications.healthTips}
                            onCheckedChange={(checked) => handleNotificationChange("healthTips", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="weeklyReports">Weekly Reports</Label>
                            <p className="text-sm text-gray-500">Weekly summary of your health data</p>
                          </div>
                          <Switch
                            id="weeklyReports"
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Manage your data privacy and security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data Sharing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="shareDataWithDoctors">Share Data with Doctors</Label>
                            <p className="text-sm text-gray-500">Allow your doctors to access your health data</p>
                          </div>
                          <Switch
                            id="shareDataWithDoctors"
                            checked={privacy.shareDataWithDoctors}
                            onCheckedChange={(checked) => handlePrivacyChange("shareDataWithDoctors", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="shareAnonymousData">Share Anonymous Data</Label>
                            <p className="text-sm text-gray-500">Share anonymized data for research purposes</p>
                          </div>
                          <Switch
                            id="shareAnonymousData"
                            checked={privacy.shareAnonymousData}
                            onCheckedChange={(checked) => handlePrivacyChange("shareAnonymousData", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">App Permissions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="allowLocationAccess">Location Access</Label>
                            <p className="text-sm text-gray-500">Allow the app to access your location</p>
                          </div>
                          <Switch
                            id="allowLocationAccess"
                            checked={privacy.allowLocationAccess}
                            onCheckedChange={(checked) => handlePrivacyChange("allowLocationAccess", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="allowHealthDataAccess">Health Data Access</Label>
                            <p className="text-sm text-gray-500">Allow the app to access your device health data</p>
                          </div>
                          <Switch
                            id="allowHealthDataAccess"
                            checked={privacy.allowHealthDataAccess}
                            onCheckedChange={(checked) => handlePrivacyChange("allowHealthDataAccess", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Security</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                          <Switch
                            id="twoFactorAuth"
                            checked={privacy.twoFactorAuth}
                            onCheckedChange={(checked) => handlePrivacyChange("twoFactorAuth", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="destructive">Delete My Account</Button>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Clear user session or token if needed
                          window.location.href = "/"
                        }}
                      >
                        Log Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
