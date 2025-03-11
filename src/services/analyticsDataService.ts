
// Mock data for analytics services
import { Shipment } from '../types/shipment';

// Aggregate analytics data
export const getAggregatedAnalyticsData = () => {
  return {
    totalCost: 2345000,
    totalShipments: 386,
    totalFreightForwarders: 12,
    totalCountries: 8,
    totalWeight: 87500,
    totalVolume: 4200,
    avgTransportDays: 8.5,
    avgCostPerKg: 26.8,
    fleetEfficiency: 85,
    carbonEmissions: 156000, // in kg CO2
    riskScore: 5.2, // on scale of 1-10
    onTimeDeliveryRate: 92, // percentage
    emergencyReadiness: 85, // percentage
    consolidationRate: 65 // percentage
  };
};

// Get top carriers
export const getTopCarriers = () => {
  return [
    { name: 'Kuehne & Nagel', revenue: 785000, shipmentCount: 120, reliability: 0.92, costEfficiency: 0.85, marketShare: 38 },
    { name: 'Freight in Time', revenue: 624000, shipmentCount: 95, reliability: 0.90, costEfficiency: 0.88, marketShare: 27 },
    { name: 'Scan Global', revenue: 486000, shipmentCount: 76, reliability: 0.75, costEfficiency: 0.78, marketShare: 18 },
    { name: 'DHL Express', revenue: 312000, shipmentCount: 58, reliability: 0.95, costEfficiency: 0.65, marketShare: 12 },
    { name: 'AGL', revenue: 138000, shipmentCount: 22, reliability: 0.85, costEfficiency: 0.92, marketShare: 5 }
  ];
};

// Get top destinations
export const getTopDestinations = () => {
  return [
    { country: 'Zimbabwe', count: 86, risk: 6.8, dominantCarrier: 'Kuehne & Nagel' },
    { country: 'DR Congo', count: 64, risk: 7.5, dominantCarrier: 'Kuehne & Nagel' },
    { country: 'Ethiopia', count: 58, risk: 5.8, dominantCarrier: 'Scan Global' },
    { country: 'Rwanda', count: 52, risk: 4.2, dominantCarrier: 'Kuehne & Nagel' },
    { country: 'Malawi', count: 48, risk: 5.5, dominantCarrier: 'Kuehne & Nagel' },
    { country: 'Comoros', count: 42, risk: 4.8, dominantCarrier: 'Freight in Time' },
    { country: 'Kenya', count: 36, risk: 3.9, dominantCarrier: 'Freight in Time' }
  ];
};

// Get monthly trends
export const getMonthlyTrends = () => {
  return [
    { month: 'Jan', shipments: 28, revenue: 185000, airShipments: 25, seaShipments: 3, roadShipments: 0 },
    { month: 'Feb', shipments: 32, revenue: 210000, airShipments: 27, seaShipments: 3, roadShipments: 2 },
    { month: 'Mar', shipments: 45, revenue: 295000, airShipments: 38, seaShipments: 4, roadShipments: 3 },
    { month: 'Apr', shipments: 52, revenue: 340000, airShipments: 43, seaShipments: 5, roadShipments: 4 },
    { month: 'May', shipments: 48, revenue: 315000, airShipments: 40, seaShipments: 4, roadShipments: 4 },
    { month: 'Jun', shipments: 63, revenue: 410000, airShipments: 51, seaShipments: 7, roadShipments: 5 },
    { month: 'Jul', shipments: 68, revenue: 445000, airShipments: 54, seaShipments: 8, roadShipments: 6 },
    { month: 'Aug', shipments: 50, revenue: 330000, airShipments: 40, seaShipments: 6, roadShipments: 4 }
  ];
};

// Get country risk assessment
export const getCountryRiskAssessment = () => {
  return [
    { country: 'Zimbabwe', risk: 6.8, politicalStability: 4.2, logisticsEfficiency: 5.5, healthRisk: 7.6 },
    { country: 'DR Congo', risk: 7.5, politicalStability: 3.5, logisticsEfficiency: 4.2, healthRisk: 6.9 },
    { country: 'Ethiopia', risk: 5.8, politicalStability: 5.2, logisticsEfficiency: 5.7, healthRisk: 5.8 },
    { country: 'Rwanda', risk: 4.2, politicalStability: 6.5, logisticsEfficiency: 6.2, healthRisk: 4.5 },
    { country: 'Malawi', risk: 5.5, politicalStability: 5.8, logisticsEfficiency: 5.1, healthRisk: 6.5 },
    { country: 'Comoros', risk: 4.8, politicalStability: 5.5, logisticsEfficiency: 4.8, healthRisk: 5.2 },
    { country: 'Kenya', risk: 3.9, politicalStability: 6.2, logisticsEfficiency: 6.5, healthRisk: 4.8 }
  ];
};

// Get carrier recommendations
export const getCarrierRecommendations = () => {
  return [
    { carrier: 'Kuehne & Nagel', reliability: 0.92, costEfficiency: 0.85, carbonScore: 0.65, capacity: 48000 },
    { carrier: 'Freight in Time', reliability: 0.90, costEfficiency: 0.88, carbonScore: 0.72, capacity: 30000 },
    { carrier: 'Scan Global', reliability: 0.75, costEfficiency: 0.78, carbonScore: 0.68, capacity: 25000 },
    { carrier: 'DHL Express', reliability: 0.95, costEfficiency: 0.65, carbonScore: 0.55, capacity: 15000 },
    { carrier: 'AGL', reliability: 0.85, costEfficiency: 0.92, carbonScore: 0.88, capacity: 20000 }
  ];
};

// Get delivery time data
export const getDeliveryTimeData = () => {
  return [
    { name: 'Week 1', Air: 5.2, Sea: 14.1, Road: 9.3 },
    { name: 'Week 2', Air: 5.5, Sea: 13.8, Road: 9.1 },
    { name: 'Week 3', Air: 4.9, Sea: 13.5, Road: 8.8 },
    { name: 'Week 4', Air: 5.0, Sea: 14.0, Road: 9.0 },
    { name: 'Week 5', Air: 4.8, Sea: 13.7, Road: 8.9 }
  ];
};

// Get zero quote analysis
export const getZeroQuoteAnalysis = () => {
  return [
    { country: 'Zimbabwe', totalRequests: 20, zeroQuotes: 5, mainAvoider: 'DHL Express' },
    { country: 'Malawi', totalRequests: 15, zeroQuotes: 12, mainAvoider: 'Multiple' },
    { country: 'South Sudan', totalRequests: 10, zeroQuotes: 8, mainAvoider: 'Kuehne & Nagel' },
    { country: 'DR Congo', totalRequests: 25, zeroQuotes: 6, mainAvoider: 'AGL' },
    { country: 'Ethiopia', totalRequests: 18, zeroQuotes: 4, mainAvoider: 'Kuehne & Nagel' },
    { country: 'Comoros', totalRequests: 12, zeroQuotes: 7, mainAvoider: 'Scan Global' }
  ];
};

// Get carrier cost analysis by country
export const getCarrierCostByCountry = () => {
  return [
    { country: 'Zimbabwe', knCost: 2.54, fitCost: 2.35, dhlCost: 4.80, aglCost: 1.89 },
    { country: 'DR Congo', knCost: 2.65, fitCost: 2.40, dhlCost: 5.10, aglCost: 0 },
    { country: 'Ethiopia', knCost: 0, fitCost: 2.25, dhlCost: 4.60, aglCost: 0 },
    { country: 'Rwanda', knCost: 2.45, fitCost: 2.20, dhlCost: 4.75, aglCost: 0 },
    { country: 'Malawi', knCost: 2.75, fitCost: 0, dhlCost: 0, aglCost: 0 },
    { country: 'Comoros', knCost: 2.80, fitCost: 2.50, dhlCost: 0, aglCost: 0 },
  ];
};
