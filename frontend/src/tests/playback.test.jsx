import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import PlaybackControls from '../components/playback';

//Mock the lucide-react icons
vi.mock('lucide-react', () => ({
    Play: () => <div data-testid='play-icon' />,
    Pause: () => <div data-testid='pause-icon' />,
    SkipBack: () => <div data-testid='skip-back-icon' />,
    SkipForward: () => <div data-testid='skip-forward-icon' />,
    Rewind: () => <div data-testid='rewind-icon' />
}));

describe('PlaybackControls', () => {
    const mockProps = {
        vizState: 'idle',
        setVizState: vi.fn(),
        currentStep: 0,
        setCurrentStep: vi.fn(),
        traceLength: 0
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders with all controls disabled when trace is empty', () => {
        render(<PlaybackControls {...mockProps} />);

        expect(screen.getByTitle('Reset')).toBeDisabled();
        expect(screen.getByTitle('Step Back')).toBeDisabled();
        expect(screen.getByTitle('Play')).toBeDisabled();
        expect(screen.getByTitle('Step Forward')).toBeDisabled();
        expect(screen.getByRole('slider')).toBeDisabled();

        expect(screen.getByText(/Step:/)).toBeInTheDocument();
        

    });

    test('enables controls when a visualization has started', () => {
        render(<PlaybackControls {...mockProps} vizState='paused' traceLength={10} />);

        expect(screen.getByTitle('Reset')).toBeEnabled();
        expect(screen.getByTitle('Play')).toBeEnabled();
        expect(screen.getByTitle('Step Forward')).toBeEnabled();

        expect(screen.getByTitle('Step Back')).toBeDisabled();
        

    });

     test('shows Pause button when vizState is running', () => {
        render(<PlaybackControls {...mockProps} vizState='running' traceLength={10} />);

        expect(screen.queryByTestId('play-icon')).not.toBeInTheDocument();

        expect(screen.getByTestId('pause-icon')).toBeInTheDocument();
    });

    test('Clicking Play button calls setVizState with running', () => {
        render(<PlaybackControls {...mockProps} vizState='paused' traceLength={10} />);
        fireEvent.click(screen.getByTitle('Play'));

        expect(mockProps.setVizState).toHaveBeenCalledWith('running');
    });


    test('Clicking Pause button calls setVizState with paused', () => {
        render(<PlaybackControls {...mockProps} vizState='running' traceLength={10} />);
        fireEvent.click(screen.getByTitle('Pause'));

        expect(mockProps.setVizState).toHaveBeenCalledWith('paused');
    });

    test('Clicking Step Forward button calls setCurrentStep and pauses', () => {
        render(<PlaybackControls {...mockProps} vizState='running' currentStep={5} traceLength={10} />);
        fireEvent.click(screen.getByTitle('Step Forward'));

        expect(mockProps.setCurrentStep).toHaveBeenCalled();
        expect(mockProps.setVizState).toHaveBeenCalledWith('paused');
    });

    test('Clicking Step Back button calls setCurrentStep and pauses', () => {
        render(<PlaybackControls {...mockProps} vizState='running' currentStep={5} traceLength={10} />);
        fireEvent.click(screen.getByTitle('Step Back'));

        expect(mockProps.setCurrentStep).toHaveBeenCalled();
        expect(mockProps.setVizState).toHaveBeenCalledWith('paused');
    });

    test('Clicking Reset button calls setCurrentStep and pauses', () => {
        render(<PlaybackControls {...mockProps} vizState='running' currentStep={6} traceLength={10} />);
        fireEvent.click(screen.getByTitle('Reset'));

        expect(mockProps.setCurrentStep).toHaveBeenCalled(0);
        expect(mockProps.setVizState).toHaveBeenCalledWith('paused');
    });

    test('Changing the slider calls setCurrentStep', () => {
        render(<PlaybackControls {...mockProps} vizState='running' traceLength={10} />);
        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '5' }});

        expect(mockProps.setCurrentStep).toHaveBeenCalled(15);
    });


})