'use strict';

//Colocar .. para salir de Controller e ir a Models
const Product = require('../models/product');
const User = require('../models/user');
const Location = require('../models/location');


//Aquel al que se le pase el middleware antes tendrá req.user con el id del user logueado
function getProduct(req, res) {
  let productId = req.params.productId;

  Product.findById(productId, (err, product) => {
    User.populate(product, {path: "user", select: '-password'}, function(err, product) {
      res.setHeader('Content-Type', 'application/json');
      if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
      if (!product) return res.status(404).send({ message: `No existe el producto con el id + ${productId}` });

      //Al mandar un objeto del mismo nombre clave-valor, se puede reducir así product:product
      var result = {
        product: product,
        links: {
          self: 'localhost:3000/api/products/'+product.id,
          user: 'localhost:3000/api/users/'+product.user.id
        }
      }
        res.status(200).send(result);
      });
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
    .exec((err, products) => {
      User.populate(products, {path: "user", select: '-password'}, function(err, products) {
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
                    paging: {
                    cursors: {
                      before:undefined,
                      after:undefined
                      },
                      previous: undefined,
                      next: undefined
                    },
                    links: {
                      self: 'localhost:3000/api/products',
                      users: 'localhost:3000/api/users'
                    }
                  }
          }

        res.status(200).send(result);
      });
  });
}

function getNearbyProducts(req, res) {
  var userId = req.user;

  var promiseUser = User.findById(userId, {password: 0})
    .populate('location')
    .exec()

  promiseUser
    .then(function(result){
      return result.location;
    })
    .then( function(resultUser){
        return Location.geoNear(
                {type:'Point', coordinates: [parseFloat(resultUser.coordinates[0]),parseFloat(resultUser.coordinates[1])]},
                {maxDistance:1000, spherical: true}
              ).then(function(locsGeoNear){
                var resultGeoNear = []
                for(var i = locsGeoNear.length - 1; i >= 0; i--){
                  if(resultUser.id != locsGeoNear[i].obj.id){
                    resultGeoNear.push(locsGeoNear[i].obj.id)
                  }
                }
                return resultGeoNear
              })
    })
    .then(function(resultSearchLocs){
      var queryUsersByLocation = {'location': {$in: resultSearchLocs}}

      return User.find(queryUsersByLocation, {password: 0})
              .exec()
             .then(function(usersSearchs){
               var resultUsers = []
               for(var i = usersSearchs.length - 1; i >= 0; i--){
                 if(userId != usersSearchs[i].id){
                   resultUsers.push(usersSearchs[i].id)
                 }
               }
               return resultUsers
             })
    })
    .then(function(resultSearchUsers){
      var limit;

      if(req.query.limit) {
        limit = parseInt(req.query.limit)
        if(isNaN(limit)){
          return next(new Error())
        }
      } else {
        limit = 10;
      }

      var queryProductsByUsers = {'user': {$in: resultSearchUsers}}
      //Para obtener la página anterior a un id
      if (req.query.before) {
        queryProductsByUsers = {'user': {$in: resultSearchUsers}, "_id" : {$lt: req.query.before}};
      //Para obtener la página posterior a un id
      } else if (req.query.after) {
        queryProductsByUsers = {'user': {$in: resultSearchUsers}, "_id": {$gt: req.query.after}};
      }

      return Product.find(queryProductsByUsers)
              .limit(limit)
              .exec()
    })
    .then(function(resultSearchProducts){
      if(resultSearchProducts.length > 0){
        if(req.query.before){
          resultSearchProducts.reverse();
        }

        var resultFinal = {
              data: resultSearchProducts,
              paging: {
                cursors: {
                  before: resultSearchProducts[0].id,
                  after: resultSearchProducts[resultSearchProducts.length-1].id
                },
                previous: 'localhost:3000/api/products?before='+resultSearchProducts[0].id,
                next: 'localhost:3000/api/products?after='+resultSearchProducts[resultSearchProducts.length-1].id,
              },
              links: {
                self: 'localhost:3000/api/products',
                users: 'localhost:3000/api/users'
              }
            }
     } else {
       var resultFinal = {
             data: resultSearchProducts,
             paging: {
             cursors: {
               before:undefined,
               after:undefined
               },
               previous: undefined,
               next: undefined
             },
             links: {
               self: 'localhost:3000/api/products',
               users: 'localhost:3000/api/users'
             }
           }
     }

     res.setHeader('Content-Type', 'application/json');
     res.status(200).send(resultFinal);
    })
    .catch(function(err){
      console.log(`${err}`)
    })
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

  //La llamada populate hará que en la ruta "user" lo popule con los datos del modelo Autor, quedando una respuesta más completa puesto que muestra todo el usuario
  //Si dentro de populate ponemos: select: '...' indicaremos aquellos que queremos mostrar
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
                    previous: 'localhost:3000/api/users/'+userId+'/products?before='+products[0].id,
                    next: 'localhost:3000/api/users/'+userId+'/products?after='+products[products.length-1].id,
                  },
                  links: {
                    self: 'localhost:3000/api/users/'+userId+'/products',
                    user: 'localhost:3000/api/users/'+userId,
                    users: 'localhost:3000/api/users'
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
    if (err) { res.status(500).send({ message: `Error al registrar el producto: ${err}` })
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
  getNearbyProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
};
