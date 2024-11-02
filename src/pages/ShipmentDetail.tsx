import React from 'react';
import { useParams } from 'react-router-dom';
import { Package, Warehouse, FileText, Calendar, Weight, Database, DollarSign, Box, Truck } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Shipment } from '../types/shipment';

interface ShipmentDetailProps {
  shipment?: Shipment;
}

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({ shipment }) => {
  const { id } = useParams();
  
  if (!shipment) return <div>Loading...</div>;

  const details = [
    { icon: <Package className="w-5 h-5" />, label: "SN", value: id },
    { icon: <Warehouse className="w-5 h-5" />, label: "Warehouse", value: "Main Warehouse" },
    { icon: <FileText className="w-5 h-5" />, label: "Stock Release (SR)", value: "SR-2024-001" },
    { icon: <Box className="w-5 h-5" />, label: "WHO Description", value: "Medical Supplies" },
    { icon: <Truck className="w-5 h-5" />, label: "Item Description", value: shipment.itemDescription },
    { icon: <Calendar className="w-5 h-5" />, label: "Expiration Date", value: "2025-12-31" },
    { icon: <Weight className="w-5 h-5" />, label: "Weight", value: shipment.weight },
    { icon: <Database className="w-5 h-5" />, label: "Volume", value: "500 m³" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Value", value: "$50,000" }
  ];

  return (
    <div className="container mx-auto p-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-2">
        <Package className="w-8 h-8" />
        Shipment Details
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="text-primary">{detail.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{detail.label}</p>
                <p className="font-semibold text-lg">{detail.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShipmentDetail;