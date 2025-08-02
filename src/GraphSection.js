import React, { useEffect, useState } from "react";

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=1`)
      .then(r => r.json())
      .then(setGraph);
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;
  // For quick reference, simply display the JSON graph data.
  // For a real chart, pass this data to Recharts/Chart.js.
  return (
    <div>
      <h3>Energy Graph Data</h3>
      <pre style={{maxHeight:200, overflow:"auto"}}>{JSON.stringify(graph, null, 2)}</pre>
    </div>
  );
}

export default GraphSection;
