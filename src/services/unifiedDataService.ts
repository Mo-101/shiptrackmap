
import { DeepCALInput, DeepCALOutput, ForwarderPerformance } from '../types/deepCAL';
import { FreightRow, FreightAnalytics } from '../types/freightData';
import { processDeepCAL } from './deepCALService';
import { 
  getAggregatedAnalyticsData, 
  getTopCarriers, 
  getTopDestinations, 
  getMonthlyTrends,
  getCountryRiskAssessment,
  freightData
} from './analyticsDataService';
import { Shipment } from '../types/shipment';

// Export the raw freight data from analytics service to make it accessible
export { freightData };

/**
 * Central data interface that combines all data needed by the application
 */
export interface UnifiedDataState {
  // Analytics data
  aggregatedData: ReturnType<typeof getAggregatedAnalyticsData>;
  topCarriers: ReturnType<typeof getTopCarriers>;
  topDestinations: ReturnType<typeof getTopDestinations>;
  monthlyTrends: ReturnType<typeof getMonthlyTrends>;
  countryRiskAssessment: ReturnType<typeof getCountryRiskAssessment>;
  
  // DeepCAL data
  deepCALOutput?: DeepCALOutput;
  
  // Derived metrics
  forwarderEfficiencyScores: Record<string, number>;
  routePerformanceData: Array<{
    route: string;
    deliveryTime: number;
    cost: number;
    reliability: number;
  }>;
  shipmentsByStatus: Record<string, number>;
  
  // Loading state
  isLoading: boolean;
}

/**
 * Convert freightData rows to shipment objects
 */
export const convertFreightToShipments = (): Shipment[] => {
  return freightData.map((freight, index) => {
    // Calculate dominant forwarder
    const forwarders = [
      { name: 'Kenya Airways', value: freight.kenAir },
      { name: 'DHL Global', value: freight.dhlGlobal },
      { name: 'Kuehne & Nagel', value: freight.kuehneNagel },
      { name: 'Scan Global', value: freight.scanGlobal },
      { name: 'DHL Express', value: freight.dhlExpress },
      { name: 'AGL', value: freight.agl },
      { name: 'SIGINON', value: freight.siginon },
      { name: 'Freight in Time', value: freight.freightInTime }
    ];
    
    const dominantForwarder = forwarders
      .filter(f => f.value > 0)
      .sort((a, b) => b.value - a.value)[0]?.name || 'Unknown';
    
    // Randomly generate coordinates based on country name (in a real app, these would come from geocoding API)
    const getCoordinates = (country: string): [number, number] => {
      // Seed a random number based on country name
      const seed = country.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const random = () => ((seed * (1 + index)) % 1000) / 1000;
      
      // Generate coordinates in Africa region roughly
      return [
        10 + random() * 30, // longitude between 10 and 40
        -15 + random() * 35 // latitude between -15 and 20
      ];
    };
    
    // Generate random status
    const statuses: Array<'in-transit' | 'delivered' | 'delayed'> = ['in-transit', 'delivered', 'delayed'];
    const randomStatus = statuses[Math.floor((index * 13) % 3)];
    
    const originCoords: [number, number] = [36.8219, -1.2921]; // Default to Nairobi
    const destCoords = getCoordinates(freight.country);
    
    return {
      id: `shipment-${index + 1}`,
      name: `Shipment to ${freight.country}`,
      type: (index % 3 === 0) ? 'ship' : (index % 3 === 1) ? 'charter' : 'truck',
      origin: {
        name: 'Nairobi',
        coordinates: originCoords,
      },
      destination: {
        name: freight.country,
        coordinates: destCoords,
        country: freight.country
      },
      status: randomStatus,
      eta: new Date(Date.now() + (Math.random() * 15 * 24 * 60 * 60 * 1000)).toISOString(),
      consigneeAddress: `Main Street, ${freight.country}`,
      ops: 'Standard',
      itemCategory: 'Medical Supplies',
      itemDescription: 'Critical medical equipment and supplies',
      weight: `${Math.round(freight.weight)} kg`,
      volume: `${freight.volume.toFixed(2)} m³`,
      freightAgent: dominantForwarder,
      freightAgentCost: Math.round(forwarders.reduce((sum, f) => sum + (typeof f.value === 'number' ? f.value : 0), 0)),
      modeOfShipment: index % 3 === 0 ? 'Air' : index % 3 === 1 ? 'Sea' : 'Road',
      reliabilityScore: Math.round(70 + Math.random() * 30),
      riskScore: Math.round(Math.random() * 10)
    };
  });
};

/**
 * Calculate forwarder efficiency scores based on cost and delivery metrics
 */
export const calculateForwarderEfficiency = (): Record<string, number> => {
  const forwarders = [
    'Kenya Airways', 'DHL Global', 'Kuehne & Nagel', 'Scan Global', 
    'DHL Express', 'AGL', 'SIGINON', 'Freight in Time'
  ];
  
  const efficiencyScores: Record<string, number> = {};
  
  forwarders.forEach(forwarder => {
    // Base score between 70-95%
    const baseScore = 70 + Math.random() * 25;
    
    // Adjust based on data from freightData
    let totalValue = 0;
    let totalWeight = 0;
    
    freightData.forEach(row => {
      const key = forwarderToKey(forwarder);
      if (key && row[key] > 0) {
        totalValue += row[key] as number;
        totalWeight += row.weight;
      }
    });
    
    // Calculate cost per kg if available
    const costPerKg = totalWeight > 0 ? totalValue / totalWeight : 0;
    
    // Adjust score based on cost efficiency
    let adjustedScore = baseScore;
    if (costPerKg > 0) {
      // Lower cost per kg is better
      adjustedScore += (5 - Math.min(costPerKg, 5)) * 2; 
    }
    
    // Cap at 100
    efficiencyScores[forwarder] = Math.min(Math.round(adjustedScore), 100);
  });
  
  return efficiencyScores;
};

/**
 * Calculate route performance data
 */
export const calculateRoutePerformance = (): Array<{
  route: string;
  deliveryTime: number;
  cost: number;
  reliability: number;
}> => {
  return freightData.map(row => {
    // Calculate total value for this route
    const totalValue = row.kenAir + row.dhlGlobal + row.kuehneNagel + 
                       row.scanGlobal + row.dhlExpress + row.agl + 
                       row.siginon + row.freightInTime;
    
    // Generate delivery time based on weight and volume
    const deliveryTime = 5 + (row.weight / 1000) + (row.volume * 2);
    
    // Calculate reliability based on country risk (higher risk = lower reliability)
    const countryRisk = getCountryRiskAssessment()
      .find(risk => risk.country === row.country)?.risk || 5;
    
    const reliability = Math.max(0, Math.min(100, 100 - (countryRisk * 10)));
    
    return {
      route: `Nairobi → ${row.country}`,
      deliveryTime: Math.round(deliveryTime * 10) / 10, // Round to 1 decimal place
      cost: totalValue > 0 ? totalValue / row.weight : 0, // Cost per kg if available
      reliability
    };
  });
};

/**
 * Calculate shipments by status
 */
export const calculateShipmentsByStatus = (): Record<string, number> => {
  const shipments = convertFreightToShipments();
  const statusCounts: Record<string, number> = {
    'in-transit': 0,
    'delivered': 0,
    'delayed': 0
  };
  
  shipments.forEach(shipment => {
    statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
  });
  
  return statusCounts;
};

/**
 * Generate a DeepCAL input from a shipment
 */
export const generateDeepCALInput = (shipment: Shipment): DeepCALInput => {
  return {
    shipmentData: {
      itemDescription: shipment.itemDescription,
      itemCategory: shipment.itemCategory,
      weight: parseFloat(shipment.weight.replace(' kg', '')),
      volume: shipment.volume ? parseFloat(shipment.volume.replace(' m³', '')) : 1,
      origin: shipment.origin.name,
      destination: shipment.destination.name,
      urgency: 'normal', // Default to normal
      perishable: false,
      value: 5000, // Default value
    },
    preferences: {
      costImportance: 0.3,
      timeImportance: 0.25,
      reliabilityImportance: 0.2,
      riskImportance: 0.15,
      responsivenessImportance: 0.1
    },
    context: {
      previousShipments: 10,
      seasonalFactors: [],
      regionalDisruptions: [],
      specialRequirements: []
    }
  };
};

/**
 * Get a unified data state that combines all data sources
 */
export const getUnifiedDataState = (): UnifiedDataState => {
  // Get base analytics data
  const aggregatedData = getAggregatedAnalyticsData();
  const topCarriers = getTopCarriers();
  const topDestinations = getTopDestinations();
  const monthlyTrends = getMonthlyTrends();
  const countryRiskAssessment = getCountryRiskAssessment();
  
  // Calculate derived metrics
  const forwarderEfficiencyScores = calculateForwarderEfficiency();
  const routePerformanceData = calculateRoutePerformance();
  const shipmentsByStatus = calculateShipmentsByStatus();
  
  // Create a sample shipment for DeepCAL
  const sampleShipment = convertFreightToShipments()[0];
  const deepCALInput = generateDeepCALInput(sampleShipment);
  const deepCALOutput = processDeepCAL(deepCALInput);
  
  return {
    aggregatedData,
    topCarriers,
    topDestinations,
    monthlyTrends,
    countryRiskAssessment,
    deepCALOutput,
    forwarderEfficiencyScores,
    routePerformanceData,
    shipmentsByStatus,
    isLoading: false
  };
};

/**
 * Helper function to convert forwarder name to data key
 */
const forwarderToKey = (name: string): keyof typeof freightData[0] | null => {
  switch(name) {
    case 'Kenya Airways': return 'kenAir';
    case 'DHL Global': return 'dhlGlobal';
    case 'Kuehne & Nagel': return 'kuehneNagel';
    case 'Scan Global': return 'scanGlobal';
    case 'DHL Express': return 'dhlExpress';
    case 'AGL': return 'agl';
    case 'SIGINON': return 'siginon';
    case 'Freight in Time': return 'freightInTime';
    default: return null;
  }
};

// Export a single global instance that can be used throughout the app
export const unifiedDataState = getUnifiedDataState();

