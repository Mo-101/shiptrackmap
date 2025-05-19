import { getUniqueShipments } from "../utils/statsHelpers";

const ShipmentsTab = ({ data, filters, setFilters }: any) => {
  let shipments = getUniqueShipments(data);
  if (filters.origin) {
    shipments = shipments.filter((d: any) => d.origin_country?.toLowerCase().includes(filters.origin.toLowerCase()));
  }
  // Add more filter logic as needed

  if (!shipments.length) return <div className="p-8 text-center text-white/70">No shipments found for selected filters.</div>;

  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full border text-white/90">
        <thead>
          <tr>
            <th className="px-2 py-1">Ref</th>
            <th className="px-2 py-1">Origin</th>
            <th className="px-2 py-1">Destination</th>
            <th className="px-2 py-1">Weight (kg)</th>
            <th className="px-2 py-1">Volume (cbm)</th>
            <th className="px-2 py-1">Carrier</th>
            <th className="px-2 py-1">Cost ($)</th>
            <th className="px-2 py-1">Arrived</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s: any) => (
            <tr key={s.request_reference} className="hover:bg-blue-900/40 cursor-pointer transition">
              <td className="px-2 py-1 font-mono">{s.request_reference}</td>
              <td className="px-2 py-1">{s.origin_country}</td>
              <td className="px-2 py-1">{s.destination_country}</td>
              <td className="px-2 py-1">{s.weight_kg}</td>
              <td className="px-2 py-1">{s.volume_cbm}</td>
              <td className="px-2 py-1">{s.carrier}</td>
              <td className="px-2 py-1">${s["carrier+cost"]}</td>
              <td className="px-2 py-1">{s.date_of_arrival_destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ShipmentsTab;
