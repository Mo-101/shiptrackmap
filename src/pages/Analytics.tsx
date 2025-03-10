
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { freightAnalytics } from '@/utils/freightDataProcessor';
import { ArrowLeftCircle, BarChart2, PieChart as PieChartIcon, TrendingUp, Truck, Users, Package } from 'lucide-react';

// Futuristic colors
const COLORS = ['#15ABC0', '#0C3A62', '#62F3F7', '#76A6B4', '#DCCC82', '#071777'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
        <div className="flex items-center space-x-2 bg-palette-darkblue/50 p-2 rounded-full">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs font-medium text-green-200">LIVE DATA</span>
        </div>
      </header>

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
            <CardContent>
              <p className="text-xl font-bold">{shipmentsPerForwarderData[0]?.name}</p>
              <p className="text-xs text-palette-sage mt-1">
                {shipmentsPerForwarderData[0]?.value} shipments processed
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-palette-darkblue/60 backdrop-blur-md border-mint/20 text-white shadow-lg shadow-mint/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-mint flex items-center gap-2">
                <Users className="h-5 w-5" /> Top Destination
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
              <PieChartIcon className="h-4 w-4 mr-2" />
              Countries
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
                          formatter={(value) => [`$${value.toFixed(2)}`, "Rate per KG"]}
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
                            <td className="py-2 px-2">{item.forwarder}</td>
                            <td className="py-2 px-2">${item.rate.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                              <td className="py-2 px-2">
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
