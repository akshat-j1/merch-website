import { updateCartCount, renderCart, attachAddToCartListeners, attachClearCartListener } from './cart.js';
import { initAuthUI, initCustomizeForm } from './firebase-form.js';
import { initCheckout } from './checkout.js'; // This is no longer needed but may have been present in a previous version.

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
    threshold: 0.2
  });

  document.querySelectorAll('.fade-in-section').forEach(section => {
    // Check if the element is already in the viewport on page load
    if (section.getBoundingClientRect().top < window.innerHeight) {
      section.classList.add('is-visible');
    } else {
      observer.observe(section);
    }
  });
}

// Function to handle cart sidebar and overlay
function setupCartSidebar() {
  const cartBtn = document.getElementById('cart-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeBtn = document.getElementById('close-cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
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
  
  // Setup cart sidebar
  setupCartSidebar();

  // Sidebar menu toggle logic
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
  }

  // Check if cart is empty and show a message
  if (document.getElementById('cart-items').innerHTML === '') {
    document.getElementById('cart-items').innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
  }
});
