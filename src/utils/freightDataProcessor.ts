import { FreightRow, FreightAnalytics } from '@/types/freightData';

// Sample freight data as provided
export const freightData: FreightRow[] = [
  {
    id: 1,
    reference: 'SR_24-001_NBO hub_Zimbabwe',
    description: 'Cholera kits and Tents',
    destination: 'Zimbabwe',
    kenyaAirways: 18681,
    kuehneNagel: 18681,
    scanGlobal: 0,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 0,
    weight: 7352.98,
    volume: 24.68,
    awardedTo: 'Kenya Airways Via Kuehne Nagel',
    arrivalDate: '1/17/24 8:00 AM',
    shippingMode: 'Air'
  },
  {
    id: 2,
    reference: 'SR_24-002_NBO hub_Zambia (SR_23-144)',
    description: 'Cholera kits,ORS,Body bags,Masks and Glucometers',
    destination: 'Zambia',
    kenyaAirways: 35000,
    kuehneNagel: 59500,
    scanGlobal: 0,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 29972,
    weight: 14397.00,
    volume: 50.88,
    awardedTo: 'Kenya Airways Via Kuehne Nagel',
    arrivalDate: '1/12/24 7:00 AM',
    shippingMode: 'Air'
  },
  {
    id: 3,
    reference: 'SR_24-004_NBO hub_Zambia',
    description: 'Tents, Gloves,PPEs and Drugs',
    destination: 'Zambia',
    kenyaAirways: 56800,
    kuehneNagel: 0,
    scanGlobal: 0,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 0,
    weight: 10168.00,
    volume: 59.02,
    awardedTo: 'KQ:Direct charter SR 004,005A ,005 shipped together',
    arrivalDate: '2/6/24 12:00 PM',
    shippingMode: 'Air'
  },
  // Add more records as needed...
  {
    id: 21,
    reference: 'SR_24-029_NBO hub_Madagascar',
    description: 'IEHK Kits,Kit PED-SAM,Cholera kits and Tents',
    destination: 'Madagascar',
    kenyaAirways: 46250,
    kuehneNagel: 50943,
    scanGlobal: 41185,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 74431,
    weight: 14250.50,
    volume: 54.18,
    awardedTo: 'Scan Global',
    arrivalDate: '5/14/24 9:00 AM',
    shippingMode: 'Air'
  },
  {
    id: 36,
    reference: 'SR_24-048_NBO hub_Ethiopia',
    description: 'Cholera kits,ORS and Ringer Lactate',
    destination: 'Ethiopia',
    kenyaAirways: 0,
    kuehneNagel: 98758,
    scanGlobal: 140909,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 105531,
    weight: 48092.00,
    volume: 134.06,
    awardedTo: 'Freight In Time',
    arrivalDate: '8/15/24 7:00 AM',
    shippingMode: 'Air'
  },
  {
    id: 46,
    reference: 'SR_24-086_NBO hub_Comoros',
    description: 'Tents and Cholera kits',
    destination: 'Comoros',
    kenyaAirways: 0,
    kuehneNagel: 29032,
    scanGlobal: 26627,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 26107,
    weight: 10202.00,
    volume: 44.13,
    awardedTo: 'Freight in time',
    arrivalDate: '10/12/24 7:00 AM',
    shippingMode: 'Air'
  },
  // More representative data samples
  {
    id: 71,
    reference: 'SR_24-092_NBO hub_Ethiopia',
    description: 'Cholera,IEHK,PEDSAM and TESK kits',
    destination: 'Ethiopia',
    kenyaAirways: 0,
    kuehneNagel: 25898,
    scanGlobal: 27461,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 0,
    freightInTime: 0,
    weight: 10209.00,
    volume: 28.80,
    awardedTo: 'Scan Global',
    arrivalDate: '12/03/2024 10.00: AM',
    shippingMode: 'Air'
  },
  {
    id: 76,
    reference: 'SR_24-137_NBO hub_Malawi',
    description: 'TESK Kits',
    destination: 'Malawi',
    kenyaAirways: 0,
    kuehneNagel: 13670,
    scanGlobal: 13050,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 8250,
    freightInTime: 0,
    weight: 8646.00,
    volume: 35.60,
    awardedTo: 'Siginon',
    arrivalDate: '12/31/2024 8.30: AM',
    shippingMode: 'Road'
  },
  {
    id: 92,
    reference: 'SR_25-019_NBO hub_Uganda',
    description: 'EVD Kits',
    destination: 'Uganda',
    kenyaAirways: 0,
    kuehneNagel: 2204,
    scanGlobal: 0,
    dhlExpress: 0,
    dhlGlobal: 0,
    bwosi: 0,
    agl: 0,
    siginon: 2204,
    freightInTime: 0,
    weight: 1422.96,
    volume: 16.48,
    awardedTo: 'Siginon Limited',
    arrivalDate: '02/03/2025 6.30: AM',
    shippingMode: 'Air'
  }
];

// Process the raw freight data into analytics
export function processFreightData(data: FreightRow[]): FreightAnalytics {
  const analytics: FreightAnalytics = {
    totalShipments: data.length,
    totalWeight: 0,
    totalVolume: 0,
    ratePerKg: {},
    ratePerCountry: {},
    shipmentsPerForwarder: {
      'Kenya Airways': 0,
      'Kuehne and Nagel': 0,
      'Scan Global': 0,
      'DHL Express': 0,
      'DHL Global': 0,
      'Bwosi': 0,
      'AGL': 0,
      'Siginon': 0,
      'Freight In Time': 0,
    },
    favorableFreight: [],
    shipmentsByCountry: {},
  };

  // Forwarder rate sums for average calculation
  const rateSums: { [key: string]: { total: number, count: number } } = {
    'Kenya Airways': { total: 0, count: 0 },
    'Kuehne and Nagel': { total: 0, count: 0 },
    'Scan Global': { total: 0, count: 0 },
    'DHL Express': { total: 0, count: 0 },
    'DHL Global': { total: 0, count: 0 },
    'Bwosi': { total: 0, count: 0 },
    'AGL': { total: 0, count: 0 },
    'Siginon': { total: 0, count: 0 },
    'Freight In Time': { total: 0, count: 0 },
  };

  // Country forwarder rate sums
  const countryRates: { [country: string]: { [forwarder: string]: { total: number, count: number } } } = {};

  // Process each shipment
  data.forEach(shipment => {
    // Add to totals
    analytics.totalWeight += shipment.weight;
    analytics.totalVolume += shipment.volume;

    // Count by awarded forwarder
    if (shipment.awardedTo.includes('Kenya Airways')) analytics.shipmentsPerForwarder['Kenya Airways']++;
    if (shipment.awardedTo.includes('Kuehne Nagel') || shipment.awardedTo.includes('Kuehne and Nagel')) analytics.shipmentsPerForwarder['Kuehne and Nagel']++;
    if (shipment.awardedTo.includes('Scan Global')) analytics.shipmentsPerForwarder['Scan Global']++;
    if (shipment.awardedTo.includes('DHL Express')) analytics.shipmentsPerForwarder['DHL Express']++;
    if (shipment.awardedTo.includes('DHL Global')) analytics.shipmentsPerForwarder['DHL Global']++;
    if (shipment.awardedTo.includes('Bwosi')) analytics.shipmentsPerForwarder['Bwosi']++;
    if (shipment.awardedTo.includes('AGL')) analytics.shipmentsPerForwarder['AGL']++;
    if (shipment.awardedTo.includes('Siginon')) analytics.shipmentsPerForwarder['Siginon']++;
    if (shipment.awardedTo.includes('Freight In Time') || shipment.awardedTo.includes('Freight in Time')) analytics.shipmentsPerForwarder['Freight In Time']++;

    // Count shipments by country
    if (!analytics.shipmentsByCountry[shipment.destination]) {
      analytics.shipmentsByCountry[shipment.destination] = 0;
    }
    analytics.shipmentsByCountry[shipment.destination]++;

    // Calculate rates per kg for different forwarders
    if (shipment.weight > 0) {
      // Process each forwarder's rate
      if (shipment.kenyaAirways > 0) {
        const rate = shipment.kenyaAirways / shipment.weight;
        rateSums['Kenya Airways'].total += rate;
        rateSums['Kenya Airways'].count++;

        // Add to country-specific rates
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['Kenya Airways']) {
          countryRates[shipment.destination]['Kenya Airways'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['Kenya Airways'].total += rate;
        countryRates[shipment.destination]['Kenya Airways'].count++;
      }

      // Apply the same logic for other forwarders
      if (shipment.kuehneNagel > 0) {
        const rate = shipment.kuehneNagel / shipment.weight;
        rateSums['Kuehne and Nagel'].total += rate;
        rateSums['Kuehne and Nagel'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['Kuehne and Nagel']) {
          countryRates[shipment.destination]['Kuehne and Nagel'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['Kuehne and Nagel'].total += rate;
        countryRates[shipment.destination]['Kuehne and Nagel'].count++;
      }

      // Scan Global
      if (shipment.scanGlobal > 0) {
        const rate = shipment.scanGlobal / shipment.weight;
        rateSums['Scan Global'].total += rate;
        rateSums['Scan Global'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['Scan Global']) {
          countryRates[shipment.destination]['Scan Global'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['Scan Global'].total += rate;
        countryRates[shipment.destination]['Scan Global'].count++;
      }

      // DHL Express
      if (shipment.dhlExpress > 0) {
        const rate = shipment.dhlExpress / shipment.weight;
        rateSums['DHL Express'].total += rate;
        rateSums['DHL Express'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['DHL Express']) {
          countryRates[shipment.destination]['DHL Express'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['DHL Express'].total += rate;
        countryRates[shipment.destination]['DHL Express'].count++;
      }

      // Freight In Time
      if (shipment.freightInTime > 0) {
        const rate = shipment.freightInTime / shipment.weight;
        rateSums['Freight In Time'].total += rate;
        rateSums['Freight In Time'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['Freight In Time']) {
          countryRates[shipment.destination]['Freight In Time'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['Freight In Time'].total += rate;
        countryRates[shipment.destination]['Freight In Time'].count++;
      }

      // Other forwarders follow the same pattern...
      // AGL
      if (shipment.agl > 0) {
        const rate = shipment.agl / shipment.weight;
        rateSums['AGL'].total += rate;
        rateSums['AGL'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['AGL']) {
          countryRates[shipment.destination]['AGL'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['AGL'].total += rate;
        countryRates[shipment.destination]['AGL'].count++;
      }

      // Siginon
      if (shipment.siginon > 0) {
        const rate = shipment.siginon / shipment.weight;
        rateSums['Siginon'].total += rate;
        rateSums['Siginon'].count++;
        
        if (!countryRates[shipment.destination]) {
          countryRates[shipment.destination] = {};
        }
        if (!countryRates[shipment.destination]['Siginon']) {
          countryRates[shipment.destination]['Siginon'] = { total: 0, count: 0 };
        }
        countryRates[shipment.destination]['Siginon'].total += rate;
        countryRates[shipment.destination]['Siginon'].count++;
      }
    }
  });

  // Calculate average rate per kg for each forwarder
  for (const [forwarder, sums] of Object.entries(rateSums)) {
    if (sums.count > 0) {
      analytics.ratePerKg[forwarder] = parseFloat((sums.total / sums.count).toFixed(2));
    } else {
      analytics.ratePerKg[forwarder] = 0;
    }
  }

  // Calculate average rate per country for each forwarder
  analytics.ratePerCountry = {};
  for (const [country, forwarders] of Object.entries(countryRates)) {
    analytics.ratePerCountry[country] = {};
    for (const [forwarder, sums] of Object.entries(forwarders)) {
      if (sums.count > 0) {
        analytics.ratePerCountry[country][forwarder] = parseFloat((sums.total / sums.count).toFixed(2));
      }
    }
  }

  // Calculate favorable freight based on price and availability
  // Lower score is better (normalized price * 0.7 + normalized availability * 0.3)
  const forwarders = Object.keys(analytics.shipmentsPerForwarder);
  const availabilityScores: { [key: string]: number } = {};
  const priceScores: { [key: string]: number } = {};
  
  // Get max values for normalization
  const maxShipments = Math.max(...Object.values(analytics.shipmentsPerForwarder));
  const maxRate = Math.max(...Object.values(analytics.ratePerKg).filter(rate => rate > 0));
  
  // Calculate normalized scores
  forwarders.forEach(forwarder => {
    // Availability score (higher is better)
    const availability = analytics.shipmentsPerForwarder[forwarder] / maxShipments;
    availabilityScores[forwarder] = availability;
    
    // Price score (lower is better)
    const price = analytics.ratePerKg[forwarder] / maxRate;
    priceScores[forwarder] = analytics.ratePerKg[forwarder] > 0 ? price : 1; // If no price data, assume worst
  });
  
  // Calculate final scores (lower is better)
  forwarders.forEach(forwarder => {
    if (analytics.shipmentsPerForwarder[forwarder] > 0) {
      analytics.favorableFreight.push({
        name: forwarder,
        score: (priceScores[forwarder] * 0.7) - (availabilityScores[forwarder] * 0.3),
        averagePrice: analytics.ratePerKg[forwarder],
        availability: analytics.shipmentsPerForwarder[forwarder]
      });
    }
  });
  
  // Sort by score (lower is better)
  analytics.favorableFreight.sort((a, b) => a.score - b.score);
  
  return analytics;
}

export const freightAnalytics = processFreightData(freightData);
