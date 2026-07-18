---
description: "Task list template for feature implementation"
---

# Tasks: Rich Text Formatting

**Input**: Design documents from `/specs/006-rich-text-formatting/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install Radix UI Dropdown Menu primitives by running `npx shadcn@latest add dropdown-menu` in the project root to generate `components/ui/dropdown-menu.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Update `CustomElement` type definitions in `components/editor/Editor.tsx` to include `heading-one`, `heading-two`, `bulleted-list`, `numbered-list`, and `list-item`.
- [x] T003 Update the `Element` render function in `components/editor/Editor.tsx` to map the new element types to their respective React DOM nodes (`<h1>`, `<h2>`, `<ul>`, `<ol>`, `<li>`) with appropriate Tailwind typography classes.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Block Type Formatting (Headings) (Priority: P1) 🎯 MVP

**Goal**: Users need to structure their documents with semantic headings to organize content clearly.

### Implementation for User Story 1

- [x] T004 [US1] Create a new `BlockTypeDropdown` component within `components/editor/Toolbar.tsx` utilizing the Radix `DropdownMenu` with `side="top"`.
- [x] T005 [US1] Implement `toggleBlock` logic in `components/editor/Toolbar.tsx` (using `Transforms.setNodes`) to handle switching between Normal, Heading, and Sub-heading states, and bind it to the dropdown options.
- [x] T006 [US1] Update `onKeyDown` in `components/editor/Editor.tsx` to ensure hitting Enter at the end of a heading creates a new "paragraph" block instead of another heading block.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - List Formatting (Priority: P1)

**Goal**: Users need to create ordered (numbered) and unordered (bulleted) lists to group related items.

### Implementation for User Story 2

- [x] T007 [P] [US2] Add List and ListOrdered icons from `lucide-react` to `components/editor/Toolbar.tsx`.
- [x] T008 [US2] Implement `toggleList` logic in `components/editor/Toolbar.tsx` to handle wrapping/unwrapping text nodes in `list-item` and `bulleted-list`/`numbered-list` containers. Ensure it correctly downgrades Headings to normal list items as per edge cases.
- [x] T009 [US2] Update `onKeyDown` in `components/editor/Editor.tsx` to intercept `Enter` for standard list continuation and double-Enter for list termination/escape.
- [x] T010 [US2] Update `onKeyDown` in `components/editor/Editor.tsx` to intercept `Tab` and `Shift+Tab` to implement HTML-standard true nesting list indentation and outdentation.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Toolbar UI Consolidation & Polish (Priority: P2)

**Goal**: Users need a clean, uncluttered toolbar where related options (like alignment) are grouped logically, and all icons are visually aligned.

### Implementation for User Story 3

- [x] T011 [US3] Replace the individual text alignment buttons in `components/editor/Toolbar.tsx` with a new `AlignmentDropdown` utilizing Radix `DropdownMenu` (`side="top"`).
- [x] T012 [US3] Configure the `AlignmentDropdown` trigger button to dynamically render the icon of the *first selected block's* active alignment state.
- [x] T013 [US3] Refactor the Flexbox layout wrappers around the Bold, Italic, and Underline buttons in `components/editor/Toolbar.tsx` to fix the visual misalignment (ensure perfectly centered `items-center` and unified bounding boxes).

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 Run `quickstart.md` manual validation scenarios to ensure functionality.

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

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Modifies `Toolbar.tsx` so best done after US1 and US2 to avoid git conflicts if parallelized.

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Since US1 is primarily contained in Editor.tsx and Toolbar.tsx, a single developer should execute it sequentially.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
