function togglePassword() {
    let passwordInput = document.getElementById("password");
    let eyeIcon = document.getElementById("eyeIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.src = "../../Images/Password/show.png"; 
    } else {
        passwordInput.type = "password";
        eyeIcon.src = "../../Images/Password/hide.png"; 
    }
}
