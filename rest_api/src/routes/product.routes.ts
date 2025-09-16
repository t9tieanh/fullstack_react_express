import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

router.get('/', productController.getProduct);
router.get('/search', productController.searchProducts);
router.post('/', productController.addProduct);

export default router;
