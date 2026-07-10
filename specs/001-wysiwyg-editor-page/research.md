# Research & Technical Decisions: WYSIWYG Editor Page

## Slate.js Integration with Next.js App Router
- **Decision**: Render the Slate editor component purely on the client side using the `"use client"` directive.
- **Rationale**: Slate relies heavily on DOM APIs (Selection, Range) which are not available during Server-Side Rendering (SSR). Next.js App Router defaults to Server Components, so any component importing `slate-react` must be marked as a Client Component.
- **Alternatives considered**: None. Client-side rendering is strictly required for rich text editors in React.

## Canvas Layout & Aspect Ratio
- **Decision**: Use Tailwind's `min-h-[141.4vw]` (or similar ratio calculation based on container width) combined with a `max-w-4xl` container to simulate an A4 page's minimum height. The container will NOT have `overflow-y: scroll`, allowing it to expand naturally.
- **Rationale**: The specification requires the canvas to have an initial minimum shape matching an A4 aspect ratio (1:1.414) but must auto-grow vertically as content is added. Using `min-height` combined with responsive width achieves this while allowing the natural DOM flow to expand the container height for long text.
- **Alternatives considered**: Fixed height with internal scroll (rejected by explicit user clarification to use auto-grow).

## Design System (Radix-UI / shadcn)
- **Decision**: Use shadcn CLI to initialize the base components and utility functions (`cn`, `clsx`, `tailwind-merge`). The editor toolbar will leverage Radix UI primitives (e.g., Toolbar, Toggle) styled via shadcn.
- **Rationale**: shadcn provides highly customizable, accessible components built on Radix-UI that integrate seamlessly with Tailwind CSS, strictly adhering to the requested tech stack.
- **Alternatives considered**: Building components from scratch (rejected due to explicit request for shadcn and Radix-UI).

## Canvas Styling
- **Decision**: Apply `bg-white shadow-xl ring-1 ring-gray-200` to the editor canvas container, and `bg-slate-50` (or similar off-white) to the main page `<body>` or outer layout container.
- **Rationale**: Fulfills the requirement for a pure white canvas with a 3D elevated drop shadow effect against an off-white background.
