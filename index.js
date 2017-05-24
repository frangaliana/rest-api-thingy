'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//Utilizaremos la variable para que sea una variable de entorno o 3000 sino
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded( {extended:false}));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`API REST OF THINGY corriendo en http://localhost:${port}`)
})
