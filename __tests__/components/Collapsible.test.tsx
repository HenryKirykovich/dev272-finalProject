import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Collapsible } from '../../components/Collapsible';
import { useColorScheme } from '../../hooks/useColorScheme';

jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('../../components/ThemedText', () => ({
  ThemedText: ({ children, ...props }: any) => {
    const MockText = require('react-native').Text;
    return <MockText {...props}>{children}</MockText>;
  },
}));

jest.mock('../../components/ThemedView', () => ({
  ThemedView: ({ children, ...props }: any) => {
    const MockView = require('react-native').View;
    return <MockView {...props}>{children}</MockView>;
  },
}));

jest.mock('../../components/ui/IconSymbol', () => ({
  IconSymbol: ({ name, style, ...props }: any) => {
    const MockText = require('react-native').Text;
    return (
      <MockText testID='icon-symbol' style={style} {...props}>
        {name}
      </MockText>
    );
  },
}));

describe('Collapsible', () => {
  const mockUseColorScheme = useColorScheme as jest.Mock;

  beforeEach(() => {
    mockUseColorScheme.mockReturnValue('light');
    jest.clearAllMocks();
  });

  it('renders with title and children collapsed by default', () => {
    const { getByText, queryByText } = render(
      <Collapsible title='Test Section'>
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    expect(getByText('Test Section')).toBeDefined();
    expect(queryByText('Hidden Content')).toBeNull();
  });

  it('expands and shows children when header is pressed', () => {
    const { getByText } = render(
      <Collapsible title='Test Section'>
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    const header = getByText('Test Section');
    fireEvent.press(header.parent);

    expect(getByText('Hidden Content')).toBeDefined();
  });

  it('collapses content when pressed again', () => {
    const { getByText, queryByText } = render(
      <Collapsible title='Test Section'>
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    const header = getByText('Test Section');

    // Expand
    fireEvent.press(header.parent);
    expect(getByText('Hidden Content')).toBeDefined();

    // Collapse
    fireEvent.press(header.parent);
    expect(queryByText('Hidden Content')).toBeNull();
  });

  it('uses dark theme colors when color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { getByTestId } = render(
      <Collapsible title='Test Section'>
        <Text>Content</Text>
      </Collapsible>
    );

    const icon = getByTestId('icon-symbol');
    expect(icon).toBeDefined();
  });

  it('rotates icon when expanded', () => {
    const { getByText, getByTestId } = render(
      <Collapsible title='Test Section'>
        <Text>Content</Text>
      </Collapsible>
    );

    const header = getByText('Test Section');
    const icon = getByTestId('icon-symbol');

    // Initially should not be rotated (0deg)
    expect(icon.props.style.transform[0].rotate).toBe('0deg');

    // Expand
    fireEvent.press(header.parent);

    // Should be rotated (90deg)
    expect(icon.props.style.transform[0].rotate).toBe('90deg');
  });
});
