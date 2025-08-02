import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

// Helper: flatten data for a single day; show just "HH:mm" on x-axis
function makeHourData(dayData) {
  if (!dayData) return [];
  // Collect sorted times strictly from this day's arrays
  const times = Array.from(
    new Set([
      ...(dayData.solarEnergy || []).map(d => d.time),
      ...(dayData.windEnergy || []).map(d => d.time),
      ...(dayData.totalEnergy || []).map(d => d.time),
      ...(dayData.demandEnergy || []).map(d => d.time)
    ])
  ).sort();

  const solar = Object.fromEntries((dayData.solarEnergy || []).map(d => [d.time, d.value]));
  const wind = Object.fromEntries((dayData.windEnergy || []).map(d => [d.time, d.value]));
  const total = Object.fromEntries((dayData.totalEnergy || []).map(d => [d.time, d.value]));
  const demand = Object.fromEntries((dayData.demandEnergy || []).map(d => [d.time, d.value]));

  return times.map(time => ({
    // Only show hours and minutes (works for both "T" and space separators)
    time: time.includes("T") ? time.split("T")[1].slice(0,5) :
          time.includes(" ") ? time.split(" ")[1].slice(0,5) :
          time.slice(-8, -3),
    solarEnergy: +solar[time] || 0,
    windEnergy: +wind[time] || 0,
    totalEnergy: +total[time] || 0,
    demandEnergy: +demand[time] || 0
  }));
}

function EnergyLineChart({ data, dataKey, color, title, unit }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      margin: "16px 0",
      padding: 20,
      boxShadow: "0 2px 8px rgba(50,50,50,0.06)"
    }}>
      <h4 style={{margin:0, marginBottom:8, color}}>{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{fontSize:10}} interval={2} />
          <YAxis unit={unit || ""} tick={{fontSize:12}} domain={['auto', 'auto']} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={v => `${v}${unit || ""}`} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
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
          const dates = Object.keys(response.data).sort();
          if (dates.length && !selectedDate) setSelectedDate(dates[dates.length - 1]);
        } else {
          setGraph(null);
        }
      })
      .catch(() => setGraph(null));
    // eslint-disable-next-line
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;

  const dateKeys = Object.keys(graph).sort();
  const data = makeHourData(graph[selectedDate]);

  return (
    <div>
      <h3>Energy Graphs for {selectedDate || "Selected Date"}</h3>
      <div style={{marginBottom:12}}>
        <label>
          Select date:&nbsp;
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{fontSize:"1em"}}
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
        <>
          <EnergyLineChart
            data={data}
            dataKey="solarEnergy"
            title="Solar Energy"
            color="#ff9800"
          />
          <EnergyLineChart
            data={data}
            dataKey="windEnergy"
            title="Wind Energy"
            color="#03a9f4"
            unit=" MW"
          />
          <EnergyLineChart
            data={data}
            dataKey="totalEnergy"
            title="Total Energy"
            color="#4caf50"
          />
          <EnergyLineChart
            data={data}
            dataKey="demandEnergy"
            title="Demand Energy"
            color="#e91e63"
          />
        </>
      )}
    </div>
  );
}

export default GraphSection;
