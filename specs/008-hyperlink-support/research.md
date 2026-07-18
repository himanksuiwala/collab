# Research & Technical Decisions: Hyperlinks

## Decision 1: UI Component for Link Input
- **Decision**: Use `shadcn/ui` `Popover` component (built on Radix UI).
- **Rationale**: The user explicitly requested to check for a Radix UI or shadcn component. The `Popover` is perfect for contextual, accessible overlays that anchor to specific DOM elements (like the toolbar button or a virtual selection rect).
- **Alternatives Considered**: Native `prompt()` (terrible UX), full-screen Modal (disrupts flow).

## Decision 2: Slate Element Type
- **Decision**: Links will be `inline` custom elements (`{ type: "link", url: string, children: [{ text: "..." }] }`).
- **Rationale**: Links inherently wrap text inside paragraphs and headings. Slate requires explicitly defining `isInline = (element) => element.type === 'link'` so it treats the node as text-flow rather than a block boundary.

## Decision 3: Toolbar Reordering
- **Decision**: Update `Toolbar.tsx` sequence to: BlockType (Font Type) > FontSize > Bold/Italic/Underline/Link > Alignment > Lists > Image.
- **Rationale**: This explicitly fulfills the Option A resolution from the requirements clarification phase.
