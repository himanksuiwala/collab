"use client";

import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { createEditor, Descendant, BaseEditor, Editor as SlateEditor, Transforms, Range, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import clsx from "clsx";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { withYjs, YjsEditor, slateNodesToInsertDelta, withCursors } from "@slate-yjs/core";
import Toolbar from "./Toolbar";
import { generateIdentity } from "@/lib/identity";
import { useRemoteCursors } from "@/hooks/useRemoteCursors";
import { CursorOverlay } from "./CursorOverlay";
import LinkPopover from "./LinkPopover";
import { uploadImageToCloudinary } from "@/cloudinary";
import { toast } from "sonner";

const isMod = (e: React.KeyboardEvent) => {
  if (typeof window !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
    return e.metaKey;
  }
  return e.ctrlKey;
};

export type CustomElement = {
  type: "paragraph" | "heading-one" | "heading-two" | "bulleted-list" | "numbered-list" | "list-item" | "image" | "image-loading" | "link";
  align?: "left" | "center" | "right" | "justify";
  url?: string;
  id?: string;
  children: Descendant[];
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
      className={clsx(
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.underline && "underline"
      )}
      style={{ fontSize: leaf.fontSize ? `${leaf.fontSize}px` : undefined }}
    >
      {children}
    </span>
  );
};

const Element = ({ attributes, children, element }: any) => {
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
            <img src={element.url} className="max-w-full h-auto block rounded-sm" alt="Uploaded image" />
          </div>
          <span className="hidden">{children}</span>
        </div>
      );
    case "image-loading":
      return (
        <div {...attributes} className="mb-4 relative rounded-md overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-50/50 min-h-[200px]">
          <div contentEditable={false} className="w-full flex items-center justify-center flex-col gap-3">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-500">Uploading...</span>
          </div>
          <span className="hidden">{children}</span>
        </div>
      );
    case "link":
      return (
        <a 
          {...attributes} 
          href={element.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 underline cursor-pointer"
        >
          {children}
        </a>
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

const Editor = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [yjsContext, setYjsContext] = useState<{ sharedType: Y.XmlText; provider: WebrtcProvider; editor: any } | null>(null);

  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkSelectionRect, setLinkSelectionRect] = useState<DOMRect | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkSelection, setLinkSelection] = useState<Range | null>(null);

  const identity = useRef(generateIdentity());

  const openLinkPopover = useCallback(() => {
    if (!yjsContext) return;
    const { editor } = yjsContext;
    const { selection } = editor;
    
    if (!selection) return;

    const [linkMatch] = Array.from(SlateEditor.nodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    }));

    if (linkMatch) {
      setLinkUrl((linkMatch[0] as any).url);
      setIsEditingLink(true);
    } else {
      setLinkUrl("");
      setIsEditingLink(false);
    }

    setLinkSelection(selection);

    const domSelection = window.getSelection();
    if (domSelection && domSelection.rangeCount > 0) {
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      setLinkSelectionRect(rect);
    } else {
      setLinkSelectionRect(null);
    }

    setIsLinkPopoverOpen(true);
  }, [yjsContext]);

  const handleSaveLink = useCallback((url: string) => {
    if (!yjsContext || !linkSelection) return;
    const { editor } = yjsContext;

    Transforms.select(editor, linkSelection);

    if (isEditingLink) {
      Transforms.setNodes(editor, { url } as any, {
        match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
      });
    } else {
      if (Range.isCollapsed(linkSelection)) {
        Transforms.insertNodes(editor, { type: "link", url, children: [{ text: url }] } as any);
      } else {
        Transforms.wrapNodes(
          editor,
          { type: "link", url, children: [] } as any,
          { split: true }
        );
      }
    }
    
    setIsLinkPopoverOpen(false);
  }, [yjsContext, linkSelection, isEditingLink]);

  const handleDeleteLink = useCallback(() => {
    if (!yjsContext || !linkSelection) return;
    const { editor } = yjsContext;

    Transforms.select(editor, linkSelection);
    Transforms.unwrapNodes(editor, {
      match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    });
    
    setIsLinkPopoverOpen(false);
  }, [yjsContext, linkSelection]);

  useEffect(() => {
    // Instantiate Yjs and WebRTC only on the client side to avoid SSR errors
    const doc = new Y.Doc();
    const sharedType = doc.get("content", Y.XmlText) as Y.XmlText;
    const provider = new WebrtcProvider("test-document-room", doc);

    const editor = withCursors(
      withYjs(withReact(createEditor()), sharedType),
      provider.awareness,
      { data: identity.current }
    );

    const { isVoid, isInline, normalizeNode } = editor;

    editor.isVoid = element => {
      return (element as any).type === "image" || (element as any).type === "image-loading" ? true : isVoid(element);
    };

    editor.isInline = element => {
      return (element as any).type === "link" ? true : isInline(element);
    };

    editor.normalizeNode = (entry) => {
      const [node, path] = entry;
      
      // Ensure editor is never completely empty
      if (path.length === 0 && editor.children.length === 0) {
        Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] } as any, { at: [0] });
        return;
      }
      
      // Ensure blocks are never empty (prevents "Cannot get start point" error)
      if (SlateElement.isElement(node) && !SlateEditor.isEditor(node)) {
        if ((node as any).children.length === 0) {
          if ((node as any).type === "bulleted-list" || (node as any).type === "numbered-list") {
            Transforms.insertNodes(editor, { type: "list-item", children: [{ text: "" }] } as any, { at: [...path, 0] });
          } else if ((node as any).type === "image" || (node as any).type === "image-loading") {
            Transforms.insertNodes(editor, { text: "" } as any, { at: [...path, 0] });
          } else {
            Transforms.insertNodes(editor, { text: "" } as any, { at: [...path, 0] });
          }
          return;
        }
      }

      normalizeNode(entry);
    };

    setYjsContext({ sharedType, provider, editor });

    return () => {
      provider.disconnect();
      provider.destroy();
      doc.destroy();
    };
  }, []);

  useEffect(() => {
    if (!yjsContext) return;
    const { provider, editor } = yjsContext;

    const handleStatus = (event: { connected: boolean }) => {
      if (event.connected) setConnectionStatus("online");
      else setConnectionStatus("offline");
    };
    
    provider.on("status", handleStatus);
    provider.connect();
    YjsEditor.connect(editor);

    return () => {
      YjsEditor.disconnect(editor);
      provider.off("status", handleStatus);
    };
  }, [yjsContext]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!yjsContext) return;
    const { editor } = yjsContext;
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
  }, [yjsContext]);

  const onPaste = useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!yjsContext) return;
    const { editor } = yjsContext;
    const { items } = e.clipboardData;

    let imageFile: File | null = null;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          imageFile = file;
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();

      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      const id = crypto.randomUUID();
      Transforms.insertNodes(editor, {
        type: "image-loading",
        id,
        children: [{ text: "" }],
      } as any);

      try {
        const url = await uploadImageToCloudinary(imageFile);
        Transforms.setNodes(
          editor,
          { type: "image", url } as any,
          { at: [], match: (n) => (n as any).type === "image-loading" && (n as any).id === id }
        );
      } catch (error) {
        Transforms.removeNodes(
          editor,
          { at: [], match: (n) => (n as any).type === "image-loading" && (n as any).id === id }
        );
        toast.error("Failed to upload pasted image. Please try again.");
      }
    }
  }, [yjsContext]);

  const cursorStates = useRemoteCursors(yjsContext?.editor, yjsContext?.provider);

  if (!yjsContext) return null;
  const { editor, sharedType } = yjsContext;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8 relative pb-32">
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} onOpenLinkPopover={openLinkPopover} />
        
        <div 
          className="transition-transform duration-200 ease-in-out origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <div className="bg-white shadow-2xl ring-1 ring-slate-200 min-h-[1050px] w-full p-12 sm:p-20 flex flex-col rounded-sm relative">
            <CursorOverlay cursorStates={cursorStates} sharedType={sharedType} />
            <Editable 
              className="outline-none flex-grow text-slate-800"
              placeholder="Start typing..."
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
            />
          </div>
        </div>

        {/* Connection Status Chip */}
        <div className="fixed bottom-8 right-8 z-50 bg-white/90 backdrop-blur border border-slate-200/60 shadow-xl rounded-full px-4 py-2.5 flex items-center gap-2.5 hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-default">
          <div className={`w-2.5 h-2.5 rounded-full ${
            connectionStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
            connectionStatus === "offline" ? "bg-rose-500" :
            "bg-amber-400 animate-pulse"
          }`} />
          <span className="text-sm font-medium text-slate-600 capitalize select-none pt-[2px]">
            {connectionStatus}
          </span>
        </div>
        
        <LinkPopover
          isOpen={isLinkPopoverOpen}
          setIsOpen={setIsLinkPopoverOpen}
          selectionRect={linkSelectionRect}
          initialUrl={linkUrl}
          onSave={handleSaveLink}
          onDelete={handleDeleteLink}
          isEditing={isEditingLink}
        />
      </Slate>
    </div>
  );
};

export default Editor;
