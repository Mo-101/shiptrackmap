
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from './ShipmentDetail';
import { Shipment } from '../types/shipment';
import AFRICAN_SHIPMENTS from '../data/africanShipments';

const Index = () => {
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();
  const location = useLocation();
  
  // Set active shipment based on URL when on detail page
  useEffect(() => {
    if (location.pathname.startsWith('/shipment/')) {
      const shipmentId = location.pathname.split('/').pop();
      const shipment = AFRICAN_SHIPMENTS.find(s => s.id === shipmentId);
      if (shipment) {
        setActiveShipment(shipment);
      }
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-screen w-screen flex bg-palette-darkblue">
            <ShipmentList
              shipments={AFRICAN_SHIPMENTS}
              activeShipment={activeShipment}
              onShipmentSelect={setActiveShipment}
            />
            <div className="flex-1 relative">
              <ShipmentMap
                shipments={AFRICAN_SHIPMENTS}
                activeShipment={activeShipment}
              />
            </div>
          </div>
        }
      />
      <Route
        path="/shipment/:id"
        element={<ShipmentDetail shipment={AFRICAN_SHIPMENTS.find(s => s.id === location.pathname.split('/').pop())} />}
      />
    </Routes>
  );
};

export default Index;
