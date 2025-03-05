document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll('header nav ul li a');
    
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70, // Added offset for better visibility
                    behavior: 'smooth'
                });
            }
        });
    });
});
