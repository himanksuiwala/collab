# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement real-time multiplayer awareness (remote cursors and user avatars) using `@slate-yjs/core`'s `withCursors` plugin and Yjs `Awareness` protocol. Render floating colored carets using absolute positioning (`CursorOverlay`) and overlapping profile icons in the header. Use tiny hardcoded adjective-animal arrays for name generation to minimize dependencies.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript / Next.js (React 19)

**Primary Dependencies**: `yjs`, `y-webrtc`, `@slate-yjs/core`, `lucide-react`

**Storage**: In-memory (P2P WebRTC)

**Target Platform**: Web Browsers

**Project Type**: Next.js Web Application

**Performance Goals**: <100ms visual latency for cursor movement

**Constraints**: Absolutely no testing. Clean UX. Minimal dependencies.

**Scale/Scope**: Small P2P collaborative rooms (2-10 users).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Clean Code**: Kept custom hooks separated from components (`useRemoteCursors`).
- ✅ **Simple/Minimal UX**: Used overlapping clean colored circles for avatars instead of cluttered panels.
- ✅ **Minimal Dependencies**: Implemented custom random name generator instead of installing external wordlist packages.
- ✅ **Absolutely No Testing**: Validated via manual `quickstart.md` procedures without creating automated tests.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/
│   ├── editor/
│   │   ├── Editor.tsx            # Updated to initialize withCursors
│   │   ├── CursorOverlay.tsx     # New: Renders floating remote carets
│   │   └── Toolbar.tsx           # Existing toolbar
│   └── layout/
│       └── Header.tsx            # Updated to accept/render active users
└── hooks/
    └── useRemoteCursors.ts       # New: Subscribes to CursorEditor changes
```

**Structure Decision**: Added new specific components for cursor rendering and a custom hook to isolate awareness subscription logic, integrating into the existing Next.js App Router structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
