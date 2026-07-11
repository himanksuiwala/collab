# Research & Technical Decisions: Minimalist Toolbar

## Decisions

### 1. Slate.js Formatting (Marks vs Blocks)
- **Decision**: Use Slate "marks" for inline formatting (`bold`, `italic`, `underline`, `fontSize`) and "blocks" for paragraph-level formatting (`align`).
- **Rationale**: This is the standard Slate.js architecture. Marks apply to leaf text nodes, while blocks (like `Element` with `type: 'paragraph'`) wrap the text and control block-level styling like text alignment.
- **Alternatives considered**: Storing alignment in leaf nodes (rejected as alignment is inherently a block-level property).

### 2. Zoom Implementation
- **Decision**: Use CSS `transform: scale(X)` on the main Editor container (or a wrapper around it) alongside `transform-origin: top center`.
- **Rationale**: This visually scales the entire document (like Google Docs does for "Zoom") without altering the actual `fontSize` values in the Slate data model. This ensures the document structure and underlying data remain consistent regardless of how the user views it.
- **Alternatives considered**: Updating the `fontSize` of every text node in the document (rejected because it fundamentally changes the document data and destroys relative font size hierarchies).

### 3. Font Size Implementation
- **Decision**: Update the `fontSize` mark on selected text nodes, incrementing or decrementing by a fixed amount (e.g., 1px or 2px) within bounds (8px to 72px).
- **Rationale**: Allows users to increase or decrease font sizes easily via the `+`/`-` buttons while maintaining readable limits.
- **Alternatives considered**: Using CSS classes for predefined sizes (rejected as it limits flexibility).

### 4. Toolbar UI Components
- **Decision**: Use Radix-UI/shadcn `Toggle` components for formatting buttons, `Button` for `+`/`-` actions, and an `Input` or `Select` for the hybrid zoom control.
- **Rationale**: Aligns perfectly with the minimalist requirement and reuses the existing design system requested in the project constitution.
- **Alternatives considered**: Building custom buttons from scratch (rejected to avoid reinventing the wheel and ensure consistent styling).
