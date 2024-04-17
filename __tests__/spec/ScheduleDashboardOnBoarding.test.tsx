import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import ScheduleDashboardOnBoarding from '../../src/pages/UnitConfiguration/ScheduleDashboardOnBoarding';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from '../../src/store/reducers/HomeOwnerReducer';

const schedules =
  [{
    model_id: '1',
    mode: '3',
    state: '0',
    limit: '71-82',
    unit: 'F',
    name: 'Home',
    data: {
      items1: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items2: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items3: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items4: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items5: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items6: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items7: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
    },
  },
  {
    model_id: '2',
    mode: '3',
    state: '0',
    limit: '71-82',
    unit: 'F',
    name: 'Vacation',
    data: {
      items1: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items2: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items3: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items4: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items5: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items6: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
      items7: [{ t: '78.0-70.0', h: '0', c: '0', }, { t: '78.0-70.0', h: '0', c: '0', }],
    },
  }]

  const rootReducer = combineReducers({
    homeOwner: HomeOwnerReducer,
  });
  const store = createStore(
    rootReducer,
    {
      homeOwner: {
        dateBCC50: 'August 29 2023',
        timeBCC50: '10:36 PM',
        schedulesOnBoarding:schedules,
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

describe('ScheduleDashboardOnBoarding screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ScheduleDashboardOnBoarding 
                navigation={fakeNavigation}
                schedules={schedules}
                isReusable={false}/>
      </Provider>
    )
  })

  it('Render ScheduleDashboardOnBoarding screen', () => {
    expect(component).toBeDefined();
  });

  it('Press option no schedule', () => {
    const button = component.getByTestId("NoScheduleOption")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "schedule", value: 2 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.schedule).toBe(2)
  });

  it('Press option Home', () => {
    const button = component.getByTestId("Home")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "schedule", value: 0 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.schedule).toBe(0)
  });

  it('Press option Vacation', () => {
    const button = component.getByTestId("Vacation")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateUnitConfiguration')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateUnitConfiguration({ name: "schedule", value: 1 })
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.infoUnitConfiguration.schedule).toBe(1)
  });

  it('Add Schedule', () => {
    const button = component.getByTestId("AddScheduleButton")
    fireEvent(button, 'press')
    const button2 = component.getByTestId("SaveNewSchedule")
    fireEvent(button2, 'press')
    expect(store.getState().homeOwner.schedulesOnBoarding.length).toBe(3);
  });


  it('Press button Next', () => {
    const button = component.getByTestId("buttonNext")
    fireEvent(button, 'press')
    expect(fakeNavigation.navigate).toBeCalledWith('ReviewAddUnit')
  });

});
