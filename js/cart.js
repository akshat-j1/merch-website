// Get elements from the DOM
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Load cart from localStorage or initialize an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the navbar
export function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Render cart items for the cart sidebar
export function renderCart() {
    if (!cartItemsContainer || !cartTotal) {
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price);
        total += itemPrice * (item.quantity || 1);
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" width="60" height="60">
            <div class="details">
                <h4>${item.name}</h4>
                <p>₹${itemPrice.toFixed(2)} x ${item.quantity || 1}</p>
                <p>Total: ₹${(itemPrice * (item.quantity || 1)).toFixed(2)}</p>
            </div>
            <button class="remove-btn" data-index="${index}">&times;</button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    
    // Attach remove button listeners
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

    // Attach clear cart button listener
    const clearCartBtn = document.getElementById('clear-cart-btn');
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
    renderCart(); // Re-render the cart every time an item is added
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

// Checkout Form Submission
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple form validation
    const name = checkoutForm.querySelector('[name="name"]').value;
    const email = checkoutForm.querySelector('[name="email"]').value;
    const address = checkoutForm.querySelector('[name="address"]').value;
    const city = checkoutForm.querySelector('[name="city"]').value;
    const zipCode = checkoutForm.querySelector('[name="zipCode"]').value;

    if (!name || !email || !address || !city || !zipCode) {
        alert('Please fill out all fields.');
        return;
    }

    alert('Order placed successfully! Thank you for your purchase.');
    
    // Clear the cart after successful checkout
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
    
    // Close the sidebar
    document.getElementById('cart-sidebar').classList.remove('is-open');
    document.getElementById('cart-overlay').classList.remove('is-visible');
  });
}
