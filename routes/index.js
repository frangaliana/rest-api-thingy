'use strict';

const express = require('express');
const productCtrl = require('../controllers/product');
const userCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const api = express.Router();

//Rutas de productos
api.get('/products', auth, productCtrl.getProducts);
api.get('/products/:productId', productCtrl.getProduct);
api.post('/products', auth, productCtrl.saveProduct);
api.put('/products/:productId', auth, productCtrl.updateProduct);
api.delete('/products/:productId', auth, productCtrl.deleteProduct);
api.get('/users/:userId/products', auth, productCtrl.getProductsUser);

//Rutas de productos cercanos
api.get('/nearbys', auth, productCtrl.getNearbyProducts)

//Rutas de users
api.post('/signup', userCtrl.signUp);
api.post('/signin', userCtrl.signIn);
api.get('/users', userCtrl.getUsers);
api.get('/users/:userId', userCtrl.getUser);
api.put('/users/:userId', auth, userCtrl.updateUser);
api.delete('/users/:userId', auth, userCtrl.deleteUser);

module.exports = api;
