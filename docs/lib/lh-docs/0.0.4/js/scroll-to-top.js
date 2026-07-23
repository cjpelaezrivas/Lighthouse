document.addEventListener("DOMContentLoaded", function () {
    const TOP_OFFSET = 300;
    let lastScrollTop = window.scrollY;

    let scrollToTopBtn = document.getElementById("scrollToTopBtn");

    const checkScroll = () => {
        let currentScroll = window.scrollY;

        if (currentScroll > TOP_OFFSET && currentScroll < lastScrollTop) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }

        lastScrollTop = currentScroll;
    };

    window.addEventListener("scroll", checkScroll);

    scrollToTopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    checkScroll();
});
