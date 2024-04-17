import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import Electric1 from '../../src/pages/UnitConfiguration/Electric1';
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

describe('Electric1 screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <Electric1 navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render Electric1 screen', () => {
    expect(component).toBeDefined();
  });

  it('Press ToggleButton ElectricStageToggleButton1', () => {
    const button = component.getByTestId("ElectricStageToggleButton1")
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

  it('Press ToggleButton ElectricStageToggleButton2', () => {
    const button = component.getByTestId("ElectricStageToggleButton2")
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

  it('Press ToggleButton AirConditionerStageToggleButton1', () => {
    const button = component.getByTestId("AirConditionerStageToggleButton1")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 0})
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(0)

  });

  it('Press ToggleButton AirConditionerStageToggleButton2', () => {
    const button = component.getByTestId("AirConditionerStageToggleButton2")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 1})
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(1)
  });

  it('Press ToggleButton AirConditionerStageToggleButton3', () => {
    const button = component.getByTestId("AirConditionerStageToggleButton3")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "coolStages", value: 2})
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.coolStages).toBe(2)
  });

  it('Press button Next', () => {
    const button = component.getByTestId("buttonNext")
    fireEvent(button, 'press')
    expect(button).toBeDefined();
  });


  

});
