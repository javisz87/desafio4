import fs from 'fs';
class CartsManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  async createCart() {
    try {
      if (this.fileExists(this.path)) {
        let carts = await this.getCarts();

        let cart = {
          id: null,
          products: [],
        };

        if (carts.length > 0) {
          let newId = (await carts[carts.length - 1].id) + 1;
          cart.id = newId;
        } else {
          cart.id = 1;
        }

        carts.push(cart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log('Carrito creado exitosamente. ');
        return cart.id;
      } else {
        console.log('El archivo que estas buscando no existe.');
      }
    } catch (error) {
      console.log('Error al crear el carrito');
      console.log(error);
      return { msg: 'Error al crear el carrito' };
    }
  }

  async getCarts() {
    try {
      if (this.fileExists(this.path)) {
        const carts = await fs.promises.readFile(this.path, 'utf-8');
        return carts.length > 0 ? JSON.parse(carts) : [];
      } else {
        console.log('El archivo que estas buscando no existe.');
        return { msg: 'El archivo que estas buscando no existe.' };
      }
    } catch (error) {
      console.log(error);
      return { msg: 'El archivo que estas buscando no existe.' };
    }
  }
  async getCartById(id) {
    try {
      if (this.fileExists(this.path)) {
        const carts = await this.getCarts();
        let cart = carts.find((item) => item.id == id);
        if (cart !== undefined) {
          return cart;
        }
        throw Error('Not Found');
        return id;
      } else {
        console.log(`El carrito con el id ${id} no existe`);
        return { msg: `El carrito con el id ${id} no existe` };
      }
    } catch (error) {
      console.log(`Error al obtener el carrito con el id: ${id} `);

      console.log(error);
      return { msg: 'Error al obtener el producto' };
    }
  }
  async addProductToCart(cartId, productId) {
    try {
      if (this.fileExists(this.path)) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((item) => item.id == cartId);
        //Valida que el carrito con ese id exista
        if (cartIndex !== -1) {
          const productIndex = carts[cartIndex].products.findIndex(
            (item) => item.product == productId
          );
          //Valida si el producto ya esta en el carrito
          if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity++;
          } else {
            let product = { product: parseInt(productId), quantity: 1 };
            carts[cartIndex].products.push(product);
          }

          fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
          return { msg: 'Producto agregado al carrito' };
        } else {
          throw Error(`El carrito con el id ${cartId}  no existe.`);
        }
      } else {
        let msg = 'El archivo que estas buscando no existe.';
        console.log(msg);
        return { msg };
      }
    } catch (error) {
      console.log(error);
      console.log('Error al guardar el producto');
      return { msg: 'Error al guardar el producto' };
    }
  }

  //helpers

  //Verifica si el archivo existe
  fileExists(path) {
    try {
      return fs.statSync(path).isFile();
    } catch (err) {
      return false;
    }
  }
}

export default CartsManager;
