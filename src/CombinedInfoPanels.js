import React, { useState, useEffect } from "react";

// Existing Switchgear Type Info Panel
function SwitchgearTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 10, width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.26)" }}>
      <h3 style={{ color: "#50aaff" }}>Switchgear Type Info</h3>
      <p>Type: {data.swgType}</p>
      <p>Name: {data.swgName}</p>
    </div>
  );
}

// Existing Feeder Type Info Panel
function FeederTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 10, width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.26)" }}>
      <h3 style={{ color: "#50aaff" }}>Feeder Type Info</h3>
      <p>Name: {data.feederName}</p>
      <p>Type: {data.feederType}</p>
      <p>Switchgear Type ID: {data.swgTypeId}</p>
    </div>
  );
}

// New Wind Mill Type Panel
function WindMillTypePanel({ data }) {
  if (!data) return null;
  const { rated, ratedPowerKW, cutOut, cutIn } = data;
  return (
    <div style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 10, width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.26)" }}>
      <h3 style={{ color: "#50aaff" }}>Wind Mill Type</h3>
      <p>Rated: {rated}</p>
      <p>Rated Power (KW): {ratedPowerKW}</p>
      <p>Cut Out: {cutOut}</p>
      <p>Cut In: {cutIn}</p>
    </div>
  );
}

// New Solar Panel Type Panel
function SolarPanelTypePanel({ data }) {
  if (!data) return null;
  const { RATED_POWER_PER_PANEL, TEMP_DERATE_PER_C, MAX_UV_INDEX } = data;
  return (
    <div style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 10, width: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.26)" }}>
      <h3 style={{ color: "#50aaff" }}>Solar Panel Type</h3>
      <p>Rated Power Per Panel: {RATED_POWER_PER_PANEL}</p>
      <p>Temperature Derate Per C: {TEMP_DERATE_PER_C}</p>
      <p>Max UV Index: {MAX_UV_INDEX}</p>
    </div>
  );
}

// Combined Panel Component to fetch all data and render all four panels side by side in two rows
function CombinedInfoPanels() {
  const [swgTypeData, setSwgTypeData] = useState(null);
  const [feederTypeData, setFeederTypeData] = useState(null);
  const [defaultValuesData, setDefaultValuesData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Switchgear Type info
  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/type")
      .then(res => res.json())
      .then(data => {
        if (data?.status === 200 && data.data) setSwgTypeData(data.data);
      })
      .catch(() => {});
  }, []);

  // Fetch Feeder Type info
  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/feeder/type")
      .then(res => res.json())
      .then(data => {
        if (data?.status === 200 && data.data) setFeederTypeData(data.data);
      })
      .catch(() => {});
  }, []);

  // Fetch Default values for Wind Mill and Solar Panel types
  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/default/value")
      .then(res => res.json())
      .then(data => {
        if (data?.status === 200 && data.data) setDefaultValuesData(data.data);
      })
      .catch(() => {});
  }, []);

  // Determine loading or error state
  useEffect(() => {
    if (swgTypeData && feederTypeData && defaultValuesData) setLoading(false);
  }, [swgTypeData, feederTypeData, defaultValuesData]);

  if (loading) return <div style={{ color: "#fff" }}>Loading info panels...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginTop: 20 }}>
      <div style={{ flex: "1 1 45%", minWidth: 300 }}>
        <SwitchgearTypePanel data={swgTypeData} />
      </div>
      <div style={{ flex: "1 1 45%", minWidth: 300 }}>
        <FeederTypePanel data={feederTypeData} />
      </div>
      <div style={{ flex: "1 1 45%", minWidth: 300 }}>
        <WindMillTypePanel data={defaultValuesData?.Wind_Mill_Type} />
      </div>
      <div style={{ flex: "1 1 45%", minWidth: 300 }}>
        <SolarPanelTypePanel data={defaultValuesData?.Solar_Panel_Type} />
      </div>
    </div>
  );
}

export default CombinedInfoPanels;
