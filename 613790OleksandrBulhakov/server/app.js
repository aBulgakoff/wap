const express = require('express');
const cors = require('cors');
const path = require("path");

const defaultPort = 3333;
const app = express();

const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const userController = require("./controllers/userController");

app.use(cors());
app.use(express.json());
app.use("/pic", express.static(path.join(__dirname, "public")));

app.get("/login", userController.login);

app.use((req, res, next) => {
    const auth = req.headers.authorization ?? "";
    const token = auth.split(' ')[1];
    if (token) {
        req.userId = token.split('-')[0];
        next();
    } else {
        res.status(401).json({error: 'No Access Token'});
    }
})

app.use('/users', userRouter);
app.use('/products', productRouter);

app.use((req, res, next) => {
    res.status(404).json({error: `No endpoints available at ${req.url}`});
});

app.use((err, req, res, next) => {
    if (err.message === 'NOT Found') {
        res.status(404).json({error: err.message});
    } else if (err.message === "Quantity can not be negative") {
        res.status(400).json({error: err.message});
    } else {
        console.log(err)
        res.status(500).json({error: 'Server error'});
    }
});
app.listen(defaultPort, () => console.log(`Running on ${defaultPort} port`));