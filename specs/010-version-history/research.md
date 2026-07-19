# Technical Research: Version History

## 1. Persistent User Identity

- **Decision**: Generate a random name once using `lib/identity.ts` and persist it to browser `localStorage`.
- **Rationale**: `localStorage` ensures that when the user returns across sessions, their identity is stable, allowing the version history UI to correctly map historical document edits to the original author.
- **Alternatives considered**: Cookies or server-side DB. Rejected because we are building a local/P2P-first app without a backend database.

## 2. Capturing Document Snapshots

- **Decision**: Store snapshots in a dedicated `Y.Map` (e.g., `doc.getMap('versions')`). Create snapshots using `Y.snapshot(doc)` triggered manually by a "Save Version" button.
- **Rationale**: `Y.snapshot()` creates a highly efficient bookmark of the current CRDT state vector. Storing these inside the Y.Doc itself via `Y.Map` means the history seamlessly syncs across WebRTC to all connected peers and persists to IndexedDB automatically.
- **Alternatives considered**: Saving plain JSON. Rejected because it breaks CRDT tracking and prevents computing rich diffs later.

## 3. Side-by-Side Comparison UI

- **Decision**: Build a right-aligned sliding sidebar (`VersionHistorySidebar.tsx`). When a snapshot is selected, use `Y.createDocFromSnapshot(doc, snapshot)` to reconstruct the historical Y.Doc. Render a second `Slate` editor instance (`ComparisonView.tsx`) passing it the reconstructed read-only doc.
- **Rationale**: `Y.createDocFromSnapshot` perfectly restores the document to its past state without affecting the live document. Rendering a secondary Slate editor allows us to leverage existing rendering logic.
- **Alternatives considered**: Custom diffing algorithm. Rejected because `yjs` native snapshotting solves this natively.

## 4. Author Attribution & Highlighting

- **Decision**: Intercept Slate `insertText` operations and attach an `authorName` custom property to the inserted Slate `Text` nodes. In comparison mode, the leaf renderer applies a unique CSS background color based on the `authorName`.
- **Rationale**: Slate-Yjs translates custom text node properties seamlessly into Yjs formatting attributes.
- **Alternatives considered**: Using Yjs awareness. Rejected because awareness is ephemeral (online presence only) and doesn't persist into historical document snapshots.
