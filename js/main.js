// ==========================
// GLOBAL VARIABLES
// ==========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sidebar elements
const sidebarCartItems = document.getElementById("sidebar-cart-items");
const sidebarCartTotal = document.getElementById("sidebar-cart-total");
const sidebarCheckoutBtn = document.getElementById("sidebar-checkout-btn");
const sidebarClearCartBtn = document.getElementById("sidebar-clear-cart-btn");

// Main cart page elements (may not exist on all pages)
const mainCartItems = document.getElementById("main-cart-items");
const mainCartTotal = document.getElementById("main-cart-total");
const mainCheckoutBtn = document.getElementById("main-checkout-btn");
const mainClearCartBtn = document.getElementById("main-clear-cart-btn");

// Cart icon
const cartBtn = document.getElementById("cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart-btn");

// ==========================
// CART FUNCTIONS
// ==========================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    saveCart();
    updateAllCarts();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateAllCarts();
}

function clearCart() {
    cart = [];
    saveCart();
    updateAllCarts();
}

function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// ==========================
// RENDER FUNCTIONS
// ==========================
function renderCart(container, totalElement) {
    if (!container || !totalElement) return;

    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = `<p class="empty-cart-message">Your cart is empty.</p>`;
        totalElement.textContent = "0.00";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="details">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <button class="remove-btn">&times;</button>
        `;
        const removeBtn = div.querySelector(".remove-btn");
        removeBtn.addEventListener("click", () => removeFromCart(item.name));
        container.appendChild(div);
    });

    totalElement.textContent = calculateTotal().toFixed(2);
}

function updateAllCarts() {
    renderCart(sidebarCartItems, sidebarCartTotal);
    renderCart(mainCartItems, mainCartTotal);

    const cartCountSpans = document.querySelectorAll("#cart-count");
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpans.forEach(span => (span.textContent = totalQuantity));
}

// ==========================
// ADD TO CART BUTTONS
// ==========================
const addToCartBtns = document.querySelectorAll(".add-to-cart");
addToCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const item = {
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            img: btn.dataset.img
        };
        addToCart(item);
    });
});

// ==========================
// SIDEBAR TOGGLE
// ==========================
if (cartBtn && cartSidebar && cartOverlay && closeCartBtn) {
    const openSidebar = () => {
        cartSidebar.classList.add("is-open");
        cartOverlay.classList.add("is-visible");
    };

    const closeSidebar = () => {
        cartSidebar.classList.remove("is-open");
        cartOverlay.classList.remove("is-visible");
    };

    cartBtn.addEventListener("click", openSidebar);
    closeCartBtn.addEventListener("click", closeSidebar);
    cartOverlay.addEventListener("click", closeSidebar);
}

// ==========================
// CLEAR & CHECKOUT BUTTONS
// ==========================
if (sidebarClearCartBtn) sidebarClearCartBtn.addEventListener("click", clearCart);
if (mainClearCartBtn) mainClearCartBtn.addEventListener("click", clearCart);

if (sidebarCheckoutBtn) sidebarCheckoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
});
if (mainCheckoutBtn) mainCheckoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
});

// ==========================
// CHECKOUT PAGE (summary & form)
// ==========================
const orderSummaryContainer = document.getElementById("order-summary-items");
const orderTotalElement = document.getElementById("order-total");
const checkoutForm = document.getElementById("checkout-form");

function renderCheckoutSummary() {
    if (!orderSummaryContainer || !orderTotalElement) return;
    orderSummaryContainer.innerHTML = "";

    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = `<p>Your cart is empty.</p>`;
        orderTotalElement.textContent = "0.00";
        return;
    }

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("summary-item");
        div.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummaryContainer.appendChild(div);
    });

    orderTotalElement.textContent = calculateTotal().toFixed(2);
}

if (checkoutForm) {
    renderCheckoutSummary();

    checkoutForm.addEventListener("submit", e => {
        e.preventDefault();
        alert("Order placed successfully!");
        clearCart();
        checkoutForm.reset();
        window.location.href = "index.html";
    });
}

// ==========================
// INITIALIZE
// ==========================
updateAllCarts();
