// Hotkeys handler for spotlight window
const { ipcRenderer } = require('electron');

// Listen for hotkey events from main process
ipcRenderer.on('increase-size', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newSize = Math.min(settings.spotlightSize + 20, 500);
    window.spotlightRenderer.updateSize(newSize);
});

ipcRenderer.on('decrease-size', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newSize = Math.max(settings.spotlightSize - 20, 50);
    window.spotlightRenderer.updateSize(newSize);
});

ipcRenderer.on('toggle-mode', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newMode = settings.mode === 'dark' ? 'light' : 'dark';
    window.spotlightRenderer.updateMode(newMode);
});

ipcRenderer.on('toggle-shape', () => {
    const settings = window.spotlightRenderer.getSettings();
    const newShape = settings.shape === 'circle' ? 'rectangle' : 'circle';
    window.spotlightRenderer.updateShape(newShape);
});

ipcRenderer.on('toggle-opacity', () => {
    const settings = window.spotlightRenderer.getSettings();
    // Cycle presets: 0.2 -> 0.4 -> 0.6 -> 0.8 -> 0.95
    const presets = [0.2, 0.4, 0.6, 0.8, 0.95];
    let nextOpacity = presets[0];

    for (let i = 0; i < presets.length; i++) {
        if (settings.overlayOpacity < presets[i] - 0.01) { // small offset for float comparison
            nextOpacity = presets[i];
            break;
        }
        if (i === presets.length - 1) {
            nextOpacity = presets[0];
        }
    }
    window.spotlightRenderer.updateOpacity(nextOpacity * 100);
});

ipcRenderer.on('toggle-freeze', () => {
    window.spotlightRenderer.toggleFreeze();
});

// Show toast notification on spotlight window
function showToast(message) {
    const existing = document.querySelector('.hotkey-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'hotkey-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #000000 0%, #333333 100%);
        color: white;
        padding: 24px 48px;
        border-radius: 20px;
        font-size: 32px;
        font-weight: 700;
        box-shadow: 0 12px 48px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 0.1);
        z-index: 999999;
        pointer-events: none;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        animation: toastFade 1.8s ease-out forwards;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        letter-spacing: 0.5px;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastFade {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
            15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
        }
    `;
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
}

// Listen for toast messages from main process
ipcRenderer.on('show-toast', (event, message) => {
    showToast(message);
});
