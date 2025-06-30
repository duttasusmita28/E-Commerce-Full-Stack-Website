// Initialize or Load Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save Cart to localStorage
const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

// Add to Cart Function
function addToCart(product) {
    const existingProduct = cart.find(item => item.title === product.title);

    if (existingProduct) {
        existingProduct.quantity += product.quantity; // Update quantity if product exists
    } else {
        cart.push(product); // Add new product
    }

    saveCart();
    alert("Product added to cart!");
}

// Shop Page: Add Event Listeners to Buttons
const shopButtons = document.querySelectorAll(".add-to-cart");
shopButtons.forEach(button => {
    button.addEventListener("click", event => {
        const productBox = event.target.closest(".pro");
        const product = {
            title: productBox.querySelector(".product-title").textContent,
            price: parseFloat(productBox.querySelector(".price").textContent.replace("₹", "")),
            image: productBox.querySelector("img").src,
            quantity: 1, // Default quantity for shop page
        };

        addToCart(product);
    });
});

// Single Product Page: Handle Add to Cart Button
const singleAddToCartButton = document.getElementById("add-to-cart");
if (singleAddToCartButton) {
    singleAddToCartButton.addEventListener("click", () => {
        const productTitle = document.querySelector(".product-title").textContent;
        const productPrice = parseFloat(document.querySelector(".price").textContent.replace("₹", ""));
        const productImage = document.getElementById("MainImg").src;
        const productQuantity = parseInt(document.getElementById("quantity").value, 10);

        const product = {
            title: productTitle,
            price: productPrice,
            image: productImage,
            quantity: productQuantity,
        };

        addToCart(product);
    });
}

// Cart Page: Render Cart
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.getElementById("cart-total");

if (cartContent) {
    const renderCart = () => {
        cartContent.innerHTML = ""; // Clear existing content

        cart.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><button class="remove-item" data-title="${item.title}">Remove</button></td>
                <td><img src="${item.image}" alt="${item.title}" /></td>
                <td>${item.title}</td>
                <td>₹${parseFloat(item.price).toFixed(2)}</td>
                <td><input type="number" class="cart-quantity" data-title="${item.title}" value="${item.quantity}" min="1"></td>
                <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            `;
            cartContent.appendChild(row);
        });

        updateTotal();
    };

    const updateTotal = () => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `₹${total.toFixed(2)}`;
    };

    cartContent.addEventListener("click", event => {
        if (event.target.classList.contains("remove-item")) {
            const title = event.target.dataset.title;
            cart = cart.filter(item => item.title !== title);
            saveCart();
            renderCart();
        }
    });

    cartContent.addEventListener("input", event => {
        if (event.target.classList.contains("cart-quantity")) {
            const title = event.target.dataset.title;
            const newQuantity = parseInt(event.target.value, 10);
            const product = cart.find(item => item.title === title);

            if (product) {
                product.quantity = Math.max(1, newQuantity);
                saveCart();
                renderCart();
            }
        }
    });

    renderCart();
}


const buyNowButton = document.getElementById("buy-now");
if (buyNowButton) {  // Check if the button exists before adding event listener
    buyNowButton.addEventListener("click", function () {
        const cartItems = document.querySelectorAll(".cart-content tr");
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const totalAmount = document.getElementById("cart-total").textContent;
        window.location.href = `/checkout.html?total=${encodeURIComponent(totalAmount)}`;
    });
} else {
    console.warn("Buy Now button not found, skipping event listener setup.");
}
