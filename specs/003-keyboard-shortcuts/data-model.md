# Data Model: Keyboard Shortcuts

The data model for this feature relies entirely on the internal state structure already maintained by Slate.js. No new external data entities or database schemas are being introduced. 

## Document State (Slate Node Tree)
Slate manages the document as a tree of Nodes (Elements and Texts).
- **Element Node**: Represents structural blocks like paragraphs.
- **Text Node (Leaf)**: Contains the actual string content along with formatting marks.

### Marks (Inline Formatting)
Active formatting is represented as boolean or numeric properties directly on Text nodes.
- `bold`: `boolean`
- `italic`: `boolean`
- `underline`: `boolean`
- `fontSize`: `number` (typically bounded between 8 and 72)

## Component State 

### Keyboard Event Handling
We intercept browser `KeyboardEvent` within the React `onKeyDown` handler attached to the `Editable` component.
- The handler will determine the modifier key configuration dynamically based on the OS.
- It translates key combinations (e.g., `Cmd+B`) into Slate `Transforms` or `Editor` mark operations.

## State Transitions (Format Reset)
When the user presses `Enter`:
1. **Action**: `onKeyDown` detects `Enter` (without `Shift`).
2. **Transition 1**: `Transforms.splitNodes` breaks the current Element at the cursor into two separate Elements.
3. **Transition 2**: A batch of `Editor.removeMark` commands are explicitly fired against the editor state to clear `bold`, `italic`, and `underline` properties for the active selection/cursor in the new block.
