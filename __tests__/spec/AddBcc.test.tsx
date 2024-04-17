import 'react-native';
import React from 'react';
import AddBcc from './../../src/pages/AddBcc';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {
  render,
  cleanup,
  fireEvent,
  act,
  waitFor,
} from 'react-native-testing-library';
import thunk from 'redux-thunk';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as homeOwnerActions from '../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from '../../src/store/reducers/HomeOwnerReducer';
jest.useFakeTimers();

jest.mock('../../src/components/CodeScanner', () => 'CodeScanner');
jest.mock('../../src/components/DeviceAdded', () => 'DeviceAdded');

jest.mock('../../src/components/CustomToast', () => 'CustomToast');
jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');
jest.mock('../../src/components/Radiobutton', () => 'Radiobutton');
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock'),
);
jest.mock('@react-native-clipboard/clipboard', () => 'Clipboard');
jest.mock('../../src/components/CustomText', () => 'CustomText');
jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/CustomInputText', () => 'CustomInputText');
jest.mock('../../src/components/BoschIcon', () => 'BoschIcon');
jest.mock('../../src/components/CustomPicker', () => 'CustomPicker');
jest.mock(
  '../../src/components/CustomAutoCompleteInput',
  () => 'CustomAutoCompleteInput',
);

jest.mock('react-native-permissions', () => 'PERMISSIONS');
jest.mock('react-native-permissions', () => 'request');
jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
);

const middlewares = [thunk];

const mockStore = configureMockStore(middlewares);
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
  auth: {
    user: {
      attributes: {
        sub: '',
      },
    },
  },
});

describe('AddBcc Screen', () => {
  it('Component to be defined', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const component = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );
    expect(component).toBeDefined();
  });

  it('Flow of BCC50', async () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const component = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );
    expect(component).toBeDefined();

    const ViewLocation = component.getByTestId('ViewLocation');
    expect(ViewLocation).toBeDefined();

    const DeviceLocationInput = component.getByTestId('DeviceLocationInput');
    act(() => {
      fireEvent(DeviceLocationInput, 'onChange', 'DeviceName');
    });

    const UnitedStatesRadioButton = component.getByTestId(
      'UnitedStatesRadioButton',
    );
    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const CanadaRadioButton = component.getByTestId('CanadaRadioButton');
    act(() => {
      fireEvent(CanadaRadioButton, 'handleCheck');
    });

    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const LocationSugestionInput = component.getByTestId(
      'LocationSugestionInput',
    );
    fireEvent(LocationSugestionInput, 'additionalFunction', 'Los Osos');
    fireEvent(
      LocationSugestionInput,
      'setValue',
      'Los Osos High School, 6001 Milliken Ave, Rancho Cucamonga, CA 91737, United States',
    );

    const ButtonNext = component.getByTestId('ButtonConfirmLocationNext');
    act(() => {
      fireEvent(ButtonNext, 'press');
    });

    const ViewMakeSureWifi = component.getByTestId('ViewMakeSureWifi');
    expect(ViewMakeSureWifi).toBeDefined();

    const NextMakeSureWifi = component.getByTestId('NextMakeSureWifi');
    act(() => {
      fireEvent(NextMakeSureWifi, 'press');
    });

    const ViewSSID_and_Password = component.getByTestId(
      'ViewSSID_and_Password',
    );
    expect(ViewSSID_and_Password).toBeDefined();

    const wifiSSID_input = component.getByTestId('wifiSSID_input');
    act(() => {
      fireEvent(wifiSSID_input, 'onChange', 'WifiHome');
    });

    const wifiPassword_input = component.getByTestId('wifiPassword_input');
    act(() => {
      fireEvent(wifiPassword_input, 'onChange', '123');
    });

    const NextSSIDandPassword = component.getByTestId('NextSSIDandPassword');
    act(() => {
      fireEvent(NextSSIDandPassword, 'press');
    });

    const ViewOptionScanQr = component.getByTestId('ViewOptionScanQr');
    expect(ViewOptionScanQr).toBeDefined();

    const ButtonToOpenModalHelpFindQr = component.getByTestId(
      'ButtonToOpenModalHelpFindQr',
    );
    act(() => {
      fireEvent(ButtonToOpenModalHelpFindQr, 'press');
    });

    const ModalHelpFindQr = component.getByTestId('ModalHelpFindQr');
    expect(ModalHelpFindQr).toBeDefined();

    const CloseModalHelpFindQr = component.getByTestId('CloseModalHelpFindQr');
    act(() => {
      fireEvent(CloseModalHelpFindQr, 'press');
    });

    const ButtonOpenScanQr = component.getByTestId('ButtonOpenScanQr');
    expect(ButtonOpenScanQr).toBeDefined();
    act(() => {
      fireEvent(ButtonOpenScanQr, 'onPress');
    });

    let qrScannerView;
    waitFor(() => {
      qrScannerView = component.getByTestId('qrScannercvfvevView');
      expect(qrScannerView).toBeDefined();
    });
  });

  it('Flow of BCC50 skip ssid and password', async () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const component = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );
    expect(component).toBeDefined();

    const ViewLocation = component.getByTestId('ViewLocation');
    expect(ViewLocation).toBeDefined();

    const DeviceLocationInput = component.getByTestId('DeviceLocationInput');
    act(() => {
      fireEvent(DeviceLocationInput, 'onChange', 'DeviceName');
    });

    const UnitedStatesRadioButton = component.getByTestId(
      'UnitedStatesRadioButton',
    );
    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const CanadaRadioButton = component.getByTestId('CanadaRadioButton');
    act(() => {
      fireEvent(CanadaRadioButton, 'handleCheck');
    });

    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const LocationSugestionInput = component.getByTestId(
      'LocationSugestionInput',
    );
    fireEvent(LocationSugestionInput, 'additionalFunction', 'Los Osos');
    fireEvent(
      LocationSugestionInput,
      'setValue',
      'Los Osos High School, 6001 Milliken Ave, Rancho Cucamonga, CA 91737, United States',
    );

    const ButtonNext = component.getByTestId('ButtonConfirmLocationNext');
    act(() => {
      fireEvent(ButtonNext, 'press');
    });

    const ViewMakeSureWifi = component.getByTestId('ViewMakeSureWifi');
    expect(ViewMakeSureWifi).toBeDefined();

    const SkipMakeSureWifi = component.getByTestId('SkipMakeSureWifi');
    act(() => {
      fireEvent(SkipMakeSureWifi, 'press');
    });

    const ViewOptionScanQr = component.getByTestId('ViewOptionScanQr');
    expect(ViewOptionScanQr).toBeDefined();

    const ButtonToOpenModalHelpFindQr = component.getByTestId(
      'ButtonToOpenModalHelpFindQr',
    );
    act(() => {
      fireEvent(ButtonToOpenModalHelpFindQr, 'press');
    });

    const ModalHelpFindQr = component.getByTestId('ModalHelpFindQr');
    expect(ModalHelpFindQr).toBeDefined();

    const CloseModalHelpFindQr = component.getByTestId('CloseModalHelpFindQr');
    act(() => {
      fireEvent(CloseModalHelpFindQr, 'press');
    });

    const ButtonOpenScanQr = component.getByTestId('ButtonOpenScanQr');
    expect(ButtonOpenScanQr).toBeDefined();
    act(() => {
      fireEvent(ButtonOpenScanQr, 'onPress');
    });

    let qrScannerView;
    waitFor(() => {
      qrScannerView = component.getByTestId('qrScannercvfvevView');
      expect(qrScannerView).toBeDefined();
    });
  });

  it('Flow of BCC100 - to be defined', async () => {
    const navState = {params: {device: 'BCC100'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const component = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );
    expect(component).toBeDefined();
  });

  it('BCC101 add flow - Manual Entry', async () => {
    const navState = {params: {device: 'BCC100'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );

    const manualEntryButton = rendered.getByTestId('manualEntryButton');
    fireEvent(manualEntryButton, 'press');

    const macIdField = rendered.getByTestId('macIdField');
    const tvcField = rendered.getByTestId('tvcField');
    expect(macIdField).toBeDefined();
    expect(tvcField).toBeDefined();
  });

  it('BCC101 add flow - QR Scan', () => {
    const navState = {params: {device: 'BCC100'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );

    const ButtonOpenScanQr = rendered.getByTestId('ButtonOpenScanQr');
    fireEvent(ButtonOpenScanQr, 'press');

    const qrScannerView = rendered.getByTestId('qrScannerView');
    expect(qrScannerView).toBeDefined();
  });

  it('BCC101 add flow - Update firmware Screen', async () => {
    const navState = {params: {device: 'BCC100'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <AddBcc navigation={navigation} />
      </Provider>,
    );

    const manualEntryButton = rendered.getByTestId('manualEntryButton');
    fireEvent(manualEntryButton, 'press');

    const macIdField = rendered.getByTestId('macIdField');
    fireEvent(macIdField, 'onChange', '34eae7c30538');

    const tvcField = rendered.getByTestId('tvcField');
    fireEvent(tvcField, 'onChange', '1234');

    const submitManualEntry = rendered.getByTestId('submitManualEntry');
    fireEvent(submitManualEntry, 'press');

    const updateFirmwareAction = rendered.getByTestId('updateFirmwareAction');
    fireEvent(updateFirmwareAction, 'press');

    const updateButtonInModal = rendered.getByTestId('updateButtonInModal');
    fireEvent(updateButtonInModal, 'press');

    const ViewLocation = rendered.getByTestId('ViewLocation');
    expect(ViewLocation).toBeDefined();

    const DeviceLocationInput = rendered.getByTestId('DeviceLocationInput');
    act(() => {
      fireEvent(DeviceLocationInput, 'onChange', 'DeviceName');
    });

    const UnitedStatesRadioButton = rendered.getByTestId(
      'UnitedStatesRadioButton',
    );
    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const CanadaRadioButton = rendered.getByTestId('CanadaRadioButton');
    act(() => {
      fireEvent(CanadaRadioButton, 'handleCheck');
    });

    act(() => {
      fireEvent(UnitedStatesRadioButton, 'handleCheck');
    });

    const LocationSugestionInput = rendered.getByTestId(
      'LocationSugestionInput',
    );
    fireEvent(LocationSugestionInput, 'additionalFunction', 'Los Osos');
    fireEvent(
      LocationSugestionInput,
      'setValue',
      'Los Osos High School, 6001 Milliken Ave, Rancho Cucamonga, CA 91737, United States',
    );

    const ButtonNext = rendered.getByTestId('ButtonConfirmLocationNext');
    act(() => {
      fireEvent(ButtonNext, 'press');
    });

    expect(updateButtonInModal).toBeDefined();
  });
});
