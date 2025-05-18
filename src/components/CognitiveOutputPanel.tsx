import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the useTypewriter hook from the new file
import { useTypewriter } from './useTypewriter';

// Mock output (replace with real output from runNeuroSymbolicCycle)
const mockLog = [
  '🧠 Calculating AHP weights... ✔',
  '🧮 Normalizing decision matrix... ✔',
  '📊 Running TOPSIS scoring...',
  '🧠 Symbolic rules evaluated: R1, R2, R4 passed, R3 failed ❌',
  '📌 Best route identified: Kuehne & Nagel (Score: 89.2%)',
];

const mockSummary = {
  forwarder: 'Kuehne & Nagel',
  route: 'Nairobi → Zimbabwe',
  mode: 'Road',
  container: '20ft',
  confidence: 89.2,
  rationale: 'K&N is selected due to shortest delivery time, low historical risk, and high corridor reliability. Satisfies 4 of 5 symbolic rules. Outperformed 3 other options in weighted scoring.'
};

const mockKPIs = [
  { label: 'Resilience', value: 0.91, color: 'green' },
  { label: 'Risk', value: 0.21, color: 'amber' },
  { label: 'Cost-Efficiency', value: 0.78, color: 'green' },
  { label: 'Responsiveness', value: 0.64, color: 'amber' },
];

const mockRules = [
  { name: 'Rule 1: Corridor open', status: 'passed' },
  { name: 'Rule 2: Forwarder reputation', status: 'passed' },
  { name: 'Rule 3: No embargo', status: 'failed' },
  { name: 'Rule 4: Delivery window', status: 'passed' },
];

export const CognitiveOutputPanel: React.FC<{ output?: any }> = ({ output }) => {
  const [show, setShow] = useState(false);

  // Use real output if present, otherwise mock
  const log = useTypewriter(output?.reasoningLog || mockLog, 850);
  const summary = output?.summary || mockSummary;
  const kpis = output?.kpis || mockKPIs;
  const rules = output?.rules || mockRules;

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-8 p-6 bg-palette-darkblue/90 rounded-xl shadow-lg">
      {/* Loader overlay */}
      {!show && (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palette-mint mb-4" />
          <div className="text-palette-mint text-lg font-bold">🧠 Running Neuro-Symbolic Analysis…</div>
          <button className="mt-6 px-4 py-2 rounded bg-palette-mint text-black font-bold hover:bg-palette-mint/80" onClick={() => setShow(true)}>
            Simulate Analysis
          </button>
        </motion.div>
      )}
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            {/* Typewriter log */}
            <div className="mb-4 min-h-[120px]">
              {log.map((line, i) => (
                <div key={i} className="font-mono text-palette-mint text-base leading-6">{line}</div>
              ))}
            </div>
            {/* Decision Summary */}
            {log.length === (output?.reasoningLog?.length || mockLog.length) && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-palette-blue/20 rounded-lg p-4 mb-4">
                  <div className="text-xl font-bold text-palette-mint mb-2">Selected Forwarder: {summary.forwarder}</div>
                  <div className="text-white mb-1">Route: <span className="font-semibold">{summary.route}</span> | Mode: {summary.mode} | Container: {summary.container}</div>
                  <div className="text-palette-mint font-bold">Confidence Score: {summary.confidence}%</div>
                  <div className="text-white mt-2 italic">{summary.rationale}</div>
                </motion.div>
                {/* KPI Cards */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-4 mb-4">
                  {kpis.map((kpi: any, i: number) => (
                    <motion.div key={i} className={`rounded-lg p-4 flex flex-col items-center shadow bg-palette-blue/30 border-l-4 ${kpi.color === 'green' ? 'border-green-400' : kpi.color === 'amber' ? 'border-amber-400' : 'border-red-400'}`}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.12 }}>
                      <div className="text-lg font-bold text-white mb-1">{kpi.label}</div>
                      <div className={`text-2xl font-mono ${kpi.color === 'green' ? 'text-green-400' : kpi.color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>{(kpi.value * 100).toFixed(0)}%</div>
                    </motion.div>
                  ))}
                </motion.div>
                {/* Rule Breakdown */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-palette-blue/20 rounded-lg p-4 mb-4">
                  <div className="text-lg font-bold text-palette-mint mb-2">Symbolic Rule Evaluation</div>
                  <div className="flex flex-wrap gap-2">
                    {rules.map((rule: any, i: number) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-sm font-mono ${rule.status === 'passed' ? 'bg-green-600/20 text-green-400 border border-green-400/40' : 'bg-red-600/20 text-red-400 border border-red-400/40'}`}>{rule.name} {rule.status === 'passed' ? '✔' : '❌'}</span>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
            {/* TODO: Add Alternatives, Trends, Narrative, etc. as animated sections */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CognitiveOutputPanel;
