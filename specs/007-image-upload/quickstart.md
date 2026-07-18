# Quickstart: Validation Guide

This guide details how to manually validate the optimistic image upload feature in the collaborative editor.

## Prerequisites

1. Ensure your `.env.local` contains valid Cloudinary credentials:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```
2. Start the development server: `npm run dev`.
3. Open two browser windows side-by-side pointing to `http://localhost:3000`.

## Scenario 1: Toolbar Upload (Optimistic Sync)

1. In Browser A, click the new "Image" icon in the formatting toolbar.
2. Select an image file (under 5MB) from your file system.
3. **Observation**: Instantly, a "Loading" block/spinner should appear in BOTH Browser A and Browser B at the exact cursor position.
4. Wait a few seconds for the upload to complete.
5. **Observation**: The loading block automatically converts into the final image in BOTH browsers simultaneously.

## Scenario 2: Clipboard Paste

1. Copy an image file or take a screenshot to your system clipboard.
2. Focus the editor in Browser A and press `Ctrl+V` (or `Cmd+V`).
3. **Observation**: The same optimistic loading state triggers instantly in both browsers, followed by the finalized image resolving.

## Scenario 3: Validation & Error Handling

1. Attempt to upload a massive image (e.g., > 10MB) via the toolbar.
2. **Observation**: No loading state is inserted. A toast notification immediately pops up stating "File size exceeds 5MB limit".
3. Force a network failure (e.g., block the request in Network tab) and upload a valid image.
4. **Observation**: The loading node appears, but upon failure, it cleanly vanishes from the document, and a toast notification informs you of the upload error. The document structure remains intact.
