# Implementation Plan: Image Upload & Optimistic UI

**Branch**: `007-image-upload` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-image-upload/spec.md`

## Summary

Implement optimistic image uploads into the collaborative rich text editor via the toolbar or clipboard paste. Images will instantly appear as placeholder loading blocks, seamlessly syncing to peers via Yjs, before finalizing with secure Cloudinary URLs upon successful upload.

## Technical Context

**Language/Version**: TypeScript, React 18, Next.js 14 (App Router)

**Primary Dependencies**: `slate`, `slate-react`, `slate-yjs`, `yjs`, Cloudinary API

**Storage**: External Cloudinary Storage (API)

**Target Platform**: Web Browsers (Desktop & Mobile)

**Project Type**: Collaborative Rich Text Editor

**Performance Goals**: <100ms visual feedback (optimistic UI) for insertions

**Constraints**: Max 5MB file size limit per image

**Scale/Scope**: Handling concurrent distributed file insertions over WebRTC

## Constitution Check

*GATE: Passed*

- **Clean Code**: Will cleanly separate Cloudinary API utility from Slate rendering logic.
- **Simple/Minimal UX**: Integrating Shadcn `sonner` for minimal, non-intrusive toast errors.
- **Responsive Design**: Images will be styled with `max-w-full h-auto` to scale appropriately within the editor canvas.
- **Minimal Dependencies**: Reusing existing `cloudinary.ts` and `lucide-react`. No new libraries.
- **Absolutely No Testing**: Validated. Zero automated testing frameworks will be used.

## Project Structure

### Documentation (this feature)

```text
specs/007-image-upload/
├── plan.md              # This file
├── research.md          # Implementation patterns and decisions
├── data-model.md        # Slate custom element schemas
├── quickstart.md        # Manual validation guide
└── tasks.md             # Task decomposition (to be generated)
```

### Source Code

```text
components/
├── editor/
│   ├── Editor.tsx       # Add Image/Loading Element renderers & paste handlers
│   └── Toolbar.tsx      # Add image upload button and file picker logic
├── ui/                  
│   └── sonner.tsx       # Toast notification UI (Shadcn)
cloudinary.ts            # Existing utility for uploads
```

**Structure Decision**: Extending the existing `editor` component structure. We will implement Slate block handlers in `Editor.tsx` and UI triggers in `Toolbar.tsx`.

## Complexity Tracking

None. All implementations align with standard Slate block rendering and standard Cloudinary HTTP uploads.
