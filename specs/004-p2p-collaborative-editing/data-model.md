# Data Model: P2P Collaborative Editing

## Entities

### `Y.Doc` (Collaborative Document)
The `Y.Doc` is the core CRDT instance that stores all shared state and resolves concurrent edit conflicts using Vector Clocks and Operational Transforms.

**Fields (Shared Types)**:
- `content` (`Y.XmlText`): The root shared type that stores the document's rich text tree. It perfectly mirrors the Slate node structure (e.g., `paragraph`, `text` leaves, and formatting marks).

### `WebrtcProvider` (Peer Connection Layer)
Manages the WebRTC signaling and peer-to-peer data channel connections to broadcast `Y.Doc` updates.

**Attributes**:
- `roomName` (`string`): A static identifier (`"test-document-room"`) used to locate peers on the signaling network.
- `connected` (`boolean`): Represents whether the provider has successfully connected to the signaling server and/or peers. Used to drive the UI connection status indicator.

## State Transitions

### Document Initialization
1. **Action**: `Editor.tsx` mounts.
2. **Transition**: A new `Y.Doc` is created, and the `WebrtcProvider` is instantiated, binding to `"test-document-room"`.
3. **Transition**: `@slate-yjs/core`'s `withYjs` decorator binds the Slate `editor` instance to the `Y.XmlText` content shared type.

### Remote Edit Received
1. **Action**: A peer types a character.
2. **Transition**: The `WebrtcProvider` receives the update over the WebRTC data channel.
3. **Transition**: `Y.Doc` merges the update into its CRDT model.
4. **Transition**: `slate-yjs` intercepts the Yjs event and fires a local Slate operation, triggering a React re-render with the new text.
