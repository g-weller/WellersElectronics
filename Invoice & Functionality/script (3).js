// --Invoice Generation--

const exampleInvoice = {
  invoiceNum: 'INV-20251206-001',
  companyName: 'Weller"'"s Electronics',
  date: '2025-12-06'
  trn: '001-234-567',
  shippingInfo: {
    address: '123 Main St, Kingston, Jamaica',
    recipient: 'Jane Doe',
    phone: '876-555-1234'
  },
  purchasedItems: [
    {name: 'Laptop Pro', quantity: 1, unitPrice: 1500.00, discount: 0.00},
    {name: 'Wireless Mouse', quantity: 2, unitPrice: 25.00, discount: 5.00}
    ],
    subtotal: 1545.00,//Sum of(Quantity * Price - Discount)
    taxes: 231.75,//15% Tax
    totalCost: 1776.75
};

/**Generates an invoice, saves it to the current user's data, 
 *and also stores all invoices in local storage*/

@param {object} checkoutData
@param {object} currentUser

function generateInvoice(checkoutData, currentUser){
  const date = new Date().toISOString().split('T')[0];
  const invoiceNumber = 'INV-' + date.replace(/-/g, '') + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  let subtotal = 0;
  checkoutData.items.forEach(item =>{
    subtotal += (item.quantity * item.price) - item.discount;
  });
  
  const TAX_RATE = 0.15; //15% Tax
  const taxes = subtotal + taxes;
  
  const newInvoice = {
    companyName: 'Weller"'"s Electronics',
    dateOfInvoice: date,
    shippingInformation: checkoutData.shipping,
    invoiceNumber: invoiceNumber,
    trn: '011-234-567',
    purchasedItems: checkoutData.items.map(item =>(
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount
      })),
      taxes: parseFloat(taxes.toFixed(2)),
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2))
  };
  
  //Append User's Array of Invoices
  if(!currentUser.invoices){
    current.invoices = [];
  }
  currentUser.invoices.push(newInvoice);
  console.log(`Invoice ${invoiceNumber}created and appended to user data.`);
  
  //Store Invoice in Local Storage
  let allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
  allInvoices.push(newInvoice);
  localStorage.setItem('AllInvoices', JSON.stringify(allInvoices));
  console.log('Invoice stored in localStorage under AllInvoices.');
  console.log('Invoice has been "sent" to the user"'"s email.');
  
  return newInvoice;
}

// --Additional Functionality--
const AGE_GROUPS = [
  {label: '18-25', min: 18, max: 25},
  {label: '26-35', min: 26, max: 35},
  {label: '36-50', min: 36, max: 50},
  {label: '50+', min: 51, max: Infinity}
];

function calculateAge(dobString){
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
    age--;
  }
  return age;
}

function ShowUserFrequency(){
  const usersData = JSON.parse(localStorage.getItem('RegisterData')) || [];
  
  if (usersData.length === 0){
    console.log("No registered user data found.");
    return;
  }
  
  const genderFrequency = usersData.reduce((acc, user) =>{
    const gender = user.gender || 'Not Specified';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  
  const ageGroupFrequency = AGE_GROUPS.reduce((acc, group) => {
    acc[group.label] = 0;
    return acc;
  }, {});
  
  usersData.forEach(user => {
    if (user.dob){
      const age = calculateAge(user.dob);
      const group = AGE_GROUPS.find(g => age >= g.min && age <= g.max);
      if(group){
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
  //To render on dashboard
}

@param {string} trnToSearch

function ShowInvoices(trnToSearch = null){
  const allInvoices = JSON.parse(localStorage.getItem('AllInvoices')) || [];
  
  if(allInvoices.length === 0){
    console.log("No invoices stored in localStorage (AllInvoices).");
    return;
  }
  
  console.log("-- -ALL STORED INVOICES- --");
  
  let invoicesToDisplay = allInvoices;
  
  if(trnToSearch){
    invoicesToDisplay = allInvoices.filter(invoice => invoice.trn === trnToSearch);
    console.log(`Filtering by TRN: ${trnToSearch}`);
  }
  
  if (invoicesToDisplay.length === 0){
    console.log(`No invoices found for TRN: ${trnToSearch}.`);
  } else{
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

//Display invoices of a specified user based on TRN
@param {string} trnToSearch

function GetUserInvoices(trnToSearch){
  const allUsers = JSON.parse(localStorage.getItem('RegisterData')) || [];
  
  //Makes TRN unique indentifier
  const targetUser = allUsers.find(user => user.trn === trnToSearch);
  
  if(!targetUser){
    console.log(`User with TRN ${trnToSearch} not found in RegisterData`);
    return;
  }
  
  const userInvoices = targetUser.invoices || [];
  
  console.log(`--- INVOICES FOR USER (TRN: ${trnToSearch}) ---`);
  
  if (userInvoices.length === 0){
    console.log(`User ${trnToSearch} has no recorded invoices.`);
  } else{
    userInvoices.forEach((invoice, index) => {
      console.log(`Invoice #${index + 1}:`);
      console.log(`  Inv. No.: ${invoice.invoiceNumber}`);
      console.log(`  Date: ${invoice.dateOfInvoice}`);
      console.log(`  Total: $${invoice.totalCost}`);
      console.log('---');
    })
  }
}