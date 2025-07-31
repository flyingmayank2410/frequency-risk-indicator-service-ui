// src/components/TreeView.tsx
import React from "react";

interface Switchgear {
  swgId: number;
  swgName: string;
  incomerFeeder: number;
  outgoingFeeder: number;
  activeIncomerFeeder: number;
  activeOutgoingFeeder: number;
  locationId: number;
}

interface Location {
  id: number;
  locationName: string;
  switchgears?: Switchgear[];
}

interface Props {
  locations: Location[];
  onLocationClick: (id: number) => void;
}

const TreeView: React.FC<Props> = ({ locations, onLocationClick }) => {
  return (
    <ul className="space-y-2">
      {locations.map((loc) => (
        <li key={loc.id}>
          <button
            className="font-semibold text-blue-700 hover:underline"
            onClick={() => onLocationClick(loc.id)}
          >
            {loc.locationName}
          </button>
          {Array.isArray(loc.switchgears) && loc.switchgears.length > 0 && (
            <ul className="ml-4 list-disc text-sm text-gray-700">
              {loc.switchgears.map((swg) => (
                <li key={swg.swgId}>{swg.swgName}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TreeView;
