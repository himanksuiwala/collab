# Tasks: Minimalist Toolbar

**Input**: Design documents from `/specs/002-minimalist-toolbar/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- *(Skipped: Project is already initialized with Next.js and Slate.js. Dependencies are already present.)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T001 Create `components/editor/Toolbar.tsx` scaffolding with a sticky header container layout.
- [x] T002 Update `components/editor/Editor.tsx` to import and render `<Toolbar />` fixed at the top of the editor.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Apply Text Formatting (Priority: P1) 🎯 MVP

**Goal**: Apply basic text formatting (bold, italic, underline) to text so users can emphasize key points.

### Implementation for User Story 1

- [x] T003 [US1] Update Slate `CustomText` type definition in `components/editor/Editor.tsx` to include `bold`, `italic`, and `underline` booleans.
- [x] T004 [US1] Update `Leaf` rendering component in `components/editor/Editor.tsx` to apply `font-bold`, `italic`, and `underline` Tailwind classes based on leaf properties.
- [x] T005 [US1] Implement `toggleMark` helper logic inside `components/editor/Toolbar.tsx` to toggle format marks on the current selection.
- [x] T006 [US1] Add minimalist Bold, Italic, and Underline toggle buttons (using `lucide-react` icons) to `components/editor/Toolbar.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and text formatting works independently.

---

## Phase 4: User Story 2 - Adjust Text Alignment (Priority: P1)

**Goal**: Change the alignment of paragraphs (left, center, right, justify) to visually structure the document.

### Implementation for User Story 2

- [x] T007 [US2] Update Slate `CustomElement` type definition in `components/editor/Editor.tsx` to include an optional `align` string property.
- [x] T008 [US2] Update `Element` rendering component in `components/editor/Editor.tsx` to apply `text-left`, `text-center`, `text-right`, or `text-justify` classes based on the `align` property.
- [x] T009 [US2] Implement `toggleBlock` alignment helper logic inside `components/editor/Toolbar.tsx` to apply alignment to selected paragraph blocks.
- [x] T010 [US2] Add minimalist Left, Center, Right, and Justify buttons to `components/editor/Toolbar.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Change Font Size (Priority: P2)

**Goal**: Increase or decrease the font size of text to create visual hierarchy.

### Implementation for User Story 3

- [x] T011 [US3] Update Slate `CustomText` type in `components/editor/Editor.tsx` to include an optional `fontSize` number property.
- [x] T012 [US3] Update `Leaf` rendering component in `components/editor/Editor.tsx` to apply inline CSS `fontSize` if the property exists.
- [x] T013 [US3] Implement `changeFontSize` helper logic in `components/editor/Toolbar.tsx` to increment or decrement the font size of selected text by a fixed step (e.g., 2px), bounded between 8 and 72.
- [x] T014 [US3] Add minimalist Font Size `+` and `-` buttons to `components/editor/Toolbar.tsx`.

**Checkpoint**: All 3 formatting features should now be independently functional.

---

## Phase 6: User Story 4 - Zoom Document Canvas (Priority: P2)

**Goal**: Zoom in and out of the document canvas without altering text data.

### Implementation for User Story 4

- [x] T015 [US4] Add `zoomLevel` state (defaulting to 100) to `components/editor/Editor.tsx`.
- [x] T016 [US4] Apply CSS `transform: scale(zoomLevel / 100)` and `transformOrigin: top center` to the main canvas wrapper inside `components/editor/Editor.tsx`.
- [x] T017 [US4] Pass `zoomLevel` and `setZoomLevel` state down to `components/editor/Toolbar.tsx`.
- [x] T018 [US4] Implement a hybrid zoom control (an input indicating percentage alongside `+` and `-` buttons) in `components/editor/Toolbar.tsx` to adjust `zoomLevel`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Ensure the toolbar fits within the 60px height constraint and uses the `bg-white/90 backdrop-blur` minimal aesthetic in `components/editor/Toolbar.tsx`.
- [x] T020 Run manual validation against all 5 scenarios defined in `specs/002-minimalist-toolbar/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Complete.
- **Foundational (Phase 2)**: BLOCKS all user stories. Must create the base Toolbar component first.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. They can be executed sequentially or in parallel.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2.
- **User Story 2 (P1)**: Can start after Phase 2. Independent of US1.
- **User Story 3 (P2)**: Can start after Phase 2. Independent of US1 & US2.
- **User Story 4 (P2)**: Can start after Phase 2. Requires Editor layout modifications which are isolated from Slate formatting.

### Parallel Opportunities

- Due to the cohesive nature of building a single Toolbar component interacting with a single Editor component, most tasks will modify the same two files (`Editor.tsx` and `Toolbar.tsx`). Therefore, parallelization is limited to avoid merge conflicts. Sequential execution (Phase 2 -> 3 -> 4 -> 5 -> 6 -> 7) is recommended.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test Text Formatting independently

### Incremental Delivery

1. Complete Foundational → Toolbar scaffold ready.
2. Add User Story 1 (Formatting) → Test independently.
3. Add User Story 2 (Alignment) → Test independently.
4. Add User Story 3 (Font Size) → Test independently.
5. Add User Story 4 (Zoom) → Test independently.
