# Implementation Plan: Version History & Comparison

**Branch**: `010-version-history` | **Date**: 2026-07-19 | **Spec**: [spec.md](file:///Users/suiwala/Workspace/collab/specs/010-version-history/spec.md)

**Input**: Feature specification from `/specs/010-version-history/spec.md`

## Summary

Implement a right-sided sidebar for version history and a side-by-side comparison mode in the Yjs-based Slate editor.
We will use a custom `Y.Map` to store document snapshots (`Y.snapshot`) and use `Y.createDocFromSnapshot()` to instantiate read-only copies of the editor for historical comparison. To map edits to authors, we will assign a persistent pseudo-random display name to users in `localStorage`, which gets attached as metadata to every text insertion in the Yjs document, enabling us to attribute historical edits via background color-coding.

## Technical Context

**Language/Version**: TypeScript / React / Next.js
**Primary Dependencies**: `yjs`, `slate`, `slate-react`, `@slate-yjs/core`, `lucide-react`
**Storage**: `y-indexeddb` for persistence, `localStorage` for identity
**Target Platform**: Modern web browsers
**Project Type**: Next.js Web App
**Performance Goals**: Responsive rendering of side-by-side comparison mode without lag.
**Constraints**: The historical version must be strictly read-only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/010-version-history/
├── plan.md              # This file
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code

```text
components/
└── editor/
    ├── Editor.tsx                    # Intercept typing, attach authorName, setup Y.Map for snapshots
    ├── VersionHistorySidebar.tsx     # New UI component for the right-sided sidebar
    ├── ComparisonView.tsx            # New UI component rendering two <Slate> instances side-by-side
lib/
└── identity.ts                       # Update to persist identity to localStorage
```

**Structure Decision**: The logic will be added directly into the existing `Editor` and extracted into `VersionHistorySidebar` and `ComparisonView` to keep the component tree maintainable.

## Complexity Tracking

N/A
