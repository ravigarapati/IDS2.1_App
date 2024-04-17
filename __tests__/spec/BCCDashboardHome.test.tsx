import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {StyleSheet} from 'react-native';
import BCCDashboardHome from '../../src/pages/BCCDashboardHome';
import {render, cleanup, fireEvent} from 'react-native-testing-library';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout').mockImplementation(callback => {
  if (typeof callback === 'function') {
    callback();
  }
  return {hasRef: () => false} as NodeJS.Timeout;
});

const mockStore = configureMockStore();
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

const styles = StyleSheet.create({
  justifyContentCenter: {justifyContent: 'center'},
  width97Percent: {width: '100%'},
  checkWifiImage: {alignSelf: 'center', marginTop: 12},
  marginTop37: {marginTop: 37},
  marginTop49: {marginTop: 49},
  minusIconStyle: {marginRight: 100, paddingVertical: 12},
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#A8ADB2',
    justifyContent: 'space-between',
    height: 63,
    marginHorizontal: 16,
  },
  marginHorizontal16: {
    marginHorizontal: 16,
  },
  scheduleSection: {
    marginTop: 17,
    borderTopWidth: 1,
    borderBottomWidth: 1,

    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 12,
    borderTopColor: '#C1C7CC',
    borderBottomColor: '#C1C7CC',
  },
  tabElement: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  confirmationPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  marginHorizontal10: {marginHorizontal: 10},
  emHeatIcon: {
    marginHorizontal: 3,
  },
  offThermostatIcon: {
    height: 18,
    width: 18,
    marginHorizontal: 3,
  },
  scheduleChangeConfirmation: {
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 12,
    borderTopColor: '#C1C7CC',
    borderBottomColor: '#C1C7CC',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonsSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  flexDirectionRow: {flexDirection: 'row'},
  bottomButton: {
    backgroundColor: '#E0E2E5',
    paddingHorizontal: 650 * 0.11,
    paddingVertical: 13,
    marginHorizontal: 650 * 0.02,
  },
  connectedFan: {
    position: 'absolute',
    left: 63,
    top: 30,
    borderRadius: 50,
    height: 10,
    width: 10,
    backgroundColor: '#4CD964',
  },
  stageStyle: {position: 'absolute', left: 70, top: 22},
  alignItemsCenter: {alignItems: 'center'},
  alignSelfCenter: {alignSelf: 'center'},
});

describe('BCC Dashboard Home screen', () => {
  test('Component to be defined', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
    };
    const tree = renderer
      .create(
        <Provider store={store}>
          <BCCDashboardHome
            renderThermostatChart={() => {}}
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
            styles={styles}
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
          <BCCDashboardHome
            renderThermostatChart={() => {}}
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
            styles={styles}
            navigation={navigation}
          />
        </Provider>,
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
  test('Cancel hold schedule under heat mode, mode equal to "0"', () => {
    let newHoldValue = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={value => {
            newHoldValue = value;
          }}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
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
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('cancelHold');
    fireEvent(cancelComponent, 'press');
    expect(newHoldValue).toBe('0');
  });
  test('Cancel hold schedule under cool mode', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    let newHoldValue = '';
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={value => {
            newHoldValue = value;
          }}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
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
            mode: 1,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('cancelHold');
    fireEvent(cancelComponent, 'press');
    expect(newHoldValue).toBe('0');
  });
  test('Cancel hold schedule under auto mode', () => {
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
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
            mode: 3,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('cancelHold');
    fireEvent(cancelComponent, 'press');
  });
  test('Unlock thermostat from lock button on dashboard', () => {
    let deviceToUnlock = '';
    let lockValue = false;
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
          createStatusInterval={() => {}}
          updateLockDevice={(input, callback) => {
            deviceToUnlock = input.deviceId;
            lockValue = input.lockDevice;
            callback();
          }}
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
            lockDevice: true,
            macId: '34eae7c351e6',
            mode: 3,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('unlockDevice');
    fireEvent(cancelComponent, 'press');
    expect(deviceToUnlock).toBe('34eae7c351e6');
    expect(lockValue).toBeFalsy();
  });

  test('Decrease temp by minus button', () => {
    let actionToExecute = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          height={800}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
          createStatusInterval={() => {}}
          updateLockDevice={() => {}}
          humidity={45}
          updateTermperature={action => {
            actionToExecute = action;
          }}
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
            lockDevice: true,
            macId: '34eae7c351e6',
            mode: 3,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('decreaseByMinusButton');
    fireEvent(cancelComponent, 'press');
    expect(actionToExecute).toBe('substract');
  });
  test('Increate temp by plus button', () => {
    let actionToExecute = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={false}
          height={700}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
          createStatusInterval={() => {}}
          updateLockDevice={() => {}}
          humidity={45}
          updateTermperature={action => {
            actionToExecute = action;
          }}
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
            lockDevice: true,
            macId: '34eae7c351e6',
            mode: 3,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('increaseByPlusButton');
    fireEvent(cancelComponent, 'press');
    expect(actionToExecute).toBe('add');
  });
  test('Cancel schedule on hold = 2', () => {
    let cancelScheduleFunction = jest.fn();
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'2'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={() => {}}
          updatedSchedule={true}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
          setCooling={() => {}}
          setCoolingTemp={() => {}}
          setCurrentCooling={() => {}}
          createStatusInterval={() => {}}
          updateLockDevice={() => {}}
          humidity={45}
          updateTermperature={() => {}}
          cancelScheduleChange={cancelScheduleFunction}
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
            lockDevice: true,
            macId: '34eae7c351e6',
            mode: 3,
            heatSelected: true,
            modeName: 'Home',
            paired: false,
            pairedDevice: {macId: ''},
            periodCooling: '48.0',
            periodHeating: '45.0',
            periodHour2: '0',
            periodMinute2: '0',
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('cancelHold2');
    fireEvent(cancelComponent, 'press');
    expect(cancelScheduleFunction).toHaveBeenCalled();
  });
  test('Click on hold button (equal to 1)', () => {
    let newHoldValue = '';
    const navState = {params: {device: 'BCC50'}};
    const navigation = {
      getParam: (key, val) => navState?.params[key] ?? val,
      navigate: page => page,
    };
    const onSubmit = jest.fn();
    const rendered = render(
      <Provider store={store}>
        <BCCDashboardHome
          hold={'1'}
          setHeatingTemp={() => {}}
          setHeating={() => {}}
          setCurrentHeating={() => {}}
          setChangedHeating={() => {}}
          updateThermostatTemperature={value => {
            newHoldValue = value.hold;
          }}
          updatedSchedule={false}
          changedCooling={false}
          changedHeating={false}
          renderThermostatChart={() => {}}
          setUpdateInfo={() => {}}
          power={true}
          coolingTemp={10}
          currentTemp={80}
          selectTemperature={() => {}}
          heating={20}
          divisor={1}
          plus={1}
          cooling={20}
          heatingTemp={10}
          setUpdateSchedule={() => {}}
          setHold={() => {}}
          setAuxHold={() => {}}
          setChangedCooling={() => {}}
          returnAuxValue={() => {}}
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
            isAccessoryAdded: 2,
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
            power: true,
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
          styles={styles}
          navigation={navigation}
        />
      </Provider>,
    );
    const cancelComponent = rendered.getByTestId('holdButtonEqual1');
    fireEvent(cancelComponent, 'press');
    expect(newHoldValue).toBe('2');
  });
});
