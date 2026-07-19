# Feature Specification: Collab Editor Refactor

**Feature Branch**: `[collab-editor-refactor]`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "We have multiple issues in the code, kindly refer to codebase-review.md and see if the code could be simplified and made more maintainable, modular/extensible."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Eliminate Performance Leaks (Priority: P1)

As a user, I want the collaborative editor to run smoothly without consuming excessive battery or CPU, so that my device doesn't overheat or slow down while editing documents.

**Why this priority**: The `CursorOverlay` currently runs a 60fps loop unconditionally, severely degrading performance and device battery life, making it a critical user experience blocker.

**Acceptance Scenarios**:

1. **Given** the editor is open and no cursors are moving, **When** the system monitors CPU and render cycles, **Then** there should be zero continuous background re-renders caused by cursor polling.
2. **Given** a collaborator moves their cursor, **When** the cursor overlay updates, **Then** the UI should update accurately without creating unneeded React component recreations.

---

### User Story 2 - Improve Maintainability by Breaking Down the Editor (Priority: P1)

As a developer, I need the `Editor.tsx` component to be modular and single-purpose, so that future features can be added without modifying a massive monolithic file.

**Why this priority**: The `Editor.tsx` file is almost 700 lines long, making it nearly impossible to safely add new features or debug current logic without breaking existing functionality.

**Acceptance Scenarios**:

1. **Given** the editor source code, **When** a developer reviews it, **Then** the connection logic, WebRTC management, and local storage persistence must be decoupled into independent, reusable hooks (e.g., `useCollabEditor`).
2. **Given** the editor UI, **When** a developer needs to modify the keyboard shortcuts, **Then** they should be able to modify a separate isolated module or hook (e.g., `useEditorShortcuts`) without touching the core React layout.
3. **Given** a user interacts with a standalone UI element like zoom or a popover, **When** local state updates, **Then** the primary Slate editor should not unconditionally re-render.

---

### User Story 3 - Optimize Code Execution and Bundle Size (Priority: P2)

As an application maintainer, I want inline components and heavy barrel imports eliminated, so that the app loads faster and UI interactions feel instantaneous.

**Why this priority**: Inline components inside the `Toolbar` cause constant component unmounting/remounting on every keystroke, leading to input lag. Barrel imports bloat the initial JavaScript bundle.

**Acceptance Scenarios**:

1. **Given** a user typing rapidly in the editor, **When** keystrokes are registered, **Then** the `Toolbar` child components (`Button`, `Divider`) should not unmount and remount.
2. **Given** the application bundle, **When** it is built for production, **Then** only the explicitly used Lucide icons should be included in the client JavaScript bundle.
3. **Given** a remote cursor moving, **When** the `useRemoteCursors` hook processes the change, **Then** it should not unconditionally force the global `CollaboratorsContext` (and thereby the application Header) to re-render unless a user explicitly joins or leaves.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST decouple the `CursorOverlay` from `requestAnimationFrame` loops and only update on actual `cursorStates` changes.
- **FR-002**: System MUST separate WebRTC and Yjs synchronization logic from the `Editor.tsx` UI rendering logic into custom hooks.
- **FR-003**: System MUST extract inline sub-components (e.g., `Button`, `Divider`) from within the `Toolbar` functional component body to module scope.
- **FR-004**: System MUST isolate layout-specific states, such as `zoomLevel` and popover toggles, into wrapper components to prevent top-level editor re-renders.
- **FR-005**: System MUST optimize context updates in `useRemoteCursors` to prevent full application re-renders during standard mouse movements (e.g., throttling or tracking only user joins/leaves in global state).
- **FR-006**: System MUST update imports for icons to explicitly use individual file paths or configure Next.js `optimizePackageImports` to avoid barrel import bloat.

### Key Entities

- **CursorOverlay**: Renders the remote collaborator cursors.
- **Editor**: The primary text editor UI wrapper.
- **CollaboratorsContext**: Global context maintaining active user presence.
- **Toolbar**: The rich-text formatting UI.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Background CPU utilization drops to baseline (0-1%) when the editor is idle and no cursors are moving.
- **SC-002**: Input latency during rapid typing is perceptibly reduced (no DOM remounting of Toolbar elements per keystroke).
- **SC-003**: The `Editor.tsx` file size is reduced by at least 40% (lines of code) through the extraction of custom hooks and smaller components.
- **SC-004**: The production JavaScript bundle size for the editor route decreases due to tree-shaken or direct icon imports.

## Assumptions

- We are refactoring existing working code; no new end-user features are being added in this scope.
- The `lucide-react` library version supports direct imports or Next.js `optimizePackageImports`.
- Testing remains "Absolutely No Testing" per the project Constitution.
