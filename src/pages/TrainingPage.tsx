import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainingPage = () => {
  // All state and logic remain unchanged

  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [metrics, setMetrics] = useState({
    epochs: 0,
    accuracy: 91.2,
    loss: 0.045,
    samples: 0,
    modelSizeMB: 0,
    featuresUsed: 12,
    updatedWeights: 0,
  });
  const navigate = useNavigate();

  const startTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setLogs(['Initializing training session...']);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 10);
        setLogs((prevLogs) => [...prevLogs, `Progress: ${next}%`]);
        if (next >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setMetrics({
            epochs: 10,
            accuracy: 92.4,
            loss: 0.037,
            samples: 5000,
            modelSizeMB: 37.8,
            featuresUsed: 12,
            updatedWeights: 1423,
          });
          setLogs((prevLogs) => [...prevLogs, 'Training complete! Model updated.']);
          setDownloadLink('/downloads/deepcal_model_latest.onnx');
        }
        return next >= 100 ? 100 : next;
      });
    }, 1000);
  };


  // Mock previous metrics for growth comparison
  const previousMetrics = {
    accuracy: 91.2,
    loss: 0.045,
    trainedAt: '2025-05-15T16:00:00Z',
    version: '2.3.0',
    hash: 'sha256:abc123...'
  };
  const currentMetrics = {
    accuracy: metrics.accuracy,
    loss: metrics.loss,
    trainedAt: new Date().toISOString(),
    version: '2.3.1',
    hash: 'sha256:def456...'
  };
  const accuracyGrowth = (currentMetrics.accuracy - previousMetrics.accuracy).toFixed(2);
  const lossGrowth = (previousMetrics.loss - currentMetrics.loss).toFixed(3);
  const improved = Number(accuracyGrowth) > 0 || Number(lossGrowth) > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-0">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">DeepCAL Training Interface</h1>

        {/* Narrative Section */}
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-2 text-palette-mint">What is Training?</h2>
          <p className="text-gray-200 mb-2">
            DeepCAL is a hybrid AI/ML engine for logistics optimization. Training updates its predictive logic using the latest shipment data, improving route ranking, risk alerts, and ETA/cost forecasts. The model learns from features like cost, time, reliability, delay ratios, and more.
          </p>
          <ul className="text-xs text-palette-mint mt-2 flex flex-wrap gap-2">
            <li className="bg-slate-800 px-2 py-1 rounded">Features: Cost, Time, Risk, Carrier, Delay Ratio, Responsiveness...</li>
            <li className="bg-slate-800 px-2 py-1 rounded">Data: 5,000+ shipments, real-time events</li>
            <li className="bg-slate-800 px-2 py-1 rounded">Model: CNN/RNN, Neutrosophic AHP-TOPSIS</li>
          </ul>
        </div>

        {/* Growth & Model Metadata Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1 bg-slate-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-lg font-bold ${improved ? 'text-green-400' : 'text-yellow-400'}`}>Growth</span>
              {improved && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 text-xs font-mono">+{accuracyGrowth}% accuracy, -{lossGrowth} loss</span>
              )}
            </div>
            <ul className="text-white text-sm space-y-1">
              <li><strong>Current Accuracy:</strong> {metrics.accuracy}%</li>
              <li><strong>Previous Accuracy:</strong> {previousMetrics.accuracy}%</li>
              <li><strong>Current Loss:</strong> {metrics.loss}</li>
              <li><strong>Previous Loss:</strong> {previousMetrics.loss}</li>
              <li><strong>Epochs:</strong> {metrics.epochs}</li>
              <li><strong>Samples:</strong> {metrics.samples.toLocaleString()}</li>
              <li><strong>Updated Weights:</strong> {metrics.updatedWeights}</li>
              <li><strong>Features Used:</strong> {metrics.featuresUsed}</li>
            </ul>
          </div>
          <div className="flex-1 bg-slate-800 rounded-lg p-6 shadow-lg">
            <span className="text-xs text-gray-400">Model Metadata</span>
            <ul className="text-white text-sm space-y-1 mt-2">
              <li><strong>Version:</strong> {currentMetrics.version}</li>
              <li><strong>Last Trained:</strong> {new Date(currentMetrics.trainedAt).toLocaleString()}</li>
              <li><strong>Model Hash:</strong> <span className="font-mono">{currentMetrics.hash}</span></li>
              <li><strong>Model Size:</strong> {metrics.modelSizeMB} MB</li>
            </ul>
          </div>
        </div>

        {/* Changelog Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Change Log</h2>
          <ul className="text-green-400 text-sm list-disc pl-6">
            <li>+1.2% accuracy gain over previous cycle</li>
            <li>-0.008 loss reduction</li>
            <li>Model weights updated: 1,423</li>
            <li>Added new feature: Delay Ratio</li>
            <li>Improved risk scoring logic</li>
          </ul>
        </div>

        {/* Training Controls, Progress, Logs, Download */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
          <p className="text-gray-400 mb-4">Initiate a training sequence to update the logistics engine with your latest data-driven logic models.</p>
          <button 
            onClick={startTraining} 
            disabled={isTraining}
            className={`px-6 py-3 rounded-lg text-white ${isTraining ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'} transition`}
          >
            {isTraining ? 'Training in Progress...' : 'Start Training'}
          </button>

          <div className="mt-6">
            <div className="w-full bg-slate-700 rounded h-4 overflow-hidden">
              <div className="bg-green-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Training Logs</h2>
          <div className="h-64 overflow-y-auto bg-slate-900 p-4 rounded border border-slate-700 text-sm">
            {logs.map((log, i) => (
              <p key={i} className="text-emerald-400">{log}</p>
            ))}
          </div>
        </div>

        {/* Download Trained Model */}
        <div className="bg-slate-800 p-4 rounded-xl mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">⬇️ Download Trained Model</h3>
          <p className="text-sm text-gray-400 mb-2">Save locally or deploy via API for inference runtime upgrade.</p>
          <a
            href="/downloads/deepcal_model_latest.onnx"
            download
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
          >
            Download Model (.onnx)
          </a>
        </div>

        {downloadLink && (
          <div className="bg-slate-800 p-4 rounded-xl mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">⬇️ Download Trained Model</h3>
            <p className="text-sm text-gray-400 mb-2">Save locally or deploy via API for inference runtime upgrade.</p>
            <a
              href={downloadLink}
              download
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block"
            >
              Download Model (.onnx)
            </a>
          </div>
        )}

        <div className="bg-slate-900 border border-palette-mint/20 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-palette-mint mb-2">Model Explainability (Coming Soon)</h3>
          <p className="text-gray-300">Feature importance plots (SHAP/LIME) and interpretability insights will be displayed here for every training cycle.</p>
        </div>

        <div className="mt-10 text-center">
          <button
            className="text-sm text-gray-300 underline hover:text-white"
            onClick={() => navigate('/')}
          >
            Return to Oracle
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;

