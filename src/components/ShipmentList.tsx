
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ship, Plane, Clock, ChevronDown, ChevronUp, ExternalLink, MapPin, Package, Truck } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Filter for delivered shipments only, sort by delivery date descending, then filter by search
  // Helper to check for delivered status in both base data and normalized types
  const isDelivered = (shipment: any) => {
    const statusRaw = shipment.deliveryStatus || shipment.delivery_status || shipment.status;
    return (
      statusRaw?.toLowerCase() === 'delivered' ||
      statusRaw?.toLowerCase() === 'on-time' // support normalized type
    );
  };
  // Helper to get delivery date in a robust way
  const getDeliveryDate = (shipment: any) => {
    return (
      shipment.dateOfArrivalDestination ||
      shipment.date_of_arrival_destination ||
      shipment.dateOfArrival ||
      shipment.date_of_arrival ||
      shipment.eta ||
      shipment.date_of_collection ||
      ''
    );
  };

  const deliveredShipments = shipments
    .filter(isDelivered)
    .sort((a, b) => {
      const dateA = new Date(getDeliveryDate(a));
      const dateB = new Date(getDeliveryDate(b));
      return dateB.getTime() - dateA.getTime();
    });
  
  const filteredShipments = deliveredShipments
    .filter(shipment =>
      (shipment.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shipment.origin?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shipment.destination?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (shipment.itemCategory?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Only the latest 10

  // Map mode_of_shipment to icon type
  const getShipmentIcon = (mode_of_shipment: string) => {
    switch((mode_of_shipment || '').toLowerCase()) {
      case 'sea':
        return <Ship className="text-palette-teal" size={18} />;
      case 'air':
        return <Plane className="text-palette-mint" size={18} />;
      case 'road':
        return <Truck className="text-palette-sand" size={18} />;
      default:
        return <Package className="text-palette-sage" size={18} />;
    }
  };
  // Use getShipmentIcon(shipment.mode_of_shipment) everywhere in the component.

  return (
    <div className="relative bg-palette-blue/90 backdrop-blur-md w-80 h-full overflow-hidden flex flex-col shadow-lg border-r border-palette-teal/10">
      <div className="flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-palette-mint" />
          <span>Active Shipments</span>
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-palette-darkblue/40 border border-palette-teal/20 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-palette-mint focus:border-palette-mint"
          />
          <div className="absolute left-3 top-2.5 text-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
        {filteredShipments.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            No delivered shipments found.
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <Collapsible
              key={shipment.id}
              open={expandedId === shipment.id}
              onOpenChange={() => toggleExpand(shipment.id)}
            >
              <div
                className={`relative overflow-hidden transition-all duration-200 ${
                  activeShipment?.id === shipment.id 
                    ? 'bg-palette-teal/20 border-l-4 border-palette-mint' 
                    : 'bg-palette-darkblue/30 hover:bg-palette-darkblue/50'
                } rounded-lg backdrop-blur-md cursor-pointer`}
                onClick={() => onShipmentSelect(shipment)}
              >
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${
                  shipment.status === 'in-transit' 
                    ? 'bg-amber-500/20 text-amber-300' 
                    : shipment.status === 'delivered' 
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                }`}>
                  {shipment.status}
                </span>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2 mt-6">
                    <div className="flex items-center space-x-2">
                      {getShipmentIcon(shipment.type)}
                      <span className="font-semibold text-white">{shipment.name}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-palette-mint mt-1 flex-shrink-0" />
                      <span>From: {shipment.origin.name}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-palette-sand mt-1 flex-shrink-0" />
                      <span>To: {shipment.destination.name}</span>
                    </div>
                    <div className="flex items-center mt-2 text-palette-teal">
                      <Clock className="w-4 h-4 mr-1" />
                      ETA: {shipment.eta}
                    </div>
                  </div>
                </div>
                
                <CollapsibleTrigger asChild>
                  <button className="w-full flex justify-center items-center py-1 text-white/60 hover:text-white/90 bg-palette-darkblue/30">
                    {expandedId === shipment.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="bg-palette-blue/40 p-4 rounded-b-lg text-sm space-y-2 text-gray-300 border-l-4 border-palette-teal/30 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                  <div><span className="text-palette-mint">Destination:</span> {shipment.destination.country}</div>
                  <div><span className="text-palette-mint">Category:</span> {shipment.itemCategory}</div>
                  <div><span className="text-palette-mint">Weight:</span> {shipment.weight}</div>
                  <div><span className="text-palette-mint">OPS:</span> {shipment.ops}</div>
                </div>
                
                <div className="pt-1">
                  <span className="text-palette-mint">Description:</span> 
                  <div className="ml-2 text-xs opacity-80">{shipment.itemDescription}</div>
                </div>
                
                <Link 
                  to={`/shipment/${shipment.id}`}
                  className="flex items-center gap-1 mt-3 text-palette-mint hover:text-white transition-colors text-xs group"
                >
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  View Detailed Information
                </Link>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>
      
      {/* High-tech decorative elements */}
      <div className="border-t border-palette-teal/10 p-3 text-xs text-palette-mint/70 font-mono flex items-center justify-between bg-gradient-to-r from-palette-darkblue/50 to-transparent">
        <div>TOTAL: {filteredShipments.length} SHIPMENTS</div>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-palette-mint animate-pulse"></span>
          <span className="h-2 w-2 rounded-full bg-palette-teal animate-pulse" style={{ animationDelay: '0.5s' }}></span>
          <span className="h-2 w-2 rounded-full bg-palette-sand animate-pulse" style={{ animationDelay: '1s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentList;
