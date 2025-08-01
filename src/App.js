import React, { useState } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSwitchgear, setSelectedSwitchgear] = useState(null);
  const [refresh, setRefresh] = useState(false);

  function handleTreeRefresh() {
    setRefresh(r => !r);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ddd", padding: 16 }}>
        <LocationTree
          onSelectLocation={loc => {
            setSelectedLocation(loc);
            setSelectedSwitchgear(null);
          }}
          onSelectSwitchgear={swg => setSelectedSwitchgear(swg)}
          refresh={refresh}
        />
        <button onClick={() => setSelectedLocation({})}>
          + Add Location
        </button>
      </div>
      <div style={{ width: "70%", padding: 16 }}>
        {selectedLocation && !selectedSwitchgear && (
          <LocationForm
            location={selectedLocation}
            onRefresh={handleTreeRefresh}
            onAddSwitchgear={() => setSelectedSwitchgear({ locationId: selectedLocation.id })}
          />
        )}
        {selectedSwitchgear && (
          <SwitchgearForm
            switchgear={selectedSwitchgear}
            onRefresh={handleTreeRefresh}
            onBack={() => setSelectedSwitchgear(null)}
          />
        )}
        {selectedLocation && selectedLocation.id && !selectedSwitchgear && (
          <GraphSection locationId={selectedLocation.id} />
        )}
      </div>
    </div>
  );
}

export default App;
