
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from './ShipmentDetail';
import { Shipment } from '../types/shipment';
import { BarChart2, FileBarChart2 } from 'lucide-react';
import { convertFreightToShipments } from '../services/unifiedDataService';

const Index = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();
  const location = useLocation();
  
  // Load shipments from /deeptrack_3.json
  useEffect(() => {
    fetch('/deeptrack_3.json')
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);
  
  // Set active shipment based on URL when on detail page
  useEffect(() => {
    if (location.pathname.startsWith('/shipment/')) {
      const shipmentId = location.pathname.split('/').pop();
      const shipment = shipments.find(s => s.id === shipmentId);
      if (shipment) {
        setActiveShipment(shipment);
      }
    }
  }, [location.pathname, shipments]);

  return (
    <div className="h-screen w-screen flex flex-col bg-palette-darkblue">
            <div className="flex flex-1 overflow-hidden">
              <ShipmentList
                shipments={shipments}
                activeShipment={activeShipment}
                onShipmentSelect={setActiveShipment}
              />
              <div className="flex-1 relative">
                <ShipmentMap
                  shipments={shipments}
                  activeShipment={activeShipment}
                />
              </div>
            </div>
          </div>
  );
};

export default Index;
