var supertest = require('supertest');
var assert = require('assert')

var server = supertest.agent("http://localhost:3000");
var access_token;
var userId;
var productId;

describe('API REST Test:', function(){

  //Test POST /api/signup
  it(' Registro realizado de forma correcta', function(done){
      //Al objeto supertest le pasamos la app de Express
     server
          //Hacemos una petición HTTP
          .post('/api/signup').send({ email: 'fjgc9@alu.ua.es', name: 'Francisco Javier', password: '1234'})
          .expect(201)
          .end(function(err, res) {
            assert.equal('Te has registrado correctamente',res.body.message);
            done();
          });
  });

  //Test POST /api/signin?type=basic
  it(' Login con datos incorrectos, devuelve estado 404', function(done) {
    var auth = new Buffer('fjgc9@alu.ua.es:12345').toString('base64');
    //Al objeto supertest le pasamos la app de Express
    server
      //Hacemos una petición HTTP
      .post('/api/signin?type=basic').set('Authorization', 'Basic ' + auth)
      .expect(403)
      .end(done);
  });

  //Test POST /api/signin?type=basic
  it(' Login con datos correctos, mediante Basic', function(done) {
    var auth = new Buffer('fjgc9@alu.ua.es:1234').toString('base64');
    //Al objeto supertest le pasamos la app de Express
      server
        //Hacemos una petición HTTP
        .post('/api/signin?type=basic').set('Authorization', 'Basic ' + auth)
        .expect(200)
        .end(function(err, res) {
            assert(res.body.token);
            access_token = res.body.token
            done();
        })
  });

  //Test GET /api/user
  it(' Registro de otro usuario y obtención lista de usuarios', function(done){
    //Al objeto supertest le pasamos la app de Express
   server
        //Hacemos una petición HTTP
        .post('/api/signup').send({ email: 'fjgalianacano@gmail.com', name: 'Francisco Galiana', password: '1234'})
        .expect(201)
        .expect(function(err, res) {
          assert.equal('Te has registrado correctamente',res.body.message);
        })
          .end(function(){
            server
              //Hacemos una petición HTTP
              .get('/api/user').set('Authorization', 'Bearer ' + access_token)
              .expect(200)
              .end(function(err, res) {
                  assert.equal(res.body.data[0].name, 'Francisco Javier');
                  assert.equal(res.body.data[1].name, 'Francisco Galiana');
                  userId = res.body.data[0]._id;
                  done();
              })
          });
  });

  //Test GET /api/user/:id
  it(' Obtención de información pública del nuevo usuario', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .get('/api/user/'+userId).set('Authorization', 'Bearer ' + access_token)
          .expect(200)
          .end(function(err, res) {
              assert.equal(res.body.user._id, userId);
              assert.equal(res.body.user.name, 'Francisco Javier');
              done();
          })
  });

  //Test PUT /api/user/:id
  it(' Modificación del nuevo usuario y nombre correcto', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .put('/api/user/'+userId).set('Authorization', 'Bearer ' + access_token)
          .send({
            email: 'fjgc92@alu.ua.es',
            name: 'Francisco Javier',
            password: '1234',
            userimg: 'http://localhost:3000/default.png',
            gender: 0,
            birthdate: '1993-05-30',
            location: 'Spain'
          })
          .expect(200)
          .end(function() {
              server
                //Hacemos una petición HTTP
                .get('/api/user/'+userId).set('Authorization', 'Bearer ' + access_token)
                .expect(200)
                .end(function(err, res) {
                    assert.equal('Francisco Javier', res.body.user.name);
                    done();
                })
          })
  });

  //Test POST /api/product
  it(' Registro de producto', function(done) {
    //Al objeto supertest le pasamos la app de Express
      server
        //Hacemos una petición HTTP
        .post('/api/product').set('Authorization', 'Bearer ' + access_token)
        .send({
            title: 'Manos libres',
            price: 300,
            categoryproduct: 'Electrónica',
            description: 'Es la mejor calidad',
            visits: 1,
            status: 0,
            salesrating: 1,
            salescomment: 'Me encanta'
          })
        .expect(201)
        .end(function(err, res) {
            assert('Manos libres',res.body.product.title);
            done();
        })
  });

  //Test GET /api/product
  it(' Obtención lista de productos', function(done){
    //Al objeto supertest le pasamos la app de Express
      server
      //Hacemos una petición HTTP
        .get('/api/product').set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .end(function(err, res) {
            assert.equal(res.body.data[0].title, 'Manos libres');
            productId = res.body.data[0]._id;
            done();
        })
  });

  //Test GET /api/product/:id
  it(' Obtención de información pública de un producto', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .get('/api/product/'+productId).set('Authorization', 'Bearer ' + access_token)
          .expect(200)
          .end(function(err, res) {
              assert.equal( 'Manos libres', res.body.product.title);
              done();
          })
  });

  //Test PUT /api/product/:id
  it(' Actualizar información pública de un producto', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .put('/api/product/'+productId).set('Authorization', 'Bearer ' + access_token)
          .expect(200)
          .send({
            title: 'Manos libres'
          })
          .end(function(err, res) {
              assert.equal('Manos libres', res.body.product.title);
              done();
          })
  });

  //Test GET /api/user/:userId/product
  it(' Obtención de los productos de un usuario', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .get('/api/user/'+userId+'/product').set('Authorization', 'Bearer ' + access_token)
          .expect(200)
          .end(function(err, res) {
              assert.equal('Manos libres', res.body.data[0].title);
              done();
          })
  });

  //Test GET /api/product/:id
  it(' Eliminación de un producto', function(done){

      //Al objeto supertest le pasamos la app de Express
      server
          //Hacemos una petición HTTP
          .delete('/api/product/'+productId).set('Authorization', 'Bearer ' + access_token)
          .expect(200)
          .end(function(err, res) {
              assert.equal(`Producto eliminado correctamente, id: ${productId}`,res.body.message);
              done();
          })
  });
});
