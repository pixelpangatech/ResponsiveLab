# ResponsiveLab v3.0
*Test. Preview. Perfect.*

A purely frontend-based web application designed to test how websites look across various device resolutions (mobile, tablet, desktop).

## Features

- **Shareable URLs (Deep Linking)**: The browser's address bar automatically stays in sync with your testing grid. Share the exact configuration of devices and target URLs simply by copying the link!
- **Workspaces & Device Presets**: Save custom combinations of devices to your browser's local storage and load an entire testing grid with a single click.
- **Multi-Device Grid View**: Test multiple devices side-by-side simultaneously. Each device scales smartly to fit the screen.
- **Realistic Device Frames**: Preview your websites inside beautiful CSS-based mockups (iPhone with notch, Desktop with bottom bezel, etc).
- **Auto Proxying**: Bypasses strict browser security headers (`X-Frame-Options`) for external websites transparently by utilizing a public CORS proxy (`corsproxy.io`). No browser extensions required.
- **Smart URL Input**: Automatically formats URLs (e.g., typing `google.com` seamlessly resolves to `https://google.com`).
- **Dark / Light Mode**: Beautiful UI with an instant theme toggle.
- **QR Code Generator**: Generate a QR code of your current test URL to instantly scan and test on a real physical smartphone.
- **Rulers & Guidelines**: Professional workspace environment with background grid and CSS rulers.
- **Responsive Mobile Layout**: Includes a smart slide-in drawer sidebar for managing devices when using the tool on a mobile device or smaller screen.
- **Frontend Only**: Runs entirely on the client side using HTML, CSS, and Vanilla JavaScript. No backend server required!

## Installation & Usage

1. Download or clone this repository.
2. Upload the files (`index.html`, `css/`, `js/`, `images/`) to any web server (like Apache `htdocs` or cPanel `public_html`).
3. Open `index.html` in a modern browser.
4. Add devices to the grid from the sidebar.
5. Type any URL and click **Load URL**.

## Limitations

- Due to the nature of public CORS proxies, some websites with extremely strict Content-Security-Policies or complex relative pathing for assets (fonts, images) may render incorrectly.
- The tool does not store custom sizes across different devices (uses local browser storage).

## Technologies

- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6)

---
*Developed by PixelPanga Tech (2026).*
