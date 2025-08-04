import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Rewind } from 'lucide-react';

//A reusable button component for consistency

const ControlButton = ({ onClick, disabled, children, title }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        title={title}
        className='p-2 rounded-full text-gray-300 transition-colors duration-200 enabled:hover:bg-gray-700 disbaled:
                text-gray-600 disbaled:cursor-not-allowed'>
        {children} </button>
);

const PlaybackControls = ({ vizState, setVizState, currentStep, setCurrentStep, traceLength }) => {
// Functions to handle button clicks
    const handlePlay = () => {
        setVizState('running');
    };

    const handlePause = () => {
        setVizState('paused');
    };

    const handleReset = () => {
        setCurrentStep(0);
        setVizState('paused');
    };

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setVizState('paused');
        }
    };

    const handleStepForward = () => {
        if (currentStep < traceLength - 1) {
            setCurrentStep(prev => prev + 1);
            setVizState('paused');
        }
    };

    const isPlaying = vizState === 'running';
    const hasStarted = traceLength > 0;


    return (
        <div className='w-full bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center gap-4'>
            <div className='w-full px-2'>
                <label htmlFor='slider' className='block text-sm font-medium text-gray-400 mb-1'>
                    Step: <span className='font-mono text-cyan-400'>{currentStep}</span> / 
                    <span className='font-mono text-gray-500'>{traceLength > 0 ? traceLength - 1 : 0}</span>
                </label>
                <input
                    id='slider'
                    type='range'
                    min="0"
                    max={traceLength > 0 ? traceLength - 1 : 0}
                    value={currentStep}
                    onChange={(e) => setCurrentStep(Number(e.target.value))}
                    disabled={!hasStarted}
                    className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed'
                />
            </div>

            <div className='flex items-center justify-center gap-4'>
                <ControlButton onClick={handleReset} disabled={!hasStarted} title='Reset'>
                    <Rewind size={24}/>
                </ControlButton>

                <ControlButton onClick={handleStepBack} disabled={!hasStarted || currentStep === 0} title='Step Back'>
                    <SkipBack size={24}/>
                </ControlButton>

                {isPlaying ? (
                    <ControlButton onClick={handlePause} disabled={!hasStarted || vizState === 'complete'} title='Pause'>
                        <div className='p-2 bg-cyan-600 rounded-full text-white'>
                            <Pause size={32}/>
                        </div>
                    </ControlButton>
                ) : (
                    <ControlButton onClick={handlePlay} disabled={!hasStarted || vizState === 'complete'} title='Play'>
                        <div className='p-2 bg-cyan-600 rounded-full text-white'>
                            <Play size={32}/>
                        </div>
                    </ControlButton>
                )}

                <ControlButton onClick={handleStepForward} disabled={!hasStarted || currentStep >= traceLength - 1} title='Step Forward'>
                    <SkipForward size={24}/>
                </ControlButton>
            </div>
        </div>
    )
};

export default PlaybackControls;