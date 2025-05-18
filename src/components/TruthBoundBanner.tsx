import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Truth-Bound Banner Component
 * 
 * Displays a mandatory banner indicating whether the system is operating in 
 * truth-bound (real data/algorithms) or simulation mode (mock data/simplified algorithms).
 */
interface TruthBoundBannerProps {
  isTruthBound: boolean;
  algorithmFingerprint?: string;
  timestamp?: string;
}

const TruthBoundBanner: React.FC<TruthBoundBannerProps> = ({ 
  isTruthBound, 
  algorithmFingerprint = 'unknown',
  timestamp = new Date().toISOString()
}) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40
      ${isTruthBound ? 'bg-green-900/90' : 'bg-amber-900/90'} 
      text-white transition-all duration-300 shadow-lg
      ${expanded ? 'py-4' : 'py-1.5'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTruthBound ? (
              <CheckCircle size={20} className="text-green-400" />
            ) : (
              <AlertTriangle size={20} className="text-amber-400" />
            )}
            
            <span className="font-medium">
              {isTruthBound 
                ? 'TRUTH-BOUND MODE: Using real DeepCAL algorithms' 
                : 'SIMULATION MODE: Using approximate calculations'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setExpanded(!expanded)}
              className={`
                ${isTruthBound ? 'hover:bg-green-800' : 'hover:bg-amber-800'} 
                rounded px-2 py-1 text-sm
              `}
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${isTruthBound ? 'bg-green-950/60' : 'bg-amber-950/60'} p-3 rounded`}>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Info size={16} />
                System Status Information
              </h3>
              <ul className="text-sm space-y-1">
                <li>
                  <span className="opacity-70">Mode:</span>{' '}
                  <span className="font-mono">
                    {isTruthBound ? 'TRUTH-BOUND' : 'SIMULATION'}
                  </span>
                </li>
                <li>
                  <span className="opacity-70">Algorithm:</span>{' '}
                  <span className="font-mono">
                    {isTruthBound ? 'DeepCAL-N-TOPSIS-Grey' : 'Simplified-MCDM'}
                  </span>
                </li>
                <li>
                  <span className="opacity-70">Fingerprint:</span>{' '}
                  <span className="font-mono">{algorithmFingerprint}</span>
                </li>
                <li>
                  <span className="opacity-70">Timestamp:</span>{' '}
                  <span className="font-mono">{timestamp}</span>
                </li>
              </ul>
            </div>
            
            <div className={`${isTruthBound ? 'bg-green-950/60' : 'bg-amber-950/60'} p-3 rounded`}>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertCircle size={16} />
                Important Notice
              </h3>
              <p className="text-sm">
                {isTruthBound 
                  ? 'This system is using the complete neutrosophic decision chain for critical supply routing. All outputs represent actual algorithm results applied to real-world data.'
                  : 'CAUTION: This system is running in simulation mode. Outputs are approximations and should NOT be used for actual emergency response decision-making.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthBoundBanner;
