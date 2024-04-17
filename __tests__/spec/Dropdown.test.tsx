import 'react-native';
import React from 'react';
import {Dropdown} from '../../src/components';
import renderer from 'react-test-renderer';
import {Text, TouchableHighlight} from 'react-native';

describe('Dropdown Component', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(
        <Dropdown
          opened={true}
          setOpened={() => {}}
          dropdownStyle={{}}
          options={[
            <TouchableHighlight
              key={'Edit'}
              accessible={true}
              accessibilityRole="button"
              underlayColor={'black'}
              style={{}}
              onPressIn={() => {}}
              onPressOut={() => {}}>
              <Text>{'Edit'}</Text>
            </TouchableHighlight>,
            <TouchableHighlight
              key={'Delete'}
              accessible={true}
              accessibilityRole="button"
              underlayColor={'black'}
              style={{}}
              onPressIn={() => {}}
              onPressOut={() => {}}>
              <Text>{'Delete'}</Text>
            </TouchableHighlight>,
          ]}>
          <Text>Select</Text>
        </Dropdown>,
      )
      .toJSON();
    expect(tree).toBeDefined();
    //expect(tree).toMatchSnapshot();
  });
});
