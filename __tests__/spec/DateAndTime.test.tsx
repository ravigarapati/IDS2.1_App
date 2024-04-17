import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import DateAndTime from '../../src/pages/UnitConfiguration/DateAndTime';
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
      dateBCC50: 'August 29 2023',
      timeBCC50: '10:36 PM',
      infoUnitConfiguration:{
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

describe('DateAndTime screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <DateAndTime navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render DateAndTime screen', () => {
    expect(component).toBeDefined();
  });

  it('TurnOn 24hr switch', () => {
    const _24hrSwitch = component.getByTestId("24hrSwitch")
    fireEvent(_24hrSwitch, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "hours1224", value: 0 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hours1224).toBe(0)
  });

  it('TurnOff 24hr switch', () => {
    const _24hrSwitch = component.getByTestId("24hrSwitch")
    fireEvent(_24hrSwitch, 'press')
    const addSpy1 = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "hours1224", value: 0 })
      ),
    );
    addSpy1();
    fireEvent(_24hrSwitch, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "hours1224", value: 1 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hours1224).toBe(1)
  });

  it('TurnOff Automatically switch', () => {
    const automaticallySwitch = component.getByTestId("automaticallySwitch")
    fireEvent(automaticallySwitch, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "hours1224", value: 0 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hours1224).toBe(0)
  });

  it('TurnOn Automatically switch', () => {
    const automaticallySwitch = component.getByTestId("automaticallySwitch")
    fireEvent(automaticallySwitch, 'press')
    fireEvent(automaticallySwitch, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "hours1224", value: 0 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.hours1224).toBe(0)
  });


  it('Press button Next', () => {
    const button = component.getByTestId("buttonNext")
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('Schedule')
  });

  it('Press button Next with 24hr', () => {
    const _24hrSwitch = component.getByTestId("24hrSwitch")
    fireEvent(_24hrSwitch, 'press')
    const button = component.getByTestId("buttonNext")
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('Schedule')
  });

  

});
