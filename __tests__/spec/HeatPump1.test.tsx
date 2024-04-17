import 'react-native';
import React, {useState as useStateMock} from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, cleanup, fireEvent, act} from 'react-native-testing-library';
import thunk from 'redux-thunk';
import HeatPump1 from '../../src/pages/UnitConfiguration/HeatPump1';
import {createStore, combineReducers, applyMiddleware} from 'redux';
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
      },
    },
  },
  applyMiddleware(thunk),
);
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('HeatPump1 screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <HeatPump1 navigation={fakeNavigation} />
      </Provider>,
    );
  });

  it('Render HeatPump1 screen', () => {
    expect(component).toBeDefined();
  });

  it('Press ToggleButton EnergizedToggleButton1', () => {
    const option = component.getByTestId('EnergizedToggleButton1');
    fireEvent(option, 'press');
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({
            name: 'hpEnergized',
            value: 0,
          }),
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEnergized).toBe(
      0,
    );
  });

  it('Press ToggleButton EnergizedToggleButton2', () => {
    const option = component.getByTestId('EnergizedToggleButton2');
    fireEvent(option, 'press');
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({
            name: 'hpEnergized',
            value: 1,
          }),
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEnergized).toBe(
      1,
    );
  });

  it('turnOn Cool to Dehumidify switch', () => {
    const option = component.getByTestId('coolToDehumidifySwitch');
    fireEvent(option, 'press');
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({
            name: 'hpEmHeat',
            value: 1,
          }),
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEmHeat).toBe(1);
  });

  it('turnOn Auxiliary Heating switch', () => {
    const option = component.getByTestId('auxiliaryHeatingSwitch');
    fireEvent(option, 'press');
    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateUnitConfiguration')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.updateUnitConfiguration({
            name: 'hpEmHeat',
            value: 2,
          }),
        ),
      );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hpEmHeat).toBe(2);
  });
});
