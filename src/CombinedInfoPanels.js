import React, { useState, useEffect } from "react";

// Switchgear Type Info Panel
function SwitchgearTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Switchgear Type Info</h3>
      <p><b>Type:</b> {data.swgType}</p>
      <p><b>Name:</b> {data.swgName}</p>
    </div>
  );
}

// Feeder Type Info Panel
function FeederTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Feeder Type Info</h3>
      <p><b>Name:</b> {data.feederName}</p>
      <p><b>Type:</b> {data.feederType}</p>
      <p><b>Switchgear Type ID:</b> {data.swgTypeId}</p>
    </div>
  );
}

// Wind Mill Type Panel
function WindMillTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Wind Mill Type</h3>
      <p><b>Rated:</b> {data.rated}</p>
      <p><b>Rated Power (KW):</b> {data.ratedPowerKW}</p>
      <p><b>Cut Out:</b> {data.cutOut}</p>
      <p><b>Cut In:</b> {data.cutIn}</p>
    </div>
  );
}

// Solar Panel Type Panel
function SolarPanelTypePanel({ data }) {
  if (!data) return null;
  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>Solar Panel Type</h3>
      <p><b>Rated Power Per Panel:</b> {data.RATED_POWER_PER_PANEL}</p>
      <p><b>Temperature Derate Per C:</b> {data.TEMP_DERATE_PER_C}</p>
      <p><b>Max UV Index:</b> {data.MAX_UV_INDEX}</p>
    </div>
  );
}

const panelStyle = {
  background: "#111",
  color: "#fff",
  padding: 16,
  borderRadius: 10,
  width: "100%",
  minWidth: 280,
  boxShadow: "0 2px 8px rgba(0,0,0,0.26)",
};

const titleStyle = { color: "#50aaff", marginBottom: 10 };

// Combined panel fetches all API data and shows all four panels
function CombinedInfoPanels() {
  const [swgType, setSwgType] = useState(null);
  const [feederType, setFeederType] = useState(null);
  const [defaultVals, setDefaultVals] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all concurrently and only show loading if any are missing
  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/type")
      .then(r => r.json())
      .then(d => d.status === 200 ? setSwgType(d.data) : null)
      .catch(() => {});

    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/feeder/type")
      .then(r => r.json())
      .then(d => d.status === 200 ? setFeederType(d.data) : null)
      .catch(() => {});

    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/default/value")
      .then(r => r.json())
      .then(d => d.status === 200 ? setDefaultVals(d.data) : null)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (swgType && feederType && defaultVals) setLoading(false);
  }, [swgType, feederType, defaultVals]);

  if (loading) return <div style={{ color: "#fff" }}>Loading info panels...</div>;

  return (
    <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
      <SwitchgearTypePanel data={swgType} />
      <FeederTypePanel data={feederType} />
      <WindMillTypePanel data={defaultVals.Wind_Mill_Type} />
      <SolarPanelTypePanel data={defaultVals.Solar_Panel_Type} />
    </div>
  );
}

export default CombinedInfoPanels;
