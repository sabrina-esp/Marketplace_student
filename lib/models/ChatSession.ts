import mongoose, { Schema, models } from 'mongoose';

const ChatSessionSchema = new Schema(
  {
    title: { type: String, default: 'New Chat', trim: true },
    lastMessageSnippet: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
  },
);

export type ChatSessionDocument = mongoose.InferSchemaType<typeof ChatSessionSchema>;

export default models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);


