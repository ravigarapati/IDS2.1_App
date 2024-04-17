import React from 'react';
import renderer from 'react-test-renderer';
import DisplayThermostatDevice from '../../src/components/DisplayThermostatDevice';

describe('Thermostat display component', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <DisplayThermostatDevice
          checkRadioButton={() => {}}
          thermostat={{name: 'Test', checked: false}}
          imagePath={require('./../../src/assets/images/BCC100.png')}
          isThermostatSelected={true}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <DisplayThermostatDevice
          checkRadioButton={() => {}}
          thermostat={{name: 'Test', checked: false}}
          imagePath={require('./../../src/assets/images/BCC100.png')}
          isThermostatSelected={true}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
