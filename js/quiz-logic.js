const quizForm = document.getElementById("quizForm");
const select = document.getElementById("quiz-difficulty");
const submitBtn = document.getElementById("submitBtn");
const scoreEl = document.getElementById("score");

let questions = [];
let isLoading = false;
const MAX_RETRIES = 3;

const heading = document.querySelector("#quiz-section h1");
const instructionPara = document.createElement("p");
instructionPara.textContent = "(Select the option that best applies)";

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

async function loadQuiz(level) {

    if (!level || isLoading) return;

    isLoading = true;
    quizForm.innerHTML = "";
    scoreEl.textContent = "";
    submitBtn.style.display = "none";
    instructionPara.remove();
    select.disabled = true;

    if (body.dataset.categories) {
        categories = JSON.parse(document.body.dataset.categories);
    }
    else if (body.dataset.category) {
        categories = [document.body.dataset.category];
    }

    const API_URL =
        `https://the-trivia-api.com/v2/questions?limit=20&categories=${categories.join(",")}&difficulty=${level}`;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            if (attempt > 1) {
                quizForm.innerHTML =
                    `<p>Loading quiz… retry ${attempt - 1}/${MAX_RETRIES}</p>`;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("Network error");

            questions = await res.json();

            if (!questions.length) {
                quizForm.innerHTML = `<p>No questions found.</p>`;
                break;
            }

            shuffleArray(questions);

            quizForm.innerHTML = "";

            questions.forEach((q, index) => {

                const allOptions = [...q.incorrectAnswers, q.correctAnswer];
                shuffleArray(allOptions);

                const div = document.createElement("div");
                div.className = "ques-box";

                div.innerHTML = `
                            <div class="questions">
                                ${index + 1}. ${q.question.text}
                            </div>
                            <div class="options">
                                ${allOptions.map(opt => `
                                    <label>
                                        <input type="radio"
                                               name="q${index}"
                                               value="${opt}">
                                        ${opt}
                                    </label>
                                `).join("")}
                            </div>
                        `;

                quizForm.appendChild(div);
            });

            heading.after(instructionPara);

            select.disabled = false;
            submitBtn.style.display = "block";
            submitBtn.disabled = true;
            isLoading = false;

            return;

        } catch (err) {

            if (attempt === MAX_RETRIES) {
                quizForm.innerHTML =
                    `<p>❌ Unable to load quiz. Please refresh.</p>`;
            }
        }
    }

    select.disabled = false;
    isLoading = false;
}

select.addEventListener("change", function () {
    loadQuiz(this.value);
});

quizForm.addEventListener("change", () => {
    const answered = questions.every((q, i) =>
        document.querySelector(`input[name="q${i}"]:checked`)
    );
    submitBtn.disabled = !answered;
});

submitBtn.addEventListener("click", () => {

    if (!questions.length) return;

    let score = 0;

    questions.forEach((q, index) => {
        const options = document.querySelectorAll(`input[name="q${index}"]`);
        const selected = document.querySelector(`input[name="q${index}"]:checked`);

        options.forEach(option => {
            const label = option.closest("label");

            if (option.value === q.correctAnswer) {
                label.classList.add("correct");
            }

            if (option.checked && option.value !== q.correctAnswer) {
                label.classList.add("wrong");
            }

            option.disabled = true;
        });

        const questionBox = quizForm.querySelectorAll(".ques-box")[index];
        const ans_display = document.createElement("p");
        ans_display.textContent = "Correct answer: " + q.correctAnswer;
        ans_display.classList.add("ans-display");
        questionBox.after(ans_display);

        if (selected && selected.value === q.correctAnswer) {
            score++;
        }
    });

    scoreEl.textContent =
        `Your score: ${score} / ${questions.length}`;

    openModal();

    submitBtn.disabled = true;
});