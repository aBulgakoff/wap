const serverURL = "http://localhost:3333";
let uId = 1;

function changeInterfaceToAuthorized() {
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

const getProductsLine = function (p) {
    return `
        <tr>
            <td>${p.title}</td>
            <td>${p.price}</td>
            <td>${p.qty}</td>
            <td><img src='${serverURL}/pic/${p.id}.svg' alt='pdouct ${p.id} picture'></td>
            <td><a href="#"><img src='${serverURL}/pic/bag.svg' alt="order"></a></td>
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
            <input type="image" src='${serverURL}/pic/dash.svg' alt="reduce qty" data-id="${id}" onclick="changeQty(this.dataset.id)"/>
            <input type="text" data-productId="${id}" value='${qty}' size="1">
            <input type="image" src='${serverURL}/pic/plus.svg' alt="increase qty" data-id="${id}" onclick="changeQty(this.dataset.id)"/>
            </td>
        </tr>
        `
}

const changeQty = function (id){
    document.getElementById(id);
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
    if (err.status === 401) {
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
    if (res.accessToken) {
        sessionStorage.setItem("accessToken", `bearer ${res.accessToken}`);
        updateDisplayedName();
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
    let products = await fetchProducts();
    let pTable = '';
    for (const product in products) {
        pTable += getProductsLine(products[product]);
    }
    document.getElementById("products").innerHTML = pTable;

    let cart = await fetchCart(uId);
    console.log(cart);
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

async function fetchCart(userId) {
    let cart = await authorizedGet(`users/cart/${userId}`);
    for (const c in cart) {
        if (cart[c] == 0) delete cart[c];
    }
    return cart;
}


