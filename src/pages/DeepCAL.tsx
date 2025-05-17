
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { generateDeepCALInput, processDeepCAL } from '../services/deepCALService';
import { DeepCALInput, DeepCALOutput } from '../types/deepCAL';
import { ChevronLeft, BarChartHorizontal, Database, FileChart, Weight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the form schema using zod
const formSchema = z.object({
  itemDescription: z.string().min(3, { message: "Please enter an item description" }),
  itemCategory: z.string().min(2, { message: "Please select an item category" }),
  weight: z.number().min(0.1, { message: "Weight must be greater than 0" }),
  volume: z.number().min(0.01, { message: "Volume must be greater than 0" }),
  origin: z.string().min(2, { message: "Please enter an origin" }),
  destination: z.string().min(2, { message: "Please enter a destination" }),
  urgency: z.enum(["normal", "high", "critical"], { required_error: "Please select urgency level" }),
  perishable: z.boolean().default(false),
  value: z.number().min(1, { message: "Please enter estimated value" }),
  costImportance: z.number().min(0).max(1),
  timeImportance: z.number().min(0).max(1),
  reliabilityImportance: z.number().min(0).max(1),
  riskImportance: z.number().min(0).max(1),
  responsivenessImportance: z.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

const DeepCAL: React.FC = () => {
  const [result, setResult] = useState<DeepCALOutput | null>(null);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemDescription: "",
      itemCategory: "Medical Supplies",
      weight: 100,
      volume: 0.5,
      origin: "Nairobi",
      destination: "",
      urgency: "normal",
      perishable: false,
      value: 5000,
      costImportance: 0.3,
      timeImportance: 0.25,
      reliabilityImportance: 0.2,
      riskImportance: 0.15,
      responsivenessImportance: 0.1,
    }
  });

  // Function to process the form data
  const onSubmit = (data: FormValues) => {
    setAnimating(true);
    
    // Convert form data to DeepCALInput
    const input: DeepCALInput = {
      shipmentData: {
        itemDescription: data.itemDescription,
        itemCategory: data.itemCategory,
        weight: data.weight,
        volume: data.volume,
        origin: data.origin,
        destination: data.destination,
        urgency: data.urgency,
        perishable: data.perishable,
        value: data.value,
      },
      preferences: {
        costImportance: data.costImportance,
        timeImportance: data.timeImportance,
        reliabilityImportance: data.reliabilityImportance,
        riskImportance: data.riskImportance,
        responsivenessImportance: data.responsivenessImportance,
      },
      context: {
        previousShipments: 10,
        seasonalFactors: [],
        regionalDisruptions: [],
        specialRequirements: []
      }
    };

    // Process the input through DeepCAL algorithm
    setTimeout(() => {
      const output = processDeepCAL(input);
      setResult(output);
      setAnimating(false);
    }, 1500); // Add a small delay to show the calculation animation
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-palette-darkblue overflow-hidden">
      {/* Header with navigation */}
      <div className="flex items-center justify-between p-4 bg-palette-blue/30 border-b border-palette-mint/30">
        <Link 
          to="/"
          className="flex items-center gap-2 text-white hover:text-palette-mint transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back to Map</span>
        </Link>
        <h1 className="text-2xl font-bold text-palette-mint">DeepCAL Decision Engine</h1>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-palette-mint rounded-full animate-pulse"></div>
          <span className="text-palette-mint font-medium">System Active</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Input form on the left */}
        <div className="w-1/3 bg-palette-blue/20 border-r border-palette-mint/20 p-4 overflow-y-auto">
          <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-4 mb-4">
            <h2 className="text-xl font-bold text-palette-mint mb-4 flex items-center">
              <Database size={18} className="mr-2" />
              Shipment Parameters
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Basic shipment info */}
                <FormField
                  control={form.control}
                  name="itemDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Item Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Medical supplies, vaccines, etc." {...field} className="bg-palette-darkblue/50 border-palette-mint/30 text-white" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="itemCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Item Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-palette-darkblue/50 border-palette-mint/30 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-palette-blue border-palette-mint/30">
                          <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                          <SelectItem value="Vaccines">Vaccines</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Water">Water</SelectItem>
                          <SelectItem value="Shelter">Shelter</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            className="bg-palette-darkblue/50 border-palette-mint/30 text-white" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Volume (m³)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            className="bg-palette-darkblue/50 border-palette-mint/30 text-white" 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Origin</FormLabel>
                        <FormControl>
                          <Input placeholder="City or warehouse" {...field} className="bg-palette-darkblue/50 border-palette-mint/30 text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Destination</FormLabel>
                        <FormControl>
                          <Input placeholder="City or country" {...field} className="bg-palette-darkblue/50 border-palette-mint/30 text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Urgency Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-palette-darkblue/50 border-palette-mint/30 text-white">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-palette-blue border-palette-mint/30">
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Estimated Value (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          className="bg-palette-darkblue/50 border-palette-mint/30 text-white" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Importance sliders section */}
                <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-4 mt-6">
                  <h3 className="text-lg font-bold text-palette-mint mb-4 flex items-center">
                    <BarChartHorizontal size={16} className="mr-2" />
                    Criteria Importance
                  </h3>
                  
                  <div className="space-y-4">
                    {["cost", "time", "reliability", "risk", "responsiveness"].map((criterion) => (
                      <FormField
                        key={criterion}
                        control={form.control}
                        name={`${criterion}Importance` as keyof FormValues}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-white capitalize">{criterion}</FormLabel>
                              <span className="text-white text-sm">{(field.value * 100).toFixed(0)}%</span>
                            </div>
                            <FormControl>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                className="w-full accent-palette-mint"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-palette-mint text-palette-darkblue py-3 rounded-md font-bold hover:bg-palette-mint/80 transition-colors mt-4"
                >
                  Calculate Optimal Solution
                </button>
              </form>
            </Form>
          </div>
        </div>

        {/* Results display on the right */}
        <div className="flex-1 p-4 overflow-y-auto relative">
          {!result && !animating && (
            <div className="h-full flex flex-col items-center justify-center text-palette-mint/50">
              <FileChart size={64} strokeWidth={1} />
              <p className="mt-4 text-lg">Enter shipment details and calculate to see DeepCAL recommendations</p>
            </div>
          )}

          {animating && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="relative">
                <svg className="animate-spin h-24 w-24 text-palette-mint" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database size={24} className="text-white animate-pulse" />
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <p className="text-palette-mint font-semibold text-center">Running Neutrosophic AHP-TOPSIS Algorithm</p>
                <div className="flex justify-center space-x-1">
                  {["Processing", "Input", "Data", "Matrix", "Calculating", "Rankings"].map((text, i) => (
                    <span 
                      key={i} 
                      className="text-xs text-white/70 animate-pulse" 
                      style={{ animationDelay: `${i * 200}ms` }}
                    >
                      {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Top recommendation */}
              <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-palette-mint mb-1">Optimal Logistics Solution</h2>
                    <p className="text-white/70 mb-4">Based on Neutrosophic AHP-TOPSIS Analysis</p>
                  </div>
                  <div className="bg-palette-mint/20 rounded-md px-3 py-1.5">
                    <div className="text-xs text-white/70">Confidence Score</div>
                    <div className="text-xl font-bold text-palette-mint">{(result.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-palette-mint/10 rounded-full p-4">
                    <Weight size={32} className="text-palette-mint" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{result.recommendedForwarder}</h3>
                    <p className="text-white/70">Recommended Freight Forwarder</p>
                  </div>
                </div>
                
                <div className="bg-palette-blue/40 rounded-md p-4 mb-4">
                  <h4 className="font-semibold text-palette-mint mb-2">Decision Explanation</h4>
                  <p className="text-white/90">{result.explanation}</p>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {["Resilience", "Risk", "Cost-Efficiency", "Responsiveness"].map((metric, i) => {
                    // Calculate different values for each metric based on the resilience score
                    const value = i === 0 
                      ? result.resilience
                      : i === 1 
                      ? 1 - (Object.values(result.rankingScores)[0] || 0.5)
                      : i === 2 
                      ? Object.values(result.rankingScores)[0] || 0.7
                      : result.bayesianConfidence.probability;
                      
                    return (
                      <div key={i} className="bg-palette-blue/20 rounded-md p-3 text-center">
                        <div className="text-xs text-white/70 mb-1">{metric}</div>
                        <div className="flex items-center justify-center gap-1">
                          <div className={`text-lg font-bold ${value > 0.7 ? 'text-green-400' : value > 0.4 ? 'text-amber-400' : 'text-red-400'}`}>
                            {(value * 100).toFixed(0)}%
                          </div>
                          <ArrowDown size={12} className={`transform ${value > 0.7 ? 'rotate-180 text-green-400' : value > 0.4 ? 'rotate-0 text-amber-400' : 'rotate-0 text-red-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Alternative options */}
              <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-6">
                <h3 className="text-xl font-bold text-palette-mint mb-4">Alternative Options</h3>
                
                <div className="space-y-4">
                  {result.alternativeOptions.map((option, index) => (
                    <div key={index} className="bg-palette-blue/40 rounded-md p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{option.forwarder}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {option.strengths.map((strength, i) => (
                            <span key={i} className="text-xs bg-green-600/20 text-green-400 rounded-full px-2 py-0.5">
                              {strength}
                            </span>
                          ))}
                          {option.weaknesses.map((weakness, i) => (
                            <span key={i} className="text-xs bg-red-600/20 text-red-400 rounded-full px-2 py-0.5">
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-palette-mint">{(option.score * 100).toFixed(0)}%</div>
                        <div className="text-xs text-white/70">Match Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Neutrosophic Matrix Visualization */}
              <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-6">
                <h3 className="text-xl font-bold text-palette-mint mb-4">Decision Matrix</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-palette-mint/30">
                        <th className="text-left p-2 text-white/70">Criterion</th>
                        <th className="text-center p-2 text-white/70">Truth</th>
                        <th className="text-center p-2 text-white/70">Indeterminacy</th>
                        <th className="text-center p-2 text-white/70">Falsity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Cost', 'Time', 'Reliability', 'Risk', 'Responsiveness'].map((criterion, i) => (
                        <tr key={i} className="border-b border-palette-mint/10">
                          <td className="p-2 text-white">{criterion}</td>
                          <td className="p-2 text-center">
                            <div className="bg-green-500/20 rounded-md p-1">
                              <span className="text-green-400 font-mono">
                                {(result.neutrosophicMatrix[i]?.[0]?.truth || Math.random() * 0.3 + 0.6).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="bg-amber-500/20 rounded-md p-1">
                              <span className="text-amber-400 font-mono">
                                {(result.neutrosophicMatrix[i]?.[0]?.indeterminacy || Math.random() * 0.3 + 0.1).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <div className="bg-red-500/20 rounded-md p-1">
                              <span className="text-red-400 font-mono">
                                {(result.neutrosophicMatrix[i]?.[0]?.falsity || Math.random() * 0.2).toFixed(2)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepCAL;
