# REST API Thingy


* [Guidelines](#guidelines)
* [Request & Response Examples](#request--response-examples)

## Guidelines

This document provides guidelines and examples for REST API of Thingy, encouraging consistency, maintainability, and best practices across application. Thingy API aim to balance a truly RESTful API interface with a positive developer experience (DX).

## Request & Response Examples

### API Resources to Register and Login in API REST
----------------------------------------

  - [POST /api/signup](#post-signup)
  - [POST /api/signin](#post-signin)
  
### POST /signup
Register inside the REST API

URL Example: http://localhost:3000/api/signup

### POST /signin
Login inside the REST API.
Two forms:
  1. Basic Authorization
  2. JWT

URL Example: http://localhost:3000/api/signin

Body: fields to register are email, name and password

PD: Inside the Authorization header we will add:
  1. Basic (email: password in Base64)
  2. Bearer (JWT generated from the registry)


### API Resources of Products
----------------------------------------

  - [GET /api/products](#get-products)
  - [GET /products/[id]](#get-productsid)
  - [POST /products](#post-product)
  - [PUT /products/[id]](#put-product)
  - [DELETE /products/[id]](#delete-product)

### GET /products
Gets all products.

URL Example: http://localhost:3000/api/products

### GET /products/[id]
Gets a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb

### POST /products
Add a specific product.

URL Example: http://localhost:3000/api/products

Body: fields to add a product(title, price, categoryproduct, description, visits, status, salesrating, salescomment...)

Neccesary: JWT Authorization

### PUT /products/[id]
Modify a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb

Body: fields to modify a product(title, price, categoryproduct, description, status, salesrating, salescomment...)

Neccesary: JWT Authorization

### DELETE /products/[id]
Delete a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb

Neccesary: JWT Authorization



### API Resources of Users
----------------------------------------
  - [GET /api/users](#get-users)
  - [GET /users/[id]](#get-usersid)
  - [GET /users/[id]/products](#get-productsuser)
  - [PUT /users/[id]](#put-users)


### GET /users
Gets all users.

URL Example: http://localhost:3000/api/users

### GET /users/[id]
Gets a specific user.

URL Example: http://localhost:3000/api/users/59494b61f03651444481e2ea

Neccesary: JWT Authorization

### GET /users/[id]/products
Gets specifics products user's.

URL Example: http://localhost:3000/api/users/59494b61f03651444481e2ea/products

Neccesary: JWT Authorization

### PUT /users/[id]
Modify a specific user information.

URL Example: http://localhost:3000/api/users/59494b61f03651444481e2ea

Body: fields to modify an user(name, password, userimg, birthdate, location...)

Neccesary: JWT Authorization






