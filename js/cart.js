// cart.js

const cartKey = 'styleHiveCart';

// Get cart from localStorage or create a new one
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

// Update cart counter in nav
function updateCartCount() {
  let countEl = document.querySelector('#cart-count');
  if (!countEl) return;
  countEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Save cart to localStorage and update counter
function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(item) {
  const existing = cart.find(i => i.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart();
  alert(`${item.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCartItems();
}

// Clear entire cart
function clearCart() {
  cart = [];
  saveCart();
  renderCartItems();
}

// Render cart items in cart.html
function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  if (!container || !totalEl) return;

  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '0';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="details">
        <h4>${item.name}</h4>
        <p>Price: ₹${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <button class="btn remove-item-btn">Remove</button>
      </div>
    `;
    const removeBtn = div.querySelector('.remove-item-btn');
    removeBtn.addEventListener('click', () => removeFromCart(item.name));
    container.appendChild(div);
  });

  totalEl.textContent = total;
}

// Initialize Add to Cart buttons on all product pages
function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = {
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price),
        img: btn.dataset.img
      };
      addToCart(item);
    });
  });
}

// Initialize buttons on cart page
function initCartPageButtons() {
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    alert('Checkout functionality coming soon!');
  });
}

// Run functions
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initAddToCartButtons();
  renderCartItems();
  initCartPageButtons();
});