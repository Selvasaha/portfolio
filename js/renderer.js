// ========================================
// ENHANCED CONTENT RENDERER MODULE
// ========================================
// Fully data-driven content rendering with error handling and validation

import { portfolioData } from './data.js';
import { utils } from './utils.js';

export class ContentRenderer {
    constructor() {
        this.data = portfolioData;
        this.validateData();
        this.init();
    }

    validateData() {
        // Basic validation to ensure required data exists
        if (!this.data) {
            throw new Error('Portfolio data is missing');
        }
        
        if (!this.data.personalInfo) {
            console.warn('Personal info missing from portfolio data');
        }
        
        if (!this.data.sections) {
            console.warn('Sections configuration missing from portfolio data');
        }
    }

    init() {
        try {
            this.renderPageTitle();
            this.renderNavigation();
            this.renderSectionHeaders();
            this.renderHero();
            this.renderAbout();
            this.renderSkills();
            this.renderExperience();
            this.renderProjects();
            this.renderContact();
            this.renderContactForm();
            this.renderFooter();
            this.updateInitials();
            this.updateThemeLabels();
        } catch (error) {
            console.error('Error rendering content:', error);
            this.renderErrorFallback();
        }
    }

    renderPageTitle() {
        const titleElement = utils.getElement('#pageTitle');
        if (titleElement && this.data.personalInfo) {
            titleElement.textContent = `${this.data.personalInfo.name} - ${this.data.personalInfo.title}`;
        }
    }

    updateInitials() {
        const elements = {
            loaderText: utils.getElement('#loaderText'),
            navLogo: utils.getElement('#navLogo'),
            avatarText: utils.getElement('#avatarText')
        };
        
        const initials = this.data.personalInfo?.initials;
        
        Object.values(elements).forEach(element => {
            if (element) element.textContent = initials;
        });
    }

    updateThemeLabels() {
        const themeToggle = utils.getElement('#themeToggle');
        if (themeToggle && this.data.ui?.theme) {
            themeToggle.setAttribute('aria-label', this.data.ui.theme.toggleLabel || 'Toggle theme');
        }
    }

    renderSectionHeaders() {
        if (!this.data.sections) return;

        const headerMap = {
            'aboutTitle': this.data.sections.about?.title,
            'aboutSubtitle': this.data.sections.about?.subtitle,
            'skillsTitle': this.data.sections.skills?.title,
            'skillsSubtitle': this.data.sections.skills?.subtitle,
            'experienceTitle': this.data.sections.experience?.title,
            'experienceSubtitle': this.data.sections.experience?.subtitle,
            'projectsTitle': this.data.sections.projects?.title,
            'projectsSubtitle': this.data.sections.projects?.subtitle,
            'contactTitle': this.data.sections.contact?.title,
            'contactSubtitle': this.data.sections.contact?.subtitle
        };

        Object.entries(headerMap).forEach(([elementId, text]) => {
            const element = utils.getElement(`#${elementId}`);
            if (element && text) {
                element.textContent = text;
            }
        });
    }

    renderNavigation() {
        const navMenu = utils.getElement('#navMenu');
        if (!navMenu || !this.data.navigation) return;

        navMenu.innerHTML = this.data.navigation.map(item => 
            `<li><a href="${this.escapeHtml(item.href)}" class="nav-link">${this.escapeHtml(item.name)}</a></li>`
        ).join('');
    }

    renderHero() {
        this.renderHeroTitle();
        this.renderHeroDescription();
        this.renderHeroButtons();
    }

    renderHeroTitle() {
        const heroTitle = utils.getElement('#heroTitle');
        if (!heroTitle) return;

        const greeting = this.data.sections?.hero?.greeting || 'Hi, I\'m';
        const name = this.data.personalInfo?.name || 'Developer';
        
        heroTitle.innerHTML = `${this.escapeHtml(greeting)} <span class="highlight">${this.escapeHtml(name)}</span>`;
    }

    renderHeroDescription() {
        const heroDescription = utils.getElement('#heroDescription');
        if (!heroDescription) return;

        const bio = this.data.personalInfo?.bio || 'Passionate software developer creating innovative solutions.';
        const shortDescription = bio.split('.')[0] + '.';
        
        heroDescription.textContent = shortDescription;
    }

    renderHeroButtons() {
        const heroButtons = utils.getElement('#heroButtons');
        if (!heroButtons) return;

        const buttons = this.data.sections?.hero?.buttons || [
            { text: 'View My Work', href: '#projects', class: 'btn--primary' },
            { text: 'Get In Touch', href: '#contact', class: 'btn--outline' }
        ];

        heroButtons.innerHTML = buttons.map(button => 
            `<a href="${this.escapeHtml(button.href)}" class="btn ${this.escapeHtml(button.class)}">${this.escapeHtml(button.text)}</a>`
        ).join('');
    }

    renderAbout() {
        this.renderAboutText();
        this.renderAboutStats();
    }

    renderAboutText() {
        const aboutText = utils.getElement('#aboutText');
        if (!aboutText) return;

        const content = this.data.sections?.about?.content;
        if (content && content.paragraphs) {
            aboutText.innerHTML = content.paragraphs.map(paragraph => 
                `<p class="about-description">${this.escapeHtml(paragraph)}</p>`
            ).join('');
        } else {
            // Fallback to personal bio
            const bio = this.data.personalInfo?.bio || '';
            const paragraphs = bio.split('. ');
            const firstPara = paragraphs.slice(0, 2).join('. ') + '.';
            const secondPara = paragraphs.slice(2).join('. ');
            
            aboutText.innerHTML = `
                <p class="about-description">${this.escapeHtml(firstPara)}</p>
                <p class="about-description">${this.escapeHtml(secondPara)}</p>
            `;
        }
    }

    renderAboutStats() {
        const aboutStats = utils.getElement('#aboutStats');
        if (!aboutStats || !this.data.aboutStats) return;

        aboutStats.innerHTML = this.data.aboutStats.map(stat => `
            <div class="stat">
                <div class="stat-number" data-count="${this.escapeHtml(stat.number.replace('+', ''))}">${this.escapeHtml(stat.number)}</div>
                <div class="stat-label">${this.escapeHtml(stat.label)}</div>
            </div>
        `).join('');
    }

    renderSkills() {
        const skillsContent = utils.getElement('#skillsContent');
        if (!skillsContent || !this.data.skills) return;

        skillsContent.innerHTML = Object.entries(this.data.skills).map(([category, skills]) => `
            <div class="skill-category">
                <h3 class="category-title">${this.escapeHtml(category)}</h3>
                <div class="skill-items">
                    ${skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-info">
                                <span class="skill-name">${this.escapeHtml(skill.name)}</span>
                                <span class="skill-percentage">${this.escapeHtml(skill.level)}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" data-percentage="${this.escapeHtml(skill.level)}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderExperience() {
        const experienceTimeline = utils.getElement('#experienceTimeline');
        if (!experienceTimeline || !this.data.experience) return;

        experienceTimeline.innerHTML = this.data.experience.map((exp, index) => `
            <div class="timeline-item" data-aos="fade-up" data-aos-delay="${index * 200}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="job-title">${this.escapeHtml(exp.title)}</h3>
                        <div class="company">${this.escapeHtml(exp.company)}</div>
                        <div class="period">${this.escapeHtml(exp.startDate)} - ${this.escapeHtml(exp.endDate)}</div>
                        <div class="location">${this.escapeHtml(exp.location)}</div>
                    </div>
                    <ul class="job-description">
                        ${exp.description.map(desc => `<li>${this.escapeHtml(desc)}</li>`).join('')}
                    </ul>
                    <div class="tech-tags">
                        ${exp.technologies.map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderProjects() {
        this.renderProjectFilters();
        this.renderProjectGrid();
    }

    renderProjectFilters() {
        const projectFilters = utils.getElement('#projectFilters');
        if (!projectFilters) return;

        const filterLabels = this.data.sections?.projects?.filterLabels || {};
        const allTechnologies = utils.getAllTechnologies();
        
        projectFilters.innerHTML = `
            <button class="filter-btn active" data-filter="all">${this.escapeHtml(filterLabels.all || 'All')}</button>
            ${allTechnologies.map(tech => {
                const label = filterLabels[tech.toLowerCase()] || tech;
                return `<button class="filter-btn" data-filter="${this.escapeHtml(tech.toLowerCase())}">${this.escapeHtml(label)}</button>`;
            }).join('')}
        `;
    }

    renderProjectGrid() {
        const projectsGrid = utils.getElement('#projectsGrid');
        if (!projectsGrid || !this.data.projects) return;

        projectsGrid.innerHTML = this.data.projects.map((project, index) => `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 200}" data-technologies="${project.technologies.map(t => t.toLowerCase()).join(' ')}">
                <div class="project-header">
                    <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                
                ${project.features ? `
                    <div class="project-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${this.escapeHtml(feature)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${project.challenges ? `
                    <div class="project-challenges">
                        <h4>Challenges:</h4>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${this.escapeHtml(challenge)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="project-links">
                    ${project.github ? `<a href="${this.escapeHtml(project.github)}" target="_blank" class="project-link project-link--primary">GitHub</a>` : ''}
                    ${project.demo ? `<a href="${this.escapeHtml(project.demo)}" target="_blank" class="project-link project-link--secondary">Live Demo</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderContact() {
        const contactInfo = utils.getElement('#contactInfo');
        if (!contactInfo || !this.data.contact) return;

        contactInfo.innerHTML = this.data.contact.items.map(item => `
            <div class="contact-item">
                <div class="contact-icon">${item.icon}</div>
                <div class="contact-details">
                    <h4>${this.escapeHtml(item.title)}</h4>
                    ${item.link ? 
                        `<a href="${this.escapeHtml(item.link)}" ${item.link.startsWith('http') ? 'target="_blank"' : ''}>${this.escapeHtml(item.value)}</a>` :
                        `<span>${this.escapeHtml(item.value)}</span>`
                    }
                </div>
            </div>
        `).join('');
    }

    renderContactForm() {
        const contactForm = utils.getElement('#contactForm');
        if (!contactForm) return;

        const formConfig = this.data.contactForm;
        if (!formConfig) {
            console.warn('Contact form configuration missing');
            return;
        }

        const fields = formConfig.fields || {};
        const submitButton = formConfig.submitButton || { text: 'Send Message', class: 'btn--primary btn--full-width' };

        contactForm.innerHTML = `
            ${Object.entries(fields).map(([name, field]) => `
                <div class="form-group">
                    <label for="${name}" class="form-label">${this.escapeHtml(field.label)}</label>
                    ${field.type === 'textarea' 
                        ? `<textarea id="${name}" name="${name}" class="form-control" rows="${field.rows || 5}" placeholder="${this.escapeHtml(field.placeholder || '')}" ${field.required ? 'required' : ''}></textarea>`
                        : `<input type="${field.type}" id="${name}" name="${name}" class="form-control" placeholder="${this.escapeHtml(field.placeholder || '')}" ${field.required ? 'required' : ''}>`
                    }
                </div>
            `).join('')}
            <button type="submit" class="btn ${submitButton.class}" data-original-text="${this.escapeHtml(submitButton.text)}" data-loading-text="${this.escapeHtml(submitButton.loadingText || 'Sending...')}">${this.escapeHtml(submitButton.text)}</button>
        `;
    }

    renderFooter() {
        const footerContent = utils.getElement('#footerContent');
        if (!footerContent || !this.data.footer) return;

        footerContent.innerHTML = `
            <p>&copy; ${this.escapeHtml(this.data.footer.copyright)}</p>
            <div class="social-links">
                ${this.data.footer.socialLinks.map(link => 
                    `<a href="${this.escapeHtml(link.url)}" target="_blank" class="social-link">${this.escapeHtml(link.name)}</a>`
                ).join('')}
            </div>
        `;
    }

    renderErrorFallback() {
        const mainContent = utils.getElement('main') || document.body;
        document.title = "Error";
        mainContent.innerHTML = `
        <div class="error-container">
            <div class="error-box">
                <h1>Sorry, something went wrong</h1>
                <p>We're having trouble loading the portfolio content. Please refresh the page.</p>
                <button onclick="location.reload()" class="btn btn--primary">Refresh Page</button>
            </div>
        </div>`;
    }

    // Security helper to prevent XSS
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Update data and re-render
    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.validateData();
        this.init();
    }

    // Render specific section
    renderSection(sectionName) {
        const renderMethods = {
            navigation: 'renderNavigation',
            hero: 'renderHero',
            about: 'renderAbout',
            skills: 'renderSkills',
            experience: 'renderExperience',
            projects: 'renderProjects',
            contact: 'renderContact',
            contactForm: 'renderContactForm',
            footer: 'renderFooter',
            sectionHeaders: 'renderSectionHeaders'
        };

        if (renderMethods[sectionName] && typeof this[renderMethods[sectionName]] === 'function') {
            try {
                this[renderMethods[sectionName]]();
            } catch (error) {
                console.error(`Error rendering ${sectionName}:`, error);
            }
        }
    }

    // Get current data
    getData() {
        return this.data;
    }

    // Check if data is valid
    isDataValid() {
        return !!(this.data && this.data.personalInfo && this.data.sections);
    }
}
