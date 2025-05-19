const RoutesTab = ({ data }: { data: any[] }) => {
  // Simple route aggregation by origin-destination
  const routes: Record<string, number> = {};
  data.forEach(d => {
    const key = `${d.origin_country} ➔ ${d.destination_country}`;
    routes[key] = (routes[key] || 0) + parseFloat(d.weight_kg || 0);
  });
  const sorted = Object.entries(routes).sort((a, b) => b[1] - a[1]);

  if (!sorted.length) return <div className="p-8 text-center text-white/70">No route data available.</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full border text-white/90">
        <thead>
          <tr>
            <th className="px-2 py-1">Route</th>
            <th className="px-2 py-1">Total Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(([route, weight]) => (
            <tr key={route} className="hover:bg-blue-900/40 cursor-pointer transition">
              <td className="px-2 py-1 font-mono">{route}</td>
              <td className="px-2 py-1">{weight.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default RoutesTab;
