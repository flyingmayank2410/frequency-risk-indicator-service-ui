// src/components/GraphPanel.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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

interface Props {
  locationId: number;
}

interface ChartPoint {
  time: string;
  solarEnergy: number;
  windEnergy: number;
  totalEnergy: number;
  demandEnergy: number;
}

const GraphPanel: React.FC<Props> = ({ locationId }) => {
  const [graphData, setGraphData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await axios.get(
          `https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`
        );

        const raw = res.data?.data || {};
        const mergedData: Record<string, ChartPoint> = {};

        Object.values(raw).forEach((dateData: any) => {
          dateData.solarEnergy?.forEach((item: any) => {
            const key = item.time;
            if (!mergedData[key]) {
              mergedData[key] = {
                time: key,
                solarEnergy: 0,
                windEnergy: 0,
                totalEnergy: 0,
                demandEnergy: 0,
              };
            }
            mergedData[key].solarEnergy = item.value;
          });

          dateData.windEnergy?.forEach((item: any) => {
            const key = item.time;
            if (!mergedData[key]) mergedData[key] = { time: key, solarEnergy: 0, windEnergy: 0, totalEnergy: 0, demandEnergy: 0 };
            mergedData[key].windEnergy = item.value;
          });

          dateData.totalEnergy?.forEach((item: any) => {
            const key = item.time;
            if (!mergedData[key]) mergedData[key] = { time: key, solarEnergy: 0, windEnergy: 0, totalEnergy: 0, demandEnergy: 0 };
            mergedData[key].totalEnergy = item.value;
          });

          dateData.demandEnergy?.forEach((item: any) => {
            const key = item.time;
            if (!mergedData[key]) mergedData[key] = { time: key, solarEnergy: 0, windEnergy: 0, totalEnergy: 0, demandEnergy: 0 };
            mergedData[key].demandEnergy = item.value;
          });
        });

        const sorted = Object.values(mergedData).sort((a, b) => a.time.localeCompare(b.time));
        setGraphData(sorted);
      } catch (err) {
        console.error("Failed to fetch graph data", err);
      }
    };

    fetchGraphData();
  }, [locationId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Energy Graphs</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="solarEnergy" stroke="#facc15" name="Solar" />
          <Line type="monotone" dataKey="windEnergy" stroke="#60a5fa" name="Wind" />
          <Line type="monotone" dataKey="totalEnergy" stroke="#34d399" name="Total" />
          <Line type="monotone" dataKey="demandEnergy" stroke="#f87171" name="Demand" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphPanel;
