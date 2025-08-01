import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import App from '../App.jsx';

const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
};

vi.mock('socket.io-client', () => ({
    io: vi.fn((url) => {
        console.log('io() was called with:', url);
        return mockSocket;
    }),
}));

vi.mock('../components/Visualization.jsx', () => ({
    default: ({ trace, currentStep }) => {
        console.log('MOCK currentStep:', currentStep);
        console.log('MOCK trace:', trace);

        return (
            <div data-testid='visualization-mock'>
                Trace Length: {trace.length}
                <div data-testid='current-step-explanation'>
                    {trace[currentStep]?.explanation}
                </div>
            </div>
        )   
    }   
}));


describe('App Integration Test', () => {
    const eventHandlers = {};

    beforeEach(() => {
        //Control Animation Loop in actual code
        vi.useFakeTimers();

        vi.clearAllMocks();

        mockSocket.on.mockImplementation((event, callback) => {
            console.log('Registered socket event:', event);
            eventHandlers[event] = callback;
        });
    });

    afterEach(() => {
        //Restore the timers after the test
        vi.useRealTimers();
    });

    test('renders initial state and connects to socket', () => {
        render(<App />);
        

        expect(screen.getByText('Dynamic Programming Visualizer')).toBeInTheDocument();
        expect(screen.getByLabelText('Problem')).toHaveValue('fibonacci');
        expect(screen.getByLabelText('Algorithm')).toHaveValue('recursive');
        
        act(() => {
            if (eventHandlers.connect){
                eventHandlers.connect();
            }
        });

        expect(screen.getByText(/Status: Connected/)).toBeInTheDocument();    
    });


    test('emits correct event when visualize button is clicked', () => {
        render(<App />);

        act(() => {
            if (eventHandlers.connect){
                eventHandlers.connect();
            }
        }); 
        
        expect(screen.findByText(/Status: Connected/)).toBeInTheDocument;  

        const algorithmSelect = screen.getByLabelText('Algorithm');
        fireEvent.change(algorithmSelect, { target: { value: 'memoization' }});
        expect(algorithmSelect).toHaveValue('memoization');

        const visualizeButton = screen.getByText('Visualize')
        fireEvent.click(visualizeButton);

         


        //Backend Communication
        expect(mockSocket.emit).toHaveBeenCalledWith('execute_algorithm', { problem: 'fibonacci', algorithm: 'memoization', params: { n: 5 }});


    });

    test('receives trace data and updates UI correctly', () => {
        render(<App />);

        const mockTrace = [
            { id: 0, type: 'call', n: 5, parent: null, explanation: 'Calling fib(5)' },
            { id: 1, type: 'call', n: 4, parent: 0,  explanation: 'Calling fib(4)' },
        ];

        act(() => {
            if (eventHandlers.full_trace){
                eventHandlers.full_trace({ trace: mockTrace });
            }
            
        });
        const fiveCount = screen.getAllByText('Calling fib(5)');

        expect(screen.getByTestId('visualization-mock')).toHaveTextContent('Trace Length: 2');
        expect(fiveCount.length).toBeGreaterThan(0);


    });


    test('animation progresses after receiving trace', () => {
        render(<App />);

        const mockTrace = [
            { id: 0, type: 'call', n: 5, parent: null, explanation: 'Calling fib(5)' },
            { id: 1, type: 'call', n: 4, parent: 0,  explanation: 'Calling fib(4)' },
        ];

        const visualizeBtn = screen.getByText('Visualize');
        expect(visualizeBtn).not.toBeDisabled();
        

        fireEvent.click(visualizeBtn);

        act(() => {
            if (eventHandlers.full_trace){
                eventHandlers.full_trace({ trace: mockTrace });
            }
            
        });

        

        const slider = screen.getByRole('slider');

        expect(screen.getByTestId('current-step-explanation')).toHaveTextContent('Calling fib(5)');
        expect(slider.value).toBe('0');

        

        act(() => {
            vi.advanceTimersByTime(1000);
        });
        
        screen.debug()

        expect(screen.getByTestId('current-step-explanation')).toHaveTextContent('Calling fib(4)');
        expect(slider.value).toBe('1');

    });




});
