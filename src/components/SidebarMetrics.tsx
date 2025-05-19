import { getTotals, getAverages } from "../utils/statsHelpers";

const SidebarMetrics = ({ data }: { data: any[] }) => {
  const { totalShipments, totalWeight, totalVolume } = getTotals(data);
  const { avgWeight, avgVolume } = getAverages(data);

  return (
    <aside className="w-64 bg-blue-900/80 p-4 flex flex-col gap-6 min-h-screen">
      <div className="text-xl font-bold text-cyan-300">📦 Shipments</div>
      <div className="text-3xl font-mono animate-pulse">{totalShipments}</div>
      <div className="text-md text-white/80">Weight: <span className="font-bold">{totalWeight.toFixed(2)} kg</span></div>
      <div className="text-md text-white/80">Volume: <span className="font-bold">{totalVolume.toFixed(2)} cbm</span></div>
      <div className="mt-4">
        <div className="text-cyan-300">Avg Weight: {avgWeight.toFixed(2)} kg</div>
        <div className="text-cyan-300">Avg Volume: {avgVolume.toFixed(2)} cbm</div>
      </div>
    </aside>
  );
};
export default SidebarMetrics;
