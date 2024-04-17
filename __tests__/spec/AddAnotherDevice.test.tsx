import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import AddAnotherDevice from '../../src/pages/AddAnotherDevice';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, cleanup, fireEvent} from 'react-native-testing-library';

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
});

describe('Add Another Device screen', () => {
  test('Component to be defined', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddAnotherDevice />
        </Provider>,
      )
      .toJSON();
    expect(tree).toBeDefined();
  });

  test('Component to be rendered', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <AddAnotherDevice />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Click on add Another button', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => {
        currentScreen = page;
      },
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <AddAnotherDevice
          navigation={navigation}
          userFirstLogin={value => {}}
        />
      </Provider>,
    );
    const buttonComponent = rendered.getByTestId('submit');

    fireEvent(buttonComponent, 'press');
    //expect(buttonComponent);
    expect(currentScreen).toBe('Add');
  });

  test('Click on cancel button', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => {
        currentScreen = page;
      },
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <AddAnotherDevice
          navigation={navigation}
          userFirstLogin={value => {}}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('cancel');
    fireEvent(cancelComponent, 'press');
    expect(currentScreen).toBe('HomeTabs');
  });
});
