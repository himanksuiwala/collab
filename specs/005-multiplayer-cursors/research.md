# Research & Technical Decisions: Multiplayer Cursors & Awareness

## 1. Awareness State Management
- **Decision**: Use `@slate-yjs/core`'s `withCursors` and `CursorEditor` APIs to interface directly with `y-webrtc`'s Awareness protocol.
- **Rationale**: The library natively handles translating Slate `Range` objects to Yjs relative positions and broadcasting them over the Awareness channel. It completely abstracts the complex index-mapping math. It allows attaching custom data (like user names and colors) during initialization via `withCursors(editor, provider.awareness, { data: { name, color } })`.
- **Alternatives considered**: Manually listening to `provider.awareness.on('update')`. Rejected because translating Slate paths to Yjs relative positions manually is error-prone and reinvents what `@slate-yjs/core` already provides.

## 2. Cursor Rendering Strategy
- **Decision**: Render a React `CursorOverlay` component that sits absolutely positioned over the `<Editable />` canvas.
- **Rationale**: Rendering floating UI (carets and name badges) is best achieved outside of the Slate document model. By iterating through `CursorEditor.cursorStates(editor)`, we can use `ReactEditor.toDOMRange(editor, range)` to calculate the exact X/Y pixel coordinates of remote selections, and place colored `div` carets accurately on screen.
- **Alternatives considered**: Using Slate's `decorate` prop. Rejected because `decorate` only applies inline text formatting (like highlighting), making it very difficult to render out-of-bounds floating carets or name flags without disrupting the DOM structure that Slate expects.

## 3. Pseudonym Generation
- **Decision**: Use two tiny hardcoded arrays (`ADJECTIVES` and `ANIMALS`) inside a utility function to generate names like "Anonymous Panda", alongside a random Hex color generator.
- **Rationale**: Satisfies the spec's requirement for recognizable, ephemeral names without violating the project Constitution's strict "Minimal Dependencies" rule.
- **Alternatives considered**: Importing libraries like `unique-names-generator`. Rejected due to the strict minimal dependencies mandate.

## 4. State Synchronization
- **Decision**: Use a custom React hook `useRemoteCursors` to subscribe to `CursorEditor.on(editor, 'change')` and trigger re-renders when awareness state changes.
- **Rationale**: Decouples the awareness logic from the main `Editor` component, keeping the codebase clean.
- **Alternatives considered**: Managing state inside the main Editor `useEffect`. Rejected because it creates a monolithic component.
