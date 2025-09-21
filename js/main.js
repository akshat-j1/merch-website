// ================================
// MAIN.JS - MERCANCÍA
// ================================

document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTS ---
    const menuToggle = document.getElementById("menu-toggle");
    const links = document.querySelector(".links");
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const overlay = document.getElementById("cart-overlay");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    // --- CART STATE ---
    let cart = JSON.parse(localStorage.getItem("mercanciaCart")) || [];

    // --- ELEMENT ARRAYS FOR SIDEBAR, MAIN CART, AND CHECKOUT ---
    const cartItemsContainers = [
        document.getElementById("cart-items-sidebar"), // Sidebar
        document.getElementById("cart-items-main")     // Main cart page
    ];

    const cartTotals = [
        document.querySelector("#cart-total-sidebar"), // Sidebar
        document.querySelector("#cart-total-main")     // Main cart page
    ];

    const checkoutBtns = [
        document.getElementById("checkout-sidebar"), // Sidebar
        document.getElementById("checkout-main")     // Main cart page
    ];

    const clearCartBtns = [
        document.getElementById("clear-cart-sidebar"), // Sidebar
        document.getElementById("clear-cart-main")     // Main cart page
    ];

    const orderSummaryContainer = document.getElementById("order-summary-items");
    const orderTotalEl = document.getElementById("order-total");

    // --- FUNCTIONS ---

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem("mercanciaCart", JSON.stringify(cart));
    }

    // Update cart count in navbar
    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById("cart-count");
        if (cartCountEl) cartCountEl.textContent = totalCount;
    }

    // Update cart totals
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotals.forEach(el => {
            if (el) el.textContent = total.toFixed(2);
        });
    }

    // Render cart items in sidebar and main cart
    function renderCart() {
        cartItemsContainers.forEach(container => {
            if (!container) return;
            container.innerHTML = "";
            if (cart.length === 0) {
                container.innerHTML = `<p class="empty-cart-message">Your cart is empty.</p>`;
                return;
            }
            cart.forEach((item, index) => {
                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price} x ${item.quantity}</p>
                    </div>
                    <button class="remove-btn" data-index="${index}">&times;</button>
                `;
                container.appendChild(div);
            });

            // Attach remove handlers
            container.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.dataset.index;
                    cart.splice(index, 1);
                    saveCart();
                    renderCart();
                    updateCartCount();
                    updateCartTotal();
                    renderOrderSummary();
                });
            });
        });

        renderOrderSummary();
    }

    // Add item to cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img = btn.dataset.img;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }

            saveCart();
            renderCart();
            updateCartCount();
            updateCartTotal();
            openCartSidebar();
        });
    });

    // Clear cart
    clearCartBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
            updateCartTotal();
        });
    });

    // Checkout
    checkoutBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            window.location.href = "checkout.html";
        });
    });

    // --- ORDER SUMMARY (Checkout Page) ---
    function renderOrderSummary() {
        if (!orderSummaryContainer || !orderTotalEl) return;

        orderSummaryContainer.innerHTML = "";
        if (cart.length === 0) {
            orderSummaryContainer.innerHTML = "<p>Your cart is empty.</p>";
            orderTotalEl.textContent = "₹0.00";
            return;
        }

        cart.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("summary-item");
            div.innerHTML = `
                <p>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</p>
            `;
            orderSummaryContainer.appendChild(div);
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderTotalEl.textContent = `₹${total.toFixed(2)}`;
    }

    // Open cart sidebar
    function openCartSidebar() {
        cartSidebar.classList.add("is-open");
        overlay.classList.add("is-visible");
    }

    // Close cart sidebar
    function closeCartSidebar() {
        cartSidebar.classList.remove("is-open");
        overlay.classList.remove("is-visible");
    }

    cartBtn?.addEventListener("click", openCartSidebar);
    closeCartBtn?.addEventListener("click", closeCartSidebar);
    overlay?.addEventListener("click", closeCartSidebar);

    // --- SCROLL FADE-IN ANIMATION ---
    const faders = document.querySelectorAll(".fade-in-section");
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, appearOptions);
    faders.forEach(fader => appearOnScroll.observe(fader));

    // --- MOBILE MENU TOGGLE ---
    menuToggle?.addEventListener("click", () => {
        links.classList.toggle("is-active");
    });

    // --- INITIAL RENDER ---
    renderCart();
    updateCartCount();
    updateCartTotal();
});
