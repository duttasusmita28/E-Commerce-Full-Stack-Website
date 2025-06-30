// Show/hide the Add Product form when the Add card is clicked
    document.getElementById('addCard').addEventListener('click', function() {
      const formContainer = document.getElementById('addFormContainer');
      formContainer.classList.toggle('hidden');  // Toggle 'hidden' class to show/hide:contentReference[oaicite:6]{index=6}
    });

    // Handle form submission: gather data and POST to /add-product
    document.getElementById('addProductForm').addEventListener('submit', async function(event) {
      event.preventDefault();  // Prevent actual form submission

      // Build product data object from form inputs
      const data = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        imageUrl: document.getElementById('productImage').value,
        sellerLocation: document.getElementById('sellerLocation').value,
        description: document.getElementById('productDescription').value,
        sellerId: document.getElementById('sellerId').value
      };

      try {
        // Send POST request with JSON body to Flask backend
        const response = await fetch('/add-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)  // send JSON data:contentReference[oaicite:7]{index=7}
        });
        if (response.ok) {
          // After adding, reload the product list
          loadProducts();
          // Optionally, clear the form or hide it
          document.getElementById('addProductForm').reset();
        } else {
          console.error('Failed to add product:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    });

    // Function to load products from the backend and display them
    async function loadProducts() {
      try {
        const response = await fetch('/products');  // GET request to fetch product list
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();  // Parse JSON response:contentReference[oaicite:8]{index=8}
        const tableBody = document.getElementById('productList');
        tableBody.innerHTML = '';  // Clear existing rows

        // Insert a new row for each product
        products.forEach(prod => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${prod.name}</td>
            <td>${prod.category}</td>
            <td>${prod.price}</td>
            <td>${prod.sellerLocation}</td>
            <td>${prod.sellerId}</td>
          `;
          tableBody.appendChild(row);
        });
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }

    // Load products when the page is first displayed
    window.addEventListener('DOMContentLoaded', loadProducts);