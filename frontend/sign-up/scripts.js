/* =========================================================
   COURSIFY - Sign Up Logic
   ========================================================= */


/* =========================================================
   DOM Elements
   ========================================================= */

const signupForm = document.getElementById("signupForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

const errorMessage = document.getElementById("errorMessage");

const createAccountButton =
    document.getElementById("createAccountButton");

const buttonText =
    document.getElementById("buttonText");

const formState =
    document.getElementById("formState");

const successState =
    document.getElementById("successState");

const passwordToggle =
    document.getElementById("passwordToggle");

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const knowMoreButton =
    document.getElementById("knowMoreButton");


/* =========================================================
   Configuration
   ========================================================= */

const API_URL =
    "http://localhost:8080/api/auth/signup";


/* =========================================================
   Utility Functions
   ========================================================= */

/**
 * Display an error message.
 */
function showError(message) {
    errorMessage.textContent = message;
}


/**
 * Clear all form-level errors.
 */
function clearErrors() {
    errorMessage.textContent = "";

    usernameError.textContent = "";
    passwordError.textContent = "";

    usernameInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
}


/**
 * Validate the form before sending the request.
 *
 * @returns {boolean}
 */
function validateForm() {
    let isValid = true;

    clearErrors();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;


    /* Username validation */
    if (!username) {

        usernameError.textContent =
            "Please enter your name or username.";

        usernameInput.classList.add("invalid");

        isValid = false;

    } else if (username.length < 3) {

        usernameError.textContent =
            "Username must contain at least 3 characters.";

        usernameInput.classList.add("invalid");

        isValid = false;
    }


    /* Password validation */
    if (!password) {

        passwordError.textContent =
            "Please enter a password.";

        passwordInput.classList.add("invalid");

        isValid = false;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        passwordInput.classList.add("invalid");

        isValid = false;
    }


    return isValid;
}


/**
 * Change the button into its loading state.
 */
function setLoading(isLoading) {

    createAccountButton.disabled = isLoading;

    if (isLoading) {

        createAccountButton.classList.add("loading");

        buttonText.textContent = "Creating...";

    } else {

        createAccountButton.classList.remove("loading");

        buttonText.textContent = "Create Account";
    }
}


/**
 * Show the successful account creation state.
 */
function showSuccessState() {

    formState.hidden = true;

    successState.hidden = false;
}


/**
 * Safely extract an error message from a backend response.
 *
 * Supports common Spring Boot JSON response structures.
 */
async function getErrorMessage(response) {

    try {

        const data = await response.json();

        if (typeof data === "string") {
            return data;
        }

        return (
            data.message ||
            data.error ||
            data.details ||
            "Unable to create your account. Please try again."
        );

    } catch (error) {

        return (
            `Request failed with HTTP ${response.status}. ` +
            "Please try again."
        );
    }
}


/* =========================================================
   Form Submission
   ========================================================= */

signupForm.addEventListener("submit", async (event) => {

    /*
     * Prevent the browser from reloading the page.
     */
    event.preventDefault();

    clearErrors();


    /*
     * Validate the form.
     */
    if (!validateForm()) {
        return;
    }


    /*
     * Collect form values.
     */
    const username = usernameInput.value.trim();
    const password = passwordInput.value;


    /*
     * Request body expected by the Spring Boot API:
     *
     * {
     *     "username": "...",
     *     "password": "..."
     * }
     */
    const requestBody = {
        username: username,
        password: password
    };


    /*
     * Show loading state.
     */
    setLoading(true);


    try {

        /*
         * Send asynchronous POST request.
         */
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            body: JSON.stringify(requestBody)
        });


        /*
         * HTTP 200/201/etc.
         */
        if (response.ok) {

            showSuccessState();

            return;
        }


        /*
         * Backend returned an error.
         */
        const message =
            await getErrorMessage(response);

        showError(message);

    } catch (error) {

        /*
         * This generally catches network errors,
         * server-unavailable errors, CORS problems, etc.
         */
        console.error("Signup request failed:", error);

        showError(
            "Unable to connect to the server. " +
            "Please make sure the backend is running " +
            "and try again."
        );

    } finally {

        /*
         * Restore the button unless the success state
         * has replaced the form.
         */
        if (!successState.hidden) {
            setLoading(false);
        } else {
            setLoading(false);
        }
    }
});


/* =========================================================
   Live Validation Cleanup
   ========================================================= */

usernameInput.addEventListener("input", () => {

    usernameInput.classList.remove("invalid");
    usernameError.textContent = "";

    if (errorMessage.textContent) {
        errorMessage.textContent = "";
    }
});


passwordInput.addEventListener("input", () => {

    passwordInput.classList.remove("invalid");
    passwordError.textContent = "";

    if (errorMessage.textContent) {
        errorMessage.textContent = "";
    }
});


/* =========================================================
   Password Visibility Toggle
   ========================================================= */

passwordToggle.addEventListener("click", () => {

    const isPassword =
        passwordInput.type === "password";


    if (isPassword) {

        passwordInput.type = "text";

        passwordToggle.textContent = "Hide";

        passwordToggle.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        passwordInput.type = "password";

        passwordToggle.textContent = "Show";

        passwordToggle.setAttribute(
            "aria-label",
            "Show password"
        );
    }
});


/* =========================================================
   Mobile Navigation
   ========================================================= */

menuButton.addEventListener("click", () => {

    const isOpen =
        menuButton.classList.toggle("active");

    mobileMenu.classList.toggle("open", isOpen);

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    mobileMenu.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );
});


/*
 * Close mobile navigation after selecting a link.
 */
mobileMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

        menuButton.classList.remove("active");

        mobileMenu.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );
    });
});


/* =========================================================
   Know More Button
   ========================================================= */

knowMoreButton.addEventListener("click", () => {

    const aboutSection =
        document.getElementById("about");

    if (aboutSection) {

        aboutSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});