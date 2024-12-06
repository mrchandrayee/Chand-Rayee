/**
 * Accessibility Enhancements
 */
class AccessibilityManager {
    constructor() {
        this.setupA11y();
        this.initializeKeyboardNav();
        this.setupSkipLinks();
        this.improveFormAccessibility();
        this.setupAria();
    }

    setupA11y() {
        // Add role attributes
        document.querySelectorAll('nav').forEach(nav => 
            nav.setAttribute('role', 'navigation'));
        document.querySelectorAll('main').forEach(main => 
            main.setAttribute('role', 'main'));
        document.querySelectorAll('footer').forEach(footer => 
            footer.setAttribute('role', 'contentinfo'));

        // Add aria-labels
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', button.title || 'Button');
            }
        });

        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid #4f46e5;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    initializeKeyboardNav() {
        // Handle keyboard navigation
        document.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupSkipLinks() {
        const skipLinks = [
            { id: 'main', text: 'Skip to main content' },
            { id: 'nav', text: 'Skip to navigation' },
            { id: 'footer', text: 'Skip to footer' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = `#${link.id}`;
            skipLink.className = 'skip-link';
            skipLink.textContent = link.text;
            document.body.insertBefore(skipLink, document.body.firstChild);
        });
    }

    improveFormAccessibility() {
        // Enhance form controls
        document.querySelectorAll('form').forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Add aria-required for required fields
                if (input.required) {
                    input.setAttribute('aria-required', 'true');
                }

                // Add error handling
                input.addEventListener('invalid', () => {
                    input.setAttribute('aria-invalid', 'true');
                    const errorId = `error-${input.id}`;
                    input.setAttribute('aria-describedby', errorId);
                });

                // Clear error state on input
                input.addEventListener('input', () => {
                    input.removeAttribute('aria-invalid');
                    input.removeAttribute('aria-describedby');
                });
            });
        });
    }

    setupAria() {
        // Set up ARIA landmarks
        const landmarks = {
            banner: 'header',
            navigation: 'nav',
            main: 'main',
            complementary: 'aside',
            contentinfo: 'footer'
        };

        Object.entries(landmarks).forEach(([role, selector]) => {
            document.querySelectorAll(selector).forEach(element => {
                element.setAttribute('role', role);
            });
        });

        // Add aria-current for current page/section
        const currentPath = window.location.pathname;
        document.querySelectorAll('nav a').forEach(link => {
            if (link.pathname === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }
}