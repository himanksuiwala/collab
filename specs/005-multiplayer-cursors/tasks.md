---
description: "Task list for Multiplayer Cursors feature implementation"
---

# Tasks: Multiplayer Cursors & Awareness

**Input**: Design documents from `/specs/005-multiplayer-cursors/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Implement identity utility in `lib/identity.ts` to generate random Adjective-Animal names and hex colors (to minimize dependencies).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T002 Create `components/CollaboratorsContext.tsx` to hold the shared list of active users via React Context.
- [X] T003 Update `app/layout.tsx` to wrap the application in `<CollaboratorsProvider>`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Real-Time Remote Cursors (Priority: P1) 🎯 MVP

**Goal**: Users need to see exactly where their collaborators are currently reading or typing within the document.

### Implementation for User Story 1

- [X] T004 [P] [US1] Create custom hook `hooks/useRemoteCursors.ts` to subscribe to `CursorEditor.on('change')` and expose cursor states. Update the active users array in `CollaboratorsContext`.
- [X] T005 [P] [US1] Create `components/editor/CursorOverlay.tsx` to render floating absolute-positioned carets over the editor using `ReactEditor.toDOMRange`.
- [X] T006 [US1] Update `components/editor/Editor.tsx` to initialize `withCursors(editor, provider.awareness)`, setting local cursor data using `lib/identity.ts`.
- [X] T007 [US1] Integrate `<CursorOverlay />` and `useRemoteCursors` into `components/editor/Editor.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (remote carets should appear when multiple windows are open).

---

## Phase 4: User Story 2 - Active Collaborator Avatars (Priority: P1)

**Goal**: Users need to know who is currently viewing or editing the document with them at a glance by looking at the application header.

### Implementation for User Story 2

- [X] T008 [US2] Update `components/Header.tsx` to consume `CollaboratorsContext` and map active users into overlapping colored `UserCircle` profile avatars with tooltips.

**Checkpoint**: At this point, both remote cursors and the header avatars should correctly sync in real-time.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T009 Refine edge cases (e.g., cursor freezing on blur/unfocus) within `hooks/useRemoteCursors.ts` or `CursorOverlay.tsx`.
- [X] T010 Run `quickstart.md` manual validation scenarios to ensure functionality.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Hooks and Overlay components marked [P] in User Story 1 can be developed simultaneously before integration.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently using `quickstart.md`.
5. Proceed to User Story 2 when ready.
