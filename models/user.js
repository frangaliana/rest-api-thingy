'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const Location = require('../models/location');
const crypto = require('crypto');

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    //Añadir campo unique: true para que sólo se pueda registrar un email
  },
  name: String,
  password: String,
  userimg: String,
  gender: Boolean,
  birthdate: Date,
  signUpDate: {
    type: Date,
    default: Date.now(),
  },
  location:{
    type: Schema.ObjectId,
    ref: 'Location'
  }
});

UserSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.gravatar = function() {
  if(!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('User', UserSchema);
