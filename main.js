let currentPage = 0;
let score = 0;
const totalPages = 4;
let answers = Array(20).fill(null);
let timer;
let timeLeft = 120; 
let questions = [];

function loadQuestions() {
    fetch('questions.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const questionElements = doc.querySelectorAll('question');

            questionElements.forEach((qElement, index) => {
                const question = {
                    question: qElement.querySelector('text').textContent,
                    type: qElement.getAttribute('type'),
                    options: [],
                    answer: qElement.getAttribute('answer').split(',')
                };

                if (qElement.querySelector('options')) {
                    qElement.querySelectorAll('option').forEach(option => {
                        question.options.push(option.textContent);
                    });
                }

                questions.push(question);
            });

            loadQuiz();
            startTimer();
        });
}

function loadQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    const start = currentPage * 5;
    const end = start + 5;
    const currentQuestions = questions.slice(start, end);

    currentQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `<p><span class="question-number">${start + index + 1}.</span>${q.question}</p>`;

        switch (q.type) {
            case 'radio':
                q.options.forEach(option => {
                    questionDiv.innerHTML += `
                        <label>
                            <input type="radio" name="question${start + index}" value="${option}" ${answers[start + index] === option ? 'checked' : ''}>
                            ${option}
                        </label>`;
                });
                break;
            case 'checkbox':
                q.options.forEach(option => {
                    questionDiv.innerHTML += `
                        <label>
                            <input type="checkbox" name="question${start + index}" value="${option}" ${answers[start + index] && answers[start + index].includes(option) ? 'checked' : ''}>
                            ${option}
                        </label>`;
                });
                break;
            case 'text':
                questionDiv.innerHTML += `<input type="text" name="question${start + index}" value="${answers[start + index] || ''}"><br>`;
                break;
            case 'dropdown':
                const selectElement = document.createElement('select');
                selectElement.name = `question${start + index}`;
                q.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    selectElement.appendChild(optionElement);
                });
                questionDiv.appendChild(selectElement);
                break;
        }

        container.appendChild(questionDiv);
    });

    document.getElementById('prev-btn').style.display = currentPage === 0 ? 'none' : 'inline-block';
    document.getElementById('next-btn').style.display = currentPage === totalPages - 1 ? 'none' : 'inline-block';
    document.getElementById('submit-btn').style.display = currentPage === totalPages - 1 ? 'inline-block' : 'none';
}

function saveAnswers() {
    const start = currentPage * 5;
    for (let i = start; i < start + 5; i++) {
        const inputs = document.getElementsByName(`question${i}`);
        const q = questions[i];
        switch (q.type) {
            case 'radio':
                inputs.forEach(input => {
                    if (input.checked) {
                        answers[i] = input.value;
                    }
                });
                break;
            case 'checkbox':
                answers[i] = [];
                inputs.forEach(input => {
                    if (input.checked) {
                        answers[i].push(input.value);
                    }
                });
                break;
            case 'text':
            case 'dropdown':
                answers[i] = inputs[0].value;
                break;
        }
    }
}

function prevPage() {
    saveAnswers();
    if (currentPage > 0) {
        currentPage--;
        loadQuiz();
    }
}

function nextPage() {
    saveAnswers();
    if (currentPage < totalPages - 1) {
        currentPage++;
        loadQuiz();
    }
}

function submitQuiz() {
    saveAnswers();
    clearInterval(timer);
    score = 0;
    questions.forEach((q, index) => {
        if (q.type === 'radio' || q.type === 'text' || q.type === 'dropdown') {
            if (answers[index] === q.answer[0]) {
                score++;
            }
        } else if (q.type === 'checkbox') {
            if (JSON.stringify(answers[index].sort()) === JSON.stringify(q.answer.sort())) {
                score++;
            }
        }
    });

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('prev-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    document.getElementById('score').innerText = `Your score is: ${score}`;
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').innerText = `Time left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', loadQuestions);
