import React from "react";
import { UserCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 shadow-sm flex items-center justify-between">
      <h1 className="text-xl font-bold text-slate-900 tracking-tight">Collab</h1>
      <button className="text-slate-500 hover:text-slate-900 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300">
        <UserCircle size={28} strokeWidth={1.5} />
      </button>
    </header>
  );
};

export default Header;
