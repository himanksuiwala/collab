# Feature Specification: Rich Text Formatting

**Feature Branch**: `006-rich-text-formatting`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Now I need to add new optiosn in the rich text-editor as follows: In toolbar on right as first option there shall be dropdown which provides the given options [Heading, Sub-heading, Normal] and each one of them should follow the standard typography like what's ususally followed in rich-text editors and user should be able to choose either of the option from dropdown menu and following shall become active - need to be sane about the formatting like it's usually done. Then add a two new options for bullet list with ordered and un-ordered list and each one of them should be having the standard behavior and handle the indentation apporpriately. Next all the text-align should be replaced with a single-representation icon upon clicking which the dropwodn/menu shall be loaded and user can choose the appropriate alignment. Also please fix the aligment of the bold, italic and underline icon - they are not in sync."

## Clarifications

### Session 2026-07-19

- Q: How should we model list indentation in the document structure? → A: True nesting: Lists contain list-items, which can contain sub-lists (matches HTML standard).
- Q: When text with multiple different alignments is selected, what should the alignment dropdown icon display? → A: Show the alignment of the first selected block (standard behavior).
- Q: What happens if a user clicks the bullet list button while inside a Heading? → A: The Heading converts to a normal bulleted list item (standard behavior).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Block Type Formatting (Headings) (Priority: P1)

Users need to structure their documents with semantic headings to organize content clearly.

**Why this priority**: Essential for writing structured, readable documents beyond a single block of text.

**Acceptance Scenarios**:

1. **Given** a user is typing a paragraph, **When** they select "Heading" from the new toolbar dropdown, **Then** the current block of text instantly converts to a large, prominent heading format.
2. **Given** the cursor is inside an existing Sub-heading, **When** the user looks at the toolbar, **Then** the dropdown accurately displays "Sub-heading" as the active format.
3. **Given** a user hits Enter at the end of a Heading, **When** the new line is created, **Then** the editor automatically reverts the new block to "Normal" text.

---

### User Story 2 - List Formatting (Priority: P1)

Users need to create ordered (numbered) and unordered (bulleted) lists to group related items.

**Why this priority**: Lists are a fundamental requirement for any rich-text collaborative editor.

**Acceptance Scenarios**:

1. **Given** a user clicks the "Unordered List" button, **When** they type and hit Enter, **Then** a new bullet point is automatically created on the next line.
2. **Given** a user is in an active list item, **When** they hit Enter twice (on an empty item), **Then** the list is terminated and the cursor drops into a Normal paragraph.
3. **Given** a user is in a list item, **When** they press Tab or Shift+Tab, **Then** the list item indents or outdents appropriately, creating nested lists.

---

### User Story 3 - Toolbar UI Consolidation & Polish (Priority: P2)

Users need a clean, uncluttered toolbar where related options (like alignment) are grouped logically, and all icons are visually aligned.

**Why this priority**: Improves UX by reducing cognitive overload and fixing visual bugs that make the app feel unpolished.

**Acceptance Scenarios**:

1. **Given** the user views the toolbar, **When** they look at the alignment section, **Then** only a single icon representing the *current* text alignment (e.g., Left Align) is visible.
2. **Given** a user clicks the alignment icon, **When** the menu opens and they select "Center", **Then** the text centers, the menu closes, and the toolbar icon updates to the "Center Align" icon.
3. **Given** a user views the text formatting group (Bold, Italic, Underline), **When** inspecting their layout, **Then** the icons are perfectly centered and aligned with each other vertically and horizontally.

### Edge Cases

- **Mixed Selection (Block Types)**: What happens if a user highlights text that spans across a Heading and a Normal paragraph, and tries to apply "Sub-heading"? (The system should apply the Sub-heading format to all fully or partially selected blocks).
- **Mixed Selection (Alignment)**: If a user selects multiple blocks with differing text alignments, the alignment dropdown icon MUST display the alignment of the *first* selected block.
- **List inside Heading**: If a user clicks the bullet or numbered list button while inside a Heading block, the block MUST convert entirely into a Normal text list item (discarding heading formatting).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The toolbar MUST include a dropdown menu as the first item on the left (or specified position) to toggle block types: Heading, Sub-heading, and Normal.
- **FR-002**: Heading, Sub-heading, and Normal text MUST have distinct, standard typographic styling (e.g., larger font weight and size for Headings).
- **FR-003**: The toolbar MUST include toggle buttons for Unordered (bulleted) and Ordered (numbered) lists.
- **FR-004**: The editor MUST support standard list behaviors, including auto-continuation on Enter, termination on double Enter, and nesting via indentation.
- **FR-005**: Text alignment options (Left, Center, Right, Justify) MUST be consolidated into a single dropdown menu.
- **FR-006**: The alignment dropdown trigger MUST display the icon of the currently active alignment for the selected text.
- **FR-007**: The Bold, Italic, and Underline toolbar icons MUST be visually aligned and perfectly synchronized in layout.

### Key Entities

- **Block Element**: The underlying structure of the document, which must now support new types beyond `paragraph` (e.g., `heading-one`, `heading-two`, `list-item`, `bulleted-list`, `numbered-list`).
- **List Structure**: Lists MUST be modeled using true nesting (e.g., a `bulleted-list` element wraps `list-item` elements, and a `list-item` can contain a nested `bulleted-list` to handle indentation).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can apply Headings, Sub-headings, and Lists without breaking document synchronization in collaborative sessions.
- **SC-002**: The toolbar consumes less horizontal space by consolidating 4 alignment buttons into 1 dropdown.
- **SC-003**: 100% of formatting icons in the toolbar share a consistent bounding box and visual alignment.

## Assumptions

- Standard Markdown-style behavior is expected for lists (Enter creates a new bullet, double-Enter escapes the list).
- "Heading" corresponds to an `H1` equivalent, and "Sub-heading" to an `H2` equivalent.
- The UI framework or icons used (e.g., `lucide-react`) support the necessary alignment and list icons.
