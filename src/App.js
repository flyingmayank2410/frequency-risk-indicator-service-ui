import React, { useState } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSwitchgear, setSelectedSwitchgear] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  function handleTreeRefresh() {
    setRefresh(r => !r);
    setShowLocationForm(false);
    setSelectedSwitchgear(null);
  }

  function handleEditLocation() {
    setShowLocationForm(true);
    setSelectedSwitchgear(null);
  }

  function handleAddSwitchgear() {
    setShowLocationForm(false);
    setSelectedSwitchgear({ locationId: selectedLocation.id });
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "30%", borderRight: "1px solid #ddd", padding: 16 }}>
        <LocationTree
          onSelectLocation={loc => {
            setSelectedLocation(loc);
            setShowLocationForm(false);
            setSelectedSwitchgear(null);
          }}
          onSelectSwitchgear={swg => setSelectedSwitchgear(swg)}
          refresh={refresh}
        />
        <button onClick={() => {
          setSelectedLocation({});
          setShowLocationForm(true);
          setSelectedSwitchgear(null);
        }}>
          + Add Location
        </button>
      </div>
      <div style={{ width: "70%", padding: 16 }}>
        {selectedLocation && !showLocationForm && !selectedSwitchgear && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}>
              <h3 style={{margin:0}}>Energy Graphs for Current Location</h3>
              <div>
                <button
                  onClick={handleEditLocation}
                  style={{ marginRight: 12, padding: "8px 14px" }}
                >
                  Edit Location
                </button>
                <button
                  onClick={handleAddSwitchgear}
                  style={{ padding: "8px 14px" }}
                >
                  + Add Switchgear
                </button>
              </div>
            </div>
            <GraphSection locationId={selectedLocation.id} />
          </>
        )}

        {showLocationForm && (
          <LocationForm
            location={selectedLocation}
            onRefresh={handleTreeRefresh}
            onAddSwitchgear={handleAddSwitchgear}
          />
        )}

        {selectedSwitchgear && (
          <SwitchgearForm
            switchgear={selectedSwitchgear}
            onRefresh={handleTreeRefresh}
            onBack={() => setSelectedSwitchgear(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
