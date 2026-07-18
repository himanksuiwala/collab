# Feature Specification: Hyperlink Support & Toolbar Reordering

## Overview
Users require the ability to create hyperlinks on selected text within the rich text editor to enrich their documents with external resources. Additionally, the editor toolbar requires reorganization to adhere to standard intuitive UX patterns as it is currently incorrect.

## User Scenarios
1. **Adding a Link via Keyboard**: A user selects text, presses `Cmd/Ctrl + K`, and a popover appears near the selection. They enter a URL, click "Save", and the text becomes a clickable hyperlink.
2. **Adding a Link via Toolbar**: A user selects text, clicks the new "Link" icon in the toolbar, and the same popover appears to enter the URL.
3. **Removing a Link**: A user clicks on an existing hyperlink, the popover appears, and they click "Delete" to remove the hyperlink while preserving the text.
4. **Editing a Link**: A user clicks on an existing hyperlink, changes the URL in the popover, and clicks "Save" to update it.

## Functional Requirements
1. **Hyperlink Trigger**: Hyperlink insertion must be triggerable via the `Cmd/Ctrl + K` keyboard shortcut and a dedicated "Link" button in the toolbar.
2. **Link Popover**: A contextual popover/modal must appear when triggering a link on a selection, or when clicking an existing link.
3. **Popover Inputs**: The popover must contain a text input field for the URL.
4. **Popover Actions**: The popover must contain a "Save" button to apply the link, and a "Delete" button to remove the link from the text.
5. **Link Behavior**: Hyperlinks must open in a new tab when clicked, or allow the user to easily navigate to them.
6. **Toolbar Ordering**: The toolbar items must be reordered to the following sequence: Font Type > Size > Format (Bold, Italic, Underline, Link) > Alignment > Lists > Image.

## Non-Functional Requirements
1. **Accessibility**: The link popover should be keyboard navigable.
2. **Performance**: The popover should render instantly (< 100ms) without disrupting editor performance.

## Success Criteria
- 100% of tested valid URLs are successfully applied to text selections.
- The link popover reliably appears in the correct viewport position without clipping.
- The toolbar order is resolved and approved by the user.

## Key Entities
- **Link Element**: An inline document element that wraps text and contains a `url` attribute.
