"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, Clock, DollarSign, Search, Heart, MessageSquare, Edit } from "lucide-react"
import Link from "next/link"
import ChatWindow from "./components/ChatWindow"

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
  userId?: string
  userName?: string
}

interface ServiceWithMessages extends Service {
  unreadCount?: number
  messageCount?: number
}

const CATEGORIES = [
  "All",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Content Writing",
  "Data Analysis",
  "Video Editing",
  "Graphic Design",
  "Tutoring",
  "Social Media",
]

export default function MarketplacePage() {
  const [services, setServices] = useState<Service[]>([])
  const [myServices, setMyServices] = useState<ServiceWithMessages[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 })
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [chatService, setChatService] = useState<Service | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"all" | "my-services">("all")

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const user = await response.json()
          setCurrentUser(user)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/marketplace/services")
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setServices(data)
        setFilteredServices(data)
      } else {
        console.error("API returned non-array data:", data)
        setServices([])
        setFilteredServices([])
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
      setFilteredServices([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch my services with message counts
  const fetchMyServices = useCallback(async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      const response = await fetch("/api/marketplace/services/my-services")
      const data = await response.json()
      
      if (Array.isArray(data)) {
        // Fetch message counts for each service
        const servicesWithMessages = await Promise.all(
          data.map(async (service: Service) => {
            try {
              const msgResponse = await fetch(`/api/marketplace/chat/service-messages?serviceId=${service._id}`)
              const msgData = await msgResponse.json()
              return {
                ...service,
                unreadCount: msgData.unreadCount || 0,
                messageCount: msgData.totalMessages || 0
              }
            } catch {
              return { ...service, unreadCount: 0, messageCount: 0 }
            }
          })
        )
        setMyServices(servicesWithMessages)
      }
    } catch (error) {
      console.error("Error fetching my services:", error)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  const handleCloseChat = useCallback(() => {
    setChatService(null)
    // Refresh message counts after closing chat
    if (activeTab === "my-services") {
      fetchMyServices()
    }
  }, [activeTab, fetchMyServices])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  useEffect(() => {
    if (currentUser && activeTab === "my-services") {
      fetchMyServices()
    }
  }, [currentUser, activeTab, fetchMyServices])

  useEffect(() => {
    let filtered = services

    if (selectedCategory !== "All") {
      filtered = filtered.filter((s) => s.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    filtered = filtered.filter((s) => s.pricePerHour >= priceRange.min && s.pricePerHour <= priceRange.max)

    setFilteredServices(filtered)
  }, [selectedCategory, searchQuery, priceRange, services])

  const handleLike = async (serviceId: string) => {
    try {
      await fetch("/api/marketplace/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      })
      // Optionally update UI to show liked state
    } catch (error) {
      console.error("Error liking service:", error)
    }
  }

  return (
    <div className="min-h-screen bg-lightpink">
      {/* Header */}
      <div className="bg-white border-b border-grey500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold text-purple font-inter">Freelance Marketplace</h1>
              <p className="text-lightgrey mt-2">Discover amazing freelance services from talented students</p>
            </div>

            {/* Tab Navigation */}
            {currentUser && (
              <div className="flex gap-2 border-b border-grey500">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === "all"
                      ? "text-purple border-b-2 border-purple"
                      : "text-lightgrey hover:text-purple"
                  }`}
                >
                  All Services
                </button>
                <button
                  onClick={() => setActiveTab("my-services")}
                  className={`px-6 py-3 font-medium transition-all flex items-center gap-2 ${
                    activeTab === "my-services"
                      ? "text-purple border-b-2 border-purple"
                      : "text-lightgrey hover:text-purple"
                  }`}
                >
                  My Services
                  {myServices.length > 0 && (
                    <span className="bg-purple text-white text-xs px-2 py-0.5 rounded-full">
                      {myServices.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Search Bar - Only show for "All Services" tab */}
            {activeTab === "all" && (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-lightgrey w-5 h-5" />
                  <input
                    placeholder="Search services, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 w-full border border-grey500 rounded-lg px-4 focus:outline-none focus:border-purple"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {activeTab === "all" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-grey500 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-black mb-4">Filters</h2>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-black mb-3">Category</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-inter ${
                        selectedCategory === cat
                          ? "bg-purple text-white font-medium"
                          : "text-black hover:bg-lightpink"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-black mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-lightgrey">Min: ${priceRange.min}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full accent-purple"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-lightgrey">Max: ${priceRange.max}</label>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full accent-purple"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("All")
                  setSearchQuery("")
                  setPriceRange({ min: 0, max: 500 })
                }}
                className="w-full px-4 py-2 border border-purple text-purple rounded-lg hover:bg-purple hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-grey500 border-t-purple rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lightgrey">Loading services...</p>
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-lightgrey text-lg">No services found</p>
                  <p className="text-lightgrey text-sm mt-2">Try adjusting your filters or search query</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredServices.map((service) => (
                  <div key={service._id} className="bg-white rounded-lg border border-grey500 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-grey500 overflow-hidden">
                      <img
                        src={service.image || "/placeholder.svg?height=192&width=400"}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=192&width=400"
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
                      <button
                        onClick={() => handleLike(service._id)}
                        className="absolute top-3 left-3 p-2 bg-white rounded-full hover:bg-lightpink transition-colors"
                      >
                        <Heart className="w-4 h-4 text-purple" />
                      </button>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-black font-inter">{service.title}</h3>
                          <p className="text-xs text-lightgrey mt-1">{service.category}</p>
                        </div>
                      </div>

                      <p className="text-sm text-lightgrey line-clamp-2 mb-4">{service.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-lightpink text-purple text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
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

                      {/* Reviews */}
                      <p className="text-xs text-lightgrey mb-4">{service.reviews} reviews</p>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedService(service)}
                        className="w-full px-4 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Count */}
            {!loading && (
              <div className="mt-8 text-center text-lightgrey">
                <p>
                  Showing {filteredServices.length} of {services.length} services
                </p>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* My Services Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-purple">My Services</h2>
              <Link
                href="/marketplace/manage"
                className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Manage Services
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-grey500 border-t-purple rounded-full animate-spin"></div>
              </div>
            ) : myServices.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-grey500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-lightgrey" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">No Services Yet</h3>
                <p className="text-lightgrey mb-6">Start offering your skills to the community</p>
                <Link
                  href="/marketplace/manage"
                  className="inline-block px-6 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium"
                >
                  Create Your First Service
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-lg border border-grey500 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={service.image || "/placeholder.svg?height=200&width=400"}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                      {service.unreadCount! > 0 && (
                        <div className="absolute top-2 right-2 bg-orange text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {service.unreadCount} New
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-black line-clamp-1">{service.title}</h3>
                        <p className="text-sm text-lightgrey line-clamp-2 mt-1">{service.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple font-bold">${service.pricePerHour}/hr</span>
                        <span className="flex items-center gap-1 text-lightgrey">
                          <Star className="w-4 h-4 text-orange fill-orange" />
                          {service.rating} ({service.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-lightgrey">
                        <MessageSquare className="w-4 h-4" />
                        <span>{service.messageCount || 0} total messages</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/marketplace/manage"
                          className="px-4 py-2 border border-purple text-purple rounded-lg hover:bg-purple hover:text-white transition-colors font-medium text-center flex items-center justify-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            // Show messages for this service
                            window.location.href = `/marketplace/messages?serviceId=${service._id}`
                          }}
                          className="px-4 py-2 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {service.unreadCount! > 0 ? 'View Messages' : 'Messages'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Simple Modal for Service Details */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedService(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-purple font-inter">{selectedService.title}</h2>
                <button onClick={() => setSelectedService(null)} className="text-lightgrey hover:text-black text-2xl">
                  ×
                </button>
              </div>
              <img
                src={selectedService.image || "/placeholder.svg?height=300&width=600"}
                alt={selectedService.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Description</h3>
                  <p className="text-lightgrey">{selectedService.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-black text-sm">Category</h4>
                    <p className="text-lightgrey text-sm">{selectedService.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-sm">Price</h4>
                    <p className="text-purple text-sm font-bold">${selectedService.pricePerHour}/hr</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-sm">Experience</h4>
                    <p className="text-lightgrey text-sm">{selectedService.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black text-sm">Availability</h4>
                    <p className="text-lightgrey text-sm">{selectedService.availability}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-black text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-lightpink text-purple text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Contact Owner Button - Opens Real-Time Chat */}
                <button 
                  onClick={() => {
                    setChatService(selectedService)
                    setSelectedService(null)
                  }}
                  className="w-full px-4 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact Owner - Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Chat Window */}
      {chatService && chatService.userId && (
        <ChatWindow
          serviceId={chatService._id}
          serviceTitle={chatService.title}
          ownerId={chatService.userId}
          ownerName={chatService.userName || 'Service Owner'}
          onClose={handleCloseChat}
        />
      )}
    </div>
  )
}
