# Quickstart: Validation Guide

## Scenario 1: Toolbar Reordering
1. Open the editor.
2. Look at the floating toolbar at the bottom.
3. **Observation**: The sequence should be: Type (Normal/Heading), Font Size (+/-), Bold, Italic, Underline, **Link**, Alignments, Lists, Image.

## Scenario 2: Cmd/Ctrl + K Insertion
1. Type "Hello world" into the editor.
2. Select the word "world".
3. Press `Cmd + K` (or `Ctrl + K` on Windows).
4. **Observation**: A popover appears.
5. Enter `https://google.com` and click Save.
6. **Observation**: "world" is now styled as a blue, underlined hyperlink.

## Scenario 3: Editing & Deleting
1. Click anywhere inside the "world" hyperlink.
2. **Observation**: The popover re-appears showing the current URL.
3. Click "Delete".
4. **Observation**: The link styling and data is removed, but the word "world" remains intact in the paragraph.
