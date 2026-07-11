# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a minimalist, sticky formatting toolbar for the WYSIWYG editor supporting bold, italic, underline, paragraph alignment, font size adjustment (+/-), and a hybrid zoom control.

## Technical Context

**Language/Version**: TypeScript (ES6+ arrow functions)

**Primary Dependencies**: Next.js, React, Tailwind CSS, shadcn/ui, Radix-UI, slate, slate-react

**Storage**: Ephemeral (in-memory)

**Target Platform**: Web (Desktop & Mobile browsers)

**Project Type**: Web Application

**Performance Goals**: Formatting actions applied in <100ms.

**Constraints**: Minimalist UI, toolbar height <60px on desktop, sticky positioning.

**Scale/Scope**: Single page UI element (Toolbar) and Slate.js command integrations.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Code**: Verified. Uses standard Slate block/mark paradigms.
- **Simple/Minimal UX**: Verified. The toolbar relies heavily on icons and `+`/`-` buttons rather than complex menus, staying <60px tall.
- **Responsive Design**: Verified. Zoom and layout will accommodate varying screen sizes safely.
- **Minimal Dependencies**: Verified. Reusing existing Shadcn/Radix and Slate dependencies; no new external libraries introduced.
- **Absolutely No Testing**: Verified. No testing frameworks will be used or mentioned in the implementation.

*Status: PASSED*

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
```text
components/
├── editor/
│   ├── Editor.tsx       # Modified to include zoom scale logic and render Toolbar
│   └── Toolbar.tsx      # New: Sticky minimalist toolbar component
```

**Structure Decision**: Place the new `Toolbar.tsx` alongside `Editor.tsx` in `components/editor/` for cohesion. The `Editor.tsx` file will be updated to handle zoom state and render the toolbar.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*(No violations. Plan adheres strictly to the constitution).*
