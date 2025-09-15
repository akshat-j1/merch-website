// js/cart.js

// Get elements from the DOM
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

// Load cart from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the navbar
export function updateCartCount() {
    if (cartCount) {
        // Correctly handle items without a quantity property
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Render cart items for the cart page (for cart.html)
export function renderCart() {
    if (!cartItemsContainer || !cartTotal) {
        return;
    }

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price);
        total += itemPrice * (item.quantity || 1);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" width="80">
            <div class="details">
                <h4>${item.name}</h4>
                <p>₹${itemPrice.toFixed(2)} x ${item.quantity || 1}</p>
                <p>Total: ₹${(itemPrice * (item.quantity || 1)).toFixed(2)}</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);

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

// Add item to cart or increment quantity if it already exists
export function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ name, price: parseFloat(price), img, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Attach listeners for all "Add to Cart" buttons
export function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            const img = btn.dataset.img;
            addToCart(name, price, img);
        });
    });
}

// Attach listener for the "Clear Cart" button on the cart page
export function attachClearCartListener() {
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            }
        });
    }
}
