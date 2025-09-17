import Product from "../models/Product";
import { CommentDto } from "../dto/request/comment.dto";
import ApiError from "../middleware/ApiError";
import mongoose from "mongoose";

class CommentService {
    async addComment(userId: string, commentDto: CommentDto) {
        // Create a new comment
        const comment = {
            user: new mongoose.Types.ObjectId(userId),
            content: commentDto.content as string,
            rating: commentDto.rating as number,
            createdAt: new Date()
        };

        // Find the product and add the comment
        const product = await Product.findById(commentDto.productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        if (!product.comments) {
            product.comments = [];
        }

        product.comments.push(comment);
        await product.save();

        return comment;
    }

    async getCommentsByProductId (productId: string) {

    }

}

export default new CommentService();