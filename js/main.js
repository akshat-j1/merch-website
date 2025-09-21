// ================================
// MAIN.JS - MERCANCÍA
// ================================

document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTS ---
    const menuToggle = document.getElementById("menu-toggle");
    const links = document.querySelector(".links");
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart-btn") || document.getElementById("sidebar-close-btn");
    const overlay = document.getElementById("cart-overlay");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    // --- CART STATE ---
    let cart = JSON.parse(localStorage.getItem("mercanciaCart")) || [];

    // --- ELEMENT ARRAYS FOR SIDEBAR, MAIN CART, AND CHECKOUT ---
    const cartItemsContainers = [
        document.getElementById("cart-items-sidebar"),
        document.getElementById("cart-items-main"),
        document.getElementById("sidebar-cart-items")
    ].filter(Boolean);

    const cartTotals = [
        document.getElementById("cart-total-sidebar"),
        document.getElementById("cart-total-main"),
        document.getElementById("sidebar-cart-total")
    ].filter(Boolean);

    const checkoutBtns = [
        document.getElementById("checkout-sidebar"),
        document.getElementById("checkout-main"),
        document.getElementById("sidebar-checkout-btn")
    ].filter(Boolean);

    const clearCartBtns = [
        document.getElementById("clear-cart-sidebar"),
        document.getElementById("clear-cart-main"),
        document.getElementById("sidebar-clear-cart-btn"),
        document.getElementById("clear-cart-btn")
    ].filter(Boolean);

    const orderSummaryContainer = document.getElementById("order-summary-items");
    const orderTotalEl = document.getElementById("order-total");

    // --- TOAST NOTIFICATION ---
    const toastContainer = document.createElement("div");
    toastContainer.style.position = "fixed";
    toastContainer.style.bottom = "20px";
    toastContainer.style.right = "20px";
    toastContainer.style.zIndex = "9999";
    toastContainer.style.display = "flex";
    toastContainer.style.flexDirection = "column";
    toastContainer.style.alignItems = "flex-end";
    toastContainer.style.gap = "8px";
    document.body.appendChild(toastContainer);

    function showToast(message) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.background = "#FF6B6B";
        toast.style.color = "#fff";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        toast.style.fontWeight = "600";
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%) scale(0.8)";
        toast.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-in-out";
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(0) scale(1)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%) scale(0.8)";
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // --- FUNCTIONS ---

    function saveCart() {
        localStorage.setItem("mercanciaCart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById("cart-count") || document.getElementById("sidebar-cart-count");
        if (cartCountEl) cartCountEl.textContent = totalCount;
    }

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotals.forEach(el => el.textContent = total.toFixed(2));
    }

    function renderCart() {
        cartItemsContainers.forEach(container => {
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

            container.querySelectorAll(".remove-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const index = btn.dataset.index;
                    cart.splice(index, 1);
                    saveCart();
                    renderCart();
                    updateCartCount();
                    updateCartTotal();
                    renderOrderSummary();
                    showToast("Item removed from cart!");
                });
            });
        });

        renderOrderSummary();
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const img = btn.dataset.img;

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ name, price, img, quantity: 1 });

            saveCart();
            renderCart();
            updateCartCount();
            updateCartTotal();
            openCartSidebar();
            showToast(`${name} added to cart!`);
        });
    });

    clearCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
            updateCartTotal();
            showToast("Cart cleared!");
        });
    });

    checkoutBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            window.location.href = "checkout.html";
        });
    });

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
            div.innerHTML = `<p>${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</p>`;
            orderSummaryContainer.appendChild(div);
        });

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderTotalEl.textContent = `₹${total.toFixed(2)}`;
    }

    function openCartSidebar() {
        if (!cartSidebar || !overlay) return;
        cartSidebar.classList.add("is-open");
        overlay.classList.add("is-visible");
    }

    function closeCartSidebar() {
        if (!cartSidebar || !overlay) return;
        cartSidebar.classList.remove("is-open");
        overlay.classList.remove("is-visible");
    }

    cartBtn?.addEventListener("click", openCartSidebar);
    closeCartBtn?.addEventListener("click", closeCartSidebar);
    overlay?.addEventListener("click", closeCartSidebar);

    menuToggle?.addEventListener("click", () => {
        links?.classList.toggle("is-active");
    });

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

    // --- INITIAL RENDER ---
    renderCart();
    updateCartCount();
    updateCartTotal();
});
