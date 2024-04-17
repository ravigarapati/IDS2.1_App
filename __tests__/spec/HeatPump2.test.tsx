import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import HeatPump2 from '../../src/pages/UnitConfiguration/HeatPump2';
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


describe('HeatPump2 screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <HeatPump2 navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render HeatPump2 screen', () => {
    expect(component).toBeDefined();
  });

  it('Press ToggleButton ElectricStageToggleButton1', () => {
    const button = component.getByTestId("ElectricStageToggleButton1")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "heatStages", value: 0 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.heatStages).toBe(0)
  });

  it('Press ToggleButton ElectricStageToggleButton2', () => {
    const button = component.getByTestId("ElectricStageToggleButton2")
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

  it('Press ToggleButton HeatPumpStageToggleButton1', () => {
    const button = component.getByTestId("HeatPumpStageToggleButton1")
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

  it('Press ToggleButton HeatPumpStageToggleButton2', () => {
    const button = component.getByTestId("HeatPumpStageToggleButton2")
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
