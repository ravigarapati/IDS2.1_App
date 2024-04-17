import 'react-native';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import AddPeriod from '../../src/pages/AddPeriod';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
const middlewares = [thunk];
import {createStore, combineReducers, applyMiddleware} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';

jest.useFakeTimers();

jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/BoschIcon', () => 'BoschIcon');
jest.mock('../../src/components/CustomWheelPicker', () => 'CustomWheelPicker');

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
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

const storeDHour0 = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      d_hour: '0',
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

const realStoreDHour0 = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
        d_hour: '0',
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

const realStore = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
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

const realStoreC = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
        d_hour: '1',
        isFahrenheit: false,
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

const realStoreCDB6 = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
        d_hour: '1',
        isFahrenheit: false,
        deadband: 6,
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

const storeCelcius = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      d_hour: '1',
      isFahrenheit: false,
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

describe('Add Period screen', () => {
  test('Component to be defined', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddPeriod navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  test('Component to be rendered on fahrenheit', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddPeriod navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Component to be rendered on 12 hour format', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={storeDHour0}>
          <AddPeriod navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Component to be rendered on celcius', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
    };

    const rendered = render(
      <Provider store={realStoreC}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    expect(
      realStoreC.getState().homeOwner.selectedDevice.isFahrenheit,
    ).toBeFalsy();
  });

  test('Going back', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const onUpdateMock = jest.fn();
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: jest.fn(),
      state: navState,
    };
    const rendered = render(
      <Provider store={store}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('goBack');

    fireEvent(buttonComponent, 'press');
    expect(navigation.goBack).toHaveBeenCalled();
  });
  test('submit Button', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'addPeriod')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.addPeriod({
            selected: 1,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );

    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    const rendered = render(
      <Provider store={realStore}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');

    addSpy();
    expect(realStore.getState().homeOwner.scheduleInfo['items1'].length).toBe(
      2,
    );
  });
  test('submit Button (edit)', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 1, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStore}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');
    addSpy();
    expect(realStore.getState().homeOwner.scheduleInfo['items2'][0].t).toBe(
      '70.0-60.0',
    );
  });

  test('submit Button (edit 2)', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 1, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStoreCDB6}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');
    addSpy();
    expect(realStore.getState().homeOwner.scheduleInfo['items2'][0].t).toBe(
      '70.0-60.0',
    );
  });

  test('submit Button (edit with current under 720 minutes)', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 1, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStoreDHour0.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStoreDHour0}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');
    addSpy();
    expect(
      realStoreDHour0.getState().homeOwner.scheduleInfo['items2'][0].t,
    ).toBe('70.0-60.0');
  });

  test('submit Button (edit with current over 720 minutes)', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 3, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStoreDHour0.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStoreDHour0}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');
    addSpy();
    expect(
      realStoreDHour0.getState().homeOwner.scheduleInfo['items2'][0].t,
    ).toBe('70.0-60.0');
  });

  test('Change cool temperature', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 3, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStoreDHour0.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStoreDHour0}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('coolConfirmButton');

    fireEvent(buttonComponent, 'confirm');
    addSpy();
    expect(buttonComponent.props.value).toBe('54°');
  });

  test('Change heat temperature', () => {
    const navState = {params: {newPeriod: 1, selectedDay: 3, edit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
      goBack: () => {},
      state: navState,
    };
    const addSpy = jest
      .spyOn(homeOwnerActions, 'editPeriod')
      .mockImplementationOnce(_ =>
        realStoreDHour0.dispatch(
          homeOwnerActions.editPeriod({
            selected: 2,
            periodNumber: 0,
            info: {
              c: '0',
              t: `${73}.0-${63}.0`,
              h: '120',
            },
          }),
        ),
      );
    const saveSpy = jest.spyOn(homeOwnerActions, 'saveSchedule');
    act;
    const rendered = render(
      <Provider store={realStoreDHour0}>
        <AddPeriod navigation={navigation} />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('heatConfirmButton');

    fireEvent(buttonComponent, 'confirm');
    addSpy();
    expect(buttonComponent.props.value).toBe('45°');
  });
});
