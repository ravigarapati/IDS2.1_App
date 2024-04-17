import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import ScreenSettings from '../../src/pages/ScreenSettings';
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
        energyData: {},
        deviceList: [],
        selectedDevice: {
          HumiditySetpoint: '50',
          acceleratedHeating: true,
          accesories: [
            {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
            {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
          ],
          alarmHigh: '82',
          alarmLow: '45',
          alertMessage: false,
          autoOn: true,
          auto_time: '1',
          code: '',
          coolingSetpoint: 48,
          coolingTemp: '48.0',
          current: 73,
          d_hour: '1',
          datetime: '2023-08-15 17:55:44',
          deadband: '2.6',
          deviceName: 'Testing Thermostat',
          deviceType: 'BCC101',
          fan: '2',
          fanStatus: '0',
          heatType: '2-3-0',
          heatingSetpoint: 45,
          heatingTemp: '45.0',
          hold: '0',
          humidity: '62',
          id: 2,
          isAccesories: true,
          isAccesoryEnabled: false,
          isAccessoryAdded: '2',
          isConnected: true,
          isFahrenheit: true,
          isMonitoring: null,
          isOn: true,
          isOnSchedule: true,
          isThermostat: true,
          lockDevice: false,
          macId: '34eae7c351e6',
          mode: 2,
          modeName: 'Home',
          paired: false,
          pairedDevice: {macId: ''},
          periodCooling: '48.0',
          periodHeating: '45.0',
          periodHour2: '0',
          periodMinute2: '0',
          power: '0',
          roomTemp: '73.0',
          type:1,
          screen:1,
          s_time:1,
          schedules: [
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
            },
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '2',
              name: 'Vacation',
              state: '0',
            },
            {
              default_home: 0,
              limit: '71-82',
              mode: '2',
              model_id: '3',
              name: 'Test',
              state: '0',
            },
          ],
          setPoint: 73,
          stage: 3,
          sw: '0',
        },
        contractorMonitoringStatus: false,
        fanMode: '',
        fanOnFor: '',
        fanOffFor: '',
        fanIsScheduled: '',
        fanScheduledStart: '',
        fanScheduledEnd: '',
        selectedSchedule: '0',
        selectedScheduleName: '',
        scheduleInfo: {},
        prevSelectedDevice: {},
        deviceStatus: {},
        deviceInformation: {},
        deviceDetails: {},
        heatPumpInfo: {},
        reloadHeatPumpInfo: false,
        notificationList: [],
        lastKey: {},
        notificationsCount: 0,
        lastUpdated: null,
        isTermsConditionsAccepted: null,
        hoUserAnalytics: null,
        selectedUnitName: {},
        isThermostatSelected: true,
        isUserFirstLogin: true,
        actualWeatherOnFahrenheit: true,
        hapticVibration: true,
        _24HrsFormatSelected: false,
        location: 'Alabaster',
        updatedSelectedDevice: false,
        weatherInfo: {},
        weatherInfoLocation: {},
        locationSuggestions: [],
        locationInformation: {},
        idsSelectedDeviceAccess: '',
        utilyEnergySaving: '',
        idsSelectedDevice: '',
        idsSelectedOdu: '',
        idsSelectedDeviceType: '',
        tempLocation: '',
        newDeviceInfo: {},
        previousBcc: '',
        deviceList2: [

        ],
      },
  },
  applyMiddleware(thunk),
);
const fakeNavigation = {
  navigate: jest.fn(),
};

let component;

describe('ScreenSettings screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <ScreenSettings navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render ScreenSettings screen', () => {
    expect(component).toBeDefined();
  });

  it('Lock screen on', () => {
    const option = component.getByTestId("LoockScreenSwitch")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'lockScreen')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.lockScreen("34eae7c351e6", "0", "2425")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.type).toBe(1)

  });

  it('Brightness screen Low', () => {
    const option = component.getByTestId("Low")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "1", "2")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.screen).toBe(1)

  });

  it('Brightness screen Mediun', () => {
    const option = component.getByTestId("Medium")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "2", "2")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.screen).toBe(1)

  });

  it('Brightness screen High', () => {
    const option = component.getByTestId("High")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "3", "2")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.screen).toBe(1)

  });
  
  it('TimeOut 20 sec', () => {
    const option = component.getByTestId("20 sec")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "1", "1")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.s_time).toBe(1)

  });

  it('TimeOut 1 min', () => {
    const option = component.getByTestId("1 min")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "1", "2")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.s_time).toBe(1)

  });

  it('TimeOut 3 min', () => {
    const option = component.getByTestId("3 min")
    fireEvent(option, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'updateBrightness')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.updateBrightness("34eae7c351e6", "1", "3")
      ),
    );
    addSpy();
    expect(store.getState().homeOwner.selectedDevice.s_time).toBe(1)

  });
  

});
