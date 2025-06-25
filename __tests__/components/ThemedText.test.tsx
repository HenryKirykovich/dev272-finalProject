import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemedText } from '../../components/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

jest.mock('../../hooks/useThemeColor');

describe('ThemedText', () => {
  const mockUseThemeColor = useThemeColor as jest.Mock;

  beforeEach(() => {
    mockUseThemeColor.mockReturnValue('black');
  });

  it('renders default text correctly', () => {
    const { getByText } = render(<ThemedText>Default Text</ThemedText>);
    const textElement = getByText('Default Text');
    expect(textElement).toBeDefined();
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({ color: 'black' })
    );
  });

  it('renders title text correctly', () => {
    const { getByText } = render(
      <ThemedText type='title'>Title Text</ThemedText>
    );
    const textElement = getByText('Title Text');
    expect(textElement).toBeDefined();
    expect(textElement.props.style).toContainEqual(
      expect.objectContaining({ fontWeight: 'bold' })
    );
  });
});
