import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import RegisterForm from '../../components/(auth)/RegisterForm';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
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

describe('RegisterForm', () => {
  const mockRouterReplace = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({ replace: mockRouterReplace });
  const mockSignUp = supabase.auth.signUp as jest.Mock;
  const mockFrom = supabase.from as jest.Mock;
  const mockInsert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  it('renders the register form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterForm />);
    expect(getByPlaceholderText('Full Name')).toBeDefined();
    expect(getByPlaceholderText('Email')).toBeDefined();
    expect(getByPlaceholderText('Password (min. 6 characters)')).toBeDefined();
    expect(getByText('Register')).toBeDefined();
  });

  it('shows validation errors for invalid input', async () => {
    const { getByText } = render(<RegisterForm />);
    const registerButton = getByText('Register');

    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('Please enter your full name')).toBeDefined();
      expect(getByText('Please enter a valid email address')).toBeDefined();
      expect(getByText('Password must be at least 6 characters')).toBeDefined();
    });
  });

  it('calls supabase signUp on valid submission and navigates', async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: '123', email: 'test@example.com' },
      },
      error: null,
    });
    mockInsert.mockResolvedValue({ error: null });

    const { getByPlaceholderText, getByText } = render(<RegisterForm />);
    const registerButton = getByText('Register');

    fireEvent.changeText(getByPlaceholderText('Full Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(
      getByPlaceholderText('Password (min. 6 characters)'),
      'password123'
    );
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(mockInsert).toHaveBeenCalledWith({
        id: '123',
        full_name: 'Test User',
        email: 'test@example.com',
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        'Registration Successful',
        'Please check your email to confirm your account.'
      );
      expect(mockRouterReplace).toHaveBeenCalledWith('/(auth)/login');
    });
  });

  it('shows an error message if signUp fails', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
    });
    const { getByPlaceholderText, getByText } = render(<RegisterForm />);
    const registerButton = getByText('Register');

    fireEvent.changeText(getByPlaceholderText('Full Name'), 'Test User');
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(
      getByPlaceholderText('Password (min. 6 characters)'),
      'password123'
    );
    fireEvent.press(registerButton);

    await waitFor(() => {
      expect(getByText('User already registered')).toBeDefined();
    });
  });
});
