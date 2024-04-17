import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import AddPeriodOnBoarding from '../../src/pages/UnitConfiguration/AddPeriodOnBoarding';
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
        selectedSchedule:'1',
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
  const navState ={params: {newPeriod: 1, selectedDay: 3, edit: true}};
  const fakeNavigation = {
    getParam: (key, val) => navState?.params[key] ?? val,
    navigate: jest.fn(),
    goBack: () => {},
    state: navState,
  };
  
  let component;

describe('AddPeriodOnBoarding screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <AddPeriodOnBoarding 
                navigation={fakeNavigation}/>
      </Provider>
    )
  })

  it('Render AddPeriodOnBoarding screen', () => {
    expect(component).toBeDefined();
  });

  test('Change heat temperature', () => {
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriodOnBoarding')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.editPeriodOnBoarding({
            selected: 1,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${70}.0-${60}.0`,
              h: '120',
            },
          }),
        ),
      );
    const buttonComponent = component.getByTestId('heatConfirmButton');

    fireEvent(buttonComponent, 'confirm');
    addSpy();
  });

  test('Change cool temperature', () => {
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriodOnBoarding')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.editPeriodOnBoarding({
            selected: 1,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${70}.0-${60}.0`,
              h: '120',
            },
          }),
        ),
      );
    const buttonComponent = component.getByTestId('CoolConfirmButton');

    fireEvent(buttonComponent, 'confirm');
    addSpy();
  });
  
});
