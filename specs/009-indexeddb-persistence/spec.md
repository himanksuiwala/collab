# Feature Specification: IndexedDB Persistence & Auto-Save

## Clarifications

### Session 2026-07-19
- Q: If IndexedDB initialization fails (e.g., due to strict privacy settings) or the browser storage quota is exceeded, how should the application handle this failure? → A: Option A (Fallback to in-memory mode allowing remote sync, and show a "Local storage disabled/full" warning indicator).

## Overview
Users require true zero-data-loss for their documents even if they lose network connectivity or close the browser tab. The editor will implement robust local persistence using browser IndexedDB, automatically loading the latest local state upon initialization and auto-saving changes after a period of inactivity.

## User Scenarios
1. **Initial Load (Offline/Reload)**: A user opens the application in a new tab. The editor instantly loads their previous session's document state from IndexedDB before attempting to sync with any remote peers.
2. **Auto-Saving**: A user types a paragraph. After they pause for a short duration (idle time), the system automatically commits the state and updates a visual indicator to show the document is "Saved locally".
3. **Closing Tab**: A user closes the tab immediately after a save. Upon reopening, the exact state is restored without data loss.

## Functional Requirements
1. **Local Storage Provider**: The editor must use an IndexedDB provider to persist the CRDT document state locally.
2. **State Restoration**: On application load, the editor must await the local IndexedDB state restoration before rendering the editor canvas to prevent flashing or overwriting data with empty defaults.
3. **Auto-Save Mechanism**: The document state must be persisted based on an idle-time delay. The actual IndexedDB writes will be debounced so that the database is only written to after the user stops typing (e.g., 1000ms idle). This optimizes performance while maintaining a high degree of persistence.
4. **Visual Indicator**: The UI must display the current save status (e.g., "Unsaved changes", "Saved locally").

## Non-Functional Requirements
1. **Performance**: Reading and writing to IndexedDB must not block the main UI thread or cause input lag during rapid typing.
2. **Durability**: Document state must survive browser hard reloads and offline scenarios.

## Edge Cases & Error Handling
- **Storage Initialization Failure / Quota Exceeded**: If the browser denies access to IndexedDB (e.g., incognito mode) or storage quota is exhausted, the editor will gracefully fallback to in-memory mode (allowing real-time WebRTC sync to continue) and update the visual indicator to warn the user (e.g., "Local storage disabled/full").

## Success Criteria
- 100% of document content and formatting is preserved across browser tab reloads.
- The auto-save behavior triggers predictably after the user stops typing.
- No input lag is introduced when typing continuously at high speeds.

## Key Entities
- **Local Document Store**: The IndexedDB table storing the binary document state.
