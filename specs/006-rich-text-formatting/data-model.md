# Data Model & Schema

This feature primarily updates the internal `Element` typing of the Slate.js document model to support new block types and nested lists. No database migrations or persistent schemas are affected since Yjs handles the binary CRDT state based on this logical tree.

## Slate CustomElement Extensions

The `CustomElement` type in `components/editor/Editor.tsx` must be extended.

### 1. Element Types
The `type` attribute of `CustomElement` expands from just `"paragraph"` to include:

- `"paragraph"` (Normal text)
- `"heading-one"` (Heading)
- `"heading-two"` (Sub-heading)
- `"bulleted-list"` (Unordered list container)
- `"numbered-list"` (Ordered list container)
- `"list-item"` (Individual item inside a list container)

### 2. Nesting Rules (True Nesting)
Based on the clarification phase, lists use true HTML-style nesting.
Valid hierarchy:
```json
{
  "type": "bulleted-list",
  "children": [
    {
      "type": "list-item",
      "children": [
        { "text": "Item 1" },
        {
          "type": "bulleted-list",
          "children": [
            {
              "type": "list-item",
              "children": [{ "text": "Nested item" }]
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. Alignment Attribute
The `align` attribute (`"left" | "center" | "right" | "justify"`) continues to apply, but logic must handle applying it cleanly across multiple block types when the selection spans them.
