
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Shipment } from '../types/shipment';
import WeatherInfo from './WeatherInfo';
import ShipmentTooltip from './ShipmentTooltip';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapHUD from './MapHUD';
import RadarPulse from './RadarPulse';
import MapOverlay from './MapOverlay';
import MapContainer from './MapContainer';
import { generateMapRoutes } from '../utils/mapRouteGenerator';
import { CustomLayerProps } from '../utils/mapAnimations';
import { 
  Activity, ChevronRight, Zap, Layers, FileWarning, 
  CircleArrowUp as ArrowUpCircle, Database, LineChart, BriefcaseBusiness, HardDriveDownload 
} from 'lucide-react';

// Update to use the provided token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWthbmltbzEiLCJhIjoiY2w5ODU2cjR2MDR3dTNxcXRpdG5jb3Z6dyJ9.vi2wspa-B9a9gYYWMpEm0A';

interface ShipmentMapProps {
  shipments: Shipment[];
  activeShipment?: Shipment;
}

const ShipmentMap: React.FC<ShipmentMapProps> = ({ shipments, activeShipment }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredShipment, setHoveredShipment] = useState<Shipment | null>(null);
  const [showDeepCALOverlay, setShowDeepCALOverlay] = useState(false);
  
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  // Custom properties for different route types
  const routeProps = useRef<Record<string, CustomLayerProps>>({});

  useEffect(() => {
    if (!mapLoaded || !map.current?.isStyleLoaded()) return;

    generateMapRoutes(map.current, shipments, activeShipment);
  }, [shipments, activeShipment, mapLoaded]);

  const toggleDeepCALOverlay = () => {
    setShowDeepCALOverlay(prev => !prev);
  };

  return (
    <div className="relative w-full h-full bg-palette-darkblue">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Initialize the map */}
      <MapContainer
        shipments={shipments}
        selectedShipment={activeShipment}
        mapContainer={mapContainer}
        map={map}
        routeProps={routeProps}
        animationFrameRef={animationFrameRef}
        setMapLoaded={setMapLoaded}
        setSelectedLocation={setSelectedLocation}
        setHoveredShipment={setHoveredShipment}
      />
      
      {/* Sci-fi overlay elements */}
      <MapOverlay />
      
      {/* DeepCAL Workflow Toggle */}
      <button 
        onClick={toggleDeepCALOverlay}
        className="absolute top-4 right-4 z-10 bg-palette-mint/20 hover:bg-palette-mint/40 text-palette-mint py-1 px-3 rounded-md flex items-center space-x-1 text-xs transition-colors"
      >
        <span className="h-2 w-2 bg-palette-mint rounded-full animate-pulse"></span>
        <span>DeepCAL {showDeepCALOverlay ? 'Active' : 'Inactive'}</span>
      </button>
      
      {/* DeepCAL Workflow Overlay */}
      {showDeepCALOverlay && (
        <div className="absolute inset-0 bg-palette-darkblue/80 z-20 flex items-center justify-center">
          <div className="w-5/6 h-5/6 bg-palette-blue/30 border border-palette-mint/30 rounded-lg p-4 overflow-auto">
            <h2 className="text-xl font-bold text-palette-mint mb-4">DeepCAL Algorithm Workflow</h2>
            
            <div className="grid grid-cols-3 gap-4 text-white">
              {/* Stage 1: Data Input & Preprocessing */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <Database size={16} className="mr-2" />
                  1. Data Input & Preprocessing
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Data Intake: Manual forms, APIs, CSV/ERP uploads
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Cleaning & Validation: Format normalization
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Versioned Storage: Historical tracking
                  </li>
                </ul>
              </div>
              
              {/* Stage 2: Contextual Analysis */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <Layers size={16} className="mr-2" />
                  2. Contextual Analysis
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Core Features: Cost, time, reliability
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Derived Metrics: Delay ratios, responsiveness
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Normalization: Standardized feature ranges
                  </li>
                </ul>
              </div>
              
              {/* Stage 3: Neutrosophic AHP */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <Activity size={16} className="mr-2" />
                  3. Neutrosophic AHP
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Pairwise Comparison: Triangular Neutrosophic Numbers
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Uncertainty Propagation: Truth-Indeterminacy-Falsity
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Consistency Check: Neutrosophic CR with RI table
                  </li>
                </ul>
              </div>
              
              {/* Stage 4: N-TOPSIS */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <LineChart size={16} className="mr-2" />
                  4. N-TOPSIS Scoring
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Decision Matrix: Alternatives vs Criteria
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Weighted Normalization: N-AHP-derived weights
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Closeness Coefficient: Final ranking score
                  </li>
                </ul>
              </div>
              
              {/* Stage 5: Bayesian-Neural */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <Zap size={16} className="mr-2" />
                  5. Bayesian-Neural Fusion
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Model Selection: CNN/RNN for temporal modeling
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Explainability: SHAP, LIME for interpretability
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Decision Confidence: Quantified uncertainty
                  </li>
                </ul>
              </div>
              
              {/* Stage 6: Feedback Loop */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <ArrowUpCircle size={16} className="mr-2" />
                  6. Feedback Loop & Learning
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Online Learning: Update metrics with outcomes
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    TNN Recalibration: Adjust with evidence
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Route/Forwarder Reputation: Auto-learned trust
                  </li>
                </ul>
              </div>
              
              {/* Stage 7: DeepTalk */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <BriefcaseBusiness size={16} className="mr-2" />
                  7. DeepTalk Integration
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Intent Recognition: Cost optimization, risk queries
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Natural Language Explanation: Ranking logic
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Resilience Narrative: Truth-Indeterminacy-Falsity story
                  </li>
                </ul>
              </div>
              
              {/* Stage 8: Evaluation */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <FileWarning size={16} className="mr-2" />
                  8. Evaluation & Validation
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Quantitative Evaluation: Precision, Recall, F1
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Model Comparison: Classic vs Neutrosophic
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Stress Testing: Sparse data, extreme delays
                  </li>
                </ul>
              </div>
              
              {/* Stage 9: Scientific Readiness */}
              <div className="bg-palette-blue/40 p-3 rounded-md border border-palette-mint/20">
                <h3 className="text-palette-mint font-semibold mb-2 flex items-center">
                  <HardDriveDownload size={16} className="mr-2" />
                  9. Scientific & Operational Readiness
                </h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Publishability: Academic rigor, MCDM best practices
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Offline-First: Full capability without cloud
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-palette-mint rounded-full mr-2"></div>
                    Versioning & Explainability: Transparent evolution
                  </li>
                </ul>
              </div>
            </div>
            
            <button 
              onClick={toggleDeepCALOverlay} 
              className="mt-4 bg-palette-mint/20 hover:bg-palette-mint/40 text-palette-mint py-2 px-4 rounded-md transition-colors"
            >
              Close Workflow View
            </button>
          </div>
        </div>
      )}
      
      {/* HUD Components */}
      <MapHUD 
        shipments={shipments}
        activeShipments={shipments.filter(s => s.status === 'in-transit').length}
        delayedShipments={shipments.filter(s => s.status === 'delayed').length}
      />
      
      {/* Shipment info tooltip */}
      {hoveredShipment && (
        <ShipmentTooltip shipment={hoveredShipment} />
      )}
      
      {/* Weather info */}
      {selectedLocation && (
        <WeatherInfo
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default ShipmentMap;
