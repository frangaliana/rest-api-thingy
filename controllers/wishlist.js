'use strict'

const mongoose = require('mongoose')
const Wishlist = require('../models/wishlist');
const User = require('../models/user');
const Product = require('../models/product');

function getWishlist(req, res) {
  let idUser = req.user;

  var limit;
  var before = undefined,
      after = undefined,
      previous = undefined,
      next = undefined;

  if(req.query.limit) {
    limit = parseInt(req.query.limit)
    if(isNaN(limit)){
      return next(new Error())
    }
  } else {
    limit = 5;
  }

  var query = {"user": idUser}
  var populateQuery = [{path: "user", select:'-password'}, {path: "product"}]

  if (req.query.before) {
    query = {"user": idUser, "_id" : {$lt: req.query.before}};
  } else if (req.query.after) {
    query = {"user": idUser, "_id" : {$gt: req.query.after}};
  }

  Wishlist.find(query)
    .populate('products')
    .populate('user')
    .limit(limit)
    .exec((err, products) =>{
        res.setHeader('Content-Type', 'application/json');
        if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
          if(products.length > 0){
            if(req.query.before){
              users.reverse();
            }

            var result = {
                  data: products,
                  paging: {
                    cursors: {
                      before: products[0].id,
                      after: products[products.length-1].id
                    },
                    previous: 'localhost:3000/api/users?before='+products[0].id,
                    next: 'localhost:3000/api/users?after='+products[products.length-1].id,
                  },
                  links: {
                    self: 'localhost:3000/api/users/',
                    products: 'localhost:3000/api/products'
                  }
              }
          } else {

              var result = {
                  data: products,
                  paging: {
                  cursors: {
                    before:undefined,
                    after:undefined
                    },
                    previous: undefined,
                    next: undefined
                  },
                  links: {
                    self: 'localhost:3000/api/users',
                    products: 'localhost:3000/api/products'
                  }
                }
          }

          res.status(200).send(result);
    });
}

function saveProductWishlist(req, res) {
  let wishlist = new Wishlist();
    wishlist.products = req.body.products

  Wishlist.findOne({'user': req.user}, function(err, result) {
    if(err) return res.status(500).send(`Error al añadir el producto en la lista de deseos: ${err}`)
    if(!result){
      wishlist.user = req.user;

      wishlist.save((err, productStored) => {
        if (err) res.status(500).send({ message: `Error al registrar el producto en la lista de deseos ${err}`});
        else {
          res.setHeader('Content-Type', 'application/json');
          res.header('Location','http://localhost:3000/api/wishlist/'+productStored.id)

          var result = {
            product: productStored,
            links: {
              self: 'localhost:3000/api/products/'+productStored.id,
              user_products: 'localhost:3000/api/users/'+productStored.user+'/products'
            }
          }
          res.status(201).send(result);
        }
      })
    } else {
      let resultUser = result.user
      let update = req.body.products

      Wishlist.findByIdAndUpdate(result.id, {$push: {products: update}}, (err, productUpdated) => {
        res.setHeader('Content-Type', 'application/json');

        if(resultUser == req.user){
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
  });
}

function deleteProductWishlist(req, res) {
  let productId = req.params.productId;

  Wishlist.findOne({"products" : productId}, (err, product) => {
    if(product.user == req.user){

      if (err) res.status(500).send({ message: `Error al borrar el producto de la lista de deseos: ${err}` });

      Wishlist.update(product.id,{$pull: {products: productId}}, (err, result) => {
        if (err) res.status(500).send({ message: `Error al buscar el producto en la lista de deseos: ${err}` });
        else {
          var result = {
            message: `Producto eliminado correctamente de la lista de deseos, id: ${productId}`,
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
  getWishlist,
  saveProductWishlist,
  deleteProductWishlist,
};
