import { Router } from 'express';
import * as addressController from '../controllers/addressController';

const router = Router();

// Rotas de endereços sem autenticação
router.get('/', async (req, res) => { 
  await addressController.getUserAddresses(req, res);
});
router.get('/:id', async (req, res) => {
  await addressController.getAddressById(req, res);
});
router.post('/', async (req, res) => {
  await addressController.createAddress(req, res);
});
router.put('/:id', async (req, res) => {
  await addressController.updateAddress(req, res);
});
router.delete('/:id', async (req, res) => {
  await addressController.deleteAddress(req, res);
});
router.put('/:id/set-default', async (req, res) => {
  await addressController.setDefaultAddress(req, res);
});

export default router;