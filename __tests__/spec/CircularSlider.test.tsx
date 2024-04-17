import 'react-native';
import React from 'react';
import CircularSlider from './../../src/components/CircularSlider';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import * as HomeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
import {createStore, combineReducers} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import AuthReducer from './../../src/store/reducers/AuthReducer';

const mockStore = configureMockStore();
const store = mockStore({
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

describe('Tile to display appliances component', () => {
  for (let i = 45; i < 100; i++) {
    it('Component to be rendered on Cool mode', () => {
      const tree = renderer
        .create(
          <Provider store={store}>
            <CircularSlider
              mode={'Cooling'}
              layoutWidth={700}
              width={700 * 0.8}
              height={700 * 0.8}
              textColorInnerCircle="#FFF"
              cooling={320}
              coolingTemp={'80.0'}
              updateTemperature={() => {}}
              currentTemp={i}
              fahrenheit={true}
              onCoolingChange={value => {}}
              onAuxCoolingChange={value => {}}
              onCoolingRelease={value => {}}
              auxCooling={'80.0'}
            />
          </Provider>,
        )
        .toJSON();
      expect(tree).toBeDefined();
    });
  }

  for (let i = 7; i < 38; i++) {
    it('Component to be rendered on Cool mode (Celcius)', () => {
      const tree = renderer
        .create(
          <Provider store={store}>
            <CircularSlider
              mode={'Cooling'}
              layoutWidth={700}
              width={700 * 0.8}
              height={700 * 0.8}
              textColorInnerCircle="#FFF"
              cooling={320}
              coolingTemp={'80.0'}
              updateTemperature={() => {}}
              currentTemp={i}
              fahrenheit={false}
              onCoolingChange={value => {}}
              onAuxCoolingChange={value => {}}
              onCoolingRelease={value => {}}
              auxCooling={'80.0'}
            />
          </Provider>,
        )
        .toJSON();
      expect(tree).toBeDefined();
    });
  }
});
