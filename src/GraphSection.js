import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import PredictionChart from "./PredictionChart";
import styles from "./styles";

function hourToLabel(time) {
  const d = new Date(time);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function makeChartData(dayData) {
  if (!dayData) return [];
  const allTimes = [
    ...(dayData.solarEnergy || []).map(d => d.time),
    ...(dayData.windEnergy || []).map(d => d.time),
    ...(dayData.totalEnergy || []).map(d => d.time),
    ...(dayData.demandEnergy || []).map(d => d.time)
  ];
  const times = Array.from(new Set(allTimes)).sort();

  const solarMap = Object.fromEntries((dayData.solarEnergy || []).map(d => [hourToLabel(d.time), d]));
  const windMap = Object.fromEntries((dayData.windEnergy || []).map(d => [hourToLabel(d.time), d]));
  const totalMap = Object.fromEntries((dayData.totalEnergy || []).map(d => [hourToLabel(d.time), d]));
  const demandMap = Object.fromEntries((dayData.demandEnergy || []).map(d => [hourToLabel(d.time), d]));

  return times.map(time => {
    const t = hourToLabel(time);
    return {
      time: t,
      solarEnergy: solarMap[t]?.value ?? 0,
      solarVoltage: solarMap[t]?.voltage,
      solarPower: solarMap[t]?.power,
      windEnergy: windMap[t]?.value ?? 0,
      windVoltage: windMap[t]?.voltage,
      windPower: windMap[t]?.power,
      totalEnergy: totalMap[t]?.value ?? 0,
      totalVoltage: totalMap[t]?.voltage,
      totalPower: totalMap[t]?.power,
      demandEnergy: demandMap[t]?.value ?? 0,
      demandVoltage: demandMap[t]?.voltage,
      demandPower: demandMap[t]?.power
    };
  });
}

function EnergyChart({ data, dataKey, voltageKey, powerKey, stroke, name }) {
  const [showVoltage, setShowVoltage] = useState(true);
  const [showPower, setShowPower] = useState(false);

  return (
    <div style={styles.chartPanel}>
      <h4 style={styles.chartTitle}>{name}</h4>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: "#eee", marginRight: 12 }}>
          <input type="checkbox" checked={showVoltage} onChange={() => setShowVoltage(v => !v)} /> Voltage
        </label>
        <label style={{ color: "#eee" }}>
          <input type="checkbox" checked={showPower} onChange={() => setShowPower(p => !p)} /> Power
        </label>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: "#eee", fontSize: 12 }} />
          <YAxis tick={{ fill: "#eee" }} />
          <CartesianGrid stroke="#444" />
          <Tooltip />
          <Legend wrapperStyle={styles.legend} />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={stroke} strokeWidth={3} dot={false} />
          {voltageKey && showVoltage &&
            <Line type="monotone" dataKey={voltageKey} name="Voltage" stroke="#fbc02d" strokeWidth={2} dot={false} />
          }
          {powerKey && showPower &&
            <Line type="monotone" dataKey={powerKey} name="Power" stroke="#ff5722" strokeWidth={2} dot={false} />
          }
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

    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(response => {
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

  if (!graph) return <div style={{ color: "#eee" }}>Loading...</div>;

  const dayData = graph[selectedDate] || {};
  const chartData = makeChartData(dayData);

  return (
    <>
      <h3 style={{ color: "#eee" }}>Energy Graphs for {selectedDate || "Date"}</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#eee", marginRight: 12 }}>
          Select Date:
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              fontSize: "1em",
              color: "#eee",
              background: "#222",
              border: "1px solid #444",
              borderRadius: 4,
              padding: "3px 8px",
              marginLeft: 8
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
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <EnergyChart
          data={chartData}
          dataKey="solarEnergy"
          voltageKey="solarVoltage"
          powerKey="solarPower"
          stroke="#ff9800"
          name="Solar Energy"
        />
        <EnergyChart
          data={chartData}
          dataKey="windEnergy"
          voltageKey="windVoltage"
          powerKey="windPower"
          stroke="#03a9f4"
          name="Wind Energy"
        />
        <EnergyChart
          data={chartData}
          dataKey="totalEnergy"
          voltageKey="totalVoltage"
          powerKey="totalPower"
          stroke="#4caf50"
          name="Total Energy"
        />
        <EnergyChart
          data={chartData}
          dataKey="demandEnergy"
          voltageKey="demandVoltage"
          powerKey="demandPower"
          stroke="#e91e63"
          name="Demand Energy"
        />
      </div>
      <PredictionChart totalEnergy={dayData.totalEnergy || []} />
    </>
  );
}

export default GraphSection;
