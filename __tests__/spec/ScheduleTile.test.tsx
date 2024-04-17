import 'react-native';
import React from 'react';
import ScheduleTile from '../../src/components/ScheduleTile';
import renderer from 'react-test-renderer';

jest.mock('../../src/components/CustomText', () => 'CustomText');
jest.mock('../../src/components/Dropdown', () => 'Dropdown');

describe('Schedule Tile on schedule screen', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <ScheduleTile
          number={1}
          hour={'07:00'}
          heating={'70°F'}
          cooling={'75°F'}
          removePeriod={() => {}}
          navigation={undefined}
          selectedDay={0}
          showDelete={false}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <ScheduleTile
          number={1}
          hour={'07:00'}
          heating={'70°F'}
          cooling={'75°F'}
          removePeriod={() => {}}
          navigation={undefined}
          selectedDay={0}
          showDelete={false}
        />,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
