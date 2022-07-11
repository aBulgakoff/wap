const express = require("express");
const userController = require('../controllers/userController');

const r = express.Router();

r.get("/cart", userController.getCartById);
r.put("/cart", userController.populateCart);
r.post("/cart/checkout", userController.checkout);

module.exports = r;