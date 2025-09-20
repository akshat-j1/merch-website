export function initCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummaryContainer = document.getElementById('order-summary-items');
    const orderTotalElement = document.getElementById('order-total');

    if (!checkoutForm || !orderSummaryContainer || !orderTotalElement) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    // Render order summary
    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = '<p>Your cart is empty. Please add items before checking out.</p>';
        checkoutForm.style.display = 'none';
    } else {
        cart.forEach(item => {
            const itemPrice = parseFloat(item.price);
            const itemQuantity = item.quantity || 1;
            total += itemPrice * itemQuantity;

            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <span>${item.name} x ${itemQuantity}</span>
                <span>₹${(itemPrice * itemQuantity).toFixed(2)}</span>
            `;
            orderSummaryContainer.appendChild(div);
        });

        orderTotalElement.textContent = `₹${total.toFixed(2)}`;
    }

    // Handle form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple form validation
        const fullName = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipCode = document.getElementById('zipCode').value;

        if (!fullName || !address || !city || !zipCode) {
            alert('Please fill out all fields.');
            return;
        }

        // --- Mock Payment Processing and Order Placement ---
        // In a real application, you would connect to a payment gateway here (e.g., Stripe, PayPal).
        // For this example, we will simulate a successful order.
        
        alert('Order placed successfully! Thank you for your purchase.');
        
        // Clear the cart after successful checkout
        localStorage.removeItem('cart');
        
        // Redirect to the homepage or a confirmation page
        window.location.href = 'index.html';
    });
}
