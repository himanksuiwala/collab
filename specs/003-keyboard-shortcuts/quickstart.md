# Quickstart Validation Guide: Keyboard Shortcuts

## Prerequisites
- The local development server must be running (`npm run dev`).
- Open the application in your browser (e.g., `http://localhost:3000`).

## Validation Scenarios

### 1. Basic Text Formatting
1. Type a paragraph of text into the editor.
2. Highlight a word.
3. Press `Cmd+B` (Mac) or `Ctrl+B` (Windows). 
   - **Expected**: The selected text becomes bold.
4. Press `Cmd+I` / `Ctrl+I` to italicize and `Cmd+U` / `Ctrl+U` to underline.
5. With no text selected, press `Cmd+B` and type a new word.
   - **Expected**: The newly typed word is bold.

### 2. Text Resizing
1. Highlight a word.
2. Press `Cmd+Shift+.` (>).
   - **Expected**: The font size of the text increases.
3. Press `Cmd+Shift+,` (<).
   - **Expected**: The font size decreases.

### 3. Proper Break & Format Reset
1. Turn on bold by pressing `Cmd+B` and type "This is a bold heading".
2. Press the `Enter` key.
3. Type "This is normal text."
   - **Expected**: The new text should **not** be bold. The formatting resets automatically.
4. Move your cursor to the middle of the "bold heading" you typed in step 1.
5. Press the `Enter` key.
   - **Expected**: The bold heading is split into two lines. The text pushed down to the new line is *still* bold, but if you start typing immediately, the new characters are *not* bold.

### 4. Soft Breaks
1. Type "Line 1".
2. Press `Shift+Enter`.
3. Type "Line 2".
   - **Expected**: "Line 2" appears immediately below "Line 1" without the larger paragraph margin gap.

## Final Sign-off
If all expected outcomes are met, the keyboard shortcuts feature satisfies the specification and constitution rules.
