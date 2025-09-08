// ========================================
// UTILITY FUNCTIONS MODULE
// ========================================

import { portfolioData } from './data.js';

export const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Get all unique technologies from projects
    getAllTechnologies() {
        const allTechs = new Set();
        portfolioData.projects.forEach(project => {
            project.technologies.forEach(tech => allTechs.add(tech));
        });
        return Array.from(allTechs).sort();
    },

    // DOM element helper functions
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        if (content) {
            element.innerHTML = content;
        }
        
        return element;
    },

    // Scroll to element smoothly
    scrollToElement(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const targetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
    },

    // Get element with error handling
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element with selector "${selector}" not found`);
        }
        return element;
    },

    // Format date for display
    formatDate(dateString) {
        if (dateString === 'Present') return dateString;
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    },

    // Animate number counter
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(progress * target);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Deep clone object
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    // Check if user prefers reduced motion
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // Device detection
    isMobile() {
        return window.innerWidth <= 768;
    },

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    isDesktop() {
        return window.innerWidth > 1024;
    },

    // Local storage helpers
    setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getStorageItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }
};

export const svgIcons = {
    GitHub: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.78-1.34-1.78-1.1-.75.08-.74.08-.74 1.21.08 1.85 1.24 1.85 1.24 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.62-2.66-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.78.85 1.24 1.93 1.24 3.25 0 4.62-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.82.58A12 12 0 0012 .297"></path>
    </svg>`,
    
    LinkedIn: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85v5.5H9.52V9h3.41v1.56h.05c.47-.89 1.62-1.8 3.34-1.8 3.57 0 4.23 2.35 4.23 5.4v6.29zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 01-.01 4.12zM7.12 20.45H3.56V9h3.56v11.45z"></path>
    </svg>`,
    
    Twitter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.95 4.57a10 10 0 01-2.82.77 4.93 4.93 0 002.16-2.72 10.14 10.14 0 01-3.13 1.2 4.92 4.92 0 00-8.4 4.48 13.97 13.97 0 01-10.15-5.15 4.92 4.92 0 001.52 6.56 4.9 4.9 0 01-2.23-.62v.06a4.92 4.92 0 003.95 4.82 4.92 4.92 0 01-2.21.08 4.92 4.92 0 004.6 3.41 9.86 9.86 0 01-6.1 2.1A9.89 9.89 0 010 19.54a13.94 13.94 0 007.56 2.21c9.06 0 14.02-7.51 14.02-14.03 0-.21 0-.42-.02-.63a10.02 10.02 0 002.47-2.54z"></path>
    </svg>`
    };

export function getSvgIcon(name) {
  return svgIcons[name] || '';
}
