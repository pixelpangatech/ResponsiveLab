# Folder Structure

*Test. Preview. Perfect.*

## Overview
ResponsiveLab is built as a lightweight, static client-side application. The folder structure is flat and extremely simple to facilitate easy deployment on any static file host, Shared Hosting environment, or CDN (like GitHub Pages or Netlify).

## Directory Tree

```
ResponsiveLab/
│
├── index.html              # Main entry point and structural HTML for the application.
├── README.md               # High-level project information and setup guide.
│
├── css/                    # Contains all stylesheets.
│   └── style.css           # Vanilla CSS utilizing custom properties for dark mode styling.
│
├── js/                     # Contains all client-side logic.
│   └── script.js           # Handles DOM manipulation, iframe scaling, URL proxying, and localStorage.
│
└── doc/                    # Documentation directory.
    ├── project_brief.md         # History, objectives, and high-level decisions.
    ├── architecture_and_flow.md # Data flow diagrams and technical architecture.
    ├── design_system.md         # UI/UX guidelines, color palettes, and typography.
    └── folder_structure.md      # This file.
```

## Deployment
To deploy this project, simply copy the entire `ResponsiveLab` directory to your web server (e.g., `htdocs` for XAMPP/Apache, or `public_html` for cPanel). No `npm install`, build steps, or backend configuration are required.
