// Product Data //
        const defaultProducts = [
            { id: 0, name: "Dell Latitude 3310", price: 300.00, image: "../Assets/Images/laptop_latitude_13_3310_gallery_3.avif" },
            { id: 1, name: "Dell 14 Plus", price: 589.90, image: "../Assets/Images/laptop-dell-db14250-copilot-pc-mg.avif" },
            { id: 2, name: "Dell 15 Laptop", price: 290.99, image: "../Assets/Images/laptop_latitude_13_3310_gallery_3.avif" },
            { id: 3, name: "Inspiron 14 2-in-1", price: 499.99, image: "../Assets/Images/laptop_latitude_13_3310_gallery_3.avif" },
            { id: 4, name: "Dell Slim Desktop", price: 599.99, image: "../Assets/Images/dell-ecs1250-slim-tower-c-rf-no-ssd-cover-bk.avif" },
            { id: 5, name: "Dell Tower Desktop", price: 749.99, image: "../Assets/Images/dell-ect1250-tower-c-rf-bk.avif" },
            { id: 6, name: "Dell Tower Desktop Pro", price: 899.99, image: "../Assets/Images/dell-ect1250-tower-c-rf-bk.avif" },
            { id: 7, name: "Dell Tower Plus", price: 1049.99, image: "../Assets/Images/desktop-tower-ebt2250-gray-cart-480-right.avif" }
        ];

        // Initialize Products in LS if missing //
        if (!localStorage.getItem("AllProducts")) {
            localStorage.setItem("AllProducts", JSON.stringify(defaultProducts));
        }

        const products = JSON.parse(localStorage.getItem("AllProducts"));

        // DOM Elements //
        const selectBox = document.getElementById('quickProductSelect');
        const priceDisplay = document.getElementById('quickPriceDisplay');
        const qtyInput = document.getElementById('quickQuantity');
        const addBtn = document.getElementById('quickAddBtn');

        // Dropdown //
        products.forEach((prod, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = prod.name;
            selectBox.appendChild(option);
        });

        // Selection Changing //
        selectBox.addEventListener('change', () => {
            const index = selectBox.value;
            if (index !== "") {
                const price = products[index].price;
                const qty = parseInt(qtyInput.value) || 1;
                priceDisplay.textContent = "$" + (price * qty).toFixed(2);
            } else {
                priceDisplay.textContent = "$0.00";
            }
        });

        //  Quantity Changing //
        qtyInput.addEventListener('input', () => {
            const index = selectBox.value;
            if (index !== "") {
                const price = products[index].price;
                const qty = parseInt(qtyInput.value) || 1;
                priceDisplay.textContent = "$" + (price * qty).toFixed(2);
            }
        });

        // Add to Cart //
        addBtn.addEventListener('click', () => {
            const index = selectBox.value;
            if (index === "") { alert("Please select a product"); return; }

            const qty = parseInt(qtyInput.value) || 1;
            const product = products[index];

            // Get current cart //
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if item exists //
            const existingItem = cart.find(item => item.name === product.name);

            if (existingItem) {
                existingItem.quantity += qty;
            } else {
                cart.push({
                    ...product,
                    quantity: qty
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart(); 
            alert("Added to cart!");
        });

        // Existing Cart Render  //
        function renderCart() {
            const cartTable = document.getElementById('cartTable');
            const totalCounter = document.getElementById('totalCounter');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.length === 0) {
                cartTable.innerHTML = "<p>Your cart is empty.</p>";
                totalCounter.innerText = "Total: $0.00";
                return;
            }

            let html = `<table style="width:100%">
                    <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Action</th></tr>`;

            let grandTotal = 0;

            cart.forEach((item, idx) => {
                const itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;
                html += `
                        <tr>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>$${itemTotal.toFixed(2)}</td>
                            <td><button onclick="removeItem(${idx})" style="margin:0; width:auto; background:red; color:white;">X</button></td>
                        </tr>
                    `;
            });

            html += "</table>";
            cartTable.innerHTML = html;
            totalCounter.innerText = "Total: $" + grandTotal.toFixed(2);
        }

        function removeItem(index) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }

        // Initial Render //
        renderCart();