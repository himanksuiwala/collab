import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LinkPopoverProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectionRect: DOMRect | null;
  initialUrl: string;
  onSave: (url: string) => void;
  onDelete: () => void;
  isEditing: boolean;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({
  isOpen,
  setIsOpen,
  selectionRect,
  initialUrl,
  onSave,
  onDelete,
  isEditing
}) => {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, initialUrl]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        style={{
          position: "fixed",
          top: selectionRect?.top || 0,
          left: selectionRect?.left || 0,
          width: selectionRect?.width || 0,
          height: selectionRect?.height || 0,
          pointerEvents: "none",
          visibility: "hidden"
        }}
      />
      <PopoverContent className="w-[340px] flex gap-2 p-3 z-50">
        <Input
          ref={inputRef}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSave(url);
            }
          }}
        />
        <Button onClick={() => onSave(url)} size="sm">
          Save
        </Button>
        {isEditing && (
          <Button onClick={onDelete} size="sm" variant="destructive">
            Delete
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default LinkPopover;
