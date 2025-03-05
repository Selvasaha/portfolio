document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('header nav ul li a');
    
    links.forEach(link => {
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

    // Add dynamic hover effects
    const skills = document.querySelectorAll('.skill');
    skills.forEach(skill => {
        skill.addEventListener('mouseover', () => {
            skill.style.transform = "scale(1.1)";
        });
        skill.addEventListener('mouseout', () => {
            skill.style.transform = "scale(1)";
        });
    });
});
