// js/main.js

import { updateCartCount, renderCart, attachAddToCartListeners } from './cart.js';
import { initAuthUI, initCustomizeForm } from './firebase-form.js';

// Run functions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderCart();
    attachAddToCartListeners();
    initAuthUI();
    initCustomizeForm();
});
