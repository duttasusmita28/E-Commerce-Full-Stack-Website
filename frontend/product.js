document.addEventListener("DOMContentLoaded", function() {
    fetch("http://127.0.0.1:5000/getproducts")
    .then(response => response.json())
    .then(products => {
        const productsList = document.getElementById('products-list');
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Price: ${product.price}</p>
                <p>Seller Location: ${product.seller_location}</p>
                <p>${product.description}</p>
                <img src="http://127.0.0.1:5000${product.image}" alt="${product.name}" />
            `;
            productsList.appendChild(productDiv);
        });
    })
    .catch(error => {
        console.error("Error:", error);
    });
});