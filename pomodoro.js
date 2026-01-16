// Pomodoro Timer Logic
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Timer state
let timerState = {
    isRunning: false,
    isPaused: false,
    isBreak: false,
    workDuration: 25 * 60, // 25 minutes in seconds
    breakDuration: 5 * 60, // 5 minutes in seconds
    timeRemaining: 25 * 60,
    intervalId: null
};

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    timerDisplay.textContent = formatTime(timerState.timeRemaining);
}

// Start timer
function startTimer() {
    if (timerState.isRunning) return;

    timerState.isRunning = true;
    timerState.isPaused = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerStatus.textContent = timerState.isBreak ? '☕ Đang nghỉ giải lao...' : '🎯 Đang tập trung...';

    timerState.intervalId = setInterval(() => {
        timerState.timeRemaining--;
        updateDisplay();

        if (timerState.timeRemaining <= 0) {
            timerComplete();
        }
    }, 1000);
}

// Pause timer
function pauseTimer() {
    if (!timerState.isRunning) return;

    timerState.isRunning = false;
    timerState.isPaused = true;
    clearInterval(timerState.intervalId);

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerStatus.textContent = '⏸️ Đã tạm dừng';
}

// Reset timer
function resetTimer() {
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.isBreak = false;
    clearInterval(timerState.intervalId);

    timerState.timeRemaining = timerState.workDuration;
    updateDisplay();

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerStatus.textContent = 'Sẵn sàng tập trung!';
}

// Timer complete
function timerComplete() {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;

    if (timerState.isBreak) {
        // Break finished, back to work
        timerState.isBreak = false;
        timerState.timeRemaining = timerState.workDuration;
        timerStatus.textContent = '✅ Hết giờ nghỉ! Sẵn sàng làm việc tiếp?';
        showNotification('Pomodoro Timer', 'Hết giờ nghỉ! Sẵn sàng làm việc tiếp? 💪');
    } else {
        // Work finished, time for break
        timerState.isBreak = true;
        timerState.timeRemaining = timerState.breakDuration;
        timerStatus.textContent = '🎉 Hoàn thành! Nghỉ giải lao nào!';
        showNotification('Pomodoro Timer', 'Hoàn thành! Đã đến giờ nghỉ giải lao! ☕');
    }

    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    // Play sound (optional)
    playNotificationSound();
}

// Show notification
function showNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23667eea"/></svg>'
        });
    }
}

// Play notification sound
function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
