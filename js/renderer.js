// ========================================
// CONTENT RENDERER MODULE
// ========================================

import { portfolioData } from './data.js';
import { utils } from './utils.js';

export class ContentRenderer {
    constructor() {
        this.data = portfolioData;
        this.init();
    }

    init() {
        this.renderPageTitle();
        this.renderNavigation();
        this.renderHero();
        this.renderAbout();
        this.renderSkills();
        this.renderExperience();
        this.renderProjects();
        this.renderContact();
        this.renderFooter();
        this.updateInitials();
    }

    renderPageTitle() {
        const titleElement = utils.getElement('#pageTitle');
        if (titleElement) {
            titleElement.textContent = `${this.data.personalInfo.name} - ${this.data.personalInfo.title}`;
        }
    }

    updateInitials() {
        const loaderText = utils.getElement('#loaderText');
        const navLogo = utils.getElement('#navLogo');
        const avatarText = utils.getElement('#avatarText');
        
        if (loaderText) loaderText.textContent = this.data.personalInfo.initials;
        if (navLogo) navLogo.textContent = this.data.personalInfo.initials;
        if (avatarText) avatarText.textContent = this.data.personalInfo.initials;
    }

    renderNavigation() {
        const navMenu = utils.getElement('#navMenu');
        if (!navMenu) return;

        navMenu.innerHTML = this.data.navigation.map(item => 
            `<li><a href="${item.href}" class="nav-link">${item.name}</a></li>`
        ).join('');
    }

    renderHero() {
        const heroTitle = utils.getElement('#heroTitle');
        const heroDescription = utils.getElement('#heroDescription');
        const heroButtons = utils.getElement('#heroButtons');

        if (heroTitle) {
            heroTitle.innerHTML = `Hi, I'm <span class="highlight">${this.data.personalInfo.name}</span>`;
        }

        if (heroDescription) {
            heroDescription.textContent = this.data.personalInfo.bio.split('.')[0] + '.';
        }

        if (heroButtons) {
            heroButtons.innerHTML = `
                <a href="#projects" class="btn btn--primary">View My Work</a>
                <a href="#contact" class="btn btn--outline">Get In Touch</a>
            `;
        }
    }

    renderAbout() {
        const aboutText = utils.getElement('#aboutText');
        const aboutStats = utils.getElement('#aboutStats');

        if (aboutText) {
            const paragraphs = this.data.personalInfo.bio.split('. ');
            const firstPara = paragraphs.slice(0, 2).join('. ') + '.';
            const secondPara = paragraphs.slice(2).join('. ');
            
            aboutText.innerHTML = `
                <p class="about-description">${firstPara}</p>
                <p class="about-description">${secondPara}</p>
            `;
        }

        if (aboutStats) {
            aboutStats.innerHTML = this.data.aboutStats.map(stat => `
                <div class="stat">
                    <div class="stat-number" data-count="${stat.number.replace('+', '')}">${stat.number}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
        }
    }

    renderSkills() {
        const skillsContent = utils.getElement('#skillsContent');
        if (!skillsContent) return;

        skillsContent.innerHTML = Object.entries(this.data.skills).map(([category, skills]) => `
            <div class="skill-category">
                <h3 class="category-title">${category}</h3>
                <div class="skill-items">
                    ${skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-info">
                                <span class="skill-name">${skill.name}</span>
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
        const experienceTimeline = utils.getElement('#experienceTimeline');
        if (!experienceTimeline) return;

        experienceTimeline.innerHTML = this.data.experience.map((exp, index) => `
            <div class="timeline-item" data-aos="fade-up" data-aos-delay="${index * 200}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="job-title">${exp.title}</h3>
                        <div class="company">${exp.company}</div>
                        <div class="period">${exp.startDate} - ${exp.endDate}</div>
                        <div class="location">${exp.location}</div>
                    </div>
                    <ul class="job-description">
                        ${exp.description.map(desc => `<li>${desc}</li>`).join('')}
                    </ul>
                    <div class="tech-tags">
                        ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
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

        const allTechnologies = utils.getAllTechnologies();
        
        projectFilters.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            ${allTechnologies.map(tech => 
                `<button class="filter-btn" data-filter="${tech.toLowerCase()}">${tech}</button>`
            ).join('')}
        `;
    }

    renderProjectGrid() {
        const projectsGrid = utils.getElement('#projectsGrid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = this.data.projects.map((project, index) => `
            <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 200}" data-technologies="${project.technologies.map(t => t.toLowerCase()).join(' ')}">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                
                ${project.features ? `
                    <div class="project-features">
                        <h4>Key Features:</h4>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${project.challenges ? `
                    <div class="project-challenges">
                        <h4>Challenges:</h4>
                        <ul>
                            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-link project-link--primary">GitHub</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="project-link project-link--secondary">Live Demo</a>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderContact() {
        const contactInfo = utils.getElement('#contactInfo');
        if (!contactInfo) return;

        contactInfo.innerHTML = this.data.contact.items.map(item => `
            <div class="contact-item">
                <div class="contact-icon">${item.icon}</div>
                <div class="contact-details">
                    <h4>${item.title}</h4>
                    ${item.link ? 
                        `<a href="${item.link}" ${item.link.startsWith('http') ? 'target="_blank"' : ''}>${item.value}</a>` :
                        `<span>${item.value}</span>`
                    }
                </div>
            </div>
        `).join('');
    }

    renderFooter() {
        const footerContent = utils.getElement('#footerContent');
        if (!footerContent) return;

        footerContent.innerHTML = `
            <p>&copy; ${this.data.footer.copyright}</p>
            <div class="social-links">
                ${this.data.footer.socialLinks.map(link => 
                    `<a href="${link.url}" target="_blank" class="social-link">${link.name}</a>`
                ).join('')}
            </div>
        `;
    }

    // Update data and re-render
    updateData(newData) {
        this.data = { ...this.data, ...newData };
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
            footer: 'renderFooter'
        };

        if (renderMethods[sectionName] && typeof this[renderMethods[sectionName]] === 'function') {
            this[renderMethods[sectionName]]();
        }
    }
}