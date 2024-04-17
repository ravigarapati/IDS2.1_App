import 'react-native';
import React from 'react';
import {ModalComponent} from '../../src/components';
import renderer from 'react-test-renderer';

describe('Modal Component', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <ModalComponent
          modalVisible={true}
          closeModal={() => {}}
          children={null}
        />,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <ModalComponent
          modalVisible={true}
          closeModal={() => {}}
          children={null}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
