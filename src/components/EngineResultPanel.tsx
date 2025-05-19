import React from 'react';
import { ForwarderQuote, EngineInput } from './EngineInputPanel';
import { ForwarderRankTable } from './ForwarderRankTable';
import { SymbolicExplanation } from './SymbolicExplanation';
import { EmergencyFuse } from './EmergencyFuse';

export interface RankedForwarder extends ForwarderQuote {
  score: number;
}

interface Props {
  input: EngineInput;
  ranked: RankedForwarder[];
  explanation: string;
  confidence: number;
  blocked: boolean;
  onRetry: () => void;
}

export const EngineResultPanel: React.FC<Props> = ({ input, ranked, explanation, confidence, blocked, onRetry }) => {
  return (
    <div className="bg-palette-blue/50 p-6 rounded-md min-h-[540px] flex flex-col gap-6 animate-fade-in">
      {blocked ? (
        <EmergencyFuse onRetry={onRetry} />
      ) : (
        <>
          <h2 className="text-xl font-bold text-palette-mint mb-2">Decision Results</h2>
          <ForwarderRankTable ranked={ranked} />
          <div className="mt-4">
            <SymbolicExplanation explanation={explanation} confidence={confidence} input={input} />
          </div>
        </>
      )}
    </div>
  );
};
