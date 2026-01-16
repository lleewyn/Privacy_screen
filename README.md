# 👁️ Privacy Screen - Spotlight Your Focus

Ứng dụng desktop hiện đại giúp bảo vệ quyền riêng tư và tăng cường sự tập trung khi làm việc hoặc học tập. Bằng cách sử dụng hiệu ứng **Spotlight**, ứng dụng chỉ hiển thị vùng nội dung bạn đang quan tâm, trong khi các phần còn lại sẽ được làm mờ hoặc tối đi.

---

## ✨ Tính năng nổi bật

- 🎯 **Hiệu ứng Spotlight Chuyên nghiệp**: Hỗ trợ hình tròn và hình chữ nhật với khả năng tùy chỉnh linh hoạt.
- ✂️ **Chế độ Snipping Tool (Mới)**: Vẽ vùng chọn trực tiếp trên màn hình bằng cách kéo thả chuột, cực kỳ tự nhiên và nhanh chóng.
- 📏 **Điều chỉnh Tỷ lệ Thông minh**: Thanh trượt điều chỉnh tỷ lệ khung hình (aspect ratio) cho hình chữ nhật.
- ⏱️ **Tích hợp Pomodoro**: Công cụ hỗ trợ phương pháp làm việc tập trung 25/5 chuẩn khoa học.
- ⌨️ **Hệ thống Hotkeys (F1-F9)**: Điều khiển toàn bộ ứng dụng chỉ bằng một phím bấm.
- 🌓 **Dual Mode (Dark/Light)**: Chuyển đổi giữa nền tối (Privacy) và nền mờ (Focus).
- ⚙️ **Control Panel Hiện đại**: Giao diện cài đặt Monochrome sang trọng, hỗ trợ System Tray.

---

## ⌨️ Hệ thống Phím tắt (Hotkeys)

| Phím tắt | Chức năng |
|:---:|---|
| **F1** | 👁️ Bật/Tắt Privacy Screen |
| **F2** | ➕ Tăng kích thước Spotlight |
| **F3** | ➖ Giảm kích thước Spotlight |
| **F4** | 🌗 Đổi chế độ Tối (Dark) / Mờ (Light) |
| **F5** | ▭ Đổi hình dạng (Tròn / Chữ nhật) |
| **F6** | 🎨 Thay đổi độ mờ (20% → 95%) |
| **F7** | ❄️ Đóng băng (Freeze) vị trí Spotlight |
| **F8** | 📏 Chuyển sang chế độ **Slider** (Điều chỉnh tỷ lệ) |
| **F9** | 🔧 Chuyển sang chế độ **Tự kéo** (Snipping Tool style) |
| **ESC** | ❌ Thoát ứng dụng ngay lập tức |

---

## 🚀 Cài đặt & Phát triển

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 16.x trở lên.
- **Hệ điều hành**: Windows 10/11 (Hỗ trợ tốt nhất).

### Các bước cài đặt
1. **Clone dự án**:
   ```bash
   git clone https://github.com/your-username/privacy-screen.git
   cd privacy-screen
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Chạy ứng dụng (Development mode)**:
   ```bash
   npm start
   ```

---

## 📦 Đóng gói & Phát hành

Để tạo file cài đặt `.exe` độc lập cho Windows:

```bash
# Tạo file Setup cài đặt
npm run dist

# Hoặc tạo thư mục chạy ngay (portable)
npm run build:dir
```

Sau khi hoàn tất, file cài đặt sẽ nằm trong thư mục `dist/`.

---

## 🛠️ Công nghệ sử dụng

- **Electron.js**: Framework chính cho ứng dụng desktop.
- **HTML5 Canvas**: Xử lý hiệu ứng spotlight thời gian thực.
- **Vanilla JavaScript & CSS**: Đảm bảo hiệu năng mượt mà và giao diện tối giản.
- **IPC (Inter-Process Communication)**: Xử lý giao tiếp giữa các cửa sổ.

---

## 📄 Giấy phép

Dự án được phát hành dưới giấy phép **MIT**. Bạn hoàn toàn có thể sử dụng, chỉnh sửa và chia sẻ cho mục đích cá nhân hoặc thương mại.

---

**Cảm ơn bạn đã sử dụng Privacy Screen! Chúc bạn có những giờ làm việc tập trung và hiệu quả nhất! 🚀✨**
