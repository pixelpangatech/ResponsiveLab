# Project Brief: ResponsiveLab
*Test. Preview. Perfect.*

## 1. Project Overview
The ResponsiveLab is a lightweight, frontend-centric utility designed to help web developers, QA testers, and designers visualize and verify website responsiveness across multiple screen sizes. The tool simulates various device resolutions directly within the browser without requiring heavy desktop applications or developer tools.

## 2. Core Objectives
- Provide a fast, accessible way to test URLs on various screen sizes.
- Ensure cross-origin testing compatibility (bypassing strict browser `X-Frame-Options`) without requiring a dedicated backend server, making it deployable on cheap Shared Hosting environments.
- Offer a seamless and modern UI with minimal configuration required.

## 3. Key Features
- **Dynamic Iframe Scaling**: The viewport scales proportionally using CSS transforms, ensuring the entire emulated device fits neatly on the user's screen without cutting off content.
- **Preset Device Categories**: One-click switching between popular resolutions (e.g., iPhone, Android, iPad, Desktop).
- **Custom Size Management**: Users can define, label, and save their own specific resolutions for niche devices. These are persisted locally via the browser's `localStorage`.
- **Automatic CORS Proxying**: Instead of relying on a Node.js backend (which cannot run on standard Shared Hosting), the tool automatically rewrites incoming URLs through `corsproxy.io`. This safely strips security headers that usually block external sites (like Google) from being embedded in an iframe.

## 4. Technical Architecture
The tool is strictly built with client-side technologies to maximize hosting compatibility:
- **Structure**: `index.html` serves as the sole entry point.
- **Styling**: `css/style.css` utilizes modern CSS Variables for easy theming (currently a sleek dark theme).
- **Logic**: `js/script.js` handles event delegation, URL processing, scaling math, and state management.

## 5. Development History & Decisions
- **Screenshot Feature Deprecated**: Initially, the project included a feature to download screenshots of the tested resolution. This was removed because capturing external websites natively via JavaScript (`html2canvas`) is blocked by browser CORS policies, and running a Headless Chrome backend (Puppeteer) was incompatible with the client's Shared Hosting limitations.
- **Proxy Implementation**: To allow loading external URLs without instructing users to install browser extensions, a public proxy mechanism was integrated transparently into the URL loading sequence.

## 6. Deployment Strategy
The project requires zero build steps or server-side dependencies. It can be deployed by uploading the directory contents directly to any standard web server directory (e.g., `htdocs` or `public_html`).
