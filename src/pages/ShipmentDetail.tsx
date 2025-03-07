
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Warehouse, FileText, Calendar, Weight, Database, DollarSign, Box, Truck, ArrowLeft, MapPin, Clock, Ship, Plane, Check } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Shipment } from '../types/shipment';

interface ShipmentDetailProps {
  shipment?: Shipment;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!shipment) return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-center p-8 bg-black/50 backdrop-blur-md rounded-lg border border-cyan-500/20">
        <Package className="w-16 h-16 mx-auto text-cyan-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Shipment Not Found</h1>
        <p className="text-gray-400 mb-6">Could not locate shipment with ID: {id}</p>
        <Link to="/" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  // Categorize shipment details for the cards
  const basicDetails = [
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Tracking ID: ${shipment.id}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Status: ${shipment.status}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Type: ${shipment.type === 'ship' ? 'Sea Freight' : shipment.type === 'charter' ? 'Air Freight' : 'Land Transport'}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `ETA: ${shipment.eta}` },
  ];

  const proDetails = [
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Weight: ${shipment.weight}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Value: ${shipment.value || 'N/A'}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Volume: ${shipment.volume || 'N/A'}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Consignee: At ${shipment.consigneeAddress}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Items: ${shipment.itemDescription}` },
  ];

  const plusDetails = [
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Origin: ${shipment.origin.name}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Destination: ${shipment.destination.name}, ${shipment.destination.country}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Category: ${shipment.itemCategory}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `WHO Description: ${shipment.whoDescription || 'Standard Shipment'}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Stock Release: ${shipment.stockRelease || 'N/A'}` },
    { icon: <Check className="w-4 h-4 text-green-500" />, label: `Expiration: ${shipment.expirationDate || 'N/A'}` },
  ];

  // Define card styling based on shipment type
  const getCardGradient = () => {
    switch (shipment.type) {
      case 'ship':
        return 'from-blue-600 to-blue-400';
      case 'charter':
        return 'from-purple-600 to-purple-400';
      case 'truck':
        return 'from-cyan-600 to-cyan-400';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 animate-fade-in">
      <Link 
        to="/" 
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          {shipment.type === 'ship' ? (
            <Ship className="w-8 h-8 text-cyan-400" />
          ) : shipment.type === 'charter' ? (
            <Plane className="w-8 h-8 text-purple-400" />
          ) : (
            <Truck className="w-8 h-8 text-blue-400" />
          )}
          {shipment.name}
        </h1>
        <p className="text-gray-400">Shipment details and tracking information</p>
      </div>
      
      {/* Pricing-table style cards for shipment details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Basic Details Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl transform transition-all hover:scale-105">
          <div className={`bg-gradient-to-r ${getCardGradient()} p-4 flex flex-col items-center justify-center h-40`}>
            <span className="text-white text-xs uppercase tracking-wider mb-1">Basic Details</span>
            <h2 className="text-3xl font-bold text-white mb-2">Tracking</h2>
            <div className="text-white/80 text-xl font-medium">{shipment.id}</div>
          </div>
          
          <div className="bg-white p-6 space-y-4">
            {basicDetails.map((detail, index) => (
              <div key={index} className="flex items-start space-x-2">
                {detail.icon}
                <span className="text-gray-800">{detail.label}</span>
              </div>
            ))}
            
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/${shipment.origin.coordinates[1]},${shipment.origin.coordinates[0]}/${shipment.destination.coordinates[1]},${shipment.destination.coordinates[0]}`, '_blank')}
              className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Track Route
            </button>
          </div>
        </div>
        
        {/* Pro Details Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-300 p-4 flex flex-col items-center justify-center h-40">
            <span className="text-white text-xs uppercase tracking-wider mb-1">Shipping Details</span>
            <h2 className="text-3xl font-bold text-white mb-2">Cargo</h2>
            <div className="text-white/80 text-xl font-medium">{shipment.itemCategory}</div>
          </div>
          
          <div className="bg-white p-6 space-y-4">
            {proDetails.map((detail, index) => (
              <div key={index} className="flex items-start space-x-2">
                {detail.icon}
                <span className="text-gray-800">{detail.label}</span>
              </div>
            ))}
            
            <button 
              onClick={() => navigate(`/shipment/${Number(id) > 1 ? Number(id) - 1 : id}`)}
              className="mt-4 w-full py-2 px-4 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium"
            >
              Previous Shipment
            </button>
          </div>
        </div>
        
        {/* Plus Details Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl transform transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-purple-500 to-purple-300 p-4 flex flex-col items-center justify-center h-40">
            <span className="text-white text-xs uppercase tracking-wider mb-1">Advanced Details</span>
            <h2 className="text-3xl font-bold text-white mb-2">Complete</h2>
            <div className="text-white/80 text-xl font-medium">Info Package</div>
          </div>
          
          <div className="bg-white p-6 space-y-4">
            {plusDetails.map((detail, index) => (
              <div key={index} className="flex items-start space-x-2">
                {detail.icon}
                <span className="text-gray-800">{detail.label}</span>
              </div>
            ))}
            
            <button 
              onClick={() => navigate(`/shipment/${Number(id) < 20 ? Number(id) + 1 : id}`)}
              className="mt-4 w-full py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors font-medium"
            >
              Next Shipment
            </button>
          </div>
        </div>
      </div>
      
      {/* Additional shipping notes or status updates */}
      <div className="bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          Shipping Notes
        </h3>
        <div className="space-y-2 text-gray-300">
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Box className="w-4 h-4 text-purple-400" />
            Operated by: {shipment.ops || 'Logistics Team'}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            Current location: {shipment.status === 'in-transit' ? 'In Transit' : shipment.status === 'delivered' ? shipment.destination.name : 'Processing Center'}
          </p>
        </div>
      </div>
      
      {/* High-tech decorative elements */}
      <div className="fixed bottom-4 right-4 text-xs text-cyan-500/60 font-mono bg-black/50 backdrop-blur-md p-2 rounded border border-cyan-500/20 hidden md:block">
        SHIPMENT ID: {shipment.id} | WEIGHT: {shipment.weight} | STATUS: {shipment.status.toUpperCase()}
      </div>
    </div>
  );
};

export default ShipmentDetail;
