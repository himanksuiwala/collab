# Feature Specification: P2P Collaborative Editing

**Feature Branch**: `004-p2p-collaborative-editing`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Now we need to upgrade this rich text editor to support collaborating editing using the CRDTs provided yjs. Instead of storing your editor's state in standard React useState hooks or Redux, will store it in a shared Y.Doc. For this implementation we shall be using y-webrtc to connect browser tabs p2p, without needing for backend server. We shall be using slate-yjs the editor binding the doc for the same could be accessed using running mcp server 'slate-yjs-docs'. For Phase 1: Local Peer-to-Peer Sync Before touching a backend, get synchronization working entirely in the browser. Install the core libraries: Add yjs and y-webrtc to your project. Initialize the Document: Create a new Y.Doc instance when your editor component mounts. Establish the Connection: Connect that Y.Doc to a WebrtcProvider, passing in a static room name (e.g., 'test-document-room'). Bind the Editor: Configure your headless editor framework to pull its state from the Y.Doc rather than local component state. If you open two tabs now, typing in one will instantly appear in the other."

## Clarifications

### Session 2026-07-18
- Q: Should the UI display a connection status indicator? → A: Yes, add a simple connection status indicator in the header or toolbar.
- Q: Should we include remote cursors/selections if easily supported? → A: Strictly exclude it for now; focus only on syncing document text and formatting.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Local Peer-to-Peer Real-time Typing (Priority: P1)

Users need to co-edit a document in real-time with peers on the same local network or connected via WebRTC signaling, without relying on a central backend database.

**Why this priority**: This is the core requirement (Phase 1) for upgrading the editor to a collaborative system. 

**Acceptance Scenarios**:

1. **Given** two users open the editor in separate browser tabs, **When** User A types a sentence, **Then** User B sees the text appear instantly on their screen.
2. **Given** two users are in the same editor room, **When** User B highlights a word and applies bold formatting, **Then** User A immediately sees that word become bold on their screen.
3. **Given** two users type at the exact same time on the same line, **Then** the CRDT resolves the conflict seamlessly without crashing or deleting data.

---

### Edge Cases

- What happens if a user makes edits while disconnected from the signaling server/peers? (Their edits remain in their local Y.Doc instance and sync automatically when connection is re-established).
- What happens if both users rapidly toggle formatting on the same text selection? (The CRDT will resolve it based on timestamp vectors, eventually converging on a single state across all clients).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST represent the editor's document state using a shared CRDT document structure instead of local component state.
- **FR-002**: System MUST establish a peer-to-peer connection for clients using a static room identifier (e.g., "test-document-room").
- **FR-003**: System MUST automatically sync document text, paragraphs, and inline formatting (bold, italic, underline, font size) across all connected peers.
- **FR-004**: System MUST gracefully handle concurrent editing conflicts without data loss or exceptions.
- **FR-005**: System MUST NOT rely on a central backend server to host the document state during Phase 1.
- **FR-006**: System MUST display a connection status indicator (e.g., in the header or toolbar) to inform users whether the WebRTC sync connection is active.

### Key Entities

- **Collaborative Document**: The source of truth for the rich text state, capable of merging remote operations with local edits.
- **Peer Connection**: The WebRTC transport layer responsible for broadcasting local state changes to peers and receiving remote changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Edits made in one browser tab reflect in a connected browser tab in under 100 milliseconds (local network).
- **SC-002**: Concurrent typing by 2+ users on the same document does not result in application crashes or dropped keystrokes.
- **SC-003**: All rich text formatting and structural breaks defined in previous specifications successfully sync across peers.

## Assumptions & Constraints

- **Awareness/Cursors**: Displaying remote user cursors and selections is strictly excluded from Phase 1 scope. The implementation will focus purely on syncing document text and formatting.
- **Signaling Server**: While the data sync is P2P, WebRTC requires a public signaling server to negotiate the connection. We assume the use of public default signaling servers provided by the WebRTC package for this phase.
- **Persistence**: Document state is ephemeral for this phase. If all peers close their tabs, the document resets. Backend persistence is reserved for a future phase.
