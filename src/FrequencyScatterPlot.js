import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateTime } from 'luxon';

// Convert UTC timestamp to IST
function formatTimeToIST(utcTime) {
  const dt = DateTime.fromISO(utcTime, { zone: 'utc' }).setZone('Asia/Kolkata');
  return dt.toFormat('HH:mm');
}

// Custom Tooltip
function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: '#222', color: '#fff', padding: 10, borderRadius: 6 }}>
        <p><strong>Timestamp:</strong> {formatTimeToIST(data.timestamp)}</p>
        <p><strong>Predicted Frequency:</strong> {data.predictedFreq}</p>
        <p><strong>Rate of Change of Frequency:</strong> {data.rocOfFreq}</p>
        <p><strong>Grid Health:</strong> {data.gridHealth}</p>
        <p><strong>Synthetic Inertia Required:</strong> {data.syntheticInertiaRequired ? 'Yes' : 'No'}</p>
        <p><strong>Trigger Control Command:</strong> {data.triggerControlCommand ? 'Yes' : 'No'}</p>
      </div>
    );
  }
  return null;
}

function FrequencyScatterPlot({ data }) {
  const chartData = data.map(item => ({
    ...item,
    istTime: formatTimeToIST(item.timestamp),
  }));

  return (
    <div style={{ backgroundColor: '#111', borderRadius: 10, padding: 20, marginTop: 20 }}>
      <h3 style={{ color: '#50aaff', marginBottom: 10 }}>Frequency Rate of Change over Time (IST)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#333" />
          <XAxis type="number" dataKey="rocOfFreq" name="Rate of Change" unit="Hz/s" />
          <YAxis
            type="category"
            dataKey="istTime"
            name="Time (IST)"
            interval={0}
            tick={{ fill: '#fff' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Frequency Change" data={chartData} fill="#50aaff" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FrequencyScatterPlot;
