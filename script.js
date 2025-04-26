// Smooth Scrolling Effect for Navigation Links
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 20,
                    behavior: "smooth"
                });
            }
        });
    });

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById("theme-toggle-btn");

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            document.querySelector("header").classList.toggle("dark-theme");
            document.querySelectorAll("nav a").forEach(link => link.classList.toggle("dark-theme"));
            document.querySelectorAll(".project, .experience-item").forEach(item => item.classList.toggle("dark-theme"));
            document.querySelectorAll(".side-bar").forEach(side => side.classList.toggle("dark-theme"));
        });
    }
});
