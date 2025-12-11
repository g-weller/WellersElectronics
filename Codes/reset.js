const form = document.getElementById('reset');

function encode(str) {
	return ("spoo" + str + "ahctog").split('').reverse().join('');
}

form.addEventListener('submit', (e)=> {
	e.preventDefault();

	const formData = new FormData(form);
	const { trn, newpassword } = Object.fromEntries(formData);

	const users = JSON.parse(localStorage.getItem('RegistrationData') || '[]');
	const user = users.find(u => u.trn === trn);


	if(!user) {
		alert("User not found!");
		return;
	}

	user.password = encode(newpassword);

	localStorage.setItem('RegistrationData', JSON.stringify(users));
	alert('Password was sucessfully changed');

	window.location.href = "login.html";
});

function Back() {
	const backBtn = document.getElementById('back');

	backBtn.addEventListener('click', (e) => {
		e.preventDefault();


		alert("Password was not changed");
		window.location.href = "login.html";
	});
}
Back();
