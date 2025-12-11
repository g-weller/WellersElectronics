const form = document.querySelector('form')

function encode(str){
    return ("spoo" + str + "ahctog").split('').reverse().join('');
}

if(sessionStorage.getItem('Attempt')){
    sessionStorage.setItem('Attempt', '0');
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const { trn, password } = Object.fromEntries(formData);

    const users = JSON.parse(localStorage.getItem('RegistrationData') || '[]');
    const user = users.find(u => u.trn === trn);

    if(!user){
        alert("User not found!");
        return;
    }

    if(user.password !== encode(password)){
        alert("Incorrect Login!");
        attemptCount();
        return;
    }
    
    alert("Login Successful!");

    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('currentUser', trn);
    sessionStorage.setItem('Attempt', '0');

    window.location.href = "index.html";
});

function attemptCount(){
    let attempt = parseInt(sessionStorage.getItem('Attempt'));
    if (isNaN(attempt)) attempt = 0;
    attempt++;
    sessionStorage.setItem('Attempt', attempt);
    
    if(attempt >= 3){
        window.location.href = "accountlock.html";
    } else {
        alert(`You have ${3-attempt} attempts left`);
    }
}

function Clear(){
    const clear = document.getElementById('cancelBtn');
    const form = document.getElementById('login');

    clear.addEventListener('click', (e) => {
    alert("Clear button clicked");
    e.preventDefault();

    form.reset();
    
    alert("Form was cleared");
    });
}
Clear();

function Reset(){
    const resetB = document.getElementById('reset');

    resetB.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.href = "resetpassword.html";
    });
}
Reset();