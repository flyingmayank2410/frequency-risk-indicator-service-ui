import React, { useEffect, useState } from "react";
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from "recharts";

function PredictionChart({ totalEnergy }) {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!totalEnergy || totalEnergy.length === 0) {
      setPredictionData(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        CurrentDay: { totalEnergy }
      })
    })
      .then(res => res.json())
      .then(data => {
        // Adjust this if your API structure is different
        // Example assumes: { status: 200, data: [{ time, value }, ...] }
        if (data && data.status === 200 && data.data) {
          setPredictionData(data.data);
        } else {
          setError("Prediction data fetch failed");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Prediction data fetch failed");
        setLoading(false);
      });
  }, [totalEnergy]);

  if (loading) return <div style={{color: '#fff'}}>Loading prediction data...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!predictionData) return null;

  return (
    <div style={{marginTop: 30, background: '#111', padding: 20, borderRadius: 14}}>
      <h3 style={{color: '#50aaff', marginBottom: 10}}>Predicted Energy</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={predictionData}>
          <XAxis dataKey="time" tick={{fill: '#fff'}} />
          <YAxis tick={{fill: '#fff'}}/>
          <CartesianGrid stroke="#333" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#50aaff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionChart;
