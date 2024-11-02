import React from 'react';
import { Ship, Plane, Clock } from 'lucide-react';
import { Shipment } from '../types/shipment';

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
  return (
    <div className="bg-white/90 backdrop-blur-sm w-80 h-full overflow-y-auto p-4 shadow-lg animate-slide-in">
      <h2 className="text-2xl font-bold mb-6 text-primary">Active Shipments</h2>
      <div className="space-y-4">
        {shipments.map((shipment) => (
          <div
            key={shipment.id}
            className={`shipment-card ${activeShipment?.id === shipment.id ? 'active' : ''}`}
            onClick={() => onShipmentSelect(shipment)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {shipment.type === 'ship' ? (
                  <Ship className="text-shipping-dark" />
                ) : (
                  <Plane className="text-primary" />
                )}
                <span className="font-semibold">{shipment.name}</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                shipment.status === 'in-transit' ? 'bg-ocean-light text-ocean-dark' :
                shipment.status === 'delivered' ? 'bg-shipping-light text-shipping-dark' :
                'bg-red-100 text-red-800'
              }`}>
                {shipment.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <div>From: {shipment.origin.name}</div>
              <div>To: {shipment.destination.name}</div>
              <div className="flex items-center mt-2 text-ocean-dark">
                <Clock className="w-4 h-4 mr-1" />
                ETA: {shipment.eta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentList;