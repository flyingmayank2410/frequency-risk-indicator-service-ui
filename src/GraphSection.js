import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import PredictionChart from "./PredictionChart";

function hourToLabel(time) {
  const d = new Date(time);
  return d.toLocaleTimeString('en-IN', { hour: "2-digit", minute: "2-digit" });
}

function makeChartData(dayData) {
  if (!dayData) return [];
  const allTimes = [
    ...(dayData.solarEnergy || []).map((d) => d.time),
    ...(dayData.windEnergy || []).map((d) => d.time),
    ...(dayData.totalEnergy || []).map((d) => d.time),
    ...(dayData.demandEnergy || []).map((d) => d.time),
  ];
  const times = Array.from(new Set(allTimes)).sort();

  const solarMap = Object.fromEntries((dayData.solarEnergy || []).map((d) => [hourToLabel(d.time), d]));
  const windMap = Object.fromEntries((dayData.windEnergy || []).map((d) => [hourToLabel(d.time), d]));
  const totalMap = Object.fromEntries((dayData.totalEnergy || []).map((d) => [hourToLabel(d.time), d]));
  const demandMap = Object.fromEntries((dayData.demandEnergy || []).map((d) => [hourToLabel(d.time), d]));

  return times.map((time) => {
    const t = hourToLabel(time);
    return {
      time: t,
      solarEnergy: solarMap[t]?.value ?? 0,
      solarVoltage: solarMap[t]?.voltage ?? 0,
      windEnergy: windMap[t]?.value ?? 0,
      windVoltage: windMap[t]?.voltage ?? 0,
      totalEnergy: totalMap[t]?.value ?? 0,
      totalVoltage: totalMap[t]?.voltage ?? 0,
      demandEnergy: demandMap[t]?.value ?? 0,
      demandVoltage: demandMap[t]?.voltage ?? 0,
    };
  });
}

// Panel with clickable legend: isolates line on click, restores both on outside click
function EnergyChart({ data, lines }) {
  const [activeLine, setActiveLine] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveLine(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLegendClick(lineKey) {
    setActiveLine((current) => (current === lineKey ? null : lineKey));
  }

  const visibleLines = activeLine ? lines.filter((l) => l.dataKey === activeLine) : lines;

  return (
    <div
      ref={containerRef}
      style={{
        background: "#111",
        borderRadius: 10,
        padding: 20,
        marginBottom: 14,
        boxShadow: "0 2px 8px rgba(0,0,0,0.26)",
      }}
    >
      <h4 style={{ color: "#fff", marginBottom: 8 }}>{lines[0]?.name.split(" ")[0]} Energy Panel</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "#fff", fontSize: 10 }} />
          <YAxis tick={{ fill: "#fff" }} />
          <CartesianGrid stroke="#333" />
          <Tooltip />
          <Legend
            payload={lines.map((l) => ({
              id: l.dataKey,
              dataKey: l.dataKey,
              value: l.name,
              type: "line",
              color: l.stroke,
            }))}
            onClick={(e) => handleLegendClick(e.dataKey)}
            wrapperStyle={{ color: "#fff", cursor: "pointer" }}
          />
          {visibleLines.map((l) => (
            <Line
              key={l.dataKey}
              type="monotone"
              dataKey={l.dataKey}
              stroke={l.stroke}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (!locationId) return;
    fetch(
      `https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`
    )
      .then((r) => r.json())
      .then((response) => {
        if (response && response.data && typeof response.data === "object") {
          setGraph(response.data);
          const dates = Object.keys(response.data).sort();
          if (dates.length > 0 && !selectedDate) {
            setSelectedDate(dates[dates.length - 1]);
          }
        } else {
          setGraph(null);
        }
      })
      .catch(() => setGraph(null));
  }, [locationId]);

  if (!graph) return <div style={{ color: "#fff" }}>Loading...</div>;

  const dayData = graph[selectedDate] || {};
  const chartData = makeChartData(dayData);

  const solarLines = [
    { dataKey: "solarEnergy", name: "Solar Energy", stroke: "#ff9800" },
    { dataKey: "solarVoltage", name: "Voltage", stroke: "#fbc02d" },
  ];
  const windLines = [
    { dataKey: "windEnergy", name: "Wind Energy", stroke: "#03a9f4" },
    { dataKey: "windVoltage", name: "Voltage", stroke: "#fbc02d" },
  ];
  const totalLines = [
    { dataKey: "totalEnergy", name: "Total Energy", stroke: "#4caf50" },
    { dataKey: "totalVoltage", name: "Voltage", stroke: "#fbc02d" },
  ];
  const demandLines = [
    { dataKey: "demandEnergy", name: "Demand Energy", stroke: "#e91e63" },
    { dataKey: "demandVoltage", name: "Voltage", stroke: "#fbc02d" },
  ];

  return (
    <div>
      <h3 style={{ color: "#fff" }}>Energy Graphs for {selectedDate || "Date"}</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: "#fff", marginRight: 12 }}>
          Select Date:
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              fontSize: "1em",
              color: "#fff",
              background: "#333",
              border: "1px solid #555",
              borderRadius: 4,
              padding: "2px 4px",
              marginLeft: 8,
            }}
          >
            {Object.keys(graph)
              .sort()
              .map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: 0 }}>
          <EnergyChart data={chartData} lines={solarLines} />
        </div>
        <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: 0 }}>
          <EnergyChart data={chartData} lines={windLines} />
        </div>
        <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: 0 }}>
          <EnergyChart data={chartData} lines={totalLines} />
        </div>
        <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: 0 }}>
          <EnergyChart data={chartData} lines={demandLines} />
        </div>
      </div>
      <PredictionChart totalEnergy={dayData.totalEnergy || []} />
    </div>
  );
}

export default GraphSection;
