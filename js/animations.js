// ========================================
// ANIMATIONS MODULE
// ========================================

import { portfolioData } from './data.js';
import { utils } from './utils.js';

// ========================================
// TYPING ANIMATION CLASS
// ========================================
export class TypingAnimation {
    constructor(element, texts, speed = 100, deleteSpeed = 50, delay = 2000) {
        this.element = element;
        this.texts = texts || ['Software Developer'];
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delay = delay;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isRunning = false;
        this.timeoutId = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.type();
    }

    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    type() {
        if (!this.isRunning) return;

        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        this.timeoutId = setTimeout(() => this.type(), typeSpeed);
    }

    updateTexts(newTexts) {
        this.texts = newTexts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
    }
}

// ========================================
// SCROLL ANIMATIONS CLASS
// ========================================
export class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observers = new Map();
        this.init();
    }

    init() {
        if (utils.prefersReducedMotion()) {
            this.disableAnimations();
            return;
        }

        this.createObserver();
        this.observeElements();
        this.setupCounterAnimations();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        const elementsToObserve = document.querySelectorAll(
            '.section-header, .about-content, .skill-category, .timeline-item, .project-card, .contact-info, .contact-form'
        );
        
        elementsToObserve.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        if (element.classList.contains('skill-category')) {
            this.animateSkillBars(element);
        }
        
        this.observer.unobserve(element);
    }

    animateSkillBars(skillCategory) {
        const progressBars = skillCategory.querySelectorAll('.skill-progress');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const percentage = bar.getAttribute('data-percentage');
                bar.style.setProperty('--progress-width', percentage + '%');
                bar.classList.add('animated');
            }, index * 200);
        });
    }

    setupCounterAnimations() {
        const aboutSection = utils.getElement('#about');
        if (!aboutSection) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(aboutSection);
        this.observers.set('counter', counterObserver);
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (target) {
                utils.animateCounter(counter, target);
            }
        });
    }

    disableAnimations() {
        // Remove animation styles for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// ========================================
// LOADING ANIMATIONS CLASS
// ========================================
export class LoadingManager {
    constructor() {
        this.loadingScreen = utils.getElement('#loadingScreen');
        this.init();
    }

    init() {
        // Hide loading screen after a delay
        setTimeout(() => {
            this.hideLoading();
        }, 1500);
        
        // Also hide when page is fully loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoading();
            }, 500);
        });
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                this.dispatchLoadingComplete();
            }, 500);
        }
    }

    dispatchLoadingComplete() {
        const event = new CustomEvent('loadingComplete', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }
}

// ========================================
// ANIMATION UTILITIES
// ========================================
export class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        requestAnimationFrame(() => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '1';
        });
    }

    static fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    static slideUp(element, duration = 300) {
        const height = element.offsetHeight;
        element.style.transform = `translateY(${height}px)`;
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }

    static slideDown(element, duration = 300) {
        element.style.transition = `all ${duration}ms ease`;
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    static staggerElements(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    static pulseElement(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// ========================================
// PARALLAX EFFECTS
// ========================================
export class ParallaxManager {
    constructor() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (utils.prefersReducedMotion() || utils.isMobile()) {
            return; // Skip parallax on mobile or if reduced motion preferred
        }

        this.bindEvents();
        this.updateParallax(); // Initial update
    }

    bindEvents() {
        const throttledScroll = utils.throttle(() => {
            this.updateParallax();
        }, 16); // ~60fps

        window.addEventListener('scroll', throttledScroll);
    }

    updateParallax() {
        const scrollY = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ========================================
// HOVER EFFECTS MANAGER
// ========================================
export class HoverEffectsManager {
    constructor() {
        this.init();
    }

    init() {
        if (utils.isMobile()) {
            return; // Skip hover effects on mobile
        }

        this.setupCardHovers();
        this.setupButtonHovers();
        this.setupLinkHovers();
    }

    setupCardHovers() {
        const cards = document.querySelectorAll('.project-card, .timeline-item, .skill-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupButtonHovers() {
        const buttons = document.querySelectorAll('.btn, .filter-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                button.style.transition = 'all 0.2s ease';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    setupLinkHovers() {
        const links = document.querySelectorAll('.nav-link, .social-link');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transition = 'color 0.2s ease';
            });
        });
    }
}