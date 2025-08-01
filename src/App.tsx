import React, { useEffect, useState } from "react";
import LocationForm from "./components/LocationForm";
import SwitchgearForm from "./components/SwitchgearForm";
import TreeView from "./components/TreeView";
import GraphPanel from "./components/GraphPanel";
import { getLocations, getSwitchgears } from "./api";

interface Location {
  id: number;
  locationName: string;
}

interface Switchgear {
  swgId: number;
  swgName: string;
  locationId: number;
}

const App: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [switchgears, setSwitchgears] = useState<Switchgear[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const locRes = await getLocations();
      setLocations(locRes.data?.data || []);

      const allSwgs = [];
      for (const loc of locRes.data?.data || []) {
        const swgRes = await getSwitchgears(loc.id);
        if (swgRes?.data?.data) {
          allSwgs.push(...swgRes.data.data);
        }
      }
      setSwitchgears(allSwgs);
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Monitoring Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <TreeView
            locations={locations}
            switchgears={switchgears}
            onSelectLocation={(id) => setSelectedLocationId(id)}
          />
          <LocationForm onSave={loadData} />
          {selectedLocationId && (
            <SwitchgearForm locationId={selectedLocationId} onSave={loadData} />
          )}
        </div>
        <div className="col-span-2">
          {selectedLocationId ? (
            <GraphPanel locationId={selectedLocationId} />
          ) : (
            <p className="text-gray-600 mt-6">Select a location to see its graph.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
