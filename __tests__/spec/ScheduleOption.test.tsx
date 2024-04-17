import 'react-native';
import React from 'react';
import ScheduleOption from '../../src/components/ScheduleOption';
import renderer from 'react-test-renderer';

jest.mock('../../src/components/RadioButton', () => 'RadioButton');
jest.mock('../../src/components/Dropdown', () => 'Dropdown');
jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');
jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/CustomText', () => 'CustomText');

describe('Schedule option for Schedule screen', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <ScheduleOption
          scheduleName={'Testing'}
          selected={false}
          setSelected={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <ScheduleOption
          scheduleName={'Testing'}
          selected={false}
          setSelected={() => {}}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
