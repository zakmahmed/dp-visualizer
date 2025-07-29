import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { TreeVisualizer } from '../components/visualization.jsx';
import { ReactFlowProvider } from 'reactflow';



const mockReactFlow = vi.fn();

vi.mock('reactflow', () => ({

    default: (props) => {
        mockReactFlow(props)
        return <div data-testid='react-flow-mock' />; 
    },

    ReactFlow: (props) => {
        mockReactFlow(props)
        return <div data-testid='react-flow-mock' />; 
    },

    ReactFlowProvider: ({ children }) => <>{children}</>,
    useReactFlow: () => ({ setCenter: vi.fn() }),
    Background: () => null,
    Controls: () => null,
    MarkerType: {},
    Handle: () => null,
    Position: {}

}));
    

    


describe('TreeVisualizer', () => {
    const mockTrace = [
        { type: 'call', id: 0, parent: null, n: 2, explanation: 'Calling fib(2)' },
        { type: 'call', id: 1, parent: 0, n: 1, explanation: 'Calling fib(1)' },
        { type: 'base_case', id: 2, parent: 0, result: 1, explanation: 'Base case for fib(1)' },
        { type: 'call', id: 3, parent: 0, n: 1, explanation: 'Calling fib(0)' }
    ];

    test('calculates and passes the correct number of nodes and edges', () => {
        render(
            <ReactFlowProvider>
                <TreeVisualizer trace={mockTrace} currentStep={3} problem='fibonacci' algorithm='recursive'></TreeVisualizer>
            </ReactFlowProvider>
        );

        expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();

        const props = mockReactFlow.mock.calls[0][0];

        expect(props.nodes).toHaveLength(3);
        expect(props.edges).toHaveLength(2);
    });

    test('passes correct data to the currently active node for the tooltip', () => {
        render(
            <ReactFlowProvider>
                <TreeVisualizer trace={mockTrace} currentStep={3} problem='fibonacci' algorithm='recursive'></TreeVisualizer>
            </ReactFlowProvider>
        );

        expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();

        const props = mockReactFlow.mock.calls[0][0];
        const currentNode = props.nodes.find(n => n.id === '3');

        expect(currentNode.data.isCurrent).toBe(true);
        expect(currentNode.data.explanation).toBe('Calling fib(0)');
    });


});