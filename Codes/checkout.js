// SETUP & DATA LOADING //
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let currentUserTRN = "000-000-000";

        // Calculation Variables //
        let subtotal = 0;
        let shipping = 15.00;
        let discount = 0;
        let total = 0;

        // RENDERING SECTION//
        function renderSummary() {
            const container = document.getElementById('orderSummaryList');
            container.innerHTML = '';
            subtotal = 0;

            if (cart.length === 0) {
                container.innerHTML = "<p>Your cart is empty.</p>";
            }

            cart.forEach(item => {
                subtotal += (item.price * item.quantity);

                let imgPath = item.image;

                const div = document.createElement('div');
                div.className = 'summary-item';
                div.innerHTML = `
                    <div style="position:relative;">
                        <img src="${imgPath}" class="summary-img" alt="${item.name}">
                        <span style="position:absolute; top:-5px; right:-5px; background:#666; color:white; border-radius:50%; width:20px; height:20px; text-align:center; font-size:12px; line-height:20px;">${item.quantity}</span>
                    </div>
                    <div class="summary-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div>
                        <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                `;
                container.appendChild(div);
            });

            updateTotals();
        }

        function updateTotals() {
            document.getElementById('subtotalDisplay').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('shippingDisplay').textContent = `$${shipping.toFixed(2)}`;
            document.getElementById('discountDisplay').textContent = `-$${discount.toFixed(2)}`;

            total = subtotal + shipping - discount;
            document.getElementById('totalDisplay').textContent = `$${total.toFixed(2)}`;
        }

        function applyDiscount() {
            const code = document.getElementById('discountCode').value.trim().toUpperCase();
            // This is where the fixed discount is checked.
            if (code === "SAVE10") { 
                discount = 10.00; // Fixed $10.00 discount
                alert("Discount 'SAVE10' applied: $10.00 off!");
            } else {
                discount = 0;
                alert("Invalid code or code already applied.");
            }
            updateTotals();
        }

        function selectDelivery(el, type) {
            // UI Toggle //
            document.querySelectorAll('.option-box').forEach(b => b.classList.remove('active'));
            el.classList.add('active');

            // Logic Toggle //
            if (type === 'pickup') {
                shipping = 0;
            } else {
                shipping = 15.00;
            }
            updateTotals();
        }

        //  CHECKOUT PROCESS & PDF //
        async function processCheckout() {
            // A. Validation
            const form = document.getElementById('checkoutForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (cart.length === 0) {
                alert("Cart is empty!");
                return;
            }

            // B. Data Gathering //
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const country = document.getElementById('country').value;

            const invoiceData = {
                company: "Weller's Electronics",
                date: new Date().toLocaleDateString(),
                invoiceNumber: "INV-" + Date.now(),
                trn: currentUserTRN,
                customer: { name: fullName, email, phone, country },
                items: cart,
                subtotal: subtotal,
                shipping: shipping,
                discount: discount,
                total: total
            };

            // Save to LocalStorage (AllInvoices) //
            let allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
            allInvoices.push(invoiceData);
            localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));

            // Generate PDF //
            await generatePDF(invoiceData);
            
            // Show confirmation and clear cart
            alert("Order Confirmed! Your receipt has been downloaded.");
            localStorage.removeItem('cart');
            window.location.href = "index.html"; 
        }

        // PDF GENERATOR //
        function generatePDF(data) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Header //
            doc.setFontSize(22);
            doc.setTextColor(48, 87, 228); // Blue
            doc.text(data.company, 105, 20, null, null, "center");

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Receipt / Invoice", 105, 30, null, null, "center");

            // Customer Info //
            doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 50);
            doc.text(`Date: ${data.date}`, 20, 58);
            doc.text(`Customer: ${data.customer.name}`, 20, 66);
            doc.text(`Email: ${data.customer.email}`, 20, 74);
            // Added phone and country to the receipt
            doc.text(`Phone: ${data.customer.phone}`, 20, 82); 
            doc.text(`Country: ${data.customer.country}`, 20, 90);

            // Table Header //
            let y = 105; // Adjusted starting point
            doc.setFillColor(240, 240, 240);
            doc.rect(20, y - 5, 170, 10, 'F');
            doc.setFont("helvetica", "bold");
            doc.text("Item", 25, y);
            doc.text("Qty", 120, y);
            doc.text("Price", 160, y);

            // Items //
            y += 10;
            doc.setFont("helvetica", "normal");
            data.items.forEach(item => {
                doc.text(item.name, 25, y);
                doc.text(item.quantity.toString(), 120, y);
                doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 160, y);
                y += 10;
            });

            // Total //
            y += 10;
            doc.line(20, y, 190, y);
            y += 10;
            doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`, 140, y);
            y += 8;
            doc.text(`Shipping: $${data.shipping.toFixed(2)}`, 140, y);
            y += 8;
            doc.text(`Discount: -$${data.discount.toFixed(2)}`, 140, y);
            y += 10;

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Total: $${data.total.toFixed(2)}`, 140, y);

            // Save //
            doc.save(`Receipt-${data.invoiceNumber}.pdf`);

            // Small delay to allow download to start before redirecting or alerting //
            return new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Initialize Page //
        renderSummary();