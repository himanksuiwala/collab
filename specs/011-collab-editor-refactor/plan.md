# Implementation Plan: Collab Editor Refactor

**Branch**: `011-collab-editor-refactor` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-collab-editor-refactor/spec.md`

## Summary

Refactor the Collab Editor to eliminate performance bottlenecks (specifically the 60fps cursor loop), break down the massive 700-line `Editor.tsx` into smaller, single-purpose components and custom hooks, and optimize the production bundle by removing barrel imports.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: React, Next.js, Slate (slate-react, @slate-yjs/core), Yjs, lucide-react

**Storage**: IndexedDB (y-indexeddb)

**Target Platform**: Web browser (client-side React components)

**Project Type**: Next.js Web Application 

**Performance Goals**: 
- Eliminate continuous React re-renders when idle (baseline 0-1% CPU).
- Maintain sub-16ms render times during rapid typing (no input lag).

**Constraints**:
- Strict adherence to project constitution (Absolutely No Testing).
- Minimal dependencies (optimize existing `lucide-react` instead of adding new libs).

**Scale/Scope**: Refactoring a single complex component ecosystem (`Editor.tsx`, `Toolbar.tsx`, `CursorOverlay.tsx`, `useRemoteCursors.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Code**: Passes. The primary goal of this feature is to break down monolithic code into clean, readable hooks and components.
- **Simple/Minimal UX**: Passes. No UX changes, purely architectural.
- **Responsive Design**: Passes. Existing UI remains unchanged.
- **Minimal Dependencies**: Passes. We are actively optimizing bundle size.
- **Absolutely No Testing**: Passes. No tests are being planned or written.

## Project Structure

### Documentation (this feature)

```text
specs/011-collab-editor-refactor/
├── plan.md              # This file
├── research.md          # Architecture decisions
├── data-model.md        # State representations
└── quickstart.md        # Validation scenarios
```

### Source Code (repository root)

```text
app/
├── globals.css
├── layout.tsx
├── page.tsx
components/
├── CollaboratorsContext.tsx
├── Header.tsx
├── editor/
│   ├── Editor.tsx              # Slimmed down wrapper
│   ├── EditorCore.tsx          # The actual Slate editor layout
│   ├── Toolbar.tsx             # Refactored (no inline components)
│   ├── CursorOverlay.tsx       # Refactored (event-driven updates)
│   ├── ComparisonView.tsx
│   ├── LinkPopover.tsx
│   ├── VersionHistorySidebar.tsx
│   ├── Elements.tsx            # Extracted Slate elements (Leaf, Element)
│   └── ZoomWrapper.tsx         # Extracted state wrapper
hooks/
├── useCollabEditor.ts          # Extracted Yjs/WebRTC setup
├── useEditorShortcuts.ts       # Extracted keyboard event handling
├── useImageUpload.ts           # Extracted image paste logic
└── useRemoteCursors.ts         # Refactored to debounce/throttle
```

**Structure Decision**: The source code relies on the existing Next.js App Router structure. We are expanding the `hooks/` directory and adding smaller component files into `components/editor/` to extract logic out of `Editor.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations.*
