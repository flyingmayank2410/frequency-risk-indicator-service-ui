import React, { useState, useEffect } from "react";

// Individual panels with style prop for flexible width
function SwitchgearTypePanel({ data, style }) {
  if (!data) return null;
  return (
    <div style={{ ...panelStyle, ...style }}>
      <h3 style={titleStyle}>Switchgear Type Info</h3>
      <p><b>Type:</b> {data.swgType}</p>
      <p><b>Name:</b> {data.swgName}</p>
    </div>
  );
}
function FeederTypePanel({ data, style }) {
  if (!data) return null;
  return (
    <div style={{ ...panelStyle, ...style }}>
      <h3 style={titleStyle}>Feeder Type Info</h3>
      <p><b>Name:</b> {data.feederName}</p>
      <p><b>Type:</b> {data.feederType}</p>
      <p><b>Switchgear Type ID:</b> {data.swgTypeId}</p>
    </div>
  );
}
function WindMillTypePanel({ data, style }) {
  if (!data) return null;
  const { rated, ratedPowerKW, cutOut, cutIn } = data;
  return (
    <div style={{ ...panelStyle, ...style }}>
      <h3 style={titleStyle}>Wind Mill Type</h3>
      <p><b>Rated:</b> {rated}</p>
      <p><b>Rated Power (KW):</b> {ratedPowerKW}</p>
      <p><b>Cut Out:</b> {cutOut}</p>
      <p><b>Cut In:</b> {cutIn}</p>
    </div>
  );
}
function SolarPanelTypePanel({ data, style }) {
  if (!data) return null;
  const { RATED_POWER_PER_PANEL, TEMP_DERATE_PER_C, MAX_UV_INDEX } = data;
  return (
    <div style={{ ...panelStyle, ...style }}>
      <h3 style={titleStyle}>Solar Panel Type</h3>
      <p><b>Rated Power Per Panel:</b> {RATED_POWER_PER_PANEL}</p>
      <p><b>Temperature Derate Per C:</b> {TEMP_DERATE_PER_C}</p>
      <p><b>Max UV Index:</b> {MAX_UV_INDEX}</p>
    </div>
  );
}

const panelStyle = {
  background: "#111",
  color: "#fff",
  padding: 16,
  borderRadius: 10,
  minWidth: 0,
  boxShadow: "0 2px 8px rgba(0,0,0,0.26)"
};
const titleStyle = { color: "#50aaff", marginBottom: 10 };

function CombinedInfoPanels() {
  const [swgType, setSwgType] = useState(null);
  const [feederType, setFeederType] = useState(null);
  const [defaultVals, setDefaultVals] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div style={{ display: "flex", flexWrap: "nowrap", gap: 20, marginBottom: 20, width: "100%" }}>
      <SwitchgearTypePanel data={swgType} style={{ width: "23%" }} />
      <FeederTypePanel data={feederType} style={{ width: "23%" }} />
      <WindMillTypePanel data={defaultVals.Wind_Mill_Type} style={{ width: "23%" }} />
      <SolarPanelTypePanel data={defaultVals.Solar_Panel_Type} style={{ width: "23%" }} />
    </div>
  );
}

export default CombinedInfoPanels;
