/* =========================================
   COURSIFY ADMIN HOME
   Menu, session-aware CTAs, live catalog data
   ========================================= */

"use strict";

const API_BASE = "http://localhost:8080/api";
const ADMIN_SESSION_KEY = "coursifyAdminAuthenticated";
const PREVIEW_LIMIT = 4;

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  /* ---------- Footer year ---------- */
  const currentYear = $("#current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  /* ---------- Hamburger menu ---------- */
  const menuButton = $("#menuButton");
  const mobileMenu = $("#mobileMenu");

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = !open;
    menuButton.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => setMenu(mobileMenu.hidden));

    // Auto-close when a link is chosen
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Close on outside click or Escape
    document.addEventListener("click", (event) => {
      if (mobileMenu.hidden) return;
      if (!mobileMenu.contains(event.target) && !menuButton.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        setMenu(false);
        menuButton.focus();
      }
    });
  }

  /* ---------- Session-aware buttons ---------- */
  const isAuthenticated = sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  const navAction = $("#navAction");
  const heroCta = $("#heroCta");

  if (isAuthenticated) {
    if (navAction) {
      navAction.textContent = "Go to Dashboard";
      navAction.setAttribute("href", "admin-dashboard.html");
    }
    if (heroCta) {
      heroCta.textContent = "Open Admin Dashboard";
      heroCta.setAttribute("href", "admin-dashboard.html");
    }
  }

  /* ---------- Helpers ---------- */
  function setMessage(element, message, type = "info") {
    if (!element) return;
    element.textContent = message;
    element.classList.remove("is-error", "is-success", "is-info");
    if (message) element.classList.add(`is-${type}`);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function normalizeType(value) {
    return String(value ?? "").trim().toLowerCase();
  }

  /* ---------- Stats ---------- */
  const statTotal = $("#statTotal");
  const statOnline = $("#statOnline");
  const statOffline = $("#statOffline");
  const statHybrid = $("#statHybrid");
  const statsMessage = $("#statsMessage");

  function renderStats(courses) {
    const counts = { online: 0, offline: 0, hybrid: 0 };
    courses.forEach((course) => {
      const type = normalizeType(course.courseType);
      if (type in counts) counts[type] += 1;
    });

    if (statTotal) statTotal.textContent = String(courses.length);
    if (statOnline) statOnline.textContent = String(counts.online);
    if (statOffline) statOffline.textContent = String(counts.offline);
    if (statHybrid) statHybrid.textContent = String(counts.hybrid);
    setMessage(statsMessage, "");
  }

  function renderStatsOffline() {
    [statTotal, statOnline, statOffline, statHybrid].forEach((el) => {
      if (el) el.textContent = "—";
    });
    setMessage(
      statsMessage,
      "Live stats are unavailable. Check that the backend is running on port 8080.",
      "error"
    );
  }

  /* ---------- Course preview ---------- */
  const previewList = $("#coursePreview");
  const catalogMessage = $("#catalogMessage");

  function renderEmptyState(title, description) {
    if (!previewList) return;
    previewList.replaceChildren();

    const box = createElement("div", "empty-state wide");
    const icon = createElement("div", "empty-state-icon", "＋");
    icon.setAttribute("aria-hidden", "true");
    box.append(icon, createElement("h3", "", title), createElement("p", "", description));
    previewList.append(box);
  }

  function renderPreview(courses) {
    if (!previewList) return;

    if (courses.length === 0) {
      renderEmptyState(
        "Your catalog is ready",
        "No courses yet. Sign in and add your first course from the dashboard."
      );
      return;
    }

    previewList.replaceChildren();

    // Most recent first, assuming the API returns oldest to newest
    courses.slice(-PREVIEW_LIMIT).reverse().forEach((course) => {
      const courseName = String(course.courseName ?? "").trim();
      const durationDays = course.durationDays ?? "—";
      const courseType = String(course.courseType ?? "Unspecified");

      const card = createElement("article", "course-card");

      const icon = createElement("div", "course-icon", courseName.charAt(0).toUpperCase() || "C");
      icon.setAttribute("aria-hidden", "true");

      const name = createElement("h3", "course-name", courseName || "Untitled course");

      const meta = createElement("p", "course-meta");
      const duration = createElement("span", "", `${durationDays} days`);
      const separator = createElement("span", "", "·");
      separator.setAttribute("aria-hidden", "true");
      const type = createElement("span", "course-type-badge", courseType);
      meta.append(duration, separator, type);

      card.append(icon, name, meta);
      previewList.append(card);
    });
  }

  /* ---------- Load from backend ---------- */
  async function loadCatalog() {
    try {
      const response = await fetch(`${API_BASE}/courses`, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error(`Request failed (${response.status}).`);

      const courses = await response.json();
      if (!Array.isArray(courses)) throw new Error("Unexpected response from the server.");

      renderStats(courses);
      renderPreview(courses);
      setMessage(catalogMessage, "");
    } catch (error) {
      console.error("Unable to load courses:", error);
      renderStatsOffline();
      renderEmptyState(
        "Catalog preview unavailable",
        "We couldn't reach the server. Start the Spring Boot backend on port 8080 and refresh this page."
      );
    }
  }

  loadCatalog();
});