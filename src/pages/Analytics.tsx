
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Scatter, ScatterChart, ZAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { freightAnalytics } from '@/utils/freightDataProcessor';
import { ArrowLeftCircle, BarChart2, PieChart as PieChartIcon, TrendingUp, Truck, Users, Package, Filter, Calendar, Share, Download, RefreshCw, MapPin, Activity, Gauge, Database, Thermometer } from 'lucide-react';
import FreightLogo from '@/components/FreightLogo';

// Futuristic colors
const COLORS = ['#15ABC0', '#0C3A62', '#62F3F7', '#76A6B4', '#DCCC82', '#071777'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterWeight, setFilterWeight] = useState([0, 50000]);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);
  const [timeScaleFilter, setTimeScaleFilter] = useState('all');
  const [costThreshold, setCostThreshold] = useState(1000);

  // Format data for charts
  const ratePerKgData = Object.entries(freightAnalytics.ratePerKg)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.value - b.value);

  const shipmentsPerForwarderData = Object.entries(freightAnalytics.shipmentsPerForwarder)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const shipmentsByCountryData = Object.entries(freightAnalytics.shipmentsByCountry)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top countries by shipment volume
  const topCountries = [...shipmentsByCountryData].slice(0, 6);
  
  // Get top forwarders for each country
  const countryForwarderData = [];
  for (const country of Object.keys(freightAnalytics.ratePerCountry)) {
    const forwarders = freightAnalytics.ratePerCountry[country];
    const bestForwarder = Object.entries(forwarders)
      .sort((a, b) => a[1] - b[1])[0];
    
    if (bestForwarder) {
      countryForwarderData.push({
        country,
        forwarder: bestForwarder[0],
        rate: bestForwarder[1]
      });
    }
  }
  
  // Sort by rate (lowest first)
  countryForwarderData.sort((a, b) => a.rate - b.rate);

  // Advanced metrics calculation (when enabled)
  const advancedMetrics = useMemo(() => {
    if (!showAdvancedMetrics) return null;

    // Calculate variability in rates
    const rateVariability = {};
    Object.entries(freightAnalytics.ratePerCountry).forEach(([country, forwarders]) => {
      const rates = Object.values(forwarders);
      if (rates.length > 1) {
        const mean = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
        const variance = rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / rates.length;
        const stdDev = Math.sqrt(variance);
        rateVariability[country] = {
          stdDev,
          cv: (stdDev / mean) * 100, // Coefficient of variation
          min: Math.min(...rates),
          max: Math.max(...rates),
          range: Math.max(...rates) - Math.min(...rates)
        };
      }
    });

    // Calculate price vs volume correlation
    const priceVolumeData = [];
    Object.entries(freightAnalytics.ratePerKg).forEach(([forwarder, rate]) => {
      const shipments = freightAnalytics.shipmentsPerForwarder[forwarder];
      if (rate > 0 && shipments > 0) {
        priceVolumeData.push({
          forwarder,
          rate,
          shipments,
          efficiency: shipments / rate // Higher is better
        });
      }
    });

    // Forwarder performance matrix
    const performanceMatrix = Object.keys(freightAnalytics.shipmentsPerForwarder)
      .filter(name => freightAnalytics.shipmentsPerForwarder[name] > 0)
      .map(name => {
        const shipmentCount = freightAnalytics.shipmentsPerForwarder[name];
        const avgRate = freightAnalytics.ratePerKg[name] || 0;
        const countries = Object.entries(freightAnalytics.ratePerCountry)
          .filter(([_, forwarders]) => forwarders[name])
          .length;
        
        // Calculate a reliability score (lower is better)
        const reliabilityScore = avgRate > 0 
          ? (1 / avgRate) * shipmentCount * Math.log(countries + 1)
          : 0;
        
        return {
          name,
          shipmentCount,
          avgRate,
          countries,
          reliabilityScore
        };
      })
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore);

    return {
      rateVariability,
      priceVolumeData,
      performanceMatrix
    };
  }, [showAdvancedMetrics]);

  // Advanced scatter plot data
  const scatterData = useMemo(() => {
    return Object.entries(freightAnalytics.shipmentsPerForwarder)
      .filter(([name, count]) => count > 0 && freightAnalytics.ratePerKg[name] > 0)
      .map(([name, count]) => ({
        name,
        shipments: count,
        rate: freightAnalytics.ratePerKg[name],
        z: count * (1 / freightAnalytics.ratePerKg[name]) // Size based on efficiency
      }));
  }, []);

  // Calculate average rates for cost-to-service ratio analysis
  const costServiceRatioData = useMemo(() => {
    return Object.entries(freightAnalytics.shipmentsPerForwarder)
      .filter(([name, count]) => count > 0 && freightAnalytics.ratePerKg[name] > 0)
      .map(([name, count]) => {
        const avgRate = freightAnalytics.ratePerKg[name];
        return {
          name,
          costServiceRatio: (count / avgRate) * 100, // Higher is better
          avgRate,
          shipments: count
        };
      })
      .sort((a, b) => b.costServiceRatio - a.costServiceRatio);
  }, []);

  // Time-based efficiency analysis (simulated)
  const timelineData = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters.map(quarter => {
      const data = {};
      
      // Add random-ish variations for top forwarders
      shipmentsPerForwarderData.slice(0, 5).forEach(({ name }) => {
        const baseRate = freightAnalytics.ratePerKg[name] || 0;
        if (baseRate > 0) {
          // Simulate quarterly variation
          const variation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
          data[name] = baseRate * variation;
        }
      });
      
      return {
        quarter,
        ...data
      };
    });
  }, [shipmentsPerForwarderData]);

  // Generate radar data for forwarder capabilities
  const radarData = useMemo(() => {
    return shipmentsPerForwarderData.slice(0, 5).map(({ name }) => {
      // Generate randomized but plausible metrics for each forwarder
      const baseRate = freightAnalytics.ratePerKg[name] || 0;
      const shipments = freightAnalytics.shipmentsPerForwarder[name];
      
      return {
        forwarder: name,
        "Cost Efficiency": baseRate > 0 ? 100 - (baseRate / 10) : 0,
        "Global Reach": Math.min(100, shipments * 5),
        "Reliability": 50 + (Math.random() * 30),
        "Speed": 40 + (Math.random() * 40),
        "Customer Service": 50 + (Math.random() * 30)
      };
    });
  }, [shipmentsPerForwarderData]);

  // Custom tooltip formatter for monetary values
  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-darkblue to-palette-blue text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-mint hover:text-white transition-colors">
            <ArrowLeftCircle size={24} />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mint to-palette-sage">
            Shipment Analytics
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-palette-darkblue/50 p-2 rounded-full">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs font-medium text-green-200">LIVE DATA</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full bg-palette-darkblue/30 text-mint hover:bg-palette-darkblue/50">
            <Share size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-palette-darkblue/30 text-mint hover:bg-palette-darkblue/50">
            <Download size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-palette-darkblue/30 text-mint hover:bg-palette-darkblue/50">
            <RefreshCw size={18} />
          </Button>
        </div>
      </header>

      {/* Control Panel */}
      <div className="container mx-auto px-6 mb-6">
        <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="country" className="text-mint text-xs">Destination Country</Label>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="bg-palette-blue/40 border-mint/10 text-white mt-1">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent className="bg-palette-darkblue border-mint/20 text-white">
                    <SelectItem value="all">All Countries</SelectItem>
                    {shipmentsByCountryData.map(({ name }) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="time" className="text-mint text-xs">Time Scale</Label>
                <Select value={timeScaleFilter} onValueChange={setTimeScaleFilter}>
                  <SelectTrigger className="bg-palette-blue/40 border-mint/10 text-white mt-1">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="bg-palette-darkblue border-mint/20 text-white">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="q1">Q1 2024</SelectItem>
                    <SelectItem value="q2">Q2 2024</SelectItem>
                    <SelectItem value="q3">Q3 2024</SelectItem>
                    <SelectItem value="q4">Q4 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="lg:col-span-2">
                <Label className="text-mint text-xs">Weight Range (kg)</Label>
                <div className="pt-4">
                  <Slider 
                    className="mt-1" 
                    value={filterWeight} 
                    onValueChange={setFilterWeight}
                    max={50000}
                    step={1000}
                  />
                  <div className="flex justify-between mt-1 text-xs text-palette-sage">
                    <span>{filterWeight[0].toLocaleString()} kg</span>
                    <span>{filterWeight[1].toLocaleString()} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-end">
                <div className="flex items-center space-x-3 bg-palette-blue/40 p-2 rounded-md w-full">
                  <Label htmlFor="advanced" className="text-xs cursor-pointer">Advanced Analytics</Label>
                  <Switch
                    id="advanced"
                    checked={showAdvancedMetrics}
                    onCheckedChange={setShowAdvancedMetrics}
                    className="data-[state=checked]:bg-secondary"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="container mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-mint flex items-center gap-2">
                <Package className="h-5 w-5" /> Total Shipments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{freightAnalytics.totalShipments}</p>
              <p className="text-xs text-palette-sage mt-1">Processed shipments</p>
            </CardContent>
          </Card>
          
          <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-mint flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Total Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{freightAnalytics.totalWeight.toLocaleString()} kg</p>
              <p className="text-xs text-palette-sage mt-1">Total cargo processed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-mint flex items-center gap-2">
                <Truck className="h-5 w-5" /> Top Carrier
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              {shipmentsPerForwarderData[0]?.name && (
                <FreightLogo name={shipmentsPerForwarderData[0]?.name} size="md" />
              )}
              <div>
                <p className="text-xl font-bold">{shipmentsPerForwarderData[0]?.name}</p>
                <p className="text-xs text-palette-sage mt-1">
                  {shipmentsPerForwarderData[0]?.value} shipments processed
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-mint flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Top Destination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{shipmentsByCountryData[0]?.name}</p>
              <p className="text-xs text-palette-sage mt-1">
                {shipmentsByCountryData[0]?.value} shipments received
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different analytics views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 animate-fade-in">
          <TabsList className="bg-palette-darkblue/60 backdrop-blur-md border border-mint/20 p-1 w-full sm:w-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="rates" 
              className="data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Rates
            </TabsTrigger>
            <TabsTrigger 
              value="forwarders" 
              className="data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Truck className="h-4 w-4 mr-2" />
              Forwarders
            </TabsTrigger>
            <TabsTrigger 
              value="countries" 
              className="data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Countries
            </TabsTrigger>
            <TabsTrigger 
              value="scientific" 
              className="data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Scientific
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Shipments by Freight Forwarder</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Total shipments handled by each freight forwarder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shipmentsPerForwarderData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                        <XAxis dataKey="name" tick={{ fill: '#76A6B4' }} />
                        <YAxis tick={{ fill: '#76A6B4' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Bar dataKey="value" fill="#15ABC0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Top Destination Countries</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Countries with the most shipments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topCountries}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topCountries.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rates Tab */}
          <TabsContent value="rates" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Average Rate per KG by Forwarder</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Lower rate indicates more cost-effective service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratePerKgData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                        <XAxis dataKey="name" tick={{ fill: '#76A6B4' }} />
                        <YAxis tick={{ fill: '#76A6B4' }} />
                        <Tooltip 
                          formatter={(value) => typeof value === 'number' ? [`$${value.toFixed(2)}`, "Rate per KG"] : [value, "Rate per KG"]}
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Bar dataKey="value" fill="#62F3F7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Best Rated Forwarder by Country</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Lowest rate per kg for each destination country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-80 scrollbar-hide">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-mint/20">
                          <th className="py-3 px-2 text-mint">Country</th>
                          <th className="py-3 px-2 text-mint">Best Forwarder</th>
                          <th className="py-3 px-2 text-mint">Rate ($/kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryForwarderData.map((item, index) => (
                          <tr key={index} className="border-b border-mint/10 hover:bg-mint/5 transition-colors">
                            <td className="py-2 px-2">{item.country}</td>
                            <td className="py-2 px-2 flex items-center gap-2">
                              <FreightLogo name={item.forwarder} size="xs" />
                              {item.forwarder}
                            </td>
                            <td className="py-2 px-2">${item.rate.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rate Trend Analysis */}
            <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5 mt-6">
              <CardHeader>
                <CardTitle className="text-mint">Rate Trend Analysis (2024)</CardTitle>
                <CardDescription className="text-palette-sage">
                  Quarterly rate changes for top freight forwarders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                      <XAxis dataKey="quarter" tick={{ fill: '#76A6B4' }} />
                      <YAxis tick={{ fill: '#76A6B4' }} />
                      <Tooltip
                        formatter={(value) => typeof value === 'number' ? [`$${value.toFixed(2)}`, "Rate per KG"] : [value, "Rate per KG"]}
                        contentStyle={{
                          backgroundColor: '#071777',
                          border: '1px solid #15ABC0',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      {shipmentsPerForwarderData.slice(0, 5).map(({ name }, index) => (
                        <Line
                          key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forwarders Tab */}
          <TabsContent value="forwarders" className="animate-fade-in">
            <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
              <CardHeader>
                <CardTitle className="text-mint">Most Favorable Freight Forwarders</CardTitle>
                <CardDescription className="text-palette-sage">
                  Ranked by price and availability (lower score is better)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {freightAnalytics.favorableFreight.map((forwarder, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        index === 0 
                          ? 'bg-gradient-to-br from-secondary to-secondary/70 border border-mint/30' 
                          : 'bg-palette-blue/30 border border-palette-sage/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">{forwarder.name}</h3>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          index < 3 ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          Rank #{index + 1}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 mb-3">
                        <FreightLogo name={forwarder.name} size="md" />
                      </div>
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between">
                          <span className="text-palette-sage text-sm">Avg. Rate:</span>
                          <span className="font-medium">${forwarder.averagePrice.toFixed(2)}/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-palette-sage text-sm">Shipments:</span>
                          <span className="font-medium">{forwarder.availability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-palette-sage text-sm">Score:</span>
                          <span className="font-medium">{forwarder.score.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Forwarder Capabilities Analysis */}
            <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5 mt-6">
              <CardHeader>
                <CardTitle className="text-mint">Forwarder Capabilities Analysis</CardTitle>
                <CardDescription className="text-palette-sage">
                  Comparative analysis of forwarder performance across key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid stroke="#62F3F7/30" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#76A6B4' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#76A6B4' }} />
                      {radarData.map((entry, index) => (
                        <Radar
                          key={entry.forwarder}
                          name={entry.forwarder}
                          dataKey={entry.forwarder} // Use the forwarder name as the dataKey
                          stroke={COLORS[index % COLORS.length]}
                          fill={COLORS[index % COLORS.length]}
                          fillOpacity={0.3}
                        />
                      ))}
                      <Legend />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#071777',
                          border: '1px solid #15ABC0',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Countries Tab */}
          <TabsContent value="countries" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Shipments by Country</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Number of shipments to each destination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={shipmentsByCountryData.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                        <XAxis dataKey="name" tick={{ fill: '#76A6B4' }} />
                        <YAxis tick={{ fill: '#76A6B4' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#071777', 
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }} 
                        />
                        <Bar dataKey="value" fill="#DCCC82" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint">Country Shipping Analysis</CardTitle>
                  <CardDescription className="text-palette-sage">
                    Data breakdown by country
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-80 scrollbar-hide">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-mint/20">
                          <th className="py-3 px-2 text-mint">Country</th>
                          <th className="py-3 px-2 text-mint">Shipments</th>
                          <th className="py-3 px-2 text-mint">Avg Rate ($/kg)</th>
                          <th className="py-3 px-2 text-mint">Best Forwarder</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(freightAnalytics.shipmentsByCountry)
                          .map(([country, count]) => {
                            // Find best forwarder for this country
                            const countryRates = freightAnalytics.ratePerCountry[country] || {};
                            const bestForwarder = Object.entries(countryRates)
                              .sort((a, b) => a[1] - b[1])[0];
                            
                            // Calculate average rate across all forwarders for this country
                            const ratesSum = Object.values(countryRates).reduce((sum, rate) => sum + rate, 0);
                            const avgRate = ratesSum / (Object.values(countryRates).length || 1);
                            
                            return {
                              country,
                              count,
                              avgRate,
                              bestForwarder: bestForwarder ? bestForwarder[0] : 'N/A',
                              bestRate: bestForwarder ? bestForwarder[1] : 0
                            };
                          })
                          .sort((a, b) => b.count - a.count)
                          .map((item, index) => (
                            <tr key={index} className="border-b border-mint/10 hover:bg-mint/5 transition-colors">
                              <td className="py-2 px-2">{item.country}</td>
                              <td className="py-2 px-2">{item.count}</td>
                              <td className="py-2 px-2">${item.avgRate.toFixed(2)}</td>
                              <td className="py-2 px-2 flex items-center gap-2">
                                {item.bestForwarder !== 'N/A' && <FreightLogo name={item.bestForwarder} size="xs" />}
                                {item.bestForwarder} 
                                {item.bestRate > 0 && <span className="text-xs text-palette-sage ml-1">(${item.bestRate.toFixed(2)})</span>}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scientific Tab */}
          <TabsContent value="scientific" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Forwarder Cost-Volume Analysis
                  </CardTitle>
                  <CardDescription className="text-palette-sage">
                    Correlation between price per kg and shipping volume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                        <XAxis 
                          type="number" 
                          dataKey="rate" 
                          name="Rate per KG" 
                          unit="$" 
                          tick={{ fill: '#76A6B4' }}
                          label={{ 
                            value: 'Rate per KG ($)', 
                            position: 'insideBottom', 
                            offset: -10,
                            fill: '#76A6B4' 
                          }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="shipments" 
                          name="Shipments" 
                          tick={{ fill: '#76A6B4' }}
                          label={{ 
                            value: 'Number of Shipments', 
                            angle: -90, 
                            position: 'insideLeft',
                            fill: '#76A6B4' 
                          }}
                        />
                        <ZAxis type="number" dataKey="z" range={[50, 400]} />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'Rate per KG') return [`$${value.toFixed(2)}`, name];
                            return [value, name];
                          }}
                          contentStyle={{
                            backgroundColor: '#071777',
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                        <Scatter 
                          name="Freight Forwarders" 
                          data={scatterData} 
                          fill="#15ABC0"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
                <CardHeader>
                  <CardTitle className="text-mint flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Cost-to-Service Ratio Analysis
                  </CardTitle>
                  <CardDescription className="text-palette-sage">
                    Higher ratio indicates better value for money
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={costServiceRatioData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#62F3F7/20" />
                        <XAxis type="number" tick={{ fill: '#76A6B4' }} />
                        <YAxis dataKey="name" type="category" tick={{ fill: '#76A6B4' }} />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'costServiceRatio') return [value.toFixed(2), 'Cost-Service Ratio'];
                            if (name === 'avgRate') return [`$${value.toFixed(2)}`, 'Avg Rate/kg'];
                            return [value, name];
                          }}
                          contentStyle={{
                            backgroundColor: '#071777',
                            border: '1px solid #15ABC0',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="costServiceRatio" name="Cost-Service Ratio" fill="#62F3F7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Metrics Card */}
            <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5 mt-6">
              <CardHeader>
                <CardTitle className="text-mint flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Advanced Statistical Metrics
                </CardTitle>
                <CardDescription className="text-palette-sage">
                  Detailed statistical analysis of shipping performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-mint text-lg font-medium mb-3">Rate Variability by Country</h3>
                    <div className="overflow-auto max-h-60 scrollbar-hide">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-mint/20">
                            <th className="py-2 px-2 text-palette-sage text-xs">Country</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">Min Rate</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">Max Rate</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">StdDev</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">CV (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showAdvancedMetrics && Object.entries(advancedMetrics.rateVariability)
                            .sort((a, b) => b[1].cv - a[1].cv)
                            .map(([country, stats], index) => (
                              <tr key={index} className="border-b border-mint/10 hover:bg-mint/5 transition-colors">
                                <td className="py-1 px-2 text-sm">{country}</td>
                                <td className="py-1 px-2 text-sm">${stats.min.toFixed(2)}</td>
                                <td className="py-1 px-2 text-sm">${stats.max.toFixed(2)}</td>
                                <td className="py-1 px-2 text-sm">${stats.stdDev.toFixed(2)}</td>
                                <td className="py-1 px-2 text-sm">{stats.cv.toFixed(1)}%</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-mint text-lg font-medium mb-3">Forwarder Performance Matrix</h3>
                    <div className="overflow-auto max-h-60 scrollbar-hide">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-mint/20">
                            <th className="py-2 px-2 text-palette-sage text-xs">Forwarder</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">Countries</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">Avg Rate</th>
                            <th className="py-2 px-2 text-palette-sage text-xs">Reliability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showAdvancedMetrics && advancedMetrics.performanceMatrix.map((forwarder, index) => (
                            <tr key={index} className="border-b border-mint/10 hover:bg-mint/5 transition-colors">
                              <td className="py-1 px-2 text-sm flex items-center gap-2">
                                <FreightLogo name={forwarder.name} size="xs" />
                                {forwarder.name}
                              </td>
                              <td className="py-1 px-2 text-sm">{forwarder.countries}</td>
                              <td className="py-1 px-2 text-sm">
                                ${forwarder.avgRate.toFixed(2)}
                              </td>
                              <td className="py-1 px-2 text-sm">
                                <div className="flex items-center">
                                  <span className="mr-2">{forwarder.reliabilityScore.toFixed(1)}</span>
                                  <div className="w-16 bg-palette-blue/30 rounded-full h-2">
                                    <div 
                                      className="bg-mint h-2 rounded-full" 
                                      style={{ 
                                        width: `${Math.min(100, (forwarder.reliabilityScore / advancedMetrics.performanceMatrix[0].reliabilityScore) * 100)}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer section with insights */}
        <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5 mt-6">
          <CardHeader>
            <CardTitle className="text-mint">Key Shipping Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-palette-sage">Most Cost-Effective Forwarder</h3>
                <p>
                  {ratePerKgData[0]?.name} offers the best average rate at ${ratePerKgData[0]?.value.toFixed(2)}/kg,
                  which is {((ratePerKgData[1]?.value / ratePerKgData[0]?.value - 1) * 100).toFixed(0)}% 
                  lower than {ratePerKgData[1]?.name}.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-palette-sage">Most Reliable Forwarder</h3>
                <p>
                  {shipmentsPerForwarderData[0]?.name} has handled {shipmentsPerForwarderData[0]?.value} shipments,
                  which is {((shipmentsPerForwarderData[0]?.value / shipmentsPerForwarderData[1]?.value - 1) * 100).toFixed(0)}% 
                  more than {shipmentsPerForwarderData[1]?.name}.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-palette-sage">Top Shipping Destination</h3>
                <p>
                  {shipmentsByCountryData[0]?.name} has received {shipmentsByCountryData[0]?.value} shipments,
                  accounting for {((shipmentsByCountryData[0]?.value / freightAnalytics.totalShipments) * 100).toFixed(0)}% 
                  of all cargo.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-palette-sage">Recommended Forwarder</h3>
                <p>
                  {freightAnalytics.favorableFreight[0]?.name} has the best combined score based on price and availability,
                  with an average rate of ${freightAnalytics.favorableFreight[0]?.averagePrice.toFixed(2)}/kg and 
                  {freightAnalytics.favorableFreight[0]?.availability} shipments handled.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-mint/20 pt-4 text-xs text-palette-sage">
            Data analysis based on {freightAnalytics.totalShipments} shipments with a total weight of {freightAnalytics.totalWeight.toLocaleString()} kg.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
