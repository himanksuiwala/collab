import { useState, useEffect } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { IndexeddbPersistence } from "y-indexeddb";
import { createEditor, Transforms, Element as SlateElement, Editor as SlateEditor } from "slate";
import { withReact } from "slate-react";
import { withYjs, YjsEditor, withCursors } from "@slate-yjs/core";
import { CursorData } from "@/lib/identity";

export const useCollabEditor = (identity: React.MutableRefObject<CursorData>, setSaveStatus: (status: "saved" | "saving" | "error" | "hidden") => void) => {
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [yjsContext, setYjsContext] = useState<{ sharedType: Y.XmlText; provider: WebrtcProvider; editor: any } | null>(null);
  const [isLocalSynced, setIsLocalSynced] = useState<boolean>(false);
  const [localContext, setLocalContext] = useState<{ doc: Y.Doc; sharedType: Y.XmlText; indexeddbProvider: IndexeddbPersistence; versionsMap: Y.Map<any> } | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    doc.gc = false;
    const sharedType = doc.get("content", Y.XmlText) as Y.XmlText;
    const indexeddbProvider = new IndexeddbPersistence("test-document-room", doc);
    const versionsMap = doc.getMap("versions") as Y.Map<any>;

    let synced = false;
    indexeddbProvider.on("synced", () => {
      if (!synced) {
        synced = true;
        setIsLocalSynced(true);
        setLocalContext({ doc, sharedType, indexeddbProvider, versionsMap });
      }
    });

    indexeddbProvider.on("error", () => {
      console.error("IndexedDB initialization failed. Falling back to in-memory.");
      if (!synced) {
        synced = true;
        setIsLocalSynced(true);
        setSaveStatus("error");
        setLocalContext({ doc, sharedType, indexeddbProvider, versionsMap });
      }
    });

    return () => {
      indexeddbProvider.destroy();
      doc.destroy();
    };
  }, [setSaveStatus]);

  useEffect(() => {
    if (!localContext) return;
    const { doc, sharedType } = localContext;

    const provider = new WebrtcProvider("test-document-room", doc);

    const editor = withCursors(
      withYjs(withReact(createEditor()), sharedType),
      provider.awareness,
      { data: identity.current }
    );

    const { isVoid, isInline, normalizeNode, insertText } = editor;

    editor.insertText = (text) => {
      SlateEditor.addMark(editor, "authorName", identity.current.name);
      insertText(text);
    };

    editor.isVoid = element => {
      return (element as any).type === "image" || (element as any).type === "image-loading" ? true : isVoid(element);
    };

    editor.isInline = element => {
      return (element as any).type === "link" ? true : isInline(element);
    };

    editor.normalizeNode = (entry) => {
      const [node, path] = entry;
      
      if (path.length === 0 && editor.children.length === 0) {
        Transforms.insertNodes(editor, { type: "paragraph", children: [{ text: "" }] } as any, { at: [0] });
        return;
      }
      
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
    };
  }, [localContext, identity]);

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

  return { connectionStatus, yjsContext, isLocalSynced, localContext };
};
