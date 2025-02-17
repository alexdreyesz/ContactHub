function togglePassword() {
    let passwordInput = document.getElementById("loginPassword");
    let eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.src = "../../Images/Password/show.png"; 
    } else {
        passwordInput.type = "password";
        eyeIcon.src = "../../Images/Password/hide.png"; 
    }
}

function addContactExtra() {
    const showContact = document.querySelector(".contact-list"); // Fix the selector

    let newAddedPerson = document.createElement('div');
    let name = document.createElement('p');
    let phone = document.createElement('p');
    let email = document.createElement('p');
    let button = document.createElement('button');

    newAddedPerson.className = "added-person";

    name.innerHTML = "John Doe";
    phone.innerHTML = "123-456-7890";
    email.innerHTML = "john@doe.com";

    button.innerHTML = "Delete";
    button.className = "delete-button";

    button.addEventListener("click", function() {
        showContact.removeChild(newAddedPerson);
    });

    newAddedPerson.appendChild(name);
    newAddedPerson.appendChild(phone);
    newAddedPerson.appendChild(email);
    newAddedPerson.appendChild(button);

    showContact.appendChild(newAddedPerson);    
}