const User = require("../models/user");
const Product = require('../models/product');

exports.login = (req, res, next) => {
    const u = User.getUser(req.query.name, req.query.lname);
    if (u && u.password == req.query.password) {
        res.status(200).json({accessToken: `${u.id}-${u.name}-${u.lname}-${Date.now().toString()}`})
    } else {
        res.status(400).json({error: 'Invalid username or password!'});
    }
}

exports.getCartById = (req, res, next) => {
    res.status(200).json(User.getCartByUserId(req.userId));
}

exports.populateCart = (req, res, next) => {
    const userCart = User.getCartByUserId(req.userId);
    const requestedChange = req.body.change;
    const productId = requestedChange.productId;
    const newQty = requestedChange.qty;
    if (newQty == 0 & Object.keys(userCart).length > 1) {
        for (const p in userCart) {
            if (userCart[p] == 0) {
                delete userCart[p];
            }
        }
    }
    Product.checkStockQtyById(productId, newQty);
    userCart[productId] = newQty;
    res.status(200).json(userCart);
}

exports.checkout = (req, res, next) => {
    let userCart = User.getCartByUserId(req.userId);
    for (const p in userCart) {
        Product.checkStockQtyById(p, userCart[p]);
    }

    for (const p in userCart) {
        Product.updateStockQtyById(p, userCart[p]);
        delete userCart[p];
    }
    userCart[1] = 0;
    res.status(200).json(userCart);
}
