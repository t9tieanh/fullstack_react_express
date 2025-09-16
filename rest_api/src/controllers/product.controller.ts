import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Product from '../models/Product';
import productService from '../service/product.service';
import sendResponse from '../dto/response/send-response'

class ProductController {
  public getProduct = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const minStart = req.query.minStart ? parseFloat(req.query.minStart as string) : undefined;

    const {
      total,
      hasMore,
      products
    } = await productService.getProduct(page, limit, minPrice, minStart);

    res.json({
      page,
      limit,
      total,
      hasMore,
      products
    });
  });

  // elastic search
  public searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query;
    const products = await productService.searchProducts(name as string);
    sendResponse(res, {
        code: 200,
        message: 'Lấy danh sách sản phẩm thành công !',
        result: products
    });
  });

  public addProduct = asyncHandler(async (req: Request, res: Response) => {
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
  });
}

export default new ProductController();