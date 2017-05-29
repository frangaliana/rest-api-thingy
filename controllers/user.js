
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
  User.findOne({ email: req.body.email}, (err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

    bcrypt.compare(req.body.password, user.password, function(err, comparePassword) {
      if (err) return res.status(500).send({ message: err });
      if (comparePassword == false) return res.status(403).send({ message: 'Datos incorrectos' });

      res.status(200).send({
          message: 'Te has logueado correctamente',
          token: service.createToken(user),
      });
    });
  });
};

module.exports = {
  signUp,
  signIn,
};
