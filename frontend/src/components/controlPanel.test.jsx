import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import ControlPanel from './controlPanel.jsx';

//Mock the config data
vi.mock('.../data/config.jsx', () => ({
    ALGO_CONFIG: {
        fibonacci: {
            name: 'Fibonacci',
            params: [{name: 'n', type: 'number', defaultValue: 5}],
            algorithms: ['recursive', 'memoization', 'tabulation']
        },

        knapsack: {
            name: 'Fibonacci',
            params: [{name: 'n', type: 'number', defaultValue: 50}],
            algorithms: ['recursive', 'memoization']
        }
    },
}));

describe('ControlPanel',() => {
    //mock functions for all function props
    const mockProps = {
        problem: 'fibonacci',
        setProblem: vi.fn(),
        algorithm: 'recursive',
        setAlgorithm: vi.fn(),
        params: {n: 5},
        onVisualize: vi.fn(),
        vizState: 'idle',
        setTrace: vi.fn(),
        setCurrentStep: vi.fn(),
        setVizState: vi.fn(),
    };

    //reset mocks before each test
    beforeEach(() => {
        vi.clearAllMocks();
    });
    
    test('renders with initial props', () => {
        render(<ControlPanel {...mockProps} />)

        //Check if the dropdowns have correct initial values
        expect(screen.getByLabelText('Problem')).toHaveValue('fibonacci');
        expect(screen.getByLabelText('Algorithm')).toHaveValue('recursive');

        //Check if the parameter input has the correct value
        expect(screen.getByLabelText('n')).toHaveValue(5);

        // Check if the buttons are enabled
        expect(screen.getByText('Visualize')).toBeEnabled();
        expect(screen.getByText('Reset')).toBeEnabled();
    });

    test('calls setProblem and resets state when problem is changed', () => {
        render(<ControlPanel {...mockProps} />)

        const problemSelect = screen.getByLabelText('Problem');
        fireEvent.change(problemSelect, {target : {value: 'knapsack'}});


        //Check if the state was updated
        expect(mockProps.setProblem).toHaveBeenCalledWith('knapsack');
        expect(mockProps.setAlgorithm).toHaveBeenCalledWith('recursive');
        expect(mockProps.setParams).toHaveBeenCalledWith({capacity: 50});
        expect(mockProps.setVizState).toHaveBeenCalledWith('idle');
    });

    test('calls onVisualize when the Visualize button is clicked', () => {
        render(<ControlPanel {...mockProps} />)

        const visualizeBtn = screen.getByText('Visualize');
        fireEvent.click(visualizeBtn);

        expect(mockProps.onVisualize).toHaveBeenCalledTimes(1);
    });


    test('calls handleReset when the Reset button is clicked', () => {
        render(<ControlPanel {...mockProps} vizState='complete'/>)

        const resetBtn = screen.getByText('Reset');
        expect(resetBtn).toBeEnabled();
        fireEvent.click(resetBtn);


        //Check if the state was updated
        expect(mockProps.setTrace).toHaveBeenCalledWith([]);
        expect(mockProps.setCurrentStep).toHaveBeenCalledWith(0);
        expect(mockProps.setVizState).toHaveBeenCalledWith('idle');
    });

    test('disables inputs and Visualize button when visualization is running', () => {
        render(<ControlPanel {...mockProps} vizState='running'/>)

        //Check if the state was updated
        expect(screen.getByLabelText('Problem')).toBeDisabled();
        expect(screen.getByLabelText('Algorithm')).toBeDisabled();
        expect(screen.getByLabelText('n')).toBeDisabled();
        expect(screen.getByText('Visualize')).toBeDisabled();
        
    });

});