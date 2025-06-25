import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemedView } from '../../components/ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';

jest.mock('../../hooks/useThemeColor');

describe('ThemedView', () => {
  const mockUseThemeColor = useThemeColor as jest.Mock;

  beforeEach(() => {
    mockUseThemeColor.mockReturnValue('#ffffff');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default background color', () => {
    const { getByTestId } = render(
      <ThemedView testID='themed-view'>Test Content</ThemedView>
    );

    const view = getByTestId('themed-view');
    expect(view).toBeDefined();
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#ffffff' })
    );
  });

  it('renders with custom light and dark colors', () => {
    render(
      <ThemedView testID='themed-view' lightColor='#f0f0f0' darkColor='#333333'>
        Test Content
      </ThemedView>
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith(
      { light: '#f0f0f0', dark: '#333333' },
      'background'
    );
  });

  it('merges custom styles with theme background', () => {
    const customStyle = { padding: 10, margin: 5 };
    const { getByTestId } = render(
      <ThemedView testID='themed-view' style={customStyle}>
        Test Content
      </ThemedView>
    );

    const view = getByTestId('themed-view');
    expect(view.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#ffffff' })
    );
    expect(view.props.style).toContainEqual(
      expect.objectContaining(customStyle)
    );
  });

  it('passes other props correctly', () => {
    const { getByTestId } = render(
      <ThemedView
        testID='themed-view'
        accessible={true}
        accessibilityLabel='Test view'
      >
        Test Content
      </ThemedView>
    );

    const view = getByTestId('themed-view');
    expect(view.props.accessible).toBe(true);
    expect(view.props.accessibilityLabel).toBe('Test view');
  });
});
