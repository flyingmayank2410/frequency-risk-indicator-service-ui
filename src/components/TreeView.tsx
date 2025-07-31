import React from "react";

interface TreeProps {
  data: any[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
}

const TreeView: React.FC<TreeProps> = ({ data, selectedLocationId, onSelectLocation }) => {
  return (
    <div>
      {data.map((location) => (
        <div key={location.id} className="mb-2">
          <div
            className={`cursor-pointer font-semibold p-1 ${
              selectedLocationId === location.id ? "bg-blue-100" : ""
            }`}
            onClick={() => onSelectLocation(location.id)}
          >
            {location.locationName}
          </div>
          <ul className="ml-4 text-sm text-gray-600">
            {location.switchgears?.map((swg: any) => (
              <li key={swg.swgId}>↳ {swg.swgName}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TreeView;
