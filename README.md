# Privacy Screen - Spotlight Your Focus
> Helps protect your screen and prevent prying eyes!

A modern desktop application designed to enhance privacy and focus by using a "Spotlight" effect. The app highlights the area around your cursor while dimming or blurring the rest of the screen.

---

## Features

- **Professional Spotlight Effect**: Support for both circle and rectangle shapes with full customization.
- **Snipping Tool Mode**: Define your spotlight area by dragging the mouse, similar to the Windows Snipping Tool.
- **Smart Aspect Ratio**: Adjustable slider for rectangle width-to-height ratio.
- **Integrated Pomodoro Timer**: Scientific 25/5 focus intervals to boost productivity.
- **Global Hotkeys (F1-F9)**: Full control of the application without needing to open the settings panel.
- **Dual Overlay Modes**: Switch between Dark (Privacy) and Light (Focus) modes.
- **Modern Control Panel**: Minimalist monochrome interface with System Tray integration.

---

## Global Hotkeys

| Key | Function |
|:---:|---|
| **F1** | Toggle Privacy Screen On/Off |
| **F2** | Increase Spotlight size |
| **F3** | Decrease Spotlight size |
| **F4** | Toggle Dark / Light mode |
| **F5** | Toggle Shape (Circle / Rectangle) |
| **F6** | Cycle Opacity level (20% → 95%) |
| **F7** | Freeze/Unfreeze Spotlight position |
| **F8** | Switch to **Slider** resize mode |
| **F9** | Switch to **Free Resize** (Snipping Tool style) |
| **ESC** | Exit application |

---

## Installation & Development

### Prerequisites
- **Node.js**: Version 16.x or higher.
- **Operating System**: Windows 10/11 recommended.

### Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/lleewyn/Privacy_screen.git
   cd Privacy_screen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm start
   ```

---

## Building & Distribution

To create a standalone `.exe` installer for Windows:

```bash
# Generate installer
npm run dist

# Generate portable directory
npm run build:dir
```

The output will be located in the `dist/` directory.

---

## Technology Stack

- **Electron.js**: Core desktop framework.
- **HTML5 Canvas**: Real-time spotlight rendering.
- **Vanilla JavaScript & CSS**: Performance-optimized UI logic.
- **IPC**: Inter-Process Communication for multi-window sync.

---

## License

This project is licensed under the **MIT License**. Feel free to use, modify, and share it for personal or commercial purposes.

---

**Developed with focus by lleewyn.**
