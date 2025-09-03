import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    discount: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
