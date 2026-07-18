# Quickstart: Validation Guide

This guide details how to validate the real-time multiplayer cursor functionality once implemented.

## Prerequisites
1. Ensure the development server is running (`npm run dev`).
2. You need at least two separate browser windows (or tabs) to test real-time collaboration.

## Validation Scenarios

### Scenario 1: Identity Generation
1. Open the application in Tab A.
2. Open the application in Tab B.
3. Look at the application header in both tabs.
4. **Expected Outcome**: You should see overlapping circular avatars in the top-right corner. Hovering over them should reveal distinctly generated Adjective-Animal names (e.g., "Anonymous Fox", "Anonymous Bear") with distinct vibrant colors.

### Scenario 2: Real-time Cursor Tracking
1. Arrange Tab A and Tab B side-by-side.
2. In Tab A, click inside the editor and type a sentence.
3. Observe Tab B.
4. **Expected Outcome**: In Tab B, you should see a floating caret matching Tab A's assigned color. The caret should move smoothly alongside the text being typed in real-time.

### Scenario 3: Editor Blur (Unfocus) Behavior
1. In Tab A, click at the end of a sentence.
2. Click outside the editor (e.g., on the page background or switch to a different application).
3. Observe Tab B.
4. **Expected Outcome**: In Tab B, Tab A's cursor should freeze at its last known position within the text. It should not disappear.

### Scenario 4: Disconnection Cleanup
1. Close Tab A entirely.
2. Observe Tab B.
3. **Expected Outcome**: In Tab B, the colored cursor belonging to Tab A should instantly disappear from the editor canvas. The avatar belonging to Tab A should instantly disappear from the header cluster.
