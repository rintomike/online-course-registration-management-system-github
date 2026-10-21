/* =========================================================
   COURSIFY - Home Page Script
   ========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");


/* =========================================================
   Mobile Navigation Toggle
   ========================================================= */

menuButton.addEventListener("click", () => {

    const isOpen = menuButton.classList.toggle("active");

    mobileMenu.classList.toggle("open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
});


/*
 * Close the mobile menu after a link is selected.
 */
mobileMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

        menuButton.classList.remove("active");
        mobileMenu.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
    });
});
