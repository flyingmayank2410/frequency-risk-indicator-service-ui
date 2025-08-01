import React, { useEffect, useState } from "react";
import { getGraphData } from "../api";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface EnergyData {
  time: string;
  value: number;
}

interface GraphResponse {
  windEnergy: EnergyData[];
  solarEnergy: EnergyData[];
  totalEnergy: EnergyData[];
}

const GraphPanel: React.FC<{ locationId: number }> = ({ locationId }) => {
  const [data, setData] = useState<GraphResponse | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await getGraphData(locationId);
      setData(res);
    }
    fetchData();
  }, [locationId]);

  const combineData = () => {
    if (!data) return [];
    return data.totalEnergy.map((d, i) => ({
      time: d.time,
      total: d.value,
      wind: data.windEnergy[i]?.value || 0,
      solar: data.solarEnergy[i]?.value || 0,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">Energy Graph</h3>
      {data ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combineData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" interval={2} angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wind" stroke="#10b981" />
            <Line type="monotone" dataKey="solar" stroke="#f59e0b" />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">Loading graph data...</p>
      )}
    </div>
  );
};

export default GraphPanel;