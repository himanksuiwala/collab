import React, { useEffect, useState } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";
import { relativeRangeToSlateRange } from "@slate-yjs/core";
import { CursorData } from "@/lib/identity";
import * as Y from "yjs";
import { Range } from "slate";

export interface CursorRect {
  id: string;
  clientId: number;
  data: CursorData;
  caretRect: { top: number; left: number; height: number };
  selectionRects: { top: number; left: number; height: number; width: number }[];
}

interface CursorOverlayProps {
  cursorStates: Record<string, any>;
  sharedType: Y.XmlText;
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({ cursorStates, sharedType }) => {
  const editor = useSlateStatic();
  const [rects, setRects] = useState<CursorRect[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    
    const updateRects = () => {
      try {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const newRects: CursorRect[] = [];

        Object.entries(cursorStates).forEach(([id, state]) => {
          if (!state.relativeSelection) return;
          
          try {
            const range = relativeRangeToSlateRange(sharedType, editor, state.relativeSelection);
            if (!range) return;
            
            const domRange = ReactEditor.toDOMRange(editor, range);
            const isCollapsed = Range.isCollapsed(range);
            
            let caretRect = { top: 0, left: 0, height: 20 };
            const selectionRects: { top: number; left: number; width: number; height: number }[] = [];

            if (isCollapsed) {
              const rect = domRange.getBoundingClientRect();
              caretRect = {
                top: rect.top - containerRect.top,
                left: rect.left - containerRect.left,
                height: rect.height || 20,
              };
            } else {
              // Highlight rectangles
              const rects = Array.from(domRange.getClientRects());
              rects.forEach(r => {
                selectionRects.push({
                  top: r.top - containerRect.top,
                  left: r.left - containerRect.left,
                  width: r.width,
                  height: r.height,
                });
              });
              
              // Exact caret position
              const focusPoint = ReactEditor.toDOMPoint(editor, range.focus);
              const collapsedDOMRange = document.createRange();
              collapsedDOMRange.setStart(focusPoint[0], focusPoint[1]);
              collapsedDOMRange.setEnd(focusPoint[0], focusPoint[1]);
              const focusRect = collapsedDOMRange.getBoundingClientRect();
              
              caretRect = {
                top: focusRect.top - containerRect.top,
                left: focusRect.left - containerRect.left,
                height: focusRect.height || 20,
              };
            }
            
            newRects.push({
              id,
              clientId: state.clientId,
              data: state.data as CursorData,
              caretRect,
              selectionRects,
            });
          } catch (e) {
            // DOM node not found or range invalid; skip safely
          }
        });
        
        setRects(newRects);
      } catch (e) {
        // Safe catch for top level errors
      }
      
      // Keep syncing if typing
      animationFrameId = requestAnimationFrame(updateRects);
    };

    updateRects();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorStates, editor, sharedType]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
      {rects.map((rect) => (
        <React.Fragment key={rect.id}>
          {/* Selection Highlights */}
          {rect.selectionRects.map((sr, i) => (
            <div
              key={i}
              className="absolute opacity-20 pointer-events-none"
              style={{
                top: `${sr.top}px`,
                left: `${sr.left}px`,
                width: `${sr.width}px`,
                height: `${sr.height}px`,
                backgroundColor: rect.data?.color || "#000",
              }}
            />
          ))}

          {/* Caret */}
          <div
            className="absolute w-0.5 transition-all duration-75 ease-out"
            style={{
              top: `${rect.caretRect.top}px`,
              left: `${rect.caretRect.left}px`,
              height: `${rect.caretRect.height}px`,
              backgroundColor: rect.data?.color || "#000",
            }}
          >
            {/* Caret Name Tag */}
            <div
              className="absolute top-0 left-0 -translate-y-[calc(100%+2px)] px-1.5 py-0.5 rounded-t-sm rounded-br-sm text-[10px] font-bold text-white whitespace-nowrap shadow-sm opacity-80"
              style={{ backgroundColor: rect.data?.color || "#000" }}
            >
              {rect.data?.name || "Unknown"}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
