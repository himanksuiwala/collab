# Data Model: Minimalist Toolbar

## Core Entities

### Document State (`Descendant[]`)
The Slate.js document state consists of block-level elements (paragraphs) containing inline text nodes (leaves).

### Element Node (Block)
Represents a structural block of text in the document.
- **Type**: `paragraph` (required)
- **Align**: `left` | `center` | `right` | `justify` (optional, default is `left`)
- **Children**: Array of `Text Node` objects.

### Text Node (Leaf)
Represents a contiguous span of text with specific inline formatting.
- **Text**: `string` (required)
- **Bold**: `boolean` (optional)
- **Italic**: `boolean` (optional)
- **Underline**: `boolean` (optional)
- **FontSize**: `number` (optional, representing pixel size, e.g., 16)

## Component State
- **Zoom Level**: Managed via React state (e.g., `useState(100)` for 100%) in the main Editor layout. Affects the visual CSS scale of the canvas container.
