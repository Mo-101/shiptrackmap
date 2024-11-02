import React, { useState } from 'react';
import { Ship, Plane, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Shipment } from '../types/shipment';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface ShipmentListProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
  onShipmentSelect: (shipment: Shipment) => void;
}

const ShipmentList: React.FC<ShipmentListProps> = ({
  shipments,
  activeShipment,
  onShipmentSelect,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm w-80 h-full overflow-y-auto scrollbar-hide p-4 shadow-lg animate-slide-in">
      <h2 className="text-2xl font-bold mb-6 text-primary">Active Shipments</h2>
      <div className="space-y-4">
        {shipments.map((shipment) => (
          <Collapsible
            key={shipment.id}
            open={expandedId === shipment.id}
            onOpenChange={() => toggleExpand(shipment.id)}
          >
            <div
              className={`shipment-card relative ${activeShipment?.id === shipment.id ? 'active' : ''}`}
              onClick={() => onShipmentSelect(shipment)}
            >
              <span className="absolute top-2 left-2 text-xs text-ocean">
                {shipment.status}
              </span>
              <div className="flex items-center justify-between mb-2 mt-6">
                <div className="flex items-center space-x-2">
                  {shipment.type === 'ship' ? (
                    <Ship className="text-shipping-dark" />
                  ) : (
                    <Plane className="text-primary" />
                  )}
                  <span className="font-semibold">{shipment.name}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>From: {shipment.origin.name}</div>
                <div>To: {shipment.destination.name}</div>
                <div className="flex items-center mt-2 text-ocean-dark">
                  <Clock className="w-4 h-4 mr-1" />
                  ETA: {shipment.eta}
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <button className="w-full flex justify-center items-center mt-2 text-ocean hover:text-ocean-dark">
                  {expandedId === shipment.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="bg-gray-50 p-4 rounded-b-lg text-sm space-y-2">
              <div><span className="font-semibold">Destination Country:</span> {shipment.destination.country}</div>
              <div><span className="font-semibold">Consignee Address:</span> {shipment.consigneeAddress}</div>
              <div><span className="font-semibold">OPS:</span> {shipment.ops}</div>
              <div>
                <span className="font-semibold">Item Category:</span> {shipment.itemCategory}
                <div className="text-gray-600 ml-4">{shipment.itemDescription}</div>
              </div>
              <div><span className="font-semibold">Weight:</span> {shipment.weight}</div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default ShipmentList;