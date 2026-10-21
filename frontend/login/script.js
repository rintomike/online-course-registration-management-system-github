/* =========================================================
   COURSIFY LOGIN
   ========================================================= */


/* =========================================================
   Configuration
   ========================================================= */

const API_URL =
    "http://localhost:8080/api/auth/login";


/* =========================================================
   DOM Elements
   ========================================================= */

const loginForm =
    document.getElementById("loginForm");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const usernameError =
    document.getElementById("usernameError");

const passwordError =
    document.getElementById("passwordError");

const loginAlert =
    document.getElementById("loginAlert");

const signinButton =
    document.getElementById("signinButton");

const buttonText =
    document.getElementById("buttonText");

const passwordToggle =
    document.getElementById("passwordToggle");

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");

const knowMoreButton =
    document.getElementById("knowMoreButton");


/* =========================================================
   Clear Errors
   ========================================================= */

function clearErrors() {

    usernameError.textContent = "";
    passwordError.textContent = "";
    loginAlert.textContent = "";

    usernameInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
}


/* =========================================================
   Validate Form
   ========================================================= */

function validateForm() {

    let valid = true;

    clearErrors();

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    /* Username */

    if (!username) {

        usernameError.textContent =
            "Please enter your username or email.";

        usernameInput.classList.add("invalid");

        valid = false;
    }


    /* Password */

    if (!password) {

        passwordError.textContent =
            "Please enter your password.";

        passwordInput.classList.add("invalid");

        valid = false;
    }


    return valid;
}


/* =========================================================
   Loading State
   ========================================================= */

function setLoading(isLoading) {

    signinButton.disabled = isLoading;

    if (isLoading) {

        signinButton.classList.add("loading");

        buttonText.textContent =
            "Signing in...";

    } else {

        signinButton.classList.remove("loading");

        buttonText.textContent =
            "Sign in";
    }
}


/* =========================================================
   Backend Error Handling
   ========================================================= */

async function getErrorMessage(response) {

    /*
     * Try to read a JSON response such as:
     *
     * {
     *     "message": "Invalid username or password"
     * }
     */

    try {

        const data =
            await response.json();

        if (typeof data === "string") {
            return data;
        }

        return (
            data.message ||
            data.error ||
            "Invalid username or password"
        );

    } catch (error) {

        /*
         * If the backend doesn't return JSON,
         * use a sensible message based on status.
         */

        if (response.status === 401) {

            return "Invalid username or password";
        }

        if (response.status === 400) {

            return "Please check your login details.";
        }

        return "Unable to sign in. Please try again.";
    }
}


/* =========================================================
   Login Form Submission
   ========================================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        /*
         * Prevent normal browser form submission.
         */
        event.preventDefault();


        /*
         * Validate fields.
         */
        if (!validateForm()) {
            return;
        }


        /*
         * Read user input.
         */
        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;


        /*
         * JSON expected by Spring Boot:
         *
         * {
         *     "username": "...",
         *     "password": "..."
         * }
         */
        const requestBody = {
            name: username,
            password: password
        };


        /*
         * Show loading state.
         */
        setLoading(true);


        try {

            /*
             * POST login request.
             */
            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify(requestBody)
                }
            );


            /* =========================================
               SUCCESS
               ========================================= */

            if (response.ok) {

                /*
                 * Attempt to read the response.
                 *
                 * Depending on your Spring Boot backend,
                 * the response may contain:
                 *
                 * {
                 *     "token": "...",
                 *     "username": "john"
                 * }
                 *
                 * or:
                 *
                 * {
                 *     "accessToken": "..."
                 * }
                 */

                let data = null;

                try {

                    data =
                        await response.json();

                } catch (error) {

                    /*
                     * Some APIs return 200 with an empty body.
                     */
                    data = null;
                }


                /* =====================================
                   Store authentication information
                   ===================================== */

                if (data) {

                    /*
                     * Store JWT/access token if available.
                     */

                    if (data.token) {

                        localStorage.setItem(
                            "token",
                            data.token
                        );
                    }

                    if (data.accessToken) {

                        localStorage.setItem(
                            "accessToken",
                            data.accessToken
                        );


                        /*
                         * Also keep a generic token key
                         * for convenient access elsewhere.
                         */

                        if (!data.token) {

                            localStorage.setItem(
                                "token",
                                data.accessToken
                            );
                        }
                    }


                    /*
                     * Store refresh token if the backend
                     * provides one.
                     */

                    if (data.refreshToken) {

                        localStorage.setItem(
                            "refreshToken",
                            data.refreshToken
                        );
                    }


                    /*
                     * Store user details if returned.
                     */

                    if (data.user) {

                        localStorage.setItem(
                            "user",
                            JSON.stringify(data.user)
                        );
                    }


                    /*
                     * If the backend returns the username
                     * directly, preserve it as well.
                     */

                    if (data.username) {

                        localStorage.setItem(
                            "username",
                            data.username
                        );
                    }
                }


                /*
                 * Store the logged-in username even when
                 * the API only returns a token.
                 */

                if (!localStorage.getItem("username")) {

                    localStorage.setItem(
                        "username",
                        username
                    );
                }


                /* =====================================
                   Redirect to profile
                   ===================================== */

                window.location.href =
                    "../coursify_frontend/dashboard.html";

                return;
            }


            /* =========================================
               ERROR
               ========================================= */

            const message =
                await getErrorMessage(response);

            loginAlert.textContent = message;

        } catch (error) {

            /*
             * Network errors, server unavailable,
             * CORS failures, etc.
             */

            console.error(
                "Login request failed:",
                error
            );

            loginAlert.textContent =
                "Unable to connect to the server. " +
                "Please make sure the backend is running " +
                "and try again.";

        } finally {

            /*
             * Restore button.
             */
            setLoading(false);
        }
    }
);


/* =========================================================
   Live Error Clearing
   ========================================================= */

usernameInput.addEventListener(
    "input",
    () => {

        usernameInput.classList.remove("invalid");

        usernameError.textContent = "";

        loginAlert.textContent = "";
    }
);


passwordInput.addEventListener(
    "input",
    () => {

        passwordInput.classList.remove("invalid");

        passwordError.textContent = "";

        loginAlert.textContent = "";
    }
);


/* =========================================================
   Password Visibility
   ========================================================= */

passwordToggle.addEventListener(
    "click",
    () => {

        const showingPassword =
            passwordInput.type === "text";


        if (showingPassword) {

            passwordInput.type = "password";

            passwordToggle.textContent = "Show";

            passwordToggle.setAttribute(
                "aria-label",
                "Show password"
            );

        } else {

            passwordInput.type = "text";

            passwordToggle.textContent = "Hide";

            passwordToggle.setAttribute(
                "aria-label",
                "Hide password"
            );
        }
    }
);


/* =========================================================
   Hamburger Menu
   ========================================================= */

menuButton.addEventListener(
    "click",
    () => {

        const isOpen =
            menuButton.classList.toggle("active");

        mobileMenu.classList.toggle(
            "open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );
    }
);


/* =========================================================
   Close Mobile Menu When Link Is Selected
   ========================================================= */

mobileMenu
    .querySelectorAll("a")
    .forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                menuButton.classList.remove(
                    "active"
                );

                mobileMenu.classList.remove(
                    "open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenu.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );
    });


/* =========================================================
   Know More Button
   ========================================================= */

knowMoreButton.addEventListener(
    "click",
    () => {

        const aboutSection =
            document.getElementById("about");

        if (aboutSection) {

            aboutSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }
);