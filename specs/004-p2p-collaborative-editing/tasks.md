# Tasks: P2P Collaborative Editing

**Input**: Design documents from `/specs/004-p2p-collaborative-editing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project structure, targeting `components/editor/Editor.tsx` and `components/editor/Toolbar.tsx`.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Install the required CRDT and transport packages: `npm install yjs y-webrtc @slate-yjs/core`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Implement `useEffect` in `components/editor/Editor.tsx` to instantiate `Y.Doc` and `WebrtcProvider` (pointing to "test-document-room") on mount, and properly destroy them on unmount.
- [X] T003 Wrap the Slate `editor` initialization with `withYjs(editor, sharedType)` from `@slate-yjs/core` in `components/editor/Editor.tsx`.

**Checkpoint**: Foundation ready - the CRDT state backend is active and bound to the editor.

---

## Phase 3: User Story 1 - Local Peer-to-Peer Real-time Typing (Priority: P1) 🎯 MVP

**Goal**: Users need to co-edit a document in real-time with peers on the same local network or connected via WebRTC signaling, without relying on a central backend database.

### Implementation for User Story 1

- [X] T004 [US1] Remove the local `initialValue` default from `useState` in `components/editor/Editor.tsx` and let the `Y.Doc` dictate the starting state (if empty, insert a default paragraph node).
- [X] T005 [US1] Add a `connectionStatus` state in `components/editor/Editor.tsx` that listens to `provider.on('status', ...)` and `provider.on('synced', ...)` to track if WebRTC is connected.
- [X] T006 [US1] Update `components/editor/Toolbar.tsx` to accept a `connectionStatus` prop.
- [X] T007 [US1] Render a visual indicator (e.g., colored dot or badge) in `components/editor/Toolbar.tsx` representing the connection state (Connecting / Online / Offline).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently across multiple browser tabs.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T008 Run the quickstart validation scenarios defined in `specs/004-p2p-collaborative-editing/quickstart.md` to ensure formatting syncs correctly and conflicts resolve without exceptions.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- The provider must be fully integrated before the connection status indicator can be wired up.

### Parallel Opportunities

- Due to the high interdependence of the `Editor.tsx` component structure for this integration, sequential execution is recommended to prevent merge conflicts in the editor hooks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently by opening two browser tabs and typing simultaneously.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Avoid cross-story dependencies that break independence
