import React from 'react';
import renderer from 'react-test-renderer';
import DeviceAdded from './../../src/components/DeviceAdded';
import {render, cleanup, fireEvent} from 'react-native-testing-library';

describe('Device Added Screen', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <DeviceAdded
          header={' Thermostat'}
          description={
            'Thermostat successfully\nregistered to the user account'
          }
          submit={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <DeviceAdded
          header={' Thermostat'}
          description={
            'Thermostat successfully\nregistered to the user account'
          }
          submit={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Cancel button clicked', () => {
    const cancelFuntion = jest.fn();
    const rendered = render(
      <DeviceAdded
        header={' Thermostat'}
        description={'Thermostat successfully\nregistered to the user account'}
        submit={cancelFuntion}
        cancelAction={cancelFuntion}
      />,
    );
    const cancelComponent = rendered.getByTestId('cancelButton');
    fireEvent(cancelComponent, 'press');
    expect(cancelFuntion).toHaveBeenCalled();
  });
  test('Submit button clicked', () => {
    const submitFunction = jest.fn();
    const rendered = render(
      <DeviceAdded
        header={' Thermostat'}
        description={'Thermostat successfully\nregistered to the user account'}
        submit={submitFunction}
      />,
    );
    const submitButton = rendered.getByTestId('submitButton');
    fireEvent(submitButton, 'press');
    expect(submitFunction).toHaveBeenCalled();
  });
});
