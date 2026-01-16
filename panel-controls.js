// Controls Panel Logic
const { ipcRenderer } = require('electron');
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

// Close button - hide panel window
closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-panel');
});

// Privacy toggle
const privacyToggle = document.getElementById('privacyToggle');
const privacyStatus = document.getElementById('privacyStatus');

privacyToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        privacyStatus.textContent = 'Đang bật';
        ipcRenderer.send('toggle-privacy', true);
    } else {
        privacyStatus.textContent = 'Đã tắt';
        ipcRenderer.send('toggle-privacy', false);
    }
});

// Floating button toggle
const floatingButtonToggle = document.getElementById('floatingButtonToggle');
const floatingButtonStatus = document.getElementById('floatingButtonStatus');

floatingButtonToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        floatingButtonStatus.textContent = 'Đang hiện';
        ipcRenderer.send('toggle-floating-button', true);
    } else {
        floatingButtonStatus.textContent = 'Đã ẩn';
        ipcRenderer.send('toggle-floating-button', false);
    }
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
    slider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
}

// Shape buttons
circleBtn.addEventListener('click', () => {
    circleBtn.classList.add('active');
    rectangleBtn.classList.remove('active');

    // Hide aspect ratio slider for circle
    document.getElementById('aspectRatioGroup').style.display = 'none';

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.shape = 'circle';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

rectangleBtn.addEventListener('click', () => {
    rectangleBtn.classList.add('active');
    circleBtn.classList.remove('active');

    // Show aspect ratio slider for rectangle
    document.getElementById('aspectRatioGroup').style.display = 'block';

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.shape = 'rectangle';
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

// Aspect ratio slider
const aspectRatioSlider = document.getElementById('aspectRatioSlider');
const aspectRatioValue = document.getElementById('aspectRatioValue');

aspectRatioSlider.addEventListener('input', (e) => {
    const ratio = parseInt(e.target.value) / 10;
    aspectRatioValue.textContent = `${ratio.toFixed(1)}:1`;

    // Update slider background
    const value = ((aspectRatioSlider.value - aspectRatioSlider.min) / (aspectRatioSlider.max - aspectRatioSlider.min)) * 100;
    aspectRatioSlider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    settings.aspectRatio = ratio;
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
});

// Initialize aspect ratio slider background
const initAspectRatioSlider = () => {
    const value = ((aspectRatioSlider.value - aspectRatioSlider.min) / (aspectRatioSlider.max - aspectRatioSlider.min)) * 100;
    aspectRatioSlider.style.background = `linear-gradient(to right, #000000 0%, #000000 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;

    // Show/hide aspect ratio based on current shape
    const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    if (settings.shape === 'rectangle') {
        document.getElementById('aspectRatioGroup').style.display = 'block';
    } else {
        document.getElementById('aspectRatioGroup').style.display = 'none';
    }
    if (settings.aspectRatio) {
        aspectRatioSlider.value = settings.aspectRatio * 10;
        aspectRatioValue.textContent = `${settings.aspectRatio.toFixed(1)}:1`;
    }
};

initAspectRatioSlider();

// Aspect ratio mode toggle
const sliderModeBtn = document.getElementById('sliderModeBtn');
const freeModeBtn = document.getElementById('freeModeBtn');
const sliderModeControls = document.getElementById('sliderModeControls');

if (sliderModeBtn && freeModeBtn && sliderModeControls) {
    sliderModeBtn.addEventListener('click', () => {
        sliderModeBtn.classList.add('active');
        freeModeBtn.classList.remove('active');
        sliderModeControls.style.display = 'block';

        // Enable click-through (slider mode)
        ipcRenderer.send('toggle-mouse-events', false);

        // Save preference
        const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
        settings.resizeMode = 'slider';
        localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
    });

    freeModeBtn.addEventListener('click', () => {
        freeModeBtn.classList.add('active');
        sliderModeBtn.classList.remove('active');
        sliderModeControls.style.display = 'none';

        // Disable click-through (free mode - allow mouse events)
        ipcRenderer.send('toggle-mouse-events', true);

        // Save preference
        const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
        settings.resizeMode = 'free';
        localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
    });

    // Initialize mode from settings
    const initResizeMode = () => {
        const settings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');

        // Force reset to slider mode (remove this line later if you want to remember user's choice)
        settings.resizeMode = 'slider';
        localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));

        // Default to slider mode
        if (settings.resizeMode === 'free') {
            freeModeBtn.click();
        } else {
            // Always default to slider if not explicitly set to free
            sliderModeBtn.click();
        }
    };

    initResizeMode();
}

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

// Listener for F8/F9 hotkeys to switch resize modes
ipcRenderer.on('set-resize-mode', (event, mode) => {
    if (mode === 'slider' && sliderModeBtn) {
        sliderModeBtn.click();
    } else if (mode === 'free' && freeModeBtn) {
        freeModeBtn.click();
    }
});
