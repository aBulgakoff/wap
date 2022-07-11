const express = require('express');
const productController = require('../controllers/productController');

const r = express.Router();


r.post('/', productController.save);
r.get('/', productController.getAll);
r.get('/:productId', productController.getProductById);

r.delete('/:productId', productController.deleteById);
r.put('/:productId', productController.edit)

r.get('/qty/:productId', productController.getAvailability);


module.exports = r;