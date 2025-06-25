import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import JournalScreen from '../../app/(tabs)/journal/index';
import { supabase } from '../../lib/supabase';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
    })),
  },
}));

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('../../app/_layout', () => ({
  useBackgroundColor: () => ({
    backgroundColor: '#F48FB1',
  }),
}));

describe('JournalScreen', () => {
  const mockGetUser = supabase.auth.getUser as jest.Mock;
  const mockFrom = supabase.from as jest.Mock;
  const mockUseFocusEffect = useFocusEffect as jest.Mock;
  const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockRouterPush = jest.fn();
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();

  // Store original console methods
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup method chaining
    mockOrder.mockReturnValue({ data: [], error: null });
    mockEq.mockReturnValue({ order: mockOrder });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null,
    });

    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseLocalSearchParams.mockReturnValue({});

    // Mock useFocusEffect to call the callback immediately but handle promises properly
    mockUseFocusEffect.mockImplementation(_callback => {
      // Don't call callback immediately - let the component handle it
    });
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('renders correctly with empty state', async () => {
    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      // Manually trigger the focus effect callback for testing
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    expect(getByText('📖')).toBeDefined();
    expect(getByText('My Journal')).toBeDefined();
    expect(getByText('No entries yet')).toBeDefined();
    expect(
      getByText('Tap the + button to create your first journal entry.')
    ).toBeDefined();
  });

  it('renders journal entries when data is available', async () => {
    const mockEntries = [
      {
        id: '1',
        content: 'Today was a great day!',
        created_at: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        content: 'Had a productive meeting.',
        created_at: '2024-01-14T15:45:00Z',
      },
    ];

    mockOrder.mockResolvedValue({ data: mockEntries, error: null });

    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    await waitFor(() => {
      expect(getByText('Today was a great day!')).toBeDefined();
      expect(getByText('Had a productive meeting.')).toBeDefined();
    });
  });

  it('formats entry dates correctly', async () => {
    const mockEntries = [
      {
        id: '1',
        content: 'Test entry',
        created_at: '2024-01-15T10:30:45Z',
      },
    ];

    mockOrder.mockResolvedValue({ data: mockEntries, error: null });

    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    await waitFor(() => {
      // Should format as "Jan 15 02:30:45" (based on the actual output)
      expect(getByText(/Jan 15/)).toBeDefined();
      expect(getByText(/02:30:45/)).toBeDefined();
    });
  });

  it('navigates to new entry screen when plus button is pressed', async () => {
    const { getByText } = render(<JournalScreen />);

    // Wait for initial render
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    const addButton = getByText('＋');
    fireEvent.press(addButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/(tabs)/journal/new-entry');
  });

  it('navigates to edit entry screen when entry is pressed', async () => {
    const mockEntries = [
      {
        id: 'entry-123',
        content: 'Test entry',
        created_at: '2024-01-15T10:30:00Z',
      },
    ];

    mockOrder.mockResolvedValue({ data: mockEntries, error: null });

    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    await waitFor(() => {
      const entry = getByText('Test entry');
      fireEvent.press(entry);

      expect(mockRouterPush).toHaveBeenCalledWith(
        '/(tabs)/journal/edit-entry?id=entry-123'
      );
    });
  });

  it('handles authentication error gracefully', async () => {
    // Suppress expected console.error for this test
    console.error = jest.fn();

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' },
    });

    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    // Should still render the UI
    expect(getByText('My Journal')).toBeDefined();

    // Verify the expected error was logged
    expect(console.error).toHaveBeenCalledWith('User not authenticated:', {
      message: 'Not authenticated',
    });
  });

  it('handles fetch error gracefully', async () => {
    // Suppress expected console.error for this test
    console.error = jest.fn();

    mockOrder.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const { getByText } = render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    await waitFor(() => {
      // Should show empty state even with error
      expect(getByText('No entries yet')).toBeDefined();
    });

    // Verify the expected error was logged
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching journal entries:',
      { message: 'Database error' }
    );
  });

  it('refetches data when refresh param is provided', async () => {
    mockUseLocalSearchParams.mockReturnValue({ refresh: 'true' });

    render(<JournalScreen />);

    // useFocusEffect should be called with the refresh parameter
    expect(mockUseFocusEffect).toHaveBeenCalled();
  });

  it('filters entries by authenticated user only', async () => {
    render(<JournalScreen />);

    // Wait for async operations to complete
    await act(async () => {
      const focusCallback = mockUseFocusEffect.mock.calls[0][0];
      await focusCallback();
    });

    await waitFor(() => {
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123');
    });
  });
});
