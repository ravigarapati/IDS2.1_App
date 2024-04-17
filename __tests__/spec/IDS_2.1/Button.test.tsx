import 'react-native';
import React from 'react';
import Button from '../../../src/components/Button';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.useFakeTimers();

it('renders correctly', async () => {
  const buttonPrimary = renderer.create(
    <Button type="primary" text="Button1" />,
  );
  expect(buttonPrimary).toBeDefined();
  const buttonSecondary = renderer.create(
    <Button type="secondary" text="Button2" />,
  );
  expect(buttonSecondary).toBeDefined();
  const buttonTertiary = renderer.create(
    <Button type="tertiary" text="Button2" />,
  );
  expect(buttonTertiary).toBeDefined();
});
