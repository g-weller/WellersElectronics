isLoggedIn = sessionStorage.getItem("isLoggedIn") == "true";


function updateCartBtn(){
    document.querySelectorAll(".addCT").forEach(btn => {
        if (isLoggedIn == false){
            btn.style.display = "none";
        }else{
            btn.style.cssText = `
                margin-top: 5px;
                margin-left: 50px;
                width: 80px;
                height: 30px;
                display: inline-block;
            `;
        }
    });
}

updateCartBtn();

document.addEventListener("loginChange", function(e) {
    isLoggedIn = e.detail.isLoggedIn;
    sessionStorage.setItem("isLoggedIn", isLoggedIn);
    updateCartBtn();
})