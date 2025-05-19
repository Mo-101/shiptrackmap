import React from 'react';
import { EngineInput } from './EngineInputPanel';

interface Props {
  explanation: string;
  confidence: number;
  input: EngineInput;
}

export const SymbolicExplanation: React.FC<Props> = ({ explanation, confidence, input }) => (
  <div className="bg-palette-blue/70 p-4 rounded-md mt-2 animate-fade-in">
    <h4 className="text-palette-mint font-semibold mb-1">Symbolic Explanation</h4>
    <div className="text-white/90 mb-2">{explanation}</div>
    <div className="flex gap-4 items-center text-sm">
      <span className="text-palette-mint">Delivery Confidence:</span>
      <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-palette-mint" style={{ width: `${confidence * 100}%` }}></div>
      </div>
      <span className="text-white/70">{Math.round(confidence * 100)}%</span>
    </div>
  </div>
);
