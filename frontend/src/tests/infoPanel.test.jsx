import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import InfoPanel from '../components/infoPanel';
import { BarChart2, Lightbulb } from 'lucide-react';

//Mock the lucide-react icons to prevent rendering errors
vi.mock('lucide-react', () => ({
    Lightbulb: () => <div data-testid='lightbulb-icon'/>,
    BarChart2: () => <div data-testid='barchart-icon'/>,
}));

describe('InfoPanel', () => {
    const mockTrace = [
        {type: 'call', explanation: 'Step 0: Initial call'},
        {type: 'call', explanation: 'Step 1: Recursive call'},
        {type: 'cache-hit', explanation: 'Step 2: Cache hit'},
        {type: 'iteration', explanation: 'Step 1: Iteration'},
    ];

    test('displays "Awaiting visualization..." when trace is empty', () => {
        render(<InfoPanel trace={[]} currentStep={0} algorithm='recursive' />);
        expect(screen.getByText('Awaiting Visualization...')).toBeInTheDocument();
    });

    test('displays the correct explanation for the current step', () => {
        render(<InfoPanel trace={mockTrace} currentStep={1} algorithm='recursive' />);
        expect(screen.getByText('Step 1: Recursive call')).toBeInTheDocument();
    });

    test('displays the correct metrics for "recursive" algorithm', () => {
        render(<InfoPanel trace={mockTrace} currentStep={3} algorithm='recursive' />);
        expect(screen.getByText(/Function Calls:/)).toHaveTextContent('Function Calls: 2');

        expect(screen.queryByText(/Cache Hits:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Iterations:/)).not.toBeInTheDocument();
    });

    test('displays the correct metrics for "memoization" algorithm', () => {
        render(<InfoPanel trace={mockTrace} currentStep={3} algorithm='memoization' />);
        expect(screen.getByText(/Function Calls:/)).toHaveTextContent('Function Calls: 2');
        expect(screen.getByText(/Cache Hits:/)).toHaveTextContent('Cache Hits: 1');

        expect(screen.queryByText(/Iterations:/)).not.toBeInTheDocument();
    });

    test('displays the correct metrics for "tabulation" algorithm', () => {
        render(<InfoPanel trace={mockTrace} currentStep={3} algorithm='tabulation' />);
        expect(screen.getByText(/Iterations:/)).toHaveTextContent('Iterations: 1');

        expect(screen.queryByText(/Cache Hits:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Function Calls:/)).not.toBeInTheDocument();
    });

    test('handles out-of-bounds correctly', () => {
        render(<InfoPanel trace={mockTrace} currentStep={999} algorithm='recursive' />);
        expect(screen.getByText('Awaiting Visualization...')).toBeInTheDocument();
    });
});