import { Router } from 'express';
import {
  getProduct, addProduct
} from '../controllers/product.controller';

const router = Router();

router.get('/', getProduct);
router.post('/', addProduct);

export default router;
