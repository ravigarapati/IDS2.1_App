import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import FanSelection from '../../src/pages/FanSelection';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
const middlewares = [thunk];

const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
});

const realStore = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
        macId: '34eae7c30538',
        isAccessoryAdded: 1,
        isAccesoryEnabled: false,
        HumiditySetpoint: '41',
        datetime: '2020-09-01 00:00:47',
        location: '13601,Watertown,New York,United States',
        fanMode: '2',
      },
      contractorMonitoringStatus: false,
      fanMode: '2',
      fanOnFor: '',
      fanOffFor: '',
      fanIsScheduled: '0',
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
        {
          id: 2,
          //macId: 'e8fdf8a4773c',
          macId: '34eae7c30538',
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
        },
      ],
    },
  },
  applyMiddleware(thunk),
);

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      macId: '34eae7c30538',
      isAccessoryAdded: 1,
      isAccesoryEnabled: false,
      HumiditySetpoint: '41',
      datetime: '2020-09-01 00:00:47',
      location: '13601,Watertown,New York,United States',
      fanMode: '2',
      fanScheduledStart: true,
      fanIsScheduled: '0',
    },
    contractorMonitoringStatus: false,
    fanMode: '2',
    fanOnFor: '',
    fanOffFor: '',
    fanIsScheduled: '0',
    fanScheduledStart: true,
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
      {
        id: 2,
        //macId: 'e8fdf8a4773c',
        macId: '34eae7c30538',
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
      },
    ],
  },
  auth: {},
});

describe('Testing Fan Selection', () => {
  let navState, navigation, rendered, currentScreen;
  beforeEach(() => {
    navState = {
      params: {createStatusInterval: () => {}, setUpdateInfo: () => {}},
    };

    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => {
        currentScreen = page;
      },
      goBack: () => jest.fn(),
    };

    rendered = render(
      <Provider store={store}>
        <FanSelection navigation={navigation} />
      </Provider>,
    );
  });

  test('To be Defined', () => {
    expect(rendered).toBeDefined();
  });

  test('Cancel Button Event', () => {
    const Cancel = rendered.getByTestId('CancelButton');
    fireEvent(Cancel, 'press');
    expect(currentScreen).toBe('BCCDashboard');
  });

  test('TestingWeelPickers..', () => {
    const PickerTimer = rendered.getByTestId('Timer');
    fireEvent(PickerTimer, 'confirm');
    const Minutes = rendered.getByTestId('Minutes');
    fireEvent(Minutes, 'confirm');
    const HoursST = rendered.getByTestId('HoursStartTime');
    fireEvent(HoursST, 'confirm');
    const HoursET = rendered.getByTestId('HoursEndTime');
    fireEvent(HoursET, 'confirm');
  });

  test('Testing Submit Event', () => {
    const calledFunction = jest.fn();

    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateFanMode')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.updateFanMode(
            {
              device_id: '34eae7c30538',
              fan: '0',
              timestamp: '1694554691237',
            },
            calledFunction,
          ),
        ),
      );

    const renderedFanMode = render(
      <Provider store={realStore}>
        <FanSelection navigation={navigation} />
      </Provider>,
    );

    const Submit = rendered.getByTestId('Submit');
    fireEvent(Submit, 'press');
    addSpy();
    expect(realStore.getState().homeOwner.selectedDevice.fanMode).toBe('2');
  });
});
