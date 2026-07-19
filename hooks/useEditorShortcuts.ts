import { useCallback } from "react";
import { Editor as SlateEditor, Transforms, Range, Element as SlateElement } from "slate";

const isMod = (e: React.KeyboardEvent) => {
  if (typeof window !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
    return e.metaKey;
  }
  return e.ctrlKey;
};

export const useEditorShortcuts = (editor: any, openLinkPopover: () => void) => {
  return useCallback((e: React.KeyboardEvent) => {
    if (!editor) return;
    const mod = isMod(e);
    
    // Formatting Shortcuts
    if (mod && !e.shiftKey && e.key.toLowerCase() === "b") {
      e.preventDefault();
      const marks = SlateEditor.marks(editor) as Record<string, any>;
      if (marks && marks["bold"]) SlateEditor.removeMark(editor, "bold");
      else SlateEditor.addMark(editor, "bold", true);
      return;
    }
    if (mod && !e.shiftKey && e.key.toLowerCase() === "i") {
      e.preventDefault();
      const marks = SlateEditor.marks(editor) as Record<string, any>;
      if (marks && marks["italic"]) SlateEditor.removeMark(editor, "italic");
      else SlateEditor.addMark(editor, "italic", true);
      return;
    }
    if (mod && !e.shiftKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      const marks = SlateEditor.marks(editor) as Record<string, any>;
      if (marks && marks["underline"]) SlateEditor.removeMark(editor, "underline");
      else SlateEditor.addMark(editor, "underline", true);
      return;
    }

    // Font Sizing Shortcuts
    if (mod && e.shiftKey && (e.key === "." || e.key === ">")) {
      e.preventDefault();
      const marks = SlateEditor.marks(editor) as Record<string, any>;
      const currentSize = marks?.fontSize || 16;
      SlateEditor.addMark(editor, "fontSize", Math.max(8, Math.min(72, currentSize + 2)));
      return;
    }
    if (mod && e.shiftKey && (e.key === "," || e.key === "<")) {
      e.preventDefault();
      const marks = SlateEditor.marks(editor) as Record<string, any>;
      const currentSize = marks?.fontSize || 16;
      SlateEditor.addMark(editor, "fontSize", Math.max(8, Math.min(72, currentSize - 2)));
      return;
    }

    if (mod && !e.shiftKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openLinkPopover();
      return;
    }

    // Line Breaks & Format Reset
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      const { selection } = editor;
      if (selection && Range.isCollapsed(selection)) {
        const [match] = Array.from(SlateEditor.nodes(editor, {
          match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
        }));
        if (match) {
          const [node, path] = match;
          if (SlateEditor.isEmpty(editor, node as SlateElement)) {
            // Empty list item -> terminate list
            Transforms.unwrapNodes(editor, {
              match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
              split: true,
            });
            Transforms.setNodes(editor, { type: 'paragraph' } as any);
            return;
          }
        }
      }

      editor.insertBreak();
      
      // Reset marks on new line
      SlateEditor.removeMark(editor, "bold");
      SlateEditor.removeMark(editor, "italic");
      SlateEditor.removeMark(editor, "underline");

      // Downgrade new empty heading to paragraph
      const [match] = Array.from(SlateEditor.nodes(editor, {
        match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n),
      }));
      if (match) {
        const [node, path] = match;
        if ((node as any).type === "heading-one" || (node as any).type === "heading-two") {
          if (SlateEditor.isEmpty(editor, node as SlateElement)) {
            Transforms.setNodes(editor, { type: "paragraph" } as any, { at: path });
          }
        }
      }
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      SlateEditor.insertText(editor, "\n");
      return;
    }

    // List Indentation (Tab / Shift+Tab)
    if (e.key === "Tab") {
      e.preventDefault();
      const [match] = Array.from(SlateEditor.nodes(editor, {
        match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
      }));

      if (match) {
        if (e.shiftKey) {
          Transforms.liftNodes(editor);
          const [listParent] = Array.from(SlateEditor.nodes(editor, {
            match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
          }));
          if (!listParent) {
            Transforms.setNodes(editor, { type: 'paragraph' } as any);
          }
        } else {
          const [listMatch] = Array.from(SlateEditor.nodes(editor, {
            match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n.type === 'bulleted-list' || n.type === 'numbered-list'),
          }));
          if (listMatch) {
            const listType = (listMatch[0] as any).type;
            Transforms.wrapNodes(editor, { type: listType } as any);
          }
        }
      } else {
        if (!e.shiftKey) editor.insertText("\t");
      }
      return;
    }
  }, [editor, openLinkPopover]);
};
