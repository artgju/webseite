// ===================================
// Security & Performance Utilities
// ===================================

// XSS Protection: Sanitize HTML input
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// Preloader
// ===================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }, 1000);
});

// ===================================
// Scroll Progress Bar - Throttled
// ===================================
const updateScrollProgress = throttle(() => {
    const scrollProgress = document.getElementById('scrollProgress');
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
}, 16); // ~60fps

window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme');

// Validate saved theme
if (savedTheme === 'dark' || savedTheme === 'light') {
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
        console.warn('LocalStorage not available');
    }
});

// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===================================
// Cookie Banner - with validation
// ===================================
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const declineCookies = document.getElementById('declineCookies');

let cookieConsent = null;
try {
    cookieConsent = localStorage.getItem('cookieConsent');
    // Validate stored value
    if (cookieConsent !== 'accepted' && cookieConsent !== 'declined') {
        cookieConsent = null;
    }
} catch (e) {
    console.warn('LocalStorage not available');
}

if (!cookieConsent) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 2000);
}

acceptCookies.addEventListener('click', () => {
    try {
        localStorage.setItem('cookieConsent', 'accepted');
    } catch (e) {
        console.warn('Cannot save cookie consent');
    }
    cookieBanner.classList.remove('show');
});

declineCookies.addEventListener('click', () => {
    try {
        localStorage.setItem('cookieConsent', 'declined');
    } catch (e) {
        console.warn('Cannot save cookie consent');
    }
    cookieBanner.classList.remove('show');
});

// ===================================
// Hexagon Hover Effects - Optimized
// ===================================
const initHexagons = () => {
    const hexagons = document.querySelectorAll('.hexagon');
    
    hexagons.forEach(hex => {
        hex.addEventListener('mouseenter', function() {
            // Subtle sound effect could be added here in future
            this.style.zIndex = '10';
        });
        
        hex.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
};

// Initialize hexagons after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHexagons);
} else {
    initHexagons();
}

// ===================================
// Smooth scrolling for navigation links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect - Throttled
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

const updateNavbar = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
}, 100);

window.addEventListener('scroll', updateNavbar, { passive: true });

// Counter animation for experience numbers - Optimized
const counterAnimation = () => {
    const counters = document.querySelectorAll('.experience-number');
    const observedCounters = new Set();
    
    const animateCounter = (counter) => {
        // Prevent duplicate animations
        if (observedCounters.has(counter)) return;
        observedCounters.add(counter);
        
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target) || target < 0 || target > 1000000) return; // Validation
        
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        let animationId;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                animationId = requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                observedCounters.delete(counter);
            }
        };
        
        updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Reset counter to 0
                entry.target.textContent = '0';
                // Start animation
                animateCounter(entry.target);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px'
    });
    
    counters.forEach(counter => {
        if (counter.getAttribute('data-target')) {
            observer.observe(counter);
        }
    });
};

// Initialize counter animation
counterAnimation();

// Fade-in animation on scroll - Optimized
const fadeInOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .project-card, .experience-card, .blog-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                requestAnimationFrame(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
                
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
};

// Initialize fade-in animation
fadeInOnScroll();

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        // For now, we'll just show a success message
        
        // Show success message
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Gesendet! ✓';
        submitButton.style.backgroundColor = '#28a745';
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
        }, 3000);
        
        // Log form data (for development)
        console.log('Form submitted:', data);
    });
}

// Mobile menu toggle (for future enhancement)
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar .container');
    const navMenu = document.querySelector('.nav-menu');
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    hamburger.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--dark-color);
    `;
    
    // Add hamburger to navbar
    navbar.appendChild(hamburger);
    
    // Toggle menu on mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Show hamburger on mobile
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMobileMenu = (e) => {
        if (e.matches) {
            hamburger.style.display = 'block';
            navMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                display: none;
            `;
        } else {
            hamburger.style.display = 'none';
            navMenu.style.cssText = '';
        }
    };
    
    mediaQuery.addListener(handleMobileMenu);
    handleMobileMenu(mediaQuery);
    
    // Add active class toggle
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu.active {
            display: flex !important;
        }
    `;
    document.head.appendChild(style);
};

// Initialize mobile menu
createMobileMenu();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 600);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
