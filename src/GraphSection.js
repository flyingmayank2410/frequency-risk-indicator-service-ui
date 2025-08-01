import React, { useEffect, useState } from "react";

function GraphSection({ locationId }) {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    fetch(`https://frequency-risk-detection-inertia-control-production.up.railway.app/api/v1/graph?locationId=${locationId}&days=3`)
      .then(r => r.json())
      .then(setGraph);
  }, [locationId]);

  if (!graph) return <div>Loading graph...</div>;
  // Simplified display, for a complete chart use Chart.js/Recharts and plot graph.totalEnergy, solarEnergy, windEnergy, etc.
  return (
    <div>
      <h3>Energy Graph Data</h3>
      <pre style={{maxHeight:200, overflow:"auto"}}>{JSON.stringify(graph, null, 2)}</pre>
    </div>
  );
}

export default GraphSection;
