# Data Model: Multiplayer Cursors

## 1. Session Identity (CursorData)

This entity represents the static data associated with a user for the duration of their session. It is broadcasted via the Yjs Awareness protocol.

```typescript
export interface CursorData extends Record<string, unknown> {
  name: string;   // e.g., "Anonymous Panda"
  color: string;  // e.g., "#ef4444"
}
```

## 2. Cursor State

The active state of a user in the document, maintained by `@slate-yjs/core` and the Yjs Awareness protocol.

```typescript
export interface CursorState {
  clientId: number; // Unique Yjs client identifier
  data?: CursorData; // The user's Session Identity
  relativeSelection: RelativeRange | null; // The user's current selection, relative to the Yjs document
}
```

## 3. Cursor Rect (Render Model)

The computed screen coordinates for a remote cursor, used purely for rendering the React `CursorOverlay`.

```typescript
export interface CursorRect {
  clientId: number;
  data: CursorData;
  caretRect: {
    top: number;
    left: number;
    height: number;
  };
}
```

## Validation Rules & Behaviors

- **Random Generation**: The `CursorData` (name and color) MUST be generated once per page load (in `useEffect` or outside the render loop) and remain consistent for the lifecycle of that browser tab.
- **Client Mapping**: Remote cursors MUST be filtered to exclude the local user's own `clientId` (which can be obtained via `provider.awareness.clientID`).
- **Absence of Selection**: If `relativeSelection` is `null` (e.g., the user blurred the editor and we chose to clear it, though our spec says freeze), the cursor should ideally fall back to its last known position. Based on the clarification, we should prevent `null` from clearing the cursor entirely if possible, or intercept the `blur` event to prevent sending a `null` selection.
