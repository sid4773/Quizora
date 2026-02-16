const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");

function openModal() {
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeModal() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
        closeModal();
    }
});