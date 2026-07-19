# Tasks: Collab Editor Refactor

**Input**: Design documents from `/specs/011-collab-editor-refactor/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify project compiles before starting refactor in app/page.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Extract Leaf and Element Slate rendering components to components/editor/Elements.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Eliminate Performance Leaks (Priority: P1) 🎯 MVP

**Goal**: Fix the 60fps React state polling loop causing high CPU load.

### Implementation for User Story 1

- [X] T003 [US1] Remove requestAnimationFrame loop and rely on dependency array in components/editor/CursorOverlay.tsx

**Checkpoint**: At this point, the editor should no longer use background CPU when idle.

---

## Phase 4: User Story 2 - Improve Maintainability by Breaking Down Editor (Priority: P1)

**Goal**: Deconstruct the 700-line monolithic Editor component into custom hooks and smaller wrappers.

### Implementation for User Story 2

- [X] T004 [P] [US2] Extract WebRTC, IndexedDB, and Yjs binding logic into hooks/useCollabEditor.ts
- [X] T005 [P] [US2] Extract keyboard formatting and event handlers into hooks/useEditorShortcuts.ts
- [X] T006 [P] [US2] Extract image paste handler and Cloudinary logic into hooks/useImageUpload.ts
- [X] T007 [P] [US2] Extract layout state and zoom toolbar scaling into components/editor/ZoomWrapper.tsx
- [X] T008 [US2] Update components/editor/Editor.tsx to assemble the UI using the extracted hooks and ZoomWrapper (depends on T004-T007)

**Checkpoint**: At this point, the `Editor.tsx` file should be primarily declarative UI, significantly reducing line count and complexity.

---

## Phase 5: User Story 3 - Optimize Code Execution and Bundle Size (Priority: P2)

**Goal**: Eliminate inline component re-renders and optimize the lucide-react bundle.

### Implementation for User Story 3

- [X] T009 [P] [US3] Move Button and Divider components out of the Toolbar functional body in components/editor/Toolbar.tsx
- [X] T010 [P] [US3] Configure optimizePackageImports for lucide-react in next.config.ts
- [X] T011 [P] [US3] Implement activeCollabsRef to prevent redundant context updates in hooks/useRemoteCursors.ts

**Checkpoint**: All user stories should now be independently functional.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T012 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (US1 → US2 → US3) or in parallel.
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2).
- **User Story 2 (P1)**: Independent, but will require updating `Editor.tsx` logic.
- **User Story 3 (P2)**: Modifies `Toolbar.tsx` and `useRemoteCursors.ts`. Independent of US1/US2.

### Parallel Opportunities

- Hooks extraction in User Story 2 (T004, T005, T006, T007) can all be done in parallel as they touch different domains of logic.
- User Story 3 optimizations (T009, T010, T011) can all be done in parallel as they touch separate files.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (Cursor overlay fix)
4. **STOP and VALIDATE**: Test idle CPU usage.

### Incremental Delivery

1. Complete Setup + Foundational.
2. Add User Story 1 → Test independently → Confirm CPU fix.
3. Add User Story 2 → Test independently → Confirm collaborative editing still works.
4. Add User Story 3 → Test independently → Confirm bundle size and input latency improvements.

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- NO TESTS are to be written as per the project Constitution.
