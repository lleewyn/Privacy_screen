// Hotkeys handler for controls window
const { ipcRenderer } = require('electron');

// Listen for hotkey events from main process
ipcRenderer.on('increase-size', () => {
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  if (!sizeSlider || !sizeValue) return;

  const newSize = Math.min(parseInt(sizeSlider.value) + 20, 500);

  sizeSlider.value = newSize;
  sizeValue.textContent = `${newSize}px`;

  // Update slider background (Black theme)
  const value = ((sizeSlider.value - sizeSlider.min) / (sizeSlider.max - sizeSlider.min)) * 100;
  sizeSlider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
  settings.spotlightSize = newSize;
  localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

  // Send toast to spotlight window
  ipcRenderer.send('show-toast-to-spotlight', `📏 Kích thước: ${newSize}px (F2)`);
});

ipcRenderer.on('decrease-size', () => {
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  if (!sizeSlider || !sizeValue) return;

  const newSize = Math.max(parseInt(sizeSlider.value) - 20, 50);

  sizeSlider.value = newSize;
  sizeValue.textContent = `${newSize}px`;

  // Update slider background (Black theme)
  const value = ((sizeSlider.value - sizeSlider.min) / (sizeSlider.max - sizeSlider.min)) * 100;
  sizeSlider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
  settings.spotlightSize = newSize;
  localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

  ipcRenderer.send('show-toast-to-spotlight', `📏 Kích thước: ${newSize}px (F3)`);
});

ipcRenderer.on('toggle-mode', () => {
  const darkModeBtn = document.getElementById('darkModeBtn');
  const lightModeBtn = document.getElementById('lightModeBtn');
  if (!darkModeBtn || !lightModeBtn) return;

  const isDark = darkModeBtn.classList.contains('active');
  const newMode = isDark ? 'light' : 'dark';

  if (newMode === 'dark') {
    darkModeBtn.classList.add('active');
    lightModeBtn.classList.remove('active');
    ipcRenderer.send('show-toast-to-spotlight', '🌙 Chế độ tối (F4)');
  } else {
    lightModeBtn.classList.add('active');
    darkModeBtn.classList.remove('active');
    ipcRenderer.send('show-toast-to-spotlight', '☀️ Chế độ mờ (F4)');
  }

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
  settings.mode = newMode;
  localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

ipcRenderer.on('toggle-shape', () => {
  const circleBtn = document.getElementById('circleBtn');
  const rectangleBtn = document.getElementById('rectangleBtn');
  if (!circleBtn || !rectangleBtn) return;

  const isCircle = circleBtn.classList.contains('active');
  const newShape = isCircle ? 'rectangle' : 'circle';

  if (newShape === 'circle') {
    circleBtn.classList.add('active');
    rectangleBtn.classList.remove('active');
    ipcRenderer.send('show-toast-to-spotlight', '⭕ Hình tròn (F5)');
  } else {
    rectangleBtn.classList.add('active');
    circleBtn.classList.remove('active');
    ipcRenderer.send('show-toast-to-spotlight', '▭ Hình chữ nhật (F5)');
  }

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
  settings.shape = newShape;
  localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

ipcRenderer.on('toggle-opacity', () => {
  const opacitySlider = document.getElementById('opacitySlider');
  const opacityValue = document.getElementById('opacityValue');
  if (!opacitySlider || !opacityValue) return;

  // Cycle through presets: 20 -> 40 -> 60 -> 80 -> 95 -> 20
  const presets = [20, 40, 60, 80, 95];
  const currentValue = parseInt(opacitySlider.value);
  let nextValue = presets[0];

  for (let i = 0; i < presets.length; i++) {
    if (currentValue < presets[i]) {
      nextValue = presets[i];
      break;
    }
    if (i === presets.length - 1) {
      nextValue = presets[0];
    }
  }

  opacitySlider.value = nextValue;
  opacityValue.textContent = `${nextValue}%`;

  // Update slider background (Black theme)
  const value = ((opacitySlider.value - opacitySlider.min) / (opacitySlider.max - opacitySlider.min)) * 100;
  opacitySlider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

  // Save to localStorage
  const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
  settings.overlayOpacity = nextValue / 100;
  localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

  ipcRenderer.send('show-toast-to-spotlight', `🌑 Độ tối: ${nextValue}% (F6)`);
});

ipcRenderer.on('toggle-freeze', () => {
  // Use a global variable to track locally or check state from something? 
  // Actually, we can't easily check renderer state here, so let's just toggle a local flag for feedback
  if (!window.isFrozenLocal) window.isFrozenLocal = false;
  window.isFrozenLocal = !window.isFrozenLocal;

  if (window.isFrozenLocal) {
    ipcRenderer.send('show-toast-to-spotlight', '❄️ Đã khóa vị trí (F7)');
  } else {
    ipcRenderer.send('show-toast-to-spotlight', '🛰️ Đang theo chuột (F7)');
  }
});

// Show hotkey feedback (temporary toast)
function showHotkeyFeedback(message) {
  const existing = document.querySelector('.hotkey-feedback');
  if (existing) {
    existing.remove();
  }

  const feedback = document.createElement('div');
  feedback.className = 'hotkey-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
    color: white;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    z-index: 10000;
    pointer-events: none;
    animation: feedbackFade 1.5s ease-out forwards;
  `;

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

  setTimeout(() => {
    feedback.remove();
  }, 1500);
}
