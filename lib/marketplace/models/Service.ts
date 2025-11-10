import mongoose from "mongoose"

const serviceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Content Writing",
        "Data Analysis",
        "Video Editing",
        "Graphic Design",
        "Tutoring",
        "Social Media",
        "Other",
      ],
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    experience: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=300&width=300",
    },
    tags: [String],
    availability: {
      type: String,
      enum: ["Available", "Busy", "Not Available"],
      default: "Available",
    },
  },
  { timestamps: true },
)

export const MarketplaceService = mongoose.models.MarketplaceService || mongoose.model("MarketplaceService", serviceSchema)
