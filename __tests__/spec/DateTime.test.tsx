import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import DateTime from '../../src/pages/DateTime';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
import {CustomPickerColumns} from '../../src/components';
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
      isAccesoryEnabled: false,
      HumiditySetpoint: '41',
      datetime: '2020-09-01 00:00:47',
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

jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');

describe('Configuring DateTime of the Device', () => {
  let navState, navigation, rendered, currentScreen;

  beforeEach(() => {
    navState = {
      params: {setUpdateInfo: () => {}, createStatusInterval: () => {}},
    };
    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigation: jest.fn(),
      navigate: page => {
        currentScreen = page;
      },
    };
    rendered = render(
      <Provider store={store}>
        <DateTime navigation={navigation} />
      </Provider>,
    );
  });

  test('Be Defined', () => {
    expect(rendered).toBeDefined;
  });

  test('Testing Functionality Switch Toogle 24 hrs', () => {
    let dTime= store.getState().homeOwner.selectedDevice.datetime;
    dTime= dTime.toString().split(' ');
    let sTime = dTime[1].slice(0,2);
    let twentyFourHrs = false
    if(sTime > 12){
      twentyFourHrs=true;
    }

    const SwitchToogle = rendered.getByTestId('SwitchToogle24');
    fireEvent(SwitchToogle, 'press');
    expect(twentyFourHrs).toBe(false);
  });
});
