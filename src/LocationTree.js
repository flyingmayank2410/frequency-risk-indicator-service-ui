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
              <div
                onClick={() => toggleLocation(location.id)}
                style={{
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  marginRight: 8,
                  border: "1px solid #fff",
                  borderRadius: 2,
                  fontWeight: "bold",
                  fontSize: 12,
                  color: "#fff",
                }}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "−" : "+"}
              </div>
              <span
                onClick={() => onSelectLocation(location)}
                style={{
                  fontWeight: isExpanded ? "bold" : "normal",
                  color: "#fff",
                  fontSize: 18 // Font bigger for location name
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
            color: "#fff", // now solid white for child, too
            fontSize: 16, // slightly smaller than parent
            fontWeight: 500
          }}
        >
          {swg.swgName}
        </li>
      ))}
    </>
  );
}

export default LocationTree;
