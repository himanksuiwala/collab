# Implementation Plan: Rich Text Formatting

**Branch**: `006-rich-text-formatting` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-rich-text-formatting/spec.md`

## Summary

Implement Headings, Nested Lists, and UI consolidated dropdowns (Block Type and Alignment) in the rich-text collaborative editor using Radix UI primitives configured to load upwards (`side="top"`).

## Technical Context

**Language/Version**: TypeScript / React 19 / Next.js 16
**Primary Dependencies**: Slate.js, Yjs, Lucide React, Radix UI (Dropdown Menu)
**Storage**: WebRTC / CRDT memory (Yjs)
**Target Platform**: Web browsers
**Project Type**: Web Application
**Performance Goals**: Instant formatting without sync lag
**Constraints**: Absolutely No Testing (per constitution), Minimal Dependencies (use Radix/shadcn).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Code**: Adhere to functional React patterns and clean modular components.
- **Minimal Dependencies**: Reusing Radix UI as instructed (standard for shadcn). No extraneous libs.
- **Absolutely No Testing**: No unit or e2e test files will be generated.
- **Styling**: Tailwind CSS with standard design system matching.

## Project Structure

### Documentation (this feature)

```text
specs/006-rich-text-formatting/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
components/
├── ui/
│   └── dropdown-menu.tsx     # To be added/configured via Radix UI
├── editor/
│   ├── Editor.tsx            # Needs keyboard shortcuts for lists
│   ├── Toolbar.tsx           # UI consolidation for Block Types and Alignment
│   └── plugins/              # (if needed) for list toggling/nesting logic
```

**Structure Decision**: Single project Next.js app layout (`components/editor` and `components/ui`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
