import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Product from '../models/Product';
import productService from '../service/product.service';
import sendResponse from '../dto/response/send-response'
import ApiError from '../middleware/ApiError';

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

  public getProductDetail = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
      throw new ApiError(400, 'ProductId không được để trống !');
    }

    const product = await productService.getProductDetail(productId);
    if (!product) {
      throw new ApiError(404, 'Không tìm thấy sản phẩm !');
    }
    sendResponse(res, {
        code: 200,
        message: 'Lấy chi tiết sản phẩm thành công !',
        result: {
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            rating: product.rating,
            sold: product.sold,
            discount: product.discount,
            comments: product.comments || []
        }
    });
  });

  public addToFavorites = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    const { productId } = req.params;

    if (!productId) {
      throw new ApiError(400, 'ProductId không được để trống !');
    }

    if (!userId) {
      throw new ApiError(401, 'Vui lòng đăng nhập để thực hiện chức năng này !');
    }

    await productService.addToFavorites(userId, productId);
    sendResponse(res, {
        code: 200,
        message: 'Thêm sản phẩm vào yêu thích thành công !',
    });
  });

  public getFavoriteProducts = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      throw new ApiError(401, 'Vui lòng đăng nhập để thực hiện chức năng này !');
    }

    const favorites = await productService.getFavoriteProducts(userId);
    sendResponse(res, {
        code: 200,
        message: 'Lấy danh sách sản phẩm yêu thích thành công !',
        result: favorites
    });
  });

}

export default new ProductController();