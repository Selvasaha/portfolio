// ========================================
// ENHANCED CONTENT RENDERER MODULE - UPDATED FOR PROFILE IMAGES
// ========================================
// Fully data-driven content rendering with error handling and validation

import { portfolioData } from './data.js';
import { utils, getSvgIcon } from './utils.js';

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
            this.updateProfileImages(); // Updated method name
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

    // UPDATED: Replace updateInitials with updateProfileImages
    updateProfileImages() {
        const elements = {
            loaderImage: utils.getElement('#loaderImage .loader-img'),
            navLogoImage: utils.getElement('#navLogo .nav-logo-img'),
            avatarImage: utils.getElement('#avatarImage')
        };
        
        const profileImageSrc = this.data.personalInfo?.profileImage || 'profile-image.jpg';
        const initials = this.data.personalInfo?.initials || 'SP';
        const name = this.data.personalInfo?.name || 'Profile';
        
        Object.entries(elements).forEach(([key, element]) => {
            if (element) {
                // Set image source and alt text
                element.src = profileImageSrc;
                element.alt = `${name} - Profile Picture`;
                
                // Add loading state handling
                element.addEventListener('load', () => {
                    element.classList.add('loaded');
                    console.log(`✅ Profile image loaded successfully for ${key}`);
                });
                
                // Add error handling - fallback to initials
                element.addEventListener('error', () => {
                    console.warn(`⚠️ Profile image failed to load for ${key}, showing initials fallback`);
                    const fallbackElement = this.createInitialsFallback(initials, key);
                    element.parentElement.appendChild(fallbackElement);
                    element.style.display = 'none';
                });
                
                // Set data attribute for fallback
                element.parentElement.setAttribute('data-initials', initials);
            }
        });
    }
    
    // NEW: Create fallback initials element when image fails
    createInitialsFallback(initials, elementType) {
        const fallback = utils.createElement('div', {
            className: `image-fallback ${elementType}-fallback`,
            textContent: initials
        });
        
        // Apply appropriate sizing based on element type
        const sizeMap = {
            loaderImage: { 
                width: '60px', 
                height: '60px', 
                fontSize: 'var(--font-size-xl)',
                borderRadius: '50%'
            },
            navLogoImage: { 
                width: '45px', 
                height: '45px', 
                fontSize: 'var(--font-size-lg)',
                borderRadius: '50%'
            },
            avatarImage: { 
                width: '184px', 
                height: '184px', 
                fontSize: '4rem',
                borderRadius: '50%'
            }
        };
        
        const size = sizeMap[elementType] || sizeMap.avatarImage;
        Object.assign(fallback.style, {
            width: size.width,
            height: size.height,
            fontSize: size.fontSize,
            borderRadius: size.borderRadius,
            background: 'var(--color-secondary)',
            border: '2px solid var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-bold)'
        });
        
        return fallback;
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

        navMenu.innerHTML = this.data.navigation.map(item => `
            <li><a href="${item.href}" class="nav-link">${this.escapeHtml(item.name)}</a></li>
        `).join('');
    }

    renderHero() {
        this.renderHeroContent();
        this.renderHeroButtons();
    }

    renderHeroContent() {
        const heroTitle = utils.getElement('#heroTitle');
        const heroDescription = utils.getElement('#heroDescription');

        if (heroTitle && this.data.personalInfo && this.data.sections?.hero) {
            const greeting = this.data.sections.hero.greeting || 'Hi, I\'m';
            const name = this.data.personalInfo.name;
            heroTitle.innerHTML = `${greeting} <span class="highlight">${this.escapeHtml(name)}</span>`;
        }

        if (heroDescription && this.data.personalInfo) {
            heroDescription.textContent = this.data.personalInfo.bio || this.data.personalInfo.subtitle;
        }
    }

    renderHeroButtons() {
        const heroButtons = utils.getElement('#heroButtons');
        if (!heroButtons || !this.data.sections?.hero?.buttons) return;

        heroButtons.innerHTML = this.data.sections.hero.buttons.map(button => `
            <a href="${button.href}" class="btn ${button.class}">
                ${this.escapeHtml(button.text)}
            </a>
        `).join('');
    }

    renderAbout() {
        this.renderAboutText();
        this.renderAboutStats();
    }

    renderAboutText() {
        const aboutText = utils.getElement('#aboutText');
        if (!aboutText) return;

        if (this.data.sections?.about?.content?.paragraphs) {
            // Use structured content if available
            aboutText.innerHTML = this.data.sections.about.content.paragraphs.map(paragraph => 
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
                <div class="stat-number" data-count="${stat.number.replace(/\D/g, '')}">${this.escapeHtml(stat.number)}</div>
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
                                <span class="skill-percentage">${skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" data-percentage="${skill.level}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderExperience() {
        const timeline = utils.getElement('#experienceTimeline');
        if (!timeline || !this.data.experience) return;

        timeline.innerHTML = this.data.experience.map((job, index) => `
            <div class="timeline-item" style="animation-delay: ${index * 0.2}s">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="job-title">${this.escapeHtml(job.title)}</h3>
                        <div class="company">${this.escapeHtml(job.company)}</div>
                        <div class="period">${this.escapeHtml(job.startDate)} - ${this.escapeHtml(job.endDate)}</div>
                        <div class="location">${this.escapeHtml(job.location)}</div>
                    </div>
                    <ul class="job-description">
                        ${job.description.map(item => `<li>${this.escapeHtml(item)}</li>`).join('')}
                    </ul>
                    <div class="tech-tags">
                        ${job.technologies.map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderProjects() {
        this.renderProjectFilters();
        this.renderProjectsGrid();
    }

    renderProjectFilters() {
        const projectFilters = utils.getElement('#projectFilters');
        if (!projectFilters || !this.data.sections?.projects?.filterLabels) return;

        projectFilters.innerHTML = Object.entries(this.data.sections.projects.filterLabels).map(([key, label]) => `
            <button class="filter-btn ${key === 'all' ? 'active' : ''}" data-filter="${key}">
                ${this.escapeHtml(label)}
            </button>
        `).join('');
    }

    renderProjectsGrid() {
        const projectsGrid = utils.getElement('#projectsGrid');
        if (!projectsGrid || !this.data.projects) return;

        projectsGrid.innerHTML = this.data.projects.map(project => `
            <div class="project-card" data-technologies="${project.technologies.map(t => t.toLowerCase()).join(' ')}">
                <div class="project-header">
                    <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${this.escapeHtml(tech)}</span>`).join('')}
                    </div>
                </div>
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                ${project.features ? `
                    <div class="project-features">
                        <h4>Key Features</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${this.escapeHtml(feature)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${project.challenges ? `
                    <div class="project-challenges">
                        <h4>Challenges Solved</h4>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${this.escapeHtml(challenge)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${project.demo ? `
                    <div class="project-links">
                        <a href="${project.demo}" class="project-link project-link--primary" target="_blank" rel="noopener noreferrer">
                            View Demo
                        </a>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    renderContact() {
        const contactInfo = utils.getElement('#contactInfo');
        if (!contactInfo || !this.data.contact?.items) return;

        contactInfo.innerHTML = this.data.contact.items.map(item => `
            <div class="contact-item">
                <div class="contact-icon">${item.icon}</div>
                <div class="contact-details">
                    <h4 class="contact-title">${this.escapeHtml(item.title)}</h4>
                    ${item.link ? `
                        <a href="${item.link}" class="contact-value" ${item.link.startsWith('mailto:') || item.link.startsWith('tel:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>
                            ${this.escapeHtml(item.value)}
                        </a>
                    ` : `
                        <span class="contact-value">${this.escapeHtml(item.value)}</span>
                    `}
                </div>
            </div>
        `).join('');
    }

    renderContactForm() {
        const contactForm = utils.getElement('#contactForm');
        if (!contactForm || !this.data.contactForm) return;

        const fields = this.data.contactForm.fields || {};
        const submitBtn = this.data.contactForm.submitButton || {};

        contactForm.innerHTML = `
            ${Object.entries(fields).map(([fieldName, field]) => `
                <div class="form-group">
                    <label for="${fieldName}" class="form-label">
                        ${this.escapeHtml(field.label)}${field.required ? ' *' : ''}
                    </label>
                    ${field.type === 'textarea' ? `
                        <textarea 
                            id="${fieldName}" 
                            name="${fieldName}" 
                            class="form-control" 
                            placeholder="${this.escapeHtml(field.placeholder || '')}"
                            ${field.required ? 'required' : ''}
                            ${field.rows ? `rows="${field.rows}"` : ''}
                            maxlength="1000"
                        ></textarea>
                    ` : `
                        <input 
                            type="${field.type || 'text'}" 
                            id="${fieldName}" 
                            name="${fieldName}" 
                            class="form-control" 
                            placeholder="${this.escapeHtml(field.placeholder || '')}"
                            ${field.required ? 'required' : ''}
                            maxlength="100"
                        />
                    `}
                </div>
            `).join('')}
            <button type="submit" class="btn ${submitBtn.class || 'btn--primary btn--full-width'}">
                ${this.escapeHtml(submitBtn.text || 'Send Message')}
            </button>
        `;
    }

    renderFooter() {
        const footerContent = utils.getElement('#footerContent');
        if (!footerContent || !this.data.footer) return;

        footerContent.innerHTML = `
        <p>&copy; ${this.escapeHtml(this.data.footer.copyright)}</p>
        <div class="social-links">
            ${this.data.footer.socialLinks.map(link => {
                const name = this.escapeHtml(link.name);
                const url  = this.escapeHtml(link.url);
                const icon = getSvgIcon(link.name);
                return `
                    <a href="${url}" target="_blank" class="social-link" aria-label="${name}">
                        ${icon}
                        <span class="sr-only">${name}</span>
                    </a>
                `;
            }).join('')}
        </div>`;
    }

    renderErrorFallback() {
        const mainContent = utils.getElement('main') || document.body;
        document.title = "Error";
        mainContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center;">
                <div>
                    <h1>Oops! Something went wrong</h1>
                    <p>We're having trouble loading the portfolio content. Please refresh the page.</p>
                    <button onclick="window.location.reload()" class="btn btn--primary">Refresh Page</button>
                </div>
            </div>
        `;
    }

    // Utility method for HTML escaping
    escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Public methods for dynamic updates
    updatePersonalInfo(newInfo) {
        this.data.personalInfo = { ...this.data.personalInfo, ...newInfo };
        this.updateProfileImages();
        this.renderHero();
    }

    updateProfileImage(newImagePath) {
        if (this.data.personalInfo) {
            this.data.personalInfo.profileImage = newImagePath;
            this.updateProfileImages();
        }
    }

    refreshContent() {
        this.init();
    }
}
