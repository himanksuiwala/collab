# Implementation Plan: Hyperlink Support & Toolbar Reordering

**Branch**: `008-hyperlink-support` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

## Summary

Implement hyperlink support allowing users to select text and wrap it in a `link` inline element via a `Cmd/Ctrl + K` shortcut or a toolbar button. The URL input will be handled via a `shadcn/ui` Popover component that provides "Save" and "Delete" functionality. The toolbar items will also be reordered to a standard intuitive sequence.

## Technical Context

**Language/Version**: TypeScript, React 18, Next.js 14

**Primary Dependencies**: `slate`, `slate-react`, `lucide-react`, `shadcn/ui` (Popover, Input, Button)

**Target Platform**: Web Browsers

**Project Type**: Collaborative Rich Text Editor

**Performance Goals**: Popover renders instantly; seamless typing over links.

**Constraints**: Yjs syncing must correctly handle inline elements without breaking collaborative awareness.

## Constitution Check

*GATE: Passed*
- **Clean Code**: Leveraging `shadcn/ui` for the popover ensures clean, reusable, accessible UI code.
- **Simple/Minimal UX**: The contextual popover keeps the URL management close to the text, rather than disrupting the flow with full-page modals.
- **Absolutely No Testing**: Validated. Zero automated testing frameworks will be used.

## Project Structure

### Documentation
```text
specs/008-hyperlink-support/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code

```text
components/
├── editor/
│   ├── Editor.tsx       # Add 'link' custom element, onKeyDown (Cmd+K)
│   ├── Toolbar.tsx      # Reorder toolbar, add Link button
│   └── LinkPopover.tsx  # [NEW] Extract the popover logic into a reusable component
├── ui/                  
│   ├── popover.tsx      # [NEW] via shadcn
│   ├── input.tsx        # [NEW] via shadcn
│   └── button.tsx       # (Assuming standard buttons exist or will use raw html/tailwind if not)
```

**Structure Decision**: We will abstract the link creation UI into a `LinkPopover.tsx` component that can be triggered either by the Toolbar button or the Keyboard shortcut.

## Complexity Tracking
None. Using standard inline Slate nodes and Radix UI popovers.
