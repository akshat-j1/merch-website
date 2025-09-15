// js/main.js

import { updateCartCount, renderCart, attachAddToCartListeners, attachClearCartListener } from './cart.js';
import { initAuthUI, initCustomizeForm } from './firebase-form.js';

// Run functions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Cart-related functions
    updateCartCount();
    renderCart();
    attachAddToCartListeners();
    attachClearCartListener();

    // Firebase-related functions
    initAuthUI();
    // Only call initCustomizeForm if the form element exists on the page
    if (document.getElementById('customize-form')) {
      initCustomizeForm();
    }
});
