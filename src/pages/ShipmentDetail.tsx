
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Warehouse, FileText, Calendar, Weight, Database, DollarSign, Box, Truck, MapPin, Clock, Ship, Plane } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Shipment } from '../types/shipment';

interface ShipmentDetailProps {
  shipment?: Shipment;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment }) => {
  const { id } = useParams();
  
  if (!shipment) return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-center p-8 bg-black/50 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <Package className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Shipment Not Found</h1>
        <p className="text-gray-400 mb-6">Could not locate shipment with ID: {id}</p>
        <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md inline-flex items-center gap-2 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const details = [
    { icon: <Package className="w-5 h-5" />, label: "Tracking Number", value: shipment.id, color: "bg-cyan-950" },
    { icon: <Warehouse className="w-5 h-5" />, label: "Warehouse", value: "Main Warehouse", color: "bg-blue-950" },
    { icon: <FileText className="w-5 h-5" />, label: "Stock Release (SR)", value: "SR-2024-001", color: "bg-indigo-950" },
    { icon: <Box className="w-5 h-5" />, label: "WHO Description", value: "Medical Supplies", color: "bg-violet-950" },
    { icon: <Truck className="w-5 h-5" />, label: "Item Description", value: shipment.itemDescription, color: "bg-cyan-950" },
    { icon: <Calendar className="w-5 h-5" />, label: "Expiration Date", value: "2025-12-31", color: "bg-blue-950" },
    { icon: <Weight className="w-5 h-5" />, label: "Weight", value: shipment.weight, color: "bg-indigo-950" },
    { icon: <Database className="w-5 h-5" />, label: "Volume", value: "500 m³", color: "bg-violet-950" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Value", value: "$50,000", color: "bg-cyan-950" }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 animate-fade-in">
      <Link 
        to="/" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        Back to Dashboard
      </Link>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-cyan-500/20 flex-1">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-cyan-400" />
            {shipment.name}
          </h1>
          
          <div className="flex items-center gap-2 mt-4">
            {shipment.type === 'ship' ? (
              <Ship className="text-cyan-400" />
            ) : (
              <Plane className="text-violet-400" />
            )}
            <span className="text-lg font-medium">{shipment.type === 'ship' ? 'Sea Freight' : 'Air Freight'}</span>
            
            <span className={`ml-auto text-sm px-3 py-1 rounded-full ${
              shipment.status === 'in-transit' 
                ? 'bg-amber-500/20 text-amber-300' 
                : shipment.status === 'delivered' 
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
            }`}>
              {shipment.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Origin</div>
                  <div className="font-medium">{shipment.origin.name}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Estimated Time of Arrival</div>
                  <div className="font-medium">{shipment.eta}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Destination</div>
                  <div className="font-medium">{shipment.destination.name}, {shipment.destination.country}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Box className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-400">Consignee Address</div>
                  <div className="font-medium">{shipment.consigneeAddress}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail, index) => (
          <Card key={index} className={`${detail.color} border-none p-6 hover:shadow-lg hover:shadow-cyan-500/5 transition-shadow group overflow-hidden relative`}>
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="text-cyan-300 bg-cyan-950 p-2 rounded-lg">{detail.icon}</div>
              <div>
                <p className="text-sm text-gray-400">{detail.label}</p>
                <p className="font-semibold text-lg text-white">{detail.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* High-tech decorative elements */}
      <div className="fixed bottom-4 right-4 text-xs text-cyan-500/60 font-mono bg-black/50 backdrop-blur-md p-2 rounded border border-cyan-500/20 hidden md:block">
        SHIPMENT ID: {shipment.id} | WEIGHT: {shipment.weight} | STATUS: {shipment.status.toUpperCase()}
      </div>
    </div>
  );
};

export default ShipmentDetail;
