import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { X, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Version {
  date: string;
  snapshot: Uint8Array;
}

interface VersionHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  versionsMap: Y.Map<any>;
  selectedVersionId: string | null;
  onSelectVersion: (id: string | null) => void;
}

const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  isOpen,
  onClose,
  versionsMap,
  selectedVersionId,
  onSelectVersion,
}) => {
  const [versions, setVersions] = useState<Array<{ id: string; date: Date; snapshot: Uint8Array }>>([]);

  useEffect(() => {
    const updateVersions = () => {
      const vList = Array.from(versionsMap.entries()).map(([id, data]) => ({
        id,
        date: new Date(data.date),
        snapshot: data.snapshot,
      }));
      // Sort newest first
      vList.sort((a, b) => b.date.getTime() - a.date.getTime());
      setVersions(vList);
    };

    updateVersions();
    versionsMap.observe(updateVersions);

    return () => {
      versionsMap.unobserve(updateVersions);
    };
  }, [versionsMap]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Clock size={18} className="text-slate-500" />
          Version History
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {versions.length === 0 ? (
          <div className="text-center text-slate-500 mt-10 text-sm">
            No versions saved yet.
          </div>
        ) : (
          versions.map((v) => (
            <div
              key={v.id}
              onClick={() => onSelectVersion(v.id === selectedVersionId ? null : v.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                v.id === selectedVersionId
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-medium text-slate-800">
                {formatDistanceToNow(v.date, { addSuffix: true })}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {v.date.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VersionHistorySidebar;
