document.addEventListener("DOMContentLoaded", () => {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Populate order details
    const orderDetailsDiv = document.querySelector("#order-details");
    let detailsHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
        detailsHTML += `<p>Item ${idx + 1}: ${item.title} - R${item.price} x ${item.amount}</p>`;
        total += item.price * item.amount;
    });
    detailsHTML += `<p>Total: R${total}</p>`;
    if(orderDetailsDiv) orderDetailsDiv.innerHTML = detailsHTML;

    // Populate order summary
    const orderSummaryDiv = document.querySelector("#Payment");
    if(orderSummaryDiv) {
        orderSummaryDiv.querySelector("p:nth-child(2)").textContent = `Items: ${cart.length}`;
        orderSummaryDiv.querySelector("p:nth-child(3)").textContent = `Total: R${total}`;
    }
});