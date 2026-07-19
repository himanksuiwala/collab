import React from "react";
import clsx from "clsx";

export const Leaf = ({ attributes, children, leaf }: any) => {
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

export const Element = ({ attributes, children, element }: any) => {
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
