// cart.js

// Get navbar cart count (exists on all pages)
const cartCount = document.getElementById('cart-count');

// Get cart page elements (only exist on cart.html)
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

// Load cart from localStorage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navbar
function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Render cart items on cart.html
function renderCart() {
    if (!cartItemsContainer || !cartTotal) return; // skip if not on cart.html

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

    // Add remove functionality
    const removeBtns = cartItemsContainer.querySelectorAll('.remove-btn');
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

// Add item to cart (used by product pages)
function addToCart(name, price, img) {
    cart.push({ name, price, img });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Clear entire cart (on cart.html)
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    });
}

// Attach add-to-cart buttons on product pages
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        const img = btn.dataset.img;
        addToCart(name, price, img);
        alert(`${name} added to cart!`);
    });
});

// Initial load
updateCartCount();
renderCart();