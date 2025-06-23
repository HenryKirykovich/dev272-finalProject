import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import NewGoalScreen from '../../app/(tabs)/goals/new-goals';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
        },
        from: jest.fn(() => ({
            insert: jest.fn(),
        })),
    },
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.Alert.alert = jest.fn();
    return RN;
});

jest.mock('../../app/_layout', () => ({
    useBackgroundColor: () => ({
        backgroundColor: '#fff',
    }),
}));

describe('NewGoalScreen', () => {
    const mockRouterPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
    const mockGetUser = supabase.auth.getUser as jest.Mock;
    const mockFrom = supabase.from as jest.Mock;
    const mockInsert = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockReturnValue({ insert: mockInsert });
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<NewGoalScreen />);
        expect(getByText('New Goal')).toBeDefined();
        expect(getByPlaceholderText('Type your goal here...')).toBeDefined();
    });

    it('shows an alert if the goal is empty', async () => {
        const { getByText } = render(<NewGoalScreen />);
        const saveButton = getByText('💾 Save Goal');

        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Goal cannot be empty.'
            );
        });
    });

    it('saves a new goal and navigates on success', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
        });
        mockInsert.mockResolvedValue({ error: null });

        const { getByPlaceholderText, getByText } = render(<NewGoalScreen />);
        const input = getByPlaceholderText('Type your goal here...');
        const saveButton = getByText('💾 Save Goal');

        fireEvent.changeText(input, 'My new goal');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalledWith({
                title: 'My new goal',
                user_id: 'user-123',
            });
            expect(mockRouterPush).toHaveBeenCalledWith('/goals');
        });
    });

    it('shows an alert if saving fails', async () => {
        mockGetUser.mockResolvedValue({
            data: { user: { id: 'user-123' } },
            error: null,
        });
        mockInsert.mockResolvedValue({ error: { message: 'Database error' } });

        const { getByPlaceholderText, getByText } = render(<NewGoalScreen />);
        const input = getByPlaceholderText('Type your goal here...');
        const saveButton = getByText('💾 Save Goal');

        fireEvent.changeText(input, 'Another goal');
        fireEvent.press(saveButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Database error');
        });
    });
});
