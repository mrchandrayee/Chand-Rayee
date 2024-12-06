/**
 * Performance Monitoring System
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // Core Web Vitals
        this.monitorLCP();
        this.monitorFID();
        this.monitorCLS();
        
        // Custom metrics
        this.monitorResourceLoading();
        this.monitorUserInteractions();
        this.monitorJSErrors();
    }

    monitorLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.logMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
    }

    monitorFID() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.logMetric('FID', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });
    }

    monitorCLS() {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.logMetric('CLS', clsValue);
                }
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    logMetric(name, value) {
        this.metrics[name] = value;
        
        // Send to analytics
        if (window.gtag) {
            gtag('event', 'performance_metric', {
                metric_name: name,
                metric_value: value
            });
        }
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Performance Metric - ${name}: ${value}`);
        }
    }
}