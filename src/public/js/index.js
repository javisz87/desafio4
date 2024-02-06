const socket = io();

socket.on('message', console.log('Cliente conectado'));

//------------------------------------------------------------------------------------

const formAddProduct = document.getElementById('formAddProduct');
formAddProduct.addEventListener('submit', (e) => {
  e.preventDefault();

  const productToAdd = {
    title: document.getElementById('titulo').value,
    description: document.getElementById('descripcion').value,
    price: document.getElementById('precio').value,
    thumbnail: document.getElementById('imagen').value,
    code: document.getElementById('code').value,
    stock: document.getElementById('stock').value,
    status: document.getElementById('status').value,
  };
  socket.emit('addProduct', productToAdd);

  socket.on('productAdded', (product) => {
    console.log('El producto añadido es', product);

    const productToRender = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock,
      status: product.status,
    };

    const productTable = document.getElementById('product_table');
    const productTemplate = `<tr>
        <th scope="row" >{{id}}</th>
        <th >{{title}}</th>
        <th >{{description}}</th>
        <th ><img class="imagen" src="{{thumbnail}}" alt=""></th>
        <th >{{code}}</th>
        <th >{{stock}}</th>
        <th >{{status}}</th>
        <th >{{price}}</th>
        </tr>`;
    const template = Handlebars.compile(productTemplate);
    const productHTML = template(productToRender);
    productTable.innerHTML += productHTML;
  });
});

const deleteProduct = (id) => {
  console.log('Producto a eliminar :>> ', id);
  socket.emit('deleteProductById', id);
};

socket.on('productDeleted', (id) => {
  console.log('Producto eliminado :>> ', id);
  let products = document.getElementById('product_table');
  let productToDelet = document.getElementById(id);
  let productDeleted = products.removeChild(productToDelet);
});
