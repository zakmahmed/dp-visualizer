import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Visualization = ({ trace, currentStep, problem, algorithm }) => {
    const d3Container = useRef(null);

    //Use Effect runs whenever the trace or current step changes
    useEffect(() => {
        if (!d3Container.current || trace.length === 0) return;

        const svg = d3.select(d3Container.current);
        svg.selectAll('*').remove(); // Clear previous visualization

        const { width, height } = d3Container.current.getBoundingClientRect()

        algorithm === 'tabulation' ? drawTable(svg, trace, currentStep, width, height) : drawTree(svg, trace, currentStep, width, height);
    }, [trace, currentStep, algorithm, problem]);

    const getNodeLabel = (nodeData) => {
        if (problem === 'fibonacci') return `fib(${nodeData.n})`;
        if (problem === 'knapsack') return `k(i:${nodeData.index}), c:${nodeData.capacity})`;
        if (problem === 'fibonacci') return `lcs(i${nodeData.i}), j:${nodeData.j}`;
        return "root";
    };

    //Hex codes used for d3 compatibility
    const getNodeColor = (node, currentTraceStep) => {
        if (!currentTraceStep || node.id > currentTraceStep.id) return '#4b5563'; // Future Nodes
        if (node.id === currentTraceStep && currentTraceStep.type === 'call') return '#4b5563'; // Current node being computed
        if (node.id === currentTraceStep && currentTraceStep.type === 'cache_hit') return '#4299e1'; // Current node with result found in cache

        // Check if node has returned a value
        const returnStep = trace.find(step => step.id === node.id && (step.type === 'return' || step.type === 'base_case' || step.type === 'cache_hit'));
        if (returnStep) return '#a0aec0'; // Completed node with returned value

        return '#718096'; //Default visited node

    };

    const drawTree = (svg, fullTrace, stepIndex, width, height) =>  {
        const currentTraceSlice = fullTrace.slice(0, stepIndex + 1);
        const currentTraceStep = currentTraceSlice[stepIndex];

        // Create a map of all 'call' events to build the tree structure
        const nodes = {};
        fullTrace.forEach(step => {
            if (step.type === 'call'){
                nodes[step.id] = {...step, children: []};
            }
        });

        // Link children to parents
        Object.values(nodes).forEach(node => {
            if (node.parent_id !== null && nodes[node.parent_id]) {
                // Avoid duplicating children
                if (!nodes[node.parent_id].children.some(child => child.id === node.id)){
                    nodes[node.parent_id].children.push(node);
                }
            }
        });

        const rootNodeData = Object.values(nodes).find(n => n.parent_id === null);
        if(!rootNodeData) return;

        const root = d3.hierarchy(rootNodeData, d => d.children);

        const treeLayout = d3.tree().size([width - 100, height - 100]);
        treeLayout(root);
        
        const g = svg.append.attr('transform', 'translate(50, 50)');

        g.selectAll('path.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', '#4a5568')
            .attr('stroke-width', 2);

        const nodeGroup = g.selectAll(g.node)
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('opacity', d => (nodes[d.data.id] && d.data.id <= currentTraceStep.id ? 1 : 0.3));
        

        nodeGroup.append('circle')
            .attr('r', 25)
            .attr('fill', d => getNodeColor(d.data, currentTraceStep))
            .attr('stroke', '#2d3748')
            .attr('stroke-width', 3);

        
        nodeGroup.append('text')
            .text(d => getNodeLabel(d.data))
            .attr('dy' , '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .style('pointer-events', 'none');
    };

    const drawTable = (svg, fullTrace, stepIndex, width, height) => {
        const currentTraceStep = fullTrace[stepIndex]
        if (!currentStep || !currentTraceStep.table) return;

        const tableData = currentTraceStep.table;
        const is2D = Array.isArray(tableData[0]);
        const data = is2D ? tableData : [tableData];

        const rows = data.length;
        const cols = data[0].length;
        const cellSize = Math.min(50, (width - 40) / cols, (height - 40) / rows);
        const tableWidth = cols * cellSize;
        const tableHeight = rows * cellSize;

        const g = svg.append('g').attr('transform', `translate(${(width - tableWidth) / 2}, ${(height - tableHeight) / 2})`);

        const row = g.selectAll('.row')
            .data(data)
            .enter().append('g')
            .attr('class', 'row')
            .attr('transform', (d, i) => `translate(0, ${i * cellSize})`);
        
        const cell = row.selectAll('.cell')
            .data((d, i) => d.map(value => ({value, rowIndex: i})))
            .enter().append('g')
            .attr('class', 'cell')
            .attr('transform', (d, i) => `translate(${i * cellSize}, 0)`);
        
        cell.append('rect')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('fill', (d, j) => {
                const highlight = currentTraceStep.highlight;
                if(highlight && (is2D ? (highlight.row === d.rowIndex && highlight.col === j) : highlight.col === j)) return '#48bb78';

                const traceback = currentTraceStep.type?.includes('traceback');
                if(traceback && highlight && (is2D ? (highlight.row === d.rowIndex && highlight.col === j) : highlight.col === j)) return '#4299e1';

                return '#4a5568';
            })
            .attr('stroke', '#2d3748');
        

        cell.append('text')
            .attr('x', cellSize / 2)
            .attr('y', cellSize / 2)
            .attr('dy', '35em')
            .attr('text-anchor', 'middle')
            .text(d => d.value)
            .attr('fill', 'white');
    }

    return <svg ref={d3Container} className='w-full h-full'></svg>
};

export default Visualization