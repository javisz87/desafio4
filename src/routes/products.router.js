import { Router } from 'express';
import __dirname from '../utils.js';
import ProductManager from '../ProductManager.js';
import path from 'path';

const router = Router();

//Creamos la instancia de la clase
const productManager = new ProductManager(
  path.join(__dirname, 'productos.json')
);

router.post('/', async (req, res) => {
  await productManager.guardar(req.body);

  const io = req.app.get('socketio');
  io.emit('showProducts', await productManager.getProducts());

  res.send({
    status: 'success',
  });
});

router.delete('/:pid', async (req, res) => {
  await productManager.borrar(req.params.pid);

  const io = req.app.get('socketio');
  io.emit('showProducts', await productManager.getProducts());

  res.send({
    status: 'success',
  });
});

export default router;

//TRABAJO ANTERIOR COMENTADO

// //Ruta /products
// //GET: Retorna todos los productos existentes, acepta una query limit para limitar le numero de productos
// router.get('/', async (req, res) => {
//   const products = await productManager.getProducts();

//   const { limit } = req.query; //Verificamos si existe la query limit
//   if (limit) {
//     const productsFiltered = products.slice(0, limit); //Filtramos el array con los productos solicitados
//     res.send(productsFiltered);
//     return;
//   }
//   res.send(products);
// });

// //Ruta /products/:pid
// //GET: Retorna el producto con el id especificado en el param

// router.get('/:pid', async (req, res) => {
//   const { pid } = req.params;
//   const product = await productManager.getProductById(pid);
//   res.send(product);
// });

// //Ruta /products
// //POST: Agrega un nuevo producto.

// router.post('/', async (req, res) => {
//   const { body } = req;
//   const id = await productManager.addProduct(body);
//   res.json(id);
// });

// //Ruta /products
// //DELETE: Elimina un nuevo producto.

// router.put('/:pid', async (req, res) => {
//   const { body } = req;
//   const { pid } = req.params;

//   const id = await productManager.updateProduct(pid, body);
//   res.json(id);
// });

// //Ruta /products
// //DELETE: Elimina un nuevo producto.

// router.delete('/:pid', async (req, res) => {
//   const { pid } = req.params;
//   const product = await productManager.deleteProductById(pid);
//   res.json(product);
// });

// export default router;
