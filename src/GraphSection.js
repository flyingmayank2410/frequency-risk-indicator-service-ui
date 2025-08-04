import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import PredictionChart from "./PredictionChart";

function hourToLabel(time) {
  const d = new Date(time);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Prepare merged chart data per hour with per-series voltage/frequency
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
      solarFrequency: solarMap[t]?.frequency,
      windEnergy: windMap[t]?.value ?? 0,
      windVoltage: windMap[t]?.voltage,
      windFrequency: windMap[t]?.frequency,
      totalEnergy: totalMap[t]?.value ?? 0,
      totalVoltage: totalMap[t]?.voltage,
      totalFrequency: totalMap[t]?.frequency,
      demandEnergy: demandMap[t]?.value ?? 0,
      demandVoltage: demandMap[t]?.voltage,
      demandFrequency: demandMap[t]?.frequency
    };
  });
}

// One chart with toggles for voltage/frequency per panel
function EnergyChart({ data, dataKey, voltageKey, frequencyKey, stroke, name }) {
  const [showVoltage, setShowVoltage] = useState(true);
  const [showFrequency, setShowFrequency] = useState(true);

  return (
    <div style={{ background: '#111', borderRadius: 10, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.26)' }}>
      <h4 style={{ margin: 0, marginBottom: 8, color: '#fff' }}>{name}</h4>
      <div style={{ marginBottom: 10 }}>
        <label style={{ color: '#fff', marginRight: 12 }}>
          <input type="checkbox" checked={showVoltage} onChange={() => setShowVoltage(v => !v)} /> Voltage
        </label>
        <label style={{ color: '#fff' }}>
          <input type="checkbox" checked={showFrequency} onChange={() => setShowFrequency(f => !f)} /> Frequency
        </label>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{ fill: '#fff', fontSize: 10 }} />
          <YAxis tick={{ fill: '#fff' }} />
          <CartesianGrid stroke="#333" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={stroke} strokeWidth={2} dot={false} />
          {voltageKey && showVoltage && (
            <Line type="monotone" dataKey={voltageKey} name="Voltage" stroke="#fbc02d" strokeWidth={2} dot={false} />
          )}
          {frequencyKey && showFrequency && (
            <Line type="monotone" dataKey={frequencyKey} name="Frequency" stroke="#9c27b0" strokeWidth={2} dot={false} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (!locationId) return;

    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(response => {
        if (response && response.data && typeof response.data === 'object') {
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

  if (!graph) return <div style={{ color: '#fff' }}>Loading...</div>;

  const dayData = graph[selectedDate] || {};
  const chartData = makeChartData(dayData);

  return (
    <div>
      <h3 style={{ color: '#fff' }}>Energy Graphs for {selectedDate || 'Date'}</h3>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#fff', marginRight: 12 }}>
          Select Date:
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ fontSize: '1em', color: '#fff', background: '#333', border: '1px solid #555', borderRadius: 4, padding: '2px 4px', marginLeft: 8 }}
          >
            {Object.keys(graph).sort().map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
          <EnergyChart
            data={chartData}
            dataKey="solarEnergy"
            voltageKey="solarVoltage"
            frequencyKey="solarFrequency"
            stroke="#ff9800"
            name="Solar Energy"
          />
        </div>
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
          <EnergyChart
            data={chartData}
            dataKey="windEnergy"
            voltageKey="windVoltage"
            frequencyKey="windFrequency"
            stroke="#03a9f4"
            name="Wind Energy"
          />
        </div>
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
          <EnergyChart
            data={chartData}
            dataKey="totalEnergy"
            voltageKey="totalVoltage"
            frequencyKey="totalFrequency"
            stroke="#4caf50"
            name="Total Energy"
          />
        </div>
        <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
          <EnergyChart
            data={chartData}
            dataKey="demandEnergy"
            voltageKey="demandVoltage"
            frequencyKey="demandFrequency"
            stroke="#e91e63"
            name="Demand Energy"
          />
        </div>
      </div>
    </div>
  );
}

export default GraphSection;
