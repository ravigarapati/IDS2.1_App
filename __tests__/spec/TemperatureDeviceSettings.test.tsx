import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import TemperatureDeviceSettings from '../../src/pages/TemperatureDeviceSettings';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {UPDATE_TEMPERATURE_SETTINGS} from '../../src/store/labels/HomeOwnerLabels';

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
  contractor: {
    selectedUnit: {
      odu: {
        modelNumber: 'testing',
      },
      systemStatus: 'testing',
      gateway: {gatewayId: 'testing'},
    },
  },
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
      selectedDevice: {
        autoOn: false,
        alertMessage: false,
        alarmLow: '70',
        alarmHigh: '80',
        lockDevice: false,
        d_hour: '1',
        isFahrenheit: true,
        deadband: 3,
        schedules: [
          {
            default_home: '1',
            limit: '71-81',
            mode: '1',
            model_id: '1',
            name: 'Home',
            state: '0',
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
            mode: '3',
            model_id: '3',
            name: 'summer ',
            state: '1',
          },
          {
            default_home: 0,
            limit: '71-82',
            mode: '3',
            model_id: '4',
            name: 'summer cam',
            state: '0',
          },
        ],
      },
      contractorMonitoringStatus: false,
      fanMode: '',
      fanOnFor: '',
      fanOffFor: '',
      fanIsScheduled: '',
      fanScheduledStart: '',
      fanScheduledEnd: '',
      selectedSchedule: '1',
      selectedScheduleName: '',
      scheduleInfo: {
        items1: [{c: '0', h: '0', t: '78.0-70.0'}],
        items2: [
          {c: '0', h: '0', t: '78.0-73.0'},
          {c: '0', h: '0', t: '99.0-90.0'},
        ],
        items3: [{c: '0', h: '1185', t: '52.0-48.0'}],
        items4: [{c: '0', h: '0', t: '78.0-70.0'}],
        items5: [{c: '0', h: '0', t: '78.0-70.0'}],
        items6: [{c: '0', h: '0', t: '78.0-70.0'}],
        items7: [{c: '0', h: '0', t: '78.0-70.0'}],
      },
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
      locationSuggestions: [
        {
          PlaceId:
            'AQABAFMAKZmJqReTuJvQ0SYSvNXBFPnTNre8NpZN_vO5ppVBiIVKMWyFo7U_23WZIEB3jBaCX9aLHNHy6gHy6QyfVv1o8QfoXctScRaEWzssnUy2A7vSsswLy5wkja6Jfp6hQXlv4QvGMRLRNcLPAogsltpxpywjew',
          Text: 'New York, NY, United States',
        },
      ],
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
  },
  applyMiddleware(thunk),
);

describe('BCC Temperature device screen', () => {
  test('Component to be defined', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <TemperatureDeviceSettings navigation={navigation} />
        </Provider>,
      )
      .toJSON();

    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <TemperatureDeviceSettings navigation={navigation} />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  test('Change Temperature', () => {
    const navState = {
      params: {
        createStatusInterval: () => {},
        setAuxHold: () => {},
        setUpdateInfo: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      state: navState,
    };
    const rendered = render(
      <Provider store={store}>
        <TemperatureDeviceSettings navigation={navigation} />
      </Provider>,
    );
    //let fButton = rendered.getByTestId('button1');
    //fireEvent(fButton, 'press');
  });

  test('Enable auto option', () => {
    const navState = {
      params: {
        createStatusInterval: () => {},
        setAuxHold: () => {},
        setUpdateInfo: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      state: navState,
    };
    const rendered = render(
      <Provider store={realStore}>
        <TemperatureDeviceSettings navigation={navigation} />
      </Provider>,
    );
    let updateTemp = jest
      .spyOn(homeOwnerActions, 'updateTemperatureSetting')
      .mockImplementationOnce(_ =>
        realStore.dispatch({
          type: UPDATE_TEMPERATURE_SETTINGS,
          data: {
            low: '70',
            high: '89',
            t_limit: '0',
            t_auto: '1',
          },
        }),
      );
    updateTemp();
    let fButton = rendered.getByTestId('autoOption');
    fireEvent(fButton, 'press');

    expect(realStore.getState().homeOwner.selectedDevice.autoOn).toBeTruthy();
  });

  test('Enable alert option', () => {
    const navState = {
      params: {
        createStatusInterval: () => {},
        setAuxHold: () => {},
        setUpdateInfo: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      state: navState,
    };
    const rendered = render(
      <Provider store={realStore}>
        <TemperatureDeviceSettings navigation={navigation} />
      </Provider>,
    );
    let updateTemp = jest
      .spyOn(homeOwnerActions, 'updateTemperatureSetting')
      .mockImplementationOnce(_ =>
        realStore.dispatch({
          type: UPDATE_TEMPERATURE_SETTINGS,
          data: {
            low: '70',
            high: '89',
            t_limit: '1',
            t_auto: '0',
          },
        }),
      );
    updateTemp();
    let fButton = rendered.getByTestId('alertOption');
    fireEvent(fButton, 'press');

    expect(
      realStore.getState().homeOwner.selectedDevice.alertMessage,
    ).toBeTruthy();
  });

  test('Change low temp', () => {
    const navState = {
      params: {
        createStatusInterval: () => {},
        setAuxHold: () => {},
        setUpdateInfo: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      state: navState,
    };
    const rendered = render(
      <Provider store={realStore}>
        <TemperatureDeviceSettings navigation={navigation} />
      </Provider>,
    );
    let updateTemp = jest
      .spyOn(homeOwnerActions, 'updateTemperatureSetting')
      .mockImplementationOnce(_ =>
        realStore.dispatch({
          type: UPDATE_TEMPERATURE_SETTINGS,
          data: {
            low: '45',
            high: '89',
            t_limit: '1',
            t_auto: '0',
          },
        }),
      );
    updateTemp();
    let fButton = rendered.getByTestId('lowTemp');
    fireEvent(fButton, 'confirm');
    expect(realStore.getState().homeOwner.selectedDevice.alarmLow).toBe('45');
  });

  test('Change high temp', () => {
    const navState = {
      params: {
        createStatusInterval: () => {},
        setAuxHold: () => {},
        setUpdateInfo: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      state: navState,
    };
    const rendered = render(
      <Provider store={realStore}>
        <TemperatureDeviceSettings navigation={navigation} />
      </Provider>,
    );
    let updateTemp = jest
      .spyOn(homeOwnerActions, 'updateTemperatureSetting')
      .mockImplementationOnce(_ =>
        realStore.dispatch({
          type: UPDATE_TEMPERATURE_SETTINGS,
          data: {
            low: '45',
            high: '60',
            t_limit: '1',
            t_auto: '0',
          },
        }),
      );
    updateTemp();
    let fButton = rendered.getByTestId('highTemp');
    fireEvent(fButton, 'confirm');
    expect(realStore.getState().homeOwner.selectedDevice.alarmHigh).toBe('60');
  });
});
