# Quickstart & Validation Guide

Follow these steps to manually validate the Rich Text Formatting features after implementation.

## Prerequisites
- Start the application using `npm run dev`.
- Open `http://localhost:3000` in your browser.

## Validation Scenarios

### Scenario 1: Block Type Dropdown & Upward Loading
1. Observe the floating toolbar at the bottom of the screen.
2. Click the new "Block Type" dropdown (first item on the left).
3. **Verify**: The menu opens *upwards* (towards the top of the screen), matching the app's premium design and using Radix UI styling.
4. Select "Heading" from the dropdown.
5. **Verify**: The current line of text instantly converts to a large, bold heading format.
6. Hit `Enter`.
7. **Verify**: The cursor moves to a new line and the block type reverts to "Normal" (Paragraph).

### Scenario 2: Nested List Behavior
1. Click the "Unordered List" (Bullet) icon in the toolbar.
2. Type "Item 1" and hit `Enter`.
3. **Verify**: A new bullet point is created below.
4. Press `Tab`.
5. **Verify**: The bullet indents (nests) under "Item 1".
6. Type "Nested Item" and hit `Enter`, then press `Shift+Tab`.
7. **Verify**: The new bullet outdents back to the top level.
8. Hit `Enter` twice on an empty list item.
9. **Verify**: The list terminates and a normal paragraph block is created.

### Scenario 3: Alignment Dropdown & Icon Sync
1. Look at the toolbar alignment section.
2. **Verify**: Only a single alignment icon is visible (e.g., Left Align).
3. Click the icon to open the dropdown menu (loads upwards).
4. Select "Center Align".
5. **Verify**: The text centers, and the toolbar icon immediately updates to display the "Center Align" icon.
6. Look at the Bold, Italic, and Underline icons.
7. **Verify**: They are perfectly centered and visually synchronized within their container, with no awkward spacing.

### Scenario 4: Heading to List Edge Case
1. Set the current block to "Heading".
2. Click the "Unordered List" button.
3. **Verify**: The block converts into a normal text bullet point (the heading styling is discarded), fulfilling the edge case clarification.
