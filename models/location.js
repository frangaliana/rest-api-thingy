'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//default: [38.262609, -0.720785]

const LocationSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  }
})

module.exports = mongoose.model('Location', LocationSchema);
