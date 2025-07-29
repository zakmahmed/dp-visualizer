import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { TableVisualizer } from '../components/visualization.jsx';



describe('TableVisualizer', () => {
    const mock1DTrace = [
        { type: 'init_table', id: 0, table: [0, 0, 0], explanation: 'Intialized table' },
        { type: 'iteration', id: 1, table: [0, 1, 0], highlight: {i: 1},  explanation: 'Setting base case' },
        { type: 'iteration', id: 2, table: [0, 1, 0], highlight: {i: 1}, explanation: 'Calculating next value' },
    ];

    const mock2DTrace = [
        { type: 'init_table', id: 0, table: [[0, 0], [0, 0]], explanation: 'Intialized table' },
        { type: 'iteration', id: 1, table: [[0, 0], [0, 1]], highlight: {row: 1, col: 1},  explanation: 'Cell (1,1) calculation' },
    ];

    test('renders a 1D table with correct values and highlights', () => {
        render(<TableVisualizer trace={mock1DTrace} currentStep={2} />);

        expect(screen.getByText('1')).toBeInTheDocument();

        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(2);

        expect(screen.getByText('Calculating next value')).toBeInTheDocument();
    });


    test('renders a 2D table with correct values and highlights', () => {
        render(<TableVisualizer trace={mock2DTrace} currentStep={1} />);

        expect(screen.getByText('1')).toBeInTheDocument();

        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(3);

        expect(screen.getByText('Cell (1,1) calculation')).toBeInTheDocument();
    });

    test('renders a fallback message if table data is missing', () => {
        const emptyTrace = [{ type: 'call', id: 0 }]
        render(<TableVisualizer trace={emptyTrace} currentStep={0} />);

        expect(screen.getByText('Awaiting table data...')).toBeInTheDocument();
    });


    test('Only current explanation shows', () => {
        render(<TableVisualizer trace={mock1DTrace} currentStep={1} />);

        expect(screen.queryByText('Calculating next value')).not.toBeInTheDocument();
        expect(screen.getByText('Setting base case')).toBeInTheDocument();
    });



})