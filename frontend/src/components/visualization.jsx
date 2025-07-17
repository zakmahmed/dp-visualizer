import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

//Helper function to build tree
const buildTree = (callSteps) => {
    if (!callSteps || callSteps.length === 0) return null;

    const nodesMap = new Map();
    let root  = null;

    // 1st pass: create a map of all nodes
    callSteps.forEach(step => {
        nodesMap.set(String(step.id), {...step, children: []});
    });

    //2nd pass: link children to parents
    nodesMap.forEach(node => {
        const parentId = node.parent_id;
        if (parentId === null || parentId === undefined) {
            root = node;
        } else {
            const parentNode = nodesMap.get(String(parentId));
            if (parentNode){
                parentNode.children.push(node);
            }
        }
    });

    return root;
};

//Helper function to assign coordinates to each node for react flow to draw

const layoutTree = (node, nodeX = 0, depth = 0) => {
    if (!node) return;

    //Assign position
    node.x = nodeX
    node.y = depth * 100;
    if (node.children && node.children.length > 0) {
        const childrenWidth = (node.children.length - 1) * 150;
        let childstartX = node.x - childrenWidth / 2;

        node.children.forEach(child => {
            layoutTree(child, childstartX, depth + 1);
            childstartX += 150;
        });
    }

};

//Flatten the tree for rendering
const flattenTree = (node) => {
    if (!node) return [];

    let nodes = [node];
    if (node.children){
        node.children.forEach(child => {
            nodes = nodes.concat(flattenTree(child));
        });
    }
    return nodes;
};

const TreeVisualizer = ({ trace, currentStep, problem }) => {
    const nodeAndEdges = useMemo(() => {

        if (!trace || trace.length === 0 || !trace[currentStep]){
            console.log('Here!')
            return {nodes: [], edges: []};
        }

        console.log(`--- Recalculating Tree (Step ${currentStep})`)
        const currentTraceSlice = trace.slice(0, currentStep + 1);
        const currentTraceStep = currentTraceSlice[currentStep];
        
        const callSteps = trace.filter(step => step.type === 'call');
        if (callSteps.length === 0) {
            console.log("No 'call' steps found in trace." )
            return { nodes: [], edges: []}
        };

        const rootNode = buildTree(callSteps);
        console.log('Result of buildTree:', rootNode)
        layoutTree(rootNode);
        const allNodes = flattenTree(rootNode);
        console.log('Result of flattenTree:', allNodes)

        const nodes = allNodes.map(nodeData => {
            const isVisible = nodeData.id <= currentTraceStep.id;

            let label = 'root';
            if (problem === 'fibonacci') label = `fib(${nodeData.n})`;
            if (problem === 'knapsack') label = `k(i: ${nodeData.index}, c: ${nodeData.capacity})`;
            if (problem === 'lcs') label = `lcs(i: ${nodeData.i}), j: ${nodeData.j}`;

            let backgroundColor = '#4a5568';
            if (isVisible) {
                const returnStep = trace.find(step => step.id === nodeData.id && (step.type === 'return' || step.type === 'base_case' || step.type === 'cache_hit'));
                backgroundColor = returnStep ? '#a0aec0' : '#718096';
                if (nodeData.id === currentTraceStep.id){
                    backgroundColor = currentTraceStep.type === 'cache_hit' ? '#4299e1' : '#48bb78';
                }
            } 

            return {
                id: String(nodeData.id),
                position: {x: nodeData.x, y: nodeData.y},
                data: {label},
                style: {
                    background: backgroundColor,
                    color: 'white',
                    border: '2px solid #2d3748',
                    opacity: isVisible ? 1 : 0.3,
                    padding: '10px',
                    borderRadius: '50%',
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                }
            };
        });

        const edges = allNodes
            .filter(node => node.parent_id !== null & node.parent_id !== undefined)
            .map(node => ({
                id: `e${node.parent_id} - ${node.id}`,
                source: String(node.parent_id),
                target: String(node.id),
                type: 'smoothstep',
                animated: node.id === currentTraceStep.id,
                style: {stroke: '#4a5568', strokeWidth: 2  }
            }));

        console.log('Final nodes for React Flow:', nodes);
        console.log('Final edges for React Flow:', edges);

        return {nodes, edges};
        }, [trace, currentStep, problem])

    return (
        <ReactFlow
            nodes={nodeAndEdges.nodes}
            edges={nodeAndEdges.edges}
            fitView
        >
            <Background color='#4a5568' gap={16}/>
            <Controls showInteractive={false}/>
        </ReactFlow>
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
            )};
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
        console.log('Tabulation');
        return <TableVisualizer trace={trace} currentStep={currentStep} />;
    }
    else{
        console.log('Tree')
        return <TreeVisualizer trace={trace} currentStep={currentStep} problem ={problem} />
    }

};

export default Visualization;
