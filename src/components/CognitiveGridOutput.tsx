import React from 'react';
import { AlertCircle, CheckCircle, Info, LineChart, List, Settings, Users } from 'lucide-react';
import './CognitiveGridOutput.css';

// Error Boundary Component
class ComponentErrorBoundary extends React.Component<{children: React.ReactNode, fallback?: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, fallback?: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <AlertCircle size={18} />
          <span>Component Error</span>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// --- Section Components with improved styling and error handling ---
export function LiveCognitionLog({ steps = [] }: { steps?: string[] }) {
  return (
    <div className="cognitive-panel cognitive-log">
      <div className="panel-header">
        <Settings size={18} className="mr-2" />
        <h3>DeepCAL Process Log</h3>
      </div>
      <div className="panel-content">
        {steps.map((step, i) => (
          <div key={i} className="log-step">
            <span className="step-number">{i+1}</span>
            <span className="step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExecutiveSummary({ summary = { recommendation: '' } }: { summary?: { recommendation: string } }) {
  return (
    <div className="cognitive-panel cognitive-summary">
      <div className="panel-header">
        <Info size={18} className="mr-2" />
        <h3>Executive Recommendation</h3>
      </div>
      <div className="panel-content">
        <p className="recommendation">{summary.recommendation}</p>
      </div>
    </div>
  );
}

export function KpiDashboard({ kpis = [] }: { kpis?: Array<{label: string, value: string, color?: string}> }) {
  return (
    <div className="cognitive-panel cognitive-kpis">
      <div className="panel-header">
        <LineChart size={18} className="mr-2" />
        <h3>Performance Metrics</h3>
      </div>
      <div className="panel-content">
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div key={i} className="kpi-item">
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value" style={{color: kpi.color || 'inherit'}}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SymbolicRulePanel({ rules = [] }: { rules?: Array<{name: string, status: string}> }) {
  return (
    <div className="cognitive-panel cognitive-rules">
      <div className="panel-header">
        <CheckCircle size={18} className="mr-2" />
        <h3>Neutrosophic Rules</h3>
      </div>
      <div className="panel-content">
        {rules.map((rule, i) => (
          <div key={i} className="rule-item">
            <div className="rule-name">{rule.name}</div>
            <div className={`rule-status ${rule.status.toLowerCase()}`}>{rule.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DecisionMatrix({ matrix = {criteria: [], weights: [], alternatives: []} }: { matrix?: {criteria: string[], weights: number[], alternatives: Array<{name: string, scores: number[]}>} }) {
  return (
    <div className="cognitive-panel cognitive-matrix">
      <div className="panel-header">
        <List size={18} className="mr-2" />
        <h3>N-TOPSIS Decision Matrix</h3>
      </div>
      <div className="panel-content">
        {matrix.criteria?.length > 0 ? (
          <table className="decision-table">
            <thead>
              <tr>
                <th>Alternative</th>
                {matrix.criteria.map((c, i) => (
                  <th key={i}>
                    {c}
                    <span className="weight">({(matrix.weights[i] * 100).toFixed(0)}%)</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.alternatives?.map((alt, i) => (
                <tr key={i}>
                  <td>{alt.name}</td>
                  {alt.scores.map((score, j) => (
                    <td key={j} className={score > 0.85 ? 'high-score' : score > 0.75 ? 'mid-score' : ''}>
                      {(score * 100).toFixed(0)}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Matrix data not available</p>
        )}
      </div>
    </div>
  );
}

export function AlternativesPanel({ alternatives = [] }: { alternatives?: Array<{name: string, score: number, selected?: boolean}> }) {
  // Sort alternatives by score
  const sortedAlternatives = [...alternatives].sort((a, b) => b.score - a.score);
  
  return (
    <div className="cognitive-panel cognitive-alternatives">
      <div className="panel-header">
        <Users size={18} className="mr-2" />
        <h3>Carrier Alternatives</h3>
      </div>
      <div className="panel-content">
        {sortedAlternatives.map((alt, i) => (
          <div key={i} className={`alternative-item ${alt.selected ? 'selected' : ''}`}>
            <div className="alt-name">{alt.name}</div>
            <div className="alt-score-wrapper">
              <div className="alt-score-bar" style={{width: `${alt.score * 100}%`}}></div>
              <span className="alt-score-value">{(alt.score * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NarrativeInsights({ narrative = '' }: { narrative?: string }) {
  return (
    <div className="cognitive-panel cognitive-insights">
      <div className="panel-header">
        <Info size={18} className="mr-2" />
        <h3>DeepCAL Narrative</h3>
      </div>
      <div className="panel-content">
        <p className="narrative-text">{narrative}</p>
      </div>
    </div>
  );
}

// --- Main Grid Container with error boundaries ---
export default function CognitiveGridOutput({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="cognitive-grid-error">
        <AlertCircle size={24} />
        <h3>No analysis data available</h3>
        <p>Please ensure all required inputs are provided and try again.</p>
      </div>
    );
  }

  return (
    <div className="cognitive-grid">
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'log' }}><LiveCognitionLog steps={data.steps} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'summary' }}><ExecutiveSummary summary={data.summary} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'kpis' }}><KpiDashboard kpis={data.kpis} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'rules' }}><SymbolicRulePanel rules={data.rules} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'matrix' }}><DecisionMatrix matrix={data.matrix} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'alternatives' }}><AlternativesPanel alternatives={data.alternatives} /></div>
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary>
        <div style={{ gridArea: 'insights' }}><NarrativeInsights narrative={data.narrative} /></div>
      </ComponentErrorBoundary>
    </div>
  );
}
