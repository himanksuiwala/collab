"use client";

import React, { useMemo, useState, useCallback } from "react";
import { createEditor, Descendant, BaseEditor } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import clsx from "clsx";
import Toolbar from "./Toolbar";

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
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8 relative pb-32">
      <Slate editor={editor} initialValue={value} onChange={setValue}>
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
            />
          </div>
        </div>
      </Slate>
    </div>
  );
};

export default Editor;
