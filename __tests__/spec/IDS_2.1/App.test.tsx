/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../../../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.useFakeTimers();

it('renders correctly', async () => {
  const app = renderer.create(<App />);
  expect(app).toBeDefined();
});
