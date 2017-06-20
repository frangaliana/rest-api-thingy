
'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const service = require('../services');
const bcrypt = require('bcrypt-nodejs');

function signUp(req, res) {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  user.save((err) => {
    if (err) res.status(500).send({ message: `Error al registrar el usuario ${err}` });

    return res.status(201).send({
      message: 'Te has registrado correctamente',
      token: service.createToken(user),
      links: {
        products: 'localhost:3000/api/product',
        self: 'localhost:3000/api/user/'+user.id,
        user_products: 'localhost:3000/api/user/'+user.id+'/product'
      }
    });
  });
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
                  token: service.createToken(user),
                  links: {
                    products: 'localhost:3000/api/product',
                    self: 'localhost:3000/api/user/'+user.id,
                    user_products: 'localhost:3000/api/user/'+user.id+'/product'
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

  User.find(query)
    .select('id name')
    .limit(limit)
    .exec((err, users) =>{
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
                previous: 'localhost:3000/api/user?before='+users[0].id,
                next: 'localhost:3000/api/user?after='+users[users.length-1].id,
              },
              links: {
                self: 'localhost:3000/api/user',
                products: 'localhost:3000/api/product'
              }
            }
          } else {
            var result = {
              data: users,
              links: {
                self: 'localhost:3000/api/user',
                products: 'localhost:3000/api/product'
              }
            }
          }

          res.status(200).send(result);
  });
}

function getUser(req, res) {
  let userId = req.params.userId;

  User.findById(userId, {id: 1, name: 1}, (err, user) => {
    res.setHeader('Content-Type', 'application/json');
    if (err) return res.status(500).send({ message: `Error al realizar la petición ${err}` });
    if (!user) return res.status(404).send({ message: `No existe el usuario con el id + ${userId}` });

    //Al mandar un objeto del mismo nombre clave-valor, se puede reducir así product:product
    var result = {
      user: user,
      links: {
        self: 'localhost:3000/api/user/'+user.id,
        products: 'localhost:3000/api/user/'+user.id+'/product'
      }
    }
      res.status(200).send(result);
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
                  self: 'localhost:3000/api/user/'+user.id,
                  user_products: 'localhost:3000/api/user/'+user.id+'/product'
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

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUser,
  updateUser
};
