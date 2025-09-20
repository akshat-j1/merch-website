import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// A. Firebase Config & Init
// -------------------------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBy8kzUGY8BxnzPHwVVyCQP_3JNa3fOnsY",
    authDomain: "mercancia.firebaseapp.com",
    projectId: "mercancia",
    storageBucket: "mercancia.firebasestorage.app",
    messagingSenderId: "739353469704",
    appId: "1:739353469704:web:afa16cadbcf68a76b0c2bd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// B. Global State & Cart Functions
// -------------------------------------------------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotalItems() {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function getCartTotalPrice() {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0);
}

function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ name, price: parseFloat(price), img, quantity: 1 });
    }
    saveCart();
    updateCartDisplay();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

function removeItemFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// C. UI & Event Handling
// -------------------------------------------------------------
function updateCartDisplay() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = getCartTotalItems();
    }
    
    // Update cart sidebar content
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    if (cartItemsContainer && cartTotalEl) {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                const itemPrice = parseFloat(item.price);
                const itemQuantity = item.quantity || 1;
                itemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" width="60" height="60">
                    <div class="details">
                        <h4>${item.name}</h4>
                        <p>₹${itemPrice.toFixed(2)} x ${itemQuantity}</p>
                        <p>Total: ₹${(itemPrice * itemQuantity).toFixed(2)}</p>
                    </div>
                    <button class="remove-btn" data-index="${index}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        cartTotalEl.textContent = getCartTotalPrice().toFixed(2);
    }
}

function attachGlobalListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const { name, price, img } = btn.dataset;
            addToCart(name, price, img);
            showToast(`${name} added to cart`);
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            menuToggle.classList.toggle('is-active');
        });
    }

    // Cart sidebar functionality (on index.html and all product pages)
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateCartDisplay();
            cartSidebar.classList.add('is-open');
            cartOverlay.classList.add('is-visible');
        });
        closeBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('is-open');
            cartOverlay.classList.remove('is-visible');
        });
        cartOverlay.addEventListener('click', () => {
            cartSidebar.classList.remove('is-open');
            cartOverlay.classList.remove('is-visible');
        });
    }
    
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
                showToast('Cart cleared!');
            }
        });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
            } else {
                window.location.href = 'checkout.html';
            }
        });
    }

    // Remove item buttons within the sidebar
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const index = parseInt(e.target.dataset.index);
            removeItemFromCart(index);
        }
    });

    // Checkout Form Submission (on checkout.html)
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(checkoutForm);
            const requiredFields = ['fullName', 'address', 'city', 'zipCode'];
            let allFieldsFilled = true;

            requiredFields.forEach(field => {
                if (!formData.get(field)) {
                    allFieldsFilled = false;
                }
            });

            if (!allFieldsFilled) {
                alert('Please fill out all required fields.');
                return;
            }

            console.log('Order submitted:', Object.fromEntries(formData.entries()));
            alert('Order placed successfully! Thank you for your purchase.');
            
            cart = [];
            saveCart();
            window.location.href = 'index.html';
        });
    }
}

// D. Initial Setup
// -------------------------------------------------------------
function showToast(msg, isError = false) {
    let t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.right = '20px';
    t.style.bottom = '20px';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.zIndex = 9999;
    t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
    t.style.background = isError ? '#ffdddd' : '#e6ffed';
    t.style.color = isError ? '#b00000' : '#056624';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });
    document.querySelectorAll('.fade-in-section').forEach(section => {
        if (section.getBoundingClientRect().top < window.innerHeight) {
            section.classList.add('is-visible');
        } else {
            observer.observe(section);
        }
    });
}

function initAuthUI() {
    const navLinks = document.querySelector('nav .links') || document.querySelector('.links');
    if (!navLinks) return;
    if (document.getElementById('auth-wrap')) return;

    const authWrap = document.createElement('span');
    authWrap.id = 'auth-wrap';
    authWrap.style.marginLeft = '12px';
    authWrap.style.display = 'inline-flex';
    authWrap.style.alignItems = 'center';
    authWrap.style.gap = '8px';

    const loginBtn = document.createElement('button');
    loginBtn.id = 'login-btn';
    loginBtn.textContent = 'Sign in';
    loginBtn.className = 'btn';
    loginBtn.style.padding = '6px 10px';
    loginBtn.style.fontSize = '0.9rem';
    loginBtn.style.cursor = 'pointer';

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.textContent = 'Sign out';
    logoutBtn.className = 'btn';
    logoutBtn.style.padding = '6px 10px';
    logoutBtn.style.fontSize = '0.9rem';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.style.display = 'none';

    const userLabel = document.createElement('span');
    userLabel.id = 'user-label';
    userLabel.style.fontSize = '0.9rem';
    userLabel.style.color = '#fff';
    userLabel.style.fontWeight = '600';
    userLabel.style.display = 'none';
    userLabel.style.marginLeft = '6px';

    authWrap.appendChild(userLabel);
    authWrap.appendChild(loginBtn);
    authWrap.appendChild(logoutBtn);
    navLinks.appendChild(authWrap);

    loginBtn.addEventListener('click', async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            showToast('Signed in with Google');
        } catch (err) {
            console.error(err);
            showToast('Sign-in failed', true);
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            showToast('Signed out');
        } catch (err) {
            console.error(err);
            showToast('Sign-out failed', true);
        }
    });

    onAuthStateChanged(auth, user => {
        if (user) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            userLabel.style.display = 'inline-block';
            userLabel.textContent = user.displayName || user.email;
        } else {
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            userLabel.style.display = 'none';
            userLabel.textContent = '';
        }
    });
}

function initCustomizeForm() {
    const form = document.getElementById('customize-form');
    if (!form) {
        console.warn('Customize form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name') || 'Anonymous';
        const email = formData.get('email') || '';
        const requestText = formData.get('request') || '';

        if (!requestText.trim()) {
            showToast('Please enter your request', true);
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
            const currentUser = auth.currentUser;
            const payload = {
                name,
                email,
                request: requestText,
                createdAt: serverTimestamp(),
                user: currentUser
                    ? {
                        uid: currentUser.uid,
                        email: currentUser.email || null,
                        isAnonymous: currentUser.isAnonymous,
                        providerId: currentUser.providerId
                    }
                    : null
            };
            await addDoc(collection(db, 'custom_requests'), payload);
            showToast('Request saved — thank you!');
            form.reset();
        } catch (err) {
            console.error('Error saving request:', err);
            showToast('Failed to save — try again', true);
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    attachGlobalListeners();
    setupScrollAnimations();
    initAuthUI();
    
    // Initialize forms based on the current page
    if (document.getElementById('customize-form')) {
        initCustomizeForm();
    }
});
