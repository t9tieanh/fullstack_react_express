import { IProduct } from '../models/Product';
import elasticsearchService from './elasticSearch.service';
import Product from '../models/Product';

class ProductService {

  //elastic search by name
  async searchProducts(name: string): Promise<IProduct[]> {
    const esQuery = {
      size: 10,
      query: {
      match: {
        name: {
          query: name,
          fuzziness: 2,
          prefix_length: 1
        }
      }
    }
    };
    return elasticsearchService.search<IProduct>('products', esQuery);
  }

  // get products with pagination and optional minPrice filter
  async getProduct(page: number, limit: number, minPrice?: number, minStart?: number): Promise<{ page: number; limit: number; total: number; hasMore: boolean; products: IProduct[] }> {
    const skip = (page - 1) * limit;
    const filter: any = {};
    if (minPrice) {
      filter.price = { $gte: minPrice };
    }
    if (minStart) {
      filter.rating = { $gte: minStart };
    }
    
    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(filter)
    ]);

    return {
      page,
      limit,
      total,
      hasMore: page * limit < total,
      products
    };
  }

  async addProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();

    await elasticsearchService.index('products', newProduct.id.toString(), productData);
    return newProduct;
  }
}

export default new ProductService();
