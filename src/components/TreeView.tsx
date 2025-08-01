// src/components/TreeView.tsx
import React from "react";

interface TreeViewProps {
  locations: any[];
  onLocationClick: (id: number) => void;
}

const TreeView: React.FC<TreeViewProps> = ({ locations, onLocationClick }) => {
  return (
    <ul className="space-y-2">
      {locations.map((location) => (
        <li key={location.id}>
          <button
            className="text-left font-semibold text-blue-700 hover:underline"
            onClick={() => onLocationClick(location.id)}
          >
            📍 {location.locationName}
          </button>
          {location.switchgears?.length > 0 && (
            <ul className="pl-4 text-sm text-gray-600">
              {location.switchgears.map((swg: any) => (
                <li key={swg.swgId}>🔌 {swg.swgName}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TreeView;
