import { useCallback } from "react";
import { Transforms, Element as SlateElement, Editor as SlateEditor } from "slate";
import { uploadImageToCloudinary } from "@/cloudinary";
import { toast } from "sonner";

export const useImageUpload = (editor: any) => {
  return useCallback(async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!editor) return;
    const { items } = e.clipboardData;

    let imageFile: File | null = null;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          imageFile = file;
          break;
        }
      }
    }

    if (imageFile) {
      e.preventDefault();

      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      const id = crypto.randomUUID();
      Transforms.insertNodes(editor, {
        type: "image-loading",
        id,
        children: [{ text: "" }],
      } as any);

      try {
        const url = await uploadImageToCloudinary(imageFile);
        if (url) {
          Transforms.setNodes(
            editor,
            { type: "image", url } as any,
            { match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n as any).id === id }
          );
        } else {
          Transforms.removeNodes(editor, { match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n as any).id === id });
        }
      } catch (err) {
        Transforms.removeNodes(editor, { match: n => !SlateEditor.isEditor(n) && SlateElement.isElement(n) && (n as any).id === id });
      }
    }
  }, [editor]);
};
