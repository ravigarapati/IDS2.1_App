import 'react-native';
import React, { useState as useStateMock } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { render, cleanup, fireEvent, act } from 'react-native-testing-library';
import thunk from 'redux-thunk'
import ScreenAdvancedSettings2 from '../../src/pages/ScreenAdvancedSettings2';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as homeOwnerActions from '../../src/store/actions/HomeOwnerActions';
import HomeOwnerReducer from '../../src/store/reducers/HomeOwnerReducer';

const rootReducer = combineReducers({
    homeOwner: HomeOwnerReducer,
});

const store = createStore(
    rootReducer,
    {
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
            type:1,
            screen:1,
            s_time:1,
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
  
          ],
        },
    },
    applyMiddleware(thunk),
  );
  
  const storeC = createStore(
    rootReducer,
    {
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
            isFahrenheit: false,
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
            type:1,
            screen:1,
            s_time:1,
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
  
          ],
        },
    },
    applyMiddleware(thunk),
  );
  
const fakeNavigation = {
    navigate: jest.fn(),
};

let component;

describe('ScreenAdvancedSettings2 screen', () => {

    beforeEach(() => {
        component = render(
            <Provider store={store}>
                <ScreenAdvancedSettings2 navigation={fakeNavigation} />
            </Provider>
        )
    })

    it('Render ScreenAdvancedSettings2 screen in Farenheit', () => {
        expect(component).toBeDefined();
    });

    it('Render ScreenAdvancedSettings2 screen in Celsius', () => {
        let component2 = render(
            <Provider store={storeC}>
              <ScreenAdvancedSettings2 navigation={fakeNavigation} />
            </Provider>
          )

        expect(component2).toBeDefined();
    });


    test('Change On', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('On');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change On Elec', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('OnElec');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Off', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('Off');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Min Run Time', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('MinRunTime');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change AntiShortCycle', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('AntiShortCycle');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Cycle Time', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('CycleTime');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Heating', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('Heating');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Cooling', () => {
        const setAdccessSettings = jest.spyOn(
            homeOwnerActions,
            'setAdccessSettings',
        );
        const OffsetWheel = component.getByTestId('Cooling');
        act(() => {
            fireEvent(OffsetWheel, 'confirm');
        })
        setAdccessSettings();
    });

    test('Change Tab to InstallerTab and Return to SystemTab', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()
        const tab2 = component.getByTestId('TabSystem');
        fireEvent(tab2, 'press');
    });


    test('Change Tab to InstallerTab', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()
    });

    it('Insert incorrect code in Installer', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, '123');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeFalsy
      });


      it('Insert correct code navigate to DeadBand', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'DB');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('DeadBandScreen')
      });

      
      it('Insert correct code navigate to Relative Humidity Hysteresis', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'HSD');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('RelativeHumidityHysteresisScreen')
      });

      
      it('Insert correct code navigate to Sensivity Level', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'SS');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('SensivityLevelScreen')
      });

      
      it('Insert correct code navigate to StagingScreen', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'ST');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('StagingScreen')
      });

      
      it('Insert correct code navigate to Unit Configuration', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'UC');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('UnitConfiguration')
      });

      
      it('Insert correct code navigate to Sensor Calibration', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'SC');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('SensorCalibration')
      });

      
      it('Insert correct code navigate to Humidity Calibration', () => {
        const tab = component.getByTestId('TabInstaller');
        fireEvent(tab, 'press');
        const View = component.getByTestId("InstallerView")
        expect(View).toBeDefined()

        const input = component.getByTestId("CodeTextInput")
        act(() => {
          fireEvent.changeText(input, 'HC');
          jest.advanceTimersByTime(100);
        })
        expect(fakeNavigation.navigate).toBeCalledWith('HumidityCalibration')
      });
    

});


