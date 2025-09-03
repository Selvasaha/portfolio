// ========================================
// MAIN APPLICATION MODULE
// ========================================
// Coordinates all modules and initializes the application

import { portfolioData } from './data.js';
import { utils } from './utils.js';
import { ContentRenderer } from './renderer.js';
import { ThemeManager } from './theme.js';
import { TypingAnimation, ScrollAnimations, LoadingManager, HoverEffectsManager } from './animations.js';
import { ProjectFilter } from './filters.js';
import { NavigationManager } from './navigation.js';
import { ContactFormManager } from './forms.js';
import { PerformanceMonitor } from './performance.js';

class PortfolioApp {
    constructor() {
        this.data = portfolioData;
        this.modules = new Map();
        this.isInitialized = false;
        this.initStartTime = performance.now();
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Portfolio Application...');
            
            // Wait for DOM to be ready
            await this.waitForDOMReady();
            
            // Initialize modules in sequence
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Mark as initialized
            this.isInitialized = true;
            
            const initTime = performance.now() - this.initStartTime;
            console.log(`✅ Portfolio Application initialized in ${initTime.toFixed(2)}ms`);
            
            // Dispatch ready event
            this.dispatchReadyEvent();
            
        } catch (error) {
            console.error('❌ Failed to initialize Portfolio Application:', error);
            this.handleInitializationError(error);
        }
    }

    waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeModules() {
        console.log('📦 Initializing modules...');
        
        // 1. Performance monitoring (should be first)
        console.log('📊 Initializing performance monitor...');
        this.modules.set('performance', new PerformanceMonitor());
        
        // 2. Content renderer (structure)
        console.log('🎨 Rendering content...');
        this.modules.set('renderer', new ContentRenderer());
        
        // 3. Theme manager (appearance)
        console.log('🎭 Initializing theme system...');
        this.modules.set('theme', new ThemeManager());
        
        // 4. Loading manager
        console.log('⏳ Initializing loading manager...');
        this.modules.set('loading', new LoadingManager());
        
        // 5. Navigation manager
        console.log('🧭 Initializing navigation...');
        this.modules.set('navigation', new NavigationManager());
        
        // Wait for content to render
        await this.delay(200);
        
        // 6. Animations (after content is rendered)
        console.log('✨ Setting up animations...');
        this.modules.set('scrollAnimations', new ScrollAnimations());
        this.modules.set('hoverEffects', new HoverEffectsManager());
        
        // 7. Project filters
        console.log('🔍 Initializing project filters...');
        this.modules.set('projectFilter', new ProjectFilter());
        
        // 8. Contact form
        console.log('📝 Initializing contact form...');
        this.modules.set('contactForm', new ContactFormManager());
        
        // 9. Typing animation
        console.log('⌨️ Starting typing animation...');
        this.initializeTypingAnimation();
        
        console.log('✅ All modules initialized');
    }

    initializeTypingAnimation() {
        const typingElement = utils.getElement('#typingText');
        if (typingElement && this.data.typingTexts) {
            const typingAnimation = new TypingAnimation(
                typingElement, 
                this.data.typingTexts,
                100, // typing speed
                50,  // delete speed
                2000 // pause delay
            );
            typingAnimation.start();
            this.modules.set('typingAnimation', typingAnimation);
        }
    }

    setupGlobalEventListeners() {
        // Window resize handler
        const resizeHandler = utils.debounce(() => {
            this.handleWindowResize();
        }, 250);
        window.addEventListener('resize', resizeHandler);
        
        // Handle browser back/forward navigation
        window.addEventListener('popstate', () => {
            const navigation = this.modules.get('navigation');
            if (navigation) {
                navigation.handlePopState();
            }
        });
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const navigation = this.modules.get('navigation');
            if (navigation) {
                navigation.handlePopState();
            }
        });
        
        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleGlobalError(e.error);
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });
    }

    handleWindowResize() {
        const currentDeviceType = utils.isMobile() ? 'mobile' : 
                                 utils.isTablet() ? 'tablet' : 'desktop';
        
        if (currentDeviceType !== this.deviceType) {
            this.deviceType = currentDeviceType;
            document.body.className = document.body.className.replace(/device-\w+/g, '');
            document.body.classList.add(`device-${currentDeviceType}`);
            
            console.log(`📱 Device type changed to: ${currentDeviceType}`);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👀 Page is now hidden');
            // Pause non-essential animations
            const typingAnimation = this.modules.get('typingAnimation');
            if (typingAnimation && typingAnimation.stop) {
                typingAnimation.stop();
            }
        } else {
            console.log('👀 Page is now visible');
            // Resume animations
            const typingAnimation = this.modules.get('typingAnimation');
            if (typingAnimation && typingAnimation.start) {
                typingAnimation.start();
            }
        }
    }

    handleGlobalError(error) {
        // Log error for debugging
        console.error('Application error:', error);
        
        // Could send to error tracking service here
        // Example: Sentry.captureException(error);
        
        // Show user-friendly message for critical errors
        if (error.message.includes('network') || error.message.includes('fetch')) {
            this.showNotification('Network error occurred. Please check your connection.', 'error');
        }
    }

    handleGlobalKeydown(event) {
        // Handle accessibility shortcuts
        if (event.altKey && event.key === '1') {
            // Skip to main content
            const main = utils.getElement('main') || utils.getElement('#hero');
            if (main) {
                main.focus();
                main.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Handle Escape key globally
        if (event.key === 'Escape') {
            // Close any open modals or menus
            const navigation = this.modules.get('navigation');
            if (navigation && navigation.isMenuOpen()) {
                navigation.closeMobileMenu();
            }
        }
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = utils.createElement('div', {
            className: `notification notification--${type}`,
            innerHTML: `
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close" aria-label="Close notification">&times;</button>
                </div>
            `,
            role: 'alert'
        });
        
        document.body.appendChild(notification);
        
        // Show with animation
        requestAnimationFrame(() => {
            notification.classList.add('notification--show');
        });
        
        // Auto remove
        const autoRemove = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    handleInitializationError(error) {
        console.error('Initialization error details:', error);
        
        // Hide loading screen
        const loadingScreen = utils.getElement('#loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Show error message
        const errorContainer = utils.createElement('div', {
            className: 'error-container',
            innerHTML: `
                <div class="error-message">
                    <h2>Oops! Something went wrong</h2>
                    <p>We're having trouble loading the portfolio. Please try refreshing the page.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">
                        <i class="fas fa-refresh"></i> Refresh Page
                    </button>
                </div>
            `
        });
        
        document.body.appendChild(errorContainer);
    }

    dispatchReadyEvent() {
        const event = new CustomEvent('portfolioReady', {
            detail: {
                timestamp: Date.now(),
                modules: this.getModuleStatus(),
                data: this.data,
                initTime: performance.now() - this.initStartTime
            }
        });
        
        document.dispatchEvent(event);
        console.log('🎉 Portfolio ready event dispatched');
    }

    getModuleStatus() {
        const status = {};
        this.modules.forEach((module, name) => {
            status[name] = {
                loaded: !!module,
                type: module.constructor.name
            };
        });
        return status;
    }

    // Utility delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API methods
    
    static getInstance() {
        if (!PortfolioApp.instance) {
            PortfolioApp.instance = new PortfolioApp();
        }
        return PortfolioApp.instance;
    }

    updateData(newData) {
        this.data = { ...this.data, ...newData };
        
        // Update renderer with new data
        const renderer = this.modules.get('renderer');
        if (renderer) {
            renderer.updateData(this.data);
        }
        
        // Update typing animation texts
        const typingAnimation = this.modules.get('typingAnimation');
        if (typingAnimation && newData.typingTexts) {
            typingAnimation.updateTexts(newData.typingTexts);
        }
        
        console.log('📝 Portfolio data updated');
    }

    getData() {
        return this.data;
    }

    isReady() {
        return this.isInitialized;
    }

    getModule(moduleName) {
        return this.modules.get(moduleName);
    }

    // Performance methods
    getPerformanceMetrics() {
        const performanceMonitor = this.modules.get('performance');
        return performanceMonitor ? performanceMonitor.getMetrics() : {};
    }

    logPerformanceReport() {
        const performanceMonitor = this.modules.get('performance');
        if (performanceMonitor) {
            performanceMonitor.logPerformanceReport();
        }
    }

    // Theme methods
    setTheme(theme) {
        const themeManager = this.modules.get('theme');
        if (themeManager) {
            themeManager.setTheme(theme);
        }
    }

    getCurrentTheme() {
        const themeManager = this.modules.get('theme');
        return themeManager ? themeManager.getCurrentTheme() : 'light';
    }

    // Navigation methods
    goToSection(sectionId) {
        const navigationManager = this.modules.get('navigation');
        if (navigationManager) {
            navigationManager.goToSection(sectionId);
        }
    }

    getCurrentSection() {
        const navigationManager = this.modules.get('navigation');
        return navigationManager ? navigationManager.getCurrentSection() : 'hero';
    }

    // Project filter methods
    filterProjects(filter) {
        const projectFilter = this.modules.get('projectFilter');
        if (projectFilter) {
            projectFilter.setFilter(filter);
        }
    }

    // Cleanup and destroy
    destroy() {
        console.log('🧹 Destroying Portfolio Application...');
        
        // Cleanup all modules
        this.modules.forEach((module, name) => {
            if (module.cleanup) {
                module.cleanup();
            } else if (module.destroy) {
                module.destroy();
            }
            console.log(`Cleaned up ${name} module`);
        });
        
        // Clear modules
        this.modules.clear();
        
        // Reset state
        this.isInitialized = false;
        
        console.log('✅ Portfolio Application destroyed');
    }
}

// Initialize the application
const app = new PortfolioApp();

// Make app globally available for debugging
if (typeof window !== 'undefined') {
    window.PortfolioApp = app;
    window.portfolioData = portfolioData;
    window.portfolioUtils = utils;
}

// Export for module usage
export default app;
export { PortfolioApp };