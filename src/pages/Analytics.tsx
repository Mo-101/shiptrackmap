
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
                    <h3 className="text-white/80 text-sm mb-2">Avg Delivery Time (days) &amp; Route Type</h3>
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
                    <div className="overflow-y-auto h-52 scrollbar-thin">
                      {topDestinations.map((destination, index) => (
                        <div key={index} className="mb-2 last:mb-0 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-palette-mint"></div>
                            <span className="text-white text-xs">{destination.country}</span>
                          </div>
                          <span className="text-palette-mint text-xs">{formatCurrency(destination.volume)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'details' ? (
            // Details tab content
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <Database size={16} className="text-palette-mint mr-2" />
                    Forwarder Performance Analysis
                  </h3>
                  <div className="relative">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={forwarderPerformanceData}>
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
                          <Bar dataKey="leadTime" name="Lead Time (days)" fill="#62F3F7" />
                          <Bar dataKey="onTimeRate" name="On-Time Delivery (%)" fill="#15ABC0" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <CircleDollarSign size={16} className="text-palette-mint mr-2" />
                    Cost Efficiency by Carrier (USD/kg)
                  </h3>
                  <div className="relative">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costEfficiencyData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                          <XAxis type="number" stroke="#15ABC0" />
                          <YAxis type="category" dataKey="name" stroke="#15ABC0" />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: '#071777', 
                              borderColor: '#15ABC0',
                              borderRadius: '4px'
                            }}
                            formatter={(value) => [`$${value}/kg`, '']}
                          />
                          <Legend />
                          <Bar dataKey="air" name="Air Freight" fill="#62F3F7" />
                          <Bar dataKey="sea" name="Sea Freight" fill="#15ABC0" />
                          <Bar dataKey="road" name="Road Freight" fill="#DCCC82" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-12">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <Layers size={16} className="text-palette-mint mr-2" />
                    Power Grid: Logistics Territory Control
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-palette-mint/20">
                          <th className="text-left py-2 text-xs text-palette-mint">Country</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Dominant Carrier</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Challenger</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Unused Potential</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerGridData.map((entry, index) => (
                          <tr key={index} className="border-b border-palette-mint/10 hover:bg-palette-mint/5">
                            <td className="py-2 text-xs text-white">{entry.country}</td>
                            <td className="py-2 text-xs text-white">{entry.overlord}</td>
                            <td className="py-2 text-xs text-white">{entry.rebels}</td>
                            <td className="py-2 text-xs text-white">{entry.unclaimed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <FileWarning size={16} className="text-palette-mint mr-2" />
                    Zero-Quote Markets &amp; Carrier Avoidance
                  </h3>
                  <div className="overflow-y-auto h-64 scrollbar-thin">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-palette-mint/20">
                          <th className="text-left py-2 text-xs text-palette-mint">Forwarder</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Avoided Countries</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Stated Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zeroQuoteData.map((entry, index) => (
                          <tr key={index} className="border-b border-palette-mint/10 hover:bg-palette-mint/5">
                            <td className="py-2 text-xs text-white">{entry.forwarder}</td>
                            <td className="py-2 text-xs text-white">{entry.countriesAvoided}</td>
                            <td className="py-2 text-xs text-white">{entry.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <ShieldAlert size={16} className="text-palette-mint mr-2" />
                    Risk &amp; Sustainability Matrix
                  </h3>
                  <div className="overflow-y-auto h-64 scrollbar-thin">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-palette-mint/20">
                          <th className="text-left py-2 text-xs text-palette-mint">Forwarder</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Risk Score</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Carbon Impact</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Capacity Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskMatrix.map((entry, index) => (
                          <tr key={index} className="border-b border-palette-mint/10 hover:bg-palette-mint/5">
                            <td className="py-2 text-xs text-white">{entry.forwarder}</td>
                            <td className="py-2 text-xs text-white">{entry.risk}</td>
                            <td className="py-2 text-xs text-white">{entry.carbon}</td>
                            <td className="py-2 text-xs text-white">{entry.capacity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Strategy tab content
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <BriefcaseBusiness size={16} className="text-palette-mint mr-2" />
                    Territory Optimization Strategy
                  </h3>
                  <div className="overflow-y-auto h-64">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-palette-mint/20">
                          <th className="text-left py-2 text-xs text-palette-mint">Country</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Current Ruler</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Weakness</th>
                          <th className="text-left py-2 text-xs text-palette-mint">Strategic Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {territoryData.map((entry, index) => (
                          <tr key={index} className="border-b border-palette-mint/10 hover:bg-palette-mint/5">
                            <td className="py-2 text-xs text-white">{entry.country}</td>
                            <td className="py-2 text-xs text-white">{entry.ruler}</td>
                            <td className="py-2 text-xs text-white">{entry.weakness}</td>
                            <td className="py-2 text-xs text-white flex items-center">
                              <ArrowUpRight size={12} className="text-palette-mint mr-1" />
                              {entry.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <TrendingUp size={16} className="text-palette-mint mr-2" />
                    Potential Cost Savings
                  </h3>
                  <div className="p-2">
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-white/80">Current Approach (Air-Focused)</span>
                        <span className="text-xs text-white/80">{formatCurrency(1896720)}</span>
                      </div>
                      <div className="w-full bg-palette-blue/40 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-white/80">Optimized Mix (70% Sea, 30% Air)</span>
                        <span className="text-xs text-white/80">{formatCurrency(1707048)}</span>
                      </div>
                      <div className="w-full bg-palette-blue/40 rounded-full h-2">
                        <div className="bg-palette-mint h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-white/80">Tender Renegotiation (All Modes)</span>
                        <span className="text-xs text-white/80">{formatCurrency(1612212)}</span>
                      </div>
                      <div className="w-full bg-palette-blue/40 rounded-full h-2">
                        <div className="bg-palette-mint h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-palette-mint/10 p-3 rounded-md mt-6">
                      <div className="flex items-center">
                        <ArrowUpCircle size={16} className="text-palette-mint mr-2" />
                        <span className="text-xs text-white font-medium">Potential Annual Savings</span>
                        <span className="text-lg text-palette-mint font-bold ml-auto">{formatCurrency(284508)}</span>
                      </div>
                      <div className="mt-2 text-xs text-white/70">
                        Implementing proposed modal shift strategy can reduce logistics costs by up to 15%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <Zap size={16} className="text-palette-mint mr-2" />
                    Modal Shift Impact
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarioData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#15ABC0" opacity={0.2} />
                        <XAxis dataKey="type" stroke="#15ABC0" />
                        <YAxis stroke="#15ABC0" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            borderColor: '#15ABC0',
                            borderRadius: '4px'
                          }}
                          formatter={(value) => [`${formatCurrency(value)}`, 'Cost']}
                        />
                        <Bar dataKey="value" fill="#15ABC0">
                          {scenarioData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? '#ff4d4f' : '#15ABC0'} 
                            />
                          ))}
                          <ChevronRight className="text-palette-mint" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="col-span-6">
                <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                  <h3 className="text-white/80 text-sm mb-4 flex items-center">
                    <LineChart size={16} className="text-palette-mint mr-2" />
                    Carbon Impact by Transport Mode
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={carbonImpactData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {carbonImpactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value}x Footprint`, 'Carbon Impact']}
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            borderColor: '#15ABC0',
                            borderRadius: '4px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
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
