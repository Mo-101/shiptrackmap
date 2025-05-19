
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ship, Plane, Clock, ChevronDown, ChevronUp, ExternalLink, MapPin, Package, Truck } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible';
// Define our Shipment interface based on deeptrack_3.json schema
// ... existing imports ...
interface Shipment {
  request_reference: string;
  cargo_description: string;
  item_category: string;
  origin_country: string;
  destination_country: string;
  weight_kg: string | number;
  volume_cbm: string | number;
  date_of_collection: string;
  date_of_arrival_destination: string;
  delivery_status: string;
  mode_of_shipment: string;
  [key: string]: any;
}

interface ShipmentListProps {
  shipments: Shipment[];
  activeShipment: Shipment | null;
  onShipmentSelect: (shipment: Shipment) => void;
}

const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  activeShipment,
  onShipmentSelect,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const uniqueShipments = Array.from(
    new Map(shipments.map(item => [item.request_reference, item])).values()
  );

  const sortedShipments = uniqueShipments.sort((a, b) => {
    const dateA = new Date(a.date_of_collection);
    const dateB = new Date(b.date_of_collection);
    return dateB.getTime() - dateA.getTime();
  });

  const latest10 = sortedShipments.slice(0, 10);

  const getShipmentIcon = (mode: string) => {
    switch ((mode || '').toLowerCase()) {
      case 'sea': return <Ship size={18} className="text-palette-teal" />;
      case 'air': return <Plane size={18} className="text-palette-mint" />;
      case 'road': return <Truck size={18} className="text-palette-sand" />;
      default: return <Package size={18} className="text-palette-sage" />;
    }
  };

  return (
    <div className="relative bg-palette-blue/90 backdrop-blur-md w-80 h-full overflow-hidden flex flex-col shadow-lg border-r border-palette-teal/10">
      <div className="flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-palette-mint" />
          <span>Arrived Shipments</span>
        </h2>
        <input
          type="text"
          placeholder="Search shipments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-palette-darkblue/40 border border-palette-teal/20 rounded-md py-2 px-4 text-white placeholder:text-white/50 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {latest10.map((shipment) => (
          <Collapsible
            key={shipment.request_reference}
            open={expandedId === shipment.request_reference}
            onOpenChange={() => toggleExpand(shipment.request_reference)}
          >
            <div
              className={`relative transition-all rounded-lg cursor-pointer ${
                activeShipment?.request_reference === shipment.request_reference
                  ? 'bg-palette-teal/20 border-l-4 border-palette-mint'
                  : 'bg-palette-darkblue/30 hover:bg-palette-darkblue/50'
              }`}
              onClick={() => onShipmentSelect(shipment)}
            >
              <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
                Delivered
              </span>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2 mt-6">
                  <div className="flex items-center space-x-2">
                    {getShipmentIcon(shipment.mode_of_shipment)}
                    <span className="font-semibold text-white">{shipment.request_reference}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-palette-mint mt-1" />
                    <span>From: {shipment.origin_country}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-palette-sand mt-1" />
                    <span>To: {shipment.destination_country}</span>
                  </div>
                  <div className="flex items-center mt-2 text-palette-teal">
                    <Clock className="w-4 h-4 mr-1" />
                    Arrival: {shipment.date_of_arrival_destination}
                  </div>
                </div>
              </div>

              <CollapsibleTrigger asChild>
                <button className="w-full flex justify-center items-center py-1 text-white/60 hover:text-white/90 bg-palette-darkblue/30">
                  {expandedId === shipment.request_reference
                    ? <ChevronUp className="w-5 h-5" />
                    : <ChevronDown className="w-5 h-5" />}
                </button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="bg-palette-blue/40 p-4 rounded-b-lg text-sm space-y-2 text-gray-300">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-palette-mint">Category:</span> {shipment.item_category}</div>
                <div><span className="text-palette-mint">Weight:</span> {shipment.weight_kg} kg</div>
                <div><span className="text-palette-mint">Volume:</span> {shipment.volume_cbm} cbm</div>
              </div>
              <div>
                <span className="text-palette-mint">Description:</span>
                <div className="ml-2 text-xs opacity-80">{shipment.cargo_description}</div>
              </div>
              <Link to={`/shipment/${shipment.request_reference}`} className="text-xs text-palette-mint hover:text-white flex items-center gap-1 mt-2">
                <ExternalLink className="w-3 h-3" /> View Details
              </Link>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      <div className="border-t border-palette-teal/10 p-3 text-xs text-palette-mint/70 font-mono flex justify-between bg-palette-darkblue/50">
        <div>TOTAL: {latest10.length} SHIPMENTS</div>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-palette-mint animate-pulse"></span>
          <span className="h-2 w-2 rounded-full bg-palette-teal animate-pulse delay-500"></span>
          <span className="h-2 w-2 rounded-full bg-palette-sand animate-pulse delay-1000"></span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentList;
