import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Visualization from '../components/visualization';




//Only testing main visualizer in this file the TreeVisualizer and TableVisualizer are tested seperately


vi.mock('reactflow', () => {
    const MockReactFlow = () => <div data-testid='react-flow-mock' />; //only appears when TreeVisualizer is used

    return {
        default: MockReactFlow,
        ReactFlow: MockReactFlow,
        ReactFlowProvider: ({ children }) => <>{children}</>,
        useReactFlow: () => ({ setCenter: vi.fn() }),
        Background: () => null,
        Controls: () => null,
        MarkerType: {},
        Handle: () => null,
        Position: {}
    };
    
});

describe('Main Visualizer', () => {
    const mockTrace = [{ type: 'call', id: 0, parent_id: null, n: 5}];
    const mockTableTrace = [{ type: 'iteration', table: [[0, 1]]}];

    test('renders message when trace is empty', () => {
        render(<Visualization trace={[]} currentStep={0} problem='fibonacci' algorithm='recursive' />);
        expect(screen.getByText('Visualization Area')).toBeInTheDocument();
    });

    test('renders TreeVisualizer for recursive algorithms', () => {
        render(<Visualization trace={mockTrace} currentStep={0} problem='fibonacci' algorithm='recursive' />);
        expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();
    });

    test('renders TreeVisualizer for memoization algorithms', () => {
        render(<Visualization trace={mockTrace} currentStep={0} problem='fibonacci' algorithm='memoization' />);
        expect(screen.getByTestId('react-flow-mock')).toBeInTheDocument();
    });

    test('renders TableVisualizer for tabulation algorithms', () => {
        render(<Visualization trace={mockTableTrace} currentStep={0} problem='fibonacci' algorithm='tabulation' />);

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.queryByTestId('react-flow-mock')).not.toBeInTheDocument();
    });
})