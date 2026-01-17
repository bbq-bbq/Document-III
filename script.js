const mathData = {
    'Addition': {
        '1': {
            desc: "Basic sums",
            questions: [
                { q: "12+8", a: 20 }, { q: "8+12", a: 20 }, 
                { q: "13+7", a: 20 }, { q: "7+13", a: 20 }, 
                { q: "14+6", a: 20 }, { q: "6+14", a: 20 }, 
                { q: "6+8", a: 14 }, { q: "8+6", a: 14 }, 
                { q: "3+5", a: 8 }, { q: "5+3", a: 8 }, 
                { q: "5+8", a: 13 }, { q: "8+5", a: 13 }, 
                { q: "250+250", a: 500 }]
        },
    },
    'Subtraction': {
        '1': {
            desc: "Basic differences",
            questions: [{ q: "7-2", a: 5 }, { q: "9-2", a: 7 }]
        },
        '2': {
            desc: "Bridging 10s - Subtract smaller number with 10, then add the 2nd digit of the other og number to that ",
            questions: [{ q: "11-8", a: 3 }, { q: "12-5", a: 7 }, { q: "11-4", a: 7 }]
        },
    },
    'Division': {
        '1': {
            desc: "Basic divisions",
            questions: [
                { q: "5/2", a: 2.5 }]
        },
    }
};

let currentQuestions = [];
let userAnswers = []; // To store results for the final screen
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
    
    if(!mathData[cat]) return;

    Object.keys(mathData[cat]).forEach(sub => {
        const btn = document.createElement('button');
        btn.innerText = sub;
        btn.onclick = () => { 
            window.selectedSub = sub; 
            document.getElementById('sub-desc').innerText = mathData[cat][sub].desc;
            showView('settings-view'); 
        };
        container.appendChild(btn);
    });
    document.getElementById('current-category').innerText = cat;
    showView('subcat-view');
}

function startGame() {
    const data = mathData[window.selectedCat][window.selectedSub];
    currentQuestions = [...data.questions].sort(() => Math.random() - 0.5);
    currentIdx = 0;
    score = 0;
    userAnswers = []; 
    showView('game-view');
    nextQuestion();
}

function nextQuestion() {
    if (currentIdx >= currentQuestions.length) {
        showResults();
        return;
    }

    const qObj = currentQuestions[currentIdx];
    const mode = document.getElementById('mode-select').value;
    const timeLimit = document.getElementById('timer-input').value * 1000;

    document.getElementById('feedback').innerText = ""; 
    const display = document.getElementById('question-display');
    display.innerText = (mode === 'spoken') ? "???" : qObj.q;
    
    if (mode === 'spoken' || mode === 'both') {
        const msg = new SpeechSynthesisUtterance(qObj.q.replace('x', 'times').replace('/', 'divided by'));
        window.speechSynthesis.speak(msg);
    }

    const input = document.getElementById('answer-input');
    input.value = '';
    input.focus();

    clearTimeout(timer);
    timer = setTimeout(() => checkAnswer(true), timeLimit);
}

document.getElementById('answer-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') checkAnswer(false);
});

function checkAnswer(timedOut) {
    clearTimeout(timer);
    const input = document.getElementById('answer-input');
    const userVal = input.value;
    const qObj = currentQuestions[currentIdx];
    const isCorrect = !timedOut && parseFloat(userVal) === qObj.a;

    // Save for review
    userAnswers.push({
        q: qObj.q,
        correctA: qObj.a,
        userA: timedOut ? "Timed Out" : userVal,
        status: isCorrect ? '✅' : '❌'
    });

    if (isCorrect) {
        score++;
        document.getElementById('feedback').innerText = "✅";
    } else {
        document.getElementById('feedback').innerText = "❌";
    }

    currentIdx++;
    setTimeout(nextQuestion, 600);
}

function showResults() {
    document.getElementById('score-display').innerText = `Score: ${score}/${currentQuestions.length}`;
    const reviewDiv = document.getElementById('review-list');
    reviewDiv.innerHTML = userAnswers.map(item => `
        <div class="review-item ${item.status === '✅' ? 'correct' : 'wrong'}">
            <span>${item.q} = ${item.correctA}</span>
            <span>Your ans: ${item.userA} ${item.status}</span>
        </div>
    `).join('');
    showView('results-view');
}


