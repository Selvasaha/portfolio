// ========================================
// THEME MANAGEMENT MODULE
// ========================================

import { utils } from './utils.js';

export class ThemeManager {
    constructor() {
        this.themeToggle = utils.getElement('#themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupMediaQueryListener();
    }

    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        return utils.getStorageItem('portfolio-theme');
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        utils.setStorageItem('portfolio-theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon(theme);
        this.dispatchThemeChangeEvent(theme);
    }

    updateThemeIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'light') {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'rotate(0deg) scale(1)';
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'rotate(180deg) scale(0)';
            } else {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'rotate(-180deg) scale(0)';
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'rotate(0deg) scale(1)';
            }
        }

        // Update toggle button state
        if (this.themeToggle) {
            this.themeToggle.classList.toggle('dark', theme === 'dark');
            this.themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });

            // Add keyboard support
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    setupMediaQueryListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only update if user hasn't set a manual preference
            if (!utils.getStorageItem('portfolio-theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            }
        });
    }

    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChange', {
            detail: { theme, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkTheme() {
        return this.currentTheme === 'dark';
    }

    // Reset theme to system preference
    resetToSystemPreference() {
        utils.setStorageItem('portfolio-theme', null);
        const systemTheme = this.getPreferredTheme();
        this.setTheme(systemTheme);
    }

    // Add theme-aware styling to elements
    addThemeClass(element, baseClass) {
        if (!element) return;
        
        const updateClass = (theme) => {
            element.classList.remove(`${baseClass}--light`, `${baseClass}--dark`);
            element.classList.add(`${baseClass}--${theme}`);
        };
        
        // Set initial class
        updateClass(this.currentTheme);
        
        // Listen for theme changes
        document.addEventListener('themeChange', (e) => {
            updateClass(e.detail.theme);
        });
    }
}