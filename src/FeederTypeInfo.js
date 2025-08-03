import React, { useState, useEffect } from "react";

function FeederTypeInfo() {
  const [feederTypeData, setFeederTypeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/feeder/type")
      .then(res => res.json())
      .then(response => {
        if (response.status === 200) {
          setFeederTypeData(response.data);
        } else {
          setError("Failed to load feeder type");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching feeder type");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: "#fff" }}>Loading Feeder Type...</div>;
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
      <h3 style={{ marginTop: 0, marginBottom: 8, color: "#50aaff" }}>Feeder Type Info</h3>
      <p><strong>Name:</strong> {feederTypeData.feederName}</p>
      <p><strong>Type:</strong> {feederTypeData.feederType}</p>
    </div>
  );
}

export default FeederTypeInfo;
