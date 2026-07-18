"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { createEditor, Descendant, BaseEditor, Editor as SlateEditor, Transforms } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import clsx from "clsx";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { withYjs, YjsEditor, slateNodesToInsertDelta } from "@slate-yjs/core";
import Toolbar from "./Toolbar";

const isMod = (e: React.KeyboardEvent) => {
  if (typeof window !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) {
    return e.metaKey;
  }
  return e.ctrlKey;
};

export type CustomElement = {
  type: "paragraph";
  align?: "left" | "center" | "right" | "justify";
  children: CustomText[];
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
  return (
    <p
      {...attributes}
      className={clsx(
        element.align === "center" && "text-center",
        element.align === "right" && "text-right",
        element.align === "justify" && "text-justify",
        element.align === "left" && "text-left",
        !element.align && "text-left",
        "mb-2 leading-relaxed pt-1"
      )}
    >
      {children}
    </p>
  );
};

const Editor = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [yjsContext, setYjsContext] = useState<{ sharedType: Y.XmlText; provider: WebrtcProvider; editor: any } | null>(null);

  useEffect(() => {
    // Instantiate Yjs and WebRTC only on the client side to avoid SSR errors
    const doc = new Y.Doc();
    const sharedType = doc.get("content", Y.XmlText) as Y.XmlText;
    const provider = new WebrtcProvider("test-document-room", doc);

    if (sharedType.length === 0) {
      sharedType.applyDelta(slateNodesToInsertDelta(initialValue));
    }

    const editor = withYjs(withReact(createEditor()), sharedType);
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

    // Line Breaks & Format Reset
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editor.insertBreak();
      SlateEditor.removeMark(editor, "bold");
      SlateEditor.removeMark(editor, "italic");
      SlateEditor.removeMark(editor, "underline");
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      SlateEditor.insertText(editor, "\n");
      return;
    }
  }, [yjsContext]);

  if (!yjsContext) return null;
  const { editor } = yjsContext;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8 relative pb-32">
      <Slate editor={editor} initialValue={initialValue}>
        <Toolbar zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        
        <div 
          className="transition-transform duration-200 ease-in-out origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <div className="bg-white shadow-2xl ring-1 ring-slate-200 min-h-[1050px] w-full p-12 sm:p-20 flex flex-col rounded-sm">
            <Editable 
              className="outline-none flex-grow text-slate-800"
              placeholder="Start typing..."
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={onKeyDown}
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
      </Slate>
    </div>
  );
};

export default Editor;
