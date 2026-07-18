# Quickstart Validation Guide: P2P Collaborative Editing

## Prerequisites
- The local development server must be running (`npm run dev`).
- Open the application in two separate browser windows (e.g., side-by-side) or two different browsers (e.g., Chrome and Firefox).

## Validation Scenarios

### 1. Connection Status
1. Open the editor in Browser Window 1.
2. Observe the connection status indicator in the header/toolbar.
   - **Expected**: It should quickly transition from "Connecting..." to an "Online" or "Connected" state, indicating successful negotiation with the signaling server.

### 2. Peer-to-Peer Typing
1. With both Browser Window 1 and Browser Window 2 open and visible:
2. Click into the editor in Window 1 and type "Hello from Peer A!".
   - **Expected**: The text "Hello from Peer A!" appears almost instantly in Window 2 without requiring a page refresh.
3. Click into Window 2 and append " And hello from Peer B!".
   - **Expected**: The text appears instantly back in Window 1.

### 3. Formatting Sync
1. In Window 1, highlight the word "Hello" and press `Cmd+B` / `Ctrl+B` to make it bold.
   - **Expected**: The word "Hello" immediately becomes bold in Window 2.
2. In Window 2, press `Enter` to create a new paragraph and verify the formatting is reset for new text (as implemented in the previous feature).
   - **Expected**: Window 1 accurately reflects the new paragraph block.

### 4. Concurrent Editing (Conflict Resolution)
1. Position the cursor at the end of the document in both Window 1 and Window 2.
2. Simultaneously type "X" in Window 1 and "Y" in Window 2.
   - **Expected**: The editor does not crash. Both "X" and "Y" appear in the document in both windows (the exact order may vary depending on the CRDT resolution, but no data is lost).

## Final Sign-off
If all expected outcomes are met, the collaborative editing setup successfully meets the Phase 1 requirements.
