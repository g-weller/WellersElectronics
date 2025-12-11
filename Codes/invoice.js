// --Invoice Data Structure Example (Syntax Fixed)--
const exampleInvoice = {
    invoiceNum: 'INV-20251206-001',
    companyName: 'Weller\'s Electronics',
    date: '2025-12-06', // Added missing comma
    trn: '001-234-567',
    shippingInfo: {
        address: '123 Main St, Kingston, Jamaica',
        recipient: 'Jane Doe',
        phone: '876-555-1234'
    },
    purchasedItems: [
        { name: 'Laptop Pro', quantity: 1, unitPrice: 1500.00, discount: 0.00 },
        { name: 'Wireless Mouse', quantity: 2, unitPrice: 25.00, discount: 5.00 }
    ],
    subtotal: 1545.00,
    taxes: 231.75,
    totalCost: 1776.75
};

// --PDF Generation Helper Function--
/**
 * Downloads the given invoice data as a PDF document.
 * @param {object} data - The complete invoice object to print.
 */
function downloadInvoicePDF(data) {
    // Access the jsPDF library from the window object
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // --- PDF Content Generation ---
    const BLUE_COLOR = [48, 87, 228]; // Same blue as the checkout page

    // Header 
    doc.setFontSize(22);
    doc.setTextColor(BLUE_COLOR[0], BLUE_COLOR[1], BLUE_COLOR[2]);
    doc.text(data.companyName, 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Receipt / Invoice", 105, 30, null, null, "center");

    // Recipient Info (Based on shippingInfo in the example structure)
    doc.text(`Invoice #: ${data.invoiceNumber}`, 20, 50);
    doc.text(`Date: ${data.dateOfInvoice}`, 20, 58);
    doc.text(`TRN: ${data.trn}`, 20, 66);
    
    // Recipient Details
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 105, 50);
    doc.setFont("helvetica", "normal");
    // Assuming required fields (recipient, address, phone) exist in shippingInformation
    const shipping = data.shippingInformation;
    doc.text(`Name: ${shipping.recipient || 'N/A'}`, 105, 58); 
    doc.text(`Address: ${shipping.address || 'N/A'}`, 105, 66);
    doc.text(`Phone: ${shipping.phone || 'N/A'}`, 105, 74);


    // Table Header 
    let y = 100;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, 170, 10, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("Item", 25, y);
    doc.text("Qty", 100, y);
    doc.text("Unit Price", 130, y);
    doc.text("Total", 170, y);

    // Items 
    y += 10;
    doc.setFont("helvetica", "normal");
    data.purchasedItems.forEach(item => {
        // Correctly calculate line item total
        const lineTotal = (item.quantity * item.unitPrice) - (item.discount || 0); 
        doc.text(item.name, 25, y);
        doc.text(item.quantity.toString(), 100, y);
        doc.text(`$${item.unitPrice.toFixed(2)}`, 130, y);
        doc.text(`$${lineTotal.toFixed(2)}`, 170, y);
        y += 7; // Use smaller increment for items
    });

    // Totals
    y += 10;
    doc.line(20, y, 190, y);
    y += 10;
    
    doc.text(`Subtotal (Pre-tax): $${data.subtotal.toFixed(2)}`, 140, y);
    y += 8;
    if (data.totalDiscount > 0) {
        doc.text(`Cart Discount: -$${data.totalDiscount.toFixed(2)}`, 140, y);
        y += 8;
    }
    doc.text(`Taxes (15%): $${data.taxes.toFixed(2)}`, 140, y);
    y += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL COST: $${data.totalCost.toFixed(2)}`, 140, y);

    // Save
    doc.save(`Invoice-${data.invoiceNumber}.pdf`);
    console.log(`Invoice PDF downloaded: Invoice-${data.invoiceNumber}.pdf`);
}


// --Core Invoice Generation Function (Fixed)--
/**
 * Generates an invoice, saves it to the current user's data,
 * and also stores all invoices in local storage.
 * It also triggers the download of the invoice as a PDF.
 * @param {object} checkoutData - Data from the checkout form and cart. Expected: { items, shippingInfo, totalDiscount (optional) }
 * @param {object} currentUser - The user's account object. Expected: { trn, invoices (optional) }
 */
function generateInvoice(checkoutData, currentUser) {
    // A. Metadata Generation
    const date = new Date().toISOString().split('T')[0];
    const invoiceNumber = 'INV-' + date.replace(/-/g, '') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const TAX_RATE = 0.15; // 15% Tax

    // B. Calculations
    let itemsSubtotal = 0; // Subtotal based on (Qty * Price) - Discount
    
    // NOTE: This logic assumes 'unitPrice' and 'discount' properties exist on the item object in the cart.
    checkoutData.items.forEach(item => {
        const discountPerItem = item.discount || 0.00;
        const itemLineTotal = (item.quantity * item.unitPrice) - discountPerItem;
        itemsSubtotal += itemLineTotal;
    });

    const cartDiscount = checkoutData.totalDiscount || 0.00; // Total cart-level discount
    const subtotal = itemsSubtotal; // Subtotal (pre-tax, post-item-discount)
    const taxes = subtotal * TAX_RATE; // Correct calculation: Subtotal * Tax Rate
    const totalCost = subtotal - cartDiscount + taxes; // Fixed total calculation

    // C. Create Invoice Object (Fixed syntax)
    const newInvoice = {
        companyName: 'Weller\'s Electronics',
        dateOfInvoice: date,
        shippingInformation: checkoutData.shippingInfo, // Shipping info (address, recipient, phone)
        invoiceNumber: invoiceNumber,
        trn: currentUser.trn || '011-234-567', // Use TRN from current user if available
        purchasedItems: checkoutData.items.map(item => ({ // Fixed syntax using implicit return
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice || item.price, // Use unitPrice if available, fallback to price
            discount: item.discount || 0.00
        })),
        taxes: parseFloat(taxes.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        totalDiscount: parseFloat(cartDiscount.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2))
    };

    // D. Data Storage
    // Append User's Array of Invoices (Fixed 'current' typo)
    if (!currentUser.invoices) {
        currentUser.invoices = [];
    }
    currentUser.invoices.push(newInvoice);
    console.log(`Invoice ${invoiceNumber} created and appended to user data.`);

    // Store Invoice in Local Storage
    let allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
    allInvoices.push(newInvoice);
    localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));
    console.log('Invoice stored in localStorage under AllInvoices.');

    // E. PDF Generation (New)
    downloadInvoicePDF(newInvoice);

    return newInvoice;
}


// --Additional Functionality (Unchanged, included for completeness)--
const AGE_GROUPS = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-50', min: 36, max: 50 },
    { label: '50+', min: 51, max: Infinity }
];

function calculateAge(dobString) {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function ShowUserFrequency() {
    const usersData = JSON.parse(localStorage.getItem('RegisterData')) || [];

    if (usersData.length === 0) {
        console.log("No registered user data found.");
        return;
    }

    const genderFrequency = usersData.reduce((acc, user) => {
        const gender = user.gender || 'Not Specified';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});

    const ageGroupFrequency = AGE_GROUPS.reduce((acc, group) => {
        acc[group.label] = 0;
        return acc;
    }, {});

    usersData.forEach(user => {
        if (user.dob) {
            const age = calculateAge(user.dob);
            const group = AGE_GROUPS.find(g => age >= g.min && age <= g.max);
            if (group) {
                ageGroupFrequency[group.label]++;
            }
        }
    });

    //Display Data on Dashboard/Console
    const dashboardData = {
        gender: genderFrequency,
        ageGroups: ageGroupFrequency
    };

    console.log("--USER FREQUENCY ANALYSIS--");
    console.log("Gender Distribution:", dashboardData.gender);
    console.log("Age Group Distribution:", dashboardData.ageGroups);
}

/**
 * Displays all stored invoices. Can filter by TRN.
 * @param {string} trnToSearch
 */
function ShowInvoices(trnToSearch = null) {
    const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];

    if (allInvoices.length === 0) {
        console.log("No invoices stored in localStorage (AllInvoices).");
        return;
    }

    console.log("-- -ALL STORED INVOICES- --");

    let invoicesToDisplay = allInvoices;

    if (trnToSearch) {
        invoicesToDisplay = allInvoices.filter(invoice => invoice.trn === trnToSearch);
        console.log(`Filtering by TRN: ${trnToSearch}`);
    }

    if (invoicesToDisplay.length === 0) {
        console.log(`No invoices found for TRN: ${trnToSearch}.`);
    } else {
        invoicesToDisplay.forEach((invoice, index) => {
            console.log(`Invoice #${index + 1}:`);
            console.log(`  Inv. No.: ${invoice.invoiceNumber}`);
            console.log(`  Date: ${invoice.dateOfInvoice}`);
            console.log(`  TRN: ${invoice.trn}`);
            console.log(`  Total: $${invoice.totalCost}`);
            console.log('---');
        });
    }
}

/**
 * Display invoices of a specified user based on TRN
 * @param {string} trnToSearch
 */
function GetUserInvoices(trnToSearch) {
    const allUsers = JSON.parse(localStorage.getItem('RegisterData')) || [];

    //Makes TRN unique indentifier
    const targetUser = allUsers.find(user => user.trn === trnToSearch);

    if (!targetUser) {
        console.log(`User with TRN ${trnToSearch} not found in RegisterData`);
        return;
    }

    const userInvoices = targetUser.invoices || [];

    console.log(`--- INVOICES FOR USER (TRN: ${trnToSearch}) ---`);

    if (userInvoices.length === 0) {
        console.log(`User ${trnToSearch} has no recorded invoices.`);
    } else {
        userInvoices.forEach((invoice, index) => {
            console.log(`Invoice #${index + 1}:`);
            console.log(`  Inv. No.: ${invoice.invoiceNumber}`);
            console.log(`  Date: ${invoice.dateOfInvoice}`);
            console.log(`  Total: $${invoice.totalCost}`);
            console.log('---');
        })
    }
}