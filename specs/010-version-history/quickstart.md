# Quickstart Validation: Version History

## Prerequisites
- Start the application (`npm run dev`)
- Open the application in a browser tab at `http://localhost:3000`

## Validation Scenarios

### Scenario 1: Persistent Identity
1. Open the browser DevTools (F12) -> Application -> Local Storage.
2. Note the generated `localUserName` (e.g., "Clever Fox").
3. Refresh the browser tab.
4. **Validation**: Verify that the `localUserName` in Local Storage remains exactly the same.

### Scenario 2: Capturing a Version
1. Type a paragraph into the editor.
2. Click the "Save Version" button in the toolbar.
3. Open the Version History sidebar (right-aligned).
4. **Validation**: The sidebar should display a new item with the current timestamp.

### Scenario 3: Historical Comparison & Attribution
1. Type a second paragraph into the editor.
2. Click the "Version History" button to open the right-aligned sidebar.
3. Click on the version captured in Scenario 2.
4. **Validation**: The application should enter a side-by-side mode.
5. **Validation**: The historical document view should display only the first paragraph (the state at the time of the snapshot).
6. **Validation**: The historical text should have a distinct background color applied, indicating it was written by your persistent user identity.
7. **Validation**: Attempting to type in the historical view should be blocked (read-only).
