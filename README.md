# REST API Thingy


* [Guidelines](#guidelines)
* [Request & Response Examples](#request--response-examples)

## Guidelines

This document provides guidelines and examples for REST API of Thingy, encouraging consistency, maintainability, and best practices across application. Thingy API aim to balance a truly RESTful API interface with a positive developer experience (DX).

## Request & Response Examples

### API Resources of Products

  - [GET /api/products](#get-products)
  - [GET /products/[id]](#get-productsid)
  - [POST /products](#post-product)
  - [PUT /products/[id]](#put-product)
  - [DELETE /products/[id]](#delete-product)

### GET /magazines
Gets all products.

URL Example: http://localhost:3000/api/products

### GET /products/[id]
Gets a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb

### POST /products
Add a specific product.

URL Example: http://localhost:3000/api/products
Body: fields to add a product(title, price, categoryproduct, description, visits, status, salesrating, salescomment...)

### PUT /products/[id]
Modify a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb
Body: fields to modify a product(title, price, categoryproduct, description, status, salesrating, salescomment...)

### DELETE /products/[id]
Delete a specific product.

URL Example: http://localhost:3000/api/products/59494c21f03651444481e2eb






