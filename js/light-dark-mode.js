const toggleBtns = document.querySelectorAll('.toggle-btn');
const body = document.body;

const savedMode = localStorage.getItem('mode');
if (savedMode) {
    body.classList.add(savedMode);
    updateToggleButtons(savedMode);
}

function updateToggleButtons(mode) {
    toggleBtns.forEach(btn => {
        if (mode === 'darkmode') {
            btn.textContent = '🌙';
            btn.classList.remove('light');
            btn.classList.add('dark');
        } else {
            btn.textContent = '🌞';
            btn.classList.remove('dark');
            btn.classList.add('light');
        }
    });
}

toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        body.classList.toggle('darkmode');

        if (body.classList.contains('darkmode')) {
            localStorage.setItem('mode', 'darkmode');
            updateToggleButtons('darkmode');
        } else {
            localStorage.setItem('mode', 'lightmode');
            updateToggleButtons('lightmode');
        }
    });
});