import React from 'react';

interface Props {
  onRetry: () => void;
}

export const EmergencyFuse: React.FC<Props> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-red-900/70 rounded-md border-2 border-red-400 animate-fade-in">
    <div className="mb-3">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ff4d4f"/><path d="M12 7v5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="#fff"/></svg>
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">Computation Blocked</h3>
    <p className="text-white/80 mb-4">Only verified neutrosophic calculations are permitted during outbreak response.<br/>Try with known carriers or remove unverifiable inputs.</p>
    <button className="btn btn-accent" onClick={onRetry}>Edit Inputs</button>
  </div>
);
