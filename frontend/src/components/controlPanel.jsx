import React from 'react';
import {ALGO_CONFIG} from '../data/config.jsx';

//Resuable input component to keep panel clean

const ParamInput = ({config, value, onChange, disabled}) => {
    const commonProps = {
        id: config.name,
        name: config.name,
        value: value,
        onChange: (e) => onChange(config.name, e.target.value),
        className: 'w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 mt-1 disabled:opacity-50',
        disabled: disabled,
    };

    if (config.type === 'number'){
        return <input type = 'number' {...commonProps} min = {config.min} max = {config.max}/>;
    }

    return <input type = 'text' {...commonProps} />;
};

const ControlPanel = ({
    problem, setProblem,
    algorithm, setAlgorithm,
    params, setParams,
    onVisualize, vizState,
    setTrace, setCurrentStep, setVizState
}) => {
    const currentConfig = ALGO_CONFIG[problem];
    const isRunning = vizState === 'running' || vizState === 'paused' || vizState === 'complete';
    
    const handleProblemChange = (e) => {
        const newProblem = e.target.value;
        setProblem(newProblem);
        setAlgorithm(ALGO_CONFIG[newProblem].algorithms[0]);
        setParams(
            Object.fromEntries(ALGO_CONFIG[newProblem].params.map(p => [p.name, p.defaultValue]))
        );
        handleReset();
    };

    const handleAlgorithmChange = (e) => {
        setAlgorithm(e.target.value);
        handleReset();
    };

    const handleParamChange = (name, value) => {
        setParams(prev => ({...prev, [name] : value }))
    };

    const handleReset = () => {
        setTrace([]);
        setCurrentStep(0);
        setVizState('idle');
    };

    return (
        <>
            <div>
                <label htmlFor="problem-select" className='block text-sm font-medium text-gray-400'>Problem</label>
                <select id="problem-select"
                        value={problem}
                        onChange={handleProblemChange}
                        disabled={isRunning}
                        className='w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 mt-1 disabled:opacity-50'
                >
                    {Object.entries(ALGO_CONFIG).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="algorithm-select" className='block text-sm font-medium text-gray-400'>Algorithm</label>
                <select id="algorithm-select"
                        value={algorithm}
                        onChange={handleAlgorithmChange}
                        disabled={isRunning}
                        className='w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500 mt-1 disabled:opacity-50'
                >
                    {currentConfig.algorithms.map(algo => (
                        <option key={algo} value={algo} className='capitalize'>{algo}</option>
                    ))}
                </select>
            </div>

            <hr className='border-gray-600' />

            <div className='flex flex-col gap-4'>
                    <h3 className='text-lg font-semibold text-gray-300'>Parameters</h3>
                    {currentConfig.params.map(paramConfig => (
                        <div key={paramConfig.name}>
                            <label htmlFor={paramConfig.name} className='block text-sm font-medium text-gray-400 capitalize'>{paramConfig.name}</label>
                            <ParamInput
                                config={paramConfig}
                                value={params[paramConfig.name] ?? ''}
                                onChange={handleParamChange}
                                disabled={isRunning}
                            />
                        </div>
                    ))}
            </div>

            <div className='mt-auto pt-4 flex flex-col gap-2'>
                <button 
                    onClick={onVisualize} 
                    disabled={isRunning}
                    className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 
                        disabled:bg-gray-500 disabled:cursor-not-allowed'
                >Visualize</button>

                <button 
                    onClick={handleReset} 
                    disabled={vizState === 'idle'}
                    className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 
                        disabled:bg-gray-500 disabled:cursor-not-allowed'
                >Reset</button>
            </div>
        </>
    );
};

export default ControlPanel