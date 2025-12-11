fetch("products.json")
.then(function(response){
    return response.json();
})

.then(function(data){
    localStorage.setItem("products", JSON.stringify(data));
    if(!localStorage.getItem("cart")){
        localStorage.setItem("cart", "[]");
    }
});

let total = 0;
let sum = 0;
let isLoggedIn = sessionStorage.getItem("isLoggedIn") == "true";


document.addEventListener("DOMContentLoaded", () => {

    const navLogin = document.getElementById("navLogin");
    const navRegister = document.getElementById("navRegister");
    const navLogout = document.getElementById("navLogout");

    function updateUI(){
        if (isLoggedIn == false){
            navLogout.style.display = "none";
            navLogin.style.cssText = `
                padding: 5px;
                margin: 10px;
                border: 2px solid black;
                border-radius: 4px;
                text-decoration: none;
                color: black;
                background-color: aquamarine;
            `;
            navRegister.style.cssText = `
                padding: 5px;
                margin: 10px;
                border: 2px solid black;
                border-radius: 4px;
                text-decoration: none;
                color: black;
                background-color: aquamarine;
            `;
        }else{
            navLogout.style.cssText = `
                padding: 5px;
                margin: 10px;
                border: 2px solid black;
                border-radius: 4px;
                text-decoration: none;
                color: black;
                background-color: aquamarine;
            `;
            navLogin.style.display = "none";
            navRegister.style.display = "none";
        }
    }

    window.setLoginState = function(state){
        isLoggedIn = state;
        sessionStorage.setItem("isLoggedIn", state);

        document.dispatchEvent(
            new CustomEvent("loginChange", { detail: { isLoggedIn: state }})
        );
        console.log("Login: " + state)

        updateUI();
    }

    navLogout.onclick = function(event) {
        event.preventDefault(); 
        setLoginState(false); 
        sessionStorage.setItem("isLoggedIn", "false"); 
        sessionStorage.removeItem('currentUser'); 
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateUI();
        generateCart();
    };

    document.addEventListener("loginChange", () => updateUI());
    updateUI();

    let cartHeaders = ['Item Code', 'Item', 'Price', 'Quantity', 'Add/Drop'];

    let products = JSON.parse(localStorage.getItem("products"));
    let cart = JSON.parse(localStorage.getItem("cart"));

    const currentUserEmail = sessionStorage.getItem('currentUser');
    if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === currentUserEmail);
        if (user) {
            cart = user.cart || [];
        }
    }

    function addItem(productId){

        console.log("Adding Item");
        let product = products.find(function(product){
            return product.id == productId
        });

        if(cart.length == 0){
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
        }else{

            let response = cart.find(element => element.id == productId);
            if(!response){
                let productToAdd = { ...product, quantity: 1 };
                cart.push(productToAdd);
                
            }else{
                response.quantity += 1;
            }
            
        }  

        if (currentUserEmail) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUserEmail);
            if (userIndex > -1) {
                users[userIndex].cart = cart;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart)); 
        setTotal()

    }

    window.addItem = addItem;

    function removeItem(productId){
        let temp = cart.filter(item => item.id != productId);
        localStorage.setItem("cart", JSON.stringify(temp));
        setTotal()
    }

    function increaseQuantity( productId){
        for(let product of cart){
            if(product.id == productId){
                product.quantity += 1;
            }
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        setTotal()
    }

    function decreaseQuantity( productId){
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == productId) {

                if (cart[i].quantity > 1) {
                    cart[i].quantity -= 1;
                } else {
                    cart.splice(i, 1);
                }

                break;
            }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        cart = JSON.parse(localStorage.getItem("cart"));
        setTotal()
    }

    function setTotal(){

        total = 0;

        for(let product of cart){
            let sum = (parseFloat(product.price)) * product.quantity;
            total += sum;
        }
        const totalC = document.getElementById("totalCounter");
        if(totalC){
            totalC.innerHTML = `Total: $${total.toFixed(2)}`;
        }
        
        console.log("Total: " + total);

        updateUI();
    }

    function generateCart(){
        let table = document.createElement('table');
        let headerRow = document.createElement('tr');

        cartHeaders.forEach(headerText => {
            let header = document.createElement('th');
            let textNode = document.createTextNode(headerText);
            header.appendChild(textNode);
            headerRow.appendChild(header);
        })

        table.appendChild(headerRow);

        cart.forEach(product => {
            let row = document.createElement('tr');
            Object.values(product).forEach(text => {
                let cell = document.createElement('td');
                let textNode = document.createTextNode(text);

                cell.appendChild(textNode);
                row.appendChild(cell);
            })

            let actionCell = document.createElement('td');

            let addBtn = document.createElement('button');
            addBtn.textContent = "+";
            addBtn.id = 'addBtn';
            addBtn.onclick = function (){
                increaseQuantity(product.id);
                generateCart();
            }
        
            let dropBtn = document.createElement('button');
            dropBtn.textContent = "-"
            dropBtn.id = 'dropBtn'
            dropBtn.onclick = function (){
                decreaseQuantity(product.id);
                generateCart();
            }

            actionCell.appendChild(addBtn);
            actionCell.appendChild(dropBtn);

            row.appendChild(actionCell);

            table.appendChild(row); 
        })

        const cartTable = document.getElementById("cartTable");

        if(cartTable){
            cartTable.innerHTML = "";
            cartTable.appendChild(table);
        }

        setTotal();

        const currentUserEmail = sessionStorage.getItem('currentUser');
        if (currentUserEmail) {
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === currentUserEmail);
            if (userIndex > -1) {
                users[userIndex].cart = cart;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
    }  
    
    generateCart(); 
});