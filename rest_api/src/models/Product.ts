import mongoose, { Document, Schema, Types } from "mongoose";
import 'dotenv/config';
import { IUser } from "./User";


export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  discount?: number;
  comments?: {
    user: Types.ObjectId | IUser;
    content: string;
    rating: number;
    createdAt: Date;
  }[];
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    discount: { type: Number },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
