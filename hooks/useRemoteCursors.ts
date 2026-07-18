import { useEffect, useState, useRef } from "react";
import { CursorEditor, CursorStateChangeEvent } from "@slate-yjs/core";
import { useCollaborators } from "@/components/CollaboratorsContext";
import { CursorData } from "@/lib/identity";

export const useRemoteCursors = (editor: any, provider: any) => {
  const [cursorStates, setCursorStates] = useState<Record<string, any>>({});
  const lastKnownSelections = useRef<Record<string, any>>({});
  const { updateCollaborators } = useCollaborators();

  useEffect(() => {
    if (!editor || !provider || !CursorEditor.isCursorEditor(editor)) return;

    const handleChange = (event: CursorStateChangeEvent) => {
      // Get all current cursor states
      const states = CursorEditor.cursorStates(editor);
      
      // Filter out our own cursor using the provider's client ID
      const myClientId = provider.awareness.clientID;
      const remoteStates: Record<string, any> = {};
      const activeCollaborators: { clientId: number; data: CursorData }[] = [];

      Object.entries(states).forEach(([id, state]) => {
        if (state.clientId !== myClientId) {
          
          // Implement freeze-on-blur: retain last known selection if it becomes null
          if (state.relativeSelection) {
            lastKnownSelections.current[id] = state.relativeSelection;
          } else if (lastKnownSelections.current[id]) {
            state.relativeSelection = lastKnownSelections.current[id];
          }

          remoteStates[id] = state;
          if (state.data) {
            activeCollaborators.push({
              clientId: state.clientId,
              data: state.data as CursorData,
            });
          }
        }
      });

      setCursorStates(remoteStates);
      updateCollaborators(activeCollaborators);
    };

    // Initial state grab
    handleChange({ added: [], updated: [], removed: [] });

    // Listen for changes
    CursorEditor.on(editor, "change", handleChange);

    return () => {
      CursorEditor.off(editor, "change", handleChange);
    };
  }, [editor, provider, updateCollaborators]);

  return cursorStates;
};
