"use strict";

(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const safeStorage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // The selected theme still applies for the current page view.
      }
    },
  };

  const setTheme = (theme, persist = false) => {
    const normalizedTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = normalizedTheme;

    if (themeToggle) {
      const targetTheme = normalizedTheme === "dark" ? "hell" : "dunkel";
      themeToggle.setAttribute("aria-label", `Farbschema auf ${targetTheme} wechseln`);
    }

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", normalizedTheme === "dark" ? "#071426" : "#f3f7fa");
    }

    if (persist) safeStorage.set("theme", normalizedTheme);
  };

  const savedTheme = safeStorage.get("theme");
  setTheme(savedTheme || "dark");

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Navigation öffnen");
    navMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
    if (window.innerWidth <= 820) {
      navMenu.setAttribute("aria-hidden", "true");
      navMenu.inert = true;
    } else {
      navMenu.removeAttribute("aria-hidden");
      navMenu.inert = false;
    }
  };

  menuToggle?.addEventListener("click", () => {
    if (!navMenu) return;
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Navigation öffnen" : "Navigation schließen");
    navMenu.classList.toggle("is-open", !isOpen);
    body.classList.toggle("menu-open", !isOpen);
    navMenu.removeAttribute("aria-hidden");
    navMenu.inert = false;
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 820) closeMenu();
    },
    { passive: true },
  );

  closeMenu();

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  const revealElements = [...document.querySelectorAll(".reveal")];
  if (!reduceMotion && "IntersectionObserver" in window && revealElements.length) {
    root.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const trackedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && trackedSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visibleSection) return;

        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === `#${visibleSection.target.id}`;
          if (isCurrent) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-25% 0px -62%", threshold: [0.05, 0.25, 0.5] },
    );
    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const controls = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    interest: document.getElementById("interest"),
    message: document.getElementById("message"),
    privacy: document.getElementById("privacy"),
  };

  const messages = {
    name: "Bitte geben Sie Ihren Namen ein.",
    email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    interest: "Bitte wählen Sie ein Thema aus.",
    message: "Bitte beschreiben Sie kurz Ihren Projektkontext.",
    privacy: "Bitte bestätigen Sie die Datenschutzerklärung.",
  };

  const setFieldError = (key, message = "") => {
    const control = controls[key];
    const error = document.getElementById(`${key}-error`);
    if (!control || !error) return;

    error.textContent = message;
    if (message) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", error.id);
    } else {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    }
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateField = (key) => {
    const control = controls[key];
    if (!control) return true;

    let isValid = true;
    if (key === "privacy") isValid = control.checked;
    else if (key === "email") isValid = isValidEmail(control.value.trim());
    else isValid = control.value.trim().length > 0;

    setFieldError(key, isValid ? "" : messages[key]);
    return isValid;
  };

  Object.entries(controls).forEach(([key, control]) => {
    if (!control) return;
    const eventName = control.matches('select, input[type="checkbox"]') ? "change" : "input";
    control.addEventListener(eventName, () => {
      if (control.getAttribute("aria-invalid") === "true") validateField(key);
    });
    control.addEventListener("blur", () => validateField(key));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status?.classList.remove("success", "error");
    if (status) status.textContent = "";

    const invalidKeys = Object.keys(controls).filter((key) => !validateField(key));
    if (invalidKeys.length) {
      controls[invalidKeys[0]]?.focus();
      if (status) {
        status.textContent = "Bitte prüfen Sie die markierten Felder.";
        status.classList.add("error");
      }
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent = "Wird gesendet …";
    }

    try {
      const formData = new FormData(form);
      const encodedBody = new URLSearchParams();
      formData.forEach((value, key) => encodedBody.append(key, String(value)));

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedBody.toString(),
      });

      if (!response.ok) throw new Error(`Form response: ${response.status}`);

      form.reset();
      Object.keys(controls).forEach((key) => setFieldError(key));
      if (status) {
        status.textContent = "Vielen Dank. Ihre Nachricht wurde übermittelt.";
        status.classList.add("success");
      }
    } catch {
      if (status) {
        status.textContent = "Die Übermittlung hat nicht funktioniert. Bitte schreiben Sie direkt an kontakt@vuralavci.de.";
        status.classList.add("error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.querySelector("span").textContent = "Nachricht senden";
      }
    }
  });
})();
