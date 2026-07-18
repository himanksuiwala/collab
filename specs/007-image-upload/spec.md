# Feature Specification: Image Upload & Optimistic UI

**Feature Branch**: `007-image-upload`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Now we need to implment a functionality where the user can add the image to the document in two ways: first there shall a option in toolbar upon clicking which the user is allowed to select the files from the computer and other way is to paste the files from the clipboard. Remember only image files are allowed and there is a limit of 5MB per file. We shall be using the Cloudinary's API to upload the file to remote location as present in @[cloudinary.ts] (coould be refeactore as per app's structure), it's supposed to be working in following manner Optimistic UI: Immediately insert a "loading image" node or better icon into your Yjs document so the user sees instant feedback. Upload: Here we kickoff the cloudniary based upload Finalize: Once the promise resolves with the URL, replace the temporary loading node in your Yjs document with the final Image node containing the returned URL. Yjs will then sync that URL to all other peers."

## Clarifications

### Session 2026-07-19
- Q: What should happen in the document if an image upload fails (e.g., due to network error or size limit)? -> A: The temporary "loading" node should be removed from the document, and a Toast notification (using Shadcn `sonner`) should be displayed to the user explaining the failure.
- Q: Should inserted images act as standalone structural blocks or flow inline within the text? -> A: Standalone Block (takes up the full line, sits cleanly between paragraphs/lists) to ensure existing rich-text workflows are not disrupted.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Image Insertion via Toolbar (Priority: P1)

Users need to insert images into their collaborative document by selecting a file from their local file system via the rich text toolbar.

**Why this priority**: Essential functionality for rich-text documentation and multimedia content.

**Acceptance Scenarios**:

1. **Given** a user clicks the "Insert Image" icon in the toolbar, **When** they select a valid image file (< 5MB), **Then** a "loading" placeholder is immediately inserted into the document at the cursor position.
2. **Given** the image upload successfully completes via Cloudinary, **When** the promise resolves, **Then** the "loading" placeholder is replaced by the actual image, and all peers in the collaborative session instantly see the image.
3. **Given** a user attempts to select a file that is not an image or is larger than 5MB, **When** they choose the file, **Then** the system rejects the file and displays a validation error message without inserting a loading node.

---

### User Story 2 - Image Insertion via Clipboard Paste (Priority: P1)

Users need a frictionless way to insert images by directly pasting them from their system clipboard into the editor.

**Why this priority**: Pasting images is the most common workflow for users transferring screenshots and web images.

**Acceptance Scenarios**:

1. **Given** a user has an image copied to their clipboard, **When** they paste (`Ctrl+V` or `Cmd+V`) into the editor, **Then** the image is intercepted, validated, and a "loading" placeholder is inserted into the document instantly.
2. **Given** the clipboard contains text and an image, **When** pasted, **Then** both the text and the image are handled appropriately without breaking the document structure.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The toolbar MUST include an "Insert Image" button that opens the system file picker.
- **FR-002**: The editor MUST intercept clipboard paste events and extract image files from the clipboard payload.
- **FR-003**: The system MUST validate that any selected or pasted file is a valid image type (e.g., JPEG, PNG, GIF, WebP).
- **FR-004**: The system MUST enforce a strict 5MB file size limit per image prior to initiating any upload.
- **FR-005**: Upon valid file selection/paste, the editor MUST immediately insert a temporary "loading" block node into the document at the current selection.
- **FR-006**: The system MUST invoke the Cloudinary upload API to upload the validated image to the remote server asynchronously.
- **FR-007**: Upon successful upload, the system MUST replace the temporary "loading" node with a permanent "image" node containing the secure Cloudinary URL.
- **FR-008**: The insertion, loading state, and final image resolution MUST perfectly sync across all collaborative peers via Yjs.

### Key Entities

- **Image Element**: A custom block element in the document structure representing an image. It MUST store the remote image URL.
- **Loading Element**: A temporary custom block element in the document structure representing an image currently being uploaded. It MUST maintain a unique identifier to allow precise replacement upon upload completion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of images under 5MB are successfully validated, uploaded, and rendered.
- **SC-002**: Users perceive instant feedback (visual loading state) in under 100ms when inserting an image.
- **SC-003**: Invalid files (non-images or >5MB) are blocked 100% of the time before triggering network requests.
- **SC-004**: Remote peers see the "loading" state and the subsequent finalized image without requiring page refreshes.

## Assumptions

- Uploaded images will be displayed at their original aspect ratio, scaled to fit the maximum width of the editor canvas.
- Deleting an image block from the editor removes it from the document but does not trigger a deletion API call to Cloudinary (standard practice for simple editor integrations).
- The existing `cloudinary.ts` utility is functional and configured with the correct Cloudinary credentials in the environment.
