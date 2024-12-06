/**
 * SEO and Performance Optimizations
 */
class SiteOptimizer {
    constructor() {
        this.initializeLazyLoading();
        this.initializePreloading();
        this.setupMetaTags();
        this.initializeAnalytics();
        this.setupServiceWorker();
    }

    initializeLazyLoading() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));

        // Lazy load videos
        const lazyVideos = document.querySelectorAll('video[data-src]');
        const videoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.dataset.src;
                    video.load();
                    observer.unobserve(video);
                }
            });
        });

        lazyVideos.forEach(video => videoObserver.observe(video));
    }

    initializePreloading() {
        // Preload critical resources
        const preloadLinks = [
            { href: '/assets/fonts/main-font.woff2', as: 'font', type: 'font/woff2' },
            { href: '/assets/css/critical.css', as: 'style' },
            { href: '/assets/js/critical.js', as: 'script' }
        ];

        preloadLinks.forEach(link => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = link.href;
            preloadLink.as = link.as;
            if (link.type) preloadLink.type = link.type;
            document.head.appendChild(preloadLink);
        });
    }

    setupMetaTags() {
        // Dynamic meta tags based on content
        const metaTags = {
            description: 'AI/ML Engineer & Full Stack Developer specializing in intelligent solutions',
            keywords: 'AI, ML, Full Stack, Developer, Python, JavaScript, React, Node.js',
            author: 'Chand Rayee',
            'og:title': 'Chand Rayee - AI/ML & Full Stack Developer',
            'og:description': 'Professional portfolio showcasing AI/ML and development projects',
            'og:image': 'https://chandrayee.dev/assets/images/og-image.jpg',
            'twitter:card': 'summary_large_image'
        };

        Object.entries(metaTags).forEach(([name, content]) => {
            const meta = document.createElement('meta');
            if (name.startsWith('og:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            meta.setAttribute('content', content);
            document.head.appendChild(meta);
        });
    }

    initializeAnalytics() {
        // Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');

        // Custom analytics
        this.trackPageViews();
        this.trackUserEngagement();
    }

    trackPageViews() {
        // Track page views and time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            gtag('event', 'time_on_page', {
                'page_path': window.location.pathname,
                'time_seconds': timeOnPage / 1000
            });
        });
    }

    trackUserEngagement() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY + window.innerHeight) / 
                                document.documentElement.scrollHeight * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll >= 25 && maxScroll % 25 === 0) {
                    gtag('event', 'scroll_depth', {
                        'depth': maxScroll
                    });
                }
            }
        });

        // Track interactions
        document.addEventListener('click', e => {
            const target = e.target.closest('a, button');
            if (target) {
                gtag('event', 'interaction', {
                    'element': target.tagName.toLowerCase(),
                    'text': target.textContent.trim(),
                    'path': target.getAttribute('href') || ''
                });
            }
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                    console.error('ServiceWorker registration failed:', err);
                });
        }
    }
}