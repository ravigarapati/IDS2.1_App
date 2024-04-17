import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import RuntimeSettings from '../../src/pages/RuntimeSettings';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as homeOwnerActions from '../../src/store/actions/HomeOwnerActions';
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

describe('RuntimeSettings screen', () => {

  beforeEach(() => {
    component = render(
      <Provider store={store}>
        <RuntimeSettings navigation={fakeNavigation} />
      </Provider>
    )
  })

  it('Render RuntimeSettings screen', () => {
    expect(component).toBeDefined();
  });
  
  it('Reset Heating Time', () => {
    const button = component.getByTestId("ResetHeatButton")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'resetRunTime')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.resetRunTime("34eae7c351e6", "1",'')
      ),
    );
    addSpy();
    expect(button).toBeDefined

  });

  it('Reset Cooling Time', () => {
    const button = component.getByTestId("ResetCoolButton")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'resetRunTime')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.resetRunTime("34eae7c351e6", "2",'')
      ),
    );
    addSpy();
    expect(button).toBeDefined

  });

  it('Reset Heating Time', () => {
    const button = component.getByTestId("ResetAirFilterButton")
    fireEvent(button, 'press')
    const addSpy = jest
    .spyOn(homeOwnerActions, 'resetRunTime')
    .mockImplementationOnce(_ =>
      store.dispatch(
        homeOwnerActions.resetRunTime("34eae7c351e6", "3",'')
      ),
    );
    addSpy();
    expect(button).toBeDefined

  });

  it('Shows Modal Setup', () => {
    const button = component.getByTestId("OpenSetup")
    fireEvent(button, 'press')
    const modal = component.getByTestId("ModalSetup")
    expect(modal).toBeDefined();

  });

  it('Close Modal Setup', () => {
    const button = component.getByTestId("OpenSetup")
    fireEvent(button, 'press')
    const modal = component.getByTestId("ModalSetup")
    expect(modal).toBeDefined();
    const button2 = component.getByTestId("CloseModalButton")
    fireEvent(button2, 'press')

  });

  test('Change Replacement Time Period', () => {
     const button = component.getByTestId("OpenSetup")
    fireEvent(button, 'press')
    const modal = component.getByTestId("ModalSetup")
    expect(modal).toBeDefined();
    const WheelPicker = component.getByTestId('ReplacementTimePeriodWheel');
    fireEvent(WheelPicker, 'confirm');
  });

  it('Save Setup', () => {
    const button = component.getByTestId("OpenSetup")
    fireEvent(button, 'press')
    const modal = component.getByTestId("ModalSetup")
    expect(modal).toBeDefined();
    const button2 = component.getByTestId("SaveSetupButton")
    fireEvent(button2, 'press')

  });

});
