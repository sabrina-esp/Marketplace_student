import mongoose, { Schema, models } from 'mongoose';

const AttachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String },
    size: { type: Number },
    previewDataUrl: { type: String },
  },
  { _id: false },
);

const ChatMessageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export type ChatMessageDocument = mongoose.InferSchemaType<typeof ChatMessageSchema>;

export default models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);


