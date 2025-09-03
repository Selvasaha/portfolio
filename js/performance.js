// ========================================
// PERFORMANCE MONITORING MODULE
// ========================================

import { utils } from './utils.js';

export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.setupReducedMotion();
        this.setupPerformanceObservers();
        this.monitorPageLoad();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            this.disableAnimations();
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });

        this.metrics.set('reducedMotionEnabled', prefersReducedMotion.matches);
    }

    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        
        document.head.appendChild(style);
        document.documentElement.classList.add('reduced-motion');
        
        this.dispatchPerformanceEvent('animationsDisabled');
    }

    enableAnimations() {
        const existingStyle = document.getElementById('reduced-motion-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.documentElement.classList.remove('reduced-motion');
        this.dispatchPerformanceEvent('animationsEnabled');
    }

    setupPerformanceObservers() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            this.setupLCPObserver();
            this.setupFIDObserver();
            this.setupCLSObserver();
            this.setupNavigationObserver();
        }
    }

    setupLCPObserver() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.set('LCP', {
                    value: lastEntry.startTime,
                    rating: this.rateLCP(lastEntry.startTime),
                    timestamp: Date.now()
                });
                
                console.log('LCP:', lastEntry.startTime.toFixed(2) + 'ms');
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.observers.set('lcp', observer);
        } catch (error) {
            console.warn('LCP observer not supported:', error);
        }
    }

    setupFIDObserver() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.set('FID', {
                        value: entry.processingStart - entry.startTime,
                        rating: this.rateFID(entry.processingStart - entry.startTime),
                        timestamp: Date.now()
                    });
                    
                    console.log('FID:', (entry.processingStart - entry.startTime).toFixed(2) + 'ms');
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.observers.set('fid', observer);
        } catch (error) {
            console.warn('FID observer not supported:', error);
        }
    }

    setupCLSObserver() {
        try {
            let clsValue = 0;
            let clsEntries = [];
            
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                        
                        this.metrics.set('CLS', {
                            value: clsValue,
                            rating: this.rateCLS(clsValue),
                            timestamp: Date.now()
                        });
                        
                        console.log('CLS:', clsValue.toFixed(4));
                    }
                });
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.observers.set('cls', observer);
        } catch (error) {
            console.warn('CLS observer not supported:', error);
        }
    }

    setupNavigationObserver() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.metrics.set('navigation', {
                        loadTime: entry.loadEventEnd - entry.startTime,
                        domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
                        firstByte: entry.responseStart - entry.startTime,
                        timestamp: Date.now()
                    });
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
            this.observers.set('navigation', observer);
        } catch (error) {
            console.warn('Navigation observer not supported:', error);
        }
    }

    monitorPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            
            this.metrics.set('pageLoad', {
                time: loadTime,
                rating: this.ratePageLoad(loadTime),
                timestamp: Date.now()
            });
            
            console.log(`📊 Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Monitor resource loading
            this.analyzeResourcePerformance();
        });
    }

    analyzeResourcePerformance() {
        const resources = performance.getEntriesByType('resource');
        
        const analysis = {
            totalResources: resources.length,
            slowResources: [],
            largeResources: [],
            totalSize: 0,
            totalDuration: 0
        };
        
        resources.forEach(resource => {
            const duration = resource.responseEnd - resource.startTime;
            const size = resource.transferSize || 0;
            
            analysis.totalDuration += duration;
            analysis.totalSize += size;
            
            if (duration > 1000) { // Slow resources (>1s)
                analysis.slowResources.push({
                    name: resource.name,
                    duration: duration.toFixed(2)
                });
            }
            
            if (size > 500000) { // Large resources (>500KB)
                analysis.largeResources.push({
                    name: resource.name,
                    size: (size / 1024).toFixed(2) + 'KB'
                });
            }
        });
        
        this.metrics.set('resources', analysis);
        
        if (analysis.slowResources.length > 0) {
            console.warn('Slow resources detected:', analysis.slowResources);
        }
        
        if (analysis.largeResources.length > 0) {
            console.warn('Large resources detected:', analysis.largeResources);
        }
    }

    setupMemoryMonitoring() {
        if (performance.memory) {
            const updateMemoryInfo = () => {
                const memory = performance.memory;
                
                this.metrics.set('memory', {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
                    timestamp: Date.now()
                });
            };
            
            updateMemoryInfo();
            
            // Update memory info every 30 seconds
            setInterval(updateMemoryInfo, 30000);
            
            console.log('💾 Memory monitoring enabled');
        }
    }

    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.metrics.set('network', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                timestamp: Date.now()
            });
            
            connection.addEventListener('change', () => {
                this.metrics.set('network', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                    timestamp: Date.now()
                });
                
                console.log('Network changed:', connection.effectiveType);
            });
        }
    }

    // Rating functions based on Web Vitals thresholds
    rateLCP(value) {
        if (value <= 2500) return 'good';
        if (value <= 4000) return 'needs-improvement';
        return 'poor';
    }

    rateFID(value) {
        if (value <= 100) return 'good';
        if (value <= 300) return 'needs-improvement';
        return 'poor';
    }

    rateCLS(value) {
        if (value <= 0.1) return 'good';
        if (value <= 0.25) return 'needs-improvement';
        return 'poor';
    }

    ratePageLoad(value) {
        if (value <= 1000) return 'excellent';
        if (value <= 3000) return 'good';
        if (value <= 5000) return 'fair';
        return 'poor';
    }

    // Public methods
    getMetrics() {
        const metricsObject = {};
        this.metrics.forEach((value, key) => {
            metricsObject[key] = value;
        });
        return metricsObject;
    }

    getMetric(name) {
        return this.metrics.get(name);
    }

    logPerformanceReport() {
        console.group('📊 Performance Report');
        
        const metrics = this.getMetrics();
        Object.entries(metrics).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                console.log(`${key}:`, value);
            } else {
                console.log(`${key}: ${value}`);
            }
        });
        
        console.groupEnd();
    }

    generatePerformanceScore() {
        const lcp = this.getMetric('LCP');
        const fid = this.getMetric('FID');
        const cls = this.getMetric('CLS');
        const pageLoad = this.getMetric('pageLoad');
        
        let score = 100;
        
        if (lcp) {
            const lcpScore = lcp.rating === 'good' ? 0 : lcp.rating === 'needs-improvement' ? -10 : -25;
            score += lcpScore;
        }
        
        if (fid) {
            const fidScore = fid.rating === 'good' ? 0 : fid.rating === 'needs-improvement' ? -5 : -15;
            score += fidScore;
        }
        
        if (cls) {
            const clsScore = cls.rating === 'good' ? 0 : cls.rating === 'needs-improvement' ? -5 : -15;
            score += clsScore;
        }
        
        if (pageLoad) {
            const loadScore = pageLoad.rating === 'excellent' ? 5 : 
                            pageLoad.rating === 'good' ? 0 : 
                            pageLoad.rating === 'fair' ? -10 : -20;
            score += loadScore;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    dispatchPerformanceEvent(eventName, detail = {}) {
        const event = new CustomEvent(`performance${eventName}`, {
            detail: {
                ...detail,
                metrics: this.getMetrics(),
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    // Cleanup
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.metrics.clear();
    }
}