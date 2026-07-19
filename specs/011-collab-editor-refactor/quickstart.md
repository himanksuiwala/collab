# Quickstart Validation Guide

This document outlines how to manually validate that the refactor successfully resolved the performance and structural issues without breaking functionality.

## Prerequisites

- Two browser windows or tabs.
- The Next.js development server running.

## Setup

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in two separate browser windows (side-by-side if possible).

## Validation Scenarios

### Scenario 1: CPU Idle Performance
1. Leave both browser windows open with the editor focused in one.
2. Do not type or move the mouse.
3. Open Chrome DevTools > Performance monitor.
4. **Expected Outcome**: CPU usage should remain negligible (0-2%). It should no longer sit at a constant 10-20% load due to the 60fps cursor polling loop.

### Scenario 2: Collaborative Typing
1. In Browser A, type a paragraph.
2. In Browser B, observe the text appearing in real-time.
3. **Expected Outcome**: The text synchronizes perfectly. The input should feel immediate without any noticeable lag (confirming that `Toolbar` inline components are no longer dragging down render times).

### Scenario 3: Cursor Overlays
1. In Browser A, click different parts of the text.
2. In Browser B, observe the colored cursor jumping to the correct locations.
3. Highlight a block of text in Browser A.
4. **Expected Outcome**: Browser B shows the highlighted text in Browser A's cursor color. The remote cursor accurately reflects selection state.

### Scenario 4: Bundle Size Check
1. Stop the dev server.
2. Run the production build:
   ```bash
   npm run build
   ```
3. **Expected Outcome**: The Next.js build output should show optimized bundle sizes for the editor chunks, confirming `lucide-react` icons were properly tree-shaken by `optimizePackageImports`.
