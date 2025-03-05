document.addEventListener("DOMContentLoaded", () => {
    // Add neon glow effect on hover for the navigation links
    const links = document.querySelectorAll('header nav ul li a');
    
    links.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.textShadow = "0 0 15px #ff00ff, 0 0 20px #ff00ff";
        });
        link.addEventListener('mouseout', () => {
            link.style.textShadow = "none";
        });
    });

    // Add glowing hover effect on skill cards
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.addEventListener('mouseover', () => {
            skill.style.transform = "scale(1.05)";
            skill.style.boxShadow = "0 15px 50px rgba(0, 255, 255, 0.6)";
        });
        skill.addEventListener('mouseout', () => {
            skill.style.transform = "scale(1)";
            skill.style.boxShadow = "0 5px 20px rgba(0, 255, 255, 0.3)";
        });
    });

    // Smooth scroll effect for navigation
    const scrollLinks = document.querySelectorAll('header nav ul li a');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
});
