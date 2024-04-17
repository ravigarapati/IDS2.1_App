import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import EditLocation from '../../src/pages/EditLocation';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/CustomInputText', () => 'CustomInputText');
jest.mock('../../src/components/CustomText', () => 'CustomText');

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
    locationSuggestions: [
      {
        PlaceId:
          'AQABAFMAKZmJqReTuJvQ0SYSvNXBFPnTNre8NpZN_vO5ppVBiIVKMWyFo7U_23WZIEB3jBaCX9aLHNHy6gHy6QyfVv1o8QfoXctScRaEWzssnUy2A7vSsswLy5wkja6Jfp6hQXlv4QvGMRLRNcLPAogsltpxpywjew',
        Text: 'New York, NY, United States',
      },
      {
        Text: 'New York Fries',
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
  auth: {},
});

describe('Edit Location screen', () => {
  test('Component to be defined', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <EditLocation navigation={navigation} />
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
          <EditLocation navigation={navigation} />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test('Click on cancel button', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      navigate: screen => (currentScreen = screen),
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = render(
      <Provider store={store}>
        <EditLocation navigation={navigation} />
      </Provider>,
    );
    let cancelButton = tree.getByTestId('cancel');
    fireEvent(cancelButton, 'press');

    expect(currentScreen).toBe('HomeTabs');
  });

  test('Input new location', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      navigate: screen => (currentScreen = screen),
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = render(
      <Provider store={realStore}>
        <EditLocation navigation={navigation} />
      </Provider>,
    );
    let location = tree.getByTestId('location');
    fireEvent(location, 'change', 'New York');
    jest
      .spyOn(homeOwnerActions, 'getLocationSuggestions')
      .mockReturnValueOnce({});
    jest.spyOn(homeOwnerActions, 'updateLocation').mockReturnValueOnce({
      deviceAddress: {
        city: 'Sagaponack',
        country: 'United States',
        state: 'New York',
        zipcode: '11962',
      },
      message: 'Operation succeed',
      weatherLocation: {latitude: 40.94298, longitude: -72.27131},
    });

    let suggestion = tree.getByTestId('suggestion');
    fireEvent(suggestion, 'press');

    let submit = tree.getByTestId('submit');
    fireEvent(submit, 'press');
    expect(location.props.value).toBe('New York');
  });

  test('Input new location (onPressIn)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      navigate: screen => (currentScreen = screen),
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = render(
      <Provider store={realStore}>
        <EditLocation navigation={navigation} />
      </Provider>,
    );
    let location = tree.getByTestId('location');
    fireEvent(location, 'change', 'New York');
    jest
      .spyOn(homeOwnerActions, 'getLocationSuggestions')
      .mockReturnValueOnce({});
    jest.spyOn(homeOwnerActions, 'updateLocation').mockReturnValueOnce({
      deviceAddress: {
        city: 'Sagaponack',
        country: 'United States',
        state: 'New York',
        zipcode: '11962',
      },
      message: 'Operation succeed',
      weatherLocation: {latitude: 40.94298, longitude: -72.27131},
    });

    let suggestion = tree.getByTestId('suggestion');
    fireEvent(suggestion, 'press');

    let submit = tree.getByTestId('submit');
    fireEvent(submit, 'press');
    expect(location.props.value).toBe('New York');
  });

  test('Input new location (onPressIn)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      navigate: screen => (currentScreen = screen),
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = render(
      <Provider store={realStore}>
        <EditLocation navigation={navigation} />
      </Provider>,
    );
    let location = tree.getByTestId('location');
    fireEvent(location, 'change', 'New York');
    jest
      .spyOn(homeOwnerActions, 'getLocationSuggestions')
      .mockReturnValueOnce({});
    jest.spyOn(homeOwnerActions, 'updateLocation').mockReturnValueOnce({
      deviceAddress: {
        city: 'Sagaponack',
        country: 'United States',
        state: 'New York',
        zipcode: '11962',
      },
      message: 'Operation succeed',
      weatherLocation: {latitude: 40.94298, longitude: -72.27131},
    });

    let suggestion = tree.getByTestId('suggestion');
    fireEvent(suggestion, 'onPressIn');

    let submit = tree.getByTestId('submit');
    fireEvent(submit, 'press');
  });

  test('Input new location (onPressOut)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      navigate: screen => (currentScreen = screen),
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = render(
      <Provider store={realStore}>
        <EditLocation navigation={navigation} />
      </Provider>,
    );
    let location = tree.getByTestId('location');
    fireEvent(location, 'change', 'New York');
    jest
      .spyOn(homeOwnerActions, 'getLocationSuggestions')
      .mockReturnValueOnce({});
    jest.spyOn(homeOwnerActions, 'updateLocation').mockReturnValueOnce({
      deviceAddress: {
        city: 'Sagaponack',
        country: 'United States',
        state: 'New York',
        zipcode: '11962',
      },
      message: 'Operation succeed',
      weatherLocation: {latitude: 40.94298, longitude: -72.27131},
    });

    let suggestion = tree.getByTestId('suggestion');
    fireEvent(suggestion, 'onPressOut');

    let submit = tree.getByTestId('submit');
    fireEvent(submit, 'press');
    expect(location.props.value).toBe('New York');
  });
});
