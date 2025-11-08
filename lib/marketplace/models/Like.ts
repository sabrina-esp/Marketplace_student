import mongoose from "mongoose"

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketplaceService",
      required: true,
    },
  },
  { timestamps: true },
)

// Ensure a user can only like a service once
likeSchema.index({ userId: 1, serviceId: 1 }, { unique: true })

export const MarketplaceLike = mongoose.models.MarketplaceLike || mongoose.model("MarketplaceLike", likeSchema)
