
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, AlertTriangle, Clock, Package, 
  TruckIcon, DollarSign, PieChartIcon, ShieldAlert, AreaChartIcon,
  Globe, Building2, Weight, CircleDollarSign, CalendarClock, Truck, Map, ArrowLeft, 
  BookOpen, ArrowUpRight, ChevronRight, Database, Layers, Zap, BriefcaseBusiness,
  LineChart, PanelRight, LayoutGrid, Activity, HardDriveDownload, FileWarning, ArrowUpCircle
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer, 
  AreaChart, Area, LineChart as RechartLineChart, Line, CartesianGrid
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

  // Power grid data for details tab
  const powerGridData = [
    { country: 'Zimbabwe', overlord: 'Kuehne & Nagel (Air)', rebels: 'AGL (Sea)', unclaimed: 'DHL, Scan Global' },
    { country: 'DR Congo', overlord: 'Kuehne & Nagel (Air)', rebels: 'Freight in Time', unclaimed: 'DHL, Siginon' },
    { country: 'Comoros', overlord: 'Freight in Time', rebels: 'Kuehne & Nagel', unclaimed: 'Scan Global, DHL' },
    { country: 'Ethiopia', overlord: 'Scan Global', rebels: 'Freight in Time', unclaimed: 'Kuehne & Nagel' },
    { country: 'Malawi', overlord: 'Kuehne & Nagel', rebels: 'None', unclaimed: 'All others' }
  ];

  // Zero quote data for details tab
  const zeroQuoteData = [
    { forwarder: 'DHL Express', countriesAvoided: 'Zimbabwe, Malawi', reason: '"Too poor, too heavy" – low margins' },
    { forwarder: 'Scan Global', countriesAvoided: 'Burundi, Malawi', reason: '"No profit in peasant wars" – small markets' },
    { forwarder: 'AGL', countriesAvoided: 'All except Zimbabwe', reason: '"We only sail where the sea whispers"' },
    { forwarder: 'Siginon', countriesAvoided: 'All except South Sudan', reason: '"Roads are our kingdom"' }
  ];

  // Risk and sustainability matrix for details tab
  const riskMatrix = [
    { forwarder: 'Kuehne & Nagel', risk: '6/10', carbon: '8/10 (High)', capacity: '10,000+ kg' },
    { forwarder: 'Freight in Time', risk: '3/10', carbon: '5/10 (Medium)', capacity: '5,000 kg' },
    { forwarder: 'AGL', risk: '7/10', carbon: '2/10 (Low)', capacity: '7,000 kg (Sea)' },
    { forwarder: 'DHL Express', risk: '4/10', carbon: '9/10 (Very High)', capacity: '1,000 kg (Air)' },
    { forwarder: 'Scan Global', risk: '5/10', carbon: '7/10 (High)', capacity: '3,000 kg' }
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
                    <div className="space-y-2 mt-2">
                      {topDestinations.slice(0, 5).map((destination, index) => (
                        <div key={index} className="flex items-center justify-between bg-palette-blue/50 p-2 rounded">
                          <div className="flex items-center">
                            <span className="text-palette-mint font-bold mr-2">{index + 1}.</span>
                            <span className="text-white">{destination.country}</span>
                          </div>
                          <div className="text-white/70 text-xs">{destination.count} shipments</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'details' ? (
            <div className="space-y-6">
              <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                <h2 className="text-xl font-bold text-white mb-4">
                  <span className="text-palette-mint">The Freight Forwarder Chronicles:</span> A Data-Driven Saga
                </h2>
                <p className="text-sm text-white/70 italic mb-4">
                  This isn't just analysis. It's a strategic epic where freight forwarders are kingdoms, zero quotes are betrayals, and you're the ruler deciding whom to trust.
                </p>
                
                {/* Act 1: The Kingdom Map */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Act 1: The Kingdom Map – Who Rules Which Lands?</h3>
                  <div className="text-sm text-white/80 mb-3">
                    Data Insight: Forwarders avoid certain countries like cursed territories. Zero quotes = power vacuums.
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">The Power Grid</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-palette-blue/50 rounded-md">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Country</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Overlord</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Rebel Forces</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Unclaimed Lands</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerGridData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-palette-blue/30' : ''}>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.country}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.overlord}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.rebels}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.unclaimed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-palette-blue/50 rounded-md border-l-4 border-palette-mint">
                    <h4 className="text-white font-medium mb-2">The Plot Twist:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                      <li>Kuehne & Nagel acts like an empire, controlling landlocked regions but ignores sea routes.</li>
                      <li>DHL is the "pirate king" of islands (Comoros, Madagascar) but flees from mainland Africa.</li>
                      <li>AGL/Siginon are rebels in the shadows—AGL sneaks into Zimbabwe via sea, Siginon ambushes South Sudan by road.</li>
                    </ul>
                  </div>
                </div>
                
                {/* Act 2: The Zero Quote Conspiracy */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Act 2: The Zero Quote Conspiracy – Why Forwarders Betray</h3>
                  <div className="text-sm text-white/80 mb-3">
                    Decoding the Silence: Who's avoiding which territories and why
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-palette-blue/50 rounded-md">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Forwarder</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Countries They Avoid</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Likely Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zeroQuoteData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-palette-blue/30' : ''}>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.forwarder}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.countriesAvoided}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 p-3 bg-palette-blue/50 rounded-md border-l-4 border-red-400">
                    <h4 className="text-white font-medium mb-2">Case Study: The Siege of Malawi</h4>
                    <div className="space-y-2 text-sm text-white/80">
                      <p><span className="text-palette-mint font-medium">What Happened:</span> 3 shipments (SR_24-014, SR_24-044, SR_24-084) – only Kuehne & Nagel quoted.</p>
                      <p><span className="text-palette-mint font-medium">Why:</span> Malawi is landlocked, low-volume, and lacks port access. Other forwarders see no gold here.</p>
                      <p><span className="text-palette-mint font-medium">Your Move:</span> Exploit Kuehne's monopoly. Demand a fixed annual rate or threaten to build a rebel alliance with Siginon for road routes from Tanzania.</p>
                    </div>
                  </div>
                </div>
                
                {/* Act 3: The Secret Language of Forwarders */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Act 3: The Secret Language of Forwarders – Cracking Their Codes</h3>
                  <div className="text-sm text-white/80 mb-3">
                    How to Predict Their Moves and Counter Them
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">Kuehne & Nagel: Uses "air dominance" to bully clients.</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li><span className="text-red-400">Trigger:</span> If you ship >5,000 kg to DRC, they'll quote 10% higher.</li>
                        <li><span className="text-green-400">Counter:</span> Pretend to negotiate with Scan Global—they'll panic and lower rates.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">Freight in Time: Masters the "consolidation game".</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li><span className="text-red-400">Trigger:</span> They'll underbid Kuehne by 15% if shipments can wait 7+ days.</li>
                        <li><span className="text-green-400">Counter:</span> Bundle 3 small Malawi orders into one—suddenly, they'll bid.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">DHL: Obsessed with "urgency tax".</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li><span className="text-red-400">Trigger:</span> They'll quote $5/kg for <100 kg to islands.</li>
                        <li><span className="text-green-400">Counter:</span> Ship 90% via sea (AGL) and 10% via DHL—cut costs by 40%.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Act 4: Risk & Sustainability Matrix */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Act 4: Risk & Sustainability Matrix</h3>
                  <div className="text-sm text-white/80 mb-3">
                    Balance risk, carbon impact, and capacity when choosing your allies
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-palette-blue/50 rounded-md">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Forwarder</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Risk Score</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Carbon Impact</th>
                          <th className="px-4 py-2 text-left text-palette-mint border-b border-palette-mint/20">Capacity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskMatrix.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-palette-blue/30' : ''}>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.forwarder}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.risk}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.carbon}</td>
                            <td className="px-4 py-2 border-b border-palette-mint/10">{row.capacity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Act 5: The Battle of Zimbabwe */}
                <div>
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Epilogue: The Battle of Zimbabwe – A Victory Blueprint</h3>
                  <div className="text-sm text-white/80 mb-3">
                    Scenario: 10,000 kg of tents to Zimbabwe (SR_24-041 style).
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">Old Strategy:</h4>
                      <p className="text-lg font-bold text-red-400">Kuehne & Nagel charges $24,500 (air)</p>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">New Strategy:</h4>
                      <ul className="space-y-1 text-sm text-white/80">
                        <li>7,000 kg via AGL (sea): $13,230</li>
                        <li>3,000 kg via Kuehne (air): $7,350</li>
                        <li className="pt-2 text-lg font-bold text-green-400">Total: $20,580 (16% saved)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-palette-blue/50 rounded-md border-l-4 border-palette-mint">
                    <h4 className="text-white font-medium mb-2">Why You Win:</h4>
                    <p className="text-sm text-white/80">You turned AGL's sea rebellion into a weapon and broke Kuehne's air monopoly.</p>
                    <p className="mt-3 text-sm italic text-palette-mint">Final Wisdom: Freight forwarders are chess pieces—pawns, knights, and occasional queens. Your job? Play the board, not the pieces. 🏰🔥</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                <h2 className="text-xl font-bold text-white mb-4">
                  <span className="text-palette-mint">Consolidated Freight Analytics & Strategic Workflow</span>
                </h2>
                <p className="text-sm text-white/70 italic mb-4">
                  An end-to-end framework combining all insights into a unified, actionable workflow—from data crunching to execution. This is your playbook to dominate the freight game.
                </p>
                
                {/* Phase 1: Data Preparation & Enrichment */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Phase 1: Data Preparation & Enrichment</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">1.1 Data Cleaning</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li>Fix Zero Quotes: Tag cells with "$0" as "No Quote" to identify gaps.</li>
                        <li>Standardize Units: Convert all weights to kg, volumes to CBM, and costs to USD.</li>
                        <li>Geocode Destinations: Add latitude/longitude for route distance calculations.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">1.2 Enrich with External Data</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li>Carbon Emissions: Use IATA/IMO calculators to assign CO2/kg for air/sea/road.</li>
                        <li>Political Risk Scores: Add World Bank governance scores for each country.</li>
                        <li>Disease Outbreaks: Integrate WHO alerts to forecast demand.</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Phase 2: Core Analytics Layers */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Phase 2: Core Analytics Layers</h3>
                  
                  <div className="bg-palette-blue/50 p-3 rounded-md mb-4">
                    <h4 className="text-white font-medium mb-2">2.1 Freight Forwarder Power Grid</h4>
                    <p className="text-sm text-white/80 italic mb-2">(Who controls which countries?)</p>
                    
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left text-palette-mint border-b border-palette-mint/20">Metric</th>
                          <th className="px-2 py-1 text-left text-palette-mint border-b border-palette-mint/20">Tool</th>
                          <th className="px-2 py-1 text-left text-palette-mint border-b border-palette-mint/20">Output</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Country Dominance</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Heatmaps (Power BI)</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Visualize forwarder "territories"</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Zero-Quote Analysis</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Pareto Charts</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Identify "ghosted" countries</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Rate Benchmarking</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Comparative Tables</td>
                          <td className="px-2 py-1 border-b border-palette-mint/10">Avg. cost/kg per forwarder</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">2.2 Predictive Intelligence</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li>Quote Acceptance Model: Predict which forwarder will bid.</li>
                        <li>Lead Time Simulator: Estimate delivery dates based on history.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">2.3 Risk & Sustainability Matrix</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="px-2 py-1 text-left text-xs text-palette-mint border-b border-palette-mint/20">Forwarder</th>
                              <th className="px-2 py-1 text-left text-xs text-palette-mint border-b border-palette-mint/20">Risk</th>
                              <th className="px-2 py-1 text-left text-xs text-palette-mint border-b border-palette-mint/20">Carbon</th>
                              <th className="px-2 py-1 text-left text-xs text-palette-mint border-b border-palette-mint/20">Capacity</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs">
                            <tr>
                              <td className="px-2 py-1 border-b border-palette-mint/10">Kuehne & Nagel</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">6/10</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">High</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">10,000+ kg</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-b border-palette-mint/10">Freight in Time</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">3/10</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">Medium</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">5,000 kg</td>
                            </tr>
                            <tr>
                              <td className="px-2 py-1 border-b border-palette-mint/10">AGL</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">7/10</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">Low</td>
                              <td className="px-2 py-1 border-b border-palette-mint/10">7,000 kg (Sea)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phase 3: Strategic Actions */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Phase 3: Strategic Actions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">3.1 Country-Specific Playbooks</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <div>
                          <p className="font-medium">Landlocked Nations:</p>
                          <p>Primary: Kuehne & Nagel (air) + AGL (sea).</p>
                          <p>Tactic: Use AGL's sea route for 70% volume.</p>
                        </div>
                        <div>
                          <p className="font-medium">Island Nations:</p>
                          <p>Primary: DHL (urgent) + Freight in Time.</p>
                          <p>Tactic: Bundle shipments for critical items.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">3.2 Zero-Quote Exploitation</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                        <li>Identify ghosted countries (e.g., Malawi).</li>
                        <li>Forge alliances (e.g., pre-pay Siginon for road access).</li>
                        <li>Threaten dominant forwarders with alternatives.</li>
                      </ol>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">3.3 Dynamic Forwarder Juggling</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <div>
                          <p className="font-medium">Rule 1: Air vs. Sea Thresholds</p>
                          <p>If shipment >5,000 kg + lead time >14 days → Sea</p>
                          <p>If shipment <100 kg + lead time <3 days → DHL</p>
                        </div>
                        <div>
                          <p className="font-medium">Rule 2: Consolidation Alerts</p>
                          <p>Auto-flag shipments to the same country within 7 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phase 4: Execution & Monitoring */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Phase 4: Execution & Monitoring</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">4.1 Real-Time Dashboard</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                        <li>Layer 1: Freight Forwarder Chessboard</li>
                        <li>Layer 2: Cost vs. Speed Matrix</li>
                        <li>Layer 3: Carbon Tracker</li>
                      </ul>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">4.2 Automated Alerts</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <p>"Kuehne & Nagel's Malawi rate increased by 12%—activate Siginon road backup."</p>
                        <p>"DHL skipped 3 Comoros bids—switch to Freight in Time."</p>
                      </div>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">4.3 Performance Feedback Loop</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <p className="font-medium">Forwarder Report Cards:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Cost adherence (e.g., Kuehne = B+)</li>
                          <li>On-time rate (e.g., Freight in Time = A)</li>
                          <li>Sustainability (e.g., AGL = A-)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Phase 5: Adaptive Strategy */}
                <div className="mb-6">
                  <h3 className="text-palette-mint text-lg font-semibold mb-2">Phase 5: Adaptive Strategy</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">5.1 Predictive Scenario Planning</h4>
                      <div className="space-y-3 text-sm text-white/80">
                        <div>
                          <p className="font-medium">Scenario 1: Cholera outbreak in Zimbabwe.</p>
                          <p>Action: Pre-ship 5,000 kg via AGL (sea) + secure DHL for emergency air.</p>
                        </div>
                        <div>
                          <p className="font-medium">Scenario 2: Fuel prices spike 20%.</p>
                          <p>Action: Shift 15% air volume to sea/road and renegotiate Kuehne contracts.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-palette-blue/50 p-3 rounded-md">
                      <h4 className="text-white font-medium mb-2">5.2 Forwarder "Training"</h4>
                      <div className="space-y-2 text-sm text-white/80">
                        <p><span className="text-green-400 font-medium">Carrot:</span> Award AGL/Siginon 10% more volume if they expand to new countries.</p>
                        <p><span className="text-red-400 font-medium">Stick:</span> Penalize Scan Global 5% for delays; publish their scorecard internally.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="bg-palette-blue/50 p-4 rounded-md border-l-4 border-palette-mint">
                  <h3 className="text-white font-medium mb-2">Workflow Summary</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-white/80">
                    <li>Data Prep: Clean, tag zeros, enrich with external metrics.</li>
                    <li>Analyze: Map forwarder territories, benchmark rates, predict behavior.</li>
                    <li>Strategize: Exploit gaps, juggle forwarders, enforce rules.</li>
                    <li>Execute: Monitor via dashboard, automate alerts, audit monthly.</li>
                    <li>Adapt: Simulate scenarios, train/punish forwarders, iterate.</li>
                  </ol>
                  
                  <div className="mt-4 p-3 bg-palette-blue/70 rounded-md">
                    <h4 className="text-palette-mint font-medium mb-1">The Grand Finale: A Unified Story</h4>
                    <p className="text-sm text-white/80">Imagine this workflow as a war room:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
                      <li>Map on the Wall: Forwarders battle for countries, zeros glow red.</li>
                      <li>Alerts Blinking: "Malawi at risk—activate Siginon!"</li>
                      <li>Carbon Meter Ticking: "Switch 20% to sea—save 12 tons CO2."</li>
                    </ul>
                    <p className="mt-2 text-sm font-bold text-palette-mint">Outcome: You cut costs by 18%, boost on-time delivery to 92%, and slash emissions by 25%—all while outmaneuvering forwarders in their own game.</p>
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
