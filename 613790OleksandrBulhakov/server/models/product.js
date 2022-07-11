let db = [
    {
        "id": 1,
        "title": "mouse",
        "price": "1005",
        "qty": 10
    },
    {
        "id": 2,
        "title": "keyboard",
        "price": "10500",
        "qty": 10
    },
    {
        "id": 3,
        "title": "monitor",
        "price": "100500",
        "qty": 10
    }
];

let counter = 0;

module.exports = class Product {
    constructor(id, title, price, qty) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.qty = qty;
    }

    save() {
        this.id = ++counter;
        db.push(this);
        return this;
    }

    edit() {
        const index = db.findIndex(prod => prod.id == this.id);
        db.splice(index, 1, this);
        return this;
    }

    static getAll() {
        return db;
    }

    static findIndexById(productId) {
        const index = db.findIndex(p => p.id == productId);
        if (index < 0) throw new Error('NOT Found');
        return index;
    }

    static findById(productId) {
        return db[Product.findIndexById(productId)];
    }

    static checkStockQtyById(productId, newQty) {
        const index = Product.findIndexById(productId);
        newQty = db[index].qty - newQty;
        console.log(newQty)
        if (newQty < 0) throw new Error("Quantity can not be negative");
        return db[index];
    }

    static updateStockQtyById(productId, newQty) {
        const index = Product.findIndexById(productId);
        newQty = db[index].qty - newQty;
        console.log(newQty)
        if (newQty < 0) throw new Error("Quantity can not be negative");
        db[index].qty = newQty;
        return db[index];
    }

    static deleteById(prodId) {
        const index = Product.findIndexById(productId);
        const deletedProd = db[index];
        db.splice(index, 1);
        return deletedProd;
    }
}