"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Check, Pill, Calendar, Brain, AlertTriangle, Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  id: string
  title: string
  message: string
  type: "medication" | "appointment" | "alert" | "tip" | "system"
  date: string
  read: boolean
  actionUrl?: string
  actionText?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Medication Reminder",
      message: "It's time to take your Lisinopril (10mg).",
      type: "medication",
      date: "2 minutes ago",
      read: false,
      actionUrl: "/medications",
      actionText: "View Medications",
    },
    {
      id: "2",
      title: "Upcoming Appointment",
      message: "You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM.",
      type: "appointment",
      date: "1 hour ago",
      read: false,
      actionUrl: "/appointments",
      actionText: "View Appointment",
    },
    {
      id: "3",
      title: "Health Alert",
      message: "Your heart rate was above normal during your last workout. Consider consulting with your doctor.",
      type: "alert",
      date: "3 hours ago",
      read: true,
      actionUrl: "/smartwatch",
      actionText: "View Health Data",
    },
    {
      id: "4",
      title: "Health Tip",
      message: "Staying hydrated can help improve your energy levels and cognitive function.",
      type: "tip",
      date: "Yesterday",
      read: true,
    },
    {
      id: "5",
      title: "Medication Reminder",
      message: "It's time to take your Metformin (500mg).",
      type: "medication",
      date: "Yesterday",
      read: true,
      actionUrl: "/medications",
      actionText: "View Medications",
    },
    {
      id: "6",
      title: "System Update",
      message: "LifeLine AI has been updated with new features. Check out the latest improvements!",
      type: "system",
      date: "2 days ago",
      read: true,
    },
    {
      id: "7",
      title: "Health Analysis Complete",
      message: "Your recent symptom analysis is ready to view.",
      type: "alert",
      date: "3 days ago",
      read: true,
      actionUrl: "/predict",
      actionText: "View Results",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "tip":
        return <Brain className="h-5 w-5 text-green-500" />
      case "system":
        return <Settings className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with your health information</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </Link>
          </div>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-sm font-medium ${!notification.read ? "text-blue-900" : "text-gray-900"}`}
                              >
                                {notification.title}
                              </p>
                              <div className="flex items-center">
                                <p className="text-xs text-gray-500">{notification.date}</p>
                                {!notification.read && <Badge className="ml-2 bg-blue-500">New</Badge>}
                              </div>
                            </div>
                            <p className={`text-sm mt-1 ${!notification.read ? "text-blue-800" : "text-gray-700"}`}>
                              {notification.message}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex space-x-2">
                                {notification.actionUrl && (
                                  <Link href={notification.actionUrl}>
                                    <Button size="sm" variant="outline">
                                      {notification.actionText}
                                    </Button>
                                  </Link>
                                )}
                                {!notification.read && (
                                  <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                    Mark as Read
                                  </Button>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread">
            <Card>
              <CardContent className="p-0">
                {unreadCount > 0 ? (
                  <div className="divide-y">
                    {notifications
                      .filter((notification) => !notification.read)
                      .map((notification) => (
                        <div key={notification.id} className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                            <div className="ml-3 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-900">{notification.title}</p>
                                <div className="flex items-center">
                                  <p className="text-xs text-gray-500">{notification.date}</p>
                                  <Badge className="ml-2 bg-blue-500">New</Badge>
                                </div>
                              </div>
                              <p className="text-sm mt-1 text-blue-800">{notification.message}</p>
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex space-x-2">
                                  {notification.actionUrl && (
                                    <Link href={notification.actionUrl}>
                                      <Button size="sm" variant="outline">
                                        {notification.actionText}
                                      </Button>
                                    </Link>
                                  )}
                                  <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                    Mark as Read
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No unread notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
