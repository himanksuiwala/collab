# Quickstart Validation Guide: Minimalist Toolbar

## Prerequisites
- Dependencies installed.

## Validation Scenarios

### Scenario 1: Verify Toolbar Rendering & Aesthetics
1. Run the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. **Verify**: A sticky toolbar appears at the top. It consumes minimal vertical space (<60px) and contains formatting icons, alignment icons, font size (`+`/`-`), and a hybrid zoom control.

### Scenario 2: Test Text Formatting
1. Type text into the document canvas.
2. Highlight a word and click the "Bold", "Italic", and "Underline" buttons.
3. **Verify**: The text becomes bold, italicized, and underlined instantly.

### Scenario 3: Test Paragraph Alignment
1. Place the cursor inside a paragraph.
2. Click the "Center Align" button.
3. **Verify**: The entire paragraph aligns to the center.

### Scenario 4: Test Font Size Adjustment
1. Highlight a word.
2. Click the `+` button in the font size control section multiple times.
3. **Verify**: The selected text visibly increases in size.

### Scenario 5: Test Canvas Zoom
1. Locate the Zoom control in the toolbar.
2. Click the `+` button to increase zoom to 150%, or type `150` into the input.
3. **Verify**: The entire document canvas scales up visually without causing horizontal scrolling (on a standard 1080p desktop).
