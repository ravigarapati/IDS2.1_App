import 'react-native';
import React from 'react';
import Radiobutton from '../../src/components/Radiobutton';
import renderer from 'react-test-renderer';

describe('Radiobutton Component', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(<Radiobutton checked={true} handleCheck={() => {}} text="" />)
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const tree = renderer
      .create(<Radiobutton checked={true} handleCheck={() => {}} text="" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
