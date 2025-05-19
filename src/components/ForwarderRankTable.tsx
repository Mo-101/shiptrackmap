import React from 'react';
import { RankedForwarder } from './EngineResultPanel';

interface Props {
  ranked: RankedForwarder[];
}

export const ForwarderRankTable: React.FC<Props> = ({ ranked }) => (
  <table className="table table-zebra w-full bg-palette-blue/80 rounded-md animate-fade-in">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Forwarder</th>
        <th>Quote (USD)</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {ranked.map((f, i) => (
        <tr key={f.name} className="text-white/90">
          <td>{i + 1}</td>
          <td>{f.name}</td>
          <td>${f.quote.toLocaleString()}</td>
          <td>{f.score}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
