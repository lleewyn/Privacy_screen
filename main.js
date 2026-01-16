const { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } = require('electron');
const path = require('path');

let spotlightWindow;
let controlsWindow;
let panelWindow;
let tray;

function createSpotlightWindow() {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    spotlightWindow = new BrowserWindow({
        width: width,
        height: height,
        fullscreen: true,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        focusable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Set always on top with highest level
    spotlightWindow.setAlwaysOnTop(true, 'screen-saver');

    // NOTE: Removed setIgnoreMouseEvents to allow free resize mode
    // If you want click-through in slider mode, we need to toggle this dynamically
    // spotlightWindow.setIgnoreMouseEvents(true, { forward: true });

    // Prevent window from being hidden
    spotlightWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    spotlightWindow.loadFile('spotlight.html');

    spotlightWindow.on('closed', () => {
        spotlightWindow = null;
    });
}

function createControlsWindow() {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    controlsWindow = new BrowserWindow({
        width: 80,
        height: 80,
        x: width - 80,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: false,
        resizable: false,
        focusable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Set always on top with highest level to prevent being hidden
    controlsWindow.setAlwaysOnTop(true, 'screen-saver');

    // Prevent window from being hidden when other apps are clicked
    controlsWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    controlsWindow.loadFile('controls-button.html');

    controlsWindow.on('closed', () => {
        controlsWindow = null;
    });
}

function createPanelWindow() {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    panelWindow = new BrowserWindow({
        width: 420,
        height: Math.min(700, height - 100),
        x: width - 430,
        y: 90,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        show: false, // Hidden by default
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Set always on top
    panelWindow.setAlwaysOnTop(true, 'screen-saver');
    panelWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    panelWindow.loadFile('control-panel.html');

    panelWindow.on('closed', () => {
        panelWindow = null;
    });
}

function createTray() {
    const iconPath = path.join(__dirname, 'assets', 'icon.png');
    tray = new Tray(iconPath);
    tray.setToolTip('Privacy Screen');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Hiện Cài đặt',
            click: () => {
                if (panelWindow) panelWindow.show();
            }
        },
        {
            label: 'Bật/Tắt Privacy',
            click: () => {
                if (spotlightWindow) {
                    if (spotlightWindow.isVisible()) spotlightWindow.hide();
                    else spotlightWindow.show();
                }
            }
        },
        {
            label: 'Hiện/Ẩn Nút ⚙️',
            click: () => {
                if (controlsWindow) {
                    if (controlsWindow.isVisible()) controlsWindow.hide();
                    else controlsWindow.show();
                }
            }
        },
        { type: 'separator' },
        { label: 'Thoát', click: () => app.quit() }
    ]);

    tray.setContextMenu(contextMenu);

    // Left click to open settings
    tray.on('click', () => {
        if (panelWindow) panelWindow.show();
    });
}

function registerShortcuts() {
    // Toggle privacy screen (F1)
    globalShortcut.register('F1', () => {
        if (spotlightWindow && controlsWindow) {
            if (spotlightWindow.isVisible()) {
                spotlightWindow.hide();
                controlsWindow.hide();
                if (panelWindow) panelWindow.hide();
            } else {
                spotlightWindow.show();
                controlsWindow.show();
            }
        }
    });

    // Increase spotlight size (F2)
    globalShortcut.register('F2', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('increase-size');
        }
        if (panelWindow) {
            panelWindow.webContents.send('increase-size');
        }
    });

    // Decrease spotlight size (F3)
    globalShortcut.register('F3', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('decrease-size');
        }
        if (panelWindow) {
            panelWindow.webContents.send('decrease-size');
        }
    });

    // Toggle mode (F4)
    globalShortcut.register('F4', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('toggle-mode');
        }
        if (panelWindow) {
            panelWindow.webContents.send('toggle-mode');
        }
    });

    // Toggle shape (F5)
    globalShortcut.register('F5', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('toggle-shape');
        }
        if (panelWindow) {
            panelWindow.webContents.send('toggle-shape');
        }
    });

    // Toggle opacity (F6)
    globalShortcut.register('F6', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('toggle-opacity');
        }
        if (panelWindow) {
            panelWindow.webContents.send('toggle-opacity');
        }
    });

    // Toggle freeze (F7)
    globalShortcut.register('F7', () => {
        if (spotlightWindow) {
            spotlightWindow.webContents.send('toggle-freeze');
        }
        if (panelWindow) {
            panelWindow.webContents.send('toggle-freeze');
        }
    });

    // Toggle resize mode to Slider (F8)
    globalShortcut.register('F8', () => {
        if (panelWindow) {
            panelWindow.webContents.send('set-resize-mode', 'slider');
        }
    });

    // Toggle resize mode to Free (F9)
    globalShortcut.register('F9', () => {
        if (panelWindow) {
            panelWindow.webContents.send('set-resize-mode', 'free');
        }
    });

    // Exit application (ESC)
    globalShortcut.register('Escape', () => {
        app.quit();
    });
}

app.on('ready', () => {
    createSpotlightWindow();
    createControlsWindow();
    createPanelWindow();
    createTray();
    registerShortcuts();
});

// ... existing code ...

ipcMain.on('toggle-floating-button', (event, isVisible) => {
    if (controlsWindow) {
        if (isVisible) controlsWindow.show();
        else controlsWindow.hide();
    }
});

ipcMain.on('show-toast-to-spotlight', (event, message) => {
    if (spotlightWindow) {
        spotlightWindow.webContents.send('show-toast', message);
    }
});

// Toggle mouse events based on resize mode
ipcMain.on('toggle-mouse-events', (event, allowMouseEvents) => {
    if (spotlightWindow) {
        if (allowMouseEvents) {
            // Free mode: Allow mouse events for dragging
            spotlightWindow.setIgnoreMouseEvents(false);
        } else {
            // Slider mode: Click-through
            spotlightWindow.setIgnoreMouseEvents(true, { forward: true });
        }
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (spotlightWindow === null && controlsWindow === null) {
        createSpotlightWindow();
        createControlsWindow();
        createPanelWindow();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// IPC handlers
ipcMain.on('quit-app', () => {
    app.quit();
});

ipcMain.on('toggle-panel', () => {
    if (panelWindow) {
        if (panelWindow.isVisible()) {
            panelWindow.hide();
        } else {
            panelWindow.show();
        }
    }
});

ipcMain.on('close-panel', () => {
    if (panelWindow) {
        panelWindow.hide();
    }
});

ipcMain.on('toggle-privacy', (event, isEnabled) => {
    if (spotlightWindow) {
        if (isEnabled) {
            spotlightWindow.show();
        } else {
            spotlightWindow.hide();
        }
    }
});
