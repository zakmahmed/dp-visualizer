import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { ALGO_CONFIG } from './data/config.jsx';
import ControlPanel from './components/controlPanel.jsx';
import InfoPanel from './components/infoPanel';
import Visualization from './components/visualization.jsx';

// Helper function to parse user inputs

const parseInput = (value, type) => {
  if (type === 'number') return parseInput(value, 10) || 0;
  if (type === 'text' && String(value).includes(',')){
    return String(value).split(',') .map(s => parseInt(s.trim(), 10) || 0);
  }
  return value;
}

export default function App(){
  // state for websocket connection
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('Disconnected');
  const [error, setError] = useState('');

  // state for UI controls
  const [problem, setProblem] = useState('fibonacci');
  const [algorithm, setAlgorithm] = useState('recursive');
  const [params, setParams] = useState(
    Object.fromEntries(
      ALGO_CONFIG.fibonacci.params.map(p => [p.name, p.defaultValue])
    )
  );

  // Visualization state
  const [trace, setTrace] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [vizState, setVizState] = useState('idle');

  // Effect for setting up websocket connection
  useEffect(() => {
    const s = io('http://localhost:5001');
    setSocket(s);
    s.on('connect', () => setStatus('Connected'));
    s.on('disconnect', () => setStatus('Disconnected'));
    s.on('error', (err) => setError(err.message || 'An unknown error occurred'));

    // Listeners

    s.on('trace_step', (step) => {
      setTrace(prev => [...prev, step]);
    });

    s.on('execution_complete', () => {
      setVizState('complete');
    });

    return () => s.disconnect();

  }, []);

  // Effect for auto-play visualization when running
  useEffect(() => {
    if (vizState === 'running' && currentStep < trace.length - 1){
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [trace.length, currentStep, vizState]);

  // Sending Visualization request to backend
  const handleVisualize = useCallback(() => {
    if (!socket || vizState === 'running') return;

    // reset previous visualization
    setTrace([]);
    setCurrentStep(0);
    setError('');
    setVizState('running');

    const parsedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => {
        const paramConfig = ALGO_CONFIG[problem].params.find(p => p.name === key);
        return [key, parseInput(value, paramConfig.type)];
      })
    );

    socket.emit('execute_algorithm', {problem, algorithm, params: parsedParams});

  }, [socket, problem, algorithm, params, vizState])

  return (
    <div className='bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col'>
      <header className='bg-gray-800 p-4 shadow-md text-center border-b border-gray-700'>
        <h1 className='text-3x1 font-bold text-cyan-400'> Dynamic Programming Visualizer</h1>
        <p className='text-gray-400 mt-1'>An interactive teaching tool</p>
      </header>

      <div className='flex flex-1 p-4 gap-4 overflow-hidden'>
        <div className='w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-6 overflow-y-auto'>
          <ControlPanel
            problem={problem}
            setProblem={setProblem}
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            params={params}
            setParams={setParams}
            onVisualize={handleVisualize}
            vizState={vizState}
            setTrace={setTrace}
            setCurrentStep={setCurrentStep}
            setVizState={setVizState}
            />
        </div>

        <div className='flex-1 flex flex-col gap-4'>
          <main className='flex-1 bg-gray-800 rounded-lg shadow-lg p-2 relative'>
            <Visualization
              trace={trace}
              currentStep={currentStep}
              problem={problem}
              algorithm={algorithm}
            />
          </main>

          <div className='h-1/3 flex gap-4'>
            <InfoPanel
              trace={trace}
              currentStep={currentStep}
              problem={problem}
              algorithm={algorithm}
            />

            <Visualization
              vizState={vizState}
              setVizState={setVizState}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              traceLength={trace.length}
            />
          </div>
        </div>
      </div>

    <footer className='text-center p-2 bg-gray-800 border-t border-gray-700 text-sm text-gray-500'>
      Status: {status} {error && `| Error: ${error}`}
    </footer>
    </div>
  );
}