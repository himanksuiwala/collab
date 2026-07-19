---
description: "Task list for Version History implementation"
---

# Tasks: Version History & Comparison

**Input**: Design documents from `/specs/010-version-history/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No setup dependencies required - Yjs and Slate are already installed)*

---

## Phase 2: Foundational (Blocking Prerequisites)

*(No blocking backend foundational tasks required)*

---

## Phase 3: User Story 1 - Persistent Identity (Priority: P1) 🎯 MVP

**Goal**: Maintain consistent author attribution across sessions by saving identity to localStorage and attaching it to inserted text.

### Implementation for User Story 1

- [x] T001 [P] [US1] Update `lib/identity.ts` to check `localStorage.getItem("localUserName")`. If it exists, return it; otherwise generate a new identity, save it via `localStorage.setItem("localUserName", name)`, and return it.
- [x] T002 [US1] Update `CustomText` type in `components/editor/Editor.tsx` to include an optional `authorName?: string`.
- [x] T003 [US1] In `components/editor/Editor.tsx`, override the `editor.insertText` method (inside the `useEffect` that creates the editor) to automatically attach `authorName: identity.current.name` (or similar) to any text node being inserted.

**Checkpoint**: At this point, new text edits should contain the `authorName` attribute internally, and refreshing the page retains the same identity.

---

## Phase 4: User Story 2 - Capturing Versions (Priority: P1)

**Goal**: Save a snapshot of the CRDT state vector at a given time into a Y.Map.

### Implementation for User Story 2

- [x] T004 [US2] In `components/editor/Editor.tsx`, initialize a `versionsMap` from the `doc` (`doc.getMap("versions")`) inside the IndexedDB initialization `useEffect`, and attach it to the `localContext` state.
- [x] T005 [P] [US2] In `components/editor/Toolbar.tsx`, add a "Save Version" button (using an appropriate icon from `lucide-react`) and expose a `onSaveVersion` prop.
- [x] T006 [US2] In `components/editor/Editor.tsx`, implement a `handleSaveVersion` function that creates a snapshot using `Y.snapshot(localContext.doc)`, encodes it via `Y.encodeSnapshot`, and saves it to the `versionsMap` with a timestamp key (e.g., `Date.now()`). Pass this to `Toolbar`.

**Checkpoint**: Clicking "Save Version" populates the `versionsMap` with serialized snapshots.

---

## Phase 5: User Story 3 - Version History Viewer & Comparison (Priority: P1)

**Goal**: View past snapshots in a right-sided sidebar and compare them side-by-side in read-only mode with author color-coding.

### Implementation for User Story 3

- [x] T007 [P] [US3] In `components/editor/Toolbar.tsx`, add a "History" toggle button to open the sidebar.
- [x] T008 [P] [US3] Create `components/editor/VersionHistorySidebar.tsx`. It should render a right-aligned sliding sidebar listing the versions from `versionsMap` (passed as a prop), sorted chronologically, with a click handler to select a version.
- [x] T009 [P] [US3] Create `components/editor/ComparisonView.tsx` which takes the `doc`, the selected `encodedSnapshot`, and the live `editor`. It should use `Y.createDocFromSnapshot(doc, Y.decodeSnapshot(encodedSnapshot))` to generate a detached historical `Y.Doc`.
- [x] T010 [US3] Inside `components/editor/ComparisonView.tsx`, initialize a read-only Slate editor connected to the historical `Y.Doc` and render it alongside the live editor view. Implement a custom `renderLeaf` that maps the `authorName` attribute to a distinct CSS background color.
- [x] T011 [US3] In `components/editor/Editor.tsx`, add state for `isHistoryOpen` (boolean) and `selectedVersionId` (string | null).
- [x] T012 [US3] In `components/editor/Editor.tsx`, conditionally render `VersionHistorySidebar` (when `isHistoryOpen` is true). If `selectedVersionId` is set, swap the standard `<Editable>` view out for the `<ComparisonView>` component (or render them side-by-side based on screen layout).

**Checkpoint**: Users can open the sidebar, select a version, and see a split view with read-only, color-coded historical text.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T013 [P] Run `npx tsc --noEmit` to verify type safety of the new components and Yjs snapshot logic.
- [x] T014 Run manual validation scenarios from `quickstart.md` (check identity persistence across reloads, capture snapshot, verify read-only diff mode).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundational**: N/A
- **User Stories (Phase 3-5)**: Must be executed in sequence (US1 -> US2 -> US3).
- **Polish (Final Phase)**: Depends on US3 completion.

### Parallel Opportunities

- T001 (Identity hook) and T002 (Slate Types) can be done in parallel.
- T005 (Toolbar Save Button) can be developed independently of the Yjs logic in T004.
- T007 (Toolbar History Button), T008 (Sidebar UI), and T009 (ComparisonView structure) can be scaffolded in parallel before integration in T011/T012.

---

## Implementation Strategy

### Incremental Delivery
1. Implement persistent identity (US1) - invisible to user but crucial.
2. Implement snapshot capture (US2) - user can click save, but can't view it yet.
3. Implement sidebar and comparison view (US3) - completes the feature loop.
