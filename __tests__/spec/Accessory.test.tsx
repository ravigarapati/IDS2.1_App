import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import UnitConfiguration from '../../src/pages/UnitConfiguration/UnitConfiguration';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import Accesory from '../../src/pages/UnitConfiguration/Accesory';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from '../../src/store/reducers/HomeOwnerReducer';

const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
});
const store = createStore(
  rootReducer,
  {
    homeOwner: {
      infoUnitConfiguration: {
        type: 0,
        fossilFuel: 0,
        hpEnergized: 0,
        hpEmHeat: 0,
        dualFBSetpoint: 400,
        dualFCOvertime: 45,
        heatStages: 1,
        coolStages: 1,
        humidityConf: 1,
        humidType: 0,
        dehumidType: 0,
        hours1224: 0,
        dateTime: {
          anio: 0,
          month: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        },
        schedule: 2,
      }
    },
  },
  applyMiddleware(thunk),
);
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('Accessory screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Accesory navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render Accessory screen', () => {
    expect(component).toBeDefined();
  });

  it('Render children Humidifier option', () => {
    const option = component.getByTestId("Humidifier")
    fireEvent(option, 'press')
    const children = component.getByTestId("HumidifierChildren")
    expect(children).toBeDefined();
  });

  it('Press toggle button HumidifierToggleButton1', () => {
    const option = component.getByTestId("Humidifier")
    fireEvent(option, 'press')
    const button = component.getByTestId("HumidifierToggleButton1")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "humidType", value: 1 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.humidType).toBe(1)
  });

  it('Press toggle button HumidifierToggleButton2', () => {
    const option = component.getByTestId("Humidifier")
    fireEvent(option, 'press')
    const button = component.getByTestId("HumidifierToggleButton2")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "humidType", value: 0 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.humidType).toBe(0)
  });

  it('Press option Dehumidifier and turnOn Cool to Dehumidify switch', () => {
    const option = component.getByTestId("Dehumidifier")
    fireEvent(option, 'press')
    const button = component.getByTestId("coolToDehumidifySwitch")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "dehumidType", value: 1 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.dehumidType).toBe(1)

  });


  it('Press option Dehumidifier and turnOn and turnOff Cool to Dehumidify switch', () => {
    const option = component.getByTestId("Dehumidifier")
    fireEvent(option, 'press')
    const button = component.getByTestId("coolToDehumidifySwitch")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "dehumidType", value: 1 })
      ),
    );
    addSpy();
    fireEvent(button, 'press')
    const addSpy2= jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "dehumidType", value: 0 })
      ),
    );
    addSpy2();
    expect(store.getState().homeOwner.infoUnitConfiguration.dehumidType).toBe(0)

  });

  it('Press option none', () => {

    const option = component.getByTestId("None")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "humidityConf", value: 2 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.humidityConf).toBe(2)

  });
  
});
