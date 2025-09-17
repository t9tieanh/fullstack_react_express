import { Router } from 'express';
import productController from '../controllers/product.controller';
import { auth } from '../middleware/auth'

const router = Router();

router.get('/', productController.getProduct);
router.get('/search', productController.searchProducts);
router.post('/', productController.addProduct);
router.get('/:productId', productController.getProductDetail);

router.use(auth);
router.post('/:productId/favorites', productController.addToFavorites);
router.get('/favorites', productController.getFavoriteProducts);

export default router;
