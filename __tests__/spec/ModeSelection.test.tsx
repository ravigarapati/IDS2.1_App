import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import ModeSelection from '../../src/pages/ModeSelection';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import thunk from 'redux-thunk';
const middlewares = [thunk];
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';

jest.useFakeTimers();

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      macId: '34eae7c30538',
      paired: false,
      d_hour: '1',
      heatType: '2-3-0',
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
const storeEmHeatDisabled = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      macId: '34eae7c30538',
      paired: false,
      d_hour: '1',
      mode: 0,
      heatType: '2-3-0-0',
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
const storeEmHeatEnabled = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      macId: '34eae7c30538',
      paired: false,
      d_hour: '1',
      mode: 1,
      heatType: '2-3-0-1',
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
describe('Mode Selection screen', () => {
  test('renders correctly', () => {
    const navState = {params: {statusInterval: null}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      state: navState,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <ModeSelection navigation={navigation} />,
        </Provider>,
      )
      .toJSON();

    expect(tree).toBeDefined();
    expect(tree).toMatchSnapshot();
  });
  test('Initialize without Em heat', () => {
    let heatType = store.getState().homeOwner.selectedDevice.heatType;
    let heatTypeValues = heatType.split('-');
    const navState = {params: {statusInterval: null}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      state: navState,
    };
    const rendered = render(
      <Provider store={store}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );
    expect(heatTypeValues.length).toBe(3);
  });
  test('Initialize including Em heat option disabled', () => {
    let heatType =
      storeEmHeatDisabled.getState().homeOwner.selectedDevice.heatType;
    let heatTypeValues = heatType.split('-');
    const navState = {params: {statusInterval: null}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      state: navState,
    };
    const rendered = render(
      <Provider store={storeEmHeatDisabled}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );
    expect(heatTypeValues.length).toBe(4);
    expect(heatTypeValues[3]).toBe('0');
  });
  test('Initialize including Em heat option enabled', () => {
    let heatType =
      storeEmHeatEnabled.getState().homeOwner.selectedDevice.heatType;
    let heatTypeValues = heatType.split('-');
    const navState = {params: {statusInterval: null}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      state: navState,
    };
    const rendered = render(
      <Provider store={storeEmHeatEnabled}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );
    expect(heatTypeValues.length).toBe(4);
    expect(heatTypeValues[3]).toBe('1');
  });
  test('Submit Mode selection', () => {
    const realStore = createStore(
      HomeOwnerReducer,
      {
        homeOwner: {
          energyData: {},
          deviceList: [],
          selectedDevice: {
            macId: '34eae7c30538',
            paired: false,
            d_hour: '1',
            mode: 1,
            heatType: '2-3-0-1',
            heatingTemp: '10',
            deadband: '2',
            coolingTemp: '20',
            isFahrenheit: true,
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
      },
      applyMiddleware(thunk),
    );
    const navState = {
      params: {
        setAuxHold: () => {},
        setUpdateInfo: () => {},
        createStatusInterval: () => {},
      },
    };

    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      state: navState,
    };
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [0, () => null])
      .mockImplementationOnce(() => [false, () => null])
      .mockImplementationOnce(() => ['1', () => null]);

    let setSelectedDevice = jest
      .spyOn(homeOwnerActions, 'setSelectedDevice')
      .mockImplementationOnce(_ => {
        realStore.dispatch(
          homeOwnerActions.setSelectedDevice({
            ...realStore.getState().homeOwner.selectedDevice,
            mode: 2,
            power: '2',
          }),
        );
      });

    jest.spyOn(homeOwnerActions, 'updateThermostatMode');

    const rendered = render(
      <Provider store={realStore}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );

    const submitComponent = rendered.getByTestId('submitModeSelection');
    fireEvent(submitComponent, 'press');
    setSelectedDevice();
    expect(realStore.getState().selectedDevice.mode).toBe(2);
  });
  test('Clicked on cancel button', () => {
    let currentScreen = '';
    const navState = {
      params: {
        setAuxHold: () => {},
        setUpdateInfo: () => {},
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => {
        currentScreen = page;
      },
      state: navState,
    };

    const rendered = render(
      <Provider store={storeEmHeatEnabled}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );
    const submitComponent = rendered.getByTestId('cancelButton');
    fireEvent(submitComponent, 'press');
    expect(currentScreen).toBe('BCCDashboard');
  });
  test('Clicked on back button', () => {
    let currentScreen = '';
    const navState = {
      params: {
        setAuxHold: () => {},
        setUpdateInfo: () => {},
        createStatusInterval: () => {},
      },
    };
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => {
        currentScreen = page;
      },
      state: navState,
    };

    const rendered = render(
      <Provider store={storeEmHeatEnabled}>
        <ModeSelection navigation={navigation} />,
      </Provider>,
    );
    const submitComponent = rendered.getByTestId('backButton');
    fireEvent(submitComponent, 'press');
    expect(currentScreen).toBe('BCCDashboard');
  });
});
