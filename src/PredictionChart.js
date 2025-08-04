import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateTime } from 'luxon';

// Convert UTC ISO timestamp to IST HH:mm
function formatTimeToIST(utcTime) {
  const dt = DateTime.fromISO(utcTime, { zone: 'utc' }).setZone('Asia/Kolkata');
  return dt.toFormat('HH:mm');
}

// Custom tooltip showing all required details
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

function PredictionChart({ totalEnergy }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!totalEnergy || totalEnergy.length === 0) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Call the correct prediction API for frequency data
    fetch('https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CurrentDay: { totalEnergy } })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData && resData.status === 200 && Array.isArray(resData.data)) {
          // Data matches required format
          const chartData = resData.data.map(item => ({
            ...item,
            istTime: formatTimeToIST(item.timestamp)  // to be used for Y-Axis
          }));
          setData(chartData);
        } else {
          setError('Invalid prediction data');
          setData(null);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError('Failed to fetch prediction data');
        setData(null);
        setLoading(false);
      });
  }, [totalEnergy]);

  if (loading) return <div style={{ color: '#fff' }}>Loading predictions...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return null;

  return (
    <div style={{ background: '#111', padding: 20, borderRadius: 14, marginTop: 30 }}>
      <h3 style={{ color: '#50aaff', marginBottom: 10 }}>Frequency Rate of Change over Time (IST)</h3>
      <ResponsiveContainer width='100%' height={400}>
        <ScatterChart margin={{ top: 20, right:20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke='#333' />
          <YAxis type='number' dataKey='rocOfFreq' name='Rate of Change of Frequency' unit='Hz/s' />
          <XAxis type='category' dataKey='istTime' name='Time (IST)' interval={0} tick={{ fill: '#fff' }} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name='Frequency Change' data={data} fill='#50aaff' />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionChart;
