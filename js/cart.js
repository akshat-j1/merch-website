// cart.js

// Get cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');

// Update cart count in navbar
function updateCartCount() {
  if (!cartCountEl) return;
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Add item to cart
function addToCart(name, price, img) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price: Number(price), img, qty: 1 });
  }
  saveCart();
}

// Remove item from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
}

// Change quantity
function changeQty(name, qty) {
  const item = cart.find(item => item.name === name);
  if (item) {
    item.qty = qty;
    if (item.qty <= 0) removeFromCart(name);
  }
  saveCart();
}

// Render cart items
function renderCart() {
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" width="60">
      <span>${item.name}</span>
      <input type="number" min="1" value="${item.qty}" class="qty-input">
      <span>₹${item.price * item.qty}</span>
      <button class="remove-btn">Remove</button>
    `;
    // Remove button
    div.querySelector('.remove-btn').addEventListener('click', () => {
      removeFromCart(item.name);
    });
    // Quantity input
    div.querySelector('.qty-input').addEventListener('change', e => {
      const val = parseInt(e.target.value);
      if (isNaN(val) || val <= 0) {
        removeFromCart(item.name);
      } else {
        changeQty(item.name, val);
      }
    });
    cartItemsEl.appendChild(div);
  });
  if (cartTotalEl) cartTotalEl.textContent = total;
}

// Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    addToCart(btn.dataset.name, btn.dataset.price, btn.dataset.img);
  });
});

// Initial render
updateCartCount();
renderCart();