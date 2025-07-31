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

const GraphPanel: React.FC<Props> = ({ locationId }) => {
  const [graphData, setGraphData] = useState<any[]>([]);

  const fetchGraph = async () => {
    try {
      const res = await getGraphData(locationId);
      const raw = res?.data?.data || {};
      const result: any[] = [];

      Object.values(raw).forEach((day: any) => {
        const times = day?.solarEnergy?.map((entry: any) => entry.time) || [];
        times.forEach((time: string, i: number) => {
          result.push({
            time,
            solar: day.solarEnergy?.[i]?.value ?? 0,
            wind: day.windEnergy?.[i]?.value ?? 0,
            total: day.totalEnergy?.[i]?.value ?? 0,
            demand: day.demandEnergy?.[i]?.value ?? 0,
          });
        });
      });

      setGraphData(result);
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
