// src/components/GraphPanel.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getGraphData } from "../api";

interface Props {
  locationId: number;
}

interface EnergyData {
  time: string;
  solar?: number;
  wind?: number;
  total?: number;
  demand?: number;
}

const GraphPanel: React.FC<Props> = ({ locationId }) => {
  const [graphData, setGraphData] = useState<EnergyData[]>([]);

  const fetchGraph = async () => {
    try {
      const res = await getGraphData(locationId);
      const raw = res?.data?.data || {};
      const merged: Record<string, EnergyData> = {};

      Object.values(raw).forEach((day: any) => {
        const categories = ["solarEnergy", "windEnergy", "totalEnergy", "demandEnergy"];

        categories.forEach((category) => {
          const entries = day[category] || [];
          entries.forEach((item: any) => {
            const key = item.time;
            if (!merged[key]) {
              merged[key] = { time: key };
            }
            if (category === "solarEnergy") merged[key].solar = item.value;
            if (category === "windEnergy") merged[key].wind = item.value;
            if (category === "totalEnergy") merged[key].total = item.value;
            if (category === "demandEnergy") merged[key].demand = item.value;
          });
        });
      });

      const sorted = Object.values(merged).sort((a, b) => a.time.localeCompare(b.time));
      setGraphData(sorted);
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
      setGraphData([]);
    }
  };

  useEffect(() => {
    if (locationId) fetchGraph();
  }, [locationId]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Energy Graph</h2>
      {graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={graphData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
              tickFormatter={(val) => (typeof val === 'string' ? val.slice(11, 16) : val)}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="solar" stroke="#f59e0b" name="Solar" dot={false} />
            <Line type="monotone" dataKey="wind" stroke="#10b981" name="Wind" dot={false} />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Total" dot={false} />
            <Line type="monotone" dataKey="demand" stroke="#ef4444" name="Demand" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No graph data available for this location.</p>
      )}
    </div>
  );
};

export default GraphPanel;
