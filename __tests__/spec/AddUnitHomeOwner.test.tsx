import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import AddUnitHomeOwner from '../../src/pages/AddUnitHomeowner';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);

const rootReducer = combineReducers({
  homeOwner: HomeOwnerReducer,
});

const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: 'Heat Pump',
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

describe('Adding New Unit HomeOwner Side', () => {
  let navState, navigation, navigation2, rendered, navState2, rendered2;

  beforeEach(() => {
    navState = {
      params: {
        showBackButton: true,
        addAnother: true,
      },
    };
    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: jest.fn(),
    };
    rendered = render(
      <Provider store={store}>
        <AddUnitHomeOwner navigation={navigation} />
      </Provider>,
    );
  });

  test('To be Defined', () => {
    expect(rendered).toBeDefined();
  });

  test('Test Heat Pump Events', () => {
    //const DropDownHeatPump = rendered.getByTestId('openModal');
    //fireEvent(DropDownHeatPump, 'press');
    const TypeDevice = rendered.getByTestId('typeDevice');
    fireEvent(TypeDevice, 'press');
    const optionsHeatPump = rendered.getByTestId('testHeatPump');
    fireEvent(optionsHeatPump, 'pressOut');
    const HeatPump = rendered.getByTestId('openModal');
    fireEvent(HeatPump, 'press');
    const DM = rendered.getByTestId('DMBCC');
    fireEvent(DM, 'press');
    const Submit = rendered.getByTestId('Submit');
    fireEvent(Submit, 'press');
    const Cancel = rendered.getByTestId('Cancel');
    fireEvent(Cancel, 'press');
  });

  test('Test Events Thermostat', () => {
    //const DropDownHeatPump = rendered.getByTestId('openModal');
    //fireEvent(DropDownHeatPump, 'press');
    const DropDownHeatPump = rendered.getByTestId('typeDevice');
    fireEvent(DropDownHeatPump, 'press');
    const optionsThermostat = rendered.getByTestId('testThermostat');
    fireEvent(optionsThermostat, 'pressOut');
    const ModalBCC = rendered.getByTestId('ModalBCC');
    fireEvent(ModalBCC, 'press');
    const DM = rendered.getByTestId('DMBCC');
    fireEvent(DM, 'press');
    const CheckCancel = rendered.getByTestId('Cancel');
    fireEvent(CheckCancel, 'press');
    const goBack = rendered.getByTestId('goBack');
    fireEvent(goBack, 'press');
  });

  test('Test Menu Actions', () => {
    navState2 = {
      params: {
        showBackButton: false,
        addAnother: true,
      },
    };
    navigation2 = {
      state: navState2,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: jest.fn(),
    };
    rendered2 = render(
      <Provider store={store}>
        <AddUnitHomeOwner navigation={navigation2} />
      </Provider>,
    );
    expect(rendered2).toBeDefined();
  });
});
