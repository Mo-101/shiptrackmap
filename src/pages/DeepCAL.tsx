import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CognitiveGridOutput from '../components/CognitiveGridOutput';
import ShipmentInputForm, { ShipmentInputFormValues } from '../components/ShipmentInputForm';
import { ChevronLeft, AlertCircle, AlertTriangle, Shield } from 'lucide-react';
import { useHistoricalShipments, useShipmentByReference } from '../hooks/useHistoricalShipments';
import { resultAdapter } from '../adapters/resultAdapter';
import EmergencyModeOverlay from '../components/EmergencyModeOverlay';
import TruthBoundBanner from '../components/TruthBoundBanner';
import { EmergencyFuse, EMERGENCY_MODE } from '../validators/EmergencyFuse';
import { OutputMode } from '../validators/TruthValidator';

// DeepCAL is now strictly locked to historical data selection and output. No form logic or schema.

const getDefaultFormValues = (): ShipmentInputFormValues => ({
  request_reference: '',
  cargo_description: '',
  item_category: '',
  origin_country: '',
  origin_longitude: 0,
  origin_latitude: 0,
  destination_country: '',
  destination_longitude: 0,
  destination_latitude: 0,
  carrier: '',
  weight_kg: 0,
  volume_cbm: 0,
  value: undefined,
  urgency: '',
  perishable: false,
});

// Generates an algorithm fingerprint based on timestamp and input data hash
function generateAlgorithmFingerprint(data: any): string {
  const timestamp = Date.now().toString();
  const dataStr = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    const char = dataStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `DC-${Math.abs(hash).toString(16)}-${timestamp.slice(-6)}`;
}

// Create an audit log entry for each analysis
function logDeepCALAnalysis(inputData: any, result: any, status: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    input: inputData,
    algorithm_fingerprint: result?.algorithmFingerprint || 'unknown',
    status: status,
    confidence: result?.confidence || 0,
    emergency_mode_active: !result?.isTruthBound || false,
    rule_trace: result?.rules?.map((r: any) => `${r.name}:${r.status}`) || [],
    selected_carrier: result?.alternatives?.find((a: any) => a.selected)?.name || 'none'
  };
  
  console.log('DeepCAL Audit Log:', logEntry);
  
  // In production, this would send to a secure logging server
  try {
    localStorage.setItem(`deepcal_audit_${Date.now()}`, JSON.stringify(logEntry));
  } catch (e) {
    console.error('Failed to store audit log:', e);
  }
}

const DeepCAL: React.FC = () => {
  const [selectedRef, setSelectedRef] = useState<string>("");
  const shipments = useHistoricalShipments();
  const shipment = useShipmentByReference(selectedRef);
  const [formValues, setFormValues] = useState<ShipmentInputFormValues>(getDefaultFormValues());
  const [showResults, setShowResults] = useState<boolean>(false);
  const [emergencyModeActive, setEmergencyModeActive] = useState<boolean>(false);
  const [errorReference, setErrorReference] = useState<string>("");
  const [errorType, setErrorType] = useState<'COMPUTATION_FAILURE' | 'INTEGRITY_CHECK_FAILED' | 'FALLBACK_ALGORITHM' | 'SIMULATION_MODE'>('COMPUTATION_FAILURE');
  const [isTruthBound, setIsTruthBound] = useState<boolean>(true); // Assume truth-bound by default
  const [algorithmFingerprint, setAlgorithmFingerprint] = useState<string>("");
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>("");
  
  // Prefill form when selecting a historical shipment
  useEffect(() => {
    if (shipment) {
      setFormValues({
        request_reference: shipment.request_reference || '',
        cargo_description: shipment.cargo_description || '',
        item_category: shipment.item_category || '',
        origin_country: shipment.origin_country || '',
        origin_longitude: shipment.origin_longitude || 0,
        origin_latitude: shipment.origin_latitude || 0,
        destination_country: shipment.destination_country || '',
        destination_longitude: shipment.destination_longitude || 0,
        destination_latitude: shipment.destination_latitude || 0,
        carrier: shipment.carrier || '',
        weight_kg: Number(shipment.weight_kg) || 0,
        volume_cbm: Number(shipment.volume_cbm) || 0,
        value: shipment.value ? Number(shipment.value) : undefined,
        urgency: shipment.urgency || '',
        perishable: shipment.perishable || false,
      });
      // Reset results display when selecting a new shipment
      setShowResults(false);
    } else if (!selectedRef) {
      setFormValues(getDefaultFormValues());
      setShowResults(false);
    }
  }, [shipment, selectedRef]);

  // Function to handle analysis
  const handleAnalyze = () => {
    if (!formValues.cargo_description) return;
    
    // Generate a new algorithm fingerprint for this analysis
    const fingerprint = generateAlgorithmFingerprint(formValues);
    setAlgorithmFingerprint(fingerprint);
    setAnalysisTimestamp(new Date().toISOString());
    
    // Run the analysis
    try {
      setShowResults(true);
    } catch (error) {
      console.error('DeepCAL Analysis Error:', error);
      setEmergencyModeActive(true);
      setErrorReference(`ERROR-${Date.now()}`);
      setErrorType('COMPUTATION_FAILURE');
    }
  };

  // Function to handle manual override request
  const handleManualOverrideRequest = () => {
    console.log('Manual override requested. Contacting emergency response team...');
    // In a real implementation, this would contact the emergency response team
    alert('ALERT: Emergency response team has been notified of your manual override request.');
  };

  // Define the result type to match what resultAdapter returns
  interface DeepCALResult {
    request_reference: string;
    origin: string;
    destination: string;
    steps: string[];
    summary: { recommendation: string };
    kpis: Array<{ label: string, value: string, color: string }>;
    rules: Array<{ name: string, status: string }>;
    matrix: { criteria: string[], weights: number[], alternatives: any[] };
    alternatives: Array<{ name: string, score: number, selected: boolean }>;
    narrative: string;
    confidence?: number;
    emergency?: boolean;
    emergency_type?: 'COMPUTATION_FAILURE' | 'INTEGRITY_CHECK_FAILED' | 'FALLBACK_ALGORITHM' | 'SIMULATION_MODE';
    algorithmFingerprint?: string;
    mode?: OutputMode;
    warning?: string;
    timestamp?: string;
  }

  // For analytics, use formValues (not just shipment)
  const result = resultAdapter(formValues) as DeepCALResult;
  
  // Check if we need to activate emergency mode
  useEffect(() => {
    if (result && showResults) {
      // If the result contains an emergency flag or has confidence below threshold
      if (result.emergency || (result.confidence && result.confidence < 0.6)) {
        setEmergencyModeActive(true);
        setErrorReference(result.request_reference || `ERROR-${Date.now()}`);
        setErrorType(result.emergency_type || 'FALLBACK_ALGORITHM');
        setIsTruthBound(false);
      } else {
        setEmergencyModeActive(false);
        setIsTruthBound(true);
      }
      
      // Log the analysis for audit trail
      logDeepCALAnalysis(formValues, result, emergencyModeActive ? 'EMERGENCY' : 'SUCCESS');
    }
  }, [result, showResults, formValues]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Emergency Mode Overlay - shown when critical failures occur */}
      <EmergencyModeOverlay 
        active={emergencyModeActive} 
        errorReference={errorReference}
        errorType={errorType}
        onRequestManualOverride={handleManualOverrideRequest}
      />
      
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
          {isTruthBound ? (
            <>
              <div className="h-2 w-2 bg-palette-mint rounded-full animate-pulse"></div>
              <span className="text-palette-mint font-medium">System Active</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-500 font-medium flex items-center gap-1">
                <AlertCircle size={14} /> Simulation Mode
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Reference selector on the left */}
        <div className="w-1/3 bg-palette-blue/20 border-r border-palette-mint/20 p-4 overflow-y-auto">
          <div className="bg-palette-blue/30 rounded-lg border border-palette-mint/30 p-4 mb-4">
            <h2 className="text-xl font-bold text-palette-mint mb-4 flex items-center">Select Shipment Reference</h2>
            <select
              className="w-full p-2 rounded bg-palette-darkblue/50 border-palette-mint/30 text-white mb-4"
              value={selectedRef}
              onChange={e => setSelectedRef(e.target.value)}
            >
              <option value="" disabled>Select reference...</option>
              {shipments.map((row) => (
                <option key={row.request_reference} value={row.request_reference}>
                  {row.request_reference}
                </option>
              ))}
            </select>
            <button
              className="mb-4 px-3 py-1 rounded bg-palette-mint text-palette-darkblue font-bold hover:bg-palette-mint/80 transition-colors"
              onClick={() => setSelectedRef("")}
              type="button"
              disabled={!selectedRef}
            >
              New Analysis
            </button>
            {selectedRef && !shipment && (
              <div className="text-red-400">No record found for this reference.</div>
            )}
            <ShipmentInputForm
              values={formValues}
              onChange={setFormValues}
              disabledFields={selectedRef ? [
                'cargo_description','item_category','origin_country','origin_longitude','origin_latitude','destination_country','destination_longitude','destination_latitude','carrier','weight_kg','volume_cbm','value','urgency','perishable'] : []}
            />
            
            <button
              className="mt-6 w-full py-3 px-4 rounded-lg bg-palette-mint text-palette-darkblue font-bold text-lg hover:bg-palette-mint/80 transition-colors flex items-center justify-center gap-2"
              onClick={handleAnalyze}
              type="button"
              disabled={!formValues.cargo_description}
            >
              <span className="animate-pulse">⟩</span>
              Enter the Deep
              <span className="animate-pulse">⟨</span>
            </button>
          </div>
        </div>
        {/* Results display on the right */}
        <div className="flex-1 p-4 overflow-y-auto relative">
          {(!showResults) && (
            <div className="h-full flex flex-col items-center justify-center text-palette-mint/50">
              <p className="mt-4 text-lg">Fill in shipment details and click "Enter the Deep" to see DeepCAL recommendations</p>
            </div>
          )}
          {(showResults && result) && (
            <EmergencyFuse 
              result={result} 
              onEmergencyMode={(active, reason) => {
                setEmergencyModeActive(active);
                if (active) {
                  setErrorReference(result.request_reference || `ERROR-${Date.now()}`);
                  setErrorType(result.emergency_type || 'FALLBACK_ALGORITHM');
                  setIsTruthBound(false);
                  console.error(`🚨 Emergency mode activated: ${reason}`);
                }
              }}
              fallbackUI={
                <div className="h-full flex flex-col items-center justify-center text-red-500 bg-red-900/20 rounded-lg p-8">
                  <AlertTriangle size={48} className="mb-4" />
                  <h3 className="text-xl font-bold mb-2">Computation Result Blocked</h3>
                  <p className="text-center mb-4">This output has been blocked by the Emergency Fuse because it does not meet truth-bound requirements.</p>
                  <div className="bg-red-950/50 p-4 rounded-lg flex items-center max-w-md">
                    <Shield size={24} className="mr-3 text-red-400" />
                    <p className="text-sm">DeepCAL is operating under strict truth enforcement. Only verified neutrosophic calculations are permitted during outbreak response.</p>
                  </div>
                </div>
              }
            >
              <CognitiveGridOutput data={result} />
            </EmergencyFuse>
          )}
        </div>
      </div>
      
      {/* Truth-Bound Banner */}
      <TruthBoundBanner 
        isTruthBound={isTruthBound}
        algorithmFingerprint={algorithmFingerprint}
        timestamp={analysisTimestamp}
      />
      </div>
    </div>
  );
};
export default DeepCAL;
