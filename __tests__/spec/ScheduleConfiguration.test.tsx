import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import Schedule from '../../src/pages/ScheduleConfiguration';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
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
      isAccesoryEnabled: false,
      HumiditySetpoint: '41',
      schedules: [
        {
          model_id: '1',
          default_home: '1',
          state: '1',
          name: 'Home',
          mode: '1',
          limit: '71-81',
        },
        {
          model_id: '2',
          default_home: '1',
          state: '0',
          name: 'Vacation',
          mode: '1',
          limit: '71-81',
        },
        {
          limit: '71-82',
          mode: 2,
          model_id: '3',
          name: 'testSch',
          state: '0',
          data: {
            items1: [{t: '78.0-70.0', c: '0', h: '0'}],
            items2: [{t: '78.0-70.0', c: '0', h: '0'}],
            items3: [{t: '78.0-70.0', c: '0', h: '0'}],
            items4: [{t: '78.0-70.0', c: '0', h: '0'}],
            items5: [{t: '78.0-70.0', c: '0', h: '0'}],
            items6: [{t: '78.0-70.0', c: '0', h: '0'}],
            items7: [{t: '78.0-70.0', c: '0', h: '0'}],
          },
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
      items2: [{c: '0', h: '0', t: '78.0-70.0'}],
      items3: [{c: '0', h: '0', t: '78.0-70.0'}],
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

describe('Configuring the Schedules', () => {
  let navState, navigation, rendered;
  beforeEach(() => {
    navState = {
      params: {new: false, setUpdateInfo: () => {}},
    };

    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: () => jest.fn(),
      goBack: jest.fn()
    };

    rendered = render(
      <Provider store={store}>
        <Schedule navigation={navigation} />
      </Provider>,
    );
  });

  test('Component to be defined', () => {
    expect(rendered).toBeDefined();
  });
  
  test('Testing Add Period', () => {
    const AddPeriodButton = rendered.getByTestId('AddPeriod');
    fireEvent(AddPeriodButton, 'press');
    const SaveButton = rendered.getByTestId('SaveButton');
    fireEvent(SaveButton, 'press');
    const Delete = rendered.getByTestId('Delete');
    fireEvent(Delete, 'press');
    const CancelB = rendered.getByTestId('CancelB');
    fireEvent(CancelB, 'press');
    const CopyButton = rendered.getByTestId('CopyButton');
    fireEvent(CopyButton, 'press');
  });

  test('Testing Add Period', () => {
    const goBack = rendered.getByTestId('goBackButton');
    fireEvent(goBack, 'press');
  });

});
