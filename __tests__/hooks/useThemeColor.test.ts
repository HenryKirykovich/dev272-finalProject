import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';

jest.mock('../../hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

jest.mock('../../constants/Colors', () => ({
  Colors: {
    light: {
      text: '#000000',
      background: '#ffffff',
      tint: '#007AFF',
      icon: '#666666',
      tabIconDefault: '#cccccc',
      tabIconSelected: '#007AFF',
    },
    dark: {
      text: '#ffffff',
      background: '#000000',
      tint: '#007AFF',
      icon: '#999999',
      tabIconDefault: '#666666',
      tabIconSelected: '#007AFF',
    },
  },
}));

describe('useThemeColor', () => {
  const mockUseColorScheme = useColorScheme as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light color when color scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ff0000', dark: '#00ff00' }, 'text')
    );

    expect(result.current).toBe('#ff0000');
  });

  it('returns dark color when color scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#ff0000', dark: '#00ff00' }, 'text')
    );

    expect(result.current).toBe('#00ff00');
  });

  it('returns default light theme color when no custom colors provided and scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');
  });

  it('returns default dark theme color when no custom colors provided and scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#ffffff');
  });

  it('prioritizes custom light color over default when scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#custom' }, 'text')
    );

    expect(result.current).toBe('#custom');
  });

  it('prioritizes custom dark color over default when scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() =>
      useThemeColor({ dark: '#custom' }, 'text')
    );

    expect(result.current).toBe('#custom');
  });

  it('handles different color names correctly', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result: backgroundResult } = renderHook(() =>
      useThemeColor({}, 'background')
    );
    const { result: tintResult } = renderHook(() => useThemeColor({}, 'tint'));

    expect(backgroundResult.current).toBe('#ffffff');
    expect(tintResult.current).toBe('#007AFF');
  });

  it('falls back to light theme when color scheme is null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');
  });
});
