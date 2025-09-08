// ========================================
// UPDATED DATA.JS - Required for Enhanced Renderer
// ========================================
// This data structure works with the enhanced renderer

const newLocal = {
    personalInfo: {
        name: "Selvaprakash P",
        title: "Software Developer",
        subtitle: "Full Stack Developer & Problem Solver",
        bio: "I am a Software Developer passionate about creating innovative solutions. I have strong experience in both frontend and backend development, particularly in web technologies such as HTML, CSS, JavaScript, ReactJS, Django, and PHP. I also have experience in AI data annotation, which helps me understand the underlying data that drives machine learning models. I am committed to writing clean, efficient, and maintainable code and constantly strive to improve my skills and knowledge.",
        location: "Chennai, Tamil Nadu, India",
        email: "selvaprakash0124@gmail.com",
        linkedin: "https://www.linkedin.com/in/selvaprakash-p/",
        github: "https://github.com/Selvasaha",
        initials: "SP"
    },

    typingTexts: [
        "Software Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Ember.js Developer",
        "Problem Solver"
    ],

    navigation: [
        { name: "Home", href: "#hero" },
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Experience", href: "#experience" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" }
    ],

    // ✨ NEW: Dynamic section configuration
    sections: {
        hero: {
            greeting: "Hi, I'm",
            buttons: [
                { text: "View My Work", href: "#projects", class: "btn--primary" },
                { text: "Get In Touch", href: "#contact", class: "btn--outline" }
            ]
        },
        about: {
            title: "About Me",
            subtitle: "Get to know more about my background and passion",
            content: {
                paragraphs: [
                    "I am a Software Developer passionate about creating innovative solutions. I have strong experience in both frontend and backend development, particularly in web technologies such as HTML, CSS, JavaScript, ReactJS, Django, and PHP.",
                    "I also have experience in AI data annotation, which helps me understand the underlying data that drives machine learning models. I am committed to writing clean, efficient, and maintainable code and constantly strive to improve my skills and knowledge."
                ]
            }
        },
        skills: {
            title: "Skills & Technologies",
            subtitle: "Technologies I work with and my expertise levels"
        },
        experience: {
            title: "Professional Experience",
            subtitle: "My journey in the tech industry"
        },
        projects: {
            title: "Featured Projects",
            subtitle: "Some of my notable work and achievements",
            filterLabels: {
                all: "All Projects",
                python: "Python",
                django: "Django",
                javascript: "JavaScript",
                opencv: "OpenCV",
                ember: "Ember.js"
            }
        },
        contact: {
            title: "Get In Touch",
            subtitle: "Let's work together on your next project"
        }
    },

    // ✨ NEW: Complete contact form configuration
    contactForm: {
        fields: {
            name: {
                label: "Your Name",
                placeholder: "Enter your full name",
                type: "text",
                required: true
            },
            email: {
                label: "Email Address",
                placeholder: "your.email@example.com",
                type: "email",
                required: true
            },
            subject: {
                label: "Subject",
                placeholder: "What's this about?",
                type: "text",
                required: true
            },
            message: {
                label: "Your Message",
                placeholder: "Tell me about your project or inquiry...",
                type: "textarea",
                required: true,
                rows: 5
            }
        },
        submitButton: {
            text: "Send Message",
            loadingText: "Sending...",
            class: "btn--primary btn--full-width"
        }
    },

    // ✨ NEW: UI text and labels
    ui: {
        theme: {
            toggleLabel: "Toggle dark/light theme"
        }
    },

    aboutStats: [
        { number: "12+", label: "Technologies" },
        { number: "2+", label: "Years Experience" },
        { number: "5+", label: "Projects" },
        { number: "3", label: "Companies" }
    ],

    skills: {
        "Programming Languages": [
            { name: "Python", level: 90 },
            { name: "JavaScript", level: 80 },
            { name: "C", level: 70 },
            { name: "Java", level: 65 }
        ],
        "Frontend Technologies": [
            { name: "HTML/CSS", level: 95 },
            { name: "ReactJS", level: 80 },
            { name: "Ember.js", level: 75 },
            { name: "JavaScript", level: 80 }
        ],
        "Backend Technologies": [
            { name: "Django", level: 85 },
            { name: "PHP", level: 80 },
            { name: "Node.js", level: 75 }
        ],
        "Databases & Tools": [
            { name: "MySQL", level: 85 },
            { name: "GitHub", level: 90 },
            { name: "Amazon Sagemaker", level: 75 }
        ]
    },

    experience: [
        {
            id: 1,
            title: "Software Engineer Intern",
            company: "Admindroid",
            location: "Chennai, Tamil Nadu, India",
            startDate: "April 2025",
            endDate: "Present",
            description: [
                "Contributing to the development of innovative software solutions",
                "Working with a variety of technologies to build scalable and efficient applications",
                "Collaborating with cross-functional teams to design, develop, and optimize products"
            ],
            technologies: ["Ember JS", ".NET", "Data Management"]
        },
        {
            id: 2,
            title: "Analyst",
            company: "Objectways Technologies",
            location: "Coimbatore, Tamil Nadu, India",
            startDate: "May 2024",
            endDate: "March 2025",
            description: [
                "Annotated and analyzed AI data for training and feeding into AI systems",
                "Handled diverse types of data, including text, image, video, and audio",
                "Collaborated with cross-functional teams to ensure accurate data processing and system optimization"
            ],
            technologies: ["Python", "Amazon Sagemaker", "Data Analysis"]
        },
        {
            id: 3,
            title: "Data Scientist Intern",
            company: "Digital Garage",
            location: "Coimbatore, Tamil Nadu, India",
            startDate: "Feb 2024",
            endDate: "Apr 2024",
            description: [
                "Interned for 3 months, focusing on data management and protection",
                "Developed expertise in data handling, security, and analysis through collaborative project work"
            ],
            technologies: ["Python", "Data Science", "Data Security"]
        }
    ],

    projects: [
        {
            id: 1,
            title: "Digital Car Parking System",
            description: "Developed a Digital Car Parking System as part of a team using Python and OpenCV, detecting empty parking spaces through real-time video analysis and computer vision techniques to streamline the parking experience.",
            technologies: ["Python", "OpenCV", "Computer Vision"],
            features: [
                "Real-time video analysis",
                "Parking space detection",
                "Automated parking management"
            ],
            challenges: [
                "Integration of real-time video processing",
                "Ensuring high accuracy in space detection"
            ],
            demo: null
        },
        {
            id: 2,
            title: "E-Waste Management System",
            description: "Contributed to the development of an E-Waste Management System, analyzing electronic waste quality using data analysis and categorization techniques. This facilitated efficient allocation to relevant recycling companies for responsible disposal and processing.",
            technologies: ["Python", "Django", "MySQL"],
            features: [
                "Categorization of e-waste",
                "Data analysis for quality assessment",
                "Efficient recycling allocation"
            ],
            challenges: [
                "Handling large datasets",
                "Ensuring timely waste allocation"
            ],
            demo: null
        }
    ],

    contact: {
        items: [
            {
                icon: "📧",
                title: "Email",
                value: "selvaprakash0124@gmail.com",
                link: "mailto:selvaprakash0124@gmail.com"
            },
            {
                icon: "💼",
                title: "LinkedIn",
                value: "selvaprakash-p",
                link: "https://www.linkedin.com/in/selvaprakash-p/"
            },
            {
                icon: "🔗",
                title: "GitHub",
                value: "Selvasaha",
                link: "https://github.com/Selvasaha"
            },
            {
                icon: "📍",
                title: "Location",
                value: "Chennai, Tamil Nadu, India",
                link: null
            }
        ]
    },

    footer: {
        copyright: "2025 Selvaprakash P. All rights reserved.",
        socialLinks: [
            { name: "LinkedIn", url: "https://www.linkedin.com/in/selvaprakash-p/" },
            { name: "GitHub", url: "https://github.com/Selvasaha" }
        ]
    }
};
export const portfolioData = newLocal;
