import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {StyleSheet} from 'react-native';
import BCCDashboardSchedule from '../../src/pages/BCCDashboardSchedule';
import {render, cleanup, fireEvent} from 'react-native-testing-library';
import * as homeOwnerActions from './../../src/store/actions/HomeOwnerActions';
import thunk from 'redux-thunk';
const middlewares = [thunk];
import {createStore, combineReducers, applyMiddleware} from 'redux';
import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';

jest.useFakeTimers();

jest.mock('../../src/components/CustomInputText', () => 'CustomInputText');
jest.mock('../../src/components/CustomText', () => 'CustomText');
jest.mock('../../src/components/ScheduleOption', () => 'ScheduleOption');
jest.mock('../../src/components/Button', () => 'Button');
jest.mock('../../src/components/ModalComponent', () => 'ModalComponent');

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

const mockStore = configureMockStore(middlewares);
const store = mockStore({
  homeOwner: {
    energyData: {},
    deviceList: [],
    selectedDevice: {
      HumiditySetpoint: '50',
      acceleratedHeating: true,
      accesories: [
        {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
        {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
      ],
      alarmHigh: '82',
      alarmLow: '45',
      alertMessage: false,
      autoOn: true,
      auto_time: '1',
      code: '',
      coolingSetpoint: 48,
      coolingTemp: '48.0',
      current: 73,
      d_hour: '1',
      datetime: '2023-08-15 17:55:44',
      deadband: '2.6',
      deviceName: 'Testing Thermostat',
      deviceType: 'BCC101',
      fan: '2',
      fanStatus: '0',
      heatType: '2-3-0',
      heatingSetpoint: 45,
      heatingTemp: '45.0',
      hold: '0',
      humidity: '62',
      id: 2,
      isAccesories: true,
      isAccesoryEnabled: false,
      isAccessoryAdded: '2',
      isConnected: true,
      isFahrenheit: true,
      isMonitoring: null,
      isOn: true,
      isOnSchedule: true,
      isThermostat: true,
      lockDevice: false,
      macId: '34eae7c351e6',
      mode: 2,
      modeName: 'Home',
      paired: false,
      pairedDevice: {macId: ''},
      periodCooling: '48.0',
      periodHeating: '45.0',
      periodHour2: '0',
      periodMinute2: '0',
      power: '0',
      roomTemp: '73.0',
      schedules: [
        {
          default_home: '1',
          limit: '71-81',
          mode: '1',
          model_id: '1',
          name: 'Home',
          state: '1',
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
          mode: '2',
          model_id: '4',
          name: 'Test',
          state: '0',
        },
      ],
      setPoint: 73,
      stage: 3,
      sw: '0',
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

describe('BCC Dashboard scheudle screen', () => {
  test('Component to be defined', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(initialState => [initialState, setState]);
    const tree = renderer
      .create(
        <Provider store={store}>
          <BCCDashboardSchedule
            selectedDevice={{
              HumiditySetpoint: '50',
              acceleratedHeating: true,
              accesories: [
                {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
                {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
              ],
              alarmHigh: '82',
              alarmLow: '45',
              alertMessage: false,
              autoOn: true,
              auto_time: '1',
              code: '',
              coolingSetpoint: 48,
              coolingTemp: '48.0',
              current: 73,
              d_hour: '1',
              datetime: '2023-08-15 17:55:44',
              deadband: '2.6',
              deviceName: 'Testing Thermostat',
              deviceType: 'BCC101',
              fan: '2',
              fanStatus: '0',
              heatType: '2-3-0',
              heatingSetpoint: 45,
              heatingTemp: '45.0',
              hold: '0',
              humidity: '62',
              id: 2,
              isAccesories: true,
              isAccesoryEnabled: false,
              isAccessoryAdded: '2',
              isConnected: true,
              isFahrenheit: true,
              isMonitoring: null,
              isOn: true,
              isOnSchedule: true,
              isThermostat: true,
              lockDevice: false,
              macId: '34eae7c351e6',
              mode: 2,
              modeName: 'Home',
              paired: false,
              pairedDevice: {macId: ''},
              periodCooling: '48.0',
              periodHeating: '45.0',
              periodHour2: '0',
              periodMinute2: '0',
              power: '0',
              roomTemp: '73.0',
              schedules: [
                {
                  default_home: '1',
                  limit: '71-81',
                  mode: '1',
                  model_id: '1',
                  name: 'Home',
                  state: '1',
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
                  mode: '2',
                  model_id: '4',
                  name: 'Test',
                  state: '0',
                },
              ],
              setPoint: 73,
              stage: 3,
              sw: '0',
            }}
            schedules={[
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ]}
            navigation={navigation}
          />
        </Provider>,
      )
      .toJSON();

    expect(tree).toBeDefined();
  });
  test('Component to be rendered', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <BCCDashboardSchedule
            selectedDevice={{
              HumiditySetpoint: '50',
              acceleratedHeating: true,
              accesories: [
                {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
                {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
              ],
              alarmHigh: '82',
              alarmLow: '45',
              alertMessage: false,
              autoOn: true,
              auto_time: '1',
              code: '',
              coolingSetpoint: 48,
              coolingTemp: '48.0',
              current: 73,
              d_hour: '1',
              datetime: '2023-08-15 17:55:44',
              deadband: '2.6',
              deviceName: 'Testing Thermostat',
              deviceType: 'BCC101',
              fan: '2',
              fanStatus: '0',
              heatType: '2-3-0',
              heatingSetpoint: 45,
              heatingTemp: '45.0',
              hold: '0',
              humidity: '62',
              id: 2,
              isAccesories: true,
              isAccesoryEnabled: false,
              isAccessoryAdded: '2',
              isConnected: true,
              isFahrenheit: true,
              isMonitoring: null,
              isOn: true,
              isOnSchedule: true,
              isThermostat: true,
              lockDevice: false,
              macId: '34eae7c351e6',
              mode: 2,
              modeName: 'Home',
              paired: false,
              pairedDevice: {macId: ''},
              periodCooling: '48.0',
              periodHeating: '45.0',
              periodHour2: '0',
              periodMinute2: '0',
              power: '0',
              roomTemp: '73.0',
              schedules: [
                {
                  default_home: '1',
                  limit: '71-81',
                  mode: '1',
                  model_id: '1',
                  name: 'Home',
                  state: '1',
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
                  mode: '2',
                  model_id: '4',
                  name: 'Test',
                  state: '0',
                },
              ],
              setPoint: 73,
              stage: 3,
              sw: '0',
            }}
            schedules={[
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ]}
            navigation={navigation}
          />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('click on add button', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'saveScheduleOnStore');
    const save = jest.spyOn(homeOwnerActions, 'saveSchedule');
    const buttonComponent = rendered.getByTestId('addFrame');

    fireEvent(buttonComponent, 'press');
  });
  test('click on cancel button', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'saveScheduleOnStore');
    const save = jest.spyOn(homeOwnerActions, 'saveSchedule');
    const buttonComponent = rendered.getByTestId('cancelNewSchedule');

    fireEvent(buttonComponent, 'press');
  });

  test('Activate Schedule', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          setUpdateInfo={() => {}}
          createStatusInterval={() => {}}
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'updateSchedule');
    const buttonComponent = rendered.getByTestId('scheduleOption0');

    fireEvent(buttonComponent, 'setSelected');
  });

  test('Delete Schedule', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={realStore}>
        <BCCDashboardSchedule
          setUpdateInfo={() => {}}
          createStatusInterval={() => {}}
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'updateSchedule');
    const buttonComponent = rendered.getByTestId('scheduleOption0');

    let spyOn = jest.spyOn(homeOwnerActions, 'deleteSchedule');

    fireEvent(buttonComponent, 'onDelete');
  });

  test('Set device to No Schedule', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          setUpdateInfo={() => {}}
          createStatusInterval={() => {}}
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'selectNoSchedule');
    const buttonComponent = rendered.getByTestId('noSchedule');

    fireEvent(buttonComponent, 'setSelected');
  });

  test('Add name for new schedule', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          setUpdateInfo={() => {}}
          createStatusInterval={() => {}}
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '4',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const textInputComponent = rendered.getByTestId('newSchedule');

    fireEvent(textInputComponent, 'change', 'testing');
  });
  test('Adding a new schedule', async () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          selectedDevice={{
            HumiditySetpoint: '50',
            acceleratedHeating: true,
            accesories: [
              {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
              {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
            ],
            alarmHigh: '82',
            alarmLow: '45',
            alertMessage: false,
            autoOn: true,
            auto_time: '1',
            code: '',
            coolingSetpoint: 48,
            coolingTemp: '48.0',
            current: 73,
            d_hour: '1',
            datetime: '2023-08-15 17:55:44',
            deadband: '2.6',
            deviceName: 'Testing Thermostat',
            deviceType: 'BCC101',
            fan: '2',
            fanStatus: '0',
            heatType: '2-3-0',
            heatingSetpoint: 45,
            heatingTemp: '45.0',
            hold: '0',
            humidity: '62',
            id: 2,
            isAccesories: true,
            isAccesoryEnabled: false,
            isAccessoryAdded: '2',
            isConnected: true,
            isFahrenheit: true,
            isMonitoring: null,
            isOn: true,
            isOnSchedule: true,
            isThermostat: true,
            lockDevice: false,
            macId: '34eae7c351e6',
            mode: 2,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: '0',
            roomTemp: '73.0',
            schedules: [
              {
                default_home: '1',
                limit: '71-81',
                mode: '1',
                model_id: '1',
                name: 'Home',
                state: '1',
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
                mode: '2',
                model_id: '4',
                name: 'Test',
                state: '0',
              },
            ],
            setPoint: 73,
            stage: 3,
            sw: '0',
          }}
          schedules={[
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '3',
              name: 'Test',
              state: '0',
            },
          ]}
          navigation={navigation}
        />
      </Provider>,
    );
    const saveStore = jest.spyOn(homeOwnerActions, 'saveScheduleOnStore');
    const save = jest.spyOn(homeOwnerActions, 'saveSchedule');
    const buttonComponent = rendered.getByTestId('addNewSchedule');

    fireEvent(buttonComponent, 'press');
  });

  test('real action', () => {
    const navState = {params: {isFahrenheit: true}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const realStore = createStore(
      HomeOwnerReducer,
      {
        energyData: {},
        deviceList: [],
        selectedDevice: {
          HumiditySetpoint: '50',
          acceleratedHeating: true,
          accesories: [
            {id: 0, isEnable: 0, isOn: false, name: 'Dehumidifier'},
            {id: 1, isEnable: 1, isOn: false, name: 'Humidifier'},
          ],
          alarmHigh: '82',
          alarmLow: '45',
          alertMessage: false,
          autoOn: true,
          auto_time: '1',
          code: '',
          coolingSetpoint: 48,
          coolingTemp: '48.0',
          current: 73,
          d_hour: '1',
          datetime: '2023-08-15 17:55:44',
          deadband: '2.6',
          deviceName: 'Testing Thermostat',
          deviceType: 'BCC101',
          fan: '2',
          fanStatus: '0',
          heatType: '2-3-0',
          heatingSetpoint: 45,
          heatingTemp: '45.0',
          hold: '0',
          humidity: '62',
          id: 2,
          isAccesories: true,
          isAccesoryEnabled: false,
          isAccessoryAdded: '2',
          isConnected: true,
          isFahrenheit: true,
          isMonitoring: null,
          isOn: true,
          isOnSchedule: true,
          isThermostat: true,
          lockDevice: false,
          macId: '34eae7c351e6',
          mode: 2,
          modeName: 'Home',
          paired: false,
          pairedDevice: {macId: ''},
          periodCooling: '48.0',
          periodHeating: '45.0',
          periodHour2: '0',
          periodMinute2: '0',
          power: '0',
          roomTemp: '73.0',
          schedules: [
            {
              default_home: '1',
              limit: '71-81',
              mode: '1',
              model_id: '1',
              name: 'Home',
              state: '1',
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
              mode: '2',
              model_id: '3',
              name: 'Test',
              state: '0',
            },
          ],
          setPoint: 73,
          stage: 3,
          sw: '0',
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
      applyMiddleware(thunk),
    );
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardSchedule
          selectedDevice={realStore.getState().selectedDevice}
          schedules={realStore.getState().selectedDevice.schedules}
          navigation={navigation}
        />
      </Provider>,
    );

    const saveStore = jest
      .spyOn(homeOwnerActions, 'saveScheduleOnStore')
      .mockImplementationOnce(_ =>
        realStore.dispatch(
          homeOwnerActions.saveScheduleOnStore({
            deviceId: '34eae7c351e6',
            modelId: `4`,
            mode: '2',
            state: '0',
            limit: '71-82',
            name: 'testing',
            unit: 'F',
            data: {
              //unit: `${selectedDevice.isFahrenheit ? 'F' : 'C'}`,
              items1: [{t: '78.0-70.0', c: '0', h: '0'}],
              items2: [{t: '78.0-70.0', c: '0', h: '0'}],
              items3: [{t: '78.0-70.0', c: '0', h: '0'}],
              items4: [{t: '78.0-70.0', c: '0', h: '0'}],
              items5: [{t: '78.0-70.0', c: '0', h: '0'}],
              items6: [{t: '78.0-70.0', c: '0', h: '0'}],
              items7: [{t: '78.0-70.0', c: '0', h: '0'}],
            },
          }),
        ),
      );
    saveStore();
    const save = jest.spyOn(homeOwnerActions, 'saveSchedule');

    expect(realStore.getState().selectedDevice.schedules.length).toEqual(4);
  });
});
