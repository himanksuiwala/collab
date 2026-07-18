"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CursorData } from "@/lib/identity";

export interface Collaborator {
  clientId: number;
  data: CursorData;
}

interface CollaboratorsContextType {
  collaborators: Collaborator[];
  updateCollaborators: (newCollaborators: Collaborator[]) => void;
}

const CollaboratorsContext = createContext<CollaboratorsContextType>({
  collaborators: [],
  updateCollaborators: () => {},
});

export const CollaboratorsProvider = ({ children }: { children: ReactNode }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  // Use callback to avoid unnecessary re-renders when passing to context
  const updateCollaborators = useCallback((newCollaborators: Collaborator[]) => {
    setCollaborators((prev) => {
      // Only update if the length or client IDs changed to prevent re-renders on cursor moves
      if (prev.length !== newCollaborators.length) return newCollaborators;
      
      const prevIds = prev.map(c => c.clientId).sort().join(',');
      const newIds = newCollaborators.map(c => c.clientId).sort().join(',');
      
      if (prevIds !== newIds) return newCollaborators;
      return prev;
    });
  }, []);

  return (
    <CollaboratorsContext.Provider value={{ collaborators, updateCollaborators }}>
      {children}
    </CollaboratorsContext.Provider>
  );
};

export const useCollaborators = () => useContext(CollaboratorsContext);
