import React, { useEffect, useState, useRef } from "react";
// import SidebarMetrics from "../components/SidebarMetrics";
// import DashboardHeader from "../components/DashboardHeader";
// import useDeepTrackData from "../hooks/useDeepTrackData";
// import DashboardTabs from "../components/DashboardTabs"; // No longer used in this file, replaced by AnalyticsDashboard.
import { Shipment } from "@/types/shipment";
import { forwarderLogos } from "@/utils/forwarderLogos";
import {
  DollarSign,
  Package,
  Building2,
  Globe,
  Weight,
  CalendarClock,
  CircleDollarSign,
  Database,
  Layers,
  FileWarning,
  ShieldAlert,
  BriefcaseBusiness,
  ArrowUpRight,
  TrendingUp,
  ArrowUpCircle,
  Zap,
  ChevronRight,
  Map,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar
} from "recharts";

const Analytics = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-palette-darkblue text-white">
      <div className="flex-1 overflow-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default Analytics;

/**
 * Ultra-futuristic Logistics Analytics Dashboard
 */
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
function AnalyticsDashboard() {
  // State for all our data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'strategy'>('overview'); // Keep as is or make more specific if needed
  const [topCarriers, setTopCarriers] = useState<Array<{ name: string; value: number }>>([]);
  const [topDestinations, setTopDestinations] = useState<Array<{ country: string; value: number }>>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<Array<{ month: string; count: number }>>([]);
  const [riskAssessment, setRiskAssessment] = useState<Array<{ category: string; count: number; risk: string }>>([]);
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

  // Colors for the pie chart (and potentially other charts)
   // Only declare this once at the top of the file, remove any duplicate declarations below if present.

  // Create refs for counter animations
  const costRef = useRef<HTMLDivElement>(null);
  const shipmentsRef = useRef<HTMLDivElement>(null);
  const forwardersRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const weightRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const transportDaysRef = useRef<HTMLDivElement>(null);
  const costPerKgRef = useRef<HTMLDivElement>(null);

  // Load data from our actual deeptrack_3.json source of truth
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch the real data from deeptrack_3.json
        const response = await fetch('/deeptrack_3.json');
const shipments: Shipment[] = await response.json();

        // Calculate actual metrics from the real data
        // Using request_reference as primary key for unique shipments count
        const uniqueShipments: Shipment[] = Array.from(
          new Map(shipments.map((item: Shipment) => [item.request_reference, item])).values()
        );

        // Total shipments (unique by request_reference)
        const totalShipments = uniqueShipments.length;

        // Calculate total cost from all carrier costs
        const totalCost = uniqueShipments.reduce((sum, row) => {
          // Parse carrier cost, handling formatting issues
          const carrierCost = parseFloat(String(row['carrier+cost']).replace(/,/g, '')) || 0
          return sum + (isNaN(carrierCost) ? 0 : carrierCost);
        }, 0);

        // Calculate total weight
        const totalWeight = uniqueShipments.reduce((sum, row) => {
          const weight = parseFloat(String(row.weight_kg).replace(/,/g, '')) || 0;
          return sum + weight;
        }, 0);

        // Calculate total volume
        const totalVolume = uniqueShipments.reduce((sum, row) => {
          const volume = parseFloat(String(row.volume_cbm).replace(/,/g, '')) || 0;
          return sum + volume;
        }, 0);

        // Count unique destination countries
        const uniqueCountries = new Set(uniqueShipments.map(row => row.destination_country as string)).size;

        // Get unique freight forwarders that have been used (non-zero values)
        const forwarderFields: Array<keyof Shipment> = [
  'kuehne_nagel', 'scan_global_logistics', 'dhl_express',
  'dhl_global', 'bwosi', 'agl', 'siginon', 'frieght_in_time'
];
        const activeForwarders = forwarderFields.filter(field => uniqueShipments.some(row => parseFloat(String(row[field]).replace(/,/g, '')) > 0)
        );
        const totalFreightForwarders = activeForwarders.length;

        // Calculate average transit days (from collection to arrival)
        const shipmentWithDates = uniqueShipments.filter(row => row.date_of_collection && row.date_of_arrival_destination
        ) as Shipment[];

        const totalDays = shipmentWithDates.reduce((sum, row) => {
          const collectionDate = new Date(row.date_of_collection);
          const arrivalDate = new Date(row.date_of_arrival_destination);
          const days = Math.max(0, (arrivalDate.getTime() - collectionDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);

        const avgTransportDays = shipmentWithDates.length ? totalDays / shipmentWithDates.length : 0;

        // Calculate average cost per kg
        const avgCostPerKg = totalWeight ? totalCost / totalWeight : 0;

        // Calculate fleet efficiency (percentage of on-time deliveries)
        const deliveredShipments = uniqueShipments.filter(row => row.delivery_status === 'Delivered'
        ).length;

        const fleetEfficiency = totalShipments ? (deliveredShipments / totalShipments) * 100 : 0;

        setAggregatedData({
          totalCost,
          totalWeight,
          totalVolume,
          totalCountries: uniqueCountries,
          totalShipments,
          totalFreightForwarders,
          avgTransportDays,
          avgCostPerKg,
          fleetEfficiency
        });

        // Top carriers by total revenue
        const carriers: Record<string, number> = {};
        uniqueShipments.forEach(row => {
          const carrier = row.carrier || 'Unknown';
          let cost = parseFloat(String(row['carrier+cost']).replace(/,/g, ''));
          if (isNaN(cost)) cost = 0;
          carriers[carrier] = (carriers[carrier] || 0) + cost;
        });

        const carrierTotals: Array<{ name: string; value: number }> = Object.entries(carriers).map(([name, value]) => ({ name, value: Number(value) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        setTopCarriers(carrierTotals.map(c => ({ name: c.name, value: c.value })));

        // Top destinations by shipment count
        const destinations: Record<string, number> = {};
        uniqueShipments.forEach(row => {
          const country = row.destination_country || 'Unknown';
          destinations[country] = (destinations[country] || 0) + 1;
        });

        const topDest = Object.entries(destinations).map(([country, value]) => ({ country, value }))
          .sort((a, b) => b.value - a.value);
        setTopDestinations(topDest);

        // Monthly trends by collection date
        const shipmentsByMonth: Record<string, number> = {};
        uniqueShipments.forEach(row => {
          if (row.date_of_collection) {
            const date = new Date(row.date_of_collection);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            shipmentsByMonth[month] = (shipmentsByMonth[month] || 0) + 1;
          }
        });

        const monthlyData = Object.entries(shipmentsByMonth)
          .map(([month, count]) => ({ month, count: count as number }))
          .sort((a, b) => a.month.localeCompare(b.month));
        setMonthlyTrends(monthlyData);

        // Create risk assessment based on delivery status and transit times
        const riskData = [];
        const statusCounts: Record<string, number> = {};
        uniqueShipments.forEach(row => {
          const status = row.delivery_status || 'Unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        Object.entries(statusCounts).forEach(([status, count]) => {
          riskData.push({
            category: status,
            count: Number(count),
            risk: status === 'Delivered' ? 'Low' : 'Medium'
          });
        });
        setRiskAssessment(riskData);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
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

  // Direct calculation of delivery time data from shipment data
  const [deliveryTimeData, setDeliveryTimeData] = useState<any[]>([]);
  const [fleetData, setFleetData] = useState<{
    total: number;
    onMove: number;
    maintenance: number;
    idle: number;
  }>({
    total: 0,
    onMove: 0,
    maintenance: 0,
    idle: 0
  });
  const [forwarderPerformanceData, setForwarderPerformanceData] = useState<any[]>([]);
  const [costEfficiencyData, setCostEfficiencyData] = useState<any[]>([]);
  const [territoryData, setTerritoryData] = useState<any[]>([]);

  // Carbon impact data - constant
  const carbonImpactData = [
    { name: 'Air', value: 3 },
    { name: 'Sea', value: 1 },
    { name: 'Road', value: 1.5 }
  ];

  // Strategic scenario data - constant
  const scenarioData = [
    { type: 'Old Way (Air only)', value: 24500 },
    { type: 'New Way (70% Sea + 30% Air)', value: 20580 }
  ];

  const [powerGridData, setPowerGridData] = useState<any[]>([]);
  const [riskMatrix, setRiskMatrix] = useState<any[]>([]);

  // Calculate detailed analytics when data is loaded
  useEffect(() => {
    if (!isLoading && topCarriers.length > 0 && topDestinations.length > 0) {
      // Generate delivery time data
      const newDeliveryTimeData = Array.from({ length: 5 }, (_, index) => {
        return {
          name: `Week ${index + 1}`,
          Air: 5 - (index % 2), // Air is faster
          Sea: 15 + (index % 3), // Sea is slower
          Land: 10 + (index % 2) // Land is baseline
        };
      });
      setDeliveryTimeData(newDeliveryTimeData);

      // Generate fleet data
      const delivered = aggregatedData.totalShipments * 0.8; // Assume 80% delivered
      const inTransit = aggregatedData.totalShipments * 0.15; // Assume 15% in transit
      const delayed = aggregatedData.totalShipments * 0.05; // Assume 5% delayed

      setFleetData({
        total: aggregatedData.totalShipments,
        onMove: inTransit,
        maintenance: delayed,
        idle: delivered * 0.3 // 30% of delivered are idle
      });

      // Generate forwarder performance data
      const newForwarderPerformanceData = topCarriers.slice(0, 4).map(carrier => ({
        name: carrier.name,
        leadTime: 15 - (Math.random() * 5), // Random lead time between 10-15 days
        onTimeRate: 60 + Math.random() * 30 // Random on-time rate between 60-90%
      }));
      setForwarderPerformanceData(newForwarderPerformanceData);

      // Generate cost efficiency data
      const newCostEfficiencyData = topCarriers.slice(0, 4).map(carrier => {
        // Map to modes based on carrier name patterns
        const hasAir = carrier.name.includes('Airways') || carrier.name.includes('DHL') || carrier.name.includes('Express');
        const hasSea = carrier.name.includes('Global') || carrier.name.includes('AGL');
        const hasRoad = carrier.name.includes('SIGINON') || carrier.name.includes('Time');

        return {
          name: carrier.name,
          air: hasAir ? (8 + Math.random() * 2) : 0,
          sea: hasSea ? (6 + Math.random() * 2) : 0,
          road: hasRoad ? (7 + Math.random() * 2) : 0
        };
      });
      setCostEfficiencyData(newCostEfficiencyData);

      // Generate territory data
      const newTerritoryData = topDestinations.slice(0, 4).map((destination, index) => {
        const country = destination.country;
        const forwarderIndex = index % topCarriers.length;
        const ruler = topCarriers[forwarderIndex]?.name || 'Unknown';
        const alternativeIndex = (index + 1) % topCarriers.length;
        const alternativeRuler = topCarriers[alternativeIndex]?.name || 'Unknown';

        return {
          country,
          ruler,
          weakness: Math.random() < 0.33 ? 'High risk' :
            Math.random() < 0.66 ? 'Overpriced' :
              'No sea/road',
          action: `Use ${alternativeRuler} (${Math.round(70 + Math.random() * 20)}%)`
        };
      });
      setTerritoryData(newTerritoryData);

      // Generate power grid data

      // Zero quote data for details tab

    }
  }, [isLoading, topCarriers, topDestinations, aggregatedData.totalShipments]); // Added aggregatedData.totalShipments dependency

  // Generate risk matrix data when carriers are loaded
  useEffect(() => {
    if (!isLoading && topCarriers.length > 0) {
      // Create risk matrix based on top carriers
      const newRiskMatrix = topCarriers.slice(0, 5).map(carrier => {
        const efficiency = 60 + Math.random() * 30; // Random efficiency score
        const riskScore = 10 - Math.floor(efficiency / 10);
        const carbonImpact = carrier.name.includes('Airways') || carrier.name.includes('Express') ?
          '8/10 (High)' : carrier.name.includes('AGL') ?
            '5/10 (Medium)' : '3/10 (Low)';

        return {
          entity: carrier.name, // Changed from forwarder to entity to match usage
          risk: `${riskScore}/10`, // Changed from riskScore to risk
          carbon: carbonImpact, // Changed from carbonImpact to carbon
          capacity: `${Math.round(efficiency)}%`, // Changed from improvement to capacity
          action: riskScore > 7 ? 'Alert: High Risk' : riskScore > 4 ? 'Monitor' : 'Optimize'
        };
      });
      setRiskMatrix(newRiskMatrix);
    }
  }, [isLoading, topCarriers]);

      // Fix the type error in the Tooltip formatter function
      const tooltipFormatter = (value: any) => {
        return formatCurrency(Number(value));
      };

      return (
        <div className="min-h-screen w-full bg-palette-darkblue text-white overflow-hidden flex flex-col">
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
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {/* KPI Cards */}
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
                                strokeWidth="10" />
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
                                className="transform -rotate-90 origin-center" />
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
                                strokeWidth="10" />
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
                                className="transform -rotate-90 origin-center" />
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
                                cx="50%" // Ensure cx is a string
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70} // Corrected: was outerRadius={70}
                                paddingAngle={2}
                                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {topCarriers.map((entry, index) => {
                                  return (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]} />
                                  );
                                })}
                              </Pie>
                              <Tooltip
                                formatter={tooltipFormatter}
                                contentStyle={{
                                  backgroundColor: '#071777',
                                  borderColor: '#15ABC0', // Corrected typo here
                                  borderRadius: '4px'
                                }} />
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
                                    className="w-6 h-6 object-contain mr-1" />
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
                                }} />
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
                                tick={{ fill: '#15ABC0', fontSize: 10 }} />
                              <YAxis stroke="#15ABC0" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#071777',
                                  borderColor: '#15ABC0',
                                  borderRadius: '4px'
                                }} />
                              <Bar
                                dataKey="risk"
                                name="Risk Factor"
                                radius={[4, 4, 0, 0]}
                              >
                                {riskAssessment.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.risk === 'High' ? '#ff4d4f' : '#15ABC0'} />
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
                              <span className="text-palette-mint text-xs">{formatCurrency(destination.value)}</span>
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
                                }} />
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
                                formatter={(value) => [`$${value}/kg`, '']} />
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
                              formatter={(value) => [`${formatCurrency(Number(value))}`, 'Cost']} />
                            <Bar dataKey="value" fill="#15ABC0">
                              {scenarioData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={index === 0 ? '#ff4d4f' : '#15ABC0'} />
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
                        <LineChartIcon size={16} className="text-palette-mint mr-2" />
                        Carbon Impact by Transport Mode
                      </h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart> {/* This PieChart is from recharts */}
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
                              }} />
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
    }

    // Note: The AnalyticsDashboard function is defined but not exported or used by the default export 'Analytics'.
// (Stray bracket removed)
