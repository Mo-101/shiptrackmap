import { detectAnomalies } from "../utils/statsHelpers";

const AnomaliesTab = ({ data }: { data: any[] }) => {
  const anomalies = detectAnomalies(data);

  if (!anomalies.length) return <div className="p-8 text-center text-white/70">✅ No anomalies detected. All systems optimal.</div>;

  return (
    <div className="p-6 space-y-4">
      {anomalies.map((a, i) => (
        <div key={a.request_reference + i} className="bg-blue-900/50 rounded-lg p-4 shadow transition hover:scale-[1.01]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-cyan-300">{a.request_reference}</span>
            <span className={`badge px-2 py-1 rounded text-xs ${
              a.severity === "high" ? "bg-red-500/80" : a.severity === "medium" ? "bg-yellow-500/80" : "bg-green-500/80"
            }`}>{a.severity?.toUpperCase()}</span>
          </div>
          <div className="text-white/90 mt-1">{a.rule}: <span className="font-mono">{a.reason}</span></div>
          <div className="text-white/70 text-xs mt-1">Carrier: <b>{a.carrier}</b></div>
          <div className="text-white/80 mt-2">💡 <b>Remediation:</b> {a.remediation}</div>
        </div>
      ))}
    </div>
  );
};
export default AnomaliesTab;
