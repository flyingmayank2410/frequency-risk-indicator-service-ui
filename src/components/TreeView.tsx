import React from "react";

interface Location {
  id: number;
  locationName: string;
}

interface Switchgear {
  swgId: number;
  swgName: string;
  locationId: number;
}

interface Props {
  locations: Location[];
  switchgearMap: Record<number, Switchgear[]>;
  onSelectLocation: (location: Location) => void;
}

const TreeView: React.FC<Props> = ({ locations, switchgearMap, onSelectLocation }) => {
  return (
    <ul className="space-y-2 text-sm">
      {locations.map((loc) => (
        <li key={loc.id}>
          <button
            className="font-semibold text-blue-600 hover:underline"
            onClick={() => onSelectLocation(loc)}
          >
            📍 {loc.locationName}
          </button>
          <ul className="ml-4 mt-1 text-gray-700">
            {(switchgearMap[loc.id] || []).map((swg) => (
              <li key={swg.swgId}>🔌 {swg.swgName}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default TreeView;
