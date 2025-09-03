// ========================================
// PROJECT FILTER MODULE
// ========================================

import { utils } from './utils.js';

export class ProjectFilter {
    constructor() {
        this.filterButtons = [];
        this.projectCards = [];
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
            this.projectCards = Array.from(document.querySelectorAll('.project-card'));
            this.bindEvents();
        }, 100);
    }

    bindEvents() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.target.getAttribute('data-filter');
                this.filterProjects(filter);
                this.updateActiveButton(e.target);
            });
        });
    }

    filterProjects(filter) {
        this.activeFilter = filter;
        
        this.projectCards.forEach((card, index) => {
            const technologies = card.getAttribute('data-technologies') || '';
            const shouldShow = filter === 'all' || technologies.includes(filter);
            
            if (shouldShow) {
                this.showCard(card, index);
            } else {
                this.hideCard(card);
            }
        });

        // Dispatch filter change event
        this.dispatchFilterChangeEvent(filter);
    }

    showCard(card, index) {
        card.style.display = 'block';
        
        // Add staggered animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
            card.style.transition = 'all 0.5s ease';
        }, index * 100);
    }

    hideCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    updateActiveButton(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    dispatchFilterChangeEvent(filter) {
        const event = new CustomEvent('projectFilterChange', {
            detail: { 
                filter, 
                visibleProjects: this.getVisibleProjects(),
                timestamp: Date.now() 
            }
        });
        document.dispatchEvent(event);
    }

    getVisibleProjects() {
        return this.projectCards.filter(card => 
            window.getComputedStyle(card).display !== 'none'
        ).length;
    }

    // Public methods
    setFilter(filter) {
        const button = this.filterButtons.find(btn => 
            btn.getAttribute('data-filter') === filter
        );
        
        if (button) {
            this.filterProjects(filter);
            this.updateActiveButton(button);
        }
    }

    getActiveFilter() {
        return this.activeFilter;
    }

    refresh() {
        // Re-initialize after content changes
        this.init();
    }

    // Advanced filtering methods
    filterByMultipleTechnologies(technologies) {
        this.projectCards.forEach((card, index) => {
            const cardTechs = card.getAttribute('data-technologies') || '';
            const hasAllTechnologies = technologies.every(tech => 
                cardTechs.includes(tech.toLowerCase())
            );
            
            if (hasAllTechnologies) {
                this.showCard(card, index);
            } else {
                this.hideCard(card);
            }
        });
    }

    searchProjects(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        this.projectCards.forEach((card, index) => {
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            const technologies = card.getAttribute('data-technologies') || '';
            
            const matches = title.includes(term) || 
                          description.includes(term) || 
                          technologies.includes(term);
            
            if (matches) {
                this.showCard(card, index);
            } else {
                this.hideCard(card);
            }
        });
    }

    sortProjects(sortBy = 'default') {
        const container = document.querySelector('#projectsGrid');
        if (!container) return;

        const cards = Array.from(this.projectCards);
        
        switch (sortBy) {
            case 'title':
                cards.sort((a, b) => {
                    const titleA = a.querySelector('.project-title')?.textContent || '';
                    const titleB = b.querySelector('.project-title')?.textContent || '';
                    return titleA.localeCompare(titleB);
                });
                break;
            case 'technology':
                cards.sort((a, b) => {
                    const techA = a.getAttribute('data-technologies') || '';
                    const techB = b.getAttribute('data-technologies') || '';
                    return techA.localeCompare(techB);
                });
                break;
            default:
                // Keep original order
                break;
        }

        // Reorder DOM elements
        cards.forEach(card => container.appendChild(card));
        
        // Update internal reference
        this.projectCards = cards;
    }

    getFilterStats() {
        const stats = {};
        const allTechs = utils.getAllTechnologies();
        
        stats.total = this.projectCards.length;
        stats.visible = this.getVisibleProjects();
        stats.technologies = {};
        
        allTechs.forEach(tech => {
            stats.technologies[tech] = this.projectCards.filter(card => {
                const technologies = card.getAttribute('data-technologies') || '';
                return technologies.includes(tech.toLowerCase());
            }).length;
        });
        
        return stats;
    }
}