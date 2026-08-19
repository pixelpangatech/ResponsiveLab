# Design System & UI Guidelines

*Test. Preview. Perfect.*

## 1. Design Philosophy
ResponsiveLab employs a "Dark Mode First" aesthetic, prioritizing high contrast and minimal eye strain for developers and designers who spend long hours testing applications. The interface is deliberately minimal to ensure the user's focus remains on the tested webpage inside the iframe, rather than the surrounding tool UI.

## 2. Color Palette
The application uses CSS Custom Properties (Variables) defined at the `:root` level to maintain consistent colors across all components:

- **Background (`--bg-color`)**: `#0f111a` - Deep, rich dark blue/black for the main canvas.
- **Panel Background (`--panel-bg`)**: `#1a1d27` - Slightly lighter shade for sidebars and top bars to create depth.
- **Borders (`--border-color`)**: `#2a2e3d` - Subtle dividers to separate panels without being distracting.
- **Primary Accent (`--accent`)**: `#6366f1` - Vibrant indigo used for primary actions, active states, and focus rings.
- **Hover Accent (`--accent-hover`)**: `#4f46e5` - Darker indigo for interactive feedback.
- **Primary Text (`--text-primary`)**: `#f8fafc` - High-contrast white/gray for readability.
- **Secondary Text (`--text-secondary`)**: `#94a3b8` - Muted text for labels and less important information.
- **Success Color (`--success`)**: `#10b981` - Emerald green for positive feedback (toasts).
- **Danger/Error Color (`--danger`)**: `#ef4444` - Red for destructive actions or critical errors.

## 3. Typography
- **Primary Font**: `Inter`, a highly legible sans-serif font optimized for screen readability.
- **Weights**: 
  - Regular (400) for body text and buttons.
  - Medium (500) for subheadings.
  - Semi-Bold (600) for primary headers.

## 4. Components

### Buttons
Buttons are strictly flat with subtle rounded corners (`border-radius: 6px`).
- **Primary Button**: Solid accent background with white text. Used for main actions (e.g., "Load URL").
- **Outline Button**: Transparent background with an accent border. Used for secondary actions (e.g., "Cancel").
- **Device Buttons**: Gray background that shifts to accent color when clicked/active, indicating the currently selected resolution.

### Forms & Inputs
Inputs have a dark background (`#0f111a`) with a visible border (`--border-color`). On focus, they receive a glowing box-shadow using the `--accent` color to indicate active state and improve accessibility.

### Modals
Modals feature a glassmorphism-inspired backdrop (semi-transparent black with `backdrop-filter: blur`) to dim the main application while keeping the focus on the modal content.

### Notifications (Toasts)
Toast notifications appear at the bottom center of the screen, floating above the UI. They slide up smoothly using CSS keyframe animations and disappear automatically after 3 seconds.
