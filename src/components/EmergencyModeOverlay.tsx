import React from 'react';

/**
 * Emergency Mode Overlay Component
 * 
 * Displayed when computation failure or fallback occurs in critical life-saving contexts.
 * Blocks UI interaction and provides clear emergency instructions.
 */
interface EmergencyModeProps {
  active: boolean;
  errorReference?: string;
  errorType?: 'COMPUTATION_FAILURE' | 'INTEGRITY_CHECK_FAILED' | 'FALLBACK_ALGORITHM' | 'SIMULATION_MODE';
  onRequestManualOverride?: () => void;
}

const EmergencyModeOverlay: React.FC<EmergencyModeProps> = ({
  active,
  errorReference,
  errorType = 'COMPUTATION_FAILURE',
  onRequestManualOverride
}) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-900/90 flex flex-col items-center justify-center p-6 text-white">
      <div className="animate-pulse mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-100">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold mb-2 uppercase tracking-wider text-center">EMERGENCY MODE ACTIVATED</h1>
      <h2 className="text-xl font-medium mb-6 text-center">DeepCAL Decision Chain Integrity Violation</h2>
      
      <div className="bg-red-950 p-6 rounded-lg max-w-3xl">
        <div className="mb-4 pb-4 border-b border-red-800">
          <p className="text-lg font-medium">Error Type: {errorType.replace(/_/g, ' ')}</p>
          {errorReference && <p className="text-sm text-red-300">Reference ID: {errorReference}</p>}
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-lg">
            <span className="font-bold">CRITICAL ALERT:</span> The DeepCAL Decision Chain has failed to produce reliable routing recommendations for critical supplies.
          </p>
          <p>
            <span className="font-bold">DO NOT</span> rely on previous DeepCAL outputs for decision-making. All prior recommendations should be considered compromised.
          </p>
          <p>
            <span className="font-bold">EMERGENCY PROTOCOL:</span> Contact the logistics command center immediately for manual routing instructions.
          </p>
        </div>
        
        <div className="bg-red-900 p-4 rounded">
          <h3 className="font-bold mb-2">IMMEDIATE ACTION REQUIRED:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Call emergency response team: <span className="font-mono bg-red-950 px-2 rounded">+1-555-DEEPCAL</span></li>
            <li>Provide error reference: <span className="font-mono bg-red-950 px-2 rounded">{errorReference || 'UNKNOWN'}</span></li>
            <li>Initiate manual routing procedures using backup documentation</li>
            <li>Do not attempt to reuse or restart the system until authorized</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button 
          onClick={onRequestManualOverride}
          className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center"
        >
          Request Manual Override Authorization
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-red-950 px-3 py-1 rounded text-xs">
        DeepCAL Emergency Protocol v1.1 • {new Date().toISOString()}
      </div>
    </div>
  );
};

export default EmergencyModeOverlay;
