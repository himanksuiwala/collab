# Feature Specification: Multiplayer Cursors & Awareness

**Feature Branch**: `005-multiplayer-cursors`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Let's move to next phase where we want Multiplayer Awareness (Cursors). Collaboration is confusing if you can't see what the other person is doing. The Yjs ecosystem handles this through a concept called 'Awareness.' Generate a random user name and a random hex color for the current session. Pass this data into the Yjs Awareness protocol. Configure your editor's cursor extension to render these remote user coordinates as floating, colored carets on the screen. Remember in the header we should be having the corresponding colored overlapping profile-icon on the right-side just like Google docs."

## Clarifications

### Session 2026-07-19
- Q: How should we generate random pseudonyms without heavy dependencies? → A: Use Adjective-Animal pairs (e.g., "Anonymous Panda") generated from a tiny hardcoded array to minimize external dependencies.
- Q: What happens to a remote user's cursor when they lose focus on the editor? → A: Freeze cursor at the last known position to indicate where the user was last working.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Real-Time Remote Cursors (Priority: P1)

Users need to see exactly where their collaborators are currently reading or typing within the document so they do not accidentally overwrite each other's work.

**Why this priority**: Without visible cursors, real-time collaboration feels unpredictable and chaotic. It is the fundamental UX requirement for synchronous co-editing.

**Acceptance Scenarios**:

1. **Given** two users are in the same document, **When** User B clicks anywhere in the text, **Then** User A immediately sees a floating caret matching User B's assigned color at that exact position.
2. **Given** User B is typing, **When** User B's cursor moves, **Then** User A sees the caret track User B's movement smoothly in real-time.
3. **Given** User B closes their browser tab, **When** they disconnect, **Then** User B's colored caret immediately disappears from User A's screen.

---

### User Story 2 - Active Collaborator Avatars (Priority: P1)

Users need to know who is currently viewing or editing the document with them at a glance by looking at the application header.

**Why this priority**: It provides essential context about room occupancy and bridges the gap between anonymous cursors and recognizable participants.

**Acceptance Scenarios**:

1. **Given** multiple users join the document, **When** they connect, **Then** overlapping profile icons appear in the top-right header, colored corresponding to their assigned cursor colors.
2. **Given** a user is present in the document, **When** they disconnect, **Then** their profile icon is immediately removed from the header cluster.
3. **Given** a user hovers over an avatar in the header, **When** they hover, **Then** a small tooltip or label displays the user's random pseudonym.

---

### Edge Cases

- **Editor Blur/Unfocus**: When a remote user clicks outside the text editor or switches tabs (losing focus), their cursor MUST freeze at the last known position within the document rather than disappearing, indicating their last point of activity.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically generate a random, distinct pseudonym using a hardcoded Adjective-Animal combination (e.g., "Anonymous Panda") and a vibrant hex color for the local user's session upon application load.
- **FR-002**: System MUST broadcast the user's current cursor position (selection), pseudonym, and color to all connected peers in real-time.
- **FR-003**: System MUST render remote user selections as floating, colored carets within the editor canvas, mapping accurately to the text nodes.
- **FR-004**: System MUST render active collaborators as overlapping circular profile icons in the application header.
- **FR-005**: System MUST dynamically add and remove users from the awareness state as they connect and disconnect.

### Key Entities 

- **Session Identity**: An ephemeral user state containing:
  - `name`: Randomly generated pseudonym string using an Adjective-Animal format.
  - `color`: Randomly generated hex color string.
- **Awareness State**: The active real-time payload containing a user's Session Identity and their current cursor coordinates (selection range).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Remote cursors track peer typing with near-zero perceived latency (less than 100ms visual delay).
- **SC-002**: Users can identify how many peers are currently active instantly by looking at the header avatars.
- **SC-003**: Cursors and avatars clean up flawlessly upon disconnection, leaving no "ghost" cursors behind.

## Assumptions

- Users do not need persistent identities (login/auth) for this phase; random, ephemeral sessions are perfectly acceptable.
- The default UI constraint requires keeping the design simple and minimal, favoring clean avatars (e.g., colored circles with initials or icons).
- WebRTC signaling servers provided by default are stable enough to handle awareness state transmission alongside document state.
