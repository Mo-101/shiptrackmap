
export interface Shipment {
  request_reference: string;
  'carrier+cost': number | string;
  weight_kg: number | string;
  volume_cbm: number | string;
  destination_country?: string;
  delivery_status?: string;
  date_of_collection?: string;
  date_of_arrival_destination?: string;
  carrier?: string;
  kuehne_nagel?: number | string;
  scan_global_logistics?: number | string;
  dhl_express?: number | string;
  dhl_global?: number | string;
  bwosi?: number | string;
  agl?: number | string;
  siginon?: number | string;
  frieght_in_time?: number | string;

  id: string;
  name: string;
  type: 'ship' | 'charter' | 'truck';
  origin: {
    name: string;
    coordinates: [number, number];
  };
  destination: {
    name: string;
    coordinates: [number, number];
    country: string;
  };
  status: 'in-transit' | 'delivered' | 'delayed';
  eta: string;
  consigneeAddress: string;
  ops: string;
  itemCategory: string;
  itemDescription: string;
  weight: string;
  volume?: string;
  value?: string;
  
  // DeepCAL fields from the documentation
  stockRelease?: string;                // Request reference (Shipment Number/ID)
  whoDescription?: string;              // WHO specific description
  expirationDate?: string;              // Expiration date if applicable
  serialNumber?: string;                // Serial number for tracking
  warehouse?: string;                   // Origin warehouse
  dateOfGreenlightToPickup?: string;    // Date when FF was given greenlight to pick up
  dateOfCollection?: string;            // Date when FF picked up cargo
  dateOfArrivalDestination?: string;    // Date when cargo arrived at destination
  
  // Freight agent information
  freightAgent?: string;                // Name of freight forwarder
  freightAgentCost?: number;            // Cost of freight agent
  initialQuoteAwarded?: number;         // Initial quote from freight forwarder
  finalQuoteAwarded?: number;           // Final quote from freight forwarder that was awarded
  
  // Delivery information
  deliveryStatus?: 'on-time' | 'delayed' | 'canceled';
  modeOfShipment?: string;              // Air, Road, Sea
  
  // Performance metrics
  reliabilityScore?: number;            // Reliability score for the shipment
  riskScore?: number;                   // Risk assessment score
  responsivenessFactor?: number;        // Responsiveness of the freight forwarder
  
  // Carrier information
  // carrier?: string;                     // Carrier used by the freight forwarder
  carrierCost?: number;                 // Cost charged by the carrier
  
  // Additional fields
  comments?: string;                    // Comments on overall shipment
}

// DeepCAL related types
export interface NeutrosophicNumber {
  truth: number;
  indeterminacy: number; 
  falsity: number;
}

export interface DeepCALResult {
  recommendedForwarder: string;
  rankingScores: Record<string, number>;
  neutrosophicMatrix: NeutrosophicNumber[][];
  confidenceScore: number;
  resilience: number;
  explanation: string;
  alternativeOptions: Array<{
    forwarder: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
}

export interface ShipmentAnalytics {
  performanceMetrics: {
    onTimeDelivery: number;
    costVariance: number;
    responseTime: number;
  };
  historicalTrends: {
    timeToDelivery: number[];
    costPerKg: number[];
    reliabilityScores: number[];
  };
  neutrosophicScores: {
    truth: number;
    indeterminacy: number;
    falsity: number;
  };
}
