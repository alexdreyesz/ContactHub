// const urlBase = 'http://group6.cadeen.me/LAMPAPI';
const urlBase = 'https://hondurasoft.xyz/LAMPAPI';
const extension = 'php';

//API ENDPOINTS
let AddContactEndPoint = `${urlBase}/AddContact.${extension}`;
let createEndPoint = `${urlBase}/Create.${extension}`;
let loginEndPoint = `${urlBase}/Login.${extension}`;
let searchContactEndPoint = `${urlBase}/SearchContact.${extension}`;

let userId = 0;
let firstName = "";
let lastName = "";
let email = "";
let password = "";
let userName = "";

// Fucntion To Login To Contact Manager: index.html
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    userName = "";

    const button = document.getElementById("loginButton"); // Get Button To Change Its Color

    let loginCredential = document.getElementById("loginCredential").value;
    let loginPassword = document.getElementById("loginPassword").value;

    if (loginCredential === "" || loginPassword === "") {
		button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

		return;
	}

    let tmp = { 
        Login: loginCredential, 
        Password: loginPassword
    };

    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", loginEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    
    try{
        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.ID;

                console.log(`User id is: ${userId}`);
		
				if(userId < 1) {	
                    document.getElementById("loginCredential").value = "";
                    document.getElementById("loginPassword").value = "";
                    
                    button.style.backgroundColor = '#ae2b36';

                    setTimeout(() => {
                        button.style.backgroundColor = "#238636"; 
                    }, 650); 
                    
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

                console.log(`FirstName is: ${firstName}`);
                console.log(`LastName is: ${lastName}`);

				saveCookie();

                console.log("Cookies:", document.cookie);

                window.location.href = './Pages/Contact Manager/manager.html';
            }
        }

        xhr.send(jsonPayload)
    } catch(err) {
        document.getElementById("loginCredential").value = "";
        document.getElementById("loginPassword").value = "";


        button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

        console.log(err.message);
        return;
    }
}

// Function To Logout And Remove Previous Account: manager.html
function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    userName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "/index.html";
}

// Function To Create User: createAccount.html
function createUser() {
    let firstName = document.getElementById("nameText").value;
    let lastName = document.getElementById("lastText").value;
    let email = document.getElementById("emailText").value;
    let password = document.getElementById("loginPassword").value;
    let userName = document.getElementById("usernameText").value;

	const button = document.getElementById("createUserButton");

	if (firstName === "" || lastName === "" || userName === "" || password === "" || email === "") {
		button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

		return;
	}

    let contactData = {
        FirstName: firstName,
        LastName: lastName,
		Login: userName,
        Password: password,
        Email: email,
    };

    console.log(`Requested Data: ${contactData}`)

    let jsonPayload = JSON.stringify(contactData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", createEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject =  JSON.parse(xhr.responseText);
                userId = jsonObject.userId;
                console.log(`${userId} has been created`);
            }
            else{
                console.error("Error")
            }

            button.style.backgroundColor = 'blue';

            setTimeout(() => {
                button.style.backgroundColor = "#238636"; 
            }, 650); 

            window.location.href = "/index.html";
        }

        xhr.send(jsonPayload);
    } catch(err) {
        button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

        console.log(err.message);
    }
}

// Fucntion To Add Contact: manager.html
function addContact() {
    let contactName = document.getElementById("nameText").value;
    let contactPhone = document.getElementById("phoneNumber").value;
    let contactEmail = document.getElementById("emailText").value;

    const button = document.getElementById("addContactButton");  // Get Button To Change Its Color

    if (contactName === "" || contactPhone === "" || contactEmail === "") {
		button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

		return;
	}

	let tmp = {
        Name: contactName, 
        Phone: contactPhone, 
        Email: contactEmail,
        UserId: userId 
    };

	let jsonPayload = JSON.stringify( tmp );
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", AddContactEndPoint, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function() {
			document.getElementById("nameText").value = "";
            document.getElementById("phoneNumber").value = "";
            document.getElementById("emailText").value= "";
            
            if (this.readyState == 4 && this.status == 200) {
                button.style.backgroundColor = 'blue';

                setTimeout(() => {
                    button.style.backgroundColor = "#238636"; 
                }, 650); 
			}
		};

		xhr.send(jsonPayload);
	} catch(err) {
		button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

        console.log(err.message);
	}
}

// Function To Search Contacts: manager.html
function searchContact() {
    let search = document.getElementById("searchText").value;

    if (search === "") {
        document.getElementById("searchText").placeholder = "PLEASE INSERT CONTACT NAME";

        setTimeout(() => {
            document.getElementById("searchText").placeholder = "Search";
        }, 1500);

        return;
    }

    let tmp = {
        Name: search,
        UserId: userId
    };

    console.log(search);
    console.log(userId);

    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", searchContactEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    const showContact = document.querySelector(".contact-list");
    showContact.innerHTML = "";

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.results && jsonObject.results.length > 0) {
                    for (let i = 0; i < jsonObject.results.length; i++) {

                        let contact = jsonObject.results[i];

                        let newAddedPerson = document.createElement('div');
                        let name = document.createElement('p');
                        let phone = document.createElement('p');
                        let email = document.createElement('p');
                        let button = document.createElement('button');

                        newAddedPerson.className = "added-person";
                        button.innerHTML = "Delete";
                        button.className = "delete-button";

                        button.addEventListener("click", function() {
                            showContact.removeChild(newAddedPerson);
                        });

                        name.innerHTML = contact.Name;
                        phone.innerHTML = contact.Phone;
                        email.innerHTML = contact.Email;

                        newAddedPerson.appendChild(name);
                        newAddedPerson.appendChild(phone);
                        newAddedPerson.appendChild(email);
                        newAddedPerson.appendChild(button);
                    
                        showContact.appendChild(newAddedPerson);

                        console.log(contact.Name);
                        console.log(contact.Phone);
                        console.log(contact.Email);
                    }
                } else {
                    let name = document.createElement('p');
                    name.value = "No contacts found";
                    newAddedPerson.appendChild(name);
                    newAddedPerson.appendChild(button);
                    showContact.appendChild(newAddedPerson);
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchText").placeholder = "NO CONTACT FOUND";

        setTimeout(() => {
            document.getElementById("searchText").placeholder = "Search";
        }, 1500);

        console.log(err.message);
    }
}

// Function To Search Contacts: manager.html
function searchAll() {
    let search = "";

    let tmp = {
        Name: search,
        UserId: userId
    };

    console.log(search);
    console.log(userId);

    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", searchContactEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    const showContact = document.querySelector(".contact-list");
    showContact.innerHTML = "";

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.results && jsonObject.results.length > 0) {
                    for (let i = 0; i < jsonObject.results.length; i++) {

                        let contact = jsonObject.results[i];

                        let newAddedPerson = document.createElement('div');
                        let name = document.createElement('p');
                        let phone = document.createElement('p');
                        let email = document.createElement('p');
                        let button = document.createElement('button');

                        newAddedPerson.className = "added-person";
                        button.innerHTML = "Delete";
                        button.className = "delete-button";

                        button.addEventListener("click", function() {
                            showContact.removeChild(newAddedPerson);
                        });

                        name.innerHTML = contact.Name;
                        phone.innerHTML = contact.Phone;
                        email.innerHTML = contact.Email;

                        newAddedPerson.appendChild(name);
                        newAddedPerson.appendChild(phone);
                        newAddedPerson.appendChild(email);
                        newAddedPerson.appendChild(button);
                    
                        showContact.appendChild(newAddedPerson);

                        console.log(contact.Name);
                        console.log(contact.Phone);
                        console.log(contact.Email);
                    }
                } else {
                    let name = document.createElement('p');
                    name.value = "No contacts found";
                    newAddedPerson.appendChild(name);
                    newAddedPerson.appendChild(button);
                    showContact.appendChild(newAddedPerson);
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchText").placeholder = "NO CONTACT FOUND";

        setTimeout(() => {
            document.getElementById("searchText").placeholder = "Search";
        }, 650);

        console.log(err.message);
    }
}

// Function To Login As A Guest: index.html
function doLoginGuest() {
    userId = 0;
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    userName = "";

    const button = document.getElementById("loginButton"); // Get Button To Change Its Color

    let loginCredential = "Admin";
    let loginPassword = "Admin";

    if (loginCredential === "" || loginPassword === "") {
		button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

		return;
	}

    let tmp = { 
        Login: loginCredential, 
        Password: loginPassword
    };

    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", loginEndPoint, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    
    try{
        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.ID;

                console.log(`User id is: ${userId}`);
		
				if(userId < 1) {	
                    document.getElementById("loginCredential").value = "";
                    document.getElementById("loginPassword").value = "";
                    
                    button.style.backgroundColor = '#ae2b36';

                    setTimeout(() => {
                        button.style.backgroundColor = "#238636"; 
                    }, 650); 
                    
					return;
				}
		
				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

                console.log(`FirstName is: ${firstName}`);
                console.log(`LastName is: ${lastName}`);

				saveCookie();

                window.location.href = './Pages/Contact Manager/manager.html';
            }
        }

        xhr.send(jsonPayload)
    } catch(err) {
        document.getElementById("loginCredential").value = "";
        document.getElementById("loginPassword").value = "";


        button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

        console.log(err.message);
        return;
    }
}

// Function To Save Cookies
function saveCookie() {
    let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = `firstName=${firstName}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `lastName=${lastName}; expires=${date.toUTCString()}; path=/`;
    document.cookie = `userId=${userId}; expires=${date.toUTCString()}; path=/`;
}

// Function To read Cookies
function readCookie() {
    let cookies = document.cookie.split("; ");
    firstName = "";
    lastName = "";
    userId = "";

    for (let i = 0; i < cookies.length; i++) {
        let pair = cookies[i].split("=");

        if (pair.length === 2) {
            let key = pair[0].trim();
            let value = decodeURIComponent(pair[1].trim());

            if (key === "firstName") {
                firstName = value;
            } else if (key === "lastName") {
                lastName = value;
            } else if (key === "userId") {
                userId = value; 
            }
        }
    }

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("User ID:", userId);
}
