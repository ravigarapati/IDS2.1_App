import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {StyleSheet} from 'react-native';
import DeadBandScreen from './../../src/pages/DeadBandScreen';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
const middlewares = [thunk];
import {createStore, combineReducers, applyMiddleware} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as apiCalls from './../../src/store/actions/CommonActions';

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

const realStoreCelcius = createStore(
  rootReducer,
  {
    homeOwner: {
      energyData: {},
      deviceList: [],
      selectedDevice: {
        lockDevice: false,
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

describe('DeadBand screen', () => {
  test('Rendered screen on fahrenheit mode', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={realStore}>
          <DeadBandScreen />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Rendered screen on celcius mode', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={realStoreCelcius}>
          <DeadBandScreen />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Change deadband', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const calledFunction = jest.fn();

    const rendered = render(
      <Provider store={realStore}>
        <DeadBandScreen />
      </Provider>,
    );

    const setAdccessSettings = jest.spyOn(
      homeOwnerActions,
      'setAdccessSettings',
    );

    const setDeadBand = rendered.getByTestId('setDeadBand');
    fireEvent(setDeadBand, 'confirm');

    setAdccessSettings();
  });

  test('Render component', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const calledFunction = jest.fn();

    const rendered = render(
      <Provider store={realStore}>
        <DeadBandScreen />
      </Provider>,
    );
  });
});
