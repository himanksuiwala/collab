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
  Minus
} from "lucide-react";

interface ToolbarProps {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ zoomLevel, setZoomLevel }) => {
  const editor = useSlate();

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
      className={`p-1.5 rounded-sm hover:bg-slate-100 transition-colors flex items-center justify-center pt-[6px] ${
        active ? "bg-slate-200 text-slate-900" : "text-slate-600"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-slate-200 mx-2" />;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 h-[56px] bg-white/90 backdrop-blur border border-slate-200/60 flex items-center px-4 shadow-2xl rounded-2xl gap-1">
      <Button active={isMarkActive("bold")} onClick={() => toggleMark("bold")}>
        <Bold size={18} />
      </Button>
      <Button active={isMarkActive("italic")} onClick={() => toggleMark("italic")}>
        <Italic size={18} />
      </Button>
      <Button active={isMarkActive("underline")} onClick={() => toggleMark("underline")}>
        <Underline size={18} />
      </Button>

      <Divider />

      <Button active={isBlockActive("left")} onClick={() => toggleBlock("left")}>
        <AlignLeft size={18} />
      </Button>
      <Button active={isBlockActive("center")} onClick={() => toggleBlock("center")}>
        <AlignCenter size={18} />
      </Button>
      <Button active={isBlockActive("right")} onClick={() => toggleBlock("right")}>
        <AlignRight size={18} />
      </Button>
      <Button active={isBlockActive("justify")} onClick={() => toggleBlock("justify")}>
        <AlignJustify size={18} />
      </Button>

      <Divider />

      <div className="flex items-center gap-1">
        <Button onClick={() => changeFontSize(-2)}>
          <Minus size={16} />
        </Button>
        <span className="text-xs font-medium text-slate-600 w-6 text-center select-none pt-[2px]">
          {((Editor.marks(editor) as any)?.fontSize) || 16}
        </span>
        <Button onClick={() => changeFontSize(2)}>
          <Plus size={16} />
        </Button>
      </div>
      {/* This is purposely commented out. */}
      {/* <div className="flex items-center gap-1 ml-auto">
        <span className="text-xs text-slate-500 mr-1 pt-[2px]">Zoom</span>
        <Button onClick={() => handleZoomStep(-10)}>
          <Minus size={16} />
        </Button>
        <div className="relative flex items-center">
          <input
            type="number"
            min="50"
            max="200"
            value={zoomLevel}
            onChange={handleZoomChange}
            className="w-12 text-center text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded py-1 pt-[6px] outline-none focus:ring-1 focus:ring-slate-300"
          />
          <span className="absolute right-1 text-xs text-slate-400 pointer-events-none pt-[2px]">%</span>
        </div>
        <Button onClick={() => handleZoomStep(10)}>
          <Plus size={16} />
        </Button>
      </div> */}
    </div>
  );
};

export default Toolbar;
