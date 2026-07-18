# Implementation Tasks: Image Upload & Optimistic UI

**Feature Branch**: `007-image-upload`
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Implementation Strategy
We will implement the required components iteratively: MVP first (Toolbar Image Picker + Slate Custom Elements), followed by Clipboard intercepting.

---

## Phase 1: Setup

- [X] T001 Install/initialize `sonner` for Toast notifications using `npx shadcn-ui@latest add sonner` or manually creating `components/ui/sonner.tsx`.
- [X] T002 Integrate `<Toaster />` from `sonner` into the root application layout `app/layout.tsx`.

## Phase 2: Foundational

- [X] T003 Implement the `renderElement` block logic in `components/editor/Editor.tsx` to natively support rendering the `image` custom element (displaying the `<img />` tag with `url`).
- [X] T004 Implement the `renderElement` block logic in `components/editor/Editor.tsx` to natively support rendering the `image-loading` custom element (displaying a glassmorphic loading spinner block).
- [X] T005 Update the `normalizeNode` constraint in `components/editor/Editor.tsx` to explicitly allow `image` and `image-loading` nodes to be treated as void-like blocks (if required) or ensure they don't break paragraph flow.

## Phase 3: User Story 1 (Image Insertion via Toolbar)

**Story Goal**: Users can insert images via a dedicated toolbar button with instant optimistic feedback, robust validation, and automatic syncing.

- [X] T006 [US1] Add a new "Insert Image" icon button (`ImageIcon` from `lucide-react`) to the toolbar layout in `components/editor/Toolbar.tsx`.
- [X] T007 [US1] Bind a hidden `<input type="file" accept="image/*" />` to the new toolbar button in `components/editor/Toolbar.tsx`.
- [X] T008 [US1] Implement file validation (`< 5MB` check) upon file selection in `components/editor/Toolbar.tsx`. Throw `toast.error` if validation fails.
- [X] T009 [US1] Implement optimistic Yjs insertion logic in `components/editor/Toolbar.tsx`: Generate a UUID and call `Transforms.insertNodes` with the `image-loading` block.
- [X] T010 [US1] Wire the successful file selection to the `uploadImageToCloudinary` function from `cloudinary.ts` inside `components/editor/Toolbar.tsx`.
- [X] T011 [US1] Handle upload promise resolution in `components/editor/Toolbar.tsx`: `Transforms.setNodes` to swap `image-loading` for `image` containing the returned URL.
- [X] T012 [US1] Handle upload promise failure in `components/editor/Toolbar.tsx`: `Transforms.removeNodes` to clean up the loading block and pop a `toast.error()`.

## Phase 4: User Story 2 (Image Insertion via Clipboard Paste)

**Story Goal**: Users can effortlessly paste images from their system clipboard directly into the editor workflow.

- [X] T013 [P] [US2] Intercept the `onPaste` event in the `<Editable />` component inside `components/editor/Editor.tsx`.
- [X] T014 [US2] Extract `image/*` files from `e.clipboardData.items` inside the paste handler in `components/editor/Editor.tsx`.
- [X] T015 [US2] Re-use the optimistic insertion, validation, and Cloudinary upload pipeline (built in US1) to handle the extracted clipboard file in `components/editor/Editor.tsx`. Prevent default paste behavior if an image is successfully captured.

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T016 Ensure the image node rendering (`components/editor/Editor.tsx`) visually scales beautifully within the editor bounds (`max-w-full h-auto` with subtle borders/radius) to maintain the premium UI aesthetic.
- [X] T017 Verify that pressing `Enter` while focused immediately after an image block safely creates a new normal paragraph below it.

---

## Dependencies & Execution Order
- Phase 1 & 2 are foundational and MUST be completed first.
- US1 acts as the core pipeline constructor. All upload and resolution logic is built here.
- US2 depends directly on US1's logic being mature, as it merely wires a secondary trigger (`onPaste`) to the same upload pipeline.

## Parallel Execution Examples
- T013 (intercepting paste events) can be built in parallel with T006-T012, as the payload extraction is independent of the final upload pipeline.
