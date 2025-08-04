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
            <GraphSection locationId={selectedLocation.id} />
          </>
        )}
        {showLocationForm && (
          <LocationForm
            location={selectedLocation}
            onRefresh={() => setRefresh(r => !r)}
            onAddSwitchgear={() => setSelectedSwitchgear({ locationId: selectedLocation?.id })}
            onCancel={() => setShowLocationForm(false)}
          />
        )}
        {selectedSwitchgear && (
          <SwitchgearForm
            switchgear={selectedSwitchgear}
            onRefresh={() => setRefresh(r => !r)}
            onBack={() => setSelectedSwitchgear(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
