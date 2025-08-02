import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

// Utility: convert the API data shape to an array for Recharts
function transformGraphData(apiData) {
  if (!apiData || typeof apiData !== "object") return [];
  return Object.entries(apiData).map(([date, dayData]) => ({
    date,
    solarEnergy: Array.isArray(dayData.solarEnergy) ? dayData.solarEnergy.reduce((a, b) => a + b, 0) : dayData.solarEnergy ?? 0,
    windEnergy: Array.isArray(dayData.windEnergy) ? dayData.windEnergy.reduce((a, b) => a + b, 0) : dayData.windEnergy ?? 0,
    totalEnergy: Array.isArray(dayData.totalEnergy) ? dayData.totalEnergy.reduce((a, b) => a + b, 0) : dayData.totalEnergy ?? 0,
    demandEnergy: Array.isArray(dayData.demandEnergy) ? dayData.demandEnergy.reduce((a, b) => a + b, 0) : dayData.demandEnergy ?? 0
  }));
}

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(response => {
        if (response && response.data && typeof response.data === "object") {
          setGraph(response.data);
        } else {
          setGraph(null);
        }
      })
      .catch(() => setGraph(null));
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;

  const data = transformGraphData(graph);

  return (
    <div>
      <h3>Energy Graphs (Last 3 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 10, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="solarEnergy" stroke="#ff9800" name="Solar Energy" />
          <Line type="monotone" dataKey="windEnergy" stroke="#03a9f4" name="Wind Energy" />
          <Line type="monotone" dataKey="totalEnergy" stroke="#4caf50" name="Total Energy" />
          <Line type="monotone" dataKey="demandEnergy" stroke="#e91e63" name="Demand Energy" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraphSection;
