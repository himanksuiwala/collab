# Research & Technical Decisions: Image Upload

## Decision 1: Image Structural Layout in Document
- **Decision**: Images will be inserted as standalone, block-level custom elements (e.g., `{ type: "image", url: string, children: [{ text: "" }] }`).
- **Rationale**: The user explicitly requested that the image functionality should not disrupt the existing rich-text workflow. If images were inline elements, pasting them could inadvertently fracture or corrupt semantic blocks like Headings or Lists. Block-level insertion mimics standard modern editors (like Notion) and guarantees document stability.
- **Alternatives Considered**: Inline images (rejected due to workflow corruption risk).

## Decision 2: Optimistic UI & Syncing (Yjs)
- **Decision**: We will inject a temporary `{ type: "image-loading", id: string, children: [{ text: "" }] }` node into the Yjs document immediately upon file selection.
- **Rationale**: Yjs is a CRDT. By inserting the temporary node as an actual document block, it instantly synchronizes to all connected WebRTC peers, granting collaborative visual feedback (everyone sees that someone is uploading an image). Once the Cloudinary API returns the URL, we execute a `Transforms.setNodes` operation using the `id` to map the `image-loading` node to a final `image` node.
- **Alternatives Considered**: Local-only loading state (rejected because peers wouldn't know an image was coming, leading to jarring pop-ins).

## Decision 3: Clipboard Interception Strategy
- **Decision**: Utilize the Slate `onPaste` or `insertData` hook. We will intercept the native `DataTransfer` object, scan for `items` with `type.startsWith("image/")`, and intercept the default text behavior to trigger our Cloudinary upload pipeline.
- **Rationale**: Standard web API approach for seamless rich-text paste overriding.

## Decision 4: Error Handling
- **Decision**: If Cloudinary upload fails (or size validation fails), we will remove the `image-loading` node via `Transforms.removeNodes` and trigger a `toast.error()` using Shadcn `sonner`.
- **Rationale**: Keeps the document CRDT clean without polluting it with permanent error placeholder blocks that users would have to manually delete.
