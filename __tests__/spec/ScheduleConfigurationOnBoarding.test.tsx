import 'react-native';
import React, {useState as useStateMock} from 'react';
import renderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, cleanup, fireEvent, act} from 'react-native-testing-library';
import thunk from 'redux-thunk';
import ScheduleConfigurationOnBoarding from '../../src/pages/UnitConfiguration/ScheduleConfigurationOnBoarding';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from '../../src/store/reducers/HomeOwnerReducer';

const schedules = [
  {
    model_id: '1',
    mode: '3',
    state: '0',
    limit: '71-82',
    unit: 'F',
    name: 'Home',
    data: {
      items1: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items2: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items3: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items4: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items5: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items6: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items7: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
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
      items1: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items2: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items3: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items4: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items5: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items6: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
      items7: [
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
        {t: '78.0-70.0', h: '0', c: '0'},
      ],
    },
  },
];

const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
});
const store = createStore(
  rootReducer,
  {
    homeOwner: {
      dateBCC50: 'August 29 2023',
      timeBCC50: '10:36 PM',
      selectedSchedule: '1',
      schedulesOnBoarding: schedules,
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
const navState = {params: {new: false}};
const fakeNavigation = {
  getParam: (key, val) => navState?.params[key] ?? val,
  navigate: jest.fn(),
  goBack: () => {},
  state: navState,
};

let component;

describe('ScheduleConfigurationOnBoarding screen', () => {
  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ScheduleConfigurationOnBoarding navigation={fakeNavigation} />
      </Provider>,
    );
  });

  it('Render ScheduleDashboardOnBoarding screen', () => {
    expect(component).toBeDefined();
  });

  it('Press Add Period', () => {
    const button = component.getByText('Add Period');
    fireEvent(button, 'press');
    //expect(fakeNavigation.navigate).toBeCalledWith('AddPeriodOnBoarding', {
    //  edit: false,
    //  newPeriod: 5,
    //  selectedDay: 4,
    //});
  });

  it('Press Edit Period', () => {
    const button = component.getByTestId('DropDown0');
    fireEvent(button, 'press');
    const button2 = component.getByTestId('EditButton0');
    expect(button2).toBeDefined();
    fireEvent(button2, 'onPressOut');
    //expect(fakeNavigation.navigate).toBeCalledWith('AddPeriodOnBoarding', {
    //  edit: true,
    //  newPeriod: 1,
    //  selectedDay: 4,
    //});
  });

  it('Press Finish', () => {
    const button = component.getByTestId('FinishButton');
    fireEvent(button, 'press');
    expect(fakeNavigation.goBack);
  });

  it('Press Copy', () => {
    const button = component.getByTestId('CopyButton');
    fireEvent(button, 'press');
    const modal = component.getByTestId('ModalCopy');
    expect(modal).toBeDefined();
  });

  it('Save Copy', () => {
    const button = component.getByTestId('CopyButton');
    fireEvent(button, 'press');
    const modal = component.getByTestId('ModalCopy');
    expect(modal).toBeDefined();
    const buttonClose = component.getByTestId('SaveCopy');
    fireEvent(buttonClose, 'press');
    expect(buttonClose).toBeDefined();
  });

  it('Press Delete', () => {
    const button = component.getByTestId('DropDown3');
    fireEvent(button, 'press');
    const button2 = component.getByTestId('DeleteButton3');
    expect(button2).toBeDefined();
    fireEvent(button2, 'onPressOut');
    const modal = component.getByTestId('ModalDelete');
    expect(modal).toBeDefined();
    const button3 = component.getByTestId('DeleteButton');
    fireEvent(button3, 'press');
    const addSpy = jest
      .spyOn(homeOwnerActions, 'removePeriodOnBoarding')
      .mockImplementationOnce(_ =>
        store.dispatch(
          homeOwnerActions.removePeriodOnBoarding({
            selected: '1',
            index: 3,
            selectedSchedule: 3,
          }),
        ),
      );
    addSpy();
    expect(
      store.getState().homeOwner.schedulesOnBoarding[0].data['items4'].length,
    ).toBe(4);
  });
});
