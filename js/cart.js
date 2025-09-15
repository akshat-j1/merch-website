// cart.js
const cartCountElem = document.getElementById('cart-count');
const cartItemsElem = document.getElementById('cart-items');
const cartTotalElem = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in navbar
function updateCartCount() {
  if(cartCountElem) cartCountElem.textContent = cart.length;
}

// Render cart items in cart.html
function renderCart() {
  if(!cartItemsElem || !cartTotalElem) return;
  cartItemsElem.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price);
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" width="80">
      <div>
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <button class="btn remove-item" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsElem.appendChild(div);
  });

  cartTotalElem.textContent = total;
  // Add remove functionality
  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.index;
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      renderCart();
    });
  });
}

// Add item to cart
function addToCart(item) {
  if(!item.name || !item.price) return;
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${item.name} added to cart`);
}

// Clear entire cart
if(clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  });
}

// Initialize cart on page load
updateCartCount();
renderCart();

// Add event listeners to "Add to Cart" buttons on all pages
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = {
      name: btn.dataset.name,
      price: btn.dataset.price,
      img: btn.dataset.img
    };
    addToCart(item);
  });
});