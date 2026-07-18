# Data Model: Image Upload

## Slate Custom Elements

We are extending the existing Slate element types (which include `paragraph`, `heading-one`, `heading-two`, `bulleted-list`, `numbered-list`, `list-item`) with two new block-level custom elements.

### 1. Image Element
Represents a finalized, successfully uploaded image that is permanently stored in the document.

```typescript
type ImageElement = {
  type: "image";
  url: string; // The secure HTTPS Cloudinary URL
  children: CustomText[]; // Mandatory text node required by Slate (e.g., { text: "" })
};
```

### 2. Image Loading Element
Represents the optimistic, temporary UI state of an image while it is currently being uploaded to Cloudinary.

```typescript
type ImageLoadingElement = {
  type: "image-loading";
  id: string; // A unique UUID generated at insertion time for tracking the specific upload
  children: CustomText[]; // Mandatory text node required by Slate (e.g., { text: "" })
};
```

## State Transitions (Optimistic Sync Flow)

1. **User Action**: File Selected / Clipboard Pasted.
2. **Validation**: Enforce `< 5MB` and `image/*` MIME type.
3. **Insertion**: Generate `id = crypto.randomUUID()`. 
   Execute `Transforms.insertNodes(editor, { type: "image-loading", id, children: [{ text: "" }] })`.
4. **Network**: Await `uploadImageToCloudinary(file)`.
5. **Resolution (Success)**: 
   Execute `Transforms.setNodes(editor, { type: "image", url: data.secure_url }, { at: [], match: n => n.type === "image-loading" && n.id === id })`.
6. **Resolution (Failure)**:
   Execute `Transforms.removeNodes(editor, { at: [], match: n => n.type === "image-loading" && n.id === id })`.
   Trigger UI Toast notification.
