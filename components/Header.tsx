"use client";

import React from "react";
import { UserCircle } from "lucide-react";
import { useCollaborators } from "./CollaboratorsContext";

const Header = () => {
  const { collaborators } = useCollaborators();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Collab</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {collaborators.map((c, idx) => (
            <div
              key={idx}
              className="relative group rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm cursor-default"
              style={{ backgroundColor: c.data.color, width: 32, height: 32 }}
            >
              <span className="text-xs font-semibold uppercase">{c.data.name.charAt(0)}</span>
              
              {/* Tooltip */}
              <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded shadow-lg pointer-events-none z-50">
                {c.data.name}
              </div>
            </div>
          ))}
        </div>
        
        <button className="text-slate-500 hover:text-slate-900 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300">
          <UserCircle size={28} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
};

export default Header;
