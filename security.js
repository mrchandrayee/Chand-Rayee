/**
 * Security Enhancements
 */
class SecurityManager {
    constructor() {
        this.setupCSP();
        this.setupXSRFProtection();
        this.setupInputSanitization();
        this.monitorSecurityEvents();
    }

    setupCSP() {
        // Content Security Policy
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = `
            default-src 'self';
            script-src 'self' https://www.google-analytics.com;
            style-src 'self' https://fonts.googleapis.com;
            img-src 'self' data: https:;
            font-src 'self' https://fonts.gstatic.com;
            connect-src 'self' https://api.chandrayee.dev;
            frame-src 'none';
            object-src 'none';
        `;
        document.head.appendChild(meta);
    }

    setupXSRFProtection() {
        // XSRF Token Management
        const token = this.generateToken();
        
        // Add token to all AJAX requests
        const originalFetch = window.fetch;
        window.fetch = function() {
            const args = Array.from(arguments);
            if (args[1] && args[1].method !== 'GET') {
                if (!args[1].headers) args[1].headers = {};
                args[1].headers['X-XSRF-Token'] = token;
            }
            return originalFetch.apply(window, args);
        };
    }

    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    setupInputSanitization() {
        // Sanitize form inputs
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const inputs = form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.value = this.sanitizeInput(input.value);
                });
            });
        });
    }

    sanitizeInput(input) {
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }

    monitorSecurityEvents() {
        // Monitor for potential security issues
        window.addEventListener('securitypolicyviolation', (e) => {
            console.error('CSP Violation:', {
                violatedDirective: e.violatedDirective,
                blockedURI: e.blockedURI
            });
            this.logSecurityEvent('CSP Violation', e);
        });

        // Monitor for XSS attempts
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.checkForMaliciousContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkForMaliciousContent(node) {
        const suspicious = [
            'javascript:',
            'data:text/html',
            'vbscript:',
            '<script',
            'onclick',
            'onerror'
        ];

        const content = node.outerHTML || '';
        suspicious.forEach(pattern => {
            if (content.toLowerCase().includes(pattern)) {
                this.logSecurityEvent('Suspicious Content Detected', {
                    pattern,
                    content: content.substring(0, 100)
                });
            }
        });
    }

    logSecurityEvent(type, data) {
        const event = {
            type,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            data
        };

        // Log to secure endpoint
        fetch('/api/security/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        }).catch(console.error);
    }
}