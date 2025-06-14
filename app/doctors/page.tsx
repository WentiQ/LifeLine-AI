"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Search, Star, Stethoscope, Award, Clock, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedArea, setSelectedArea] = useState("all")

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      hospital: "City General Hospital",
      rating: 4.9,
      experience: 15,
      successRate: 96,
      location: "Downtown",
      distance: "2.3 km",
      consultationFee: "$150",
      nextAvailable: "Today 3:00 PM",
      education: "Harvard Medical School",
      verified: true,
      reviews: 234,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      hospital: "Metro Skin Clinic",
      rating: 4.8,
      experience: 12,
      successRate: 94,
      location: "Midtown",
      distance: "3.7 km",
      consultationFee: "$120",
      nextAvailable: "Tomorrow 10:00 AM",
      education: "Johns Hopkins University",
      verified: true,
      reviews: 189,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      hospital: "Children's Medical Center",
      rating: 4.9,
      experience: 18,
      successRate: 98,
      location: "Uptown",
      distance: "4.1 km",
      consultationFee: "$100",
      nextAvailable: "Today 5:30 PM",
      education: "Stanford Medical School",
      verified: true,
      reviews: 312,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      hospital: "Sports Medicine Institute",
      rating: 4.7,
      experience: 20,
      successRate: 92,
      location: "West Side",
      distance: "5.2 km",
      consultationFee: "$200",
      nextAvailable: "Next Week",
      education: "Mayo Clinic",
      verified: true,
      reviews: 156,
    },
  ]

  const specialties = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic Surgeon",
    "Neurologist",
    "Psychiatrist",
    "Dentist",
    "Ophthalmologist",
  ]

  const areas = ["Downtown", "Midtown", "Uptown", "West Side", "East Side", "North End"]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty
    const matchesArea = selectedArea === "all" || doctor.location === selectedArea

    return matchesSearch && matchesSpecialty && matchesArea
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
              <p className="text-gray-600">Top-rated healthcare providers in your area</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search doctors by name or specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
            {selectedSpecialty !== "all" && ` in ${selectedSpecialty}`}
            {selectedArea !== "all" && ` in ${selectedArea}`}
          </p>
        </div>

        {/* Doctors List */}
        <div className="grid gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                          {doctor.verified && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{doctor.specialty}</p>
                        <p className="text-gray-500 text-sm">{doctor.hospital}</p>
                        <p className="text-gray-500 text-sm">{doctor.education}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold">{doctor.rating}</span>
                          <span className="text-gray-500 text-sm ml-1">({doctor.reviews})</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {doctor.distance}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{doctor.experience}</p>
                        <p className="text-xs text-gray-600">Years Experience</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{doctor.successRate}%</p>
                        <p className="text-xs text-gray-600">Success Rate</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{doctor.consultationFee}</p>
                        <p className="text-xs text-gray-600">Consultation</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600 mr-1" />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{doctor.nextAvailable}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{doctor.location}</Badge>
                      <Badge variant="outline">{doctor.specialty}</Badge>
                      <Badge variant="outline">
                        #{Math.floor(Math.random() * 10) + 1} in {doctor.location}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button className="w-full lg:w-auto">
                      <Phone className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="w-full lg:w-auto">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all available doctors.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
