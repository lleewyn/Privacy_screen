// Hotkeys Handler (Renderer Process)
const { ipcRenderer } = require('electron');

// Listen for hotkey events from main process
ipcRenderer.on('increase-size', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newSize = Math.min(settings.spotlightSize + 20, 500);

    window.spotlightRenderer.updateSize(newSize);

    // Update UI
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    sizeSlider.value = newSize;
    sizeValue.textContent = `${newSize}px`;

    // Update slider background
    const value = ((sizeSlider.value - sizeSlider.min) / (sizeSlider.max - sizeSlider.min)) * 100;
    sizeSlider.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

    showHotkeyFeedback(`📏 Kích thước: ${newSize}px`);
});

ipcRenderer.on('decrease-size', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newSize = Math.max(settings.spotlightSize - 20, 50);

    window.spotlightRenderer.updateSize(newSize);

    // Update UI
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');
    sizeSlider.value = newSize;
    sizeValue.textContent = `${newSize}px`;

    // Update slider background
    const value = ((sizeSlider.value - sizeSlider.min) / (sizeSlider.max - sizeSlider.min)) * 100;
    sizeSlider.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

    showHotkeyFeedback(`📏 Kích thước: ${newSize}px`);
});

ipcRenderer.on('toggle-mode', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';

    window.spotlightRenderer.updateMode(newMode);

    // Update UI
    const darkModeBtn = document.getElementById('darkModeBtn');
    const lightModeBtn = document.getElementById('lightModeBtn');

    if (newMode === 'dark') {
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
        showHotkeyFeedback('🌙 Chế độ tối');
    } else {
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
        showHotkeyFeedback('☀️ Chế độ mờ');
    }
});

// Show hotkey feedback (temporary toast)
function showHotkeyFeedback(message) {
    // Remove existing feedback
    const existing = document.querySelector('.hotkey-feedback');
    if (existing) {
        existing.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'hotkey-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
    z-index: 10000;
    pointer-events: none;
    animation: feedbackFade 1.5s ease-out forwards;
  `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes feedbackFade {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
      20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      80% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
      }
    }
  `;
    document.head.appendChild(style);

    document.body.appendChild(feedback);

    // Remove after animation
    setTimeout(() => {
        feedback.remove();
    }, 1500);
}

// Quit app handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('quit-app');
    }
});
