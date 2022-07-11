const express = require("express");
const userController = require('../controllers/userController');

const r = express.Router();

r.get("/cart/:userId", userController.getCartById);
r.put("/cart/:userId", userController.populateCart);
r.post("/cart/checkout/:userId", userController.checkout);

module.exports = r;