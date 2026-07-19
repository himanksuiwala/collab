# Data Model: IndexedDB Persistence

## Local Storage

### IndexedDB Table Schema (Managed by y-indexeddb)
- **Database Name**: `test-document-room` (Shares name with WebRTC room)
- **Object Store**: `updates`
  - Stores the incremental binary CRDT updates produced by Yjs.

## State Transitions

1. **Mount**: `isLocalSynced = false`
2. **IndexedDB 'synced'**: `isLocalSynced = true` -> Triggers WebRTC connection.
3. **Slate `onChange`**: `saveStatus = "saving"` -> Timer starts (1000ms).
4. **Timer Expires**: `saveStatus = "saved"`
