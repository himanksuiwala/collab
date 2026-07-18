# Tasks: Keyboard Shortcuts

**Input**: Design documents from `/specs/003-keyboard-shortcuts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure, primarily targeting `components/editor/Editor.tsx`.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [x] T001 Verify `components/editor/Editor.tsx` structure and Slate imports (`useSlate`, `Editable`, `Transforms`, `Editor`) are ready for `onKeyDown` bindings.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Implement `isMod(event)` cross-platform modifier utility (checking `event.metaKey` on Mac and `event.ctrlKey` elsewhere) inside `components/editor/Editor.tsx`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Text Formatting Shortcuts (Priority: P1) 🎯 MVP

**Goal**: Users need to quickly apply rich text formatting (bold, italic, underline) using standard keyboard shortcuts without lifting their hands from the keyboard.

### Implementation for User Story 1

- [x] T003 [US1] Intercept `isMod(e) && e.key === 'b'` in `Editable`'s `onKeyDown` and toggle bold formatting in `components/editor/Editor.tsx`.
- [x] T004 [US1] Intercept `isMod(e) && e.key === 'i'` and toggle italic formatting in `components/editor/Editor.tsx`.
- [x] T005 [US1] Intercept `isMod(e) && e.key === 'u'` and toggle underline formatting in `components/editor/Editor.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Paragraph Breaks and Format Reset (Priority: P1)

**Goal**: Users need to reliably start a new paragraph with a clean slate of formatting when pressing the Enter key.

### Implementation for User Story 2

- [x] T006 [US2] Intercept the `Enter` key (when `e.shiftKey` is false) in `Editable`'s `onKeyDown` in `components/editor/Editor.tsx`.
- [x] T007 [US2] Execute `Transforms.splitNodes(editor)` on `Enter` to create the new paragraph block in `components/editor/Editor.tsx`.
- [x] T008 [US2] Execute `Editor.removeMark` for `bold`, `italic`, and `underline` immediately after splitting to clear cursor formatting state for the new paragraph in `components/editor/Editor.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Soft Line Breaks (Priority: P2)

**Goal**: Users need to insert a line break without creating a new structural paragraph block, maintaining tighter line spacing.

### Implementation for User Story 3

- [x] T009 [US3] Intercept `Shift+Enter` in `Editable`'s `onKeyDown` handler in `components/editor/Editor.tsx`.
- [x] T010 [US3] Execute `Editor.insertText(editor, '\n')` to insert a soft break without splitting the block node in `components/editor/Editor.tsx`.

**Checkpoint**: All user stories up to US3 should now be independently functional

---

## Phase 6: User Story 4 - Text Resizing Shortcuts (Priority: P2)

**Goal**: Users need keyboard shortcuts to quickly enlarge or shrink the selected text size.

### Implementation for User Story 4

- [ ] T011 [US4] Intercept `isMod(e) && e.shiftKey && e.key === '.'` (>) to increase font size in `components/editor/Editor.tsx`.
- [ ] T012 [US4] Intercept `isMod(e) && e.shiftKey && e.key === ','` (<) to decrease font size in `components/editor/Editor.tsx`.

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T013 Verify shortcut state changes correctly synchronize and highlight the active buttons in `components/editor/Toolbar.tsx`.
- [ ] T014 Run validation scenarios described in `specs/003-keyboard-shortcuts/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2)

### Within Each User Story

- Since all modifications are within the same `onKeyDown` handler in `Editor.tsx`, implement handlers sequentially to avoid merge conflicts.
- Story complete before moving to next priority.

### Parallel Opportunities

- Minimal parallel opportunities exist for this specific feature because all tasks target a single function (`onKeyDown` within `components/editor/Editor.tsx`). Parallelization is not recommended to avoid git conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Test independently 
4. Add User Story 3 → Test independently 
5. Add User Story 4 → Test independently 
6. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Avoid cross-story dependencies that break independence
