
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
    fleetEfficiency: 85
  };
};

// Get top carriers
export const getTopCarriers = () => {
  return [
    { name: 'African Transit', revenue: 785000, shipmentCount: 120 },
    { name: 'EastWest Logistics', revenue: 624000, shipmentCount: 95 },
    { name: 'TransAfrica', revenue: 486000, shipmentCount: 76 },
    { name: 'Global Freight', revenue: 312000, shipmentCount: 58 },
    { name: 'SeaRoute', revenue: 138000, shipmentCount: 37 }
  ];
};

// Get top destinations
export const getTopDestinations = () => {
  return [
    { country: 'Tanzania', count: 86 },
    { country: 'Uganda', count: 64 },
    { country: 'Ethiopia', count: 58 },
    { country: 'Nigeria', count: 52 },
    { country: 'Ghana', count: 48 },
    { country: 'Cameroon', count: 42 },
    { country: 'Kenya', count: 36 }
  ];
};

// Get monthly trends
export const getMonthlyTrends = () => {
  return [
    { month: 'Jan', shipments: 28, revenue: 185000 },
    { month: 'Feb', shipments: 32, revenue: 210000 },
    { month: 'Mar', shipments: 45, revenue: 295000 },
    { month: 'Apr', shipments: 52, revenue: 340000 },
    { month: 'May', shipments: 48, revenue: 315000 },
    { month: 'Jun', shipments: 63, revenue: 410000 },
    { month: 'Jul', shipments: 68, revenue: 445000 },
    { month: 'Aug', shipments: 50, revenue: 330000 }
  ];
};

// Get country risk assessment
export const getCountryRiskAssessment = () => {
  return [
    { country: 'Tanzania', risk: 3.2 },
    { country: 'Uganda', risk: 4.5 },
    { country: 'Ethiopia', risk: 5.8 },
    { country: 'Nigeria', risk: 6.2 },
    { country: 'Ghana', risk: 3.8 },
    { country: 'Cameroon', risk: 5.1 },
    { country: 'Kenya', risk: 2.6 }
  ];
};

// Get carrier recommendations
export const getCarrierRecommendations = () => {
  return [
    { carrier: 'African Transit', reliability: 0.92, costEfficiency: 0.88 },
    { carrier: 'EastWest Logistics', reliability: 0.89, costEfficiency: 0.91 },
    { carrier: 'TransAfrica', reliability: 0.85, costEfficiency: 0.93 },
    { carrier: 'Global Freight', reliability: 0.90, costEfficiency: 0.84 },
    { carrier: 'SeaRoute', reliability: 0.82, costEfficiency: 0.95 }
  ];
};
