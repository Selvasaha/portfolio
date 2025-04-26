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
    const themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");

        // Update button text based on theme
        if (document.body.classList.contains("dark-theme")) {
            themeToggleBtn.innerText = "🌞";  // Switch to light mode
        } else {
            themeToggleBtn.innerText = "🌙";  // Switch to dark mode
        }
    });
});
