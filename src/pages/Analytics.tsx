import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, TrendingUp, Package, AlertTriangle, Clock, Truck, Ship, Plane } from 'lucide-react';
import { Shipment } from '../types/shipment';

// Mock data for the analytics page
const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    name: 'Nairobi-Tanzania Route',
    type: 'ship',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Dar es Salaam, Tanzania',
      coordinates: [39.2083, -6.7924],
      country: 'Tanzania',
    },
    status: 'in-transit',
    eta: '2024-03-15',
    consigneeAddress: '123 Port Road, Dar es Salaam',
    ops: 'John Smith',
    itemCategory: 'Agricultural Equipment',
    itemDescription: 'Tractors and farming implements',
    weight: '12,500 kg',
  },
  {
    id: '2',
    name: 'Nairobi-Uganda Route',
    type: 'charter',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Kampala, Uganda',
      coordinates: [32.5899, 0.3476],
      country: 'Uganda',
    },
    status: 'in-transit',
    eta: '2024-03-12',
    consigneeAddress: '456 Central Avenue, Kampala',
    ops: 'Sarah Johnson',
    itemCategory: 'Medical Supplies',
    itemDescription: 'Vaccines and medical equipment',
    weight: '2,800 kg',
  },
  {
    id: '3',
    name: 'Nairobi-Ethiopia Route',
    type: 'charter',
    origin: {
      name: 'Nairobi, Kenya',
      coordinates: [36.8219, -1.2921],
    },
    destination: {
      name: 'Addis Ababa, Ethiopia',
      coordinates: [38.7578, 9.0222],
      country: 'Ethiopia',
    },
    status: 'delayed',
    eta: '2024-03-14',
    consigneeAddress: '789 Addis Ababa Road, Addis Ababa',
    ops: 'Michael Brown',
    itemCategory: 'Food Products',
    itemDescription: 'Canned food and grains',
    weight: '10,000 kg',
  },
  {
    id: '4',
    name: 'Dakar-Nigeria Route',
    type: 'ship',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Lagos, Nigeria',
      coordinates: [3.3792, 6.5244],
      country: 'Nigeria',
    },
    status: 'in-transit',
    eta: '2024-03-18',
    consigneeAddress: '321 Market Street, Lagos',
    ops: 'Lucy Green',
    itemCategory: 'Electronics',
    itemDescription: 'Mobile phones and accessories',
    weight: '8,000 kg',
  },
  {
    id: '5',
    name: 'Dakar-Ghana Route',
    type: 'ship',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Accra, Ghana',
      coordinates: [-0.1869, 5.6037],
      country: 'Ghana',
    },
    status: 'delivered',
    eta: '2024-03-16',
    consigneeAddress: '654 Freedom Avenue, Accra',
    ops: 'Evelyn Reed',
    itemCategory: 'Textiles',
    itemDescription: 'Clothing and fabrics',
    weight: '4,500 kg',
  },
  {
    id: '6',
    name: 'Dakar-Cameroon Route',
    type: 'truck',
    origin: {
      name: 'Dakar, Senegal',
      coordinates: [-17.4666, 14.7167],
    },
    destination: {
      name: 'Douala, Cameroon',
      coordinates: [9.7068, 4.0511],
      country: 'Cameroon',
    },
    status: 'delayed',
    eta: '2024-03-20',
    consigneeAddress: '987 River Road, Douala',
    ops: 'Robert White',
    itemCategory: 'Household Goods',
    itemDescription: 'Furniture and appliances',
    weight: '15,000 kg',
  },
];

// Prepare data for charts
const prepareShipmentTypeData = (shipments: Shipment[]) => {
  const typeCounts = shipments.reduce((acc, shipment) => {
    acc[shipment.type] = (acc[shipment.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(typeCounts).map(([type, count]) => ({
    name: type === 'ship' ? 'Sea Freight' : type === 'charter' ? 'Air Freight' : 'Ground Transport',
    value: count,
    color: type === 'ship' ? '#15ABC0' : type === 'charter' ? '#62F3F7' : '#DCCC82'
  }));
};

const prepareStatusData = (shipments: Shipment[]) => {
  const statusCounts = shipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status === 'in-transit' ? 'In Transit' : status === 'delivered' ? 'Delivered' : 'Delayed',
    value: count,
    color: status === 'in-transit' ? '#62F3F7' : status === 'delivered' ? '#15ABC0' : '#FF6B6B'
  }));
};

const prepareDestinationData = (shipments: Shipment[]) => {
  const destinationCounts = shipments.reduce((acc, shipment) => {
    const country = shipment.destination.country;
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(destinationCounts).map(([country, count]) => ({
    name: country,
    count: count
  }));
};

const prepareWeightData = (shipments: Shipment[]) => {
  return shipments.map(shipment => ({
    name: shipment.name.split('-')[1].split(' ')[0], // Extract destination country name
    weight: parseInt(shipment.weight.replace(/,/g, '').split(' ')[0]) // Convert weight string to number
  }));
};

// Statistical calculations
const calculateStats = (shipments: Shipment[]) => {
  const weights = shipments.map(s => parseInt(s.weight.replace(/,/g, '').split(' ')[0]));
  
  const sum = weights.reduce((a, b) => a + b, 0);
  const mean = sum / weights.length;
  
  const squaredDiffs = weights.map(w => Math.pow(w - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / weights.length;
  const stdDev = Math.sqrt(variance);
  
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const cv = (stdDev / mean) * 100; // Coefficient of variation
  
  return {
    mean,
    min,
    max,
    stdDev,
    cv
  };
};

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
  const shipmentTypeData = prepareShipmentTypeData(MOCK_SHIPMENTS);
  const statusData = prepareStatusData(MOCK_SHIPMENTS);
  const destinationData = prepareDestinationData(MOCK_SHIPMENTS);
  const weightData = prepareWeightData(MOCK_SHIPMENTS);
  const stats = calculateStats(MOCK_SHIPMENTS);
  
  return (
    <div className="min-h-screen bg-palette-darkblue text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-full bg-palette-blue/30 hover:bg-palette-blue/50 transition-colors">
              <ArrowLeft size={20} className="text-palette-mint" />
            </Link>
            <h1 className="text-2xl font-bold text-palette-mint">Shipment Analytics</h1>
          </div>
          <div className="flex gap-2 bg-palette-blue/30 p-1 rounded-lg">
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-palette-mint/20 text-palette-mint' : 'text-white/70 hover:text-white'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'details' ? 'bg-palette-mint/20 text-palette-mint' : 'text-white/70 hover:text-white'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-sm">Total Shipments</p>
                <h3 className="text-3xl font-bold text-palette-mint">{MOCK_SHIPMENTS.length}</h3>
              </div>
              <div className="p-3 bg-palette-mint/10 rounded-full">
                <Package size={20} className="text-palette-mint" />
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>12% increase</span>
            </div>
          </div>
          
          <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-sm">In Transit</p>
                <h3 className="text-3xl font-bold text-palette-teal">
                  {MOCK_SHIPMENTS.filter(s => s.status === 'in-transit').length}
                </h3>
              </div>
              <div className="p-3 bg-palette-teal/10 rounded-full">
                <Truck size={20} className="text-palette-teal" />
              </div>
            </div>
            <div className="flex items-center text-palette-teal text-sm">
              <Clock size={16} className="mr-1" />
              <span>On schedule</span>
            </div>
          </div>
          
          <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-sm">Delayed</p>
                <h3 className="text-3xl font-bold text-red-400">
                  {MOCK_SHIPMENTS.filter(s => s.status === 'delayed').length}
                </h3>
              </div>
              <div className="p-3 bg-red-400/10 rounded-full">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
            </div>
            <div className="flex items-center text-red-400 text-sm">
              <Clock size={16} className="mr-1" />
              <span>Needs attention</span>
            </div>
          </div>
          
          <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/60 text-sm">Delivered</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {MOCK_SHIPMENTS.filter(s => s.status === 'delivered').length}
                </h3>
              </div>
              <div className="p-3 bg-green-400/10 rounded-full">
                <Package size={20} className="text-green-400" />
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>Completed</span>
            </div>
          </div>
        </div>
        
        {activeTab === 'overview' ? (
          <>
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
                <h3 className="text-lg font-semibold mb-4 text-palette-mint">Shipment Types</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shipmentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {shipmentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} shipments`, 'Count']}
                        contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Ship size={16} className="text-palette-teal" />
                    <span className="text-sm">Sea: {MOCK_SHIPMENTS.filter(s => s.type === 'ship').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane size={16} className="text-palette-mint" />
                    <span className="text-sm">Air: {MOCK_SHIPMENTS.filter(s => s.type === 'charter').length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-palette-sand" />
                    <span className="text-sm">Ground: {MOCK_SHIPMENTS.filter(s => s.type === 'truck').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
                <h3 className="text-lg font-semibold mb-4 text-palette-mint">Shipment Status</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} shipments`, 'Count']}
                        contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
                <h3 className="text-lg font-semibold mb-4 text-palette-mint">Shipments by Destination</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={destinationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#15ABC0" />
                      <YAxis stroke="#15ABC0" />
                      <Tooltip 
                        formatter={(value: any) => [`${value} shipments`, 'Count']}
                        contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                      />
                      <Bar dataKey="count" fill="#15ABC0" name="Shipments" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
                <h3 className="text-lg font-semibold mb-4 text-palette-mint">Shipment Weights (kg)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                      <XAxis dataKey="name" stroke="#15ABC0" />
                      <YAxis stroke="#15ABC0" />
                      <Tooltip 
                        formatter={(value: any) => [`${value} kg`, 'Weight']}
                        contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                      />
                      <Bar dataKey="weight" fill="#62F3F7" name="Weight (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detailed Statistics */}
            <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-palette-mint">Weight Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-palette-darkblue/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Average Weight</p>
                  <p className="text-xl font-bold text-palette-mint">{stats.mean.toFixed(2)} kg</p>
                </div>
                <div className="bg-palette-darkblue/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Minimum Weight</p>
                  <p className="text-xl font-bold text-palette-teal">{stats.min.toFixed(2)} kg</p>
                </div>
                <div className="bg-palette-darkblue/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Maximum Weight</p>
                  <p className="text-xl font-bold text-palette-sand">{stats.max.toFixed(2)} kg</p>
                </div>
                <div className="bg-palette-darkblue/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Standard Deviation</p>
                  <p className="text-xl font-bold text-palette-mint">{stats.stdDev.toFixed(2)} kg</p>
                </div>
                <div className="bg-palette-darkblue/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Coefficient of Variation</p>
                  <p className="text-xl font-bold text-palette-teal">{stats.cv.toFixed(2)}%</p>
                </div>
              </div>
            </div>
            
            {/* Shipment Table */}
            <div className="bg-palette-blue/30 p-6 rounded-lg border border-palette-mint/20">
              <h3 className="text-lg font-semibold mb-4 text-palette-mint">Shipment Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-palette-mint/20">
                      <th className="text-left py-3 px-4 text-palette-mint">ID</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Name</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Type</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Origin</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Destination</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Status</th>
                      <th className="text-left py-3 px-4 text-palette-mint">ETA</th>
                      <th className="text-left py-3 px-4 text-palette-mint">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SHIPMENTS.map((shipment) => (
                      <tr key={shipment.id} className="border-b border-palette-mint/10 hover:bg-palette-mint/5">
                        <td className="py-3 px-4 font-mono text-white/70">{shipment.id}</td>
                        <td className="py-3 px-4">{shipment.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            shipment.type === 'ship' 
                              ? 'bg-palette-teal/20 text-palette-teal' 
                              : shipment.type === 'charter' 
                                ? 'bg-palette-mint/20 text-palette-mint'
                                : 'bg-palette-sand/20 text-palette-sand'
                          }`}>
                            {shipment.type === 'ship' && <Ship size={12} />}
                            {shipment.type === 'charter' && <Plane size={12} />}
                            {shipment.type === 'truck' && <Truck size={12} />}
                            {shipment.type === 'ship' ? 'Sea' : shipment.type === 'charter' ? 'Air' : 'Ground'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{shipment.origin.name}</td>
                        <td className="py-3 px-4">{shipment.destination.name}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            shipment.status === 'in-transit' 
                              ? 'bg-palette-teal/20 text-palette-teal' 
                              : shipment.status === 'delivered' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{shipment.eta}</td>
                        <td className="py-3 px-4">{shipment.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
