import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    fileType: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    author: { type: String, trim: true },
    date: { type: Date },
    popularity: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export type ProductDocument = mongoose.InferSchemaType<typeof ProductSchema>;

export default models.Product || mongoose.model('Product', ProductSchema);


