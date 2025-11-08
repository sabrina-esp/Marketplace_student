"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

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

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch services on component mount
    // Auth is checked by the API using the cookie
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // Cookie is sent automatically with the request
      // This endpoint filters services by the logged-in user's ID from the token
      const response = await fetch("/api/marketplace/services/my-services")
      const data = await response.json()
      
      // Check for auth errors
      if (data.requiresAuth) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('user')
        router.push('/')
        return
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setServices(data)
      } else {
        console.error("API returned non-array data:", data)
        setServices([])
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData(service)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    try {
      // Cookie is sent automatically with the request
      const response = await fetch(`/api/marketplace/services/${id}`, { 
        method: "DELETE"
      })
      
      const data = await response.json()
      
      if (data.requiresAuth) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('user')
        router.push('/')
        return
      }
      
      setServices(services.filter((s) => s._id !== id))
    } catch (error) {
      console.error("Error deleting service:", error)
      alert('Failed to delete service')
    }
  }

  const handleSave = async () => {
    try {
      let response
      if (editingService) {
        // Cookie is sent automatically with the request
        response = await fetch(`/api/marketplace/services/${editingService._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Cookie is sent automatically with the request
        response = await fetch("/api/marketplace/services/create", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData),
        })
      }

      const data = await response.json()
      
      // Check for auth errors
      if (data.requiresAuth) {
        alert('Your session has expired. Please login again.')
        localStorage.removeItem('user')
        router.push('/')
        return
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save service')
      }

      setIsDialogOpen(false)
      setEditingService(null)
      setFormData({})
      fetchServices()
    } catch (error) {
      console.error("Error saving service:", error)
      alert(error instanceof Error ? error.message : 'Failed to save service')
    }
  }

  const handleNewService = () => {
    setEditingService(null)
    setFormData({
      title: "",
      description: "",
      category: "Web Development",
      pricePerHour: 0,
      experience: "Intermediate",
      rating: 4.5,
      reviews: 0,
      image: "",
      tags: [],
      availability: "Available",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-lightpink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple font-inter">Manage Your Services</h1>
            <p className="text-lightgrey mt-1">Create and manage your freelance service offerings</p>
          </div>
          <button
            onClick={handleNewService}
            className="flex items-center gap-2 px-6 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Service
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-grey500 border-t-purple rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lightgrey">Loading...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.length === 0 ? (
              <div className="bg-white rounded-lg border border-grey500 p-12 text-center">
                <p className="text-lightgrey text-lg mb-4">You haven't created any services yet</p>
                <button
                  onClick={handleNewService}
                  className="px-6 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium"
                >
                  Create Your First Service
                </button>
              </div>
            ) : (
              services.map((service) => (
                <div key={service._id} className="bg-white rounded-lg border border-grey500 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black font-inter">{service.title}</h3>
                      <p className="text-sm text-lightgrey mt-1">{service.description}</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="px-3 py-1 bg-lightpink text-purple text-sm rounded">{service.category}</span>
                        <span className="px-3 py-1 bg-orange text-white text-sm rounded">${service.pricePerHour}/hr</span>
                        <span className={`px-3 py-1 text-white text-sm rounded ${
                          service.availability === "Available" ? "bg-green" : "bg-red"
                        }`}>
                          {service.availability}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex items-center gap-2 px-4 py-2 border border-purple text-purple rounded-lg hover:bg-purple hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-lg hover:opacity-80 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple font-inter">
                  {editingService ? "Edit Service" : "Create New Service"}
                </h2>
                <button onClick={() => setIsDialogOpen(false)} className="text-lightgrey hover:text-black text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="Service Title"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Description</label>
                  <textarea
                    placeholder="Describe your service"
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Category</label>
                    <select
                      value={formData.category || "Web Development"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                    >
                      <option>Web Development</option>
                      <option>Mobile Development</option>
                      <option>UI/UX Design</option>
                      <option>Content Writing</option>
                      <option>Data Analysis</option>
                      <option>Video Editing</option>
                      <option>Graphic Design</option>
                      <option>Tutoring</option>
                      <option>Social Media</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Price per Hour ($)</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={formData.pricePerHour || ""}
                      onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Experience Level</label>
                    <select
                      value={formData.experience || "Intermediate"}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Availability</label>
                    <select
                      value={formData.availability || "Available"}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                    >
                      <option>Available</option>
                      <option>Busy</option>
                      <option>Not Available</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, TypeScript"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(t => t.trim()) })}
                    className="w-full px-4 py-2 border border-grey500 rounded-lg focus:outline-none focus:border-purple"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full px-4 py-3 bg-purple text-white rounded-lg hover:bg-bgpurple transition-colors font-medium"
                >
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
