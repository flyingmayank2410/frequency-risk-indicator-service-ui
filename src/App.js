import React, { useState, useRef } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";

function App() {
  // ...previous state...
  const [panelWidth, setPanelWidth] = useState(320);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dragging = useRef(false);

  // ...previous logic (including drag/resize)...

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Collapsible Sidebar Panel */}
      <div style={{
        width: sidebarCollapsed ? 28 : panelWidth,
        minWidth: sidebarCollapsed ? 28 : 200,
        maxWidth: sidebarCollapsed ? 28 : 600,
        borderRight: "1px solid #ddd",
        padding: sidebarCollapsed ? 0 : 16,
        boxSizing: "border-box",
        background: "#fafbfc",
        transition: "width 0.2s"
      }}>
        {/* Collapse/Expand Button */}
        <div style={{ height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: sidebarCollapsed ? "none" : "1px solid #eee" }}>
          <button
            aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            onClick={() => setSidebarCollapsed(c => !c)}
            style={{
              width: 24, height: 24,
              border: "none", background: "transparent", cursor: "pointer",
              fontWeight: 700, fontSize: 16,
              outline: "none"
            }}
            tabIndex={0}
          >
            {sidebarCollapsed ? "»" : "«"}
          </button>
        </div>
        {!sidebarCollapsed && (
          <>
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
          </>
        )}
      </div>
      {/* ...resizer & main content as before... */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          width: 6,
          cursor: "ew-resize",
          background: "#e1e5ea",
          zIndex: 10,
          userSelect: "none"
        }}
      />
      <div style={{
        flex: 1,
        padding: 16,
        overflowY: "auto",
        background: "#f5f6f8"
      }}>
        {/* ...main content as before... */}
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
