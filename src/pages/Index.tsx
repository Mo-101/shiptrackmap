
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import ShipmentDetail from './ShipmentDetail';
import { Shipment } from '../types/shipment';
import { BarChart2 } from 'lucide-react';
import { convertFreightToShipments } from '../services/unifiedDataService';

const Index = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();
  const location = useLocation();
  
  // Load shipments from our unified data service
  useEffect(() => {
    const loadedShipments = convertFreightToShipments();
    setShipments(loadedShipments);
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
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-screen w-screen flex flex-col bg-palette-darkblue">
            {/* Analytics Link */}
            <div className="absolute top-4 right-4 z-10">
              <Link 
                to="/analytics" 
                className="flex items-center gap-2 bg-secondary/80 hover:bg-secondary text-white py-2 px-4 rounded-full text-sm font-medium transition-colors shadow-lg"
              >
                <BarChart2 size={16} />
                <span>Analytics</span>
              </Link>
            </div>
            
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
        }
      />
      <Route
        path="/shipment/:id"
        element={<ShipmentDetail shipment={shipments.find(s => s.id === location.pathname.split('/').pop())} />}
      />
    </Routes>
  );
};

export default Index;
