import React, { useEffect, useState } from "react";

function LocationTree({ onSelectLocation, onSelectSwitchgear, refresh }) {
  const [locations, setLocations] = useState([]);

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

  return (
    <ul>
      {locations.map(location => (
        <li key={location.id}>
          <span
            onClick={() => onSelectLocation(location)}
            style={{ fontWeight: "bold", cursor: "pointer" }}>
            {location.locationName}
          </span>
          <SwitchgearBranch locationId={location.id} onSelectSwitchgear={onSelectSwitchgear} />
        </li>
      ))}
    </ul>
  );
}

function SwitchgearBranch({ locationId, onSelectSwitchgear }) {
  const [swgs, setSwgs] = useState([]);
  useEffect(() => {
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
    <ul>
      {swgs.map(swg => (
        <li
          key={swg.swgId}
          style={{ cursor: "pointer" }}
          onClick={() => onSelectSwitchgear(swg)}>
          {swg.swgName}
        </li>
      ))}
    </ul>
  );
}

export default LocationTree;
