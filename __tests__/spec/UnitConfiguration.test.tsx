import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import UnitConfiguration from '../../src/pages/UnitConfiguration/UnitConfiguration';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'

const middlewares = [thunk]

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {},
  auth: {},
  locationOnboarding: {},
  nameDeviceOnboarding: ''
});
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('Unit Configuration screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <UnitConfiguration navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render UnitConfiguration screen', () => {
    expect(component).toBeDefined();
  });

  it('Should navigate to Fossil Fuel ', () => {
    const button1 = component.getByText("Fossil Fuel")
    fireEvent(button1, 'press')
    const button = component.getByTestId('ButtonNext');
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('FossilFuel1')
  });

  it('Should navigate to Heat Pump', () => {
    const button1 = component.getByText("Heat Pump")
    fireEvent(button1, 'press')
    const button = component.getByTestId('ButtonNext');
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('HeatPump1')
  });

  it('Should navigate to Dual Fuel', () => {
    const button1 = component.getByText("Dual Fuel")
    fireEvent(button1, 'press')
    const button = component.getByTestId('ButtonNext');
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('DualFuel1')
  });

  it('Should navigate to Electric', () => {
    const button1 = component.getByText("Electric")
    fireEvent(button1, 'press')
    const button = component.getByTestId('ButtonNext');
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('Electric1')
  });

  it('Should navigate to No Heating', () => {
    const button1 = component.getByText("No Heating")
    fireEvent(button1, 'press')
    const button = component.getByTestId('ButtonNext');
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('NoHeating1')
  });


});
