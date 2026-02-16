const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector("nav");
const backdrop = document.querySelector(".nav-backdrop");

function closeNav() {
    nav.classList.remove("open");
    backdrop.classList.remove("show");
}

hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
    backdrop.classList.toggle("show");
});

backdrop.addEventListener("click", closeNav);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
});