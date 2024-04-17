import 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {render, fireEvent} from 'react-native-testing-library';
import HomeOwnerLanding from '../../src/pages/HomeOwnerLanding';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
const middlewares = [thunk];

jest.useFakeTimers();

jest.mock('../../src/components/Tile', () => 'Tile');
jest.mock('../../src/components/BoschIcon', () => 'BoschIcon');
jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/CustomText', () => 'CustomText');
jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');

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
    weatherInfo: {
      current: 20,
      forecaseInfo: [
        {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_clear_cloudy_day', max: 20, min: 9},
        {conditionCode: 'ic_weather_sunny_clear_day', max: 23, min: 10},
        {conditionCode: 'ic_weather_cloudy_day', max: 24, min: 13},
        {conditionCode: 'ic_weather_rainy_day', max: 24, min: 13},
        {conditionCode: 'ic_weather_clear_cloudy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_clear_cloudy_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_clear_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_cloudy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_cloudy_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_over_cloudy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_over_cloudy_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_rainy_thunderstorm_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_rainy_snowy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_rainy_snowy_night', max: 20, min: 13},
        {
          conditionCode: 'ic_weather_rainy_thunderstorm_night',
          max: 20,
          min: 13,
        },
        {conditionCode: 'ic_weather_rainy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_rainy_night', max: 20, min: 13},
        {
          conditionCode: 'ic_weather_snowy_thunderstorm_night',
          max: 20,
          min: 13,
        },
        {conditionCode: 'ic_weather_snowy_thunderstorm_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_snowy_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_snowy_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_thunderstorm_night', max: 20, min: 13},
        {conditionCode: 'ic_weather_thunderstorm_day', max: 20, min: 13},
      ],
      weatherCode: 'ic_weather_cloudy_day',
    },
    weatherInfoLocation: {city: 'Watertown'},
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
      {
        id: 5,
        macId: '399A-716-827827-8733955691',
        deviceName: 'HeatPumpDemo',
        deviceType: 'IDS Arctic',
        isThermostat: false,
        isOn: false,
        isMonitoring: true,
        setPoint: null,
        current: null,
        mode: null,
        energySaveMode: true,
        savingModeState: '2',
        paired: false,
        pairedDevice: {macId: ''},
        oduModelNumber: '399A-716-827827-8733958900',
        oduInstallationAddress: {
          address: {
            zipCode: '93402',
            country: 'United States',
            state: 'CA',
            address2: '',
            city: 'Los Osos',
            address1: 'Los Osos',
          },
          latitude: '35.31481',
          longitude: '-120.831085',
        },
        contractorMonitoringStatus: true,
      },
    ],
  },
  auth: {
    user: {
      attributes: {
        name: 'Testing',
      },
    },
  },
});

const store2 = mockStore({
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
    actualWeatherOnFahrenheit: false,
    hapticVibration: true,
    _24HrsFormatSelected: false,
    location: 'Alabaster',
    updatedSelectedDevice: false,
    weatherInfo: {
      current: 20,
      forecaseInfo: [
        {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 13},
        {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 9},
        {conditionCode: 'ic_weather_sunny_clear_day', max: 23, min: 10},
        {conditionCode: 'ic_weather_cloudy_day', max: 24, min: 13},
      ],
      weatherCode: 'ic_weather_cloudy_day',
    },
    weatherInfoLocation: {city: 'Watertown'},
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
      {
        id: 5,
        macId: '399A-716-827827-8733955691',
        deviceName: 'HeatPumpDemo',
        deviceType: 'IDS Arctic',
        isThermostat: false,
        isOn: false,
        isMonitoring: true,
        setPoint: null,
        current: null,
        mode: null,
        energySaveMode: true,
        savingModeState: '1',
        paired: false,
        pairedDevice: {macId: ''},
        oduModelNumber: '399A-716-827827-8733958900',
        oduInstallationAddress: {
          address: {
            zipCode: '93402',
            country: 'United States',
            state: 'CA',
            address2: '',
            city: 'Los Osos',
            address1: 'Los Osos',
          },
          latitude: '35.31481',
          longitude: '-120.831085',
        },
        contractorMonitoringStatus: true,
      },
    ],
  },
  auth: {
    user: {
      attributes: {
        name: 'Testing',
      },
    },
  },
});

const weatherArray = [
  'ic_weather_clear_cloudy_day',
  'ic_weather_clear_cloudy_night',
  'ic_weather_clear_night',
  'ic_weather_cloudy_day',
  'ic_weather_cloudy_night',
  'ic_weather_over_cloudy_day',
  'ic_weather_over_cloudy_night',
  'ic_weather_rainy_thunderstorm_day',
  'ic_weather_rainy_snowy_day',
  'ic_weather_rainy_snowy_night',
  'ic_weather_rainy_thunderstorm_night',
  'ic_weather_rainy_day',
  'ic_weather_rainy_night',
  'ic_weather_snowy_thunderstorm_night',
  'ic_weather_snowy_thunderstorm_day',
  'ic_weather_snowy_day',
  'ic_weather_snowy_night',
  'ic_weather_sunny_clear_day',
  'ic_weather_thunderstorm_night',
  'ic_weather_thunderstorm_day',
];

describe('Home Owner Landing Screen', () => {
  let navState, navigation, rendered, rendered2,currentScreen;
  beforeEach(() => {
    const UnitAndHapticSpy = jest.spyOn(
      homeOwnerActions,
      'getTempUnitAndHaptic',
    );

    navState = {
      params: {createStatusInterval: () => {}, setUpdateInfo: () => {}},
    };

    navigation = {
      state: navState,
      getParam: (key, val) => navState?.params[key] ?? val,
      //navigate: () => jest.fn(),
      navigate: page =>{
        currentScreen = page
      }
    };

    rendered = render(
      <Provider store={store}>
        <HomeOwnerLanding getFaqList={null} navigation={navigation} />
      </Provider>,
    );
  });

  test('To be Defined', () => {
    expect(rendered).toBeDefined();
  });

  test('Testing AddNewDevice Event', () => {
    const AddDevice = rendered.getByTestId('AddNewDevice');
    fireEvent(AddDevice, 'press');
    expect(currentScreen).toBe('Add');
  });

  test('Testing setEnergyModal Event', () => {
    const energyModal = rendered.getByTestId('SetEnergyModal');
    fireEvent(energyModal, 'press');
  });

  test('Testing Weather', () => {
    const Weather = rendered.getByTestId('WeatherEvents');
    fireEvent(Weather, 'press');
    const setOpened = rendered.getByTestId('setOpened');
    fireEvent(setOpened, 'press');
  });

  test('Testing EditLocation', () => {
    const EditLocation = rendered.getByTestId('EditLocation');
    fireEvent(EditLocation, 'press');
    expect(currentScreen).toBe('EditLocation');
  });

  test('Testing End event', () => {
    const EndEvent = rendered.getByTestId('EndEvent');
    fireEvent(EndEvent, 'press');
  });

  test('Testing differentModeState..', () => {
    for (let i = 0; i < 3; i++) {
      let storex = mockStore({
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
          weatherInfo: {
            current: 20,
            forecaseInfo: [
              {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 13},
              {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 9},
              {conditionCode: 'ic_weather_sunny_clear_day', max: 23, min: 10},
              {conditionCode: 'ic_weather_cloudy_day', max: 24, min: 13},
            ],
            weatherCode: 'ic_weather_cloudy_day',
          },
          weatherInfoLocation: {city: 'Watertown'},
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
            {
              id: 5,
              macId: '399A-716-827827-8733955691',
              deviceName: 'HeatPumpDemo',
              deviceType: 'IDS Arctic',
              isThermostat: false,
              isOn: false,
              isMonitoring: true,
              setPoint: null,
              current: null,
              mode: null,
              energySaveMode: true,
              savingModeState: i.toString(),
              paired: false,
              pairedDevice: {macId: ''},
              oduModelNumber: '399A-716-827827-8733958900',
              oduInstallationAddress: {
                address: {
                  zipCode: '93402',
                  country: 'United States',
                  state: 'CA',
                  address2: '',
                  city: 'Los Osos',
                  address1: 'Los Osos',
                },
                latitude: '35.31481',
                longitude: '-120.831085',
              },
              contractorMonitoringStatus: true,
            },
          ],
        },
        auth: {
          user: {
            attributes: {
              name: 'Testing',
            },
          },
        },
      });
      rendered2 = render(
        <Provider store={storex}>
          <HomeOwnerLanding getFaqList={null} navigation={navigation} />
        </Provider>,
      );
    }
  });

  test('Testing different Weather Info..', () => {
    for (let i = 0; i < weatherArray.length; i++) {
      let storeWeather = mockStore({
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
          weatherInfo: {
            current: 20,
            forecaseInfo: [
              {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 13},
              {conditionCode: 'ic_weather_sunny_clear_day', max: 20, min: 9},
              {conditionCode: 'ic_weather_sunny_clear_day', max: 23, min: 10},
              {conditionCode: 'ic_weather_cloudy_day', max: 24, min: 13},
            ],
            weatherCode: weatherArray[i],
          },
          weatherInfoLocation: {city: 'Watertown'},
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
            {
              id: 5,
              macId: '399A-716-827827-8733955691',
              deviceName: 'HeatPumpDemo',
              deviceType: 'IDS Arctic',
              isThermostat: false,
              isOn: false,
              isMonitoring: true,
              setPoint: null,
              current: null,
              mode: null,
              energySaveMode: true,
              savingModeState: i.toString(),
              paired: false,
              pairedDevice: {macId: ''},
              oduModelNumber: '399A-716-827827-8733958900',
              oduInstallationAddress: {
                address: {
                  zipCode: '93402',
                  country: 'United States',
                  state: 'CA',
                  address2: '',
                  city: 'Los Osos',
                  address1: 'Los Osos',
                },
                latitude: '35.31481',
                longitude: '-120.831085',
              },
              contractorMonitoringStatus: true,
            },
          ],
        },
        auth: {
          user: {
            attributes: {
              name: 'Testing',
            },
          },
        },
      });
      rendered2 = render(
        <Provider store={storeWeather}>
          <HomeOwnerLanding getFaqList={null} navigation={navigation} />
        </Provider>,
      );
    } 
  });
});
