import { useState } from 'react';
import { EngineInput, ForwarderQuote } from '../components/EngineInputPanel';
import { RankedForwarder } from '../components/EngineResultPanel';

export function rankForwarders(forwarders: ForwarderQuote[], urgency: string, perish: boolean): RankedForwarder[] {
  return forwarders
    .map(q => ({
      ...q,
      score: Number(q.quote) + (urgency === 'High' ? 1000 : 0) + (perish ? 500 : 0)
    }))
    .sort((a, b) => a.score - b.score);
}

export function verifyTruth(input: EngineInput): boolean {
  if (!input.urgency || !input.carrier || !input.weight_kg || input.weight_kg < 1) {
    return false;
  }
  // Additional strict checks can be added here
  return true;
}

export function useDecisionEngine() {
  const [input, setInput] = useState<EngineInput | null>(null);
  const [ranked, setRanked] = useState<RankedForwarder[]>([]);
  const [explanation, setExplanation] = useState('');
  const [confidence, setConfidence] = useState(0.0);
  const [blocked, setBlocked] = useState(false);

  function analyze(inputData: EngineInput) {
    setInput(inputData);
    const valid = verifyTruth(inputData);
    setBlocked(!valid);
    if (!valid) {
      setRanked([]);
      setExplanation('');
      setConfidence(0);
      return;
    }
    const ranked = rankForwarders(inputData.forwarders, inputData.urgency, inputData.perishable);
    setRanked(ranked);
    setExplanation(
      `Ranking based on cost${inputData.urgency === 'High' ? ', urgency' : ''}${inputData.perishable ? ', perishable' : ''}.\nNeutrosophic rule: ${inputData.urgency === 'High' ? 'Urgency boost applied.' : 'Standard risk.'}`
    );
    setConfidence(0.7 + (inputData.urgency === 'High' ? 0.1 : 0) + (inputData.perishable ? 0.05 : 0));
  }

  function reset() {
    setInput(null);
    setRanked([]);
    setExplanation('');
    setConfidence(0.0);
    setBlocked(false);
  }

  return {
    input,
    ranked,
    explanation,
    confidence,
    blocked,
    analyze,
    reset
  };
}
