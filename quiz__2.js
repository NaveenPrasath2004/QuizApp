let currentPage = 0;
let score = 0;
const totalPages = 4;
let answers = Array(20).fill(null);
let timer;
let timeLeft = 300;

let questions = [
    {
        "question": "What is the powerhouse of the cell?",
        "type": "radio",
        "options": ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        "answer": "Mitochondria"
    },
    {
        "question": "What is the main component of plant cell walls?",
        "type": "radio",
        "options": ["Cellulose", "Chitin", "Peptidoglycan", "Glycogen"],
        "answer": "Cellulose"
    },
    {
        "question": "What is the function of ribosomes?",
        "type": "radio",
        "options": ["DNA replication", "Protein synthesis", "Lipid metabolism", "Cell division"],
        "answer": "Protein synthesis"
    },
    {
        "question": "Which organelle is responsible for photosynthesis?",
        "type": "radio",
        "options": ["Mitochondria", "Chloroplast", "Golgi apparatus", "Endoplasmic reticulum"],
        "answer": "Chloroplast"
    },
    {
        "question": "What type of bond holds the two strands of DNA together?",
        "type": "radio",
        "options": ["Covalent bonds", "Ionic bonds", "Hydrogen bonds", "Peptide bonds"],
        "answer": "Hydrogen bonds"
    },
    {
        "question": "Which of the following are types of RNA?",
        "type": "checkbox",
        "options": ["mRNA", "tRNA", "rRNA", "cDNA"],
        "answer": ["mRNA", "tRNA", "rRNA"]
    },
    {
        "question": "Which of the following are products of cellular respiration?",
        "type": "checkbox",
        "options": ["Oxygen", "Carbon dioxide", "Water", "Glucose"],
        "answer": ["Carbon dioxide", "Water"]
    },
    {
        "question": "Which of these are characteristics of prokaryotic cells?",
        "type": "checkbox",
        "options": ["No nucleus", "Membrane-bound organelles", "Circular DNA", "Cell wall"],
        "answer": ["No nucleus", "Circular DNA", "Cell wall"]
    },
    {
        "question": "Which of the following are macromolecules?",
        "type": "checkbox",
        "options": ["Proteins", "Lipids", "Carbohydrates", "Water"],
        "answer": ["Proteins", "Lipids", "Carbohydrates"]
    },
    {
        "question": "Which are considered as the building blocks of proteins?",
        "type": "checkbox",
        "options": ["Nucleotides", "Amino acids", "Fatty acids", "Monosaccharides"],
        "answer": ["Amino acids"]
    },
    {
        "question": "What is the primary role of DNA in cells?",
        "type": "text",
        "answer": "Store genetic information"
    },
    {
        "question": "Name the process by which plants make their food.",
        "type": "text",
        "answer": "Photosynthesis"
    },
    {
        "question": "What is the basic unit of life?",
        "type": "text",
        "answer": "Cell"
    },
    {
        "question": "What is the term for the diffusion of water across a semipermeable membrane?",
        "type": "text",
        "answer": "Osmosis"
    },
    {
        "question": "Which biological molecule is primarily responsible for storing energy?",
        "type": "text",
        "answer": "Carbohydrates"
    },
        {
            "question": "Choose the correct order of the stages of mitosis.",
            "type": "dropdown",
            "options": [
                "Prophase, Metaphase, Anaphase, Telophase",
                "Metaphase, Prophase, Anaphase, Telophase",
                "Anaphase, Prophase, Metaphase, Telophase",
                "Telophase, Anaphase, Metaphase, Prophase"
            ],
            "answer": "Prophase, Metaphase, Anaphase, Telophase"
        },
        {
            "question": "Which type of cell division results in gametes?",
            "type": "dropdown",
            "options": [
                "Mitosis",
                "Meiosis",
                "Binary fission",
                "Budding"
            ],
            "answer": "Meiosis"
        },
        {
            "question": "Which process converts glucose into pyruvate?",
            "type": "dropdown",
            "options": [
                "Glycolysis",
                "Krebs cycle",
                "Electron transport chain",
                "Photosynthesis"
            ],
            "answer": "Glycolysis"
        },
        {
            "question": "Which kingdom do mushrooms belong to?",
            "type": "dropdown",
            "options": [
                "Plantae",
                "Animalia",
                "Fungi",
                "Protista"
            ],
            "answer": "Fungi"
        },
        {
            "question": "Which biomolecule are enzymes classified under?",
            "type": "dropdown",
            "options": [
                "Carbohydrates",
                "Lipids",
                "Proteins",
                "Nucleic acids"
            ],
            "answer": "Proteins"
        }
];

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
            if (answers[index] === q.answer) {
                score++;
            }
        } else if (q.type === 'checkbox') {
            if (JSON.stringify(answers[index]) === JSON.stringify(q.answer)) {
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
            document.getElementById('time').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    startTimer();
});
