'use strict';

//Colocar .. para salir de Controller e ir a Models
const Product = require('../models/product');

function getProduct(req, res) {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
    if (!product) return res.status(404).send({ message: `El producto no existe` });

    //Al mandar un objeto del mismo nombre clave-valor, se puede reducir así product:product
    res.status(200).send({ product });
  });
}

function getProducts(req, res) {
  Product.find({}, (err, products) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
    if (products.length > 0) res.status(200).send({ products });
    else return res.status(404).send({ message: `No existen productos` });
  });
}

function saveProduct(req, res) {
  console.log('POST /api/product');
  console.log(req.body);

  let product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.user = req.body.user;
  product.categoryproduct = req.body.categoryproduct;
  product.description = req.body.description;
  product.visits = req.body.visits;
  product.status = req.body.status;
  product.publicationdate = req.body.publicationdate;
  product.salesrating = req.body.salesrating;
  product.salescomment = req.body.salescomment;

  product.save((err, productStored) => {
    if (err) res.status(500).send({ message: `Error al guardar en base de datos: ${err}` })
    else res.status(200).send({ product: productStored });

  });
}

function updateProduct(req, res)  {
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
    if (err) res.status(500).send({ message: `Error al actualizar el producto: ${err}` });

    res.status(200).send({ product: productUpdated });
  });
}

function deleteProduct(req, res) {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if (err) res.status(500).send({ message: `Error al borrar el producto: ${err}` });

    product.remove(err => {
      if (err) res.status(500).send({ message: `Error al buscar el producto: ${err}` });
      res.status(200).send({ message: `El producto ha sido eliminado` });
    });
  });
}

module.exports = {
  getProduct,
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
};
