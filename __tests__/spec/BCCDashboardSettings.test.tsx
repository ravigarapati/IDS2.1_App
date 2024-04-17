import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import BCCDashboardSettings from '../../src/pages/BCCDashboardSettings';
import {render, cleanup, fireEvent} from 'react-native-testing-library';

jest.useFakeTimers();

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
    deviceInformation: {
      deviceId: 'test',
      hd: '1.2.3',
      model: 'BCC100',
      sw: '1.2.3',
    },
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
    deviceType: 'BCC100',
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

const storeMissingDeviceInfo = mockStore({
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
    deviceInformation: {
      deviceId: undefined,
      hd: undefined,
      model: undefined,
      sw: undefined,
    },
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
    deviceType: 'BCC100',
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

const storeEmptyDeviceInfo = mockStore({
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
    deviceInformation: {
      deviceId: '',
      hd: '',
      model: '',
      sw: '',
    },
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
    deviceType: 'BCC100',
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

describe('BCC Dashboard settings screen (BCC100)', () => {
  test('Component to be defined', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <BCCDashboardSettings
            selectedDevice={{deviceType: 'BCC50'}}
            navigation={navigation}
          />
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
          <BCCDashboardSettings
            selectedDevice={{deviceType: 'BCC50'}}
            navigation={navigation}
          />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  test('Go to Temperature screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Temperature');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('Temperature');
  });
  test('Go to Date Time screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Date & Time');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('DateTime');
  });
  test('Go to Location screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Location');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('Location');
  });
  test('Go to Lock screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Lock Screen');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('LockScreen');
  });
  test('Go to Appliance Pairing screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Appliance Pairing');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('AppliancePairing');
  });

  test('Click on Device information screen (BCC100) without info', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={storeEmptyDeviceInfo}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    //expect(currentScreen).toBe('DeviceInformation');
  });

  test('Click on Device information screen (BCC50) without info', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={storeEmptyDeviceInfo}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    //expect(currentScreen).toBe('DeviceInformation');
  });

  test('Click on Device information screen (BCC100) without info', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={storeMissingDeviceInfo}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    //expect(currentScreen).toBe('DeviceInformation');
  });

  test('Click on Device information screen (BCC50) without info', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={storeMissingDeviceInfo}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    //expect(currentScreen).toBe('DeviceInformation');
  });

  test('Go to Device information screen (BCC100)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC100'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('DeviceInformation');
  });

  test('Go to Device information screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Device Information');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('DeviceInformation');
  });

  test('Go to temperature screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Temperature');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('Temperature');
  });

  test('Go to Date Time screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Date & Time');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('DateTime');
  });

  test('Go to location screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Location');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('Location');
  });

  test('Go to Screen config screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Screen');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('ScreenSettings');
  });

  test('Go to Runtime screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Runtime');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('RuntimeSettings');
  });

  test('Go to Advanced Settings screen (BCC50)', () => {
    let currentScreen = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: newScreen => {
        currentScreen = newScreen;
      },
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSettings
          selectedDevice={{deviceType: 'BCC50'}}
          navigation={navigation}
        />
      </Provider>,
    );
    let button = rendered.getByTestId('Advanced Settings');
    fireEvent(button, 'press');
    expect(currentScreen).toBe('ScreenAdvancedSettings');
  });
});
