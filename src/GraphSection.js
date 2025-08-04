import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import PredictionChart from "./PredictionChart";

function hourToLabel(time) {
  const d = new Date(time);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function makeChartData(dayData) {
  if (!dayData) return [];
  const times = Array.from(new Set([
    ...(dayData.solarEnergy || []).map(d => d.time),
    ...(dayData.windEnergy || []).map(d => d.time),
    ...(dayData.totalEnergy || []).map(d => d.time),
    ...(dayData.demandEnergy || []).map(d => d.time)
  ])).sort();

  const solarMap = new Map((dayData.solarEnergy || []).map(({ time, value }) => [time, value]));
  const windMap = new Map((dayData.windEnergy || []).map(({ time, value }) => [time, value]));
  const totalMap = new Map((dayData.totalEnergy || []).map(({ time, value }) => [time, value]));
  const demandMap = new Map((dayData.demandEnergy || []).map(({ time, value }) => [time, value]));

  return times.map(time => ({
    time: hourToLabel(time),
    solarEnergy: solarMap.get(time) || 0,
    windEnergy: windMap.get(time) || 0,
    totalEnergy: totalMap.get(time) || 0,
    demandEnergy: demandMap.get(time) || 0,
  }));
}

function EnergyChart({ data, dataKey, stroke, name }) {
  return (
    <div style={{ background: '#111', borderRadius: 10, padding: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.26)' }}>
      <h4 style={{ margin: 0, marginBottom: 8, color: '#fff' }}>{name}</h4>
      <ResponsiveContainer width='100%' height={200}>
        <LineChart data={data}>
          <XAxis dataKey='time' tick={{ fill: '#fff' }} />
          <YAxis tick={{ fill: '#fff' }} />
          <CartesianGrid stroke='#333' />
          <Tooltip />
          <Line type='monotone' dataKey={dataKey} stroke={stroke} strokeWidth={2} />
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
  const predictionInput = dayData.totalEnergy || [];

  return (
    <>
      <div>
        <h3 style={{ color: '#fff' }}>Energy Graphs for {selectedDate || 'Date'}</h3>
        <div style={{ marginBottom: 12 }}>
          <label style={{ color: '#fff' }}>
            Select Date:
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ fontSize: '1em', color: '#fff', background: '#333', border: '1px solid #555', borderRadius: 4, padding: '2px 4px' }}
            >
              {Object.keys(graph).sort().map(date => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
            <EnergyChart data={chartData} dataKey='solarEnergy' stroke='#ff9800' name='Solar Energy' />
          </div>
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
            <EnergyChart data={chartData} dataKey='windEnergy' stroke='#03a4f8' name='Wind Energy' />
          </div>
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
            <EnergyChart data={chartData} dataKey='totalEnergy' stroke='#4caf50' name='Total Energy' />
          </div>
          <div style={{ flex: '1 1 calc(50% - 16px)', minWidth: 0 }}>
            <EnergyChart data={chartData} dataKey='demandEnergy' stroke='#e91e63' name='Demand Energy' />
          </div>
        </div>
      </div>

      {/* Render the prediction chart for frequency */}
      <PredictionChart totalEnergy={predictionInput} />
    </>
  );
}

export default GraphSection;
