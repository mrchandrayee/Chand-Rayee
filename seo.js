/**
 * SEO and Performance Optimizations
 */
class SEOOptimizer {
    constructor() {
        this.initializeStructuredData();
        this.initializeSocialMeta();
        this.optimizeImages();
        this.implementBreadcrumbs();
    }

    initializeStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Chand Rayee",
            "jobTitle": "AI/ML Engineer & Full Stack Developer",
            "url": "https://chandrayee.dev",
            "sameAs": [
                "https://github.com/mrchandrayee",
                "https://linkedin.com/in/mrchandrayee",
                "https://twitter.com/yourusername"
            ],
            "workExample": this.getProjectsStructuredData()
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    getProjectsStructuredData() {
        return document.querySelectorAll('.project-card').map(project => ({
            "@type": "CreativeWork",
            "name": project.querySelector('h3').textContent,
            "description": project.querySelector('p').textContent,
            "technologiesUsed": Array.from(project.querySelectorAll('.project-tech span'))
                .map(tech => tech.textContent)
        }));
    }

    optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading) img.loading = 'lazy';
            if (img.src && !img.srcset) {
                const sizes = [300, 600, 900, 1200];
                img.srcset = sizes
                    .map(size => `${this.generateImageUrl(img.src, size)} ${size}w`)
                    .join(', ');
                img.sizes = '(max-width: 768px) 100vw, 50vw';
            }
        });
    }

    generateImageUrl(src, size) {
        // Implement image resizing logic here
        return src.replace(/\.(jpg|png)$/, `-${size}.$1`);
    }

    implementBreadcrumbs() {
        const breadcrumbList = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": Array.from(document.querySelectorAll('.nav-links a'))
                .map((link, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": link.textContent,
                    "item": `https://chandrayee.dev${link.getAttribute('href')}`
                }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    }
} 