# Quickstart: Validation Guide

## Scenario 1: Local Data Persistence (Offline Test)
1. Disconnect from the internet (or turn off Wi-Fi).
2. Open the editor application.
3. Type several paragraphs of text, add formatting, and insert a link.
4. Observe the indicator at the bottom transition from "Saving..." to "Saved locally".
5. Completely refresh the browser tab (`Cmd/Ctrl + R`).
6. **Observation**: The document instantly reloads with 100% of the text and formatting intact, despite having no network connection.

## Scenario 2: Network Sync Integration
1. Reconnect to the internet.
2. The connection chip should switch from "Offline" to "Online".
3. Open a secondary browser tab or incognito window.
4. **Observation**: The secondary window should sync the local state established in Scenario 1 without wiping out the original tab's content.
