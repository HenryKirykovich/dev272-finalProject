import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import LoginForm from '../../components/(auth)/LoginForm';
import { supabase } from '../../lib/supabase';

// Mocking dependencies
jest.mock('../../lib/supabase', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } },
            })),
        },
    },
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../app/_layout', () => ({
    useBackgroundColor: () => ({
        backgroundColor: '#fff',
    }),
}));

describe('LoginForm', () => {
    const mockRouterReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
    const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the login form correctly', () => {
        const { getByPlaceholderText, getByText } = render(<LoginForm />);
        expect(getByPlaceholderText('Email')).toBeDefined();
        expect(getByPlaceholderText('Password')).toBeDefined();
        expect(getByText('Login')).toBeDefined();
    });

    it('shows validation errors for invalid input', async () => {
        const { getByText, getByPlaceholderText } = render(<LoginForm />);
        const loginButton = getByText('Login');

        fireEvent.changeText(getByPlaceholderText('Email'), 'invalid-email');
        fireEvent.changeText(getByPlaceholderText('Password'), '123');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(getByText('Please enter a valid email address')).toBeDefined();
            expect(getByText('Password must be at least 6 characters')).toBeDefined();
        });
    });

    it('calls supabase signIn on valid submission and navigates', async () => {
        mockSignIn.mockResolvedValue({ error: null });
        const { getByPlaceholderText, getByText } = render(<LoginForm />);
        const loginButton = getByText('Login');

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(mockRouterReplace).toHaveBeenCalledWith('/(tabs)/home');
        });
    });

    it('shows an error message if signIn fails', async () => {
        mockSignIn.mockResolvedValue({
            error: { message: 'Invalid login credentials' },
        });
        const { getByPlaceholderText, getByText } = render(<LoginForm />);
        const loginButton = getByText('Login');

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(getByText('Invalid login credentials')).toBeDefined();
        });
    });
});
