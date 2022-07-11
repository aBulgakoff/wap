const Product = require('../models/product');

exports.save = (req, res, next) => {
    const addedProd = new Product(null, req.body.title, req.body.price, req.body.qty).save();
    res.status(201).json(addedProd);
}

exports.getAll = (req, res, next) => {
    res.status(200).json(Product.getAll());
}

exports.getProductById = (req, res, next) => {
    res.status(200).json(Product.findById(req.params.productId));
}

exports.getAvailability = (req, res, next) => {
    let p = Product.findById(req.params.productId);
    let q = 1;
    if (req.query.qty) {
        q = parseInt(req.query.qty);
    }
    if (q > p.qty) return res.status(400).json({"error": "Stock shortage"});
    return res.status(200).json({"qty": p.qty});
}

exports.deleteById = (req, res, next) => {
    res.json(Product.deleteById(req.params.productId));
}

exports.edit = (req, res) => {
    const editedProd = new Product(req.params.productId, req.body.title, req.body.price, req.body.qty).edit();
    res.json(editedProd);
}
