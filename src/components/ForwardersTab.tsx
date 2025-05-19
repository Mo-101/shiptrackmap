import { getForwarderStats } from "../utils/statsHelpers";

const ForwardersTab = ({ data }: { data: any[] }) => {
  const stats = getForwarderStats(data);

  if (!stats.length) return <div className="p-8 text-center text-white/70">No forwarder data available.</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full border text-white/90">
        <thead>
          <tr>
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Average ($)</th>
            <th className="px-2 py-1">Total Quotes</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(fwd => (
            <tr key={fwd.name} className="hover:bg-blue-900/40 cursor-pointer transition">
              <td className="px-2 py-1 font-mono">{fwd.name}</td>
              <td className="px-2 py-1">{fwd.avg.toFixed(2)}</td>
              <td className="px-2 py-1">{fwd.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ForwardersTab;
