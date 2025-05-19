import React from 'react';
import { EngineInputPanel } from '../components/EngineInputPanel';
import { EngineResultPanel } from '../components/EngineResultPanel';
import { useDecisionEngine } from '../hooks/useDecisionEngine';

const DecisionEngine: React.FC = () => {
  const {
    input,
    ranked,
    explanation,
    confidence,
    blocked,
    analyze,
    reset
  } = useDecisionEngine();

  return (
    <div className="w-screen h-screen flex bg-palette-darkblue text-white font-orbitron">
      {/* Left Input Panel */}
      <div className="w-[400px] p-4 border-r border-palette-mint/20 bg-palette-darkblue flex flex-col">
        <EngineInputPanel onSubmit={analyze} />
      </div>
      {/* Right Content Panel */}
      <div className="flex-1 p-6 overflow-auto">
        {input ? (
          <EngineResultPanel
            input={input}
            ranked={ranked}
            explanation={explanation}
            confidence={confidence}
            blocked={blocked}
            onRetry={reset}
          />
        ) : (
          <div className="text-center text-palette-mint/80 mt-20 text-xl animate-fade-in">
            Fill in shipment details and click <span className='text-palette-mint font-bold'>"Enter the Deep"</span> to see DeepCAL++ recommendations
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionEngine;
