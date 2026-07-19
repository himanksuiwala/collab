"use client";

import React from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Text, Element as SlateElement } from "slate";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Plus,
  Minus,
  ChevronDown,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  History
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/cloudinary";

interface ToolbarProps {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  onOpenLinkPopover?: () => void;
  onSaveVersion?: () => void;
  onToggleHistory?: () => void;
  isHistoryOpen?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ zoomLevel, setZoomLevel, onOpenLinkPopover, onSaveVersion, onToggleHistory, isHistoryOpen }) => {
  const editor = useSlate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const id = crypto.randomUUID();
    
    Transforms.insertNodes(editor, {
      type: "image-loading",
      id,
      children: [{ text: "" }],
    } as any);

    try {
      const url = await uploadImageToCloudinary(file);
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
      toast.error("Failed to upload image. Please try again.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isMarkActive = (format: string) => {
    const marks = Editor.marks(editor) as Record<string, any>;
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isBlockActive = (format: string, blockType = "align") => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (n as any)[blockType] === format,
      })
    );
    return !!match;
  };

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(format);
    Transforms.setNodes(
      editor,
      { align: isActive ? undefined : format } as any,
      { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) }
    );
  };

  const toggleBlockType = (format: string) => {
    const isActive = isBlockActive(format, "type");
    // If it's a heading and we click it again, revert to paragraph
    const newType = isActive ? "paragraph" : format;
    Transforms.setNodes(
      editor,
      { type: newType } as any,
      { match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) }
    );
  };

  const toggleList = (format: string) => {
    const isActive = isBlockActive(format, "type");
    
    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type === "bulleted-list" || n.type === "numbered-list"),
      split: true,
    });

    const newType = isActive ? "paragraph" : "list-item";
    
    Transforms.setNodes(
      editor,
      { type: newType } as any,
      { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) }
    );

    if (!isActive) {
      Transforms.wrapNodes(
        editor,
        { type: format } as any,
        { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "list-item" }
      );
    }
  };

  const currentBlockType = isBlockActive("heading-one", "type")
    ? "Heading"
    : isBlockActive("heading-two", "type")
    ? "Sub-heading"
    : "Normal";

  const getActiveAlign = () => {
    const { selection } = editor;
    if (!selection) return "left";

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
      })
    );
    if (match) {
      return (match[0] as any).align || "left";
    }
    return "left";
  };

  const currentAlign = getActiveAlign();
  const AlignIcon = 
    currentAlign === "center" ? AlignCenter :
    currentAlign === "right" ? AlignRight :
    currentAlign === "justify" ? AlignJustify :
    AlignLeft;

  const changeFontSize = (delta: number) => {
    const marks = Editor.marks(editor) as Record<string, any>;
    const currentSize = marks?.fontSize || 16;
    const newSize = Math.max(8, Math.min(72, currentSize + delta));
    Editor.addMark(editor, "fontSize", newSize);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 50 && val <= 200) {
      setZoomLevel(val);
    }
  };

  const handleZoomStep = (delta: number) => {
    const newZoom = Math.max(50, Math.min(200, zoomLevel + delta));
    setZoomLevel(newZoom);
  };

  const Button = ({ active, onClick, children }: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-1.5 rounded-sm hover:bg-slate-100 transition-colors flex items-center justify-center ${
        active ? "bg-slate-200 text-slate-900" : "text-slate-600"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-slate-200 mx-2" />;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 h-[56px] bg-white/90 backdrop-blur border border-slate-200/60 flex items-center px-4 shadow-2xl rounded-2xl gap-1">
      {/* 1. Font Type */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm hover:bg-slate-100 transition-colors text-slate-700 text-sm font-medium focus:outline-none">
          <span className="w-20 text-left truncate">{currentBlockType}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-36 mb-2">
          <DropdownMenuItem onClick={() => toggleBlockType("paragraph")}>Normal</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleBlockType("heading-one")}>Heading</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleBlockType("heading-two")}>Sub-heading</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* 2. Font Size */}
      <div className="flex items-center gap-1">
        <Button onClick={() => changeFontSize(-2)}>
          <Minus size={16} />
        </Button>
        <span className="text-xs font-medium text-slate-600 w-6 text-center select-none">
          {((Editor.marks(editor) as any)?.fontSize) || 16}
        </span>
        <Button onClick={() => changeFontSize(2)}>
          <Plus size={16} />
        </Button>
      </div>

      <Divider />

      {/* 3. Formatting (Bold, Italic, Underline, Link) */}
      <Button active={isMarkActive("bold")} onClick={() => toggleMark("bold")}>
        <Bold size={18} />
      </Button>
      <Button active={isMarkActive("italic")} onClick={() => toggleMark("italic")}>
        <Italic size={18} />
      </Button>
      <Button active={isMarkActive("underline")} onClick={() => toggleMark("underline")}>
        <Underline size={18} />
      </Button>
      <Button active={isBlockActive("link", "type")} onClick={() => onOpenLinkPopover && onOpenLinkPopover()}>
        <LinkIcon size={18} />
      </Button>

      <Divider />

      {/* 4. Alignment */}
      <DropdownMenu>
        <DropdownMenuTrigger className="p-1.5 rounded-sm hover:bg-slate-100 transition-colors text-slate-700 flex items-center justify-center focus:outline-none">
          <AlignIcon size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="w-32 mb-2">
          <DropdownMenuItem className="focus:bg-slate-100" onClick={() => toggleBlock("left")}>
            <AlignLeft size={16} className="mr-2" />
            <span>Left</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100" onClick={() => toggleBlock("center")}>
            <AlignCenter size={16} className="mr-2" />
            <span>Center</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100" onClick={() => toggleBlock("right")}>
            <AlignRight size={16} className="mr-2" />
            <span>Right</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100" onClick={() => toggleBlock("justify")}>
            <AlignJustify size={16} className="mr-2" />
            <span>Justify</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Divider />

      {/* 5. Lists */}
      <Button active={isBlockActive("bulleted-list", "type")} onClick={() => toggleList("bulleted-list")}>
        <List size={18} />
      </Button>
      <Button active={isBlockActive("numbered-list", "type")} onClick={() => toggleList("numbered-list")}>
        <ListOrdered size={18} />
      </Button>

      <Divider />

      {/* 6. Image */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <Button onClick={() => fileInputRef.current?.click()}>
        <ImageIcon size={18} />
      </Button>

      <Divider />

      {/* 7. Version History */}
      {onToggleHistory && (
        <Button active={isHistoryOpen} onClick={onToggleHistory}>
          <History size={18} />
        </Button>
      )}
      {onSaveVersion && (
        <Button onClick={onSaveVersion}>
          <Save size={18} />
        </Button>
      )}
    </div>
  );
};

export default Toolbar;
