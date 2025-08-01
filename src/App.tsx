import React, { useEffect, useState } from "react";
import TreeView from "./components/TreeView";
import GraphPanel from "./components/GraphPanel";
import LocationForm from "./components/LocationForm";
import SwitchgearForm from "./components/SwitchgearForm";
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

function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [switchgears, setSwitchgears] = useState<Switchgear[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  const fetchData = async () => {
    const locRes = await getLocations();
    if (locRes?.data?.data) {
      setLocations(locRes.data.data);
    }

    const swgRes = await Promise.all(
      locRes.data.data.map((loc: Location) => getSwitchgears(loc.id))
    );

    const allSwitchgears = swgRes
      .flatMap((res) => res?.data?.data || [])
      .map((sg) => ({
        ...sg,
        swgId: sg.swgId,
        swgName: sg.swgName,
        locationId: sg.locationId,
      }));

    setSwitchgears(allSwitchgears);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Frequency Risk UI</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <TreeView
            locations={locations}
            switchgears={switchgears}
            onSelectLocation={setSelectedLocationId}
          />
        </div>
        <div className="col-span-3">
          <GraphPanel locationId={selectedLocationId ?? 0} />
          <LocationForm onSuccess={fetchData} />
          {selectedLocationId && (
            <SwitchgearForm locationId={selectedLocationId} onSuccess={fetchData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
