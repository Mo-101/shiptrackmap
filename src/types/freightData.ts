
export interface FreightRow {
  id: number;
  date?: string;
  reference: string;
  description: string;
  destination: string;
  kenyaAirways: number;
  kuehneNagel: number;
  scanGlobal: number;
  dhlExpress: number;
  dhlGlobal: number;
  bwosi: number;
  agl: number;
  siginon: number;
  freightInTime: number;
  weight: number;
  volume: number;
  awardedTo: string;
  arrivalDate?: string;
  shippingMode: string;
}

export interface FreightAnalytics {
  totalShipments: number;
  totalWeight: number;
  totalVolume: number;
  
  // Average rates per kg for each freight forwarder
  ratePerKg: {
    [key: string]: number;
  };
  
  // Average rates per country for each freight forwarder
  ratePerCountry: {
    [country: string]: {
      [forwarder: string]: number;
    }
  };
  
  // Total shipments per freight forwarder
  shipmentsPerForwarder: {
    [key: string]: number;
  };
  
  // Most favorable freight forwarders based on price and availability
  favorableFreight: {
    name: string;
    score: number;
    averagePrice: number;
    availability: number;
  }[];
  
  // Shipments by destination country
  shipmentsByCountry: {
    [country: string]: number;
  };
}
