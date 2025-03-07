
import { Shipment } from '../types/shipment';

// African capital and port coordinates for realistic shipment routes
const AFRICAN_LOCATIONS = {
  // East Africa
  nairobi: { name: 'Nairobi, Kenya', coordinates: [36.8219, -1.2921] },
  mombasa: { name: 'Mombasa, Kenya', coordinates: [39.6682, -4.0435] },
  daressalaam: { name: 'Dar es Salaam, Tanzania', coordinates: [39.2083, -6.7924] },
  kampala: { name: 'Kampala, Uganda', coordinates: [32.5899, 0.3476] },
  addisababa: { name: 'Addis Ababa, Ethiopia', coordinates: [38.7578, 9.0222] },
  khartoum: { name: 'Khartoum, Sudan', coordinates: [32.5599, 15.5007] },
  
  // West Africa
  dakar: { name: 'Dakar, Senegal', coordinates: [-17.4666, 14.7167] },
  lagos: { name: 'Lagos, Nigeria', coordinates: [3.3792, 6.5244] },
  accra: { name: 'Accra, Ghana', coordinates: [-0.1869, 5.6037] },
  abidjan: { name: 'Abidjan, Côte d\'Ivoire', coordinates: [-4.0082, 5.3598] },
  ouagadougou: { name: 'Ouagadougou, Burkina Faso', coordinates: [-1.5197, 12.3724] },
  
  // North Africa
  cairo: { name: 'Cairo, Egypt', coordinates: [31.2357, 30.0444] },
  tripoli: { name: 'Tripoli, Libya', coordinates: [13.1913, 32.8872] },
  algiers: { name: 'Algiers, Algeria', coordinates: [3.0588, 36.7538] },
  casablanca: { name: 'Casablanca, Morocco', coordinates: [-7.5898, 33.5731] },
  tunis: { name: 'Tunis, Tunisia', coordinates: [10.1815, 36.8065] },
  
  // Southern Africa
  johannesburg: { name: 'Johannesburg, South Africa', coordinates: [28.0473, -26.2041] },
  capetown: { name: 'Cape Town, South Africa', coordinates: [18.4241, -33.9249] },
  durban: { name: 'Durban, South Africa', coordinates: [31.0218, -29.8587] },
  gaborone: { name: 'Gaborone, Botswana', coordinates: [25.9231, -24.6282] },
  luanda: { name: 'Luanda, Angola', coordinates: [13.2343, -8.8147] },
  
  // Central Africa
  kinshasa: { name: 'Kinshasa, DRC', coordinates: [15.2663, -4.4419] },
  brazzaville: { name: 'Brazzaville, Congo', coordinates: [15.2832, -4.2634] },
  libreville: { name: 'Libreville, Gabon', coordinates: [9.4672, 0.4162] },
  douala: { name: 'Douala, Cameroon', coordinates: [9.7068, 4.0511] },
  yaounde: { name: 'Yaoundé, Cameroon', coordinates: [11.5021, 3.8480] },
  
  // Island Nations
  antananarivo: { name: 'Antananarivo, Madagascar', coordinates: [47.5079, -18.8792] },
  portlouis: { name: 'Port Louis, Mauritius', coordinates: [57.5022, -20.1609] },
  moroni: { name: 'Moroni, Comoros', coordinates: [43.2551, -11.7172] },
  victoria: { name: 'Victoria, Seychelles', coordinates: [55.4554, -4.6191] },
  praia: { name: 'Praia, Cape Verde', coordinates: [-23.5125, 14.9177] }
};

// Countries for destination data
const AFRICAN_COUNTRIES = {
  kenya: 'Kenya',
  tanzania: 'Tanzania',
  uganda: 'Uganda',
  ethiopia: 'Ethiopia',
  sudan: 'Sudan',
  senegal: 'Senegal',
  nigeria: 'Nigeria',
  ghana: 'Ghana',
  cotedivoire: 'Côte d\'Ivoire',
  burkinafaso: 'Burkina Faso',
  egypt: 'Egypt',
  libya: 'Libya',
  algeria: 'Algeria',
  morocco: 'Morocco',
  tunisia: 'Tunisia',
  southafrica: 'South Africa',
  botswana: 'Botswana',
  angola: 'Angola',
  drc: 'Democratic Republic of Congo',
  congo: 'Republic of Congo',
  gabon: 'Gabon',
  cameroon: 'Cameroon',
  madagascar: 'Madagascar',
  mauritius: 'Mauritius',
  comoros: 'Comoros',
  seychelles: 'Seychelles',
  capeverde: 'Cape Verde'
};

// Create shipments with categories and types
export const generateRandomDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Shipment categories and descriptions for more realistic data
const SHIPMENT_CATEGORIES = [
  { category: 'Medical Supplies', description: 'Vaccines, PPE, and medical equipment' },
  { category: 'Agricultural Equipment', description: 'Tractors, irrigation systems, and farming tools' },
  { category: 'Food Aid', description: 'Emergency food supplies and nutritional supplements' },
  { category: 'Electronic Goods', description: 'Computers, mobile phones, and solar panels' },
  { category: 'Construction Materials', description: 'Cement, steel beams, and prefabricated housing' },
  { category: 'Educational Materials', description: 'Textbooks, tablets, and classroom furniture' },
  { category: 'Humanitarian Aid', description: 'Water purification systems and emergency shelters' },
  { category: 'Telecommunications', description: 'Network equipment and satellite communication devices' },
  { category: 'Energy Infrastructure', description: 'Solar panels, wind turbines, and power generators' },
  { category: 'Minerals', description: 'Processed gold, diamonds, and industrial minerals' },
  { category: 'Textiles', description: 'Cotton fabrics, clothing, and footwear' },
  { category: 'Pharmaceuticals', description: 'Essential medicines and medical consumables' }
];

// Generate African shipments with realistic routes and data
export const AFRICAN_SHIPMENTS: Shipment[] = [
  // East African Routes - Sea freight
  {
    id: '1',
    name: 'Mombasa-Dar es Salaam',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.mombasa,
    destination: {
      name: AFRICAN_LOCATIONS.daressalaam.name,
      coordinates: AFRICAN_LOCATIONS.daressalaam.coordinates,
      country: AFRICAN_COUNTRIES.tanzania
    },
    status: 'in-transit',
    eta: generateRandomDate(5),
    consigneeAddress: '123 Port Road, Dar es Salaam',
    ops: 'John Smith',
    itemCategory: 'Agricultural Equipment',
    itemDescription: 'Tractors and farming implements',
    weight: '12,500 kg',
    volume: '48 m³',
    value: '$125,000',
  },
  {
    id: '2',
    name: 'Mombasa-Durban Route',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.mombasa,
    destination: {
      name: AFRICAN_LOCATIONS.durban.name,
      coordinates: AFRICAN_LOCATIONS.durban.coordinates,
      country: AFRICAN_COUNTRIES.southafrica
    },
    status: 'in-transit',
    eta: generateRandomDate(8),
    consigneeAddress: '45 Marine Parade, Durban Harbor',
    ops: 'Emily Parker',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Hospital equipment and pharmaceuticals',
    weight: '8,200 kg',
    volume: '35 m³',
    value: '$320,000',
  },
  
  // West African Routes - Sea freight
  {
    id: '3',
    name: 'Dakar-Lagos Route',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.dakar,
    destination: {
      name: AFRICAN_LOCATIONS.lagos.name,
      coordinates: AFRICAN_LOCATIONS.lagos.coordinates,
      country: AFRICAN_COUNTRIES.nigeria
    },
    status: 'in-transit',
    eta: generateRandomDate(7),
    consigneeAddress: '78 Apapa Port Complex, Lagos',
    ops: 'Aisha Okonkwo',
    itemCategory: 'Energy Infrastructure',
    itemDescription: 'Solar panels and wind turbine components',
    weight: '15,800 kg',
    volume: '62 m³',
    value: '$540,000',
  },
  {
    id: '4',
    name: 'Dakar-Abidjan Route',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.dakar,
    destination: {
      name: AFRICAN_LOCATIONS.abidjan.name,
      coordinates: AFRICAN_LOCATIONS.abidjan.coordinates,
      country: AFRICAN_COUNTRIES.cotedivoire
    },
    status: 'delayed',
    eta: generateRandomDate(10),
    consigneeAddress: '23 Port Bouët, Abidjan',
    ops: 'François Koffi',
    itemCategory: 'Construction Materials',
    itemDescription: 'Steel beams and cement',
    weight: '28,000 kg',
    volume: '75 m³',
    value: '$180,000',
  },
  
  // North-South Routes - Air freight
  {
    id: '5',
    name: 'Cairo-Johannesburg',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.cairo,
    destination: {
      name: AFRICAN_LOCATIONS.johannesburg.name,
      coordinates: AFRICAN_LOCATIONS.johannesburg.coordinates,
      country: AFRICAN_COUNTRIES.southafrica
    },
    status: 'in-transit',
    eta: generateRandomDate(2),
    consigneeAddress: '12 O.R. Tambo Industrial Zone, Johannesburg',
    ops: 'Mohammed Farouk',
    itemCategory: 'Pharmaceuticals',
    itemDescription: 'Temperature-controlled vaccines and medications',
    weight: '2,200 kg',
    volume: '12 m³',
    value: '$1,200,000',
    expirationDate: generateRandomDate(180),
    whoDescription: 'Essential Medicines WHO List',
    serialNumber: 'VCC-2023-15782',
  },
  {
    id: '6',
    name: 'Casablanca-Kinshasa',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.casablanca,
    destination: {
      name: AFRICAN_LOCATIONS.kinshasa.name,
      coordinates: AFRICAN_LOCATIONS.kinshasa.coordinates,
      country: AFRICAN_COUNTRIES.drc
    },
    status: 'in-transit',
    eta: generateRandomDate(3),
    consigneeAddress: '56 N\'Djili Airport Road, Kinshasa',
    ops: 'Hassan El Fassi',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Emergency medical kits and diagnostic equipment',
    weight: '3,100 kg',
    volume: '14 m³',
    value: '$750,000',
    expirationDate: generateRandomDate(365),
    whoDescription: 'WHO Emergency Response Kit',
    serialNumber: 'MED-2023-9087',
  },
  
  // Cross-Continental Air Routes
  {
    id: '7',
    name: 'Nairobi-Algiers',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.nairobi,
    destination: {
      name: AFRICAN_LOCATIONS.algiers.name,
      coordinates: AFRICAN_LOCATIONS.algiers.coordinates,
      country: AFRICAN_COUNTRIES.algeria
    },
    status: 'in-transit',
    eta: generateRandomDate(1),
    consigneeAddress: '34 Houari Boumediene Airport, Algiers',
    ops: 'Sarah Kimani',
    itemCategory: 'Telecommunications',
    itemDescription: 'Satellite equipment and cellular network components',
    weight: '1,800 kg',
    volume: '9 m³',
    value: '$890,000',
    serialNumber: 'TEL-2023-45632',
  },
  {
    id: '8',
    name: 'Addis Ababa-Tunis',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.addisababa,
    destination: {
      name: AFRICAN_LOCATIONS.tunis.name,
      coordinates: AFRICAN_LOCATIONS.tunis.coordinates,
      country: AFRICAN_COUNTRIES.tunisia
    },
    status: 'in-transit',
    eta: generateRandomDate(2),
    consigneeAddress: '90 Carthage Airport District, Tunis',
    ops: 'Yonas Haile',
    itemCategory: 'Electronic Goods',
    itemDescription: 'Computer servers and networking equipment',
    weight: '2,500 kg',
    volume: '15 m³',
    value: '$1,100,000',
    serialNumber: 'EL-2023-78332',
  },
  
  // East-West Land Routes
  {
    id: '9',
    name: 'Nairobi-Kampala',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.nairobi,
    destination: {
      name: AFRICAN_LOCATIONS.kampala.name,
      coordinates: AFRICAN_LOCATIONS.kampala.coordinates,
      country: AFRICAN_COUNTRIES.uganda
    },
    status: 'in-transit',
    eta: generateRandomDate(3),
    consigneeAddress: '123 Industrial Area, Kampala',
    ops: 'Daniel Ochieng',
    itemCategory: 'Food Aid',
    itemDescription: 'Grain, cooking oil, and nutritional supplements',
    weight: '18,000 kg',
    volume: '42 m³',
    value: '$120,000',
    stockRelease: 'SR-2023-UG-001',
    warehouse: 'Nairobi Main Warehouse',
  },
  {
    id: '10',
    name: 'Lagos-Ouagadougou',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.lagos,
    destination: {
      name: AFRICAN_LOCATIONS.ouagadougou.name,
      coordinates: AFRICAN_LOCATIONS.ouagadougou.coordinates,
      country: AFRICAN_COUNTRIES.burkinafaso
    },
    status: 'delayed',
    eta: generateRandomDate(7),
    consigneeAddress: '45 Zone Industrielle, Ouagadougou',
    ops: 'Ibrahim Saheed',
    itemCategory: 'Educational Materials',
    itemDescription: 'Textbooks, tablets, and classroom equipment',
    weight: '14,500 kg',
    volume: '38 m³',
    value: '$280,000',
    stockRelease: 'SR-2023-BF-004',
    warehouse: 'Lagos Distribution Center',
  },
  
  // Southern Africa Land Routes
  {
    id: '11',
    name: 'Johannesburg-Gaborone',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.johannesburg,
    destination: {
      name: AFRICAN_LOCATIONS.gaborone.name,
      coordinates: AFRICAN_LOCATIONS.gaborone.coordinates,
      country: AFRICAN_COUNTRIES.botswana
    },
    status: 'in-transit',
    eta: generateRandomDate(2),
    consigneeAddress: '12 Phakalane Industrial, Gaborone',
    ops: 'Thabo Modise',
    itemCategory: 'Agricultural Equipment',
    itemDescription: 'Irrigation systems and small farm machinery',
    weight: '9,800 kg',
    volume: '32 m³',
    value: '$210,000',
    stockRelease: 'SR-2023-BW-008',
    warehouse: 'Johannesburg South Distribution Center',
  },
  {
    id: '12',
    name: 'Cape Town-Windhoek',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.capetown,
    destination: {
      name: 'Windhoek, Namibia',
      coordinates: [17.0658, -22.5609],
      country: 'Namibia'
    },
    status: 'in-transit',
    eta: generateRandomDate(4),
    consigneeAddress: '78 Northern Industrial Area, Windhoek',
    ops: 'Christine van der Merwe',
    itemCategory: 'Humanitarian Aid',
    itemDescription: 'Water purification systems and solar cookers',
    weight: '12,200 kg',
    volume: '35 m³',
    value: '$180,000',
    stockRelease: 'SR-2023-NA-002',
    warehouse: 'Cape Town Regional Hub',
  },
  
  // Island Routes
  {
    id: '13',
    name: 'Mombasa-Antananarivo',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.mombasa,
    destination: {
      name: AFRICAN_LOCATIONS.antananarivo.name,
      coordinates: AFRICAN_LOCATIONS.antananarivo.coordinates,
      country: AFRICAN_COUNTRIES.madagascar
    },
    status: 'in-transit',
    eta: generateRandomDate(9),
    consigneeAddress: '23 Toamasina Port Road, Madagascar',
    ops: 'Jean-Luc Razafindrakoto',
    itemCategory: 'Energy Infrastructure',
    itemDescription: 'Solar panels and mini-grid components',
    weight: '14,800 kg',
    volume: '50 m³',
    value: '$680,000',
  },
  {
    id: '14',
    name: 'Dakar-Praia',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.dakar,
    destination: {
      name: AFRICAN_LOCATIONS.praia.name,
      coordinates: AFRICAN_LOCATIONS.praia.coordinates,
      country: AFRICAN_COUNTRIES.capeverde
    },
    status: 'in-transit',
    eta: generateRandomDate(5),
    consigneeAddress: '5 Porto Grande, Mindelo',
    ops: 'Marco Tavares',
    itemCategory: 'Humanitarian Aid',
    itemDescription: 'Desalination equipment and water storage',
    weight: '9,500 kg',
    volume: '34 m³',
    value: '$420,000',
  },
  {
    id: '15',
    name: 'Cairo-Tripoli',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.cairo,
    destination: {
      name: AFRICAN_LOCATIONS.tripoli.name,
      coordinates: AFRICAN_LOCATIONS.tripoli.coordinates,
      country: AFRICAN_COUNTRIES.libya
    },
    status: 'in-transit',
    eta: generateRandomDate(6),
    consigneeAddress: '48 Tripoli Industrial Zone',
    ops: 'Mustafa Ibrahim',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Field hospital equipment and supplies',
    weight: '11,200 kg',
    volume: '36 m³',
    value: '$540,000',
    whoDescription: 'Emergency Response Supplies',
  },
  {
    id: '16',
    name: 'Luanda-Brazzaville',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.luanda,
    destination: {
      name: AFRICAN_LOCATIONS.brazzaville.name,
      coordinates: AFRICAN_LOCATIONS.brazzaville.coordinates,
      country: AFRICAN_COUNTRIES.congo
    },
    status: 'delayed',
    eta: generateRandomDate(4),
    consigneeAddress: '15 Maya-Maya Airport Road, Brazzaville',
    ops: 'Antonio Dos Santos',
    itemCategory: 'Telecommunications',
    itemDescription: 'Internet infrastructure equipment',
    weight: '2,800 kg',
    volume: '14 m³',
    value: '$950,000',
  },
  {
    id: '17',
    name: 'Nairobi-Moroni',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.nairobi,
    destination: {
      name: AFRICAN_LOCATIONS.moroni.name,
      coordinates: AFRICAN_LOCATIONS.moroni.coordinates,
      country: AFRICAN_COUNTRIES.comoros
    },
    status: 'in-transit',
    eta: generateRandomDate(3),
    consigneeAddress: '7 Prince Said Ibrahim Airport, Moroni',
    ops: 'Fatima Hussein',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Vaccines and cold chain equipment',
    weight: '1,400 kg',
    volume: '8 m³',
    value: '$380,000',
    expirationDate: generateRandomDate(120),
    whoDescription: 'WHO Vaccine Initiative',
    serialNumber: 'VAC-2023-12892',
  },
  {
    id: '18',
    name: 'Accra-Libreville',
    type: 'ship',
    origin: AFRICAN_LOCATIONS.accra,
    destination: {
      name: AFRICAN_LOCATIONS.libreville.name,
      coordinates: AFRICAN_LOCATIONS.libreville.coordinates,
      country: AFRICAN_COUNTRIES.gabon
    },
    status: 'in-transit',
    eta: generateRandomDate(10),
    consigneeAddress: '34 Owendo Port, Libreville',
    ops: 'Kwame Mensah',
    itemCategory: 'Minerals',
    itemDescription: 'Processed gold and industrial minerals',
    weight: '18,000 kg',
    volume: '22 m³',
    value: '$4,200,000',
  },
  {
    id: '19',
    name: 'Addis Ababa-Khartoum',
    type: 'truck',
    origin: AFRICAN_LOCATIONS.addisababa,
    destination: {
      name: AFRICAN_LOCATIONS.khartoum.name,
      coordinates: AFRICAN_LOCATIONS.khartoum.coordinates,
      country: AFRICAN_COUNTRIES.sudan
    },
    status: 'in-transit',
    eta: generateRandomDate(5),
    consigneeAddress: '92 Industrial Zone, Khartoum North',
    ops: 'Abebe Tadesse',
    itemCategory: 'Food Aid',
    itemDescription: 'Emergency food supplies and nutritional supplements',
    weight: '22,000 kg',
    volume: '55 m³',
    value: '$160,000',
    stockRelease: 'SR-2023-SD-005',
    warehouse: 'Addis Ababa Regional Warehouse',
  },
  {
    id: '20',
    name: 'Johannesburg-Victoria',
    type: 'charter',
    origin: AFRICAN_LOCATIONS.johannesburg,
    destination: {
      name: AFRICAN_LOCATIONS.victoria.name,
      coordinates: AFRICAN_LOCATIONS.victoria.coordinates,
      country: AFRICAN_COUNTRIES.seychelles
    },
    status: 'in-transit',
    eta: generateRandomDate(2),
    consigneeAddress: '3 Seychelles International Airport, Mahé',
    ops: 'Priscilla Naidoo',
    itemCategory: 'Pharmaceuticals',
    itemDescription: 'Specialized medications and medical devices',
    weight: '1,200 kg',
    volume: '6 m³',
    value: '$1,800,000',
    expirationDate: generateRandomDate(180),
    whoDescription: 'Specialized Treatment Protocols',
    serialNumber: 'PHARM-2023-25671',
  }
];

export default AFRICAN_SHIPMENTS;
