/**
 * Portfolio Website JavaScript
 * Author: Chand Rayee
 * Version: 2.0
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', main);

/**
 * Main initialization function
 */
function main() {
    initPreloader();
    initParticles();
    initTypewriter();
    initNavigation();
    initCustomCursor();
    initScrollReveal();
    initSkillsAnimation();
    initProjectFilter();
    initBackToTop();
    initContactForm();
    initThemeToggle();
    initSmoothScroll();
    initParallaxEffect();
}

/**
 * Preloader Animation
 */
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.loading-screen');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            preloader.style.opacity = '0';
            document.body.style.overflow = 'visible';
            
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

/**
 * Particles.js Configuration
 */
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#2563eb' },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: false,
                    animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#2563eb',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    outMode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detectsOn: 'canvas',
                events: {
                    onHover: { enable: true, mode: 'grab' },
                    onClick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * Typewriter Effect
 */
function initTypewriter() {
    const texts = ['AI/ML Engineer', 'Full Stack Developer', 'Problem Solver'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedTextElement = document.getElementById('typed-text');
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * Project Filter Functionality
 */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                // Show all or filter by category
                if (filter === 'all' || filter === category) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.display = 'block';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact Form Handling
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(form)) return;

        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Form Validation
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showInputError(input, 'Please enter a valid email');
            isValid = false;
        } else {
            removeInputError(input);
        }
    });

    return isValid;
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show Input Error
 */
function showInputError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || document.createElement('span');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
}

/**
 * Remove Input Error
 */
function removeInputError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    
    if (error) {
        error.remove();
    }
    
    input.classList.remove('error');
}

/**
 * Notification System
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(note => note.remove());

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Dark Mode Toggle
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    // Initialize theme
    if (storedTheme) {
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeIcon(storedTheme === 'dark');
    } else {
        const isDark = prefersDarkScheme.matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    }

    // Theme toggle click handler
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme === 'dark');
        
        // Trigger theme change animation
        animateThemeChange(newTheme);
    });

    // System theme change handler
    prefersDarkScheme.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateThemeIcon(e.matches);
        }
    });
}

/**
 * Update Theme Icon
 */
function updateThemeIcon(isDark) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    }
}

/**
 * Theme Change Animation
 */
function animateThemeChange(theme) {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, 500);
    });
}

/**
 * Parallax Effect
 */
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }, 16));
}

/**
 * Smooth Scroll Implementation
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Intersection Observer for Animations
 */
function initScrollReveal() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, options);

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Performance Optimizations
 */

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            requestAnimationFrame(() => inThrottle = false);
        }
    };
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

/**
 * Lazy Loading Images
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Analytics and Performance Monitoring
 */
function initAnalytics() {
    // Performance metrics
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const metrics = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', metrics.loadEventEnd - metrics.navigationStart);
        });
    }

    // Custom event tracking
    const trackEvent = (category, action, label) => {
        if (window.gtag) {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    };

    // Track specific interactions
    document.querySelectorAll('[data-track]').forEach(element => {
        element.addEventListener('click', () => {
            const { trackCategory, trackAction, trackLabel } = element.dataset;
            trackEvent(trackCategory, trackAction, trackLabel);
        });
    });
}

/**
 * Error Handling and Logging
 */
function initErrorHandling() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ', msg, url, lineNo, columnNo, error);
        // Send to error tracking service
        if (window.errorTracker) {
            window.errorTracker.log({
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                error: error
            });
        }
        return false;
    };
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    main();
    initLazyLoading();
    initAnalytics();
    initErrorHandling();
});