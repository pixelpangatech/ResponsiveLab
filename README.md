# ResponsiveLab
*Test. Preview. Perfect.*

A purely frontend-based web application designed to test how websites look across various device resolutions (mobile, tablet, desktop).

## Features

- **Device Presets**: Quickly preview websites on predefined screen sizes (iPhone, Android, iPad, Desktop).
- **Custom Sizes**: Add and save custom device resolutions.
- **Auto Proxying**: Bypasses strict browser security headers (`X-Frame-Options`) for external websites transparently by utilizing a public CORS proxy (`corsproxy.io`). No browser extensions required.
- **Frontend Only**: Runs entirely on the client side using HTML, CSS, and Vanilla JavaScript. No backend server required, making it perfect for Shared Hosting.
- **Dark Mode UI**: Clean, modern, and developer-friendly interface.

## Installation & Usage

1. Download or clone this repository.
2. Upload the files (`index.html`, `css/`, `js/`) to any web server (like Apache `htdocs` or cPanel `public_html`).
3. Open `index.html` in a modern browser.
4. Type any URL and click **Load URL**.

## Limitations

- Due to the nature of public CORS proxies, some websites with extremely strict Content-Security-Policies or complex relative pathing for assets (fonts, images) may render incorrectly.
- The tool does not store custom sizes across different devices (uses local browser storage).

## Technologies

- HTML5
- CSS3 (Vanilla)
- JavaScript (ES6)

---
*Developed by Pixel Panga Tech (2026).*
