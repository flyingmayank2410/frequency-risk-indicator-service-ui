import React, { useState, useEffect } from "react";

function SwgTypeInfo() {
  const [swgTypeData, setSwgTypeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/swg/type")
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          setSwgTypeData(response.data);
        } else {
          setError("Failed to load switchgear type");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching switchgear type");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#fff" }}>Loading Switchgear Type...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{
      background: "#111",
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
      color: "#fff",
      maxWidth: 400,
      lineHeight: 1.5,
      boxShadow: "0 2px 8px rgba(0,0,0,0.26)"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 8, color: "#50aaff" }}>Switchgear Type Info</h3>
      <p><strong>Type:</strong> {swgTypeData.swgType}</p>
      <p><strong>Name:</strong> {swgTypeData.swgName}</p>
    </div>
  );
}

export default SwgTypeInfo;
