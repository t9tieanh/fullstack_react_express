import mongoose, { Document, Schema } from "mongoose";
import 'dotenv/config';
import { IProduct } from "./Product";
import { IUser } from "./User";


export interface IFavoriteProduct extends Document {
  product: IProduct;
  user: IUser;
}

const FavoriteProductSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<IFavoriteProduct>('FavoriteProduct', FavoriteProductSchema);