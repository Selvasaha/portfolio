// ========================================
// NAVIGATION MANAGEMENT MODULE
// ========================================

import { utils } from './utils.js';

export class NavigationManager {
    constructor() {
        this.nav = utils.getElement('#nav');
        this.navToggle = utils.getElement('#navToggle');
        this.navMenu = utils.getElement('#navMenu');
        this.navLinks = [];
        this.sections = [];
        this.currentSection = 'hero';
        this.isScrolling = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
            this.sections = Array.from(document.querySelectorAll('section[id]'));
            this.setupEventListeners();
            this.updateActiveNav();
        }, 100);
    }

    setupEventListeners() {
        this.setupScrollListener();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupKeyboardNavigation();
    }

    setupScrollListener() {
        const throttledScroll = utils.throttle(() => {
            this.handleScroll();
        }, 16); // ~60fps
        
        window.addEventListener('scroll', throttledScroll);
    }

    handleScroll() {
        this.updateNavbarAppearance();
        this.updateActiveNav();
    }

    updateNavbarAppearance() {
        if (!this.nav) return;

        if (window.scrollY > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        if (!this.isScrolling) {
            this.isScrolling = true;
            
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - (this.lastScrollY || 0);
            
            if (scrollDifference > 0 && currentScrollY > 200) {
                // Scrolling down
                this.nav.classList.add('hidden');
            } else {
                // Scrolling up
                this.nav.classList.remove('hidden');
            }
            
            this.lastScrollY = currentScrollY;
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 100);
        }
    }

    setupMobileMenu() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#nav')) {
                    this.closeMobileMenu();
                }
            });

            // Close menu when pressing Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });

            // Close menu when clicking nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
        }
    }

    toggleMobileMenu() {
        const isActive = this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active', isActive);
        document.body.classList.toggle('nav-open', isActive);
        
        // Update aria attributes for accessibility
        this.navToggle.setAttribute('aria-expanded', isActive);
        this.navMenu.setAttribute('aria-hidden', !isActive);
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        
        this.navToggle.setAttribute('aria-expanded', false);
        this.navMenu.setAttribute('aria-hidden', true);
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('href');
                
                if (targetId && targetId.startsWith('#')) {
                    this.scrollToSection(targetId.substring(1));
                }
            });
        });
    }

    scrollToSection(sectionId) {
        const targetSection = utils.getElement(`#${sectionId}`);
        
        if (targetSection) {
            const navHeight = this.nav ? this.nav.offsetHeight : 70;
            const offsetTop = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: Math.max(0, offsetTop),
                behavior: 'smooth'
            });
            
            this.setActiveNav(sectionId);
            this.updateURL(sectionId);
        }
    }

    setupActiveNavigation() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-70px 0px -70px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveNav(entry.target.id);
                    this.updateURL(entry.target.id);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navigate with arrow keys while holding Ctrl/Cmd
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToSection('prev');
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToSection('next');
                        break;
                }
            }
        });
    }

    navigateToSection(direction) {
        const currentIndex = this.sections.findIndex(section => 
            section.id === this.currentSection
        );
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = currentIndex < this.sections.length - 1 ? currentIndex + 1 : 0;
        } else {
            targetIndex = currentIndex > 0 ? currentIndex - 1 : this.sections.length - 1;
        }
        
        const targetSection = this.sections[targetIndex];
        if (targetSection) {
            this.scrollToSection(targetSection.id);
        }
    }

    updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            if (section.id) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.id;
                }
            }
        });

        if (current && current !== this.currentSection) {
            this.setActiveNav(current);
        }
    }

    setActiveNav(sectionId) {
        this.currentSection = sectionId;
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Dispatch navigation change event
        this.dispatchNavigationChangeEvent(sectionId);
    }

    updateURL(sectionId) {
        const newURL = `${window.location.pathname}${window.location.search}#${sectionId}`;
        window.history.replaceState(null, null, newURL);
    }

    dispatchNavigationChangeEvent(sectionId) {
        const event = new CustomEvent('navigationChange', {
            detail: { 
                section: sectionId, 
                timestamp: Date.now() 
            }
        });
        document.dispatchEvent(event);
    }

    // Public methods
    getCurrentSection() {
        return this.currentSection;
    }

    goToSection(sectionId) {
        this.scrollToSection(sectionId);
    }

    isMenuOpen() {
        return this.navToggle?.classList.contains('active') || false;
    }

    // Handle browser back/forward buttons
    handlePopState() {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== this.currentSection) {
            const targetElement = utils.getElement(`#${hash}`);
            if (targetElement) {
                this.scrollToSection(hash);
            }
        }
    }

    // Initialize URL handling
    initializeURL() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            setTimeout(() => {
                this.scrollToSection(hash);
            }, 500); // Wait for page to load
        }

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handlePopState();
        });
    }

    // Cleanup
    destroy() {
        // Remove event listeners if needed
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('popstate', this.handlePopState);
    }
}