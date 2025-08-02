import React, { useEffect, useState } from "react";

function LocationTree({ onSelectLocation, onSelectSwitchgear, refresh }) {
  const [locations, setLocations] = useState([]);
  const [expandedLocations, setExpandedLocations] = useState(new Set());

  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/all")
      .then(res => res.json())
      .then(response => {
        if (response && Array.isArray(response.data)) {
          setLocations(response.data);
        } else {
          setLocations([]);
        }
      })
      .catch(() => setLocations([]));
  }, [refresh]);

  function toggleLocation(id) {
    setExpandedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {locations.map(location => {
        const isExpanded = expandedLocations.has(location.id);
        return (
          <li key={location.id} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <span
                onClick={() => toggleLocation(location.id)}
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  marginRight: 8,
                  fontWeight: 400,    // regular, not bold
                  fontSize: 15,       // slightly smaller
                  color: "#ccc",      // lighter, subtle chevron
                  transition: "transform .15s"
                }}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "▼" : "▶"}
              </span>
              <span
                onClick={() => onSelectLocation(location)}
                style={{
                  fontWeight: isExpanded ? 600 : 400,
                  color: "#fff",
                  fontSize: 18
                }}
              >
                {location.locationName}
              </span>
            </div>
            {isExpanded && (
              <ul style={{ listStyle: "none", paddingLeft: 24, marginTop: 4 }}>
                <SwitchgearBranch
                  locationId={location.id}
                  onSelectSwitchgear={onSelectSwitchgear}
                />
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function SwitchgearBranch({ locationId, onSelectSwitchgear }) {
  const [swgs, setSwgs] = useState([]);

  useEffect(() => {
    if (!locationId) {
      setSwgs([]);
      return;
    }
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/loc/${locationId}`)
      .then(r => r.json())
      .then(response => {
        if (response && Array.isArray(response.data)) {
          setSwgs(response.data);
        } else {
          setSwgs([]);
        }
      })
      .catch(() => setSwgs([]));
  }, [locationId]);

  return (
    <>
      {swgs.map(swg => (
        <li
          key={swg.swgId}
          onClick={() => onSelectSwitchgear(swg)}
          style={{
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: 4,
            marginBottom: 2,
            color: "#fff",
            fontSize: 16,
            fontWeight: 400,
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{
            fontSize: 20,
            color: "#47a7ff",
            marginRight: 7,
            lineHeight: 1
          }}>•</span>
          <span>{swg.swgName}</span>
        </li>
      ))}
    </>
  );
}

export default LocationTree;
