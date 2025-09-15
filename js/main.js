// js/main.js

import { updateCartCount, renderCart, attachAddToCartListeners, attachClearCartListener } from './cart.js';
import { initAuthUI, initCustomizeForm } from './firebase-form.js';

// Function to handle on-scroll fade-in animations
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop observing once the element is visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.2 // Adjust as needed
  });

  document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
  });
}

// Run functions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Cart-related functions
    updateCartCount();
    renderCart();
    attachAddToCartListeners();
    attachClearCartListener();

    // Firebase-related functions
    initAuthUI();
    if (document.getElementById('customize-form')) {
      initCustomizeForm();
    }

    // Set up scroll animations
    setupScrollAnimations();
});
