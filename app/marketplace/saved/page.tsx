"use client"

import { useState, useEffect } from "react"
import { Star, Clock, DollarSign, Trash2 } from "lucide-react"
import Link from "next/link"

interface Service {
  _id: string
  title: string
  description: string
  category: string
  pricePerHour: number
  experience: string
  rating: number
  reviews: number
  image: string
  tags: string[]
  availability: string
}

export default function SavedServicesPage() {
  const [savedServices, setSavedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedServices()
  }, [])

  const fetchSavedServices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/marketplace/likes?getSaved=true")
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setSavedServices(data)
      } else {
        console.error("API returned non-array data:", data)
        setSavedServices([])
      }
    } catch (error) {
      console.error("Error fetching saved services:", error)
      setSavedServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSave = async (serviceId: string) => {
    try {
      await fetch("/api/marketplace/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, removeSave: true }),
      })
      setSavedServices(savedServices.filter((s) => s._id !== serviceId))
    } catch (error) {
      console.error("Error removing save:", error)
    }
  }

  return (
    <div className="min-h-screen bg-lightpink">
      {/* Header */}
      <div className="bg-white border-b border-grey500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-purple font-inter">Saved Services</h1>
          <p className="text-lightgrey mt-1">Your collection of favorite freelance services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-grey500 border-t-purple rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lightgrey">Loading saved services...</p>
            </div>
          </div>
        ) : savedServices.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-lightgrey text-lg">No saved services yet</p>
              <p className="text-lightgrey text-sm mt-2">Start saving services to see them here</p>
              <Link href="/marketplace">
                <button className="mt-6 px-6 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium">
                  Browse Services
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedServices.map((service) => (
              <div key={service._id} className="bg-white rounded-lg border border-grey500 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 bg-grey500 overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg?height=160&width=300"}
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=160&width=300"
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        service.availability === "Available"
                          ? "bg-green"
                          : service.availability === "Busy"
                            ? "bg-orange"
                            : "bg-red"
                      }`}
                    >
                      {service.availability}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-black font-inter">{service.title}</h3>
                  <p className="text-xs text-lightgrey mt-1">{service.category}</p>

                  <p className="text-sm text-lightgrey line-clamp-2 mt-3">{service.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm mt-4">
                    <div className="flex items-center gap-1 text-lightgrey">
                      <Star className="w-4 h-4 fill-orange text-orange" />
                      <span>{service.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-lightgrey">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{service.experience}</span>
                    </div>
                    <div className="flex items-center gap-1 text-lightgrey">
                      <DollarSign className="w-4 h-4" />
                      <span>${service.pricePerHour}/hr</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Link href={`/marketplace?service=${service._id}`} className="flex-1">
                      <button className="w-full px-4 py-2 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium text-sm">
                        View Details
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveSave(service._id)}
                      className="px-4 py-2 border border-red text-red rounded-lg hover:bg-red hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
