// ===================================
// Utility Functions
// ===================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===================================
// Preloader
// ===================================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 600);
  }
});

// ===================================
// Scroll Progress Bar
// ===================================
const updateScrollProgress = throttle(() => {
  const scrollProgress = document.getElementById("scrollProgress");
  if (!scrollProgress) return;

  const windowHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  scrollProgress.style.width = scrolled + "%";
}, 16);

window.addEventListener("scroll", updateScrollProgress, { passive: true });

// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");

if (themeToggle && themeIcon) {
  // Check saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "○";
  }

  // Also check system preference
  if (
    !savedTheme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "○";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeIcon.textContent = isDark ? "○" : "◐";

    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {
      console.warn("LocalStorage not available");
    }
  });
}

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    const isExpanded = navMenu.classList.contains("active");
    mobileMenuToggle.setAttribute("aria-expanded", isExpanded);
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===================================
// Cookie Banner
// ===================================
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");
const declineCookies = document.getElementById("declineCookies");

if (cookieBanner && acceptCookies && declineCookies) {
  let cookieConsent = null;
  try {
    cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent !== "accepted" && cookieConsent !== "declined") {
      cookieConsent = null;
    }
  } catch (e) {
    console.warn("LocalStorage not available");
  }

  if (!cookieConsent) {
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1500);
  }

  acceptCookies.addEventListener("click", () => {
    try {
      localStorage.setItem("cookieConsent", "accepted");
    } catch (e) {}
    cookieBanner.classList.remove("show");
  });

  declineCookies.addEventListener("click", () => {
    try {
      localStorage.setItem("cookieConsent", "declined");
    } catch (e) {}
    cookieBanner.classList.remove("show");
  });
}

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      const navbarHeight = 64;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===================================
// Counter Animation
// ===================================
const animateCounters = () => {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  const observedCounters = new Set();

  const animateCounter = (counter) => {
    if (observedCounters.has(counter)) return;
    observedCounters.add(counter);

    const target = parseInt(counter.getAttribute("data-target"));
    if (isNaN(target) || target < 0) return;

    const duration = 1500;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
        observedCounters.delete(counter);
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.textContent = "0";
          animateCounter(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  counters.forEach((counter) => observer.observe(counter));
};

animateCounters();

// ===================================
// Fade-in on Scroll
// ===================================
const fadeInOnScroll = () => {
  const elements = document.querySelectorAll(
    ".service-card, .project-card, .skill-group, .downloads-box"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(element);
  });
};

fadeInOnScroll();

// ===================================
// Contact Form
// ===================================
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Show success state
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Gesendet ✓";
    submitButton.style.background = "#059669";
    submitButton.disabled = true;

    // Reset form
    this.reset();

    // Reset button after 3 seconds
    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.style.background = "";
      submitButton.disabled = false;
    }, 3000);

    console.log("Form submitted:", data);
  });
}

// ===================================
// Navbar Background on Scroll
// ===================================
const navbar = document.querySelector(".navbar");

const updateNavbar = throttle(() => {
  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
  } else {
    navbar.style.boxShadow = "none";
  }
}, 100);

window.addEventListener("scroll", updateNavbar, { passive: true });
