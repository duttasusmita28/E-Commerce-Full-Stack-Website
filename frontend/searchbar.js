function searchProducts() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let products = document.querySelectorAll(".pro");

    products.forEach(product => {
        let title = product.querySelector(".product-title").innerText.toLowerCase();
        if (title.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}

document.getElementById("searchBox").addEventListener("keyup", function () {
    let query = this.value;

    fetch(`http://127.0.0.1:5000/search?q=${query}`)
    .then(response => response.json())
    .then(data => {
        let productList = document.querySelector(".pro-container");
        productList.innerHTML = ""; // Clear current products

        data.forEach(product => {
            let productHTML = `
                <div class="pro">
                    <img src="img/products/${product.image_url}" alt="">
                    <div class="des">
                        <span>localvibe</span>
                        <h5 class="product-title">${product.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4 class="price">₹${product.price}</h4>
                    </div>
                    <button class="add-to-wishlist" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fal fa-shopping-cart"></i>
                    </button>
                </div>
            `;
            productList.innerHTML += productHTML;
        });
    })
    .catch(error => console.error("Error fetching search results:", error));
});
