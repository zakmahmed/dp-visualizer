import React, { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, MarkerType, useReactFlow,  ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import * as d3 from 'd3';




const CacheTable = ({ memoData, currentTraceStep, problem }) => {
    const hasData = memoData && Object.keys(memoData).length > 0;

    const getRowStyle = (key) => {
        if (!currentTraceStep) return {};

        let currentKey = '';
        if (problem === 'fibonacci') currentKey = String(currentTraceStep.n);
        if (problem === 'knapsack' || problem === 'lcs'){
            if(currentTraceStep.state) {
                currentKey = `(${currentTraceStep.state[0]}, ${currentTraceStep.state[1]}})`
            }
        }

        if (key !== currentKey) return {transition: 'background-color 0.3s'};

        switch (currentTraceStep.type) {
            case 'call':
            case 'cache_miss':
                return { border: '2px solid #fbbf24', transition: 'border 0.3s'};
            case 'cache_hit':
                return { backgroundColor: '#48bb78', transition: 'background-color 0.3s'};
            case 'store_result':
                return { backgroundColor: '#4299e1', transition: 'background-color 0.3s'};
            default:
                return { transition: 'background-color 0.3s'};
        }

    };

    return (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg border border-gray-700 text-white text-xs w-48 max-h-64 overflow-y-auto shadow-lg">
            <h4 className='font-bold mb-2 text-center text-cyan-400'> Cache Table</h4>
            <table className='w-full text-left'>
                <thead>
                    <tr className='border-b border-gray-600'>
                        <th className='p-1'>Key</th>
                        <th className='p-1'>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {hasData ? (Object.entries(memoData).map(([key, value]) => (
                        <tr key={key} style={getRowStyle(key)}>
                            <td className='p-1 font-mono'>{key}</td>
                            <td className='p-1 font-mono'>{String(value)}</td>
                        </tr>
                    )))
                        :
                        (<tr>
                            <td colSpan={2}></td>
                        </tr>)
                }
                </tbody>
            </table>
        </div>
    );
};

const TreeVisualizer = ({ trace, currentStep, problem, algorithm }) => {
    const reactFlowInstance = useReactFlow();
    const [persistentMemo, setPersistentMemo] = useState(null);

    const nodesAndEdges = useMemo(() => {
        if (!trace || trace.length === 0 || !trace[currentStep]) {
            return { nodes: [], edges: [] };
        }

        const currentTraceSlice = trace.slice(0, currentStep + 1);
        const currentTraceStep = currentTraceSlice[currentStep];

        const callSteps = trace.filter(step => step.type === 'call');
        if (callSteps.length === 0) return { nodes: [], edges: []};

        const stratifyData = callSteps.map(d => ({
            id: String(d.id),
            parentId: (d.parent === null || d.parent === undefined) ? "" : String(d.parent),
            originalData: d
        }));

        const root = d3.stratify()
            .id(d => d.id)
            .parentId(d => d.parentId)(stratifyData);
        
        d3.tree().nodeSize([220, 160])(root);

        const allNodes = root.descendants();

        const nodes = allNodes.map(d3Node => {
            const nodeData = d3Node.data.originalData;
            const isVisible = nodeData.id <= currentTraceStep.id;
            const returnStep = currentTraceSlice.find(s => s.id === nodeData.id && (s.type === 'return' || s.type === 'base_case'));
            const returnValue = returnStep ? returnStep.result : null;

            let mainLabel = "root";
            if (problem === 'fibonacci') mainLabel = `fib(${nodeData.n})`;
            if (problem === 'knapsack') mainLabel = `k(i: ${nodeData.index}, c: ${nodeData.capacity})`;
            if (problem === 'lcs') mainLabel = `k(i: ${nodeData.i}, j: ${nodeData.j})`;

            let returnExpression = '';
            if (returnValue !== null){
               
                if (problem === 'fibonacci' && returnStep && returnStep.explanation.includes('+')){
                    const parts = returnStep.explanation.match(/(\d+)\s*\+\s*(\d+)/);
                    if(parts) {
                        returnExpression = `${parts[1]} + ${parts[2]} = ${returnValue}`;
                    } else {
                        returnExpression = `Base Case = ${returnValue}`;
                    }
                } else {
                    returnExpression = `Returns: ${returnValue}`;
                }
            }

            return {
                id: String(nodeData.id),
                position: {x: d3Node.x, y: d3Node.y},
                data: {
                    label: (
                        <div style={{ textAlign: 'center', opacity: isVisible ? 1 : 0.4 }}>
                            <div style ={{ fontWeight: 'bold', color: '#f87171', fontSize: '0.85em', marginBottom:'2px', minHeight: '1.2em' }}>
                                {returnExpression}
                            </div>
                            <div>
                                <strong>{mainLabel}</strong>
                            </div>
                        </div>
                    )
                },
                style: {
                    border: nodeData.id === currentTraceStep.id ? '2px solid #48bb78' : '2px solid #2d3748',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    background: '#4a5568',
                    color: 'white'
                },
            };
        });

        const edges = root.links().map(link => {
            const childNodeId = parseInt(link.target.id, 10);
            const childReturnStep = currentTraceSlice.find(s => s.id === childNodeId && (s.type === 'return' || s.type === 'base_case'));
            const childReturnValue = childReturnStep ? childReturnStep.result : null;
            
            return {
                id: `e-${link.source.id}-${link.target.id}`,
                source: String(link.source.id),
                target: String(link.target.id),
                type: 'smoothstep',
                markerEnd: { type: MarkerType.ArrowClosed, color: '#a0aec0'},
                style: { stroke: '#a0aec0', strokeWidth: 1.5},
                label: childReturnValue !== null ? String(childReturnValue) : '',
                labelStyle: { fill: '#f87171', fontWeight: 'bold' },
            };
        });

        return { nodes, edges };

    }, [trace, currentStep, problem]);

    useEffect(() => {
        if (currentStep === 0){
            setPersistentMemo(null);
        }

        const currentTraceStep = trace[currentStep];
        if (algorithm === 'memoization' && currentTraceStep?.memo) {
            setPersistentMemo(currentTraceStep.memo);
        }
    }, [currentStep, trace, algorithm]);


    useEffect(() => {
        if (nodesAndEdges.nodes.length > 0 && trace[currentStep]) {
            const currentNodeId = String(trace[currentStep].id);
            const currentNode = nodesAndEdges.nodes.find(n => n.id === currentNodeId);

            if (currentNode){
                reactFlowInstance.setCenter(
                    currentNode.position.x,
                    currentNode.position.y,
                    { zoom: 0.9, duration: 500 }
                );
            }
        }
    }, [currentStep, nodesAndEdges.nodes, reactFlowInstance, trace]);

    
    return (
        <div className='w-full h-full relative'>
            <ReactFlow
                nodes={nodesAndEdges.nodes}
                edges={nodesAndEdges.edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
            >
                <Background color='4a5568' gap={16} />
                <Controls showInteractive={false} />
            </ReactFlow>
            {algorithm === 'memoization' && <CacheTable memoData={persistentMemo} currentTraceStep={trace[currentStep]} problem={problem} />}
            
        </div>
    );
};

const TableVisualizer = ({trace, currentStep}) => {
    const currentTraceStep = trace[currentStep];
    if (!currentTraceStep || !currentTraceStep.table) {
        return <div className='flex items-center justify-center h-full text-gray-500'>Awaiting table data...</div>
    };

    const tableData = currentTraceStep.table;
    const is2D = Array.isArray(tableData[0]);
    const data = is2D ? tableData : [tableData];

    const getCellColor = (rowIndex, colIndex) => {
        const highlight = currentTraceStep.highlight;
        if(highlight){
            const isHighlighted = is2D ? (highlight.row === rowIndex && highlight.col === colIndex) : (highlight.i === colIndex);
            if (isHighlighted) {
                const isTraceback = currentTraceStep.type?.includes('traceback');
                return isTraceback ? '#4299e1' : '#48bb78';
            };
        };
        return '#4a5568';
    };

    return (
        <div className='flex items-center justify-center w-full h-full p-4'>
            <div className='grid' style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))`}}>
                {data.map((row, i) => 
                row.map((cellValue, j) => (
                    <div
                        key={`${i} - ${j}`}
                        className='flex items-center justify-center border border-gray-700 aspect-square text-white font-mono'
                        style={{backgroundColor: getCellColor(i, j)}}
                    >
                        {cellValue}
                    </div>
                ))
            )}
            </div>
        </div>
    );
};

//Main Visualization component
const Visualization = ({trace, currentStep, problem, algorithm}) => {
    if (!trace || trace.length === 0){
        return <div className='flex items-center justify-center h-full text-gray-500'> Visualization Area </div>
    }


    if (algorithm === 'tabulation'){
        return <TableVisualizer trace={trace} currentStep={currentStep} />
    }
    else{
        return (
            <ReactFlowProvider>
                <TreeVisualizer trace={trace} currentStep={currentStep} problem ={problem} algorithm={algorithm}/>
            </ReactFlowProvider>
        
        );
    }

};

export default Visualization;
