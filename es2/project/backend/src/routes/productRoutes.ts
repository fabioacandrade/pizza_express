import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

// Todas as rotas de produtos agora são públicas
router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;