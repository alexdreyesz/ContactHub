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

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";
    email = "";
    password = "";
    userName = "";

    const button = document.getElementById("loginButton"); // Get Button To Change Its Color

    let loginCredential = document.getElementById("loginCredential")
    let loginPassword = document.getElementById("loginPassword")

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
				userId = jsonObject.id;
		
				if(userId < 1) {	
                    document.getElementById("loginCredential").innerHTML = "";
                    document.getElementById("loginPassword").innerHTML = "";
                    
                    button.style.backgroundColor = '#ae2b36';

                    setTimeout(() => {
                        button.style.backgroundColor = "#238636"; 
                    }, 650); 
                    
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
                window.location.href = './Pages/Contact Manager/manager.html';
            }
        }

        xhr.send(jsonPayload)
    } catch(error) {
        document.getElementById("loginCredential").innerHTML = "";
        document.getElementById("loginPassword").innerHTML = "";

        button.style.backgroundColor = '#ae2b36';

        setTimeout(() => {
            button.style.backgroundColor = "#238636"; 
        }, 650); 

        console.log(err.message);
    }
}

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

    // start connection to server
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

function addContactSecond() {
    let contactName = document.getElementById("nameText").value;
    let contactPhone = document.getElementById("phoneNumber").value;
    let contactEmail = document.getElementById("emailText").value;

    const button = document.getElementById("addContactButton");

	let tmp = {name:contactName, phone:contactPhone, email:contactEmail, userId, userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			document.getElementById("nameText").innerHTML = "";
            document.getElementById("phoneNumber").innerHTML = "";
            document.getElementById("emailText").innerHTML = "";
            
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
	}
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				
				for(let i = 0; i < jsonObject.results.length; i++) {
					contactList += jsonObject.results[i];

					if(i < jsonObject.results.length - 1) {
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};

		xhr.send(jsonPayload);
	} catch(err) {
		document.getElementById("searchText").placeholder = "NO CONTACT FOUND";

        setTimeout(() => {
            document.getElementById("searchText").placeholder = "Search";
        }, 650); 

        console.log(err.message);
	}
}

function saveCookie() {
    let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}