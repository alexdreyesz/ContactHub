const urlBase = 'http://group6.cadeen.me/LAMPAPI';
const extension = 'php';

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

    const button = document.getElementById("loginButton");
    const originalColor = button.style.backgroundColor;

    let loginCredential = document.getElementById("loginCredential")
    let loginPassword = document.getElementById("loginPassword")

    let tmp ={login:loginCredential, password:loginPassword};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    
    try{
        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if(userId < 1) {		
                    button.style.backgroundColor = 'red';

                    setTimeout(() => {
                        button.style.backgroundColor = originalColor; 
                    }, 3000); 
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
        button.style.backgroundColor = 'red';

        setTimeout(() => {
            button.style.backgroundColor = originalColor; 
        }, 3000); 
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

function addContact() {

}

function addContact() {
    let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}