// js/cart.js

// Get cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in navbar
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Add item to cart
function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

// Attach event listeners to all Add to Cart buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const product = {
      name: button.getAttribute("data-name"),
      price: button.getAttribute("data-price"),
      image: button.getAttribute("data-image")
    };
    addToCart(product);
  });
});

// On page load, update cart count
updateCartCount();