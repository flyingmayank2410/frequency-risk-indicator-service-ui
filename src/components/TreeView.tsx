import React from "react";

interface Switchgear {
  swgId: number;
  swgName: string;
}

interface Location {
  id: number;
  locationName: string;
  switchgears: Switchgear[];
}

interface Props {
  locations: Location[];
  onLocationClick: (locationId: number) => void;
}

const TreeView: React.FC<Props> = ({ locations, onLocationClick }) => {
  return (
    <div className="space-y-2">
      {locations.map((loc) => (
        <div key={loc.id} className="bg-white rounded-xl shadow p-2">
          <button
            onClick={() => onLocationClick(loc.id)}
            className="text-blue-700 font-semibold"
          >
            📍 {loc.locationName}
          </button>
          <ul className="ml-4 mt-2 list-disc text-sm text-gray-600">
            {loc.switchgears.map((swg) => (
              <li key={swg.swgId}>⚡ {swg.swgName}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TreeView;