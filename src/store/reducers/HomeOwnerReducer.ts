import {
  ENERGY_USAGE_DATA,
  SELECTED_DEVICE,
  SELECTED_IDS_DEVICE,
  SELECTED_IDS_DEVICE_TYPE,
  CLEAN_SELECTED_IDS_DEVICE_TYPE,
  DEVICE_STATUS,
  DEVICE_DETAILS,
  DEVICE_DETAILS2,
  HEAT_PUMP_INFO,
  UPDATE_HEAT_PUMP_INFO,
  RELOAD_HEAT_PUMP_INFO,
  NO_RELOAD_HEAT_PUMP_INFO,
  ADD_NEW_UNIT,
  DEVICE_LIST,
  EDIT_UNIT_INFO,
  UPDATE_MONITORING_STATUS,
  NOTIFICATION_LIST,
  UPDATE_HOMEOWNER_NOTIFICATIONS,
  UPDATE_HOMEOWNERCOUNT,
  CLEAR_HOMEOWNERCOUNT,
  ADDNEWNOTIFICATION,
  FAQ_LIST,
  UNREAD_HOMEOWNER_NOTIFICATION,
  UPDATE_TERMS_AND_CONDITIONS_FLAG,
  PREV_SELECTED_DEVICE,
  UPDATE_HO_ANALYTICS_VALUE,
  UPDATE_SELECTED_UNITNAME,
  USER_FIRST_LOGIN,
  ACTUAL_WEATHER_TYPE,
  EDIT_DEVICE,
  DELETE_DEVICE,
  UPDATE_WEATHER_ON_FAHRENHEIT,
  UPDATE_LOCATION,
  UPDATE_VIBRATION,
  UPDATE_THERMOSTAT_TEMP,
  UPDATE_THERMOSTAT_MODE,
  UPDATE_SCHEDULES,
  SAVE_SCHEDULE,
  UPDATE_SELECTED_SCHEDULE,
  UPDATE_SCHEDULE,
  UPDATE_SELECTED_SCHEDULE_FULL,
  REMOVE_PERIOD,
  ADD_PERIOD,
  EDIT_PERIOD,
  SAVE_SCHEDULE_ON_STORE,
  UPDATE_SCHEDULE_INFO,
  UPDATE_DEVICE_STATUS_INFO,
  DELETE_SCHEDULE,
  SELECT_NO_SCHEDULE,
  ADD_NEW_DEVICE,
  UPDATE_SELECTED_ACCESORY,
  UPDATE_DEVICE_INFORMATION,
  UPDATE_LOCK_DEVICE,
  UPDATE_TEMPERATURE_SETTINGS,
  REMOVE_SELECTED_DEVICE_INFO,
  THERMOSTAT_SELECTED,
  UPDATE_SELECTED_DEVICE_INFO_BASED_ON_RESPONSE,
  UPDATE_TEMPERATURE_UNIT,
  GET_DEVICE_LIST,
  DELETE_APPLIANCE,
  REMOVE_DEVICE_PAIRING,
  UPDATE_FAN_MODE,
  UPDATE_FAN_ON_FOR,
  UPDATE_FAN_OFF_FOR,
  UPDATE_SCHEDULED_START,
  UPDATE_SCHEDULED_END,
  PERMISSION_CONTRACTOR_MONITORING_STATUS_ACCEPT,
  PERMISSION_CONTRACTOR_MONITORING_STATUS_DENIED,
  WEATHER_INFO,
  LOCATION_SUGGESTIONS,
  UPDATE_LOCATION_SETTINGS,
  UPDATE_DATETIME_SETTINGS,
  UPDATE_LOCATION_PLACEID,
  UPDATE_DATETIME_TIMEZONE,
  SAVE_DATE_BCC50,
  SAVE_TIME_BCC50,
  SCHEDULE_SELECTED_BCC50,
  SAVE_SCHEDULE_BCC50,
  UPDATE_INFO_UNIT_CONFIGURATION,
  RESET_INFO_UNIT_CONFIGURATION,
  SELECTED_IDS,
  UTILITY_ENERGY_SAVINGS,
  GET_UTILITY_ENERGY_SAVINGS,
  SELECT_BCC,
  TEMP_LOCATION,
  NEW_DEVICE_INFO,
  PREV_BCC,
  PAIR_DEVICES,
  SELECTED_IDS_ODU,
  UNPAIR_DEVICES,
  ADD_SCHEDULE_ONBOARDING,
  RESET_SCHEDULE_ONBOARDING,
  SELECT_NO_SCHEDULE_ONBOARDING,
  DELETE_SCHEDULE_ONBOARDING,
  UPDATE_SCHEDULE_ONBOARDING,
  ADD_PERIOD_ONBOARDING,
  REMOVE_PERIOD_ONBOARDING,
  EDIT_PERIOD_ONBOARDING,
  SET_DEVICE_NAME_ONBOARDING,
  SET_LOCATION_ONBOARDING,
  UPDATE_BCC50_MACID,
  PAIR_SELECTED_DEVICES,
  PAIR_UNPAIR,
  UPDATE_DEVICE_LIST,
  REMOVE_NOTIFICATION,
  TEMP_UNIT_AND_HAPTIC,
  UPDATE_HAPTIC,
  MARK_NOTIFICATION_READ,
  RESOURCE_STATUS,
  REMOVE_BANNER,
  DEVICE_LIST_DELETING,
  SET_IS_ONBOARDING_BCC50,
  SET_INFO_UNIT_CONFIGURATION_NO_ONBOARDING,
  UPDATE_INFO_UNIT_CONFIGURATION_NO_ONBOARDING,
  CLEAN_SELECTED_DEVICE,
  SET_SKIP_UNIT_CONFIGURATION_ONBOARDING,
  SET_IS_ONBOARDING_BCC101,
  UPDATE_COUNTER,
  UPDATE_DEVICE_STATUS_INFO_SHEDULE,
  DEVICE_LIST_COUNTER,
  RESET_COUNTER,
  SET_UNIT_NAME_IDS,
} from '../labels/HomeOwnerLabels';
import {
  ONLY_WEATHER_INFO,
  PLACE_ID_INFORMATION,
} from '../labels/NotificationLabels';
const initialState = {
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
  newScheduleBCC50: {
    deviceLocation: '',
    unitConfig: '',
    timestamp: '',
    schedule: '',
  },
  programedSchedulesBCC50: <any>[],
  prevSelectedDevice: {},
  deviceStatus: {},
  deviceInformation: {},
  deviceDetails: {},
  heatPumpInfo: {},
  reloadHeatPumpInfo: false,
  notificationList: [],
  lastKey: {},
  notificationsCount: 0,
  serviceStartDate: '',
  lastUpdated: null,
  isTermsConditionsAccepted: null,
  hoUserAnalytics: null,
  selectedUnitName: {},
  isThermostatSelected: true,
  isUserFirstLogin: true,
  actualWeatherOnFahrenheit: true,
  hapticVibration: true,
  _24HrsFormatSelected: false,
  isFahrenheit: false,
  location: 'Alabaster, Alabama, United States',
  scheduleUpdate: {},
  loadedInfoCounter: 0,
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
  BCC50macID: '',
  idsEnergyUsageEvent: false,
  idsEnergyUsateStartTime: '',
  idsEventStatus: '',
  idsEventAbbreviation: '',
  idsEventEndTime: '',
  tempLocation: '',
  newDeviceInfo: {},
  previousBcc: '',
  dateBCC50: '',
  timeBCC50: '',
  scheduleSelectedBCC50: '',
  scheduleBCC50Response: '',
  infoUnitConfiguration: {},
  infoUnitConfigurationNoOnboarding: {},
  schedulesOnBoarding: [],
  locationOnboarding: {},
  nameDeviceOnboarding: '',
  isOnboardingBcc50: false,
  isOnboardingBcc101: false,
  skipUnitConfigurationOnboarding: false,
  deviceListCounter: 0,
  unitNameIds: '',
  deviceList2: [
    /*{
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
    },*/
  ],
};

const handleDeviceListInfo = deviceList => {
  let newDeviceList: Array<object> = [];
  deviceList.map((d, i) => {
    if (d.memo) {
      newDeviceList.push({
        id: i,
        macId: d.gatewayId,
        deviceName: d.memo + ' Thermostat',
        deviceType: d.deviceType
          ? d.deviceType.includes('BCC10')
            ? 'BCC100'
            : d.deviceType
          : 'BCC100',
        isThermostat: true,
        isOn: /*d.power === '4' && */ !d.online ? false : true,
        mode: d.mode
          ? d.power === '4' && d.online
            ? 0
            : parseInt(d.mode)
          : -1,
        setPoint: d.roomTemp ? parseInt(d.roomTemp) : -1,
        heatingSetpoint: d.temp ? parseInt(d.temp.split('-')[1]) : -1,
        coolingSetpoint: d.temp ? parseInt(d.temp.split('-')[0]) : -1,
        current: d.roomTemp ? parseInt(d.roomTemp) : -1,
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
        paired: d.ids_available !== undefined ? true : false,
        pairedDevice: {
          macId: d.ids_available !== undefined ? d.ids_available : '',
        },
      });
    } else if (d.ODUModelNumber) {
      newDeviceList.push({
        id: i,
        //macId: d.ODUSerialNumber,
        macId: d.gatewayId,
        deviceName: d.ODUName,
        deviceType: d.ODUModelNumber.includes('3.0')
          ? 'IDS Arctic'
          : 'IDS Premium Connected',
        isThermostat: false,
        isOn:
          d.connectedStatus && d.connectedStatus === 'ONLINE' ? true : false,
        isMonitoring: d.contractorMonitoringStatus,
        setPoint: null,
        current: null,
        mode: null,
        energySaveMode: false,
        serviceStartDate: d.serviceStartDate,
        savingModeState: '2',
        paired: d.bcc_deviceid !== undefined ? true : false,
        pairedDevice: {
          macId: d.bcc_deviceid !== undefined ? d.bcc_deviceid : '',
        },
        oduModelNumber: d.ODUSerialNumber,
        oduInstallationAddress: d.ODUInstalledAddress,
        contractorMonitoringStatus: d.contractorMonitoringStatus,
      });
    }
  });
  return newDeviceList;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_BANNER: {
      return {
        ...state,
        idsEnergyUsageEvent: false,
        idsEnergyUsateStartTime: '',
        idsEventStatus: '',
        idsEventAbbreviation: '',
        idsEventEndTime: '',
      };
    }
    case RESOURCE_STATUS: {
      return {
        ...state,
        idsEnergyUsageEvent: action.data.event !== 0 ? true : false,
        idsEnergyUsateStartTime: action.data.eventStartTime
          ? action.data.eventStartTime
          : '',
        idsEventStatus: action.data.eventStatus ? action.data.eventStatus : '',
        idsEventAbbreviation: action.data.timezoneAbbreviation
          ? action.data.timezoneAbbreviation
          : '',
        idsEventEndTime: action.data.eventEndTime
          ? action.data.eventEndTime
          : '',
      };
    }
    case UPDATE_HAPTIC: {
      let newHaptic = action.data.hapticVibration === '1';
      return {
        ...state,
        hapticVibration: newHaptic,
      };
    }
    case TEMP_UNIT_AND_HAPTIC: {
      let newVibration = action.data.hapticVibration === '1';
      let newTempUnit = action.data.tempUnit === 'F';
      return {
        ...state,
        hapticVibration: newVibration,
        actualWeatherOnFahrenheit: newTempUnit,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }
    case SAVE_DATE_BCC50: {
      return {
        ...state,
        dateBCC50: action.data,
      };
    }
    case SAVE_TIME_BCC50: {
      return {
        ...state,
        timeBCC50: action.data,
      };
    }
    case SCHEDULE_SELECTED_BCC50: {
      return {
        ...state,
        scheduleSelectedBCC50: action.data,
      };
    }
    case SAVE_SCHEDULE_BCC50: {
      return {
        ...state,
        scheduleBCC50Response: action.data,
      };
    }
    case UNPAIR_DEVICES: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.forEach(d => {
        if (d.macId === input.device_id) {
          d.paired = false;
          d.pairedDevice = {
            macId: '',
          };
        } else if (d.macId === input.gatewayId) {
          d.paired = false;
          d.paredDevice = {
            macId: '',
          };
        }
      });
      return {
        ...state,
      };
    }
    case PAIR_DEVICES: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.forEach(d => {
        if (d.macId === input.device_id) {
          d.paired = true;
          d.pairedDevice = {
            macId: action.data.gatewayId,
          };
        } else if (d.macId === input.gatewayId) {
          d.paired = true;
          d.paredDevice = {
            macId: action.data.device_id,
          };
        }
      });
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case SELECTED_IDS: {
      return {
        ...state,
        idsSelectedDeviceAccess: action.data,
        serviceStartDate: action.serviceStartDate,
      };
    }
    case PLACE_ID_INFORMATION: {
      return {
        ...state,
        locationInformation: action.data,
      };
    }
    //case LOCATION_SUGGESTIONS: {
    //  return {
    //    ...state,
    //    locationSuggestions: action.data,
    //  };
    //}
    case REMOVE_NOTIFICATION: {
      let newNotificationList = [];
      state.notificationList.forEach(m => {
        if (
          m.notification !== 'optout' &&
          m.ODUSerialNumber !== action.data.macId
        ) {
          newNotificationList.push(m);
        }
      });
      return {
        ...state,
        notificationList: newNotificationList,
        lastUpdated: Date.now(),
      };
    }
    case SELECTED_IDS_DEVICE: {
      return {
        ...state,
        idsSelectedDevice: action.data,
      };
    }
    case SELECTED_IDS_ODU: {
      return {
        ...state,
        idsSelectedOdu: action.data,
      };
    }
    case NEW_DEVICE_INFO: {
      return {
        ...state,
        newDeviceInfo: action.data,
      };
    }
    case SELECTED_IDS_DEVICE_TYPE: {
      return {
        ...state,
        idsSelectedDeviceType: action.data,
      };
    }
    case CLEAN_SELECTED_IDS_DEVICE_TYPE: {
      return {
        ...state,
        idsSelectedDeviceType: '',
      };
    }
    case UTILITY_ENERGY_SAVINGS: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.forEach(d => {
        if (d.macId === action.data.macId) {
          d.energySaveMode = action.data.energySavingsMode;
        }
      });
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case GET_UTILITY_ENERGY_SAVINGS: {
      return {
        ...state,
        utilyEnergySaving: action.data.data.drEnrollment,
      };
    }
    case LOCATION_SUGGESTIONS: {
      let suggestions = [];
      action.data.map(e => {
        suggestions.push(e);
      });
      return {
        ...state,
        locationSuggestions: suggestions,
      };
    }
    case UTILITY_ENERGY_SAVINGS: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.forEach(d => {
        if (d.macId === action.data.macId) {
          d.energySaveMode = action.data.energySavingsMode;
        }
      });
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case ONLY_WEATHER_INFO: {
      let weatherInfo = {
        current: Math.floor(action.data.current),
        weatherCode: action.data.currentConditionCode,
        forecaseInfo: action.data.days,
      };
      weatherInfo.forecaseInfo.map(f => {
        f.max = Math.floor(f.max);
        f.min = Math.floor(f.min);
      });
      return {
        ...state,
        weatherInfo: weatherInfo,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }
    case WEATHER_INFO: {
      let weatherInfo = {
        current: Math.floor(action.data.current),
        weatherCode: action.data.currentConditionCode,
        forecaseInfo: action.data.days,
      };
      let weatherInfoLocation = {
        city: action.data.city,
      };
      weatherInfo.forecaseInfo.map(f => {
        f.max = Math.floor(f.max);
        f.min = Math.floor(f.min);
      });
      return {
        ...state,
        weatherInfo: weatherInfo,
        weatherInfoLocation: weatherInfoLocation,
      };
    }
    case PAIR_UNPAIR: {
      let newDeviceList: Array<object> = handleDeviceListInfo(action.data.data);
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case UPDATE_DEVICE_LIST: {
      let newDeviceList: Array<object> = handleDeviceListInfo(action.data.data);
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }

    case DEVICE_LIST_DELETING: {
      let newDeviceList: Array<object> = handleDeviceListInfo(action.data.data);
      let newSelectedDevice = {...state.selectedDevice};
      let newPreviousBcc = state.previousBcc;
      if (action.isThermostat && newSelectedDevice.macId === action.macId) {
        newSelectedDevice = {};
        newPreviousBcc = '';
      }
      return {
        ...state,
        deviceList2: newDeviceList,
        selectedDevice: newSelectedDevice,
        previousBcc: newPreviousBcc,
      };
    }
    case UPDATE_COUNTER: {
      return {
        ...state,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }
    case GET_DEVICE_LIST: {
      let newDeviceList: Array<object> = handleDeviceListInfo(action.data.data);
      return {
        ...state,
        deviceList2: newDeviceList,
        loadedInfoCounter: state.loadedInfoCounter + 1,
        deviceListCounter: 0,
      };
    }
    case THERMOSTAT_SELECTED: {
      return {
        ...state,
        isThermostatSelected: action.data,
      };
    }
    case REMOVE_SELECTED_DEVICE_INFO: {
      return {
        ...state,
        selectedDevice: {},
      };
    }
    case UPDATE_LOCK_DEVICE: {
      const newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.lockDevice = action.data.lockDevice;
      newSelectedDevice.code = action.data.code;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }
    case UPDATE_TEMPERATURE_SETTINGS: {
      let newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.autoOn = action.data.t_auto === '1' ? true : false;
      newSelectedDevice.alertMessage =
        action.data.t_limit === '1' ? true : false;
      newSelectedDevice.alarmLow = action.data.low.split('°')[0];
      newSelectedDevice.alarmHigh = action.data.high.split('°')[0];
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }
    case UPDATE_DEVICE_INFORMATION: {
      const newDeviceInfo = {
        deviceId: action.data.deviceId,
        hd: action.data.hd,
        model: action.data.model,
        sw: action.data.sw,
      };
      return {
        ...state,
        deviceInformation: newDeviceInfo,
      };
    }
    case ADD_NEW_DEVICE: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.push({
        id: 8,
        macId: action.data.macId,
        deviceName: action.data.deviceName,
        deviceType: 'BCC100',
        isThermostat: true,
        isOn: true,
        mode: 1,
        heatingSetpoint: 74,
        coolingSetpoint: 79,
        setPoint: 74,
        current: 76,
        schedules: [],
      });
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case SELECT_NO_SCHEDULE: {
      let newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.isOnSchedule = false;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }
    case DELETE_SCHEDULE: {
      let newSelectedDevice = {...state.selectedDevice};
      let newDeviceList = [...state.deviceList2];
      let newSchedules = [];
      let currentToDelete = false;
      newSelectedDevice.schedules.map(s => {
        if (s.model_id === action.data.modelId) {
          if (s.state == '1') {
            currentToDelete = true;
          }
        }
      });
      newSelectedDevice.schedules.map(s => {
        if (s.model_id !== action.data.modelId) {
          if (s.name === 'Home' && currentToDelete) {
            s.state = '1';
            newSelectedDevice.isOnSchedule = false;
          }
          newSchedules.push(s);
        }
      });
      newSelectedDevice.schedules = newSchedules;

      newDeviceList.forEach(d => {
        if (d.macId === newSelectedDevice.macId) {
          d.schedules = newSelectedDevice.schedules;
        }
      });

      return {
        ...state,
        selectedDevice: newSelectedDevice,
        deviceList2: newDeviceList,
      };
    }
    case UPDATE_SELECTED_DEVICE_INFO_BASED_ON_RESPONSE: {
      let newSelectedDevice = {...state.selectedDevice};
      let newDeviceList = [...state.deviceList2];
      const newDeviceInfo = {
        deviceId: action.data.device_id,
        hd: action.data.wifiFirmware,
        model: action.data.model,
        sw: action.data.firmware,
      };
      let newLocation;
      newLocation =
        action.data.zipcode +
        ',' +
        action.data.city +
        ',' +
        action.data.state +
        ',' +
        action.data.country;
      newSelectedDevice.location = newLocation;
      const humidityValues = action.data.t_humidity.split('-');
      newSelectedDevice.isOnSchedule = action.data.distr === '1' ? false : true;
      newSelectedDevice.roomTemp = action.data.room_temp;
      newSelectedDevice.coolingTemp = action.data.temp.split('-')[0];
      newSelectedDevice.heatingTemp = action.data.temp.split('-')[1];
      newSelectedDevice.humidity = action.data.humidity;
      newSelectedDevice.heatType = action.data.heat_type;
      newSelectedDevice.fan = action.data.fan;
      newSelectedDevice.fanStatus = action.data.fanstatus;
      newSelectedDevice.isAccessoryAdded = humidityValues[0];
      newSelectedDevice.hold = action.data.hold;
      //newSelectedDevice.isAccessoryAdded = 1;
      newSelectedDevice.isAccesoryEnabled =
        humidityValues[1] === '1' ? true : false;
      //newSelectedDevice.isAccesoryEnabled = true;
      newSelectedDevice.HumiditySetpoint = humidityValues[2];
      newSelectedDevice.mode = parseInt(action.data.mode);
      newSelectedDevice.modeName = action.data.mode_name;
      newSelectedDevice.periodHour2 = action.data.period_hour2;
      newSelectedDevice.periodMinute2 = action.data.period_minute2;
      if (
        action.data.auto_time !== '' &&
        action.data.auto_time !== null &&
        action.data.auto_time !== undefined
      ) {
        newSelectedDevice.datetime = action.data.datetime;

        newSelectedDevice.auto_time = action.data.auto_time;
      }
      newSelectedDevice.isFahrenheit =
        action.data.temp_unit === 'F' ? true : false;
      newSelectedDevice.alarmLow = action.data.warn_low;
      newSelectedDevice.alarmHigh = action.data.warn_high;
      newSelectedDevice.autoOn = action.data.t_auto === '0' ? false : true;
      newSelectedDevice.alertMessage =
        action.data.t_limit === '0' ? false : true;
      newSelectedDevice.lockDevice = action.data.type === '0' ? true : false;
      newSelectedDevice.code = action.data.code;
      newSelectedDevice.sw = action.data.sw;
      newSelectedDevice.power = action.data.power;
      newSelectedDevice.periodCooling = action.data.period_temp.split('-')[0];
      newSelectedDevice.periodHeating = action.data.period_temp.split('-')[1];
      newSelectedDevice.type = action.data.type;
      newSelectedDevice.s_time = action.data.s_time;
      newSelectedDevice.screen = action.data.screen;
      newSelectedDevice.deadband = action.data.autoT;
      newSelectedDevice.d_hour = action.data.d_hour;
      newSelectedDevice.fanMode = action.data.fan;
      newSelectedDevice.fanOnFor = action.data.f_on_t;
      newSelectedDevice.fanOffFor = action.data.f_off_t;
      newSelectedDevice.fanIsScheduled = action.data.f_cir_mode;
      newSelectedDevice.fanScheduledStart = action.data.start_t;
      newSelectedDevice.fanScheduledEnd = action.data.end_t;
      newSelectedDevice.DateTime_TimeZone = action.data.timeZoneName;
      newSelectedDevice.stage = action.data.stage;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
        fanIsScheduled: action.data.f_cir_mode,
        deviceInformation: newDeviceInfo,
      };
    }

    case UPDATE_DEVICE_STATUS_INFO_SHEDULE: {
      let newSelectedDevice = {...state.selectedDevice};
      let newDeviceList = [...state.deviceList2];
      let newScheduleUpdate = {...state.scheduleUpdate};
      const newDeviceInfo = {
        deviceId: action.data.device_id,
        hd: action.data.wifiFirmware,
        model: action.data.model,
        sw: action.data.firmware,
      };

      let newLocation;
      newLocation =
        action.data.zipcode +
        ',' +
        action.data.city +
        ',' +
        action.data.state +
        ',' +
        action.data.country;
      newSelectedDevice.location = newLocation;

      const humidityValues = action.data.t_humidity.split('-');
      newSelectedDevice.isOnSchedule = action.data.distr === '1' ? false : true;
      newSelectedDevice.roomTemp = action.data.room_temp;
      newSelectedDevice.coolingTemp = action.data.temp.split('-')[0];
      newSelectedDevice.heatingTemp = action.data.temp.split('-')[1];
      newSelectedDevice.humidity = action.data.humidity;
      newSelectedDevice.heatType = action.data.heat_type;
      newSelectedDevice.fan = action.data.fan;
      newSelectedDevice.fanStatus = action.data.fanstatus;
      newSelectedDevice.isAccessoryAdded = humidityValues[0];
      newSelectedDevice.datetime = action.data.datetime;
      newSelectedDevice.hold = action.data.hold;
      //newSelectedDevice.isAccessoryAdded = 1;
      newSelectedDevice.isAccesoryEnabled =
        humidityValues[1] === '1' ? true : false;
      newSelectedDevice.accessorySelected = humidityValues[0];
      //newSelectedDevice.isAccesoryEnabled = true;
      newSelectedDevice.HumiditySetpoint = humidityValues[2];
      newSelectedDevice.mode = parseInt(action.data.mode);
      newSelectedDevice.modeName = action.data.mode_name;
      newSelectedDevice.periodHour2 = action.data.period_hour2;
      newSelectedDevice.periodMinute2 = action.data.period_minute2;
      newSelectedDevice.isFahrenheit =
        action.data.temp_unit === 'F' ? true : false;
      newSelectedDevice.alarmLow = action.data.warn_low;
      newSelectedDevice.alarmHigh = action.data.warn_high;
      newSelectedDevice.autoOn = action.data.t_auto === '0' ? false : true;
      newSelectedDevice.alertMessage =
        action.data.t_limit === '0' ? false : true;
      newSelectedDevice.lockDevice = action.data.type === '0' ? true : false;
      newSelectedDevice.code = action.data.code;
      newSelectedDevice.sw = action.data.sw;
      newSelectedDevice.power = action.data.power;
      newSelectedDevice.periodCooling = action.data.period_temp.split('-')[0];
      newSelectedDevice.periodHeating = action.data.period_temp.split('-')[1];
      newSelectedDevice.type = action.data.type;
      newSelectedDevice.s_time = action.data.s_time;
      newSelectedDevice.screen = action.data.screen;
      newSelectedDevice.deadband = action.data.autoT;
      newSelectedDevice.d_hour = action.data.d_hour;
      newSelectedDevice.fanMode = action.data.fan;
      newSelectedDevice.fanOnFor = action.data.f_on_t;
      newSelectedDevice.fanOffFor = action.data.f_off_t;
      newSelectedDevice.fanIsScheduled = action.data.f_cir_mode;
      newSelectedDevice.fanScheduledStart = action.data.start_t;
      newSelectedDevice.fanScheduledEnd = action.data.end_t;
      newSelectedDevice.DateTime_TimeZone = action.data.timeZoneName;
      newSelectedDevice.stage = action.data.stage;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
        deviceInformation: newDeviceInfo,
        scheduleUpdate: newScheduleUpdate,
      };
    }

    case UPDATE_DEVICE_STATUS_INFO: {
      let newSelectedDevice = {...state.selectedDevice};
      let newDeviceList = [...state.deviceList2];

      const newDeviceInfo = {
        deviceId: action.data.device_id,
        hd: action.data.wifiFirmware,
        model: action.data.model,
        sw: action.data.firmware,
      };

      let newLocation;
      newLocation =
        action.data.zipcode +
        ',' +
        action.data.city +
        ',' +
        action.data.state +
        ',' +
        action.data.country;
      newSelectedDevice.location = newLocation;

      const humidityValues = action.data.t_humidity.split('-');
      newSelectedDevice.isOnSchedule = action.data.distr === '1' ? false : true;
      newSelectedDevice.roomTemp = action.data.room_temp;
      newSelectedDevice.coolingTemp = action.data.temp.split('-')[0];
      newSelectedDevice.heatingTemp = action.data.temp.split('-')[1];
      newSelectedDevice.humidity = action.data.humidity;
      newSelectedDevice.heatType = action.data.heat_type;
      newSelectedDevice.fan = action.data.fan;
      newSelectedDevice.fanStatus = action.data.fanstatus;
      newSelectedDevice.isAccessoryAdded = humidityValues[0];
      newSelectedDevice.datetime = action.data.datetime;
      newSelectedDevice.hold = action.data.hold;
      //newSelectedDevice.isAccessoryAdded = 1;
      newSelectedDevice.isAccesoryEnabled =
        humidityValues[1] === '1' ? true : false;
      newSelectedDevice.accessorySelected = humidityValues[0];
      //newSelectedDevice.isAccesoryEnabled = true;
      newSelectedDevice.HumiditySetpoint = humidityValues[2];
      newSelectedDevice.mode = parseInt(action.data.mode);
      newSelectedDevice.modeName = action.data.mode_name;
      newSelectedDevice.periodHour2 = action.data.period_hour2;
      newSelectedDevice.periodMinute2 = action.data.period_minute2;
      newSelectedDevice.isFahrenheit =
        action.data.temp_unit === 'F' ? true : false;
      newSelectedDevice.alarmLow = action.data.warn_low;
      newSelectedDevice.alarmHigh = action.data.warn_high;
      newSelectedDevice.autoOn = action.data.t_auto === '0' ? false : true;
      newSelectedDevice.alertMessage =
        action.data.t_limit === '0' ? false : true;
      newSelectedDevice.lockDevice = action.data.type === '0' ? true : false;
      newSelectedDevice.code = action.data.code;
      newSelectedDevice.sw = action.data.sw;
      newSelectedDevice.power = action.data.power;
      newSelectedDevice.periodCooling = action.data.period_temp.split('-')[0];
      newSelectedDevice.periodHeating = action.data.period_temp.split('-')[1];
      newSelectedDevice.type = action.data.type;
      newSelectedDevice.s_time = action.data.s_time;
      newSelectedDevice.screen = action.data.screen;
      newSelectedDevice.deadband = action.data.autoT;
      newSelectedDevice.d_hour = action.data.d_hour;
      newSelectedDevice.fanMode = action.data.fan;
      newSelectedDevice.fanOnFor = action.data.f_on_t;
      newSelectedDevice.fanOffFor = action.data.f_off_t;
      newSelectedDevice.fanIsScheduled = action.data.f_cir_mode;
      newSelectedDevice.fanScheduledStart = action.data.start_t;
      newSelectedDevice.fanScheduledEnd = action.data.end_t;
      newSelectedDevice.DateTime_TimeZone = action.data.timeZoneName;
      newSelectedDevice.stage = action.data.stage;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
        deviceInformation: newDeviceInfo,
      };
    }
    case EDIT_PERIOD: {
      let updatedScheduleInfo = {...state.scheduleInfo};
      updatedScheduleInfo = action.data.scheduleInfo;

      updatedScheduleInfo['items' + action.data.selected] = updatedScheduleInfo[
        'items' + action.data.selected
      ].sort((a, b) => (parseInt(a.h) > parseInt(b.h) ? 1 : -1));
      return {
        ...state,
        scheduleInfo: updatedScheduleInfo,
      };
    }
    case ADD_PERIOD: {
      let updatedScheduleInfo = {...state.scheduleInfo};
      if (
        updatedScheduleInfo[`items${action.data.selected}`].filter(
          t => t.h === action.data.info.h,
        ).length != 0
      ) {
        updatedScheduleInfo[`items${action.data.selected}`].forEach(e => {
          if (e.h === action.data.info.h) {
            e.t = action.data.info.t;
          }
        });
      } else {
        updatedScheduleInfo[`items${action.data.selected}`].push(
          action.data.info,
        );
      }

      updatedScheduleInfo['items' + action.data.selected] = updatedScheduleInfo[
        'items' + action.data.selected
      ].sort((a, b) => (parseInt(a.h) > parseInt(b.h) ? 1 : -1));
      return {
        ...state,
        scheduleInfo: updatedScheduleInfo,
      };
    }
    case REMOVE_PERIOD: {
      let updatedScheduleInfo = {...state.scheduleInfo};
      updatedScheduleInfo[`items${action.data.selected}`].splice(
        action.data.index,
        1,
      );

      return {
        ...state,
        scheduleInfo: updatedScheduleInfo,
      };
    }
    case UPDATE_SELECTED_SCHEDULE_FULL: {
      let newScheduleInfo = {};
      for (let i = 1; i < 8; i++) {
        newScheduleInfo['items' + i] = action.data['items' + i].sort((a, b) =>
          parseInt(a.h) > parseInt(b.h) ? 1 : -1,
        );
      }
      return {
        ...state,
        scheduleInfo: newScheduleInfo,
      };
    }

    case UPDATE_SCHEDULE: {
      const newDeviceList = [...state.deviceList2];
      let newSelectedDevice = {...state.selectedDevice};
      let newSchedules = [...newSelectedDevice.schedules];
      newDeviceList.forEach(d => {
        if (d.macId === action.data.macId) {
          d.schedules?.map(s => {
            s.state = '0';
          });
          d.schedules?.map(s => {
            if (action.data.modelId === s.model_id) {
              s.state = '1';
            }
          });
          newSchedules.map(s => {
            s.state = 0;
          });
          newSchedules.map(s => {
            if (action.data.modelId === s.model_id) {
              s.state = '1';
            }
          });
          newSelectedDevice.modeName = action.data.name;
          newSelectedDevice.isOnSchedule = true;
          newSelectedDevice.schedules = newSchedules;
        }
      });
      return {
        ...state,
        deviceList2: newDeviceList,
        selectedDevice: newSelectedDevice,
      };
    }
    case UPDATE_SELECTED_SCHEDULE: {
      return {
        ...state,
        selectedSchedule: action.data,
      };
    }
    case UPDATE_SCHEDULE_INFO: {
      return {
        ...state,
        scheduleInfo: {},
      };
    }

    case SAVE_SCHEDULE_ON_STORE: {
      const newDeviceList: any[] = [...state.deviceList2];
      let newSelectedDevice = {...state.selectedDevice};
      let newSchedules = [...newSelectedDevice.schedules];
      const newElement: any = {
        limit: action.data.limit,
        mode: action.data.mode,
        model_id: action.data.modelId,
        name: action.data.name,
        state: action.data.state,
        data: action.data.data,
      };
      //newDeviceList.map(d => {
      //  if (d.macId === action.data.macId) {
      //    d.schedules?.push(newElement);
      //  }
      //});
      newSchedules.push(newElement);
      newSelectedDevice.schedules = newSchedules;

      return {
        ...state,
        devicesList2: newDeviceList,
        selectedSchedule: action.data.modelId,
        scheduleInfo: newElement.data,
        selectedDevice: newSelectedDevice,
      };
    }
    case SAVE_SCHEDULE: {
      const newDeviceList: any[] = [...state.deviceList2];
      let newSelectedDevice;
      const newElement: any = {
        limit: action.data.limit,
        mode: action.data.mode,
        model_id: action.data.modelId,
        name: action.data.name,
        state: action.data.state,
        data: action.data.data,
      };
      newDeviceList.forEach(d => {
        if (d.macId === action.data.macId) {
          d.schedules?.push(newElement);
          newSelectedDevice.schedules.push(d);
        }
      });
      return {
        ...state,
        devicesList2: newDeviceList,
        selectedDevice: newSelectedDevice,
        selectedSchedule: action.data.modelId,
      };
    }
    case CLEAN_SELECTED_DEVICE: {
      return {
        ...state,
        selectedDevice: {},
      };
    }
    case UPDATE_SCHEDULES: {
      const newDeviceList = [...state.deviceList2];
      let newSelectedDevice = {...state.selectedDevice};
      newDeviceList.forEach(d => {
        if (d.macId === action.data.macId) {
          d.schedules = action.data.schedules;
          //newSelectedDevice = d;
        }
      });
      newSelectedDevice.schedules = action.data.schedules;

      return {
        ...state,
        deviceList2: newDeviceList,
        selectedDevice: newSelectedDevice,
      };
    }
    case UPDATE_THERMOSTAT_MODE: {
      let newDeviceList = [...state.deviceList2];
      newDeviceList.forEach(d => {
        if (d.macId === action.data.device_id) {
          d.mode = parseInt(action.data.mode);
        }
      });
      return {
        ...state,
        deviceList2: newDeviceList,
      };
    }
    case UPDATE_THERMOSTAT_TEMP: {
      let newDevicesList = [...state.deviceList2];
      let newSelectedDevice = {...state.selectedDevice};
      const auxTemp = action.data.temp.split('-');
      newDevicesList.forEach(d => {
        if (d.macId === action.data.deviceId) {
          if (d.mode === 4 || d.mode === 2) {
            d.heatingSetpoint = parseInt(auxTemp[1]);
            d.heatingTemp = auxTemp[1];
          } else if (d.mode === 1) {
            d.coolingSetpoint = parseInt(auxTemp[0]);
            d.coolingTemp = auxTemp[0];
          } else if (d.mode === 3) {
            d.coolingSetpoint = parseInt(auxTemp[0]);
            d.heatingSetpoint = parseInt(auxTemp[1]);
            d.coolingTemp = auxTemp[0];
            d.heatingTemp = auxTemp[1];
          }
        }
      });
      if (newSelectedDevice.mode === 4 || newSelectedDevice.mode === 2) {
        newSelectedDevice.heatingTemp = auxTemp[1];
      } else if (newSelectedDevice.mode === 1) {
        newSelectedDevice.coolingTemp = auxTemp[0];
      } else if (newSelectedDevice.mode === 3) {
        newSelectedDevice.coolingTemp = auxTemp[0];
        newSelectedDevice.heatingTemp = auxTemp[1];
      }
      newSelectedDevice.hold = parseInt(action.data.hold);
      return {
        ...state,
        deviceList2: newDevicesList,
        selectedDevice: newSelectedDevice,
      };
    }
    case UPDATE_VIBRATION: {
      return {
        ...state,
        hapticVibration: action.data,
      };
    }
    case UPDATE_LOCATION: {
      let newWeatherInfo = {...state.weatherInfoLocation};
      newWeatherInfo.city = action.data;
      return {
        ...state,
        weatherInfoLocation: newWeatherInfo,
      };
    }

    case UPDATE_DATETIME_TIMEZONE: {
      let newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.DateTime_TimeZone = action.data.timeZoneName;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }
    case TEMP_LOCATION: {
      let newTempLocation = {};
      let newLocation;
      let countrySuggestions = '';
      if (action.data.Place.Country === 'USA') {
        countrySuggestions = 'United States';
      } else if (action.data.Place.Country === 'CAN') {
        countrySuggestions = 'Canada';
      }
      newLocation =
        action.data.Place.PostalCode +
        ',' +
        action.data.Place.Municipality +
        ',' +
        action.data.Place.Region +
        ',' +
        countrySuggestions;
      newTempLocation.location = newLocation;
      newTempLocation.TimeZoneData = action.data.Place;
      newTempLocation.TimeZoneZone = action.zone;
      return {
        ...state,
        tempLocation: newTempLocation,
      };
    }
    case UPDATE_LOCATION_SETTINGS: {
      let newLocation;
      if (action.suggestions) {
        let countrySuggestions = '';
        if (action.data.Country === 'USA') {
          countrySuggestions = 'United States';
        } else if (action.data.Country === 'CAN') {
          countrySuggestions = 'Canada';
        }
        newLocation =
          action.data.PostalCode +
          ',' +
          action.data.Municipality +
          ',' +
          (action.data.Region !== undefined
            ? action.data.Region
            : action.data.state) +
          ',' +
          countrySuggestions;
        //=== 'USA' ? 'United States' : 'Canada';
      } else {
        newLocation =
          action.data.zipcode +
          ',' +
          action.data.city +
          ',' +
          action.data.state +
          ',' +
          action.data.country;
      }
      let newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.location = newLocation;
      newSelectedDevice.TimeZoneData = action.data;
      newSelectedDevice.zone = action.zone;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }

    case UPDATE_LOCATION_PLACEID: {
      let newSelectedDevice = {...state.selectedDevice};
      //newSelectedDevice.locationZipCode = action.data;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }

    case UPDATE_DATETIME_SETTINGS: {
      let newSelectedDevice = {...state.selectedDevice};
      if (action.setting === 'datetime') {
        //newSelectedDevice.datetime = action.data.datetime;
        newSelectedDevice.datetime = action.data;
      } else if (action.setting === 'auto') {
        //newSelectedDevice.auto_time = action.data.auto_time.toString();
        newSelectedDevice.auto_time = action.data;
      } else if (action.setting === 'hour') {
        //newSelectedDevice.d_hour = action.data.d_hour.toString();
        newSelectedDevice.d_hour = action.data;
      }
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }

    case UPDATE_WEATHER_ON_FAHRENHEIT: {
      let weatherInfo = {
        current: Math.floor(action.weatherInfo.current),
        weatherCode: action.weatherInfo.currentConditionCode,
        forecaseInfo: action.weatherInfo.days,
      };
      weatherInfo.forecaseInfo.map(f => {
        f.max = Math.floor(f.max);
        f.min = Math.floor(f.min);
      });
      return {
        ...state,
        actualWeatherOnFahrenheit: action.data.unit == 'F',
        weatherInfo: weatherInfo,
      };
    }
    case DELETE_DEVICE: {
      return {
        ...state,
        deviceList2: state.deviceList2.filter(
          d => d.macId !== action.data.macId,
        ),
      };
    }
    case EDIT_DEVICE: {
      let newList = [...state.deviceList2];
      let newName = action.data.deviceName;
      let newSelectedDevice = {...state.selectedDevice};
      newList.forEach(d => {
        if (d.macId === action.data.deviceId) {
          if (action.data.isThermostat) {
            newName += ' Thermostat';
          }
          d.deviceName = newName;
        }
      });
      if (newSelectedDevice.macId === action.data.deviceId) {
        newSelectedDevice.deviceName = action.data.deviceName;
        if (action.data.isThermostat) {
          newSelectedDevice.deviceName += ' Thermostat';
        }
      }
      return {
        ...state,
        deviceList2: newList,
        selectedDevice: newSelectedDevice,
      };
    }
    case ACTUAL_WEATHER_TYPE: {
      return {
        ...state,
        actualWeatherOnFahrenheit: action.data,
      };
    }
    case USER_FIRST_LOGIN: {
      return {
        ...state,
        isUserFirstLogin: action.data,
      };
    }
    case ENERGY_USAGE_DATA: {
      // let newData = Object.assign(initialState.energyData);
      // newData.push(action.data);
      return {
        ...state,
        energyData: action.data,
      };
    }
    case DEVICE_LIST: {
      return {
        ...state,
        deviceList: action.data,
        isTermsConditionsAccepted: action.isTermsConditionsAccepted,
      };
    }
    case ADD_NEW_UNIT: {
      return {
        ...state,
        deviceList: [...state.deviceList, {...action.data}],
      };
    }
    case EDIT_UNIT_INFO: {
      const index = state.deviceList.findIndex(
        item => item.gatewayId === action.data.gatewayId,
      );
      let updatedList = [...state.deviceList];
      updatedList[index] = {...updatedList[index], ...action.data};
      return {
        ...state,
        deviceList: updatedList,
      };
    }
    case REMOVE_DEVICE_PAIRING: {
      let newDeviceList = [...state.deviceList];
      let index = newDeviceList.findIndex(d => {
        return d.macId === action.data;
      });
      newDeviceList.splice(index, 1);
      return {
        ...state,
        deviceList: newDeviceList,
      };
    }
    case UPDATE_MONITORING_STATUS: {
      let newHeatPumpInfo = {...state.heatPumpInfo};
      newHeatPumpInfo.contractorMonitoringStatus =
        action.data.contractorMonitoringStatus;
      const index = state.deviceList.findIndex(
        item => item.gatewayId === action.data.gatewayId,
      );
      let updatedList = [...state.deviceList];
      updatedList[index] = {...updatedList[index], ...action.data};
      return {
        ...state,
        deviceList: updatedList,
        heatPumpInfo: newHeatPumpInfo,
      };
    }
    case PREV_BCC: {
      return {
        ...state,
        previousBcc: action.data,
      };
    }
    case SELECTED_DEVICE: {
      return {
        ...state,
        selectedDevice: action.data,
      };
    }
    case SELECT_BCC: {
      return {
        ...state,
        selectedDevice: {...state.selectedDevice, macId: action.data},
      };
    }
    case PREV_SELECTED_DEVICE: {
      return {
        ...state,
        prevSelectedDevice: action.data,
      };
    }
    case DEVICE_STATUS: {
      return {
        ...state,
        deviceStatus: action.data,
      };
    }
    case DEVICE_DETAILS: {
      action.data.odu.gatewaySerialNumberHO = '';
      action.data.odu.gatewayWarrantyPeriod = '';
      action.data.odu.serviceDateHO = '';
      return {
        ...state,
        deviceDetails: action.data,
      };
    }
    case DEVICE_DETAILS2: {
      // action.data.odu.gatewaySerialNumberHO = '';
      // action.data.odu.gatewayWarrantyPeriod = '';
      // action.data.odu.serviceDateHO = '';
      return {
        ...state,
        deviceDetails: action.data,
      };
    }
    case HEAT_PUMP_INFO: {
      return {
        ...state,
        heatPumpInfo: action.data,
      };
    }
    case UPDATE_HEAT_PUMP_INFO: {
      return {
        ...state,
        heatPumpInfo: action.data,
      };
    }
    case RELOAD_HEAT_PUMP_INFO: {
      return {
        ...state,
        reloadHeatPumpInfo: true,
      };
    }
    case NO_RELOAD_HEAT_PUMP_INFO: {
      return {
        ...state,
        reloadHeatPumpInfo: false,
      };
    }
    case MARK_NOTIFICATION_READ: {
      let newCount = state.notificationsCount - 1;
      return {
        ...state,
        notificationsCount: newCount,
      };
    }
    case NOTIFICATION_LIST: {
      let notificationsCount = 0;
      let data = action.data;

      /*if (state.lastUpdated) {
        notificationsCount = data.Items.filter(
          item => item.issueDate > state.lastUpdated,
        ).length;
        unread
      }*/
      //notificationsCount = data.Items.filter(item => item.unread).length;

      state.lastUpdated = Date.now();

      return {
        ...state,
        lastKey: action.data.LastEvaluatedKey,
        notificationList: action.data.Items,
        lastUpdated: Date.now(),

        //notificationsCount: notificationsCount,
      };
    }

    case UPDATE_HOMEOWNER_NOTIFICATIONS: {
      return {
        ...state,

        notificationList: [...state.notificationList, ...action.data.Items],
        lastKey: action.data.LastEvaluatedKey,
      };
    }
    case UPDATE_HOMEOWNERCOUNT:
      return {
        ...state,

        notificationsCount: state.notificationsCount + 1,
      };
    case CLEAR_HOMEOWNERCOUNT:
      return {
        ...state,
        notificationsCount: 0,
      };
    case SELECT_BCC: {
      return {
        ...state,
        selectedDevice: {...state.selectedDevice, macId: action.data},
      };
    }
    case ADDNEWNOTIFICATION:
      return {
        ...state,

        notificationList: [action.data, ...state.notificationList],
      };
    case FAQ_LIST: {
      return {
        ...state,
        faqList: action.data,
      };
    }
    case UNREAD_HOMEOWNER_NOTIFICATION: {
      return {
        ...state,
        notificationsCount: action.data,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }
    case UPDATE_TERMS_AND_CONDITIONS_FLAG: {
      return {
        ...state,
        isTermsConditionsAccepted: true,
      };
    }

    case UPDATE_HO_ANALYTICS_VALUE: {
      return {
        ...state,
        hoUserAnalytics: action.data,
      };
    }

    case UPDATE_SELECTED_ACCESORY: {
      const newDeviceList = [...state.deviceList2];
      let newSelectedDevice = {...state.selectedDevice};
      const humidityValues = action.data.t_humidity.split('-');
      /* newDeviceList.map((d) => {
        if (d.macId === action.device_id) {
          d.isAccessoryAdded = humidityValues[0];
          d.isAccesoryEnabled = humidityValues[1] === '1' ? true : false;
          d.HumiditySetpoint = humidityValues[2];
          newSelectedDevice = d;
        }
      });*/
      newSelectedDevice.isAccessoryAdded = humidityValues[0];
      newSelectedDevice.isAccesoryEnabled =
        humidityValues[1] === '1' ? true : false;
      newSelectedDevice.HumiditySetpoint = humidityValues[2];

      return {
        ...state,
        // devicesList2: newDeviceList,
        selectedDevice: newSelectedDevice,
      };
    }

    case UPDATE_SELECTED_UNITNAME: {
      return {
        ...state,
        selectedUnitName: action.data,
      };
    }

    case DELETE_APPLIANCE: {
      let deviceArray = state.deviceList;
      for (let i = 0; i < state.deviceList.length; i++) {
        if (deviceArray[i].gatewayId === action.data) {
          deviceArray.splice(i, 1);
        }
      }
      state.deviceList = deviceArray;
      return {
        ...state,
        deviceList: state.deviceList,
      };
    }

    case UPDATE_FAN_MODE: {
      let newSelectedDevice = {...state.selectedDevice};
      newSelectedDevice.fanMode = action.data.fan;
      newSelectedDevice.fanOnFor = action.data.f_on_t;
      newSelectedDevice.fanOffFor = action.data.f_off_t;
      newSelectedDevice.fanIsScheduled = action.data.f_cir_mode;
      newSelectedDevice.fanScheduledStart = action.data.start_t;
      newSelectedDevice.fanScheduledEnd = action.data.end_t;
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };
    }

    case UPDATE_FAN_ON_FOR: {
      return {
        ...state,
        fanOnFor: action.data,
      };
    }

    case UPDATE_FAN_OFF_FOR: {
      return {
        ...state,
        fanOffFor: action.data,
      };
    }

    case UPDATE_SCHEDULED_START: {
      return {
        ...state,
        fanScheduledStart: action.data,
      };
    }

    case UPDATE_SCHEDULED_END: {
      return {
        ...state,
        fanScheduledEnd: action.data,
      };
    }

    case PERMISSION_CONTRACTOR_MONITORING_STATUS_ACCEPT: {
      return {
        ...state,
        contractorMonitoringStatus: true,
      };
    }

    case PERMISSION_CONTRACTOR_MONITORING_STATUS_DENIED: {
      return {
        ...state,
        contractorMonitoringStatus: false,
      };
    }

    case UPDATE_INFO_UNIT_CONFIGURATION: {
      const data = action.data;
      let obj = state.infoUnitConfiguration;
      obj[data.name] = data.value;

      return {
        ...state,
        infoUnitConfiguration: obj,
      };
    }

    case SET_DEVICE_NAME_ONBOARDING: {
      const data = action.data;
      return {
        ...state,
        nameDeviceOnboarding: data.name,
      };
    }

    case SET_LOCATION_ONBOARDING: {
      const data = action.data;
      let obj = {
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
        placeid: data.placeid,
      };
      return {
        ...state,
        locationOnboarding: obj,
      };
    }

    case RESET_INFO_UNIT_CONFIGURATION: {
      let obj = {
        type: 0,
        fossilFuel: 0,
        hpEnergized: 0,
        hpEmHeat: 0,
        dualFBSetpoint: 400,
        dualFCOvertime: 45,
        heatStages: 1,
        coolStages: 1,
        humidityConf: 1,
        humidType: 0,
        dehumidType: 0,
        hours1224: 0,
        dateTime: {
          anio: 0,
          month: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        },
        schedule: 2,
      };

      return {
        ...state,
        infoUnitConfiguration: obj,
      };
    }

    case RESET_SCHEDULE_ONBOARDING: {
      const data = action.data;
      return {
        ...state,
        schedulesOnBoarding: data,
      };
    }

    case SELECT_NO_SCHEDULE_ONBOARDING: {
      let schedulesOnBoarding = [...state.schedulesOnBoarding];
      schedulesOnBoarding.forEach(item => {
        item.state = '0';
      });
      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case ADD_SCHEDULE_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];
      schedulesOnBoarding.push(data);

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case DELETE_SCHEDULE_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];
      let newSchedules = [];
      let currentToDelete = false;

      schedulesOnBoarding.forEach(s => {
        if (s.model_id === data.modelId) {
          if (s.state == '1') {
            currentToDelete = true;
          }
        }
      });

      schedulesOnBoarding.forEach(s => {
        if (s.model_id !== data.modelId) {
          if (s.name === 'Home' && currentToDelete) {
            s.state = '1';
          }
          newSchedules.push(s);
        }
      });
      schedulesOnBoarding = newSchedules;

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case UPDATE_SCHEDULE_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];

      schedulesOnBoarding.forEach(item => {
        item.state = '0';
      });

      schedulesOnBoarding.forEach(item => {
        if (item.model_id === data.modelId) {
          item.state = '1';
        }
      });

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case ADD_PERIOD_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];
      schedulesOnBoarding.forEach(item => {
        if (item.model_id == data.selectedSchedule) {
          let existing = item.data[`items${data.selected}`].findIndex(
            i => i.h === data.info.h,
          );
          if (existing != -1) {
            item.data[`items${data.selected}`][existing] = data.info;
          } else {
            item.data[`items${data.selected}`].push(data.info);
          }
        }
      });
      schedulesOnBoarding[0].data[`items${data.selected}`] =
        schedulesOnBoarding[0].data[`items${data.selected}`].sort((a, b) =>
          parseInt(a.h) > parseInt(b.h) ? 1 : -1,
        );

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case EDIT_PERIOD_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];
      schedulesOnBoarding.forEach(item => {
        if (item.model_id == data.selectedSchedule) {
          let existing = item.data[`items${data.selected}`].findIndex(
            i => i.h === data.info.h,
          );
          //if (existing != -1) {
          //  item.data[`items${data.selected}`].splice(existing, 1);
          //}
          let newPeriods = [];
          item.data[`items${data.selected}`].forEach((e, i) => {
            if (i !== action.data.periodNumber && i !== existing) {
              newPeriods.push(e);
            }
          });
          newPeriods.push(data.info);
          item.data[`items${data.selected}`] = newPeriods;
        }
      });

      schedulesOnBoarding[0].data[`items${data.selected}`] =
        schedulesOnBoarding[0].data[`items${data.selected}`].sort((a, b) =>
          parseInt(a.h) > parseInt(b.h) ? 1 : -1,
        );

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case UPDATE_BCC50_MACID: {
      return {
        ...state,
        BCC50macID: action.data,
      };
      /* let newSelectedDevice = {...state.selectedDevice};
      //newSelectedDevice.BCC50macID = action.data;
      newSelectedDevice.BCC50macID = 'DeviceBCC50SpposeMcID';
      return {
        ...state,
        selectedDevice: newSelectedDevice,
      };*/
    }

    case REMOVE_PERIOD_ONBOARDING: {
      const data = action.data;
      let schedulesOnBoarding = [...state.schedulesOnBoarding];

      schedulesOnBoarding.forEach(item => {
        if (item.model_id == data.selectedSchedule) {
          item.data[`items${data.selected}`].splice(data.index, 1);
        }
      });

      return {
        ...state,
        schedulesOnBoarding: schedulesOnBoarding,
      };
    }

    case SET_IS_ONBOARDING_BCC50: {
      const data = action.data;
      return {
        ...state,
        isOnboardingBcc50: data,
      };
    }

    case SET_INFO_UNIT_CONFIGURATION_NO_ONBOARDING: {
      const data = action.data;
      let obj = {
        heatType: data.heatType,
        fanControl: data.fanControl,
        reverse: data.reverse,
        emHeat: data.emHeat,
        balPoint: data.balPoint,
        changeOver: data.changeOver,
        heatStage: data.heatStage,
        coolStage: data.coolStage,
        humiType: data.humiType,
        humidifer: data.humidifer,
        dehumidifer: data.dehumidifer,
      };

      return {
        ...state,
        infoUnitConfigurationNoOnboarding: obj,
      };
    }

    case UPDATE_INFO_UNIT_CONFIGURATION_NO_ONBOARDING: {
      const data = action.data;
      let obj = state.infoUnitConfigurationNoOnboarding;
      obj[data.name] = data.value;

      return {
        ...state,
        infoUnitConfigurationNoOnboarding: obj,
      };
    }

    case SET_SKIP_UNIT_CONFIGURATION_ONBOARDING: {
      const data = action.data;
      return {
        ...state,
        skipUnitConfigurationOnboarding: data,
      };
    }

    case SET_IS_ONBOARDING_BCC101: {
      const data = action.data;
      return {
        ...state,
        isOnboardingBcc101: data,
      };
    }

    case DEVICE_LIST_COUNTER: {
      let newDeviceListCounter = state.deviceListCounter;
      newDeviceListCounter++;
      return {
        ...state,
        deviceListCounter: newDeviceListCounter,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }

    case RESET_COUNTER: {
      let newDeviceListCounter = state.deviceListCounter;
      newDeviceListCounter++;
      return {
        ...state,
        deviceListCounter: 0,
        loadedInfoCounter: state.loadedInfoCounter + 1,
      };
    }

    case SET_UNIT_NAME_IDS: {
      const data = action.data;
      return {
        ...state,
        unitNameIds: data,
      };
    }

    default:
      return state;
  }
};
