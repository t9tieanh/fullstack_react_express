import mongoose, { Document, Schema } from "mongoose";
import 'dotenv/config';


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

const Product = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
