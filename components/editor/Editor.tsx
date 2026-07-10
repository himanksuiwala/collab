"use client";

import React, { useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  } as any,
];

const Editor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl ring-1 ring-slate-200 min-h-[1050px] w-full p-12 sm:p-20 flex flex-col rounded-sm transition-all duration-200 ease-in-out">
        <Slate editor={editor} initialValue={value} onChange={setValue}>
          <Editable 
            className="outline-none flex-grow text-slate-800 leading-relaxed"
            placeholder="Start typing..."
          />
        </Slate>
      </div>
    </div>
  );
};

export default Editor;
