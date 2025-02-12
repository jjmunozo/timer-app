let timerInterval;
let timeLeft;
let isRunning = false;
let taskName = '';
let totalTimeWorked = 0;
let countingUp = false;

const levels = [
    { duration: 60, target: 0 },      // 1:00 → 0:00 (cuenta regresiva)
    { duration: 60, target: 300 },    // 1:00 → 5:00 (cuenta progresiva)
    { duration: 300, target: 900 },   // 5:00 → 15:00 (cuenta progresiva)
    { duration: 900, target: 1800 }   // 15:00 → 30:00 (cuenta progresiva)
];

let currentLevel = 0;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay(seconds) {
    const minutes = Math.floor(Math.abs(seconds) / 60);
    const remainingSeconds = Math.abs(seconds) % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function addMessage(message, type = 'normal') {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = message;
    messagesDiv.insertBefore(messageElement, messagesDiv.firstChild);
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    document.getElementById('startBtn').classList.add('hidden');
    document.getElementById('stopBtn').classList.remove('hidden');
    
    if (currentLevel === 0) {
        timeLeft = levels[currentLevel].duration;
        countingUp = false;
    } else {
        timeLeft = levels[currentLevel].duration;
        countingUp = true;
    }
    
    updateDisplay(timeLeft);
    
    timerInterval = setInterval(() => {
        if (countingUp) {
            timeLeft++;
        } else {
            timeLeft--;
        }
        totalTimeWorked++;
        updateDisplay(timeLeft);
        
        const targetReached = countingUp ? 
            timeLeft >= levels[currentLevel].target : 
            timeLeft <= levels[currentLevel].target;
        
        if (targetReached) {
            if (currentLevel < levels.length - 1) {
                currentLevel++;
                switch(currentLevel) {
                    case 1:
                        addMessage(`¡Épico! Trabajaste más que 0 minutos en <span class="task-name">${taskName}</span> — vas ganando 🥇`);
                        timeLeft = 60; // Comenzar desde 1:00
                        countingUp = true;
                        break;
                    case 2:
                        addMessage(`¡Épico! has trabajado 5 minutos en <span class="task-name">${taskName}</span> — eso es más que 1 minuto 😉`);
                        timeLeft = 300; // Comenzar desde 5:00
                        countingUp = true;
                        break;
                    case 3:
                        addMessage(`¡Épico! Has trabajado 15 minutos en <span class="task-name">${taskName}</span> — eso definitivamente es más que 5 🙌`);
                        timeLeft = 900; // Comenzar desde 15:00
                        countingUp = true;
                        break;
                }
            } else {
                stopTimer(true);
                addMessage(`¡Épicoooooooo! 30mins es un montón de minutos más que cero trabajo en <span class="task-name">${taskName}</span> 🎉`, 'epic');
            }
        }
    }, 1000);
}

function stopTimer(completed = false) {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
    
    if (!completed) {
        const totalMinutes = (totalTimeWorked / 60).toFixed(1);
        addMessage(`¡Todo suma! 🎉 Trabajaste ${totalMinutes} minutos en <span class="task-name">${taskName}</span>`, 'success');
    }
    currentLevel = 0;
    totalTimeWorked = 0;
    timeLeft = levels[currentLevel].duration;
    updateDisplay(timeLeft);
}

function initializeTimer() {
    const taskInput = document.getElementById('taskInput');
    const timerContainer = document.getElementById('timerContainer');
    const taskNameInput = document.getElementById('taskName');
    
    taskName = taskNameInput.value.trim();
    if (!taskName) {
        alert('Por favor, ingresa el nombre de la tarea');
        return;
    }
    
    document.getElementById('currentTask').innerHTML = 
        `Estás trabajando en <span class="task-name">${taskName}</span>`;
    taskInput.classList.add('hidden');
    timerContainer.classList.remove('hidden');
    updateDisplay(levels[0].duration);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmTask').addEventListener('click', initializeTimer);
    document.getElementById('taskName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            initializeTimer();
        }
    });
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('stopBtn').addEventListener('click', () => stopTimer(false));
});
