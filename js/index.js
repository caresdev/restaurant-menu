/****** Navigation ******/

const navLinks = document.querySelectorAll(".nav-link");
const navbarToggler = document.querySelector(".navbar-toggler");
const navTogglerIcon = document.getElementById("toggler-icon");

// Close toggler menu when links are clicked
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navbarToggler.getAttribute("aria-expanded") === "true"){
            navbarToggler.click();
        }
    });
    
});






/****** Menu ******/