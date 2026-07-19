# Research & Architecture Decisions

This document captures the architectural decisions made to fulfill the `011-collab-editor-refactor` specification.

## 1. Addressing the CursorOverlay Performance Leak

- **Decision**: Remove the `requestAnimationFrame` polling loop and rely strictly on React's `useEffect` dependency array triggered by Yjs awareness events.
- **Rationale**: The `useRemoteCursors` hook already updates state only when Yjs receives a cursor movement event over WebRTC. The `CursorOverlay` can simply derive its rectangles in a standard `useEffect` that triggers when `cursorStates` change.
- **Alternatives considered**: Bypassing React entirely and mutating DOM refs directly for cursor elements. While this provides maximum performance, removing the continuous loop while retaining standard React state (triggered only on actual mouse moves) provides a sufficient performance gain with simpler code.

## 2. Breaking Down Editor.tsx

- **Decision**: Extract distinct responsibilities into custom hooks:
  - `useCollabEditor`: Manages the initialization of `Y.Doc`, `WebrtcProvider`, `IndexeddbPersistence`, and the Slate-Yjs binding.
  - `useEditorShortcuts`: Handles the monolithic `onKeyDown` formatting logic.
  - `useImageUpload`: Handles the `onPaste` event for Cloudinary uploads.
- **Rationale**: The Single Responsibility Principle. `Editor.tsx` should only be responsible for rendering the UI layout and connecting the hooks.
- **Alternatives considered**: Creating a single massive Context Provider. Rejected because it doesn't solve the readability issue of having thousands of lines of logic in one domain.

## 3. Resolving Inline Component Definitions

- **Decision**: Move `Button` and `Divider` out of the `Toolbar.tsx` component function. Move `Leaf` and `Element` into a separate `Elements.tsx` file.
- **Rationale**: Vercel React Best Practices (`rerender-no-inline-components`). Inline components are recreated on every render cycle, destroying component state and causing React to unmount/remount the DOM nodes instead of updating them.

## 4. Bundle Size Optimization

- **Decision**: Configure Next.js `optimizePackageImports` for `lucide-react` in `next.config.ts`.
- **Rationale**: This is a Vercel-recommended approach that allows developers to retain the clean barrel import syntax (`import { Bold, Italic } from "lucide-react"`) while letting the Next.js bundler automatically rewrite them to direct path imports at build time, eliminating the bundle bloat.
- **Alternatives considered**: Manually rewriting all imports to `lucide-react/dist/esm/icons/...`. Rejected as it is tedious and less maintainable than the native Next.js optimizer.
