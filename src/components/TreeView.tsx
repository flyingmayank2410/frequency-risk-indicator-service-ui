// src/components/TreeView.tsx
import React, { useState } from "react";

interface TreeViewProps {
  locations: any[];
  switchgears: Record<number, any[]>;
  onSelect: (locationId: number) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  locations,
  switchgears,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Locations</h2>
      <ul className="space-y-2">
        {locations.map((loc) => (
          <li key={loc.id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  toggleExpand(loc.id);
                  onSelect(loc.id);
                }}
                className="text-blue-600 hover:underline text-left w-full"
              >
                {loc.locationName}
              </button>
            </div>
            {expanded[loc.id] && (
              <ul className="ml-4 mt-2 space-y-1">
                {(switchgears[loc.id] || []).map((swg) => (
                  <li key={swg.swgId} className="text-sm text-gray-700 pl-2">
                    └ {swg.swgName}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TreeView;
