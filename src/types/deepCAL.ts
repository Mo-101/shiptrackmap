
export interface DeepCALInput {
  shipmentData: {
    itemDescription: string;
    itemCategory: string;
    weight: number;
    volume: number;
    origin: string;
    destination: string;
    urgency: 'normal' | 'high' | 'critical';
    perishable: boolean;
    value: number;
  };
  preferences: {
    costImportance: number;
    timeImportance: number;
    reliabilityImportance: number;
    riskImportance: number;
    responsivenessImportance: number;
  };
  context: {
    previousShipments?: number;
    seasonalFactors?: string[];
    regionalDisruptions?: string[];
    specialRequirements?: string[];
  };
}

export interface ForwarderPerformance {
  forwarderName: string;
  costMetric: NeutrosophicMetric;
  timeMetric: NeutrosophicMetric;
  reliabilityMetric: NeutrosophicMetric;
  riskMetric: NeutrosophicMetric;
  responsivenessMetric: NeutrosophicMetric;
  historicalData: {
    shipmentCount: number;
    averageDelay: number;
    costVariance: number;
    failureRate: number;
  };
}

export interface NeutrosophicMetric {
  truth: number; // degree of truth (0-1)
  indeterminacy: number; // degree of indeterminacy (0-1)
  falsity: number; // degree of falsity (0-1)
}

export interface DeepCALOutput {
  recommendedForwarder: string;
  rankingScores: Record<string, number>;
  neutrosophicMatrix: NeutrosophicMetric[][];
  confidenceScore: number;
  resilience: number;
  explanation: string;
  alternativeOptions: Array<{
    forwarder: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  bayesianConfidence: {
    probability: number;
    credibleInterval: [number, number];
  };
  // Symbolic engine required fields
  decisionMatrix: number[][];
  criteriaWeights: number[];
  criteriaTypes: string[];
  alternatives: string[];
  forwarders: ForwarderPerformance[];
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

export interface DeepCALFeedback {
  shipmentId: string;
  predictedForwarder: string;
  actualOutcome: {
    deliveryOnTime: boolean;
    actualCost: number;
    qualityIssues: string[];
    customerSatisfaction: number;
  };
  expertFeedback?: {
    override: boolean;
    reason: string;
    suggestedForwarder: string;
  };
}
