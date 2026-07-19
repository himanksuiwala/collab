import React, { useMemo, useState, useEffect } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import * as Y from "yjs";
import { withYjs, YjsEditor, yTextToSlateElement } from "@slate-yjs/core";
import clsx from "clsx";

interface ComparisonViewProps {
  liveDoc: Y.Doc;
  encodedSnapshot: Uint8Array;
}

const getAuthorColor = (authorName: string) => {
  // Simple hash function for consistent color mapping
  let hash = 0;
  for (let i = 0; i < authorName.length; i++) {
    hash = authorName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 80%, 90%)`;
};

const ComparisonLeaf = ({ attributes, children, leaf }: any) => {
  const authorBgColor = leaf.authorName ? getAuthorColor(leaf.authorName) : undefined;
  
  return (
    <span
      {...attributes}
      className={clsx(
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.underline && "underline",
        leaf.authorName && "relative group"
      )}
      style={{ 
        fontSize: leaf.fontSize ? `${leaf.fontSize}px` : undefined,
        backgroundColor: authorBgColor
      }}
      title={leaf.authorName ? `Added by ${leaf.authorName}` : undefined}
    >
      {children}
    </span>
  );
};

const ComparisonElement = ({ attributes, children, element }: any) => {
  const alignClass = clsx(
    element.align === "center" && "text-center",
    element.align === "right" && "text-right",
    element.align === "justify" && "text-justify",
    element.align === "left" && "text-left",
    !element.align && "text-left"
  );

  switch (element.type) {
    case "image":
      return (
        <div {...attributes} className="mb-4 relative rounded-md overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-50 group">
          <div contentEditable={false} className="w-full flex justify-center">
            <img src={element.url} className="max-w-full h-auto block rounded-sm opacity-80" alt="Historical image" />
          </div>
          <span className="hidden">{children}</span>
        </div>
      );
    case "heading-one":
      return (
        <h1 {...attributes} className={clsx(alignClass, "text-4xl font-bold mt-6 mb-4 leading-tight text-slate-900")}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 {...attributes} className={clsx(alignClass, "text-2xl font-semibold mt-5 mb-3 leading-snug text-slate-800")}>
          {children}
        </h2>
      );
    case "bulleted-list":
      return (
        <ul {...attributes} className={clsx(alignClass, "list-disc list-outside ml-6 mb-2 space-y-1")}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol {...attributes} className={clsx(alignClass, "list-decimal list-outside ml-6 mb-2 space-y-1")}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li {...attributes} className={clsx(alignClass, "leading-relaxed")}>
          {children}
        </li>
      );
    case "paragraph":
    default:
      return (
        <p {...attributes} className={clsx(alignClass, "mb-2 leading-relaxed pt-1")}>
          {children}
        </p>
      );
  }
};

const ComparisonView: React.FC<ComparisonViewProps> = ({ liveDoc, encodedSnapshot }) => {
  const [editorState, setEditorState] = useState<{ editor: any, sharedType: Y.XmlText, initialValue: Descendant[] } | null>(null);

  useEffect(() => {
    try {
      const snapshot = Y.decodeSnapshot(encodedSnapshot);
      // Create a new detached Doc from the snapshot
      const historicalDoc = Y.createDocFromSnapshot(liveDoc, snapshot);
      const sharedType = historicalDoc.get("content", Y.XmlText) as Y.XmlText;

      const editor = withYjs(withReact(createEditor()), sharedType);
      
      const { isVoid, isInline } = editor;
      editor.isVoid = element => {
        return (element as any).type === "image" || (element as any).type === "image-loading" ? true : isVoid(element);
      };
      editor.isInline = element => {
        return (element as any).type === "link" ? true : isInline(element);
      };

      let initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] } as any];
      try {
        const parsed = yTextToSlateElement(sharedType);
        if (parsed && parsed.children && parsed.children.length > 0) {
          initialValue = parsed.children as Descendant[];
        }
      } catch (err) {
        console.warn("Failed to parse Yjs doc to Slate AST", err);
      }

      YjsEditor.connect(editor);
      setEditorState({ editor, sharedType, initialValue });

      return () => {
        YjsEditor.disconnect(editor);
        historicalDoc.destroy();
      };
    } catch (e) {
      console.error("Failed to load historical snapshot", e);
    }
  }, [liveDoc, encodedSnapshot]);

  if (!editorState) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50 opacity-80 border-r border-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500">Restoring version...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 opacity-90 border-r border-slate-200 relative overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-full bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 z-10 flex justify-center shadow-sm pointer-events-auto">
        Historical Version (Read Only)
      </div>
      <div className="pt-16 pb-32 px-12 sm:px-20 overflow-y-auto h-full">
        <Slate editor={editorState.editor} initialValue={editorState.initialValue}>
          <Editable 
            readOnly
            renderElement={(props) => <ComparisonElement {...props} />}
            renderLeaf={(props) => <ComparisonLeaf {...props} />}
          />
        </Slate>
      </div>
    </div>
  );
};

export default ComparisonView;
