# Data Model: WYSIWYG Editor Page

For this initial UI phase, the data model consists of the in-memory state used by Slate.js to represent the document. Persistence is out of scope (ephemeral).

## Entities

### Document (Slate Value)

The document is represented as an array of Slate node objects (`Descendant[]`).

**Type**: `Descendant[]`

**Initial State**:
```json
[
  {
    "type": "paragraph",
    "children": [
      {
        "text": ""
      }
    ]
  }
]
```

### Element Node

Represents a block-level element in the editor (e.g., paragraph, heading).

**Fields**:
- `type` (String): The type of block (e.g., `"paragraph"`, `"heading-one"`).
- `children` (Array): An array of child Elements or Text nodes.

### Text Node

Represents inline text.

**Fields**:
- `text` (String): The actual text content.

## Relationships
- A **Document** contains one or more **Element Nodes** at the top level.
- An **Element Node** can contain other **Element Nodes** or **Text Nodes**.
- **Text Nodes** are always leaf nodes (they cannot contain children).
