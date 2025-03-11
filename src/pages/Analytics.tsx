import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, AlertTriangle, Clock, Package, 
  TruckIcon, DollarSign, PieChart as PieChartIcon, ShieldAlert, AreaChart as AreaChartIcon,
  Globe, Building2, Weight, CircleDollarSign, CalendarClock, Truck, Map, ArrowLeft
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
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
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

  return (
    <div className="min-h-screen bg-palette-darkblue text-white">
      <NavHeader toggleSidebar={() => {}} />
      
      <div className="overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
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
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-2 border-t-palette-mint/80 border-r-palette-mint/60 border-b-palette-mint/40 border-l-palette-mint/20 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-palette-mint text-xs">LOADING</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              {/* Left sidebar with KPIs */}
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {/* 1. Total Cost */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <DollarSign size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Total Cost</h3>
                  </div>
                  <div ref={costRef} className="text-white text-xl font-bold mt-1">$0</div>
                </div>
                
                {/* 2. Total Shipments */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <Package size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Total Shipments</h3>
                  </div>
                  <div ref={shipmentsRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 3. Total Freight Forwarders */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <Building2 size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Freight Forwarders</h3>
                  </div>
                  <div ref={forwardersRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 4. Total Countries */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <Globe size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Total Countries</h3>
                  </div>
                  <div ref={countriesRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 5. Weight */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <Weight size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Total Weight (Kg)</h3>
                  </div>
                  <div ref={weightRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 6. Volume */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <Map size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Total Volume (CBM)</h3>
                  </div>
                  <div ref={volumeRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 7. Average days of Transportation */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <CalendarClock size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Avg Transport (Days)</h3>
                  </div>
                  <div ref={transportDaysRef} className="text-white text-xl font-bold mt-1">0</div>
                </div>
                
                {/* 8. Average Cost per Kg */}
                <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-palette-mint/10 w-8 h-8 flex items-center justify-center">
                      <CircleDollarSign size={16} className="text-palette-mint" />
                    </div>
                    <h3 className="text-white/80 text-sm">Avg Cost per Kg</h3>
                  </div>
                  <div ref={costPerKgRef} className="text-white text-xl font-bold mt-1">$0</div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="col-span-9 grid grid-cols-9 gap-4">
                {/* Row 1 */}
                <div className="col-span-3">
                  {/* Total Fleet */}
                  <div className="bg-palette-blue/30 p-3 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Total Fleet</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold text-palette-mint">{fleetData.total}</div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-palette-mint"></div>
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
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Fleet Efficiency</h3>
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-32 h-32">
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
                        <div className="w-32 h-32 rounded-full border border-palette-mint/20 animate-pulse opacity-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-3">
                  {/* Logistics Efficiency Score */}
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20 h-full">
                    <h3 className="text-white/80 text-sm mb-2">Logistics Efficiency Score</h3>
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-32 h-32">
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
                        <div className="w-32 h-32 rounded-full border border-palette-mint/20 animate-pulse opacity-30"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="col-span-3">
                  {/* Deliveries by Carrier */}
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Carrier Market Share</h3>
                    <div className="h-56">
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
                            {topCarriers.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
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
                  </div>
                </div>
                
                <div className="col-span-6">
                  {/* Average Delivery Time (days) & Route Type */}
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Avg Delivery Time (days) & Route Type</h3>
                    <div className="h-56">
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
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Country Risk Assessment</h3>
                    <div className="h-56">
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
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Top Destinations</h3>
                    <div className="h-56">
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
                  <div className="bg-palette-blue/30 p-4 rounded-md border border-palette-mint/20">
                    <h3 className="text-white/80 text-sm mb-2">Monthly Shipment Trends</h3>
                    <div className="h-56">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
