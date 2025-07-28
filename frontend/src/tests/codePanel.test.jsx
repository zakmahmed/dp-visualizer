import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import CodePanel from '../components/codePanel';

vi.mock('../components/CodeSnippets.jsx', () => ({
    FibRecursiveCode: () => <div data-testid='fib-recursive-code' />,
    KnapsackTabCode: () => <div data-testid='knapsack-tab-code' />,

}));

vi.mock('../data/config.jsx', () => ({
    ALGO_CONFIG: {
        fibonacci: {
            code: {
                recursive: vi.fn().mockImplementation(() => <div data-testid='fib-recursive-code' />)
            }
            
        },

        knapsack: {
            code: {
                tabulation: vi.fn().mockImplementation(() => <div data-testid='knapsack-tab-code' />)
            }
            
        }
    }
}));

vi.mock('lucide-react', () => ({
    Terminal: () => <div data-testid='terminal-icon' />
}));

describe('CodePanel', () => {
    test('renders with the correct code snippet for given problem and algorithm', () => {
        const { rerender } = render(<CodePanel problem='fibonacci' algorithm='recursive' />);

        expect(screen.getByTestId('fib-recursive-code')).toBeInTheDocument();
        expect(screen.queryByTestId('knapsack-tab-code')).not.toBeInTheDocument();

        rerender(<CodePanel problem='knapsack' algorithm='tabulation' />);

        expect(screen.getByTestId('knapsack-tab-code')).toBeInTheDocument();
        expect(screen.queryByTestId('fib-recursive-code')).not.toBeInTheDocument();
    });

    test('renders a fallback message if the code component is not found', () => {
        render(<CodePanel problem='fibonacci' algorithm='tabulation' />); 

        expect(screen.getByText('No code to display.')).toBeInTheDocument();
    });
});