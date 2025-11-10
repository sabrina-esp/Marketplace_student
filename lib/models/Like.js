import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['like', 'dislike'], default: 'like' },
    mutual: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema);
export default Like;
