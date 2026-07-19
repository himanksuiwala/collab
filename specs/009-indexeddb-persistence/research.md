# Research & Technical Decisions: IndexedDB Persistence

## Decision 1: Synchronization Sequence
- **Decision**: The `y-indexeddb` provider must be initialized *before* `y-webrtc`, and the application must await the `synced` event from the local DB before attempting network sync.
- **Rationale**: If WebRTC initializes first, it might pull a blank document or remote state and overwrite the local IndexedDB state, leading to data loss or duplicate initial states. Waiting for local `synced` ensures the application is seeded correctly.

## Decision 2: Auto-Save Mechanism
- **Decision**: `y-indexeddb` natively debounces its local IndexedDB writes in the background. We will complement this by maintaining a debounced local React state (`saveStatus`: "saving" | "saved") triggered by `onChange` in the Slate editor.
- **Rationale**: This fulfills the requirement for debounced behavior (handling high-speed typing gracefully) while providing the user with a reassuring visual cue.
