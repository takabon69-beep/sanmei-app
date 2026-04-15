const breathingCircle = document.getElementById('breathing-circle');
const statusText = document.getElementById('status-text');
const timerSeconds = document.getElementById('timer-seconds');
const startBtn = document.getElementById('start-btn');
const instructionText = document.getElementById('instruction');
const settingsPnl = document.getElementById('settings-pnl');
const circleContainer = document.querySelector('.circle-container');
const timerDisplay = document.querySelector('.timer-display');
const progressInfo = document.getElementById('progress-info');

// Inputs
const minutesInput = document.getElementById('minutes-input');
const cyclesInput = document.getElementById('cycles-input');

let appState = 'settings'; // 'settings', 'preparing', 'inhaling', 'exhaling', 'finished'
let secondsRemaining = 10;
let totalCycles = 0;
let completedCycles = 0;
let timerInterval;

function formatProgress() {
    return `あと ${totalCycles - completedCycles} 回`;
}

function updateTimer() {
    if (secondsRemaining > 1) {
        secondsRemaining--;
    } else {
        if (appState === 'preparing') {
            startMainCycle();
        } else if (appState === 'inhaling') {
            startExhale();
        } else if (appState === 'exhaling') {
            completedCycles++;
            if (completedCycles >= totalCycles) {
                finishApp();
                return;
            } else {
                startInhale();
            }
        }
    }
    
    timerSeconds.textContent = secondsRemaining;
    if (appState !== 'preparing' && appState !== 'finished') {
        progressInfo.textContent = formatProgress();
    }
}

function startPreparing() {
    appState = 'preparing';
    settingsPnl.style.display = 'none';
    circleContainer.style.display = 'flex';
    timerDisplay.style.display = 'block';
    
    document.body.classList.add('preparing');
    statusText.textContent = '吐ききって...';
    instructionText.textContent = 'まずは10秒かけて、肺の中を空にしましょう。';
    
    secondsRemaining = 10;
    timerSeconds.textContent = '10';
    breathingCircle.style.transform = 'scale(0.2)';
    
    timerInterval = setInterval(updateTimer, 1000);
}

function startMainCycle() {
    document.body.classList.remove('preparing');
    startInhale();
}

function startInhale() {
    appState = 'inhaling';
    statusText.textContent = '吸って...';
    instructionText.textContent = '鼻からゆっくりと、深く吸い込みます。';
    
    // Reset to small size immediately but with transition off?
    // Actually, transition is 10s. If it's already 0.2, setting 1.1 starts the 10s animation.
    breathingCircle.style.transform = 'scale(1.1)';
    breathingCircle.style.background = 'var(--circle-inhale)';
    breathingCircle.style.boxShadow = '0 0 50px rgba(0, 210, 255, 0.5)';
    secondsRemaining = 10;
    timerSeconds.textContent = '10';
}

function startExhale() {
    appState = 'exhaling';
    statusText.textContent = '吐いて...';
    instructionText.textContent = '口から細く長く、ゆっくりと吐き出します。';
    breathingCircle.style.transform = 'scale(0.2)';
    breathingCircle.style.background = 'var(--circle-exhale)';
    breathingCircle.style.boxShadow = '0 0 50px rgba(166, 193, 238, 0.5)';
    secondsRemaining = 10;
    timerSeconds.textContent = '10';
}

function finishApp() {
    appState = 'finished';
    clearInterval(timerInterval);
    statusText.textContent = '整いました';
    instructionText.textContent = '深呼吸で、心穏やかな一日を。';
    
    progressInfo.textContent = '完了！';
    breathingCircle.style.transform = 'scale(0.5)';
    breathingCircle.style.background = 'linear-gradient(45deg, #84fab0, #8fd3f4)';
    
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'もう一度';
    startBtn.onclick = () => location.reload();
}

function startApp() {
    const mins = parseInt(minutesInput.value);
    const cycs = parseInt(cyclesInput.value);
    const mode = document.querySelector('input[name="mode"]:checked').value;
    
    if (mode === 'minutes') {
        totalCycles = Math.ceil((mins * 60) / 20);
    } else {
        totalCycles = cycs;
    }
    
    completedCycles = 0;
    startBtn.style.display = 'none';
    startPreparing();
}

startBtn.addEventListener('click', startApp);
