# Data Model: Version History

## Entities

### 1. Persistent Identity (localStorage)
- **Key**: `localUserName`
- **Type**: `string`
- **Description**: The persistent pseudo-random display name assigned to the user (e.g., "Clever Fox").

### 2. Slate Text Node Attributes (In-Memory/Yjs)
The custom Slate Text definition will be extended to include `authorName`.

```typescript
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  authorName?: string; // NEW: The identity of the user who inserted this text
};
```

### 3. Version Map (Y.Map)
- **Key**: `versions`
- **Type**: `Y.Map<any>` (Maps Timestamp string to Snapshot object)
- **Structure**:
  - `[timestamp: string]`: An object containing:
    - `date`: ISO string of when the snapshot was taken.
    - `snapshot`: The serialized binary snapshot created by `Y.encodeSnapshot(Y.snapshot(doc))`.

*Note: Snapshots must be encoded to binary (`Uint8Array`) before storing them in a `Y.Map` or transferring them, though `yjs` allows storing the snapshot object directly if not transmitting over standard JSON channels. We will use standard Y.Map assignment.*
