---
description: "Task list for IndexedDB Persistence implementation"
---

# Tasks: IndexedDB Persistence

**Input**: Design documents from `/specs/009-indexeddb-persistence/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and package installation

- [x] T001 Run `npm install y-indexeddb` to add the local persistence provider dependency.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

*(No specific backend foundational tasks required for this frontend-only feature. Yjs document is already set up in `components/editor/Editor.tsx`.)*

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Local Persistence & Lifecycle Management (Priority: P1) 🎯 MVP

**Goal**: Seamlessly persist the Yjs document to IndexedDB, block the UI/network until local state is fully restored, and provide visual auto-save feedback.

### Implementation for User Story 1

- [x] T002 [US1] Import `IndexeddbPersistence` from `y-indexeddb` in `components/editor/Editor.tsx`.
- [x] T003 [US1] Add a new `isLocalSynced` boolean state (default `false`) and a `saveStatus` string state (default `"saved"`) to `components/editor/Editor.tsx`.
- [x] T004 [US1] Refactor the main initialization `useEffect` in `components/editor/Editor.tsx`: Instantiate `IndexeddbPersistence` binding it to the `Y.Doc` using room name `"test-document-room"`.
- [x] T005 [US1] Inside the same `useEffect`, add an event listener for `provider.on("synced", ...)` on the `IndexeddbPersistence` instance to set `isLocalSynced` to `true`.
- [x] T006 [US1] Modify the `WebrtcProvider` initialization to ONLY occur *after* the local IndexedDB provider emits the `synced` event (or move WebrtcProvider initialization into a dependent `useEffect` checking `isLocalSynced`).
- [x] T007 [US1] Ensure `.destroy()` is called on the `IndexeddbPersistence` instance within the `useEffect` cleanup function to prevent memory leaks.
- [x] T008 [US1] Add a conditional render early-return in `components/editor/Editor.tsx` to display a "Loading Document..." UI while `isLocalSynced` is `false`, blocking the `<Slate>` component mount.
- [x] T009 [US1] Add a debounced save handler (e.g., using `setTimeout` or a custom debounce hook) triggered by the `<Editable>`'s `onChange` event (via `<Slate onChange={...}>`) that sets `saveStatus` to `"saving"` immediately and `"saved"` after 1000ms.
- [x] T010 [US1] Update the bottom-right connection status chip in `components/editor/Editor.tsx` to display the `saveStatus` alongside the network status.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently by reloading the page offline.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T011 [P] Run `npx tsc --noEmit` to verify type safety of the new provider implementation.
- [x] T012 Run quickstart.md validation steps (Offline editing and tab refresh).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A
- **User Stories (Phase 3+)**: All depend on Phase 1 completion.
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup.

### Parallel Opportunities

- T011 and T012 can be executed in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Test offline reload behavior.
4. Execute Polish phase.
