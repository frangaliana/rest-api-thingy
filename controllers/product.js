'use strict';

//Colocar .. para salir de Controller e ir a Models
const Product = require('../models/product');
const User = require('../models/user');

function getProduct(req, res) {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
    if (!product) return res.status(404).send({ message: `No existe el producto con el id + ${productId}` });

    //Al mandar un objeto del mismo nombre clave-valor, se puede reducir así product:product
    var result = {
      product: product,
      links: {
        self: 'localhost:3000/api/products/'+product.id,
        user: 'localhost:3000/api/users/'+product.user
      }
    }
      res.status(200).send(result);
  });
}

function getProducts(req, res) {
  var limit;
  if(req.query.limit) {
    limit = parseInt(req.query.limit)
    if(isNaN(limit)){
      return next(new Error())
    }
  } else {
    limit = 10;
  }

  var query = {};
  //Para obtener la página anterior a un id
  if (req.query.before) {
    query = {"_id" : {$lt: req.query.before}};
  //Para obtener la página posterior a un id
  } else if (req.query.after) {
    query = {"_id": {$gt: req.query.after}};
  }

  Product.find(query)
    .limit(limit)
    .exec((err, products) =>{
        res.setHeader('Content-Type', 'application/json');
        if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
          if(products.length > 0){
            if(req.query.before){
              products.reverse();
            }

            var result = {
      				data: products,
      				paging: {
      					cursors: {
                  before: products[0].id,
                  after: products[products.length-1].id
      					},
      					previous: 'localhost:3000/api/products?before='+products[0].id,
      					next: 'localhost:3000/api/products?after='+products[products.length-1].id,
      				},
      				links: {
      			 		self: 'localhost:3000/api/products',
      			 		users: 'localhost:3000/api/users'
      				}
      			}
          } else {
            var result = {
              data: products,
              links: {
                self: 'localhost:3000/api/products',
                users: 'localhost:3000/api/users'
              }
            }
          }

          res.status(200).send(result);
  });
}

function getProductsUser(req, res) {
  var userId = req.params.userId;

  var limit;
  if(req.query.limit) {
    limit = parseInt(req.query.limit)
    if(isNaN(limit)){
      return next(new Error())
    }
  } else {
    limit = 10;
  }

  var query = {"user": userId};
  //Para obtener la página anterior a un id
  if (req.query.before) {
    query = {"_id" : {$lt: req.query.before}};
  //Para obtener la página posterior a un id
  } else if (req.query.after) {
    query = {"_id": {$gt: req.query.after}};
  }

  Product.find(query)
    .limit(limit)
    .exec((err, products) =>{
        res.setHeader('Content-Type', 'application/json');
        if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
          if(products.length > 0){
            if(req.query.before){
              products.reverse();
            }

            var result = {
              data: products,
              paging: {
                cursors: {
                  before: products[0].id,
                  after: products[products.length-1].id
                },
                previous: 'localhost:3000/api/'+userId+'/products?before='+products[0].id,
                next: 'localhost:3000/api/'+userId+'/products?after='+products[products.length-1].id,
              },
              links: {
                self: 'localhost:3000/api/'+userId+'/products',
                user: 'localhost:3000/api/'+userId,
                users: 'localhost:3000/api/users'
              }
            }
          } else {
            var result = {
              data: products,
              links: {
                self: 'localhost:3000/api/products',
                user: 'localhost:3000/api/'+userId,
                users: 'localhost:3000/api/users'
              }
            }
          }

          res.status(200).send(result);
  });

}

function saveProduct(req, res) {
  console.log('POST /api/products');
  console.log(req.body);

  let product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.user = req.user;
  product.categoryproduct = req.body.categoryproduct;
  product.description = req.body.description;
  product.visits = req.body.visits;
  product.status = req.body.status;
  product.publicationdate = req.body.publicationdate;
  product.salesrating = req.body.salesrating;
  product.salescomment = req.body.salescomment;

  product.save((err, productStored) => {
    if (err) { res.status(500).send({ message: `Error al guardar en base de datos: ${err}` })
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.header('Location','http://localhost:3000/api/products/'+product.id)

      var result = {
        product: productStored,
        links: {
          self: 'localhost:3000/api/products/'+product.id,
          user_products: 'localhost:3000/api/users/'+product.user+'/products'
        }
      }
      res.status(201).send(result);
    }

  });
}

function updateProduct(req, res)  {
  let productId = req.params.productId;
  let update = req.body;

  Product.findByIdAndUpdate(productId, update, (err, productUpdated) => {
    res.setHeader('Content-Type', 'application/json');

    if(productUpdated.user == req.user){
      if (err) res.status(500).send({ message: `Error al actualizar el producto: ${err}` });
      else {
        var result = {
          product: productUpdated,
          links: {
            self: 'localhost:3000/api/products/'+productUpdated.id,
            user_products: 'localhost:3000/api/users/'+productUpdated.user+'/products'
          }
        }
        res.status(200).send(result);
      }
    } else {
      res.status(400).send({ message: 'Actualización no autorizada: producto de otro usuario'})
    }
  });
}

function deleteProduct(req, res) {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    if(product.user == req.user){

      if (err) res.status(500).send({ message: `Error al borrar el producto: ${err}` });

      product.remove(err => {
        if (err) res.status(500).send({ message: `Error al buscar el producto: ${err}` });
        else {
          var result = {
            message: `Producto eliminado correctamente, id: ${productId}`,
            links: {
              user_product: 'localhost:3000/api/users/'+product.user+'/products',
              products: 'localhost:3000/api/products'
            }
          }
          res.status(200).send(result);
        }
      });
    } else {
      res.status(400).send({ message: 'Borrado no autorizado: producto de otro usuario'})
    }
  });
}

module.exports = {
  getProduct,
  getProducts,
  getProductsUser,
  saveProduct,
  updateProduct,
  deleteProduct,
};
