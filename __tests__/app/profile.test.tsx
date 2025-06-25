import { render } from '@testing-library/react-native';
import React from 'react';
import ProfileForm from '../../app/(auth)/profile-form';
import ProfileScreen from '../../app/(tabs)/profile';

jest.mock('../../app/(auth)/profile-form', () => jest.fn(() => null));

describe('ProfileScreen', () => {
  it('renders the ProfileForm component', () => {
    render(<ProfileScreen />);
    expect(ProfileForm).toHaveBeenCalled();
  });
});
