// Smooth Scrolling & Header Shrink Logic + Animated Nav Reveal
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");
    const header = document.querySelector("header");
    const navList = document.querySelector("nav ul");

    // Smooth scrolling
    navLinks.forEach((link, index) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // adjust for header height
                    behavior: "smooth"
                });
            }
        });
    });

    // Header shrink + animated nav on scroll
    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        if (scrollPos > 50) {
            header.classList.add("shrink");

            // Animate nav links fade-in if not already animated
            if (!navList.classList.contains("revealed")) {
                navList.classList.add("revealed");

                navLinks.forEach((link, i) => {
                    link.style.opacity = "0";
                    link.style.transform = "translateY(-10px)";
                    setTimeout(() => {
                        link.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                        link.style.opacity = "1";
                        link.style.transform = "translateY(0)";
                    }, i * 100); // stagger effect
                });
            }
        } else {
            header.classList.remove("shrink");
            navList.classList.remove("revealed");

            // Reset nav links
            navLinks.forEach(link => {
                link.style.opacity = "";
                link.style.transform = "";
                link.style.transition = "";
            });
        }
    });
});
