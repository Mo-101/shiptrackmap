
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ShipmentMap from '../components/ShipmentMap';
import ShipmentList from '../components/ShipmentList';
import NavHeader from '../components/NavHeader';
import { Shipment } from '../types/shipment';
import { AFRICAN_SHIPMENTS } from '../data/africanShipments';

const Index = () => {
  const [activeShipment, setActiveShipment] = useState<Shipment | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Handle URL track parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trackId = params.get('track');
    if (trackId) {
      const shipment = AFRICAN_SHIPMENTS.find(s => s.id === trackId);
      if (shipment) {
        setActiveShipment(shipment);
        console.log("Set active shipment from URL param:", shipment.id);
      }
    }
  }, [location.search]);

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-transparent">
      <NavHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map as background layer */}
        <div className="absolute inset-0 z-0">
          <ShipmentMap
            shipments={AFRICAN_SHIPMENTS}
            activeShipment={activeShipment}
          />
        </div>
        
        {/* Shipment list with higher z-index */}
        <div className="relative z-30">
          <ShipmentList
            shipments={AFRICAN_SHIPMENTS}
            activeShipment={activeShipment}
            onShipmentSelect={setActiveShipment}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
