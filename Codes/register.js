const form = document.querySelector('form');

function encode(str){
    return ("spoo" + str + "ahctog").split('').reverse().join('');
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const ob = Object.fromEntries(formData);
    
    if(!ob.firstname){
        alert("You must enter first name");
        return;
    }else if(!ob.lastname){
        alert("You must enter last name");
        return;
    } else if (!ob.dob){
        alert("You must enter date of birth");
        return;
    } else if (!ob.gender){
        alert("You must enter gender");
        return;
    } else if (!ob.phone){
        alert("You must enter phone");
        return;
    } else if (!ob.email){
        alert("You must enter email");
        return;
    } else if (!ob.password){
        alert("You must enter password");
        return;
    } else if (!ob.confirmPassword){
        alert("You must confirm password");
        return;
    }
    
    if(ob.trn.length < 9){
        alert("TRN must be 9 character");
        return;
    }
    
    if(ob.password.length < 8){
        alert("Password must be 8 character or more");
        return;
    }
    
    var dob = new Date(ob.dob);
    var currentdate = new Date();
    var age = currentdate.getFullYear() - dob.getFullYear();
    
    if(age < 18){
        alert("You must be 18 and older to register");
        return;
    }

    if(ob.password !== ob.confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    const user = {
        firstname : ob.firstname,
        lastname : ob.lastname,
        dob : ob.dob,
        gender : ob.gender,
        phone : ob.phone,
        email: ob.email,
        trn : ob.trn,
        password: encode(ob.password),
        dateOfregistration : new Date().toISOString(),
        cart: [],
        invoices: []
    };
    
    console.log(user);

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);

    localStorage.setItem('RegistrationData', JSON.stringify(users));
    alert("Registered Successfully");

    window.location.href = "login.html"; 
});

function Clear(){
    const clear = document.getElementById('cancelBtn');
    const form = document.getElementById('register');

    clear.addEventListener('click', (e) => {
    alert("Clear button clicked");
    e.preventDefault();

    form.reset();
    
    alert("Form was cleared");
    });
}
Clear();