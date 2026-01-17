// 1. Define your personal patterns here
const mathData = {
    'Addition': {
        '1': [{ q: "12+8", a: 20 }, { q: "6+8", a: 14 }, { q: "3+5", a: 8 },
            { q: "5+8", a: 13 }, { q: "5+6", a: 11 }, { q: "9+12", a: 21 }
        ],
        '2': [{ q: "250+250", a: 500 }]
    },
    'Subtraction': {
        '1': [{ q: "7-2", a: 5 }, { q: "9-2", a: 7 }],
        '2': [{ q: "11-8", a: 3 }, { q: "12-5", a: 7 }, { q: "11-4", a: 7 }, 
        ],
        '3': [{q: "14-6", a: 8}, {q: "13-6", a: 7},
            {q: "13-7", a: 6}, {q: "12-9", a: 3},
        ],
    },
    'Division': {
        '1': [{ q: "5/2", a: 2.5}]
    }
};

let currentQuestions = [];
let currentIdx = 0;
let score = 0;
let timer;

function showView(viewId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function showSubcats(cat) {
    const container = document.getElementById('subcat-buttons');
    container.innerHTML = '';
    window.selectedCat = cat;
    
    Object.keys(mathData[cat]).forEach(sub => {
        const btn = document.createElement('button');
        btn.innerText = sub;
        btn.onclick = () => { window.selectedSub = sub; showView('settings-view'); };
        container.appendChild(btn);
    });
    document.getElementById('current-category').innerText = cat;
    showView('subcat-view');
}

function startGame() {
    const rawData = mathData[window.selectedCat][window.selectedSub];
    currentQuestions = [...rawData].sort(() => Math.random() - 0.5); // Randomize
    currentIdx = 0;
    score = 0;
    showView('game-view');
    nextQuestion();
}

function nextQuestion() {
    if (currentIdx >= currentQuestions.length) {
        document.getElementById('score-display').innerText = `Score: ${score}/${currentQuestions.length}`;
        showView('results-view');
        return;
    }

    const qObj = currentQuestions[currentIdx];
    const mode = document.getElementById('mode-select').value;
    const timeLimit = document.getElementById('timer-input').value * 1000;

    // Visual/Spoken Logic
    const display = document.getElementById('question-display');
    display.innerText = (mode === 'spoken') ? "???" : qObj.q;
    
    if (mode === 'spoken' || mode === 'both') {
        const msg = new SpeechSynthesisUtterance(qObj.q.replace('x', 'times'));
        window.speechSynthesis.speak(msg);
    }

    const input = document.getElementById('answer-input');
    input.value = '';
    input.focus();

    // Timer Logic
    clearTimeout(timer);
    timer = setTimeout(() => checkAnswer(true), timeLimit);
}

document.getElementById('answer-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkAnswer(false);
});

function checkAnswer(timedOut) {
    clearTimeout(timer);
    const input = document.getElementById('answer-input');
    const correct = parseInt(input.value) === currentQuestions[currentIdx].a;

    if (!timedOut && correct) {
        score++;
        document.getElementById('feedback').innerText = "✓";
    } else {
        document.getElementById('feedback').innerText = "✗";
    }

    currentIdx++;
    setTimeout(nextQuestion, 500); // Short pause before next question
}