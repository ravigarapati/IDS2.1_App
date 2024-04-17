import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import Accesories from '../../src/pages/Accesories';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
const middlewares = [thunk];

//const mockStore = configureMockStore();
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      macId: '34eae7c30538',
      isAccessoryAdded: 1,
      isAccesoryEnabled: true,
      HumiditySetpoint: '41',
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
        {
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
        },
      ],
    },
  },
  applyMiddleware(thunk),
);

jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');

describe('Adding an Accesory', () => {
  let navState, navigation, rendered, currentScreen;
  beforeEach(() => {
    navState = {
      params: {createStatusInterval: () => {}, setUpdateInfo: () => {}},
    };

    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      // navigate: page => page,
      // navigate: () => jest.fn(),
      navigate: page => {
        currentScreen = page;
      },
      goBack: () => jest.fn(),
    };

    rendered = render(
      <Provider store={store}>
        <Accesories navigation={navigation} />
      </Provider>,
    );
  });

  test('Component to be defined', () => {
    expect(rendered).toBeDefined();
  });

  test('Go to add another device screen', () => {
    // const accesoryValues = jest.spyOn(homeOwnerActions, 'updateAccesoryValues');

    const calledFunction = jest.fn();

    const addSpy = jest
      .spyOn(homeOwnerActions, 'updateAccesoryValues')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.updateAccesoryValues(
            {
              device_id: '34eae7c351e6',
              timestamp: new Date().valueOf().toString(),
              t_humidity: '0-1-1',
            },
            calledFunction,
          ),
        ),
      );

    const buttonComponent = rendered.getByTestId('Submit');
    const cancelComponent = rendered.getByTestId('Cancel');
    const buttonConfirm= rendered.getByTestId('ConfirmModal');
    const activateModal= rendered.getByTestId('activateModal');
    const goBackArrow= rendered.getByTestId('goBackArrow');
    fireEvent(buttonComponent, 'press');
    fireEvent(cancelComponent, 'press');
    fireEvent(buttonConfirm, 'press');
    fireEvent(activateModal, 'press');
    fireEvent(goBackArrow, 'press');

    addSpy();
    expect(
      realStore.getState().homeOwner.deviceList2[0].accesories[0].isEnable,
    ).toBe(0);
  });

  test('Testing SwitchToogle functionality', () => {
    const SwitchToogle = rendered.getByTestId('SwitchToogle');
    fireEvent(SwitchToogle, 'press');
  });

  test('Testing Modal Cancel Action', () => {
    const Cancel = rendered.getByTestId('CancelModal');
    fireEvent(Cancel, 'press');
    expect(currentScreen).toBe('BCCDashboard');
  });
});
