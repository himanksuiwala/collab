"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { Descendant, Editor as SlateEditor, Transforms, Element as SlateElement, Range, BaseEditor } from "slate";
import { Slate, Editable, ReactEditor } from "slate-react";
import Toolbar from "./Toolbar";
import { generateIdentity } from "@/lib/identity";
import { useRemoteCursors } from "@/hooks/useRemoteCursors";
import { CursorOverlay } from "./CursorOverlay";
import LinkPopover from "./LinkPopover";
import VersionHistorySidebar from "./VersionHistorySidebar";
import ComparisonView from "./ComparisonView";
import { Leaf, Element } from "./Elements";
import { ZoomWrapper } from "./ZoomWrapper";
import { useCollabEditor } from "@/hooks/useCollabEditor";
import { useEditorShortcuts } from "@/hooks/useEditorShortcuts";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import * as Y from "yjs";

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
  authorName?: string;
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

const Editor = () => {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error" | "hidden">("hidden");
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [linkSelectionRect, setLinkSelectionRect] = useState<DOMRect | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [linkSelection, setLinkSelection] = useState<Range | null>(null);

  const identity = useRef(generateIdentity());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const { connectionStatus, yjsContext, isLocalSynced, localContext } = useCollabEditor(identity, setSaveStatus);

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

  const onKeyDown = useEditorShortcuts(yjsContext?.editor, openLinkPopover);
  const onPaste = useImageUpload(yjsContext?.editor);
  const cursorStates = useRemoteCursors(yjsContext?.editor, yjsContext?.provider);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const handleSaveVersion = useCallback(() => {
    if (!localContext) return;
    const { doc, versionsMap } = localContext;
    if (!versionsMap) return;
    const snapshot = Y.snapshot(doc);
    const encodedSnapshot = Y.encodeSnapshot(snapshot);
    const timestamp = Date.now().toString();
    
    versionsMap.set(timestamp, {
      date: new Date().toISOString(),
      snapshot: encodedSnapshot,
    });
    
    toast.success("Version saved successfully!");
  }, [localContext]);

  if (!isLocalSynced) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-lg font-medium text-slate-600">Loading Document...</span>
        </div>
      </div>
    );
  }

  if (!yjsContext) return null;
  const { editor, sharedType } = yjsContext;

  const handleEditorChange = () => {
    if (saveStatus === "error") return;
    setSaveStatus("saving");
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
      
      hideTimeoutRef.current = setTimeout(() => {
        setSaveStatus("hidden");
      }, 2500);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8 relative pb-32">
      <Slate editor={editor} initialValue={initialValue} onChange={handleEditorChange}>
        <ZoomWrapper
          renderToolbar={(zoomLevel, setZoomLevel) => (
            !isHistoryOpen ? (
              <Toolbar 
                zoomLevel={zoomLevel} 
                setZoomLevel={setZoomLevel} 
                onOpenLinkPopover={openLinkPopover} 
                onSaveVersion={handleSaveVersion}
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                isHistoryOpen={isHistoryOpen}
              />
            ) : <></>
          )}
        >
          <div className="bg-white shadow-2xl ring-1 ring-slate-200 min-h-[1050px] w-full flex rounded-sm relative">
            <div className={`flex flex-col p-12 sm:p-20 relative ${selectedVersionId ? 'w-1/2 border-r border-slate-200' : 'w-full'}`}>
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
            {selectedVersionId && localContext && (
              <div className="w-1/2 relative bg-slate-50 overflow-hidden rounded-r-sm">
                <ComparisonView 
                  liveDoc={localContext.doc} 
                  encodedSnapshot={localContext.versionsMap.get(selectedVersionId).snapshot} 
                />
              </div>
            )}
          </div>
        </ZoomWrapper>

        {localContext && (
          <VersionHistorySidebar
            isOpen={isHistoryOpen}
            onClose={() => {
              setIsHistoryOpen(false);
              setSelectedVersionId(null);
            }}
            versionsMap={localContext.versionsMap}
            selectedVersionId={selectedVersionId}
            onSelectVersion={setSelectedVersionId}
          />
        )}

        {/* Connection Status Chip */}
        <div className="fixed bottom-8 right-8 z-50 bg-white/90 backdrop-blur border border-slate-200/60 shadow-xl rounded-full px-4 py-2.5 flex items-center hover:shadow-2xl hover:-translate-y-0.5 transition-all cursor-default overflow-hidden">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              connectionStatus === "online" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
              connectionStatus === "offline" ? "bg-rose-500" :
              "bg-amber-400 animate-pulse"
            }`} />
            <span className="text-sm font-medium text-slate-600 capitalize select-none pt-[2px] whitespace-nowrap">
              {connectionStatus}
            </span>
          </div>

          <div className={`flex items-center transition-all duration-500 ease-in-out ${
            saveStatus === "hidden" ? "max-w-0 opacity-0 overflow-hidden" : "max-w-[150px] opacity-100 ml-3"
          }`}>
            <div className="w-px h-4 bg-slate-300 mr-3 shrink-0" />
            <span className={`text-xs font-medium select-none pt-[2px] whitespace-nowrap shrink-0 ${
              saveStatus === "saving" ? "text-amber-500" :
              saveStatus === "error" ? "text-rose-500" :
              "text-slate-500"
            }`}>
              {saveStatus === "saving" ? "Saving..." : 
               saveStatus === "error" ? "Storage Disabled" : 
               "Saved locally"}
            </span>
          </div>
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
