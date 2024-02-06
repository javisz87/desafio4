import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';
import path from 'path';

import ProductManager from './ProductManager.js';

const productsSocket = new ProductManager(
  path.join(__dirname, 'productos.json')
);

const app = express();

app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

//Endpoints api
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(8080, () => console.log('Listening on 8080'));

export const io = new Server(server);
io.on('connection', async (socket) => {
  io.emit('mesagge');
  console.log('Server levantado con sockets');

  socket.on('addProduct', async (product) => {
    console.log('Nuevo-producto', product);

    const newProductId = await productsSocket.addProduct(product);
    const newProduct = await productsSocket.getProductById(newProductId);

    io.emit('productAdded', newProduct);
  });
  socket.on('deleteProductById', async (id) => {
    console.log(id);
    const idDeleted = await productsSocket.deleteProductById(id);

    io.emit('productDeleted', idDeleted);
  });
});
