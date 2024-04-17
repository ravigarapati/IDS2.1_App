import 'react-native';
import React from 'react';
import AddBcc from './../../src/pages/AddBcc';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import EditDevice from '../../src/pages/EditDevice';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';

jest.useFakeTimers();

const mockStore = configureMockStore();
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {},
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
      /*{
        id: 2,
        //macId: 'e8fdf8a4773c',
        macId: '34eae7c351e6',
        deviceName: 'Bedroom Thermostat',
        deviceType: 'BCC100',
        isThermostat: true,
        isOn: true,
        mode: 0,
        setPoint: 74,
        heatingSetpoint: 74,
        coolingSetpoint: 79,
        current: 76,
        isAccesories: true,
        accesories: [
          {
            id: 0,
            name: 'Dehumidifier',
            isEnable: 0,
            isOn: false,
          },
          {
            id: 1,
            name: 'Humidifier',
            isEnable: 1,
            isOn: false,
          },
        ],
        isMonitoring: null,
        isOnSchedule: true,
        stage: 3,
        isConnected: true,
        acceleratedHeating: true,
        schedules: [],
      },*/
    ],
  },
  auth: {},
});
const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
});
const realStore = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {},
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
      deviceList2: [],
    },
  },
  applyMiddleware(thunk),
);

describe('Edit Device screen', () => {
  test('Component to be defined', () => {
    const navState = {
      params: {
        macId: 'testing',
        installationAddress: {},
        description: 'testing Thermostat',
        deviceType: 'BCC',
        contractorMonitoringStatus: false,
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <EditDevice navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const navState = {
      params: {
        macId: 'testing',
        description: 'testing Thermostat',
        deviceType: 'BCC',
        installationAddress: {},
        contractorMonitoringStatus: false,
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <EditDevice navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Click on cancel button', () => {
    let currentScreen = '';
    const navState = {
      params: {
        macId: 'testing',
        description: 'testing Thermostat',
        deviceType: 'BCC',
        installationAddress: {},
        contractorMonitoringStatus: false,
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: screen => {
        currentScreen = screen;
      },
      state: navState,
    };
    const rendered = render(
      <Provider store={store}>
        <EditDevice navigation={navigation} />
      </Provider>,
    );
    let cancelButton = rendered.getByTestId('cancel');
    fireEvent(cancelButton, 'press');

    expect(currentScreen).toBe('HomeTabs');
  });

  test('Edit the device', () => {
    let currentScreen = '';
    let mockedValues = {
      deviceId: '98d863d2416a',
      deviceName: 'ab Thermostat',
    };
    const navState = {
      params: {
        macId: 'testing',
        description: 'testing Thermostat',
        installationAddress: {},
        contractorMonitoringStatus: false,
        deviceType: 'BCC',
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: screen => {
        currentScreen = screen;
      },
      state: navState,
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => ['new name', () => null])
      .mockImplementationOnce(() => [false, () => null]);
    const rendered = render(
      <Provider store={realStore}>
        <EditDevice navigation={navigation} />
      </Provider>,
    );

    let editSpy = jest
      .spyOn(homeOwnerActions, 'editDevice')
      .mockReturnValueOnce(mockedValues);

    let submitButton = rendered.getByTestId('submit');
    fireEvent(submitButton, 'press');
    let valuesFromApi = editSpy();
    expect(valuesFromApi.deviceName).toBe(mockedValues.deviceName);
  });

  test('Edit the device (IDS 2.1)', () => {
    let currentScreen = '';
    let mockedValues = {
      deviceId: '399A-123-123123-8733955691',
      deviceName: 'Heat Pump 2',
    };
    const navState = {
      params: {
        macId: '399A-123-123123-8733955691',
        description: 'Heat Pump 1',
        installationAddress: {},
        contractorMonitoringStatus: false,
        deviceType: 'IDS Premium Connected',
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: screen => {
        currentScreen = screen;
      },
      state: navState,
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => ['new name', () => null])
      .mockImplementationOnce(() => [false, () => null]);
    const rendered = render(
      <Provider store={realStore}>
        <EditDevice navigation={navigation} />
      </Provider>,
    );

    let editSpy = jest
      .spyOn(homeOwnerActions, 'editDevice')
      .mockReturnValueOnce(mockedValues);

    let submitButton = rendered.getByTestId('submit');
    fireEvent(submitButton, 'press');
    let valuesFromApi = editSpy();
    expect(valuesFromApi.deviceName).toBe(mockedValues.deviceName);
  });

  test('Edit the device (IDS 3.0)', () => {
    let currentScreen = '';
    let mockedValues = {
      deviceId: '399A-123-123123-8733955691',
      deviceName: 'Heat Pump 2',
    };
    const navState = {
      params: {
        macId: '399A-123-123123-8733955691',
        description: 'Heat Pump 1',
        installationAddress: {},
        contractorMonitoringStatus: false,
        deviceType: 'IDS Arctic',
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: screen => {
        currentScreen = screen;
      },
      state: navState,
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => ['new name', () => null])
      .mockImplementationOnce(() => [false, () => null]);
    const rendered = render(
      <Provider store={realStore}>
        <EditDevice navigation={navigation} />
      </Provider>,
    );

    let editSpy = jest
      .spyOn(homeOwnerActions, 'editDevice')
      .mockReturnValueOnce(mockedValues);

    let submitButton = rendered.getByTestId('submit');
    fireEvent(submitButton, 'press');
    let valuesFromApi = editSpy();
    expect(valuesFromApi.deviceName).toBe(mockedValues.deviceName);
  });

  test('Click on back button', () => {
    let currentScreen = '';
    const navState = {
      params: {
        macId: 'testing',
        description: 'testing Thermostat',
        deviceType: 'BCC',
        installationAddress: {},
        contractorMonitoringStatus: false,
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: screen => {
        currentScreen = screen;
      },
      state: navState,
    };
    const rendered = render(
      <Provider store={store}>
        <EditDevice navigation={navigation} />
      </Provider>,
    );
    let cancelButton = rendered.getByTestId('backButton');
    fireEvent(cancelButton, 'press');

    expect(currentScreen).toBe('HomeTabs');
  });
});
