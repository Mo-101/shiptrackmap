import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from './ShipmentDetail';
import { Shipment } from '../types/shipment';

const MOCK_SHIPMENTS: Shipment[] = [
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
      country: 'Tanzania',
    },
    status: 'in-transit',
    eta: '2024-03-15',
    consigneeAddress: '123 Port Road, Dar es Salaam',
    ops: 'John Smith',
    itemCategory: 'Agricultural Equipment',
    itemDescription: 'Tractors and farming implements',
    weight: '12,500 kg',
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
      country: 'Uganda',
    },
    status: 'in-transit',
    eta: '2024-03-12',
    consigneeAddress: '456 Central Avenue, Kampala',
    ops: 'Sarah Johnson',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Vaccines and medical equipment',
    weight: '2,800 kg',
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
      country: 'Ethiopia',
    },
    status: 'in-transit',
    eta: '2024-03-14',
    consigneeAddress: '789 Addis Ababa Road, Addis Ababa',
    ops: 'Michael Brown',
    itemCategory: 'Food Products',
    itemDescription: 'Canned food and grains',
    weight: '10,000 kg',
  },
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
      country: 'Nigeria',
    },
    status: 'in-transit',
    eta: '2024-03-18',
    consigneeAddress: '321 Market Street, Lagos',
    ops: 'Lucy Green',
    itemCategory: 'Electronics',
    itemDescription: 'Mobile phones and accessories',
    weight: '8,000 kg',
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
      country: 'Ghana',
    },
    status: 'in-transit',
    eta: '2024-03-16',
    consigneeAddress: '654 Freedom Avenue, Accra',
    ops: 'Evelyn Reed',
    itemCategory: 'Textiles',
    itemDescription: 'Clothing and fabrics',
    weight: '4,500 kg',
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
      country: 'Cameroon',
    },
    status: 'in-transit',
    eta: '2024-03-20',
    consigneeAddress: '987 River Road, Douala',
    ops: 'Robert White',
    itemCategory: 'Household Goods',
    itemDescription: 'Furniture and appliances',
    weight: '15,000 kg',
  },
];

const Index = () => {
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();

  return (
    <Routes>
      <Route
        path="/"
        element={
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
        }
      />
      <Route
        path="/shipment/:id"
        element={<ShipmentDetail shipment={MOCK_SHIPMENTS.find(s => s.id === window.location.pathname.split('/').pop())} />}
      />
    </Routes>
  );
};

export default Index;