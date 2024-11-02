import React, { useState } from 'react';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import { Shipment } from '../types/shipment';

const MOCK_SHIPMENTS: Shipment[] = [
  // ESA Routes from Nairobi
  {
    id: '1',
    name: 'Nairobi-Tanzania Route',
    type: 'ship',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Dar es Salaam, Tanzania',
      coordinates: [39.2083, -6.7924],
    },
    status: 'in-transit',
    eta: '2024-03-15',
  },
  {
    id: '2',
    name: 'Nairobi-Uganda Route',
    type: 'charter',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Kampala, Uganda',
      coordinates: [32.5899, 0.3476],
    },
    status: 'in-transit',
    eta: '2024-03-12',
  },
  {
    id: '3',
    name: 'Nairobi-Ethiopia Route',
    type: 'charter',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Addis Ababa, Ethiopia',
      coordinates: [38.7578, 9.0222],
    },
    status: 'in-transit',
    eta: '2024-03-14',
  },
  // WCA Routes from Dakar
  {
    id: '4',
    name: 'Dakar-Nigeria Route',
    type: 'ship',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Lagos, Nigeria',
      coordinates: [3.3792, 6.5244],
    },
    status: 'in-transit',
    eta: '2024-03-18',
  },
  {
    id: '5',
    name: 'Dakar-Ghana Route',
    type: 'ship',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Accra, Ghana',
      coordinates: [-0.1869, 5.6037],
    },
    status: 'in-transit',
    eta: '2024-03-16',
  },
  {
    id: '6',
    name: 'Dakar-Cameroon Route',
    type: 'charter',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Douala, Cameroon',
      coordinates: [9.7068, 4.0511],
    },
    status: 'in-transit',
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