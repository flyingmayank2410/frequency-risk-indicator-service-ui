import React, { useState, useRef, useEffect } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSwitchgear, setSelectedSwitchgear] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [panelWidth, setPanelWidth] = useState(320);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dragging = useRef(false);

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
    setSelectedSwitchgear({ locationId: selectedLocation?.id });
  }

  // Drag logic for resizing sidebar
  function startDrag(e) {
    if (sidebarCollapsed) return; // don't resize when collapsed
    dragging.current = true;
    document.body.style.cursor = "ew-resize";
    e.preventDefault();
  }
  function onDrag(e) {
    if (dragging.current) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const newWidth = Math.max(200, Math.min(x, 600));
      setPanelWidth(newWidth);
    }
  }
  function stopDrag() {
    dragging.current = false;
    document.body.style.cursor = "";
  }
  useEffect(() => {
    function handleDrag(e) { onDrag(e); }
    function handleUp() { stopDrag(); }
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleDrag);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleUp);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000" }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? 0 : panelWidth,
        minWidth: sidebarCollapsed ? 0 : 200,
        maxWidth: sidebarCollapsed ? 0 : 600,
        borderRight: sidebarCollapsed ? 'none' : "1px solid #222",
        padding: sidebarCollapsed ? 0 : 16,
        boxSizing: "border-box",
        background: "#1a1a1a",
        color: "#fff",
        transition: "width 0.2s, min-width 0.2s, max-width 0.2s",
        overflow: "hidden",
        display: sidebarCollapsed ? "none" : "flex",
        flexDirection: "column"
      }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <LocationTree
            onSelectLocation={loc => {
              setSelectedLocation(loc);
              setShowLocationForm(false);
              setSelectedSwitchgear(null);
            }}
            onSelectSwitchgear={swg => setSelectedSwitchgear(swg)}
            refresh={refresh}
          />
        </div>
        <button style={{
          marginTop: 10,
          background: "#50aaff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 18px"
        }} onClick={() => {
          setSelectedLocation({});
          setShowLocationForm(true);
          setSelectedSwitchgear(null);
        }}>
          + Add Location
        </button>
      </div>

      {/* Draggable Resizer with Collapse/Expand at the TOP */}
      <div
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        style={{
          width: 16,
          cursor: sidebarCollapsed ? "pointer" : "ew-resize",
          background: "#222",
          zIndex: 10,
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "1px solid #111",
          position: "relative"
        }}
      >
        <button
          aria-label={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          onClick={() => setSidebarCollapsed(c => !c)}
          style={{
            width: 14,
            height: 30,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 17,
            outline: "none",
            marginTop: 2,
            marginBottom: 4,
            color: "#fff",
            padding: 0,
            zIndex: 20
          }}
          tabIndex={0}
        >
          {sidebarCollapsed ? "»" : "«"}
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: 16,
        overflowY: "auto",
        background: "#000",
        color: "#fff",
        minWidth: 0
      }}>
        {selectedLocation && !showLocationForm && !selectedSwitchgear && (
          <>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: "8px"
            }}>
              <h3 style={{ margin:0, color:"#fff" }}>
                Energy Graphs for {selectedLocation.locationName || "Current Location"}
              </h3>
              <div>
                <button
                  onClick={handleEditLocation}
                  style={{
                    marginRight: 12,
                    padding: "8px 14px",
                    background: "#50aaff",
                    color: "#fff",
                    borderRadius: 6,
                    border: "none"
                  }}
                >
                  Edit Location
                </button>
                <button
                  onClick={handleAddSwitchgear}
                  style={{
                    padding: "8px 14px",
                    background: "#50aaff",
                    color: "#fff",
                    borderRadius: 6,
                    border: "none"
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
