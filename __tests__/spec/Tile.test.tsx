import 'react-native';
import React from 'react';
import {Tile} from '../../src/components';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import * as HomeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
import {createStore, combineReducers} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import AuthReducer from './../../src/store/reducers/AuthReducer';

import RN from 'react-native';
import {applyMiddleware} from 'redux';

jest
  .spyOn(RN.Animated, 'FlatList', 'get')
  .mockImplementation(() => RN.FlatList);

jest.mock('@react-native-community/blur', () => ({
  redirect: jest.fn(),
}));

jest.mock('aws-amplify', () => ({
  redirect: jest.fn(),
}));

jest.useFakeTimers();
const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
  auth: AuthReducer,
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
    auth: {
      user: '',
    },
  },
  applyMiddleware(thunk),
);

const mockStore = configureMockStore();
const store = mockStore(
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
  },
  applyMiddleware(thunk),
);

describe('Tile to display appliances component', () => {
  it('Component to be rendered on Cool mode', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Tile
            deviceName="Testing"
            deviceType="BCC 100"
            isThermostat={true}
            isOn={true}
            tileFunction={() => {}}
            mode={1}
            deleteFunction={() => {}}
            macId="test"
            navigation={null}
            heatingSetpoint={80}
            coolingSetpoint={85}
            paired={true}
            pairedDevice={{macId: 'test'}}
            pairFunctionality={false}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  it('Component to be rendered on Heat mode', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Tile
            deviceName="Testing"
            deviceType="BCC 100"
            isThermostat={true}
            isOn={true}
            tileFunction={() => {}}
            mode={2}
            deleteFunction={() => {}}
            macId="test"
            navigation={null}
            heatingSetpoint={80}
            coolingSetpoint={85}
            paired={true}
            pairedDevice={{macId: 'test'}}
            pairFunctionality={false}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  it('Component to be rendered on Em Heat mode', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Tile
            deviceName="Testing"
            deviceType="BCC 100"
            isThermostat={true}
            isOn={true}
            tileFunction={() => {}}
            mode={4}
            deleteFunction={() => {}}
            macId="test"
            navigation={null}
            heatingSetpoint={80}
            coolingSetpoint={85}
            paired={true}
            pairedDevice={{macId: 'test'}}
            pairFunctionality={false}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  it('Component to be rendered on Auto mode', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <Tile
            deviceName="Testing"
            deviceType="BCC 100"
            isThermostat={true}
            isOn={true}
            tileFunction={() => {}}
            mode={3}
            deleteFunction={() => {}}
            macId="test"
            navigation={null}
            heatingSetpoint={80}
            coolingSetpoint={85}
            paired={true}
            pairedDevice={{macId: 'test'}}
            pairFunctionality={false}
          />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });
  it('Go to dashboard', () => {
    let currentPage = '';
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => (currentPage = page),
      goBack: jest.fn(),
      state: navState,
    };
    const tree = render(
      <Provider store={realStoreDHour0}>
        <Tile
          deviceName="Testing"
          deviceType="BCC 100"
          isThermostat={true}
          isOn={true}
          tileFunction={() => {}}
          mode={3}
          deleteFunction={() => {}}
          macId="test"
          navigation={navigation}
          heatingSetpoint={80}
          coolingSetpoint={85}
          paired={true}
          pairedDevice={{macId: 'test'}}
          pairFunctionality={false}
        />
      </Provider>,
    );
    let button = tree.getByTestId('GoToDashboard');
    fireEvent(button, 'press');
    jest.spyOn(HomeOwnerActions, 'selectBcc');
    expect(currentPage).toBe('BCCDashboard');
  });

  it('Go to usage', () => {
    let currentPage = '';
    const navState = {params: {newPeriod: 1, selectedDay: 0, edit: false}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => (currentPage = page),
      goBack: jest.fn(),
      state: navState,
    };
    const tree = render(
      <Provider store={realStoreDHour0}>
        <Tile
          deviceName="Testing"
          deviceType="IDS Premium Connected"
          isThermostat={false}
          isOn={true}
          tileFunction={() => {}}
          mode={3}
          deleteFunction={() => {}}
          macId="test"
          navigation={navigation}
          heatingSetpoint={80}
          coolingSetpoint={85}
          paired={true}
          pairedDevice={{macId: 'test'}}
          pairFunctionality={false}
        />
      </Provider>,
    );
    let button = tree.getByTestId('GoToDashboard');
    fireEvent(button, 'press');
    jest.spyOn(HomeOwnerActions, 'updateIdsSelectedDeviceAccess');
    jest.spyOn(HomeOwnerActions, 'updateSelectedIdsOdu');
    expect(currentPage).toBe('Usage');
  });
});
