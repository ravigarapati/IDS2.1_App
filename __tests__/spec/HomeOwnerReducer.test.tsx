import HomeOwnerReducer from './../../src/store/reducers/HomeOwnerReducer';
import * as HomeOwnerLabels from './../../src/store/labels/HomeOwnerLabels';
import * as NotificationLabels from './../../src/store/labels/NotificationLabels';

let initialState = {
  energyData: {},
  deviceList: [],
  selectedDevice: {
    isOnSchedule: true,
    roomTemp: '75.0',
    coolingTemp: '50.0',
    heatingTemp: '45.0',
    humidity: '49',
    location: 'testing',
    heatType: '2-3-0',
    fan: '2',
    fanStatus: '1',
    isAccessoryAdded: '1',
    datetime: '2023-09-08 13:19:16',
    hold: '0',
    isAccesoryEnabled: true,
    accessorySelected: '1',
    HumiditySetpoint: '30',
    mode: 1,
    modeName: 'Home',
    periodHour2: '0',
    periodMinute2: '0',
    isFahrenheit: true,
    alarmLow: '57',
    alarmHigh: '99',
    autoOn: true,
    macId: '98d863d2416a',
    alertMessage: true,
    lockDevice: false,
    code: '',
    sw: '57',
    power: '2',
    periodCooling: '50.0',
    periodHeating: '45.0',
    type: '1',
    s_time: '3',
    screen: '3',
    deadband: '5.2',
    d_hour: '1',
    fanMode: '2',
    fanOnFor: '10',
    fanOffFor: '40',
    fanIsScheduled: '0',
    fanScheduledStart: '0',
    fanScheduledEnd: '30',
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
        mode: '3',
        model_id: '3',
        name: 'summer ',
        state: '0',
      },
      {
        default_home: 0,
        limit: '71-82',
        mode: '1',
        model_id: '4',
        name: 'nueva',
        state: '0',
      },
    ],
    DateTime_TimeZone: 'America/Los_Angeles',
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
  newScheduleBCC50: {
    deviceLocation: '',
    unitConfig: '',
    timestamp: '',
    schedule: '',
  },
  programedSchedulesBCC50: [],
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
  isFahrenheit: false,
  location: 'Alabaster, Alabama, United States',
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
  tempLocation: '',
  newDeviceInfo: {},
  previousBcc: '',
  dateBCC50: '',
  timeBCC50: '',
  scheduleSelectedBCC50: '',
  scheduleBCC50Response: '',
  infoUnitConfiguration: {},
  schedulesOnBoarding: [],
  locationOnboarding: {},
  nameDeviceOnboarding: '',
  deviceList2: [
    {
      acceleratedHeating: true,
      accesories: [],
      coolingSetpoint: 83,
      current: 78,
      deviceName: 'DeviceBetty Thermostat',
      deviceType: 'BCC50',
      heatingSetpoint: 78,
      id: 1,
      isAccesories: true,
      isConnected: true,
      isMonitoring: null,
      isOn: true,
      isOnSchedule: true,
      isThermostat: true,
      macId: '98d863d2416a',
      mode: 1,
      paired: false,
      pairedDevice: {
        macId: '',
      },
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
          mode: '3',
          model_id: '3',
          name: 'summer ',
          state: '0',
        },
        {
          default_home: 0,
          limit: '71-82',
          mode: '1',
          model_id: '4',
          name: 'nueva',
          state: '0',
        },
      ],
      setPoint: 78,
      stage: 3,
    },
    {
      contractorMonitoringStatus: true,
      current: null,
      deviceName: 'HeatPumpPrasannGuap',
      deviceType: 'IDS Arctic',
      energySaveMode: false,
      id: 2,
      isMonitoring: true,
      isOn: false,
      isThermostat: false,
      macId: '399A-716-827827-8733955691',
      mode: null,
      oduInstallationAddress: {
        address: [],
        latitude: '35.31481',
        longitude: '-120.831085',
      },
      oduModelNumber: '399A-716-827827-8733958900',
      paired: false,
      pairedDevice: {
        macId: '',
      },
      savingModeState: '2',
      setPoint: null,
    },
  ],
};

let initialState2 = {
  energyData: {},
  deviceList: [],
  selectedDevice: {
    isOnSchedule: true,
    roomTemp: '75.0',
    coolingTemp: '50.0',
    heatingTemp: '45.0',
    humidity: '49',
    heatType: '2-3-0',
    fan: '2',
    fanStatus: '1',
    isAccessoryAdded: '1',
    datetime: '2023-09-08 13:19:16',
    hold: '0',
    isAccesoryEnabled: true,
    accessorySelected: '1',
    HumiditySetpoint: '30',
    mode: 2,
    modeName: 'Home',
    periodHour2: '0',
    periodMinute2: '0',
    isFahrenheit: true,
    alarmLow: '57',
    alarmHigh: '99',
    autoOn: true,
    macId: '98d863d2416a',
    alertMessage: true,
    lockDevice: false,
    code: '',
    sw: '57',
    power: '2',
    periodCooling: '50.0',
    periodHeating: '45.0',
    type: '1',
    s_time: '3',
    screen: '3',
    deadband: '5.2',
    d_hour: '1',
    fanMode: '2',
    fanOnFor: '10',
    fanOffFor: '40',
    fanIsScheduled: '0',
    fanScheduledStart: '0',
    fanScheduledEnd: '30',
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
        mode: '3',
        model_id: '3',
        name: 'summer ',
        state: '0',
      },
      {
        default_home: 0,
        limit: '71-82',
        mode: '1',
        model_id: '4',
        name: 'nueva',
        state: '0',
      },
    ],
    DateTime_TimeZone: 'America/Los_Angeles',
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
  newScheduleBCC50: {
    deviceLocation: '',
    unitConfig: '',
    timestamp: '',
    schedule: '',
  },
  programedSchedulesBCC50: [],
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
  isFahrenheit: false,
  location: 'Alabaster, Alabama, United States',
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
  tempLocation: '',
  newDeviceInfo: {},
  previousBcc: '',
  dateBCC50: '',
  timeBCC50: '',
  scheduleSelectedBCC50: '',
  scheduleBCC50Response: '',
  infoUnitConfiguration: {},
  schedulesOnBoarding: [],
  locationOnboarding: {},
  nameDeviceOnboarding: '',
  deviceList2: [
    {
      acceleratedHeating: true,
      accesories: [],
      coolingSetpoint: 83,
      current: 78,
      deviceName: 'DeviceBetty Thermostat',
      deviceType: 'BCC50',
      heatingSetpoint: 78,
      id: 1,
      isAccesories: true,
      isConnected: true,
      isMonitoring: null,
      isOn: true,
      isOnSchedule: true,
      isThermostat: true,
      macId: '98d863d2416a',
      mode: 2,
      paired: false,
      pairedDevice: {
        macId: '',
      },
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
          mode: '3',
          model_id: '3',
          name: 'summer ',
          state: '0',
        },
        {
          default_home: 0,
          limit: '71-82',
          mode: '1',
          model_id: '4',
          name: 'nueva',
          state: '0',
        },
      ],
      setPoint: 78,
      stage: 3,
    },
    {
      contractorMonitoringStatus: true,
      current: null,
      deviceName: 'HeatPumpPrasannGuap',
      deviceType: 'IDS Arctic',
      energySaveMode: false,
      id: 2,
      isMonitoring: true,
      isOn: false,
      isThermostat: false,
      macId: '399A-716-827827-8733955691',
      mode: null,
      oduInstallationAddress: {
        address: [],
        latitude: '35.31481',
        longitude: '-120.831085',
      },
      oduModelNumber: '399A-716-827827-8733958900',
      paired: false,
      pairedDevice: {
        macId: '',
      },
      savingModeState: '2',
      setPoint: null,
    },
  ],
};

let initialState3 = {
  energyData: {},
  deviceList: [],
  selectedDevice: {
    isOnSchedule: true,
    roomTemp: '75.0',
    coolingTemp: '50.0',
    heatingTemp: '45.0',
    humidity: '49',
    heatType: '2-3-0',
    fan: '2',
    fanStatus: '1',
    isAccessoryAdded: '1',
    datetime: '2023-09-08 13:19:16',
    hold: '0',
    isAccesoryEnabled: true,
    accessorySelected: '1',
    HumiditySetpoint: '30',
    mode: 3,
    modeName: 'Home',
    periodHour2: '0',
    periodMinute2: '0',
    isFahrenheit: true,
    alarmLow: '57',
    alarmHigh: '99',
    autoOn: true,
    macId: '98d863d2416a',
    alertMessage: true,
    lockDevice: false,
    code: '',
    sw: '57',
    power: '2',
    periodCooling: '50.0',
    periodHeating: '45.0',
    type: '1',
    s_time: '3',
    screen: '3',
    deadband: '5.2',
    d_hour: '1',
    fanMode: '2',
    fanOnFor: '10',
    fanOffFor: '40',
    fanIsScheduled: '0',
    fanScheduledStart: '0',
    fanScheduledEnd: '30',
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
        mode: '3',
        model_id: '3',
        name: 'summer ',
        state: '0',
      },
      {
        default_home: 0,
        limit: '71-82',
        mode: '1',
        model_id: '4',
        name: 'nueva',
        state: '0',
      },
    ],
    DateTime_TimeZone: 'America/Los_Angeles',
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
  newScheduleBCC50: {
    deviceLocation: '',
    unitConfig: '',
    timestamp: '',
    schedule: '',
  },
  programedSchedulesBCC50: [],
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
  isFahrenheit: false,
  location: 'Alabaster, Alabama, United States',
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
  tempLocation: '',
  newDeviceInfo: {},
  previousBcc: '',
  dateBCC50: '',
  timeBCC50: '',
  scheduleSelectedBCC50: '',
  scheduleBCC50Response: '',
  infoUnitConfiguration: {},
  schedulesOnBoarding: [],
  locationOnboarding: {},
  nameDeviceOnboarding: '',
  deviceList2: [
    {
      acceleratedHeating: true,
      accesories: [],
      coolingSetpoint: 83,
      current: 78,
      deviceName: 'DeviceBetty Thermostat',
      deviceType: 'BCC50',
      heatingSetpoint: 78,
      id: 1,
      isAccesories: true,
      isConnected: true,
      isMonitoring: null,
      isOn: true,
      isOnSchedule: true,
      isThermostat: true,
      macId: '98d863d2416a',
      mode: 3,
      paired: false,
      pairedDevice: {
        macId: '',
      },
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
          mode: '3',
          model_id: '3',
          name: 'summer ',
          state: '0',
        },
        {
          default_home: 0,
          limit: '71-82',
          mode: '1',
          model_id: '4',
          name: 'nueva',
          state: '0',
        },
      ],
      setPoint: 78,
      stage: 3,
    },
    {
      contractorMonitoringStatus: true,
      current: null,
      deviceName: 'HeatPumpPrasannGuap',
      deviceType: 'IDS Arctic',
      energySaveMode: false,
      id: 2,
      isMonitoring: true,
      isOn: false,
      isThermostat: false,
      macId: '399A-716-827827-8733955691',
      mode: null,
      oduInstallationAddress: {
        address: [],
        latitude: '35.31481',
        longitude: '-120.831085',
      },
      oduModelNumber: '399A-716-827827-8733958900',
      paired: false,
      pairedDevice: {
        macId: '',
      },
      savingModeState: '2',
      setPoint: null,
    },
  ],
};

describe('Home Owner reducer', () => {
  test('Validate initial state', () => {
    expect(HomeOwnerReducer(initialState, {})).toStrictEqual(initialState);
  });

  test('Haptic vibration deactivated, and Weather on F', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.TEMP_UNIT_AND_HAPTIC,
      data: {hapticVibration: '0', tempUnit: 'F'},
    });

    expect(reducer.actualWeatherOnFahrenheit).toBe(true);
    expect(reducer.hapticVibration).toBe(false);
  });
  test('Haptic vibration activated, and Weather on C', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.TEMP_UNIT_AND_HAPTIC,
      data: {hapticVibration: '1', tempUnit: 'C'},
    });

    expect(reducer.actualWeatherOnFahrenheit).toBe(false);
    expect(reducer.hapticVibration).toBe(true);
  });

  test('Activate haptic value', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.UPDATE_HAPTIC,
      data: {hapticVibration: '1'},
    });

    expect(reducer.hapticVibration).toBe(true);
  });

  test('Deactivate haptic value', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.UPDATE_HAPTIC,
      data: {hapticVibration: '0'},
    });

    expect(reducer.hapticVibration).toBe(false);
  });

  test('Get weather info', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.WEATHER_INFO,
      data: {
        city: 'East Boston',
        country: 'United States',
        current: 85.82,
        currentConditionCode: 'ic_weather_cloudy_day',
        days: [
          {conditionCode: 'ic_weather_cloudy_day', max: 88.92, min: 72.23},
          {conditionCode: 'ic_weather_rainy_day', max: 84.96, min: 72.63},
          {conditionCode: 'ic_weather_rainy_day', max: 79.79, min: 70},
          {conditionCode: 'ic_weather_rainy_day', max: 77.63, min: 68.23},
        ],
        id: 'be05cff1-4f2f-47a1-a194-31396d7ff19c',
        state: 'Massachusetts',
        tempUnit: 'F',
        zipcode: '02128',
      },
    });
    expect(reducer.weatherInfo.current).toBe(85);
    expect(reducer.weatherInfo.weatherCode).toBe('ic_weather_cloudy_day');
  });

  test('Get only weather info', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: NotificationLabels.ONLY_WEATHER_INFO,
      data: {
        city: 'East Boston',
        country: 'United States',
        current: 85.82,
        currentConditionCode: 'ic_weather_cloudy_day',
        days: [
          {conditionCode: 'ic_weather_cloudy_day', max: 88.92, min: 72.23},
          {conditionCode: 'ic_weather_rainy_day', max: 84.96, min: 72.63},
          {conditionCode: 'ic_weather_rainy_day', max: 79.79, min: 70},
          {conditionCode: 'ic_weather_rainy_day', max: 77.63, min: 68.23},
        ],
        id: 'be05cff1-4f2f-47a1-a194-31396d7ff19c',
        state: 'Massachusetts',
        tempUnit: 'F',
        zipcode: '02128',
      },
    });
    expect(reducer.weatherInfo.current).toBe(85);
    expect(reducer.weatherInfo.weatherCode).toBe('ic_weather_cloudy_day');
  });

  test('Get unread notifications', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.UNREAD_HOMEOWNER_NOTIFICATION,
      data: 10,
    });
    expect(reducer.notificationsCount).toBe(10);
  });

  test('Get device list', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.GET_DEVICE_LIST,
      data: {
        data: [
          {
            autoTime: '1',
            createdDateTime: 1691705632152,
            deviceType: 'BCC50',
            gatewayId: 'maqId',
            homeOwnerId: 'be05cff1-4f2f-47a1-a194-31396d7ff19c',
            memo: "aunty's Marge bedro",
            online: '1',
          },
        ],
      },
    });
    expect(reducer.deviceList2.length).toBe(1);
  });

  test('Get device list (IDS)', () => {
    let reducer = HomeOwnerReducer(undefined, {
      type: HomeOwnerLabels.GET_DEVICE_LIST,
      data: {
        data: [
          {
            ODUInstalledAddress: [],
            ODUModelNumber: 'BOVB-36IDS3.0',
            ODUName: 'HeatPumpPrasannGuap',
            ODUSerialNumber: '399A-716-827827-8733958900',
            blueToothDetails: [],
            certCreateDate: '2023-07-28',
            commissionedStatus: 'COMMISSIONED',
            contractorId: '3165bd4c-b27f-4c5a-88f4-0a3603e66c05',
            contractorMonitoringStatus: true,
            createdBy: '3165bd4c-b27f-4c5a-88f4-0a3603e66c05',
            createdDateTime: 1690556119795,
            energyUsage: [],
            gatewayFirmwareVersion: '',
            gatewayId: '399A-716-827827-8733955691',
            homeOwnerId: 'be05cff1-4f2f-47a1-a194-31396d7ff19c',
            isRotateKey: false,
            lastModifiedBy: 'be05cff1-4f2f-47a1-a194-31396d7ff19c',
            lastModifiedDateTime: 1692299944758,
            lastWorkedOn: '07/28/2023',
            placeId: [],
            reminderNotificationsStateMachineExecution: [],
            serviceStartDate: '2023-07-28',
            time_zone: '-7',
          },
        ],
      },
    });
    expect(reducer.deviceList2.length).toBe(1);
  });

  test('Edit Device (IDS)', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.EDIT_DEVICE,
      data: {
        deviceName: 'testing',
        deviceId: '399A-716-827827-8733955691',
        isThermostat: false,
        deviceType: 'IDS Arctic',
      },
    });

    expect(reducer.deviceList2[1].deviceName).toBe('testing');
  });

  test('Edit Device (BCC)', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.EDIT_DEVICE,
      data: {
        deviceName: 'testing',
        deviceId: '98d863d2416a',
        isThermostat: true,
        deviceType: 'BCC50',
      },
    });

    expect(reducer.deviceList2[0].deviceName).toBe('testing Thermostat');
  });

  test('Update location settings', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_LOCATION_SETTINGS,
      data: {
        $metadata: {
          httpStatusCode: 200,
          requestId: '5b5d0984-d256-44a0-80bd-a8ff4fab0df8',
          cfId: 'ndRtTrfer9UDM0Jw3qgpAYraLLj3vqEVbV3yB_sRmSVWkqQITEPs3Q==',
          attempts: 1,
          totalRetryDelay: 0,
        },
        AddressNumber: '1',
        Country: 'USA',
        Geometry: {
          Point: [-118.40852, 33.94362],
        },
        Interpolated: false,
        Label:
          "Los Angeles Int'l Airport, 1 World Way, Los Angeles, CA 90045, United States",
        Municipality: 'Los Angeles',
        Neighborhood: 'Westchester',
        PostalCode: '90045',
        Region: 'California',
        Street: 'World Way',
        SubRegion: 'Los Angeles',
        TimeZone: {
          Name: 'America/Los_Angeles',
          Offset: -25200,
        },
      },
      suggestions: true,
      zone: '-7',
    });
    expect(reducer.selectedDevice.location).toBe(
      '90045,Los Angeles,California,United States',
    );
  });

  test('New device info', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.NEW_DEVICE_INFO,
      data: {
        deviceType: 'BCC101',
        macId: '34eae7c351e6',
        newDevice: true,
      },
    });
    expect(reducer.newDeviceInfo.macId).toBe('34eae7c351e6');
  });

  test('Device status', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DEVICE_STATUS_INFO,
      data: {
        autoC: '99',
        autoH: '57',
        autoT: '5.2',
        auto_time: '1',
        city: 'Los Angeles',
        code: '',
        country: 'United States',
        d_hour: '1',
        datetime: '2023-09-08 13:19:16',
        deadband: '2.0-2.0',
        device_id: '34eae7c30538',
        distr: '0',
        end_t: '30',
        f_cir_mode: '0',
        f_off_t: '40',
        f_on_t: '10',
        fan: '2',
        fanstatus: '1',
        firmware: '1.6.8',
        heat_type: '2-3-0',
        hold: '0',
        humidity: '49',
        message: 'Operation succeed',
        mode: '1',
        mode_name: 'Home',
        model: 'BCC100',
        model_id: '1',
        period_hour: '0',
        period_hour2: '0',
        period_minute: '0',
        period_minute2: '0',
        period_temp: '50.0-45.0',
        period_week: '5',
        power: '2',
        room_temp: '75.0',
        s_time: '3',
        screen: '3',
        start_t: '0',
        state: 'CA',
        sw: '57',
        t_auto: '1',
        t_humidity: '1-1-30',
        t_limit: '1',
        temp: '50.0-45.0',
        temp_high: '99',
        temp_low: '45',
        temp_unit: 'F',
        timeZoneName: 'America/Los_Angeles',
        timestamp: '1694193555893',
        type: '1',
        until_week: '6',
        warn_high: '99',
        warn_low: '57',
        wifiFirmware: '',
        zipcode: '90045',
        zone: '-4',
      },
    });
    expect(reducer.selectedDevice.roomTemp).toBe('75.0');
  });
  test('Device status', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SELECTED_DEVICE_INFO_BASED_ON_RESPONSE,
      data: {
        autoC: '99',
        autoH: '57',
        autoT: '5.2',
        auto_time: '1',
        city: 'Los Angeles',
        code: '',
        country: 'United States',
        d_hour: '1',
        datetime: '2023-09-08 13:19:16',
        deadband: '2.0-2.0',
        device_id: '34eae7c30538',
        distr: '0',
        end_t: '30',
        f_cir_mode: '0',
        f_off_t: '40',
        f_on_t: '10',
        fan: '2',
        fanstatus: '1',
        firmware: '1.6.8',
        heat_type: '2-3-0',
        hold: '0',
        humidity: '49',
        message: 'Operation succeed',
        mode: '1',
        mode_name: 'Home',
        model: 'BCC100',
        model_id: '1',
        period_hour: '0',
        period_hour2: '0',
        period_minute: '0',
        period_minute2: '0',
        period_temp: '50.0-45.0',
        period_week: '5',
        power: '2',
        room_temp: '75.0',
        s_time: '3',
        screen: '3',
        start_t: '0',
        state: 'CA',
        sw: '57',
        t_auto: '1',
        t_humidity: '1-1-30',
        t_limit: '1',
        temp: '50.0-45.0',
        temp_high: '99',
        temp_low: '45',
        temp_unit: 'F',
        timeZoneName: 'America/Los_Angeles',
        timestamp: '1694193555893',
        type: '1',
        until_week: '6',
        warn_high: '99',
        warn_low: '57',
        wifiFirmware: '',
        zipcode: '90045',
        zone: '-4',
      },
    });
    expect(reducer.selectedDevice.roomTemp).toBe('75.0');
  });

  test('Get Schedule list', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SCHEDULES,
      data: {
        macId: '98d863d2416a',
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
            mode: '3',
            model_id: '3',
            name: 'summer ',
            state: '0',
          },
          {
            default_home: 0,
            limit: '71-82',
            mode: '1',
            model_id: '4',
            name: 'nueva',
            state: '0',
          },
        ],
      },
    });
    expect(reducer.selectedDevice.schedules.length).toBe(4);
  });

  test('update thermostat temperature, mode 1', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_THERMOSTAT_TEMP,
      data: {
        unit: 'F',
        deviceId: '98d863d2416a',
        temp: `70.0-65.0`,
        hold: '0',
      },
    });
    expect(reducer.selectedDevice.coolingTemp).toBe('70.0');
  });

  test('update thermostat temperature, mode 2', () => {
    let newInitialState = {...initialState};
    newInitialState.mode = 2;
    let reducer = HomeOwnerReducer(initialState2, {
      type: HomeOwnerLabels.UPDATE_THERMOSTAT_TEMP,
      data: {
        unit: 'F',
        deviceId: '98d863d2416a',
        temp: `70.0-65.0`,
        hold: '0',
      },
    });
    expect(reducer.selectedDevice.coolingTemp).toBe('50.0');
  });

  test('update thermostat temperature, mode 3', () => {
    let newInitialState = {...initialState};
    newInitialState.mode = 3;
    let reducer = HomeOwnerReducer(initialState3, {
      type: HomeOwnerLabels.UPDATE_THERMOSTAT_TEMP,
      data: {
        unit: 'F',
        deviceId: '98d863d2416a',
        temp: `70.0-65.0`,
        hold: '0',
      },
    });
    expect(reducer.selectedDevice.coolingTemp).toBe('70.0');
  });

  test('lock device', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_LOCK_DEVICE,
      data: {
        lockDevice: true,
        code: '1234',
      },
    });
    expect(reducer.selectedDevice.code).toBe('1234');
  });

  test('update thermostat selected', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.THERMOSTAT_SELECTED,
      data: true,
    });
    expect(reducer.isThermostatSelected).toBe(true);
  });

  test('Set prev bcc', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.PREV_BCC,
      data: '123',
    });
    expect(reducer.previousBcc).toBe('123');
  });

  test('Save schedule', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SELECTED_SCHEDULE,
      data: '1',
    });
    expect(reducer.selectedSchedule).toBe('1');
  });

  test('Update schedule', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SCHEDULE,
      data: {
        macId: '98d863d2416a',
        modelId: '1',
        name: 'Home',
      },
    });
    expect(reducer.deviceList2[0].schedules[0].name).toBe('Home');
  });

  test('Update location', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_LOCATION,
      data: 'Guadalajara',
    });
    expect(reducer.weatherInfoLocation.city).toBe('Guadalajara');
  });

  test('Update timezone', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DATETIME_TIMEZONE,
      data: {
        timeZoneName: '-14',
      },
    });
    expect(reducer.selectedDevice.DateTime_TimeZone).toBe('-14');
  });

  test('Update datetime settings', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DATETIME_SETTINGS,
      data: '2023-08-09 12:30',
      setting: 'datetime',
    });
    expect(reducer.selectedDevice.datetime).toBe('2023-08-09 12:30');
  });

  test('Update auto settings', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DATETIME_SETTINGS,
      data: true,
      setting: 'auto',
    });
    expect(reducer.selectedDevice.auto_time).toBe(true);
  });

  test('Update auto settings', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DATETIME_SETTINGS,
      data: '12:30',
      setting: 'hour',
    });
    expect(reducer.selectedDevice.d_hour).toBe('12:30');
  });

  test('Update app unit temp', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_WEATHER_ON_FAHRENHEIT,
      data: {
        unit: 'F',
        timestamp: `${new Date().valueOf()}`,
      },
      weatherInfo: {
        current: '70',
        currentConditionCode: '',
        days: [],
      },
    });
    expect(reducer.actualWeatherOnFahrenheit).toBe(true);
  });

  test('Update user first login', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.USER_FIRST_LOGIN,
      data: true,
    });
    expect(reducer.isUserFirstLogin).toBe(true);
  });

  test('Update energy usage data', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.ENERGY_USAGE_DATA,
      data: true,
    });
    expect(reducer.energyData).toBe(true);
  });

  test('Update IDS device list', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.DEVICE_LIST,
      data: [],
      isTermsConditionsAccepted: true,
    });
    expect(reducer.isTermsConditionsAccepted).toBe(true);
  });

  test('Update app unit temp', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.ACTUAL_WEATHER_TYPE,
      data: true,
    });
    expect(reducer.actualWeatherOnFahrenheit).toBe(true);
  });

  test('Update vibration', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_VIBRATION,
      data: false,
    });
    expect(reducer.hapticVibration).toBe(false);
  });

  test('Save schedule on store', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.SAVE_SCHEDULE_ON_STORE,
      data: {
        macId: '98d863d2416a',
        modelId: '1',
        mode: 1,
        state: '0',
        limit: '71-82',
        name: 'test',
        unit: 'F',
        data: {
          items1: [{t: '78.0-70.0', c: '0', h: '0'}],
          items2: [{t: '78.0-70.0', c: '0', h: '0'}],
          items3: [{t: '78.0-70.0', c: '0', h: '0'}],
          items4: [{t: '78.0-70.0', c: '0', h: '0'}],
          items5: [{t: '78.0-70.0', c: '0', h: '0'}],
          items6: [{t: '78.0-70.0', c: '0', h: '0'}],
          items7: [{t: '78.0-70.0', c: '0', h: '0'}],
        },
      },
    });
    expect(reducer.selectedDevice.schedules.length).toBe(5);
  });

  test('Delete schedule', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.DELETE_SCHEDULE,
      data: {
        deviceId: '98d863d2416a',
        modelId: '1',
      },
    });
    expect(reducer.selectedDevice.schedules.length).toBe(3);
  });

  test('Select no schedule', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.SELECT_NO_SCHEDULE,
    });
    expect(reducer.selectedDevice.isOnSchedule).toBeFalsy();
  });

  test('Get device information', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_DEVICE_INFORMATION,
      data: {
        deviceId: '98d863d2416a',
        hd: '1.2.3',
        model: 'BCC101',
        sw: '1.2.3',
      },
    });
    expect(reducer.deviceInformation.hd).toBe('1.2.3');
  });

  test('Update thermostat mode', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_THERMOSTAT_MODE,
      data: {
        device_id: '98d863d2416a',
        //model_id: '0',
        mode: '1',
        distr: '1',
      },
    });
    expect(reducer.deviceList2[0].mode).toBe(1);
  });

  test('Update fan mode', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_FAN_MODE,
      data: {
        device_id: '98d863d2416a',
        fan: '2',
        timestamp: '',
        f_on_t: '10',
        f_off_t: '10',
        f_cir_mode: '0',
        start_t: '120',
        end_t: '120',
      },
    });
    expect(reducer.selectedDevice.fanMode).toBe('2');
  });
  test('Update accessories', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SELECTED_ACCESORY,
      data: {
        deviceId: '98d863d2416a',
        t_humidity: '1-1-2',
      },
      device_id: '98d863d2416a',
    });
    expect(reducer.selectedDevice.isAccessoryAdded).toBe('1');
  });

  test('Update fan on', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_FAN_ON_FOR,
      data: true,
    });
    expect(reducer.fanOnFor).toBe(true);
  });

  test('Update fan off', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_FAN_OFF_FOR,
      data: false,
    });
    expect(reducer.fanOffFor).toBe(false);
  });
  test('Update fan schedule start', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SCHEDULED_START,
      data: true,
    });
    expect(reducer.fanScheduledStart).toBe(true);
  });
  test('Update fan schedule end', () => {
    let reducer = HomeOwnerReducer(initialState, {
      type: HomeOwnerLabels.UPDATE_SCHEDULED_END,
      data: false,
    });
    expect(reducer.fanScheduledEnd).toBe(false);
  });
});
