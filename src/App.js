import React, { useState } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";
import CombinedInfoPanels from "./CombinedInfoPanels";
import styles from "./styles";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSwitchgear, setSelectedSwitchgear] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Button handlers for location and switchgear
  function handleEditLocation() {
    setShowLocationForm(true);
    setSelectedSwitchgear(null);
  }
  function handleAddSwitchgear() {
    setShowLocationForm(false);
    setSelectedSwitchgear({ locationId: selectedLocation?.id });
  }
  function handleCancelForm() {
    setShowLocationForm(false);
    setSelectedSwitchgear(null);
  }
  function handleLocationFormRefresh(newLocationData) {
    if (newLocationData && newLocationData.id) {
      setSelectedLocation(newLocationData);
    }
    setShowLocationForm(false);
    setSelectedSwitchgear(null);
    setRefresh(r => !r);
  }
  function handleTreeRefresh() {
    setRefresh(r => !r);
    setShowLocationForm(false);
    setSelectedSwitchgear(null);
  }

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <LocationTree
          onSelectLocation={loc => {
            setSelectedLocation(loc);
            setShowLocationForm(false);
            setSelectedSwitchgear(null);
          }}
          onSelectSwitchgear={swg => setSelectedSwitchgear(swg)}
          refresh={refresh}
        />
        <button
          onClick={() => {
            setSelectedLocation({});
            setShowLocationForm(true);
            setSelectedSwitchgear(null);
          }}
          style={{
            marginTop: 18,
            background: "#50aaff",
            color: "#fff",
            borderRadius: 10,
            border: "none",
            padding: "11px 21px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 15,
            boxShadow: "0 2px 8px rgba(76,175,255,0.11)"
          }}
        >
          + Add Location
        </button>
      </aside>
      <main style={styles.mainContent}>
        {!selectedLocation && !showLocationForm && !selectedSwitchgear && (
          <>
            <CombinedInfoPanels />
            <div
              style={{ color: "#888", fontSize: 17, textAlign: "center", marginTop: 15, fontWeight: 500 }}
            >
              No Location Selected
            </div>
          </>
        )}

        {selectedLocation && !showLocationForm && !selectedSwitchgear && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 22,
                background: "#23272f",
                borderRadius: 14,
                padding: "18px 22px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.22)"
              }}
            >
              <h3 style={{ margin: 0, color: "#97aaff", fontWeight: 800, fontSize: 23 }}>
                {selectedLocation.locationName || "Current Location"}
              </h3>
              <div>
                <button
                  onClick={handleEditLocation}
                  style={{
                    marginRight: 12,
                    padding: "10px 22px",
                    background: "#4caf50",
                    color: "#fff",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginLeft: 8,
                    boxShadow: "0 2px 8px rgba(80,170,255,0.19)",
                    cursor: "pointer",
                    letterSpacing: "0.04em"
                  }}
                >
                  Edit Location
                </button>
                <button
                  onClick={handleAddSwitchgear}
                  style={{
                    padding: "10px 22px",
                    background: "#50aaff",
                    color: "#fff",
                    borderRadius: 8,
                    border: "none",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginLeft: 4,
                    boxShadow: "0 2px 8px rgba(76, 175, 255, 0.12)",
                    cursor: "pointer",
                    letterSpacing: "0.03em"
                  }}
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
            onRefresh={handleLocationFormRefresh}
            onAddSwitchgear={handleAddSwitchgear}
            onCancel={handleCancelForm}
          />
        )}

        {selectedSwitchgear && (
          <SwitchgearForm
            switchgear={selectedSwitchgear}
            onRefresh={handleTreeRefresh}
            onBack={() => setSelectedSwitchgear(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
