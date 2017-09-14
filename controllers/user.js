'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const Location = require('../models/location')
const service = require('../services');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment')

function signUp(req, res) {

    var latitude = 38.262609;
    var longitude = -0.720785;

    if(req.body.latitude !== undefined || req.body.longitude !== undefined){
      latitude = req.body.latitude
      longitude = req.body.longitude
    }

      const location = new Location({
        type: req.body.type,
        coordinates: [latitude,longitude]
      })

     var locationSave = location.save();

      locationSave.then( function(result) {
        const user = new User({
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          gender: req.body.gender,
          birthdate: moment(req.body.birthdate, 'DD/MM/YYYY'),
          location: result.id
        });

        user.userimg = user.gravatar()

        user.save((err) => {
          if (err) res.status(500).send({ message: `Error al registrar el usuario ${err}` });

          return res.status(201).send({
            message: 'Te has registrado correctamente',
            token: service.createToken(user),
            user_id: user.id,
            links: {
              products: 'localhost:3000/api/products',
              self: 'localhost:3000/api/users/'+user.id,
              user_products: 'localhost:3000/api/users/'+user.id+'/products'
            }
          });
        });
    })
};

function signIn(req, res) {

  var email = req.body.email;
  var password = req.body.password;

  //Cuando hagamos signin?type=basic
  if(req.query.type) {
    if(req.query.type === 'basic') {
      //Obtiene el login y la contraseña
       var auth = new Buffer(req.get('Authorization').substring(6), 'base64').toString('ascii')
       var split = auth.split(":")
       email = split[0]
       password = split[1]
       console.log('Peticion de login -> ' + email + ':' + password)
    }
  }
       if (email && password) {
          User.findOne({ email: email}, (err, user) => {  //en vez de login: req.body.email
            if (err) return res.status(500).send({ message: err });
            if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

            bcrypt.compare(password, user.password, function(err, comparePassword) { //en vez de password: req.body.password
              if (err) return res.status(500).send({ message: err });
              if (comparePassword == false) return res.status(403).send({ message: 'Datos incorrectos' });

              res.status(200).send({
                  message: 'Te has logueado correctamente',
                  user_id: user.id,
                  token: service.createToken(user),
                  links: {
                    products: 'localhost:3000/api/products',
                    self: 'localhost:3000/api/users/'+user.id,
                    user_products: 'localhost:3000/api/users/'+user.id+'/products'
                  }
              });
            });
          });
      } else {
        res.status(400);
		   	//res.header('WWW-Authenticate', 'Basic realm="ADI"')
		   	res.send('Login incorrecto');
		   	console.log('Login incorrecto');
      }
};

function getUsers(req, res) {
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
    limit = 20;
  }

  var query = {};
  //Para obtener la página anterior a un id
  if (req.query.before) {
    query = {"_id" : {$lt: req.query.before}};
  //Para obtener la página posterior a un id
  } else if (req.query.after) {
    query = {"_id": {$gt: req.query.after}};
  }

  User.find(query)
    .select('-password')
    .limit(limit)
    .exec((err, users) =>{
      Location.populate(users, {path: "location"}, function(err, users) {
        res.setHeader('Content-Type', 'application/json');
        if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
          if(users.length > 0){
            if(req.query.before){
              users.reverse();
            }

            var result = {
                  data: users,
                  paging: {
                    cursors: {
                      before: users[0].id,
                      after: users[users.length-1].id
                    },
                    previous: 'localhost:3000/api/users?before='+users[0].id,
                    next: 'localhost:3000/api/users?after='+users[users.length-1].id,
                  },
                  links: {
                    self: 'localhost:3000/api/users/',
                    products: 'localhost:3000/api/products'
                  }
                }
            } else {
                var result = {
                      data: users,
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
  });
}

function getUser(req, res) {
  let userId = req.params.userId;

  User.findById(userId, {password:0}, (err, user) => {
    Location.populate(user, {path: "location"}, function(err, user) {
      res.setHeader('Content-Type', 'application/json');
      if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
      if (!user) return res.status(404).send({ message: `No existe el usuario con el id + ${userId}` });

      //Al mandar un objeto del mismo nombre clave-valor, se puede reducir así product:product
      var result = {
        user: user,
        links: {
          self: 'localhost:3000/api/users/'+user.id,
          products: 'localhost:3000/api/users/'+user.id+'/products'
        }
      }
        res.status(200).send(result);
    });
  });
}

function updateUser(req, res) {
  let userId = req.params.userId;

  const userUpdated = req.body;

  User.findById(userId, (err, user) => {
    if (err) res.status(500).send({ message: `Error al actualizar el usuario: ${err}` });
    else {
      if(userId == req.user){
        if(!userUpdated.email){
          user.save(function (err, updatedUser) {
            if (err) res.status(500).send({ message: `Error al actualizar el usuario: ${err}` });
            else {
              var result = {
                user: user,
                links: {
                  self: 'localhost:3000/api/users/'+user.id,
                  user_products: 'localhost:3000/api/users/'+user.id+'/products'
                }
              }
              res.status(200).send(result);
            }
          })
        } else {
            res.status(500).send({ message: `Error al actualizar el usuario: email único` });
        }
      } else {
          res.status(400).send({ message: 'Actualización no autorizada: otro usuario'})
      }
    }
  })
}

function deleteUser(req, res) {
  let userId = req.params.userId;

  User.findById(userId, (err, user) => {
      if (err) res.status(500).send({ message: `Error al borrar el producto: ${err}` });

      user.remove(err => {
        if (err) res.status(500).send({ message: `Error al buscar el usuario: ${err}` });
        else {
          var result = {
            message: `Usuario eliminado correctamente, id: ${userId}`,
            links: {
              products: 'localhost:3000/api/products'
            }
          }
          res.status(200).send(result);
        }
      });
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
