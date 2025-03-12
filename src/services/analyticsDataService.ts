
// This file provides data for the analytics dashboard

// Real freight data from user's dataset
const freightData = [
  { country: 'Benin', kenAir: 0, dhlGlobal: 0, kuehneNagel: 1010, scanGlobal: 0, dhlExpress: 540, agl: 0, siginon: 0, freightInTime: 0, weight: 52.36, volume: 3.43 },
  { country: 'Burundi', kenAir: 0, dhlGlobal: 0, kuehneNagel: 16233, scanGlobal: 20409, dhlExpress: 4544, agl: 4246, siginon: 0, freightInTime: 21348, weight: 8368.99, volume: 39.5 },
  { country: 'Central African Republic', kenAir: 0, dhlGlobal: 0, kuehneNagel: 8345, scanGlobal: 7997, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 0, weight: 1666.00, volume: 6.41 },
  { country: 'Chad', kenAir: 0, dhlGlobal: 0, kuehneNagel: 750, scanGlobal: 4447, dhlExpress: 4739, agl: 0, siginon: 0, freightInTime: 15521, weight: 3111.02, volume: 12.55 },
  { country: 'Comoros', kenAir: 35596, dhlGlobal: 0, kuehneNagel: 31710, scanGlobal: 28285, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 53625, weight: 21326.31, volume: 97.47 },
  { country: 'Congo Brazzaville', kenAir: 0, dhlGlobal: 0, kuehneNagel: 573, scanGlobal: 586, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 633, weight: 178, volume: 0.23 },
  { country: 'Congo Kinshasa', kenAir: 0, dhlGlobal: 0, kuehneNagel: 1452, scanGlobal: 2324, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 2004, weight: 388, volume: 2.93 },
  { country: "Cote d'Ivoire", kenAir: 0, dhlGlobal: 0, kuehneNagel: 762, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 897, weight: 32, volume: 0.27 },
  { country: 'DR Congo', kenAir: 0, dhlGlobal: 0, kuehneNagel: 104937, scanGlobal: 11468, dhlExpress: 0, agl: 0, siginon: 10000, freightInTime: 94529, weight: 35199.89, volume: 193.63 },
  { country: 'Eritrea', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 0, weight: 21.76, volume: 0.21 },
  { country: 'Eswatini', kenAir: 0, dhlGlobal: 0, kuehneNagel: 5930, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 4019, weight: 316, volume: 5.85 },
  { country: 'Ethiopia', kenAir: 0, dhlGlobal: 0, kuehneNagel: 140187, scanGlobal: 184345, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 117679, weight: 62471.00, volume: 187.91 },
  { country: 'Ghana', kenAir: 0, dhlGlobal: 0, kuehneNagel: 541, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 0, weight: 48, volume: 0.4 },
  { country: 'Guinea', kenAir: 0, dhlGlobal: 0, kuehneNagel: 2383, scanGlobal: 9588, dhlExpress: 4157, agl: 0, siginon: 0, freightInTime: 2238, weight: 361, volume: 1.56 },
  { country: 'Guinea Bissau', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 942, agl: 0, siginon: 0, freightInTime: 0, weight: 88, volume: 0.58 },
  { country: 'Madagascar', kenAir: 49847, dhlGlobal: 0, kuehneNagel: 69835, scanGlobal: 53318, dhlExpress: 0, agl: 0, siginon: 3575, freightInTime: 76235, weight: 19211.92, volume: 79.53 },
  { country: 'Malawi', kenAir: 0, dhlGlobal: 0, kuehneNagel: 15559, scanGlobal: 13050, dhlExpress: 50, agl: 0, siginon: 8250, freightInTime: 0, weight: 9035.66, volume: 37.63 },
  { country: 'Mauritius', kenAir: 6349, dhlGlobal: 0, kuehneNagel: 7512, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 21734, weight: 6263.04, volume: 20.37 },
  { country: 'Mayotte', kenAir: 0, dhlGlobal: 0, kuehneNagel: 323, scanGlobal: 511, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 527, weight: 16.9, volume: 0.17 },
  { country: 'Nigeria', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 455, agl: 0, siginon: 0, freightInTime: 0, weight: 10, volume: 0.1 },
  { country: 'Rwanda', kenAir: 0, dhlGlobal: 0, kuehneNagel: 38467, scanGlobal: 6958, dhlExpress: 286, agl: 0, siginon: 0, freightInTime: 36879, weight: 11201.59, volume: 63.97 },
  { country: 'Sao Tome', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 577, agl: 0, siginon: 0, freightInTime: 0, weight: 31.72, volume: 0.35 },
  { country: 'Senegal Hub', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 1257, weight: 17.92, volume: 0.09 },
  { country: 'Sierra Leone', kenAir: 0, dhlGlobal: 0, kuehneNagel: 7350, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 7936, weight: 1965.54, volume: 9.81 },
  { country: 'South Sudan', kenAir: 308, dhlGlobal: 0, kuehneNagel: 5015, scanGlobal: 4579, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 14445, weight: 14097.86, volume: 61.14 },
  { country: 'Sudan', kenAir: 0, dhlGlobal: 0, kuehneNagel: 0, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 0, weight: 33.9, volume: 0.22 },
  { country: 'Tanzania', kenAir: 0, dhlGlobal: 0, kuehneNagel: 5470, scanGlobal: 0, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 0, weight: 2688.00, volume: 22.33 },
  { country: 'Togo', kenAir: 0, dhlGlobal: 0, kuehneNagel: 563, scanGlobal: 0, dhlExpress: 1775, agl: 0, siginon: 0, freightInTime: 682, weight: 21.66, volume: 0.2 },
  { country: 'Uganda', kenAir: 0, dhlGlobal: 0, kuehneNagel: 12703, scanGlobal: 0, dhlExpress: 881, agl: 0, siginon: 11020, freightInTime: 1618, weight: 7469.38, volume: 85.34 },
  { country: 'Zambia', kenAir: 119107, dhlGlobal: 0, kuehneNagel: 90715, scanGlobal: 28688, dhlExpress: 0, agl: 0, siginon: 0, freightInTime: 63470, weight: 34720.23, volume: 151.02 },
  { country: 'Zimbabwe', kenAir: 32194, dhlGlobal: 0, kuehneNagel: 44394, scanGlobal: 24505, dhlExpress: 0, agl: 12570, siginon: 0, freightInTime: 33284, weight: 31500.37, volume: 132.67 }
];

// Calculate aggregated data from the real dataset
export const getAggregatedAnalyticsData = () => {
  const totalCost = freightData.reduce((sum, row) => {
    return sum + row.kenAir + row.dhlGlobal + row.kuehneNagel + row.scanGlobal + 
           row.dhlExpress + row.agl + row.siginon + row.freightInTime;
  }, 0);
  
  const totalWeight = freightData.reduce((sum, row) => sum + row.weight, 0);
  const totalVolume = freightData.reduce((sum, row) => sum + row.volume, 0);
  
  // Count unique forwarders that have made at least one shipment
  const forwarders = [
    'Kenya Airways', 'DHL Global', 'Kuehne & Nagel', 'Scan Global', 
    'DHL Express', 'AGL', 'SIGINON', 'Freight in Time'
  ];
  
  const activeForwarders = forwarders.filter(forwarder => {
    const key = forwarderToKey(forwarder);
    return freightData.some(row => row[key] > 0);
  });
  
  // Calculate average transit days (using a reasonable estimate based on mode of transport)
  const avgTransitDays = 9.3; // Estimated average
  
  const avgCostPerKg = totalWeight > 0 ? totalCost / totalWeight : 0;
  
  return {
    totalCost,
    totalShipments: freightData.length,
    totalFreightForwarders: activeForwarders.length,
    totalCountries: freightData.length,
    totalWeight,
    totalVolume,
    avgTransportDays: avgTransitDays,
    avgCostPerKg,
    fleetEfficiency: 85 // Mock efficiency score
  };
};

// Helper function to convert forwarder name to data key
const forwarderToKey = (name) => {
  switch(name) {
    case 'Kenya Airways': return 'kenAir';
    case 'DHL Global': return 'dhlGlobal';
    case 'Kuehne & Nagel': return 'kuehneNagel';
    case 'Scan Global': return 'scanGlobal';
    case 'DHL Express': return 'dhlExpress';
    case 'AGL': return 'agl';
    case 'SIGINON': return 'siginon';
    case 'Freight in Time': return 'freightInTime';
    default: return '';
  }
};

// Calculate top carriers by total revenue
export const getTopCarriers = () => {
  const carrierTotals = [
    { name: 'Kuehne & Nagel', revenue: freightData.reduce((sum, row) => sum + row.kuehneNagel, 0) },
    { name: 'Freight in Time', revenue: freightData.reduce((sum, row) => sum + row.freightInTime, 0) },
    { name: 'Scan Global', revenue: freightData.reduce((sum, row) => sum + row.scanGlobal, 0) },
    { name: 'Kenya Airways', revenue: freightData.reduce((sum, row) => sum + row.kenAir, 0) },
    { name: 'DHL Express', revenue: freightData.reduce((sum, row) => sum + row.dhlExpress, 0) },
    { name: 'SIGINON', revenue: freightData.reduce((sum, row) => sum + row.siginon, 0) },
    { name: 'AGL', revenue: freightData.reduce((sum, row) => sum + row.agl, 0) },
    { name: 'DHL Global', revenue: freightData.reduce((sum, row) => sum + row.dhlGlobal, 0) }
  ];
  
  // Sort by revenue and remove carriers with zero revenue
  return carrierTotals
    .filter(carrier => carrier.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);
};

// Get top destinations by total shipment value
export const getTopDestinations = () => {
  const destinationData = freightData.map(row => {
    const totalValue = row.kenAir + row.dhlGlobal + row.kuehneNagel + row.scanGlobal + 
                       row.dhlExpress + row.agl + row.siginon + row.freightInTime;
    return {
      country: row.country,
      count: totalValue > 0 ? 1 : 0, // Count as a shipment if any value
      totalValue
    };
  });
  
  return destinationData
    .filter(dest => dest.totalValue > 0)
    .sort((a, b) => b.totalValue - a.totalValue);
};

// Get monthly trends (simulated based on the data)
export const getMonthlyTrends = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Generate simulated monthly distribution of the annual data
  return months.map((month, index) => {
    const multiplier = 0.7 + (Math.sin(index) + 1) * 0.15; // Create a sine wave pattern
    
    const totalCost = getAggregatedAnalyticsData().totalCost;
    const monthlyShare = totalCost * multiplier / months.length;
    
    return {
      month,
      value: Math.round(monthlyShare)
    };
  });
};

// Calculate country risk assessment data
export const getCountryRiskAssessment = () => {
  // Risk factors (1-10 scale) for each country, based on real-world considerations
  const riskFactors = {
    'DR Congo': 8.5,
    'South Sudan': 8.2,
    'Central African Republic': 7.8,
    'Ethiopia': 6.5,
    'Somalia': 9.0,
    'Zimbabwe': 6.8,
    'Sudan': 7.5,
    'Burundi': 7.2,
    'Chad': 7.6,
    'Eritrea': 7.7,
    'Uganda': 5.8,
    'Comoros': 5.3,
    'Rwanda': 4.9,
    'Malawi': 5.6,
    'Tanzania': 5.0,
    'Kenya': 5.2,
    'Zambia': 5.4,
    'Madagascar': 5.7,
    'Guinea': 6.3,
    'Sierra Leone': 6.5,
    'Nigeria': 6.7,
    'Togo': 5.9
  };
  
  // Default risk for countries not explicitly listed
  const DEFAULT_RISK = 5.0;
  
  // Create risk assessment data for countries in our freight data
  return freightData
    .filter(row => {
      // Only include countries with some shipment activity
      const totalValue = row.kenAir + row.dhlGlobal + row.kuehneNagel + row.scanGlobal + 
                         row.dhlExpress + row.agl + row.siginon + row.freightInTime;
      return totalValue > 0;
    })
    .map(row => {
      return {
        country: row.country,
        risk: riskFactors[row.country] || DEFAULT_RISK,
        weight: row.weight,
        volume: row.volume
      };
    })
    .sort((a, b) => b.risk - a.risk) // Sort by risk (highest first)
    .slice(0, 15); // Take top 15 riskiest countries
};
