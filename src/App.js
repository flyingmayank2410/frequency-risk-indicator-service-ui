import React, { useState, useRef } from "react";
import LocationTree from "./LocationTree";
import LocationForm from "./LocationForm";
import SwitchgearForm from "./SwitchgearForm";
import GraphSection from "./GraphSection";

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSwitchgear, setSelectedSwitchgear] = useState(null);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [panelWidth, setPanelWidth] = useState(320); // initial width in px
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
    setSelectedSwitchgear({ locationId: selectedLocation.id });
  }

  // Drag logic for resizing sidebar
  function startDrag(e) {
    dragging.current = true;
    document.body.style.cursor = "ew-resize";
  }
  function onDrag(e) {
    if (dragging.current) {
      // Support both mouse and touch events
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const newWidth = Math.max(200, Math.min(x, 600));
      setPanelWidth(newWidth);
    }
  }
  function stopDrag() {
    dragging.current = false;
    document.body.style.cursor = "";
  }
  React.useEffect(() => {
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
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{
        width: panelWidth,
        minWidth: 200,
        maxWidth: 600,
        borderRight: "1px solid #ddd",
        padding: 16,
        boxSizing: "border-box",
        background: "#fafbfc"
      }}>
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
      {/* Draggable Resizer */}
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
