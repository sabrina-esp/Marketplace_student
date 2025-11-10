import mongoose from "mongoose"

const chatSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Compound index for efficient queries
chatSchema.index({ roomId: 1, timestamp: 1 })
chatSchema.index({ receiverId: 1, isRead: 1 })

export const MarketplaceChat = mongoose.models.MarketplaceChat || mongoose.model("MarketplaceChat", chatSchema)
