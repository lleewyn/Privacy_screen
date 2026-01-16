// Renderer Process - Spotlight Effect
const canvas = document.getElementById('spotlightCanvas');
const ctx = canvas.getContext('2d');

// Settings (loaded from localStorage or defaults)
let settings = {
    spotlightSize: 150,
    overlayOpacity: 0.8,
    shape: 'circle', // 'circle' or 'rectangle'
    mode: 'dark', // 'dark' or 'light'
    aspectRatio: 3.0, // width to height ratio for rectangle
    isFrozen: false,
    isResizeMode: false,
    isDragging: false, // Track if mouse button is held down
    resizeStartX: 0,
    resizeStartY: 0,
    resizeStartRatio: 3.0,
    resizeStartSize: 150,
    mouseX: 0,
    mouseY: 0
};

// Load settings from localStorage
function loadSettings() {
    const saved = localStorage.getItem('privacyScreenSettings');
    if (saved) {
        const savedSettings = JSON.parse(saved);
        // Only update spotlight settings, not mouse position
        settings.spotlightSize = savedSettings.spotlightSize || settings.spotlightSize;
        settings.overlayOpacity = savedSettings.overlayOpacity || settings.overlayOpacity;
        settings.shape = savedSettings.shape || settings.shape;
        settings.mode = savedSettings.mode || settings.mode;
        settings.aspectRatio = savedSettings.aspectRatio || settings.aspectRatio;
        settings.resizeMode = savedSettings.resizeMode || 'slider';
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('privacyScreenSettings', JSON.stringify(settings));
}

// Initialize canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
    if (!settings.isFrozen) {
        settings.mouseX = e.clientX;
        settings.mouseY = e.clientY;
    }

    // Handle Snipping Tool style dragging
    const savedSettings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    const resizeMode = savedSettings.resizeMode || 'slider';

    if (resizeMode === 'free' && settings.shape === 'rectangle' && settings.isDragging) {
        // Calculate rectangle dimensions from start point to current mouse position
        const width = Math.abs(e.clientX - settings.resizeStartX);
        const height = Math.abs(e.clientY - settings.resizeStartY);

        // Calculate aspect ratio and size
        if (height > 0) {
            settings.aspectRatio = Math.max(1.0, Math.min(5.0, width / height));
        }
        settings.spotlightSize = Math.max(50, Math.min(1000, height));

        // Update center position to be between start and current point
        settings.mouseX = (settings.resizeStartX + e.clientX) / 2;
        settings.mouseY = (settings.resizeStartY + e.clientY) / 2;

        saveSettings();
    }
});

// Mouse down to start Snipping Tool style selection
document.addEventListener('mousedown', (e) => {
    const savedSettings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    const resizeMode = savedSettings.resizeMode || 'slider';

    if (resizeMode === 'free' && settings.shape === 'rectangle') {
        settings.isDragging = true;
        settings.resizeStartX = e.clientX;
        settings.resizeStartY = e.clientY;
        // Don't save start ratio/size, we'll calculate from scratch
    }
});

// Mouse up to finalize selection
document.addEventListener('mouseup', () => {
    if (settings.isDragging) {
        settings.isDragging = false;
        // Keep the final position and size
        saveSettings();
    }
});

// Double-click is no longer needed - resize mode is automatic when 'free' mode is selected
// Keeping this for backwards compatibility but it won't be used
window.addEventListener('dblclick', (e) => {
    // No longer needed
}, true); // Use capture phase

// ESC to reset (optional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Could add reset functionality here if needed
    }
});

// Draw spotlight effect
function drawSpotlight() {
    // Reload settings from localStorage every frame for real-time sync
    loadSettings();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create overlay
    const overlayColor = settings.mode === 'dark'
        ? `rgba(0, 0, 0, ${settings.overlayOpacity})`
        : `rgba(255, 255, 255, ${settings.overlayOpacity})`;

    // Fill entire canvas with overlay
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create spotlight (clear area)
    ctx.globalCompositeOperation = 'destination-out';

    if (settings.shape === 'circle') {
        // Draw circle spotlight
        ctx.beginPath();
        ctx.arc(settings.mouseX, settings.mouseY, settings.spotlightSize, 0, Math.PI * 2);
        ctx.fill();
    } else if (settings.shape === 'rectangle') {
        // Draw rectangle spotlight with adjustable aspect ratio
        const rectWidth = settings.spotlightSize * settings.aspectRatio;
        const rectHeight = settings.spotlightSize;

        // Use actual spotlight dimensions (not drag preview)
        ctx.fillRect(
            settings.mouseX - rectWidth / 2,
            settings.mouseY - rectHeight / 2,
            rectWidth,
            rectHeight
        );
    }

    // Add soft edge (gradient fade)
    ctx.globalCompositeOperation = 'destination-out';
    const gradient = ctx.createRadialGradient(
        settings.mouseX, settings.mouseY, settings.spotlightSize * 0.8,
        settings.mouseX, settings.mouseY, settings.spotlightSize * 1.2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

    ctx.fillStyle = gradient;
    if (settings.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(settings.mouseX, settings.mouseY, settings.spotlightSize * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Draw resize mode indicator (Snipping Tool style)
    const currentSettings = JSON.parse(localStorage.getItem('privacyScreenSettings') || '{}');
    const resizeMode = currentSettings.resizeMode || 'slider';

    if (resizeMode === 'free' && settings.shape === 'rectangle') {
        if (settings.isDragging) {
            // Draw from start point to current mouse position (Snipping Tool style)
            ctx.strokeStyle = 'rgba(0, 150, 255, 0.9)'; // Blue when dragging
            ctx.lineWidth = 3;
            ctx.setLineDash([]);

            const width = Math.abs(settings.mouseX - settings.resizeStartX) * 2;
            const height = Math.abs(settings.mouseY - settings.resizeStartY) * 2;

            ctx.strokeRect(
                settings.mouseX - width / 2,
                settings.mouseY - height / 2,
                width,
                height
            );

            // Draw instruction text
            ctx.fillStyle = 'rgba(0, 150, 255, 1)';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔧 Kéo để tạo vùng chọn... Thả chuột để hoàn thành', settings.mouseX, settings.mouseY - height / 2 - 15);
        } else {
            // Ready to drag - just show text
            const rectWidth = settings.spotlightSize * settings.aspectRatio;
            const rectHeight = settings.spotlightSize;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔧 Click và kéo để tạo vùng chọn (giống Snipping Tool)', settings.mouseX, settings.mouseY - rectHeight / 2 - 15);
        }
    }

    // Request next frame
    requestAnimationFrame(drawSpotlight);
}

// Update spotlight size
function updateSpotlightSize(newSize) {
    settings.spotlightSize = newSize;
    saveSettings();
}

// Update overlay opacity
function updateOverlayOpacity(newOpacity) {
    settings.overlayOpacity = newOpacity / 100;
    saveSettings();
}

// Update shape
function updateShape(newShape) {
    settings.shape = newShape;
    saveSettings();
}

// Update mode
function updateMode(newMode) {
    settings.mode = newMode;
    saveSettings();
}

// Toggle freeze
function toggleFreeze() {
    settings.isFrozen = !settings.isFrozen;
    // When freezing, we just keep the current mouseX/Y which were updated up to the freeze moment.
    saveSettings();
}

// Initialize
window.addEventListener('load', () => {
    loadSettings();
    resizeCanvas();
    drawSpotlight();
});

window.addEventListener('resize', resizeCanvas);

// Export functions for controls.js
window.spotlightRenderer = {
    updateSize: updateSpotlightSize,
    updateOpacity: updateOverlayOpacity,
    updateShape: updateShape,
    updateMode: updateMode,
    toggleFreeze: toggleFreeze,
    getSettings: () => settings
};
