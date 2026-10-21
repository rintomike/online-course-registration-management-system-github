/* =========================================
   COURSIFY ADMIN PORTAL
   Connected to Spring Boot Backend API
   ========================================= */

"use strict";

const API_BASE = "http://localhost:8080/api";
const ADMIN_SESSION_KEY = "coursifyAdminAuthenticated";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  // Shared elements
  const currentYear = $("#current-year");
  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  // Password visibility toggle
  const passwordInput = $("#admin-password");
  const passwordToggle = $("#password-toggle");

  if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";
      passwordToggle.textContent = isHidden ? "Hide" : "Show";
      passwordToggle.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
      passwordToggle.setAttribute("aria-pressed", String(isHidden));
    });
  }

  // Forgot Password button on Admin Login (optional helper alert)
  const forgotButton = $("#forgot-password");
  if (forgotButton) {
    forgotButton.addEventListener("click", () => {
      alert("Administrator credentials are managed via the server environment configuration (env.properties / application.properties).");
    });
  }

  // Helper: Display status/error messages
  function setMessage(element, message, type = "info") {
    if (!element) return;

    element.textContent = message;
    element.classList.remove("is-error", "is-success", "is-info");

    if (message) {
      element.classList.add(`is-${type}`);
    }
  }

  // Helper: Button loading state
  function setButtonLoading(button, loading, loadingText, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.setAttribute("aria-busy", String(loading));

    if (loading) {
      button.dataset.originalText = button.textContent.trim();
      button.textContent = loadingText;
    } else {
      button.textContent =
        originalText || button.dataset.originalText || button.textContent;
      delete button.dataset.originalText;
    }
  }

  // Helper: Parse Spring Boot error responses
  async function readError(response) {
    const body = await response.json().catch(() => null);
    return (
      body?.status ||
      body?.message ||
      body?.error ||
      `Request failed (${response.status}).`
    );
  }

  // Initialize Login or Dashboard based on page elements
  const loginForm = $("#login-form");
  if (loginForm) {
    initializeLogin(loginForm);
  }

  const courseForm = $("#course-form");
  if (courseForm) {
    initializeDashboard(courseForm);
  }

  /* =========================================
     1. ADMIN LOGIN (POST /api/admin/login)
     ========================================= */
  function initializeLogin(form) {
    // Redirect to dashboard if already logged in
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "true") {
      window.location.replace("admin-dashboard.html");
      return;
    }

    const nameInput = $("#admin-name");
    const password = $("#admin-password");
    const message = $("#login-message");
    const submitButton = $("#login-button");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = nameInput.value.trim();
      const passwordValue = password.value;

      if (!name || !passwordValue) {
        setMessage(
          message,
          "Please enter your administrator name and password.",
          "error"
        );
        return;
      }

      setMessage(message, "");
      setButtonLoading(submitButton, true, "Signing in...", "Sign-In");

      try {
        const response = await fetch(`${API_BASE}/admin/login`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            password: passwordValue
          })
        });

        if (!response.ok) {
          const error = await readError(response);
          setMessage(
            message,
            response.status === 401
              ? "Those details don’t look right. Please try again."
              : error,
            "error"
          );
          return;
        }

        const result = await response.json();
        if (result.status !== "success") {
          setMessage(
            message,
            "The server did not confirm administrator access.",
            "error"
          );
          return;
        }

        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        setMessage(message, "Login successful. Redirecting...", "success");
        window.location.assign("admin-dashboard.html");
      } catch (error) {
        console.error("Admin sign-in failed:", error);
        setMessage(
          message,
          "Unable to reach the server. Check that the Spring Boot backend is running on port 8080.",
          "error"
        );
      } finally {
        setButtonLoading(submitButton, false, "Signing in...", "Sign-In");
      }
    });
  }

  /* =========================================
     2. ADMIN DASHBOARD (GET, POST, DELETE)
     ========================================= */
  function initializeDashboard(form) {
    // Protect dashboard route if not logged in
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
      window.location.replace("admin-login.html");
      return;
    }

    const nameInput = $("#course-name");
    const durationInput = $("#course-duration");
    const typeInput = $("#course-type");

    const list = $("#course-list");
    const count = $("#course-count");
    const courseMessage = $("#course-message");
    const catalogMessage = $("#catalog-message");

    const addButton = $("#add-course-button");
    const refreshButton = $("#refresh-button");
    const logoutButton = $("#logout-button");

    let courses = [];

    function createElement(tag, className, text) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
      return element;
    }

    function updateCount() {
      if (!count) return;
      const total = courses.length;
      count.textContent = `${total} ${total === 1 ? "course" : "courses"}`;
    }

    function renderCourses() {
      if (!list) return;

      list.replaceChildren();
      updateCount();

      if (courses.length === 0) {
        const emptyState = createElement("div", "empty-state");
        const icon = createElement("div", "empty-state-icon", "+");
        icon.setAttribute("aria-hidden", "true");
        const heading = createElement("h3", "", "Your catalog is ready");
        const description = createElement(
          "p",
          "",
          "Your courses will appear here once they are added."
        );

        emptyState.append(icon, heading, description);
        list.append(emptyState);
        return;
      }

      courses.forEach((course) => {
        const courseName = String(course.courseName ?? "");
        const durationDays = course.durationDays ?? "—";
        const courseType = String(course.courseType ?? "Unspecified");

        const row = createElement("article", "course-row");

        const firstLetter = courseName.trim().charAt(0).toUpperCase() || "C";
        const icon = createElement("div", "course-icon", firstLetter);
        icon.setAttribute("aria-hidden", "true");

        const info = createElement("div", "course-info");
        const name = createElement(
          "h3",
          "course-name",
          courseName || "Untitled course"
        );

        const meta = createElement("p", "course-meta");
        const duration = createElement("span", "", `${durationDays} days`);
        const separator = createElement("span", "", "·");
        separator.setAttribute("aria-hidden", "true");
        const type = createElement("span", "course-type-badge", courseType);

        meta.append(duration, separator, type);
        info.append(name, meta);

        const deleteButton = createElement("button", "delete-button", "Remove");
        deleteButton.type = "button";
        deleteButton.setAttribute(
          "aria-label",
          `Remove course ${courseName || "untitled course"}`
        );

        deleteButton.addEventListener("click", () => {
          removeCourse(course, deleteButton);
        });

        row.append(icon, info, deleteButton);
        list.append(row);
      });
    }

    // Fetch courses from GET /api/courses
    async function loadCourses(showRefreshMessage = false) {
      if (!showRefreshMessage) {
        setMessage(catalogMessage, "");
      }

      try {
        const response = await fetch(`${API_BASE}/courses`, {
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        const result = await response.json();
        if (!Array.isArray(result)) {
          throw new Error("The server returned an unexpected course catalog.");
        }

        courses = result;
        renderCourses();

        if (showRefreshMessage) {
          setMessage(catalogMessage, "Course catalog refreshed.", "success");
        }
      } catch (error) {
        console.error("Unable to load courses:", error);
        if (count) count.textContent = "— courses";
        setMessage(
          catalogMessage,
          error.message || "We couldn’t load the catalog. Check the server connection.",
          "error"
        );
      }
    }

    // Delete course via DELETE /api/admin/courses/{courseName}
    async function removeCourse(course, button) {
      const courseName = String(course.courseName ?? "");
      const confirmed = window.confirm(
        `Remove "${courseName || "untitled course"}" from your catalog?`
      );

      if (!confirmed) return;

      button.disabled = true;
      setMessage(catalogMessage, "");

      try {
        const response = await fetch(
          `${API_BASE}/admin/courses/${encodeURIComponent(courseName)}`,
          {
            method: "DELETE",
            headers: { "Accept": "application/json" }
          }
        );

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        setMessage(catalogMessage, "Course removed from the catalog.", "success");
        await loadCourses();
      } catch (error) {
        console.error("Unable to remove course:", error);
        setMessage(catalogMessage, error.message, "error");
        button.disabled = false;
      }
    }

    // Add course via POST /api/admin/courses
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setMessage(courseMessage, "");
      setMessage(catalogMessage, "");

      const courseName = nameInput.value.trim();
      const durationDays = Number(durationInput.value);
      const courseType = typeInput.value.trim();

      if (!courseName) {
        setMessage(courseMessage, "Please enter a course name.", "error");
        nameInput.focus();
        return;
      }

      if (!Number.isSafeInteger(durationDays) || durationDays < 1) {
        setMessage(
          courseMessage,
          "Duration must be a whole number of at least one day.",
          "error"
        );
        durationInput.focus();
        return;
      }

      if (!courseType) {
        setMessage(courseMessage, "Please select a course type.", "error");
        typeInput.focus();
        return;
      }

      addButton.disabled = true;

      try {
        const response = await fetch(`${API_BASE}/admin/courses`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            courseName: courseName,
            durationDays: durationDays,
            courseType: courseType
          })
        });

        if (!response.ok) {
          throw new Error(await readError(response));
        }

        form.reset();
        setMessage(courseMessage, "Course added to the catalog!", "success");
        await loadCourses();
      } catch (error) {
        console.error("Unable to add course:", error);
        setMessage(courseMessage, error.message, "error");
      } finally {
        addButton.disabled = false;
      }
    });

    // Refresh button
    if (refreshButton) {
      refreshButton.addEventListener("click", async () => {
        refreshButton.disabled = true;
        await loadCourses(true);
        refreshButton.disabled = false;
      });
    }

    // Sign out button
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (!confirmed) return;

        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.assign("admin-login.html");
      });
    }

    // Initial load from Spring Boot backend
    loadCourses();
  }
});
