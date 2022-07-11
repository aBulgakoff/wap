let db = [
    {
        "id": 1,
        "name": "John",
        "lname": "Smith",
        "password": 123,
        "cart": {1: 0}
    },
    {
        "id": 2,
        "name": "Jack",
        "lname": "Brown",
        "password": 123,
        "cart": {1: 0}
    }
]
let counter = 0;

module.exports = class User {
    constructor(id, name, lname, password, cart) {
        this.id = id;
        this.name = name;
        this.lname = lname;
        this.cart = cart;
    }

    static getUser(name, lname) {
        const u = db.filter(u => u.name.toLowerCase() == name.toLowerCase() && u.lname.toLowerCase() == lname.toLowerCase());
        if (u) return u[0];
        throw new Error('NOT Found');
    }

    static getAll() {
        return db;
    }

    static getCartByUserId(userId) {
        return db.filter(u => u.id == userId).flatMap(u => u.cart)[0];
    }

    static findById(userId) {
        const index = db.findIndex(u => u.id == userId);
        if (index > -1) {
            return db[index];
        } else {
            throw new Error('NOT Found');
        }
    }

    static deleteById(userId) {
        const index = db.findIndex(u => u.id == userId);
        const deletedUser = db[index];
        db.splice(index, 1);
        return deletedUser;
    }

}