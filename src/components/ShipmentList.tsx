
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
  
  const filteredShipments = shipments.filter(shipment => 
    shipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.itemCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative bg-black/90 backdrop-blur-md w-80 h-full overflow-hidden flex flex-col shadow-lg border-r border-cyan-500/10">
      <div className="flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-cyan-400" />
          <span>Active Shipments</span>
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
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
            No shipments match your search
          </div>
        ) : (
          filteredShipments.map((shipment) => (
            <Collapsible
              key={shipment.id}
              open={expandedId === shipment.id}
              onOpenChange={() => toggleExpand(shipment.id)}
            >
              <div
                className={`shipment-card relative overflow-hidden ${
                  activeShipment?.id === shipment.id 
                    ? 'bg-cyan-950/60 border-l-4 border-cyan-400' 
                    : 'bg-white/5 hover:bg-white/10'
                } transition-all duration-200`}
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
                
                <div className="flex items-center justify-between mb-2 mt-6">
                  <div className="flex items-center space-x-2">
                    {shipment.type === 'ship' ? (
                      <Ship className="text-cyan-300" size={18} />
                    ) : (
                      <Plane className="text-violet-300" size={18} />
                    )}
                    <span className="font-semibold text-white">{shipment.name}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                    <span>From: {shipment.origin.name}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                    <span>To: {shipment.destination.name}</span>
                  </div>
                  <div className="flex items-center mt-2 text-cyan-300">
                    <Clock className="w-4 h-4 mr-1" />
                    ETA: {shipment.eta}
                  </div>
                </div>
                
                <CollapsibleTrigger asChild>
                  <button className="w-full flex justify-center items-center mt-2 text-white/60 hover:text-white/90">
                    {expandedId === shipment.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="bg-cyan-950/50 p-4 rounded-b-lg text-sm space-y-2 text-gray-300 border-l-4 border-cyan-400/30">
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                  <div><span className="text-cyan-300">Destination:</span> {shipment.destination.country}</div>
                  <div><span className="text-cyan-300">Category:</span> {shipment.itemCategory}</div>
                  <div><span className="text-cyan-300">Weight:</span> {shipment.weight}</div>
                  <div><span className="text-cyan-300">OPS:</span> {shipment.ops}</div>
                </div>
                
                <div className="pt-1">
                  <span className="text-cyan-300">Description:</span> 
                  <div className="ml-2 text-xs opacity-80">{shipment.itemDescription}</div>
                </div>
                
                <Link 
                  to={`/shipment/${shipment.id}`}
                  className="flex items-center gap-1 mt-3 text-cyan-400 hover:text-cyan-300 transition-colors text-xs group"
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
      <div className="border-t border-cyan-500/10 p-3 text-xs text-cyan-200/60 font-mono flex items-center justify-between bg-gradient-to-r from-cyan-950/30 to-transparent">
        <div>TOTAL: {filteredShipments.length} SHIPMENTS</div>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '1s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentList;
