# Quickstart Validation Guide: WYSIWYG Editor Page

This guide explains how to validate the WYSIWYG Editor Page implementation.

## Prerequisites

- Node.js (v18+)
- npm installed

## 1. Start the Application

1. Open a terminal in the project root directory (`/Users/suiwala/Workspace/collab`).
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open a browser and navigate to `http://localhost:3000`.

## 2. Validation Scenarios

### Scenario A: UI Layout and Visuals
1. **Action**: View the page at `http://localhost:3000`.
2. **Expected Outcome**:
   - A top header is visible with "Collab" branding on the left side.
   - Below the header, an editor canvas is centered on the page.
   - The canvas is pure white (`#FFFFFF`).
   - The background surrounding the canvas is slightly off-white.
   - The canvas has a visible drop shadow giving it a 3D, elevated appearance.
   - The canvas's initial empty state appears proportionally similar to an A4 document.

### Scenario B: Text Interaction and Auto-Grow
1. **Action**: Click inside the white canvas and type several paragraphs of text. Hold the `Enter` key to quickly add many new lines.
2. **Expected Outcome**:
   - The text appears immediately as you type (no perceptible lag).
   - As the text extends beyond the initial height of the canvas, the canvas grows vertically.
   - The entire page scrolls naturally; the canvas does NOT have an internal scrollbar.

### Scenario C: Responsiveness
1. **Action**: Resize the browser window to a narrow width (simulating a mobile device).
2. **Expected Outcome**:
   - The canvas scales down horizontally to fit the screen while maintaining some padding on the sides.
   - The header remains accessible and the visual hierarchy is preserved.

*(Note: Per the project constitution, absolutely no automated tests are to be run. This manual validation serves as the sole verification).*
