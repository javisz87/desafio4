import { Router } from 'express';
import ProductManager from '../ProductManager.js';
import __dirname from '../utils.js';
import path from 'path';
const router = Router();

const productManager = new ProductManager(
  path.join(__dirname, 'productos.json')
);

router.get('', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { products });
});

export default router;
