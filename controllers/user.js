
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

    return res.status(200).send({ token: service.createToken(user) });
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

module.exports = {
  signUp,
  signIn,
};
