// Controls Panel Logic
const controlPanel = document.getElementById('controlPanel');
const togglePanelBtn = document.getElementById('togglePanel');
const closeBtn = document.getElementById('closeBtn');

// Sliders
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');

// Shape buttons
const circleBtn = document.getElementById('circleBtn');
const rectangleBtn = document.getElementById('rectangleBtn');

// Mode buttons
const darkModeBtn = document.getElementById('darkModeBtn');
const lightModeBtn = document.getElementById('lightModeBtn');

// Toggle panel visibility - button always stays visible
togglePanelBtn.addEventListener('click', () => {
    controlPanel.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
    controlPanel.classList.remove('active');
});

// Size slider
sizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    sizeValue.textContent = `${size}px`;

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.spotlightSize = size;
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

    updateSliderBackground(sizeSlider);
});

// Opacity slider
opacitySlider.addEventListener('input', (e) => {
    const opacity = parseInt(e.target.value);
    opacityValue.textContent = `${opacity}%`;

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.overlayOpacity = opacity / 100;
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

    updateSliderBackground(opacitySlider);
});

// Update slider background gradient
function updateSliderBackground(slider) {
    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
}

// Shape buttons
circleBtn.addEventListener('click', () => {
    circleBtn.classList.add('active');
    rectangleBtn.classList.remove('active');

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.shape = 'circle';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

rectangleBtn.addEventListener('click', () => {
    rectangleBtn.classList.add('active');
    circleBtn.classList.remove('active');

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.shape = 'rectangle';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

// Mode buttons
darkModeBtn.addEventListener('click', () => {
    darkModeBtn.classList.add('active');
    lightModeBtn.classList.remove('active');

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.mode = 'dark';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

lightModeBtn.addEventListener('click', () => {
    lightModeBtn.classList.add('active');
    darkModeBtn.classList.remove('active');

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.mode = 'light';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

// Quit button
const quitBtn = document.getElementById('quitBtn');
const { ipcRenderer } = require('electron');

quitBtn.addEventListener('click', () => {
    ipcRenderer.send('quit-app');
});

// Initialize UI from saved settings
window.addEventListener('load', () => {
    setTimeout(() => {
        const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{"spotlightSize": 150, "overlayOpacity": 0.8, "shape": "circle", "mode": "dark"}');

        // Update sliders
        sizeSlider.value = settings.spotlightSize || 150;
        sizeValue.textContent = `${settings.spotlightSize || 150}px`;
        updateSliderBackground(sizeSlider);

        opacitySlider.value = (settings.overlayOpacity || 0.8) * 100;
        opacityValue.textContent = `${Math.round((settings.overlayOpacity || 0.8) * 100)}%`;
        updateSliderBackground(opacitySlider);

        // Update shape buttons
        if (settings.shape === 'circle') {
            circleBtn.classList.add('active');
            rectangleBtn.classList.remove('active');
        } else {
            rectangleBtn.classList.add('active');
            circleBtn.classList.remove('active');
        }

        // Update mode buttons
        if (settings.mode === 'dark') {
            darkModeBtn.classList.add('active');
            lightModeBtn.classList.remove('active');
        } else {
            lightModeBtn.classList.add('active');
            darkModeBtn.classList.remove('active');
        }
    }, 100);
});
