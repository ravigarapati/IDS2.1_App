import 'react-native';
import React from 'react';
import WeatherForecast from '../../src/components/WeatherForecast';
import renderer from 'react-test-renderer';

jest.mock('../../src/components/CustomText', () => 'CustomText');

describe('Weather forecast Component', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <WeatherForecast
          day="Today"
          temperature="H:70°/L:60°"
          icon={require('./../../src/assets/images/backgroundsWeather/icons/Cloudy.png')}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <WeatherForecast
          day="Today"
          temperature="H:70°/L:60°"
          icon={require('./../../src/assets/images/backgroundsWeather/icons/Cloudy.png')}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
