'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var max = [5 , 'The value of ({VALUE}) exceeds the limit ({MAX}). ']
var min = [1 , 'The value of ({VALUE}) is beneath the limit ({MIN}). ']

const ProductSchema = Schema({
  title: String,
  price: {
    type: Number,
    default: 0
  },
  user: String,
  categoryproduct: {
    type: String,
    enum:['Moda y Accesorios', 'Motor y Accesorios', 'Electrónica', 'Deporte', 'Libros, Música y Películas', 'Electrodomésticos', 'Servicios', 'Muebles y Decoración', 'Otros']
  },
  description: String,
  visits: Number,
  status: {
    type: Boolean,
    default: false
  },
  publicationdate: {
    type: Date,
    default: Date.now()
  },
  salesrating: {
    type: Number,
    max: max,
    min: min
  },
  salescomment: String
})

module.exports = mongoose.model('Product', ProductSchema);
