const form = document.getElementById("forgotPasswordForm");
const message = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const knowMoreButton = document.getElementById("knowMoreButton");

/* =========================================================
   Hamburger Menu & Navigation
   ========================================================= */
if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.classList.toggle("active");
    mobileMenu.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuButton.classList.remove("active");
      mobileMenu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });
}

if (knowMoreButton) {
  knowMoreButton.addEventListener("click", () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

/* =========================================================
   Password Visibility Toggle
   ========================================================= */
document.querySelectorAll("[data-password-target]").forEach(toggle => {
  toggle.addEventListener("click", () => {
    const passwordInput = document.getElementById(toggle.dataset.passwordTarget);
    const isHidden = passwordInput.classList.contains("masked-password");

    // Toggle the dot-masking class
    passwordInput.classList.toggle("masked-password", !isHidden);

    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", String(isHidden));
    toggle.setAttribute(
      "aria-label",
      `${isHidden ? "Hide" : "Show"} ${
        passwordInput.id === "newPassword"
          ? "new password"
          : "password confirmation"
      }`
    );
  });
});
 /*=========================================================
   Response Helpers & Form Submission
   ========================================================= */
async function readResponse(response) {
  const body = await response.text();

  if ((response.headers.get("content-type") || "").includes("application/json")) {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }

  return body;
}

function getResponseMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    return data.message || data.status || data.error || fallback;
  }

  return fallback;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  document.activeElement?.blur(); // Closes the mobile keyboard immediately on submit
  message.textContent = "";
  message.classList.remove("success");

  const name = document.getElementById("name").value.trim();
  const mobileNo = document.getElementById("mobileNo").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !mobileNo || !newPassword || !confirmPassword) {
    message.textContent = "Please complete all fields.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.textContent = "New Password and Confirm Password do not match.";
    document.getElementById("confirmPassword").focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Resetting...";

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: name,
          mobileNo: mobileNo,
          newPassword: newPassword
        })
      }
    );

    const data = await readResponse(response);

    if (!response.ok) {
      message.textContent = getResponseMessage(
        data,
        "Unable to reset your password. Check your username and mobile number."
      );
      return;
    }

    message.textContent = getResponseMessage(
      data,
      "Password reset successfully. Redirecting to login..."
    );
    message.classList.add("success");

    window.setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1200);
  } catch (error) {
    console.error("Password reset request failed:", error);
    message.textContent =
      "Could not connect to the server. Please make sure it is running and try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Reset Password";
  }
});
