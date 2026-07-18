# Research: P2P Collaborative Editing

## Configuration of `yjs` and `y-webrtc`
- **Decision**: Initialize a `Y.Doc` and bind it to a `WebrtcProvider` with the room name `"test-document-room"`.
- **Rationale**: Meets the Phase 1 requirement of local P2P sync without a backend. The default signaling servers bundled with `y-webrtc` will broker the WebRTC connections between peers.
- **Alternatives considered**: Using `y-websocket` (rejected as it strictly requires a deployed backend server, violating Phase 1 constraints).

## Configuration of `slate-yjs`
- **Decision**: Use `@slate-yjs/core` to wrap the standard Slate editor using `withYjs(editor, sharedRoot)`. The `sharedRoot` will be a `Y.XmlText` object instantiated from the `Y.Doc`.
- **Rationale**: `@slate-yjs/core` provides native two-way synchronization between Slate's node tree and Yjs's CRDT document, abstracting away the operational transforms needed to merge states.
- **Alternatives considered**: Writing a custom Slate-to-Yjs bridge (rejected due to high complexity and maintenance burden).

## Editor Initialization & Provider Lifecycle
- **Decision**: Initialize the `Y.Doc` and `WebrtcProvider` inside a `useEffect` (or lazy-init ref) within the `Editor.tsx` component to ensure they are created only once per client session and properly destroyed/disconnected on unmount. 
- **Rationale**: Re-creating the `Y.Doc` or provider on every render would severe peer connections and cause data loss or duplication.
- **Alternatives considered**: Global module-level instantiation (rejected because Next.js SSR might cause issues if WebRTC is initialized on the server; client-side hooks ensure it only runs in the browser).
