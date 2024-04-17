import 'react-native';
import React, { useState as useStateMock } from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import FossilFuel2 from '../../src/pages/UnitConfiguration/FossilFuel2';
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

describe('FossilFuel2 screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <FossilFuel2 navigation={fakeNavigation} />
      </Provider>
    )
  })


  it('Render FossilFuel2 screen', () => {
    expect(component).toBeDefined();
  });

  it('Press ToggleButton FossilFuelStages1', () => {
    const button = component.getByTestId("toggleButton1")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "heatStages", value: 1 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.heatStages).toBe(1)
  });

  it('Press ToggleButton FossilFuelStages2', () => {
    const button = component.getByTestId("toggleButton2")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "heatStages", value: 2 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.heatStages).toBe(2)
  });

  it('Press ToggleButton AirConditionerStages1', () => {
    const button = component.getByTestId("toggleButton3")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 0 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(0)
  });

  it('Press ToggleButton AirConditionerStages2', () => {
    const button = component.getByTestId("toggleButton4")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 1 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(1)
  });

  it('Press ToggleButton AirConditionerStages3', () => {
    const button = component.getByTestId("toggleButton5")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 2 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(2)
  });


});
