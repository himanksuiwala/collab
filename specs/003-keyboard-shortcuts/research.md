# Research: Keyboard Shortcuts

## Cross-Platform Keyboard Shortcuts
**Decision**: Implement a custom utility function to detect the primary modifier key (`Cmd` on macOS, `Ctrl` on Windows/Linux) instead of adding an external dependency like `is-hotkey`.
**Rationale**: The constitution strictly mandates "Minimal Dependencies". Adding an entire package just to check `e.metaKey || e.ctrlKey` violates this principle. A simple `isMod(e)` helper checking `navigator.platform` or `userAgent` ensures perfect cross-platform compatibility without bloating the bundle.
**Alternatives considered**: 
- Using the `is-hotkey` npm package (rejected due to Minimal Dependencies rule).
- Hardcoding `e.ctrlKey || e.metaKey` everywhere (rejected as it triggers on `Cmd+B` on Windows, which might be reserved, though usually harmless. Better to strictly check OS to be robust).

## Handling Text Resizing via Keyboard
**Decision**: Map `mod+shift+.` (>) and `mod+shift+,` (<) to text resizing, matching standard Google Docs shortcuts.
**Rationale**: Users expect these standard mappings for enlarging/shrinking text.
**Alternatives considered**: 
- `mod++` and `mod+-` (rejected as these often trigger browser-level page zoom instead of rich text font size changes).

## Slate.js Enter Key Override
**Decision**: Intercept the `onKeyDown` event in the `Editable` component. When `Enter` is pressed, we will use `Transforms.splitNodes` to insert the new paragraph, and then explicitly call `Editor.removeMark` for active formatting marks to satisfy FR-007. For `Shift+Enter`, we will use `Editor.insertText(editor, '\n')` to insert a soft break without splitting the node.
**Rationale**: Slate.js allows full control over keystrokes via `onKeyDown`. By explicitly managing the `Enter` and `Shift+Enter` keys, we can perfectly align with the exact edge cases specified in the requirements without fighting Slate's default behaviors.
**Alternatives considered**: 
- Relying on Slate's default `Enter` behavior (rejected because it inherently carries over formatting to the next line, which violates our user stories).
