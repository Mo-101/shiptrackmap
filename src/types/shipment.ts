
export interface Shipment {
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
  stockRelease?: string;
  whoDescription?: string;
  expirationDate?: string;
  serialNumber?: string;
  warehouse?: string;
  // Additional fields for DeepCAL
  dateOfGreenlightToPickup?: string;
  dateOfCollection?: string;
  dateOfArrivalDestination?: string;
  freightAgent?: string;
  freightAgentCost?: number;
  initialQuoteAwarded?: number;
  finalQuoteAwarded?: number;
  deliveryStatus?: 'on-time' | 'delayed' | 'canceled';
  modeOfShipment?: string;
  reliabilityScore?: number;
  riskScore?: number;
  responsivenessFactor?: number;
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
