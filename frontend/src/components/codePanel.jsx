import React from 'react';
import { ALGO_CONFIG } from '../data/config';
import { Code, Terminal } from 'lucide-react';

const CodePanel = ({problem, algorithm}) => {
    const config = ALGO_CONFIG[problem];
    const CodeComponent = config ? config.code[algorithm] : null;

    return (
        <div className='bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col'>
            <div className='flex items-center gap-2 mb-2 text-gray-400'>
                <Terminal size={18}/>
                <h3 className='text-lg font-semibold'>Code</h3>
            </div>
            <div className='flex-grow overscroll-y-auto'>
                {CodeComponent ? <CodeComponent/> : <p>No code to display.</p>}
            </div>
        </div>
    );
};

export default CodePanel;