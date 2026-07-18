# Implementation Tasks: Hyperlink Support & Toolbar Reordering

**Feature Branch**: `008-hyperlink-support`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Implementation Strategy
We will implement the required components iteratively: MVP first (Shadcn Popover and Slate inline node structures), followed by the keyboard shortcuts, toolbar integration, and finally the edit/delete state logic.

---

## Phase 1: Setup

- [X] T001 Install/initialize `popover` and `input` components from shadcn using `npx shadcn@latest add popover input`.

## Phase 2: Foundational

- [X] T002 Implement the `renderElement` block logic in `components/editor/Editor.tsx` to natively support rendering the `link` custom element (displaying the `<a href={url} target="_blank" rel="noopener noreferrer">` tag).
- [X] T003 Update the `isInline` constraint in `components/editor/Editor.tsx` to explicitly ensure `link` nodes are treated as inline elements so they flow within text blocks rather than breaking them.
- [X] T004 Reorder the toolbar items in `components/editor/Toolbar.tsx` to match the agreed sequence: Font Type > Font Size > Formatting (Bold, Italic, Underline) > Alignment > Lists > Image.

## Phase 3: User Story 1 (Adding a Link via Keyboard)

**Story Goal**: Users can select text, press Cmd+K, and insert a hyperlink via a contextual popover.

- [X] T005 [P] [US1] Create a new `components/editor/LinkPopover.tsx` component that renders a `Popover` containing a URL `<Input>` and "Save" / "Delete" buttons.
- [X] T006 [US1] Add state management (`isLinkPopoverOpen`, `linkSelection`, `linkUrl`) to `components/editor/Editor.tsx` to control the `LinkPopover` visibility and anchor.
- [X] T007 [US1] Implement the `Cmd/Ctrl+K` keyboard shortcut in the `onKeyDown` handler of `components/editor/Editor.tsx` to capture the current `editor.selection` and open the popover.
- [X] T008 [US1] Implement the "Save" action in `components/editor/Editor.tsx` to execute `Transforms.wrapNodes(editor, { type: 'link', url, children: [] }, { split: true })` and close the popover.

## Phase 4: User Story 2 (Adding a Link via Toolbar)

**Story Goal**: Users can click a "Link" icon in the toolbar to trigger the exact same popover workflow.

- [X] T009 [US2] Add a new "Link" icon button (`LinkIcon` from `lucide-react`) to the formatting group in `components/editor/Toolbar.tsx`.
- [X] T010 [US2] Expose a `onOpenLinkPopover` callback from `Editor.tsx` and pass it to `Toolbar.tsx`.
- [X] T011 [US2] Bind the Toolbar "Link" button to trigger `onOpenLinkPopover`, capturing the current selection and opening the same popover built in US1.

## Phase 5: User Story 3 & 4 (Editing and Removing Links)

**Story Goal**: Users can click an existing link to modify its URL or remove the hyperlink entirely while preserving the text.

- [X] T012 [US3] Detect if the cursor is already inside a `link` element when `Cmd+K` or the Toolbar button is pressed. If so, pre-fill the popover's URL input with the existing `url`.
- [X] T013 [US3] Update the "Save" action to use `Transforms.setNodes(editor, { url })` instead of `wrapNodes` if editing an existing link.
- [X] T014 [US4] Implement the "Delete" action in `LinkPopover` to execute `Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })` to safely remove the link wrapper.

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T015 Ensure `LinkPopover` auto-focuses the URL input when opened for maximum keyboard efficiency.
- [X] T016 Apply standard hyperlink styling to the `link` element renderer (`text-blue-600 underline cursor-pointer`) in `Editor.tsx`.

---

## Dependencies & Execution Order
- Phase 1 & 2 must be completed first to establish the DOM structure and dependencies.
- US1 acts as the core controller. The popover UI and Slate `wrapNodes` logic are built here.
- US2 depends directly on US1's state logic, merely adding a secondary trigger (`Toolbar`).
- Phase 5 (US3 & US4) extends the base insertion logic to handle mutations and deletions.

## Parallel Execution Examples
- T005 (building the visual `LinkPopover.tsx` component) can be built in parallel with T002-T004 (Foundational Slate logic), as they do not strictly depend on each other until wiring in T006.
