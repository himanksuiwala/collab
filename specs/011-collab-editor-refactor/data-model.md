# Data Model: Collab Editor Refactor

This feature primarily refactors existing code, so the data model is not changing structurally, but how we interact with it in React state is changing.

## React State Models

### `activeCollabsRef` (String)
A new ref introduced in `useRemoteCursors.ts` to prevent continuous global context updates.
- **Type**: `string`
- **Format**: Comma-separated list of active client IDs (e.g., `"123,456,789"`).
- **Usage**: Used to check if the exact composition of active users has changed before triggering `updateCollaborators`.

## Existing Entities (Unchanged)

### `CursorRect`
- **id**: string (client ID from Yjs)
- **clientId**: number
- **data**: `CursorData` (name, color)
- **caretRect**: `{ top: number, left: number, height: number }`
- **selectionRects**: `Array<{ top: number, left: number, height: number, width: number }>`

### `Collaborator`
- **clientId**: number
- **data**: `CursorData`
