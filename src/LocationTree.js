import React, { useEffect, useState } from "react";

function LocationTree({ onSelectLocation, onSelectSwitchgear, refresh }) {
  const [locations, setLocations] = useState([]);
  const [expandedLocations, setExpandedLocations] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch(
      "https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/location/all"
    )
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

  // Elegant style tokens
  const locationStyle = isSelected => ({
    fontWeight: 400,
    color: "#f5f7fa",
    fontSize: 17,
    padding: "2px 8px",
    borderRadius: 5,
    background: isSelected ? "rgba(80,112,255,0.07)" : "none",
    cursor: "pointer",
    transition: "background 0.14s",
    outline: "none",
    border: "none",
    boxShadow: isSelected ? "0 1px 2px 0 rgba(80,112,255,.10)" : "none"
  });

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
      {locations.map(location => {
        const isExpanded = expandedLocations.has(location.id);
        const isSelected = selectedId === location.id;
        return (
          <li key={location.id} style={{ marginBottom: 5 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                onClick={() => toggleLocation(location.id)}
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  marginRight: 6,
                  fontWeight: 400,
                  fontSize: 14,
                  color: "#50aaff",
                  cursor: "pointer",
                  transition: "color 0.13s"
                }}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "▼" : "▶"}
              </span>
              <span
                tabIndex={0}
                style={locationStyle(isSelected)}
                onClick={() => {
                  setSelectedId(location.id);
                  onSelectLocation(location);
                }}
                onMouseOver={e => {
                  if (!isSelected) e.currentTarget.style.background = "rgba(55,114,214,0.13)";
                }}
                onMouseOut={e => {
                  if (!isSelected) e.currentTarget.style.background = "none";
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
    fetch(
      `https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/loc/${locationId}`
    )
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
            color: "#e9ecf3",
            fontSize: 15,
            fontWeight: 400,
            display: "flex",
            alignItems: "center"
          }}
        >
          <span style={{
            fontSize: 15,
            color: "#6eaef7",
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
