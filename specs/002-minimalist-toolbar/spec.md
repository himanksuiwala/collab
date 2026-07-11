# Feature Specification: Minimalist Toolbar

**Feature Branch**: `002-minimalist-toolbar`

**Created**: 2026-07-11

**Status**: Draft

**Input**: User description: "Now let's move to next stage where we need implement a Google docs like toolbar but with more minimalist design. It should be having the following features: Zoom functionality, Increase/decrease font-size, custom text formatting option like Bold-italicize-underline and align-text."

## Clarifications

### Session 2026-07-11

- Q: Should the toolbar be sticky (always visible) or static at the top? → A: Sticky Toolbar - The toolbar remains fixed at the top of the screen as the user scrolls down the document.
- Q: How should font size control be exposed? → A: Buttons Only (`+` / `-`) - Minimalist approach with just increase and decrease buttons.
- Q: How should zoom control be exposed? → A: Hybrid (Google Docs style) - An input/dropdown field showing the current percentage alongside buttons.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
-->

### User Story 1 - Apply Text Formatting (Priority: P1)

As a user, I want to apply basic text formatting (bold, italic, underline) to my text so that I can emphasize key points in my document.

**Why this priority**: Core WYSIWYG functionality that users expect in any document editor.

**Acceptance Scenarios**:

1. **Given** the user has selected a word in the editor, **When** they click the "Bold" button on the toolbar, **Then** the selected text becomes bold.
2. **Given** the user's cursor is placed in the editor without selection, **When** they toggle the "Italic" button and start typing, **Then** the new text is italicized.
3. **Given** the user has selected already underlined text, **When** they click the "Underline" button, **Then** the underline formatting is removed.

---

### User Story 2 - Adjust Text Alignment (Priority: P1)

As a user, I want to change the alignment of my paragraphs (left, center, right, justify) so that I can visually structure my document.

**Why this priority**: Essential for structuring documents like letters, titles, or formal reports.

**Acceptance Scenarios**:

1. **Given** the user's cursor is in a paragraph, **When** they click the "Center Align" button, **Then** the entire paragraph aligns to the center of the canvas.
2. **Given** the user has selected text across multiple paragraphs, **When** they click "Right Align", **Then** all affected paragraphs align to the right.

---

### User Story 3 - Change Font Size (Priority: P2)

As a user, I want to increase or decrease the font size of my text so that I can create a visual hierarchy (e.g., headings vs body text).

**Why this priority**: Important for document structure but secondary to basic emphasis and alignment.

**Acceptance Scenarios**:

1. **Given** the user has selected text, **When** they click the "Increase Font Size" button, **Then** the text visibly enlarges.
2. **Given** the user selects text with different font sizes, **When** they view the toolbar, **Then** the toolbar clearly indicates the font size (or a mixed state).

---

### User Story 4 - Zoom Document Canvas (Priority: P2)

As a user, I want to zoom in and out of the document canvas so that I can comfortably read or review the overall layout of my document.

**Why this priority**: Enhances accessibility and user comfort during extended editing sessions.

**Acceptance Scenarios**:

1. **Given** the user is viewing the document, **When** they select a 150% zoom level, **Then** the entire document canvas and its contents scale up visually without altering the actual font size properties of the text.

---

## Edge Cases

- What happens when a user attempts to decrease the font size indefinitely? (The system will enforce a minimum size limit, e.g., 8pt, to maintain readability).
- What happens when text with mixed formatting (e.g., some bold, some normal) is selected and a formatting button is toggled? (The system toggles the state based on standard conventions—usually applying the format to the entire selection if it's mixed).
- How does zoom behave on extremely small mobile screens? (Zoom controls might be simplified or capped to prevent the canvas from overflowing the viewport unmanageably).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a persistent, sticky formatting toolbar positioned above the document canvas that remains visible as the user scrolls.
- **FR-002**: The toolbar MUST adhere to the Simple/Minimal UX principle (e.g., clean icons, intuitive layout, no excessive borders).
- **FR-003**: The system MUST allow users to toggle Bold, Italic, and Underline formatting for selected or newly typed text.
- **FR-004**: The system MUST allow users to set paragraph alignment to Left, Center, Right, or Justify.
- **FR-005**: The system MUST allow users to increase or decrease the font size of text using simple `+` and `-` buttons (no dropdowns).
- **FR-006**: The system MUST provide a hybrid zoom control (input/dropdown showing current percentage alongside `+`/`-` buttons) to adjust the visual zoom level of the document canvas (e.g., 50%, 100%, 150%, 200%).

### Key Entities

- **Text Node**: Represents inline text. Needs properties to track `bold` (boolean), `italic` (boolean), `underline` (boolean), and `fontSize` (number/string).
- **Paragraph Element**: Represents a block of text. Needs a property to track `align` (left, center, right, justify).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Formatting actions (bold, align, resize) are applied and rendered on the canvas with no perceptible delay (under 100ms).
- **SC-002**: The toolbar design maintains a minimalist footprint, consuming no more than 60px of vertical screen space on desktop devices.
- **SC-003**: Users can successfully scale the canvas zoom between 50% and 200% without causing horizontal scrolling on standard desktop resolutions (1080p+).

## Assumptions

- **Minimalist UX**: Icons will be sourced from a standard minimalist library (e.g., Lucide, Radix icons) and avoid complex, multi-level dropdowns where simple buttons suffice.
- **Zoom Implementation**: Zooming applies a visual scale transform to the canvas wrapper (or similar CSS approach) rather than changing the actual `fontSize` data of every text node.
- **Dependencies**: The implementation will leverage the existing Shadcn/Radix-UI setup for components (like Toggle buttons or Select dropdowns for zoom/font-size).
