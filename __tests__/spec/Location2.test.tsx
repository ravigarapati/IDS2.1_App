import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import Location from '../../src/pages/Location2';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
const middlewares = [thunk];

//const mockStore = configureMockStore();
const mockStore = configureMockStore(middlewares);

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
      location: '13601,Watertown,New York,United States',
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

describe('Setup and modify the Location of the user', () => {
  let navState, navigation, rendered;

  beforeEach(() => {
    navState = {
      params: {},
    };
    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: jest.fn(),
    };

    rendered = render(
      <Provider store={store}>
        <Location navigation={navigation} />
      </Provider>,
    );
  });

  test('To be Defined', () => {
    expect(rendered).toBeDefined();
  });

  test('Firing Edition Location Event', () => {
    //jest.mock('../../src/components/RadioButton', () => 'Radiobutton');
    const Edition = rendered.getByTestId('EditionPressable');
    fireEvent(Edition, 'press');
    const imageEdit = rendered.getByTestId('ImageEdit');
    expect(imageEdit).toBeDefined();
    const RadioUSA = rendered.getByTestId('RadioButtonUSA');
    fireEvent(RadioUSA, 'press');
  });

  test('Firing SaveChanges Events', () => {
    const Edition = rendered.getByTestId('EditionPressable');
    fireEvent(Edition, 'press');
    const SaveButton = rendered.getByTestId('SaveChanges');
    fireEvent(SaveButton, 'press');
    const imageEdit = rendered.getByTestId('ImageEdit');
    expect(imageEdit).toBeDefined();
  });

  test('Testing InputText Change Events', () => {
    //jest.mock('../../src/components/RadioButton', () => 'Radiobutton');
    const changeState = rendered.getByTestId('txtState');
    fireEvent(changeState, 'change', 'Boston');
    const changeCity = rendered.getByTestId('txtCity');
    fireEvent(changeCity, 'change', 'New York');
    const changeZC = rendered.getByTestId('txtZipCode');
    fireEvent(changeZC, 'change', '06700');
    const changeCountry = rendered.getByTestId('txtCountry');
    fireEvent(changeCountry, 'change', 'United States');
  });

  test('Testing InputText Change Events Edition', () => {
    //jest.mock('../../src/components/RadioButton', () => 'Radiobutton');
    const Edition = rendered.getByTestId('EditionPressable');
    fireEvent(Edition, 'press');
   // const changeCountry = rendered.getByTestId('txtCountry');
    //fireEvent(changeCountry, 'change', 'United States');
    //const changeComplete = rendered.getByTestId('txtCompleteLocation');
    const changeComplete = rendered.queryByTestId('txtCompleteLocation')
   //fireEvent(changeComplete, 'change', 'Watertown');
    const changeCityEdit = rendered.getByTestId('txtCityEdit');
    fireEvent(changeCityEdit, 'change', 'New York');
    const changeZCEdit = rendered.getByTestId('txtZipCodeEdit');
    fireEvent(changeZCEdit, 'change', '06700');
    const radioCanada = rendered.getByTestId('radioCanada');
    fireEvent(radioCanada, 'press');
    const cancelButton = rendered.getByTestId('Cancel');
    fireEvent(cancelButton, 'press');
  });
});
