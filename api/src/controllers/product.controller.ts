import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Product from '../models/Product';


export const getProduct = asyncHandler(async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
        Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Product.countDocuments()
        ]);
        res.json({
        page,
        limit,
        total,
        hasMore: page * limit < total,
        products
    });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
export const addProduct = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { name, price, originalPrice, image, rating, sold, discount } = req.body;

        const newProduct = new Product({
        name,
        price,
        originalPrice,
        image,
        rating,
        sold,
        discount
        });

        await newProduct.save();

        res.status(201).json({ message: "Product created", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});