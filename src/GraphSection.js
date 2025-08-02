import React, { useEffect, useState } from "react";

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(response => {
        if (response && response.data && typeof response.data === "object") {
          setGraph(response.data);
        } else {
          setGraph(null);
        }
      })
      .catch(() => setGraph(null));
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;
  // For quick reference, simply display the JSON graph data. For a real chart, use Chart.js/Recharts.
  return (
    <div>
      <h3>Energy Graph Data</h3>
      <pre style={{ maxHeight: 200, overflow: "auto" }}>{JSON.stringify(graph, null, 2)}</pre>
    </div>
  );
}

export default GraphSection;
