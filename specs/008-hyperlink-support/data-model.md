# Data Model: Hyperlink

## Slate Custom Elements

We are extending the existing Slate element types to include a new inline element.

### 1. Link Element
Represents a clickable hyperlink wrapping text.

```typescript
type LinkElement = {
  type: "link";
  url: string; 
  children: CustomText[]; // The wrapped text
};
```

*Note*: The `Editor.isInline` override must be updated to return `true` for `element.type === "link"`.

## State Transitions

1. **User Action**: Selects text and triggers Link (via Cmd+K or Toolbar).
2. **UI State**: Popover opens, storing the current Slate `Range` selection in state so it isn't lost when the Popover input gains focus.
3. **Execution (Save)**: 
   If text was selected: `Transforms.wrapNodes(editor, { type: "link", url: inputUrl, children: [] }, { split: true })`
4. **Execution (Delete)**:
   If focused on a link: `Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })`
