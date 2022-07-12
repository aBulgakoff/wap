const serverURL = "http://localhost:3333";

function changeInterfaceToAuthorized() {
    updateDisplayedName();
    document.getElementById("header-login").style.display = "none";
    document.getElementById("header-welcome").style.display = "block";
    document.getElementById("main-content").style.display = "block";
    document.getElementById("log-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";


}

function changeInterfaceToUnauthorized() {
    document.getElementById("header-login").style.display = "block";
    document.getElementById("header-welcome").style.display = "none";
    document.getElementById("main-content").style.display = "none";
    document.getElementById("log-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
}

const applyAuthorization = async function () {
    const authorization = sessionStorage.getItem("accessToken");
    authorization ? changeInterfaceToAuthorized() : changeInterfaceToUnauthorized();
}

const getProductsLine = function (p) {
    return `
        <tr>
            <td>${p.title}</td>
            <td>${p.price}</td>
            <td>${p.qty}</td>
            <td><img src='${serverURL}/pic/${p.id}.svg' alt='pdouct ${p.id} picture'></td>
            <td><a href="#" data-id="${p.id}" onclick="populateCart(this.dataset.id)"><img src='${serverURL}/pic/bag.svg' alt="order"></a></td>
        </tr>
`
}

const getCartLine = function (title, price, id, qty) {
    return `
        <tr>
            <td>${title}</td>
            <td>${price}</td>
            <td>${parseFloat(price) * qty}</td>
            <td>
            <input type="image" src='${serverURL}/pic/dash.svg' alt="reduce qty" data-id="qty-${id}" onclick="changeQty(this.dataset.id, -1)"/>
            <input type="text" id="qty-${id}" value='${qty}' size="1" onchange="updateCart(this)">
            <input type="image" src='${serverURL}/pic/plus.svg' alt="increase qty" data-id="qty-${id}" onclick="changeQty(this.dataset.id, 1)"/>
            </td>
        </tr>
        `
}
const populateCart = async function (productId) {
    let elementId = `qty-${productId}`;
    let element = document.getElementById(elementId);
    if (element) {
        let val = parseInt(element.value) + 1;
        document.getElementById(elementId).value = val;
        const res = await authorizedPut("users/cart", {"change": {"productId": productId, "qty": val}});
        res.error && alert(res.error);
    } else {
        const res = await authorizedPut("users/cart", {"change": {"productId": productId, "qty": 1}});
        res.error && alert(res.error);
        initApp();
    }
}


const changeQty = async function (id, multiplier) {
    const productId = id.split("-")[1];
    let val = parseInt(document.getElementById(id).value) + multiplier * 1;
    document.getElementById(id).value = val;
    const res = await authorizedPut("users/cart", {"change": {"productId": productId, "qty": val}});
    res.error && alert(res.error);
    val || initApp();
}

const updateCart = async function (field) {

    const val = parseInt(field.value);
    const productId = field.id.split("-")[1];

    if (Number.isNaN(val) || val < 0) {
        alert("Value have to be a positive number.");
        let cart = await fetchCart();
        field.value = cart[productId];
    } else {
        const res = await authorizedPut("users/cart", {"change": {"productId": productId, "qty": val}});
        res.error && alert(res.error);
    }
    val || initApp();
}

const getCartFooter = function (tPrice) {
    return `
        <tr>
            <td class="table-end" colspan="5">Total: ${tPrice}</td>
        </tr>
        <tr>
            <td class="table-end" colspan="5">
            <button type="button" class="btn btn-outline-primary">Submit</button>
            </td>
        </tr>
    `
}
const authorizedPost = async function (path, body) {
    const authorization = sessionStorage.getItem("accessToken");
    const req = await fetch(`${serverURL}/${path}`, {
        method: 'POST',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
        body
    });
    if (req.status === 401) {
        changeInterfaceToUnauthorized();
    }
    return await req.json();
}

const authorizedPut = async function (path, body) {
    const authorization = sessionStorage.getItem("accessToken");
    const req = await fetch(`${serverURL}/${path}`, {
        method: 'PUT',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify(body)
    });
    if (req.status === 401) {
        changeInterfaceToUnauthorized();
    }
    return await req.json();
}

const authorizedGet = async function (path, params) {
    const authorization = sessionStorage.getItem("accessToken");
    const req = await fetch(`${serverURL}/${path}${params ? ("?" + new URLSearchParams(params)) : ""}`, {
        method: 'GET',
        headers: {
            authorization,
            'Content-Type': 'application/json'
        },
    });
    if (req.status === 401) {
        changeInterfaceToUnauthorized();
    }
    return await req.json();
}

const updateDisplayedName = () => {
    const token = sessionStorage.getItem("accessToken");
    const name = token.split(" ")[1].split("-")[1];
    document.getElementById("header-welcome").innerHTML = `<li>Welcome, ${name}</li>`
}

const clickLogin = async function () {
    let nameLastname = document.getElementById('uname').value;
    let password = document.getElementById('pword').value;
    if (!nameLastname || !password) return alert("Name, Lastname and Password are required fields.");
    let [name, lname] = nameLastname.split("-");

    const req = await fetch(`${serverURL}/login?${new URLSearchParams({name, lname, password})}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const res = await req.json();
    res.error && alert(res.error);
    if (res.accessToken) {
        sessionStorage.setItem("accessToken", `bearer ${res.accessToken}`);
        changeInterfaceToAuthorized();
    }
    initApp();
}

const clickLogout = async function () {
    sessionStorage.removeItem("accessToken");
    changeInterfaceToUnauthorized();
    initApp();
}

async function initApp() {
    await applyAuthorization();
    let products = await fetchProducts();
    let pTable = '';
    for (const product in products) {
        pTable += getProductsLine(products[product]);
    }
    document.getElementById("products").innerHTML = pTable;

    let cart = await fetchCart();
    let cTable = ''
    let totalPrice = 0;
    for (const order in cart) {
        let pInfo = products.filter((p) => p.id == order)[0];
        totalPrice += parseFloat(pInfo.price);
        cTable += getCartLine(pInfo.title, pInfo.price, order, cart[order])
    }
    cTable += getCartFooter(totalPrice);
    document.getElementById("cart").innerHTML = cTable;
}

window.addEventListener('DOMContentLoaded', (event) => {
    initApp();
    document.getElementById("log-btn").onclick = clickLogin;
    document.getElementById("logout-btn").onclick = clickLogout;

});

window.onload = async function () {
}

async function fetchProducts() {
    return await authorizedGet(`products/`);
}

async function fetchCart() {
    let cart = await authorizedGet(`users/cart/`);
    for (const c in cart) {
        if (cart[c] == 0) delete cart[c];
    }
    return cart;
}


