document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTS ---
    const menuToggle = document.getElementById("menu-toggle");
    const links = document.querySelector(".links");
    const cartBtn = document.getElementById("cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const overlay = document.getElementById("cart-overlay");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    const showMoreBtn = document.getElementById("show-more-btn");
    const hiddenCards = document.querySelectorAll("#stickers-grid .hidden");

    // --- CART STATE ---
    let cart = JSON.parse(localStorage.getItem("mercanciaCart")) || [];

    // --- ELEMENT ARRAYS ---
    const cartItemsContainers = [
        document.getElementById("cart-items-sidebar"),
        document.getElementById("cart-items-main")
    ].filter(Boolean);

    const cartTotals = [
        document.getElementById("cart-total-sidebar"),
        document.getElementById("cart-total-main")
    ].filter(Boolean);

    const checkoutBtns = [
        document.getElementById("checkout-sidebar"),
        document.getElementById("checkout-main")
    ].filter(Boolean);

    const clearCartBtns = [
        document.getElementById("clear-cart-sidebar"),
        document.getElementById("clear-cart-main")
    ].filter(Boolean);

    const orderSummaryContainer = document.getElementById("order-summary-items");
    const orderTotalEl = document.getElementById("order-total");

    // --- FUNCTIONS ---
    function saveCart() {
        localStorage.setItem("mercanciaCart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountEl = document.getElementById("cart-count");
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
                });
            });
        });
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
        });
    });

    clearCartBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
            updateCartTotal();
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

    // Sidebar open/close
    function openCartSidebar() {
        cartSidebar.classList.add("is-open");
        overlay.classList.add("is-visible");
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove("is-open");
        overlay.classList.remove("is-visible");
    }

    cartBtn?.addEventListener("click", openCartSidebar);
    closeCartBtn?.addEventListener("click", closeCartSidebar);
    overlay?.addEventListener("click", closeCartSidebar);

    // Mobile menu toggle
    menuToggle?.addEventListener("click", () => {
        links?.classList.toggle("is-active");
    });

    // Scroll fade-in animation
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

    // Show more products
    showMoreBtn?.addEventListener("click", () => {
        hiddenCards.forEach(card => card.classList.remove("hidden"));
        showMoreBtn.style.display = "none";
    });

    // Initial render
    renderCart();
    updateCartCount();
    updateCartTotal();
});
