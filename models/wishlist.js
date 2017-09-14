'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.js');
const Product = require('../models/product.js')

const WishlistSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  products: [{
    type: Schema.ObjectId,
    ref: 'Product'
  }]
})

module.exports = mongoose.model('Wishlist', WishlistSchema);
