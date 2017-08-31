'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
    default: [38.280153, -0.712901]
  }
})

module.exports = mongoose.model('Location', LocationSchema);
