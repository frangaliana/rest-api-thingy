'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//Utilizaremos la variable para que sea una variable de entorno o 3000 sino
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded( {extended:false}));
app.use(bodyParser.json());

//Manejo de errores por parte del middleware
app.use(function(err, req, res, next) {
  res.status(400);
	res.end();
});

//Petición por defecto para mostrar una Home de la API
app.get('/api', function(req, res){
	res.status(200);
	res.send('Bienvenido a la API REST de Thingy');
})

//Petición para dar error a entrada vacía incorrecta
app.get('*', function(req, res){
	res.status(404);
	res.send('Petición incorrecta');
})

app.listen(port, () => {
  console.log(`API REST OF THINGY corriendo en http://localhost:${port}`)
})
