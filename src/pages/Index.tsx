import React, { useState } from 'react';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import { Shipment } from '../types/shipment';

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    name: 'Cargo Express A1',
    type: 'ship',
    origin: {
      name: 'Shanghai, China',
      coordinates: [121.4737, 31.2304],
    },
    destination: {
      name: 'Los Angeles, USA',
      coordinates: [-118.2437, 34.0522],
    },
    status: 'in-transit',
    eta: '2024-03-15',
  },
  {
    id: '2',
    name: 'Charter Flight C7',
    type: 'charter',
    origin: {
      name: 'Dubai, UAE',
      coordinates: [55.2708, 25.2048],
    },
    destination: {
      name: 'London, UK',
      coordinates: [-0.1276, 51.5074],
    },
    status: 'in-transit',
    eta: '2024-03-10',
  },
  {
    id: '3',
    name: 'Ocean Vessel B3',
    type: 'ship',
    origin: {
      name: 'Rotterdam, Netherlands',
      coordinates: [4.4790, 51.9225],
    },
    destination: {
      name: 'Singapore',
      coordinates: [103.8198, 1.3521],
    },
    status: 'delayed',
    eta: '2024-03-20',
  },
];

const Index = () => {
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();

  return (
    <div className="h-screen w-screen flex">
      <ShipmentList
        shipments={MOCK_SHIPMENTS}
        activeShipment={activeShipment}
        onShipmentSelect={setActiveShipment}
      />
      <div className="flex-1 relative">
        <ShipmentMap
          shipments={MOCK_SHIPMENTS}
          activeShipment={activeShipment}
        />
      </div>
    </div>
  );
};

export default Index;