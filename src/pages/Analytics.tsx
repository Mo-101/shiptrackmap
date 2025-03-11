
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, AlertTriangle, Clock, Package, 
  TruckIcon, DollarSign, PieChartIcon, ShieldAlert, AreaChartIcon,
  Globe, Building2, Weight, CircleDollarSign, CalendarClock, Truck, Map, ArrowLeft, 
  BookOpen, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line, CartesianGrid
} from 'recharts';
import { 
  getAggregatedAnalyticsData, 
  getTopCarriers, 
  getTopDestinations, 
  getMonthlyTrends,
  getCountryRiskAssessment
} from '../services/analyticsDataService';
import NavHeader from '../components/NavHeader';
import { Shipment } from '../types/shipment';
import { forwarderLogos } from '../utils/forwarderLogos';

// Type definition for our analytics data
interface AggregatedLogisticsData {
  totalCost: number;
  totalShipments: number;
  totalFreightForwarders: number;
  totalCountries: number;
  totalWeight: number;
  totalVolume: number;
  avgTransportDays: number;
  avgCostPerKg: number;
  fleetEfficiency: number;
}

/**
 * Ultra-futuristic Logistics Analytics Dashboard
 */
const Analytics: React.FC = () => {
  // State for all our data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'strategy'>('overview');
  const [topCarriers, setTopCarriers] = useState<any[]>([]);
  const [topDestinations, setTopDestinations] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedLogisticsData>({
    totalCost: 0,
    totalShipments: 0,
    totalFreightForwarders: 0,
    totalCountries: 0,
    totalWeight: 0,
    totalVolume: 0,
    avgTransportDays: 0,
    avgCostPerKg: 0,
    fleetEfficiency: 85 // Mock efficiency score
  });
  
  // Create refs for counter animations
  const costRef = useRef<HTMLDivElement>(null);
  const shipmentsRef = useRef<HTMLDivElement>(null);
  const forwardersRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const weightRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const transportDaysRef = useRef<HTMLDivElement>(null);
  const costPerKgRef = useRef<HTMLDivElement>(null);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get data from services
        const aggregatedData = getAggregatedAnalyticsData();
        const topCarriersData = getTopCarriers();
        const topDestinationsData = getTopDestinations();
        const monthlyTrendsData = getMonthlyTrends();
        const riskAssessmentData = getCountryRiskAssessment();
        
        setAggregatedData(aggregatedData);
        setTopCarriers(topCarriersData);
        setTopDestinations(topDestinationsData);
        setMonthlyTrends(monthlyTrendsData);
        setRiskAssessment(riskAssessmentData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Function to format large numbers
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Counter animation effect
  useEffect(() => {
    if (!isLoading) {
      animateCounter(costRef, 0, aggregatedData.totalCost, 1500);
      animateCounter(shipmentsRef, 0, aggregatedData.totalShipments, 1500);
      animateCounter(forwardersRef, 0, aggregatedData.totalFreightForwarders, 1500);
      animateCounter(countriesRef, 0, aggregatedData.totalCountries, 1500);
      animateCounter(weightRef, 0, aggregatedData.totalWeight, 1500);
      animateCounter(volumeRef, 0, aggregatedData.totalVolume, 1500);
      animateCounter(transportDaysRef, 0, aggregatedData.avgTransportDays, 1500);
      animateCounter(costPerKgRef, 0, aggregatedData.avgCostPerKg, 1500);
    }
  }, [isLoading, aggregatedData]);
  
  // Counter animation function
  const animateCounter = (ref: React.RefObject<HTMLDivElement>, start: number, end: number, duration: number) => {
    if (!ref.current) return;
    
    const startTime = performance.now();
    const formatValue = (value: number) => {
      if (ref === shipmentsRef || ref === forwardersRef || ref === countriesRef) {
        return formatNumber(Math.floor(value));
      } else if (ref === costRef || ref === costPerKgRef) {
        return formatCurrency(value);
      } else if (ref === transportDaysRef) {
        return value.toFixed(1);
      } else {
        return formatNumber(Math.floor(value));
      }
    };
    
    const updateCounter = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = start + (end - start) * progress;
      
      if (ref.current) {
        ref.current.textContent = formatValue(currentValue);
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };
  
  // Colors for the pie chart
  const COLORS = ['#15ABC0', '#62F3F7', '#DCCC82', '#3b82f6', '#6366f1'];
  
  // Delivery time data
  const deliveryTimeData = [
    { name: 'Week 1', Air: 5.2, Sea: 14.1, Land: 9.3 },
    { name: 'Week 2', Air: 5.5, Sea: 13.8, Land: 9.1 },
    { name: 'Week 3', Air: 4.9, Sea: 13.5, Land: 8.8 },
    { name: 'Week 4', Air: 5.0, Sea: 14.0, Land: 9.0 },
    { name: 'Week 5', Air: 4.8, Sea: 13.7, Land: 8.9 },
  ];
  
  // Mock for fleet data
  const fleetData = {
    total: 65,
    onMove: 40,
    maintenance: 5,
    idle: 20
  };

  // Forwarder performance data
  const forwarderPerformanceData = [
    { name: 'DHL Express', leadTime: 3, onTimeRate: 95 },
    { name: 'Freight in Time', leadTime: 10, onTimeRate: 90 },
    { name: 'Kuehne & Nagel', leadTime: 8.5, onTimeRate: 85 },
    { name: 'Scan Global', leadTime: 12, onTimeRate: 75 }
  ];

  // Cost efficiency data
  const costEfficiencyData = [
    { name: 'Freight in Time', air: 2.10, sea: 0, road: 0 },
    { name: 'AGL', air: 0, sea: 1.89, road: 0 },
    { name: 'Siginon', air: 0, sea: 0, road: 1.50 },
    { name: 'Kuehne & Nagel', air: 2.45, sea: 0, road: 0 },
    { name: 'Scan Global', air: 2.75, sea: 0, road: 0 },
    { name: 'DHL Express', air: 4.80, sea: 0, road: 0 }
  ];

  // Territory data
  const territoryData = [
    { country: 'Zimbabwe', ruler: 'Kuehne & Nagel', weakness: 'No sea/road', action: 'Use AGL sea (70%)' },
    { country: 'DR Congo', ruler: 'Kuehne & Nagel', weakness: 'Overpriced', action: 'Switch to Freight in Time' },
    { country: 'Comoros', ruler: 'DHL', weakness: 'High costs', action: 'Hybrid shipments' },
    { country: 'Malawi', ruler: 'Kuehne & Nagel', weakness: 'No competition', action: 'Fixed rate contracts' }
  ];

  // Carbon impact data
  const carbonImpactData = [
    { name: 'Air', value: 3 },
    { name: 'Sea', value: 1 },
    { name: 'Road', value: 1.5 }
  ];

  // Strategic scenario data
  const scenarioData = [
    { type: 'Old Way (Air only)', value: 24500 },
    { type: 'New Way (70% Sea + 30% Air)', value: 20580 }
  ];

  return (
    <div className="min-h-screen w-full bg-palette-darkblue text-white overflow-hidden flex flex-col">
      <NavHeader toggleSidebar={() => {}} />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-screen-2xl mx-auto p-4">
          <div className="mb-6 relative">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-palette-mint">Logistics</span> Analytics Dashboard
            </h1>
            <p className="text-sm text-white/70">
              Shipment and logistics tracking dashboard with real-time fleet status
            </p>
            
            {/* Live indicator */}
            <div className="absolute top-0 right-0 flex items-center space-x-2">
              <div className="h-2 w-2 bg-palette-mint rounded-full animate-pulse"></div>
              <span className="text-xs text-palette-mint/80">LIVE DATA</span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-palette-mint/40 to-transparent"></div>
          </div>
          
          <div className="flex gap-2 bg-palette-blue/30 p-1 rounded-lg mb-6 w-fit">
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
            <button 
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'strategy' ? 'bg-palette-mint/20 text-palette-mint' : 'text-white/70 hover:text-white'}`}
              onClick={() => setActiveTab('strategy')}
            >
              Strategy
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-t-palette-mint/80 border-r-palette-mint/60 border-b-palette-mint/40 border-l-palette-mint/20 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-palette-mint text-xs">LOADING</div>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="grid grid-cols-12 gap-3">
              {/* Left sidebar with KPIs */}
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {/* KPI Cards */}
                {/* 1. Total Cost */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <DollarSign size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Total Cost</h3>
                  </div>
                  <div ref={costRef} className="text-white text-lg font-bold mt-1">$0</div>
                </div>
                
                {/* 2. Total Shipments */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Total Shipments</h3>
                  </div>
                  <div ref={shipmentsRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 3. Total Freight Forwarders */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Freight Forwarders</h3>
                  </div>
                  <div ref={forwardersRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 4. Total Countries */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Total Countries</h3>
                  </div>
                  <div ref={countriesRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 5. Weight */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Weight size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Total Weight (Kg)</h3>
                  </div>
                  <div ref={weightRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 6. Volume */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Map size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Total Volume (CBM)</h3>
                  </div>
                  <div ref={volumeRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 7. Average days of Transportation */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CalendarClock size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Avg Transport (Days)</h3>
                  </div>
                  <div ref={transportDaysRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
                
                {/* 8. Average Cost per Kg */}
                <div className="bg-palette-blue/30 p-2 rounded-md border border-palette-mint/20 hover:border-palette-mint/40 transition-colors group">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CircleDollarSign size={14} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-xs">Avg Cost per Kg</h3>
                  </div>
                  <div ref={costPerKgRef} className="text-white text-lg font-bold mt-1">0</div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="col-span-9 grid grid-cols-9 gap-3">
                {/* Row 1 */}
                <div className="col-span-3">
                  {/* Total Fleet */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Total Fleet</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold text-palette-mint">{fleetData.total}</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-palette-mint animate-pulse"></div>
                          <span className="text-white/80 text-xs">On The Move</span>
                          <span className="text-white font-medium text-xs">{fleetData.onMove}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-red-400"></div>
                          <span className="text-white/80 text-xs">Maintenance</span>
                          <span className="text-white font-medium text-xs">{fleetData.maintenance}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                          <span className="text-white/80 text-xs">Idle</span>
                          <span className="text-white font-medium text-xs">{fleetData.idle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  {/* Fleet Efficiency */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Fleet Efficiency</h3>
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#071777"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#15ABC0"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * (aggregatedData.fleetEfficiency / 100)} ${2 * Math.PI * 45 * (1 - aggregatedData.fleetEfficiency / 100)}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            className="transform -rotate-90 origin-center"
                          />
                          <text
                            x="50"
                            y="50"
                            fontSize="20"
                            fill="white"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {aggregatedData.fleetEfficiency}%
                          </text>
                        </svg>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border border-palette-mint/20 animate-pulse opacity-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  {/* Logistics Efficiency Score */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Logistics Efficiency Score</h3>
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-28 h-28">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#071777"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#62F3F7"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * (94 / 100)} ${2 * Math.PI * 45 * (1 - 94 / 100)}`}
                            strokeDashoffset="0"
                            strokeLinecap="round"
                            className="transform -rotate-90 origin-center"
                          />
                          <text
                            x="50"
                            y="45"
                            fontSize="20"
                            fill="white"
                            fontWeight="bold"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            94%
                          </text>
                          <text
                            x="50"
                            y="65"
                            fontSize="10"
                            fill="#62F3F7"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            First Class
                          </text>
                        </svg>
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full border border-palette-mint/20 animate-pulse opacity-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="col-span-3">
                  {/* Deliveries by Carrier */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Carrier Market Share</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={topCarriers}
                            dataKey="revenue"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {topCarriers.map((entry, index) => {
                              const forwarderLogo = forwarderLogos[entry.name.toLowerCase()];
                              return (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={COLORS[index % COLORS.length]} 
                                />
                              );
                            })}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => formatCurrency(Number(value))}
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-2">
                      {topCarriers.slice(0, 3).map((carrier, index) => {
                        const forwarderKey = carrier.name.toLowerCase().replace(/\s+/g, '-');
                        const logoPath = forwarderLogos[forwarderKey];
                        return (
                          <div key={index} className="flex items-center bg-palette-blue/50 p-1 rounded">
                            {logoPath && (
                              <img 
                                src={logoPath} 
                                alt={carrier.name} 
                                className="w-6 h-6 object-contain mr-1" 
                              />
                            )}
                            <span className="text-xs text-white/90 truncate">{carrier.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-6">
                  {/* Average Delivery Time (days) & Route Type */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Avg Delivery Time (days) & Route Type</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={deliveryTimeData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                          <XAxis dataKey="name" stroke="#15ABC0" />
                          <YAxis stroke="#15ABC0" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="Air" fill="#62F3F7" />
                          <Bar dataKey="Sea" fill="#15ABC0" />
                          <Bar dataKey="Land" fill="#DCCC82" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Row 3 */}
                <div className="col-span-6">
                  {/* Country Risk Assessment */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Country Risk Assessment</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskAssessment}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                          <XAxis 
                            dataKey="country" 
                            angle={-45} 
                            textAnchor="end" 
                            height={60}
                            tick={{ fill: '#15ABC0', fontSize: 10 }}
                          />
                          <YAxis stroke="#15ABC0" />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                          />
                          <Bar 
                            dataKey="risk" 
                            name="Risk Factor"
                            radius={[4, 4, 0, 0]}
                          >
                            {riskAssessment.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.risk > 5 ? '#ff4d4f' : '#15ABC0'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  {/* Top Destinations */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Top Destinations</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topDestinations}
                          layout="vertical"
                          margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                          <XAxis type="number" stroke="#15ABC0" />
                          <YAxis dataKey="country" type="category" stroke="#15ABC0" tick={{ fill: "#15ABC0" }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            name="Shipments"
                            fill="#62F3F7" 
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Row 4 */}
                <div className="col-span-9">
                  {/* Real-time Shipment Flow */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Monthly Shipment Trends</h3>
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyTrends}>
                          <defs>
                            <linearGradient id="colorShipments" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#15ABC0" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#15ABC0" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#62F3F7" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#62F3F7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                          <XAxis 
                            dataKey="month" 
                            stroke="#15ABC0"
                          />
                          <YAxis 
                            yAxisId="left"
                            stroke="#15ABC0"
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            stroke="#62F3F7"
                          />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                            formatter={(value, name) => {
                              if (name === 'revenue') return [formatCurrency(Number(value)), 'Revenue'];
                              return [value, 'Shipments'];
                            }}
                          />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="shipments"
                            name="Shipments"
                            stroke="#15ABC0"
                            fillOpacity={1}
                            fill="url(#colorShipments)"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#62F3F7"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'details' ? (
            <div className="grid grid-cols-12 gap-4">
              {/* Details tab content */}
              <div className="col-span-12">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white text-xl font-bold mb-4">Detailed Analytics</h3>
                  <p className="text-white/80">This section contains detailed logistics analytics.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {/* Strategy tab content */}
              <div className="col-span-12">
                <div className="bg-palette-blue/30 p-6 rounded-md border border-palette-mint/20">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        <span className="text-palette-mint">Ultimate Freight Forwarder</span> Strategy Playbook
                      </h2>
                      <p className="text-white/70 text-sm">Consolidated Insights, Tactics & Workflows for Dominance</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="animate-pulse flex items-center gap-1 bg-palette-blue/50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-palette-mint rounded-full"></div>
                        <span className="text-xs text-palette-mint">LIVE STRATEGY</span>
                      </div>
                      <button className="bg-palette-mint/20 hover:bg-palette-mint/30 text-palette-mint px-3 py-1 rounded-full flex items-center gap-1 text-xs transition-colors">
                        <BookOpen size={12} /> Full Report
                      </button>
                    </div>
                  </div>
                  
                  {/* Section 1: Cost Efficiency & Rate Optimization */}
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="bg-palette-mint/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <DollarSign size={18} className="text-palette-mint" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">1. Cost Efficiency & Rate Optimization</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Key Metrics</h4>
                        <div className="text-sm text-white/90 space-y-1">
                          <p><span className="font-medium">Dynamic Cost-Efficiency Index (DCEI):</span></p>
                          <p>• Air: $2.10–$4.80/kg | Sea: $1.50–$1.89/kg | Road: $1.50/kg</p>
                          <p>• Winners: Freight in Time ($2.10/kg air), AGL ($1.89/kg sea)</p>
                          <p>• Losers: DHL ($4.80/kg air), Scan Global ($2.75/kg air)</p>
                        </div>
                        
                        <div className="h-40 mt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={costEfficiencyData}
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                              <XAxis dataKey="name" stroke="#15ABC0" tick={{ fill: '#15ABC0', fontSize: 10 }} />
                              <YAxis stroke="#15ABC0" unit="$/kg" />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                                formatter={(value) => [`$${value}/kg`, 'Cost']}
                              />
                              <Bar dataKey="air" name="Air" fill="#62F3F7" />
                              <Bar dataKey="sea" name="Sea" fill="#15ABC0" />
                              <Bar dataKey="road" name="Road" fill="#DCCC82" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <TruckIcon size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">Sea/Road First:</span>
                              Shift &gt;5,000 kg shipments to AGL (sea) or Siginon (road).
                            </p>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <TrendingUp size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">Renegotiate Air Rates:</span>
                              Demand 10% discounts from Kuehne & Nagel for high-volume routes (Zambia, DRC).
                            </p>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <AlertTriangle size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">DHL for Emergencies:</span>
                              Use only for &lt;100 kg urgent parcels (e.g., lab kits to Comoros).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 2: Lead Time Mastery */}
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="bg-palette-mint/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <Clock size={18} className="text-palette-mint" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">2. Lead Time Mastery</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Performance by Forwarder</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-white/90">
                            <thead className="text-xs uppercase bg-palette-blue/50">
                              <tr>
                                <th className="px-4 py-2 rounded-tl-md">Forwarder</th>
                                <th className="px-4 py-2">Avg. Lead Time (Days)</th>
                                <th className="px-4 py-2 rounded-tr-md">On-Time Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {forwarderPerformanceData.map((forwarder, index) => {
                                const forwarderKey = forwarder.name.toLowerCase().replace(/\s+/g, '-');
                                const logoPath = forwarderLogos[forwarderKey];
                                return (
                                  <tr key={index} className="border-b border-palette-mint/10">
                                    <td className="px-4 py-2 flex items-center">
                                      {logoPath && (
                                        <img 
                                          src={logoPath} 
                                          alt={forwarder.name} 
                                          className="w-5 h-5 object-contain mr-2" 
                                        />
                                      )}
                                      {forwarder.name}
                                    </td>
                                    <td className="px-4 py-2">{forwarder.leadTime}</td>
                                    <td className="px-4 py-2">{forwarder.onTimeRate}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="h-40 mt-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={forwarderPerformanceData}
                              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                              <XAxis dataKey="name" stroke="#15ABC0" tick={{ fill: '#15ABC0', fontSize: 10 }} />
                              <YAxis stroke="#15ABC0" />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                              />
                              <Bar dataKey="leadTime" name="Lead Time (Days)" fill="#15ABC0" />
                              <Bar dataKey="onTimeRate" name="On-Time Rate (%)" fill="#62F3F7" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <ArrowUpRight size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">Tiered SLAs:</span>
                              7 days for East/Southern Africa, 10 days for Central/West Africa.
                            </p>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <AlertTriangle size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">Penalize Delays:</span>
                              Shift 20% of Scan Global's volume to Freight in Time.
                            </p>
                          </div>
                          
                          <div className="bg-palette-blue/70 p-3 rounded-md mt-5">
                            <h5 className="text-palette-mint text-xs uppercase font-medium mb-2">Strategic Insight</h5>
                            <p className="text-sm text-white/90">
                              DHL Express offers the fastest delivery times (2-4 days) with the highest on-time rate (95%), but comes at a premium cost. Optimal strategy: Use DHL for time-critical shipments &lt;100kg, and Freight in Time for regular air freight.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 3: Territory Dominance */}
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="bg-palette-mint/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <Globe size={18} className="text-palette-mint" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">3. Territory Dominance & Zero-Quote Exploitation</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Freight Forwarder "Kingdoms"</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-white/90">
                            <thead className="text-xs uppercase bg-palette-blue/50">
                              <tr>
                                <th className="px-4 py-2 rounded-tl-md">Country</th>
                                <th className="px-4 py-2">Ruler</th>
                                <th className="px-4 py-2">Weakness</th>
                                <th className="px-4 py-2 rounded-tr-md">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {territoryData.map((territory, index) => {
                                const forwarderKey = territory.ruler.toLowerCase().replace(/\s+/g, '-');
                                const logoPath = forwarderLogos[forwarderKey];
                                return (
                                  <tr key={index} className="border-b border-palette-mint/10">
                                    <td className="px-4 py-2">{territory.country}</td>
                                    <td className="px-4 py-2 flex items-center">
                                      {logoPath && (
                                        <img 
                                          src={logoPath} 
                                          alt={territory.ruler} 
                                          className="w-5 h-5 object-contain mr-2" 
                                        />
                                      )}
                                      {territory.ruler}
                                    </td>
                                    <td className="px-4 py-2">{territory.weakness}</td>
                                    <td className="px-4 py-2">{territory.action}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Zero-Quote Tactics</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <Building2 size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">Malawi Monopoly:</span>
                              Force Kuehne to lock in rates.
                            </p>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-palette-mint/10 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                              <Map size={14} className="text-palette-mint" />
                            </div>
                            <p className="text-sm text-white/90">
                              <span className="font-medium block">South Sudan:</span>
                              Pre-position stock in Uganda via Siginon's road network.
                            </p>
                          </div>
                          
                          <div className="bg-palette-blue/70 p-3 rounded-md mt-5">
                            <h5 className="text-palette-mint text-xs uppercase font-medium mb-2">Territory Map</h5>
                            <p className="text-sm text-white/90 mb-2">
                              Forwarders dominate specific regions like kingdoms. Use their weaknesses to your advantage:
                            </p>
                            <ul className="text-sm text-white/90 space-y-1 list-disc pl-4">
                              <li>Exploit AGL's sea strength against Kuehne's air monopoly in Zimbabwe</li>
                              <li>Threaten DHL with hybrid shipment models to Comoros</li>
                              <li>Use Siginon's road expertise for East African corridors</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 4: Sustainability & Risk Mitigation */}
                  <div className="mb-8">
                    <div className="flex items-center mb-3">
                      <div className="bg-palette-mint/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <ShieldAlert size={18} className="text-palette-mint" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">4. Sustainability & Risk Mitigation</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Carbon Impact</h4>
                        <div className="text-sm text-white/90 space-y-1 mb-3">
                          <p>• Air: 3x emissions of sea.</p>
                          <p>• Winners: AGL (sea), Siginon (road).</p>
                          <p>• Target: Shift 70% volume to sea/road by 2025.</p>
                        </div>
                        
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={carbonImpactData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                label
                              >
                                {carbonImpactData.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={index === 0 ? '#ff4d4f' : index === 1 ? '#15ABC0' : '#DCCC82'} 
                                  />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value}x Carbon Impact`, 'Emissions']}
                                contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Risk Matrix</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left text-white/90">
                            <thead className="text-xs uppercase bg-palette-blue/50">
                              <tr>
                                <th className="px-4 py-2 rounded-tl-md">Forwarder</th>
                                <th className="px-4 py-2">Risk</th>
                                <th className="px-4 py-2">Sustainability</th>
                                <th className="px-4 py-2 rounded-tr-md">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-palette-mint/10">
                                <td className="px-4 py-2 flex items-center">
                                  <img src={forwarderLogos['kuehne-&-nagel']} alt="Kuehne & Nagel" className="w-5 h-5 object-contain mr-2" />
                                  Kuehne & Nagel
                                </td>
                                <td className="px-4 py-2">Medium</td>
                                <td className="px-4 py-2">Low</td>
                                <td className="px-4 py-2">Reduce to 40%</td>
                              </tr>
                              <tr className="border-b border-palette-mint/10">
                                <td className="px-4 py-2 flex items-center">
                                  <img src={forwarderLogos['freight-in-time']} alt="Freight in Time" className="w-5 h-5 object-contain mr-2" />
                                  Freight in Time
                                </td>
                                <td className="px-4 py-2">Low</td>
                                <td className="px-4 py-2">Medium</td>
                                <td className="px-4 py-2">Add 20% volume</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-2 flex items-center">
                                  <img src={forwarderLogos['scan-global']} alt="Scan Global" className="w-5 h-5 object-contain mr-2" />
                                  Scan Global
                                </td>
                                <td className="px-4 py-2">High</td>
                                <td className="px-4 py-2">Low</td>
                                <td className="px-4 py-2">Phase out</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section 7: Grand Finale */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="bg-palette-mint/20 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                        <BarChart3 size={18} className="text-palette-mint" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">The Grand Finale: Battle-Tested Scenario</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-palette-blue/50 p-4 rounded-md">
                        <h4 className="text-palette-mint mb-2 font-medium">Shipment: 10,000 kg tents to Zimbabwe</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="h-40">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={scenarioData}
                                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                                  <XAxis dataKey="type" stroke="#15ABC0" tick={{ fill: '#15ABC0', fontSize: 10 }} />
                                  <YAxis stroke="#15ABC0" />
                                  <Tooltip
                                    formatter={(value) => [formatCurrency(Number(value)), 'Total Cost']}
                                    contentStyle={{ backgroundColor: '#071777', borderColor: '#15ABC0' }}
                                  />
                                  <Bar dataKey="value" name="Cost" fill="#15ABC0">
                                    {scenarioData.map((entry, index) => (
                                      <Cell 
                                        key={`cell-${index}`} 
                                        fill={index === 0 ? '#ff4d4f' : '#15ABC0'} 
                                      />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-palette-blue/70 p-3 rounded-md">
                              <h5 className="text-white/90 text-sm font-medium mb-1">Old Way:</h5>
                              <p className="text-white/80 text-sm">Kuehne charges $24,500 (air only)</p>
                            </div>
                            
                            <div className="bg-palette-mint/10 p-3 rounded-md">
                              <h5 className="text-palette-mint text-sm font-medium mb-1">New Way:</h5>
                              <ul className="text-white/80 text-sm space-y-1">
                                <li>• 7,000 kg via AGL (sea): $13,230</li>
                                <li>• 3,000 kg via Kuehne (air): $7,350</li>
                                <li className="font-medium text-palette-mint">• Total: $20,580 (16% saved = $3,920)</li>
                              </ul>
                            </div>
                            
                            <div className="bg-palette-blue/70 p-3 rounded-md">
                              <h5 className="text-palette-mint text-xs uppercase font-medium mb-1">Why It Works</h5>
                              <p className="text-white/90 text-sm">
                                Broke Kuehne's monopoly, exploited AGL's sea strength, dodged DHL's zero quotes.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-palette-blue/70 p-4 rounded-md border-l-4 border-palette-mint">
                          <h4 className="text-white font-bold mb-2">Final Command:</h4>
                          <p className="text-white/90 italic">
                            "This is logistics as a contact sport. Use data as your weapon, forwarders as pawns, and territories as your chessboard. Crush costs, own lead times, and rule the map. 🏆🔥"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
