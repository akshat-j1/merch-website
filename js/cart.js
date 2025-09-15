// cart.js

// Elements
const cartCount = document.querySelectorAll('#cart-count'); // support multiple spans
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in all navbars
function updateCartCount() {
    cartCount.forEach(span => {
        if (span) span.textContent = cart.length;
    });
}

// Render cart items on cart.html
function renderCart() {
    if (!cartItemsContainer || !cartTotal) return;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" width="80">
            <div class="details">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);

    // Remove item functionality
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            renderCart();
        });
    });
}

// Add item to cart (works on product pages)
function addToCart(name, price, img) {
    cart.push({ name, price, img });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Clear cart
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    });
}

// Add event listeners to all Add-to-Cart buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const img = btn.dataset.img;
        if (name && price && img) {
            addToCart(name, price, img);
        } else {
            console.warn('Missing product data for Add to Cart button');
        }
    });
});

// Initial load
updateCartCount();
renderCart();