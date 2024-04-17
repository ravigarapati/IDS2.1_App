import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import DualFuel2 from '../../src/pages/UnitConfiguration/DualFuel2';
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



describe('DualFuel2 screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <DualFuel2 navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render DualFuel2 screen', () => {
    expect(component).toBeDefined();
  });

  it('Press ToggleButton EnergizedToggleButton1', () => {

    const button = component.getByTestId("EnergizedToggleButton1")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "hpEnergized", value: 0 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEnergized).toBe(0)

  });

  it('Press ToggleButton EnergizedToggleButton2', () => {
    const button = component.getByTestId("EnergizedToggleButton2")
    fireEvent(button, 'press')
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({ name: "hpEnergized", value: 1 })
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEnergized).toBe(1)
  });

  it('Press button Next', () => {
    const button = component.getByTestId("buttonNext")
    fireEvent(button, 'press')
    expect(button).toBeDefined();
  });


  

});
