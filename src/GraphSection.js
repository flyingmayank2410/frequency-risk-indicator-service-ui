import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { DateTime } from "luxon"; // <--- NEW import

// Converts UTC times to IST and outputs "HH:mm"
function hourMinuteISTfromUTC(raw) {
  if (!raw) return "";
  let iso = raw.replace(" ", "T");
  // Parse as UTC and convert to IST (Asia/Kolkata = UTC+5:30)
  const dt = DateTime.fromISO(iso, { zone: "utc" }).setZone("Asia/Kolkata");
  return dt.toFormat("HH:mm");
}

function makeHourData(dayData) {
  if (!dayData) return [];
  const allTimes = [
    ...(dayData.solarEnergy || []).map(d => d.time),
    ...(dayData.windEnergy || []).map(d => d.time),
    ...(dayData.totalEnergy || []).map(d => d.time),
    ...(dayData.demandEnergy || []).map(d => d.time),
  ];
  const times = Array.from(new Set(allTimes.map(hourMinuteISTfromUTC))).sort();

  const makeMap = arr => Object.fromEntries((arr || []).map(d => [hourMinuteISTfromUTC(d.time), d.value]));
  const solar = makeMap(dayData.solarEnergy);
  const wind = makeMap(dayData.windEnergy);
  const total = makeMap(dayData.totalEnergy);
  const demand = makeMap(dayData.demandEnergy);

  return times.map(time => ({
    time,
    solarEnergy: +solar[time] || 0,
    windEnergy: +wind[time] || 0,
    totalEnergy: +total[time] || 0,
    demandEnergy: +demand[time] || 0,
  }));
}

function EnergyLineChart({ data, dataKey, color, title }) {
  return (
    <div style={{
      background: "#111",
      borderRadius: 10,
      margin: "8px 0",
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.26)"
    }}>
      <h4 style={{margin:0, marginBottom:8, color:"#fff"}}>{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" tick={{fontSize:10, fill:"#fff"}} interval={2} />
          <YAxis tick={{fontSize:12, fill:"#fff"}} domain={['auto', 'auto']} />
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <Legend wrapperStyle={{ color: "#fff" }}/>
          <Tooltip contentStyle={{background: "#222", color: "#fff", borderRadius:6}} />
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

  if (!graph) return <div style={{color: "#fff"}}>Loading graph...</div>;

  const dateKeys = Object.keys(graph).sort();
  const data = makeHourData(graph[selectedDate]);

  return (
    <div>
      <h3 style={{color:"#fff"}}>Energy Graphs for {selectedDate || "Selected Date"} (IST)</h3>
      <div style={{marginBottom:12}}>
        <label style={{color:"#fff"}}>
          Select date:&nbsp;
          <select
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{
              fontSize:"1em",
              background: "#333",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: 4,
              padding: "2px 4px"
            }}
          >
            {dateKeys.map(date =>
              <option key={date} value={date}>{date}</option>
            )}
          </select>
        </label>
      </div>
      {data.length === 0 ? (
        <div style={{color:"#fff"}}>No data for this date.</div>
      ) : (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{flex: "1 1 calc(50% - 16px)", minWidth: 0}}>
            <EnergyLineChart
              data={data}
              dataKey="solarEnergy"
              title="Solar Energy"
              color="#ff9800"
            />
          </div>
          <div style={{flex: "1 1 calc(50% - 16px)", minWidth: 0}}>
            <EnergyLineChart
              data={data}
              dataKey="windEnergy"
              title="Wind Energy"
              color="#03a9f4"
            />
          </div>
          <div style={{flex: "1 1 calc(50% - 16px)", minWidth: 0}}>
            <EnergyLineChart
              data={data}
              dataKey="totalEnergy"
              title="Total Energy"
              color="#4caf50"
            />
          </div>
          <div style={{flex: "1 1 calc(50% - 16px)", minWidth: 0}}>
            <EnergyLineChart
              data={data}
              dataKey="demandEnergy"
              title="Demand Energy"
              color="#e91e63"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphSection;
