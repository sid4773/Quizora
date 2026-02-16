if (!document.body.classList.contains("no-nav-active")) {
    const currentPage = window.location.pathname.split("/").pop() || "home.html";

    document.querySelectorAll("nav .nav-btns a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}