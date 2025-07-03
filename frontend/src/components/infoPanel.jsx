import React, { useMemo } from 'react';
import { ALGO_CONFIG } from '../data/config.jsx';
import { Terminal, LightBulb, BarChart2 } from 'lucide-react';

const InfoPanel = ({ trace, currentStep, problem, algorithm }) => {
    const currentTraceStep = trace[currentStep];

    //Memorize metric calculations to avoid re-computing on ever render
    const metrics = useMemo(() => {
        if (!trace || trace.length === 0){
            return { calls: 0, cacheHits: 0, iterations: 0};
        }
        const relevantTrace = trace.slice(0, currentStep + 1);
        return {
            calls: relevantTrace.filter(step => step.type === 'call').length,
            cacheHits: relevantTrace.filter(step => step.type === 'cache_hit').length,
            iterations: relevantTrace.filter(step => step.type === 'iteration').length
        };
    }, [trace, currentStep]);

    const CodeComponent = ALGO_CONFIG[problem].code[algorithm];

    const renderMetrics = () => {
        if (algorithm === 'recursive') {
            return <p>Function Calls: <span className='font-mono text-cyan-400'>{metrics.calls}</span></p>;
        }

        if (algorithm === 'memoization') {
            return (
                <>
                    <p>Function Calls: <span className='font-mono text-cyan-400'>{metrics.calls}</span></p>;
                    <p>Cache Hits: <span className='font-mono text-green-400'>{metrics.cacheHits}</span></p>;
                </>
            );
        }

        if (algorithm === 'recursive') {
            return <p>Function Calls: <span className='font-mono text-cyan-400'>{metrics.iterations}</span></p>;
        }
        return null;
    };

    return (
        <div className='w-1/2 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-4'>
            <div className='flex-1 h-1/2 overflow-hidden'>
                <Terminal size={18} />
                <h3 className='text-lg font-semibold'>Code</h3>
            </div>

            <div className='h-[calc(100%-2rem)]'>
                {CodeComponent ? <CodeComponent/> : <p>No Code To Display.</p>}
            </div>

            <div className='flex-1 flex flex-col gap-4'>
                <div className='bg-gray-900 p-3 rounded-md h-1/2'>
                    <div className='flex items-center gap-2 mb-2 text-gray-400'>
                        <LightBulb size={18}/>
                        <h3 className='text-lg font-semibold'>Explanations</h3>
                    </div>
                    <p className='text-sm text-cyan-300 h-full overflow-y-auto'>{currentTraceStep?.explanation || 'Awaiting Visualization...'}</p>
                </div>
            
                <div className='bg-gray-900 p-3 rounded-md h-1/2'>
                    <div className='flex items-center gap-2 mb-2 text-gray-400'>
                        <BarChart2 size={18}/>
                        <h3 className='text-md font-semibold'>Metrics</h3>
                    </div>
                    <p className='text-sm text-gray-300'>{renderMetrics()}</p>
                </div>
            </div>
        </div>
    ); 
};

export default InfoPanel;