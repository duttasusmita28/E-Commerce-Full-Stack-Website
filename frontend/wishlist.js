document.addEventListener("DOMContentLoaded", () => {
    const wishlistItemsContainer = document.getElementById("wishlist-items");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Function to render wishlist on the wishlist.html page
    function renderWishlist() {
        if (!wishlistItemsContainer) return;

        wishlistItemsContainer.innerHTML = "";
        wishlist.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;
            wishlistItemsContainer.appendChild(row);
        });
    }

    // Add event listener for wishlist buttons on product listing pages
    document.querySelectorAll(".add-to-wishlist").forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent event conflict with cart
            
            const product = event.target.closest(".pro");
            const productData = {
                id: button.getAttribute("data-id"),
                image: product.querySelector("img").src,
                name: product.querySelector(".product-title").textContent,
                price: product.querySelector(".price").textContent
            };

            // Check if item already exists in wishlist
            if (!wishlist.some(item => item.id === productData.id)) {
                wishlist.push(productData);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                alert("Added to Wishlist!");
            } else {
                alert("This item is already in your wishlist.");
            }
        });
    });

    // Remove item from wishlist on wishlist.html
    if (wishlistItemsContainer) {
        wishlistItemsContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-btn")) {
                const index = event.target.getAttribute("data-index");
                wishlist.splice(index, 1);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                renderWishlist();
            }
        });

        renderWishlist();
    }
});
