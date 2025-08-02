import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

// Turn the per-type arrays for a given day into a single row per hour.
function makePerHourEnergyData(dayData) {
  if (!dayData) return [];
  // Collect all unique times (should be the same for all types, but merge just in case)
  const times = Array.from(
    new Set([
      ...(dayData.solarEnergy || []).map(d => d.time),
      ...(dayData.windEnergy || []).map(d => d.time),
      ...(dayData.totalEnergy || []).map(d => d.time),
      ...(dayData.demandEnergy || []).map(d => d.time)
    ])
  ).sort();

  // Create a map by time for each energy array
  const solarMap = Object.fromEntries((dayData.solarEnergy || []).map(d => [d.time, d.value]));
  const windMap = Object.fromEntries((dayData.windEnergy || []).map(d => [d.time, d.value]));
  const totalMap = Object.fromEntries((dayData.totalEnergy || []).map(d => [d.time, d.value]));
  const demandMap = Object.fromEntries((dayData.demandEnergy || []).map(d => [d.time, d.value]));

  // Merge all values into one object per time
  return times.map(time => ({
    time,
    solarEnergy: +solarMap[time] || 0,
    windEnergy: +windMap[time] || 0,
    totalEnergy: +totalMap[time] || 0,
    demandEnergy: +demandMap[time] || 0
  }));
}

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(response => {
        if (response && response.data && typeof response.data === "object") {
          setGraph(response.data);
          // Determine initial selected date (latest key)
          const dates = Object.keys(response.data).sort();
          if (dates.length && !selectedDate) setSelectedDate(dates[dates.length - 1]);
        } else {
          setGraph(null);
        }
      })
      .catch(() => setGraph(null));
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;

  const dateKeys = Object.keys(graph).sort();
  const data = makePerHourEnergyData(graph[selectedDate]);

  return (
    <div>
      <h3>Energy Graphs for {selectedDate || "Selected Date"}</h3>
      <div style={{ marginBottom: 12 }}>
        <label>
          Select date:&nbsp;
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ fontSize: "1em" }}
          >
            {dateKeys.map(date =>
              <option key={date} value={date}>{date}</option>
            )}
          </select>
        </label>
      </div>
      {data.length === 0 ? (
        <div>No data for this date.</div>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="solarEnergy" stroke="#ff9800" name="Solar Energy" dot={false} />
            <Line type="monotone" dataKey="windEnergy" stroke="#03a9f4" name="Wind Energy" dot={false} />
            <Line type="monotone" dataKey="totalEnergy" stroke="#4caf50" name="Total Energy" dot={false} />
            <Line type="monotone" dataKey="demandEnergy" stroke="#e91e63" name="Demand Energy" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default GraphSection;
