# Research & Decisions

## Radix UI Dropdown Menu Integration
- **Decision**: Install `@radix-ui/react-dropdown-menu` (via `shadcn add dropdown-menu` if applicable, or directly) to implement the Block Type and Alignment dropdowns.
- **Rationale**: The user explicitly requested reusing Radix UI's primitives. While only `button.tsx` is currently present in `components/ui`, `shadcn` is installed. Using the Radix primitive ensures accessibility, keyboard navigation, and standard behavior matching the app's design.
- **Alternatives considered**: Using native HTML `<select>` (poor UX/UI matching), building a custom dropdown from scratch (reinventing the wheel, prone to a11y bugs).

## Upward Loading Dropdown
- **Decision**: Configure the Radix `DropdownMenuContent` with the `side="top"` attribute.
- **Rationale**: The user requested the dropdown to load upwards instead of downwards (which makes sense since the toolbar is a floating island at the bottom of the screen). Radix natively supports `side="top"`, `side="bottom"`, `side="left"`, and `side="right"`.
- **Alternatives considered**: Custom CSS `bottom: 100%` and absolute positioning (unnecessary since Radix handles popper positioning perfectly).

## List Modeling & Indentation
- **Decision**: Implement list items with true nesting (`bulleted-list` > `list-item` > `bulleted-list`).
- **Rationale**: Based on the clarification session, we are using true nesting for lists to strictly match standard HTML representations.
- **Alternatives considered**: Flat lists with an `indent` attribute.

## Edge Case Handling (Heading to List)
- **Decision**: Ensure the `toggleList` function unwraps or resets heading blocks into normal list items.
- **Rationale**: The clarification phase determined that clicking a list button inside a heading should convert it to a standard, non-heading list item.
