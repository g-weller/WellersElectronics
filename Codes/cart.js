const checkoutButton = document.getElementById("checkoutBtn");
isLoggedIn = sessionStorage.getItem("isLoggedIn") == "true";

if (isLoggedIn == false){
        checkoutBtn.style.display = "none";;
    }else{
        checkoutBtn.style.display = "inline-block";
}

checkoutBtn.onclick = function() {
    alert("Coming Soon!!");
};

document.addEventListener("loginChange", function(e) {
    if (isLoggedIn == false){
        checkoutBtn.style.display = "none";
    }else{
        checkoutBtn.style.display = "inline-block";
    }
})

