import {showToast} from '../../components/CustomToast';
import {
  ENERGY_USAGE_DATA,
  DEVICE_LIST,
  SELECTED_DEVICE,
  SELECTED_IDS_DEVICE,
  SELECTED_IDS_DEVICE_TYPE,
  CLEAN_SELECTED_IDS_DEVICE_TYPE,
  DEVICE_STATUS,
  DEVICE_DETAILS,
  HEAT_PUMP_INFO,
  UPDATE_HEAT_PUMP_INFO,
  RELOAD_HEAT_PUMP_INFO,
  NO_RELOAD_HEAT_PUMP_INFO,
  ADD_NEW_UNIT,
  EDIT_UNIT_INFO,
  UPDATE_MONITORING_STATUS,
  NOTIFICATION_LIST,
  // GET_HOMEOWNERCOUNT,
  UPDATE_HOMEOWNERCOUNT,
  CLEAR_HOMEOWNERCOUNT,
  UPDATE_HOMEOWNER_NOTIFICATIONS,
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
  SAVE_NEW_SCHEDULE_BCC_50,
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
  UTILITY_ENERGY_SAVINGS,
  GET_UTILITY_ENERGY_SAVINGS,
  REMOVE_NOTIFICATION,
  WEATHER_INFO,
  LOCATION_SUGGESTIONS,
  UPDATE_LOCATION_SETTINGS,
  UPDATE_DATETIME_SETTINGS,
  UPDATE_LOCATION_PLACEID,
  SAVE_DATE_BCC50,
  SAVE_TIME_BCC50,
  SCHEDULE_SELECTED_BCC50,
  SAVE_SCHEDULE_BCC50,
  UPDATE_INFO_UNIT_CONFIGURATION,
  RESET_INFO_UNIT_CONFIGURATION,
  UPDATE_DATETIME_TIMEZONE,
  SELECTED_IDS,
  SELECT_BCC,
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
  PLACE_ID_INFORMATION,
  UPDATE_DEVICE_OPTOUT,
  ONLY_WEATHER_INFO,
} from '../labels/NotificationLabels';

import {
  apiInterceptorForGet,
  apiInterceptorForGetIDS,
  apiInterceptorForPostIDS,
  apiInterceptorForGetCustomApi,
  apiInterceptorForPost,
  apiInterceptorForPostCustomApi,
  apiInterceptorForPut,
  turnOnLoader,
  turnOffLoader,
} from './CommonActions';

import {
  connectWIFI,
  getInitialConfiguration,
  connectTCP,
  connectTCPPromise,
  sendSchedule,
  exitCommand,
  closeTCP,
  calculatePasswordDevice,
} from '../../utils/HotSpotFunctions';

export const getUsageGraphByDeviceId = deviceId => {
  return async dispatch => {
    const path = '/energyusage/' + deviceId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: ENERGY_USAGE_DATA, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getUsageGraphByDeviceId2 = (deviceId: string) => {
  return async dispatch => {
    const path = '/energyusage/' + deviceId;
    apiInterceptorForGetIDS(
      dispatch,
      path,
      response => {
        dispatch({type: ENERGY_USAGE_DATA, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateIdsSelectedDeviceAccess = (input, serviceStartDate) => {
  return async dispatch => {
    dispatch({
      type: SELECTED_IDS,
      data: input,
      serviceStartDate: serviceStartDate,
    });
  };
};

export const updateIdsSelectedDevice = macId => {
  return async dispatch => {
    dispatch({
      type: SELECTED_IDS_DEVICE,
      data: macId,
    });
  };
};

export const updateIdsSelectedDeviceType = deviceType => {
  return async dispatch => {
    dispatch({type: SELECTED_IDS_DEVICE_TYPE, data: deviceType});
  };
};

export const cleanIdsSelectedDeviceType = () => {
  return async dispatch => {
    dispatch({type: CLEAN_SELECTED_IDS_DEVICE_TYPE});
  };
};

export const UPDATE_BCC50MACID = scannedData => {
  let strMcID = scannedData.split('_');
  return async dispatch => {
    dispatch({type: UPDATE_BCC50_MACID, data: strMcID[0]});
  };
};

export const connectTCPAction = async (SSID, Password, scannedData, fStep) => {
  //connectTCP();
  await connectTCPPromise(SSID, Password, scannedData);
  await fStep();
};

export const exitCom = () => {
  exitCommand();
  //connectTCPPromise('', '', '', false);
  closeTCP();
};

export const connectWifi = (SSID, Password, scannedData) => {
  connectWIFI(SSID, Password, scannedData);
  /*return async (dispatch) => {
    dispatch({type: _FLAG});
    successCallback();
  };*/
};

export const getInitConf = async (iniConf, sch, successCallback) => {
  let ans = await getInitialConfiguration(iniConf, sch);
  //let ans = await getInitialConfiguration(initialConfiguration, sch);
  if (sch.exist) {
    if (ans.answerSchedule) {
      //showToast('Successfully connected', 'info');
      successCallback(true);
    } else {
      showToast('The connection was not successful', 'error');
    }
  } else {
    if (ans.answerInConfig) {
      showToast('Successfully connected', 'info');
      successCallback(true);
    } else {
      showToast('The connection was not successful', 'error');
    }
  }
};

export const setSchedule = sch => {
  sendSchedule(sch);
};

export const calculateDevicePassword = scanData => {
  let pwdDevice = calculatePasswordDevice(scanData);
  return pwdDevice;
};

export const updateLocation = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    let city = input.Municipality;
    let timeZoneSelected = input.TimeZone.Name.toString();
    var Moment = require('moment-timezone');
    let stringTimeZone = Moment().tz(timeZoneSelected).format().split('T');
    let stringTimeZoneTime = stringTimeZone[1].toString().substring(0, 8);
    let stringZone = stringTimeZone[1].toString().substring(8).split(':');
    let zone = Number(stringZone[0]);
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      '/device/set_location',
      {
        timestamp: `${new Date().valueOf()}`,
        city: city,
        country: input.Country === 'USA' ? 'United States' : 'Canada',
        state: input.Region,
        zipcode: input.PostalCode,
        zone: zone.toString(),
        placeId: input,
      },
      responseL => {
        if (responseL.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_LOCATION,
            data: city,
          });
        } else {
          showToast('There was a problem. ' + responseL.message, 'error');
        }
      },
    );
  };
};

export const updateThermostatMode = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/control/change_mode';
    console.log('petition started');
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.device_id,
        //model_id: input.model_id,
        mode: input.mode,
        distr: input.distr,
        timestamp: `${new Date().valueOf()}`,
      },
      successCallback,
      null,
      true,
    ).then(response => {
      dispatch({type: UPDATE_THERMOSTAT_MODE, data: input});
    });
  };
};

/*export const updateThermostatMode = (input, successCallback) => {
  return async (dispatch) => {
    const path = '/development/tj610b/changemodel';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.device_id,
        model_id: input.model_id,
        mode: input.mode,
        distr: input.distr,
        api_id: '123',
        timestamp: new Date().valueOf(),
        sign: '12345',
      },
      successCallback,
    ).then((response) => {
      dispatch({type: UPDATE_THERMOSTAT_MODE, data: input});
    });
  };
};*/

export const getDeviceInformation = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = `/device/device_info?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    apiInterceptorForGetCustomApi(dispatch, baseUrl, path, null, response => {
      if (response.message === 'Operation succeed') {
        dispatch({
          type: UPDATE_DEVICE_INFORMATION,
          data: {
            deviceId: response.device_id,
            hd: response.hd,
            model: response.model,
            sw: response.sw,
          },
        });
      } else {
        showToast('Device information is not available at this time.', 'error');
      }
    });
  };
};

export const updateFanMode = (input, successCallback) => {
  return async dispatch => {
    const path = '/control/fan';
    apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      {
        device_id: input.device_id,
        fan: input.fan,
        timestamp: input.timestamp,
        f_on_t: input.f_on_t,
        f_off_t: input.f_off_t,
        f_cir_mode: input.f_cir_mode,
        start_t: input.start_t,
        end_t: input.end_t,
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({type: UPDATE_FAN_MODE, data: input});
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
    );
  };
};

export const updateFanOnFor = input => {
  return async dispatch => {
    dispatch({type: UPDATE_FAN_ON_FOR, data: input});
  };
};

export const updateFanOffFor = input => {
  return async dispatch => {
    dispatch({type: UPDATE_FAN_OFF_FOR, data: input});
  };
};

export const updateFanScheduledStart = input => {
  return async dispatch => {
    dispatch({type: UPDATE_SCHEDULED_START, data: input});
  };
};

export const updateFanScheduledEnd = input => {
  return async dispatch => {
    dispatch({type: UPDATE_SCHEDULED_END, data: input});
  };
};

export const getScheduleFullInformation = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const getModelInfoUrl = `/schedule/get_model_info?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}&model_id=${input.modelId}`;
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      getModelInfoUrl,
      null,
      responseGet => {
        delete responseGet.data.unit;
        dispatch({type: UPDATE_SELECTED_SCHEDULE_FULL, data: responseGet.data});
      },
    );
  };
};

export const selectNoScheduleOnStore = () => {
  return async dispatch => {
    turnOffLoader(dispatch, '/control/change_mode');
    dispatch({
      type: SELECT_NO_SCHEDULE,
    });
  };
};

export const selectNoSchedule = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const changeModeEndpoint = '/control/change_mode';
    turnOnLoader(dispatch, '/control/change_mode');
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      changeModeEndpoint,
      {
        device_id: input.deviceId,
        mode: input.mode,
        distr: input.distr,
        timestamp: `${new Date().valueOf()}`,
      },
      response => {
        if (response.message === 'Operation succeed') {
          successCallback();
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
    );
  };
};

export const selectNoScheduleOnboardingBcc101 = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const changeModeEndpoint = '/control/change_mode';
    //turnOnLoader(dispatch, '/control/change_mode');
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      changeModeEndpoint,
      {
        device_id: input.deviceId,
        mode: input.mode,
        distr: input.distr,
        timestamp: `${new Date().valueOf()}`,
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: SELECT_NO_SCHEDULE,
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const getDeviceListPairUnpair = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const endpoint = '/device/list';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      endpoint,
      null,
      response => {
        dispatch({type: GET_DEVICE_LIST, data: response});
      },
    );
  };
};

export const getDeviceListEditDevice = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const endpoint = '/device/list';
    turnOnLoader(dispatch, endpoint);
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      endpoint,
      null,
      response => {
        setTimeout(() => {
          turnOffLoader(dispatch, endpoint);
        }, 3000);

        successCallback(response);
        //dispatch({type: GET_DEVICE_LIST, data: response});
      },
      null,
      true,
    );
  };
};

export const updateActualWeather = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/user/tempunit';
    apiInterceptorForPostCustomApi(dispatch, baseUrl, path, input, response => {
      if (response.message === 'Operation succeed') {
        const pathWeather = '/development/device/weather';
        const baseUrlWeather =
          'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
        apiInterceptorForGetCustomApi(
          dispatch,
          baseUrlWeather,
          pathWeather,
          null,
          responseW => {
            if (responseW.message === 'Operation succeed') {
              dispatch({
                type: UPDATE_WEATHER_ON_FAHRENHEIT,
                data: input,
                weatherInfo: responseW,
              });
            } else {
              if (responseW.message !== 'Missing weather location') {
                showToast('Something went wrong updating temp unit.', 'error');
              }
            }
          },
        );
      } else {
        showToast('Something went wrong updating temp unit.', 'error');
      }
    });
  };
};

export const updateHapticVibration = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/user/sethapticvibration';
    apiInterceptorForPostCustomApi(dispatch, baseUrl, path, input, response => {
      if (response.message === 'Operation succeed') {
        dispatch({type: UPDATE_HAPTIC, data: input});
      } else {
        showToast('Something went wrong updating haptic vibration.', 'error');
      }
    });
  };
};

export const getTempUnitAndHaptic = () => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/user/gettempunitandhaptic';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      path,
      {},
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({type: TEMP_UNIT_AND_HAPTIC, data: response});
        } else {
          showToast(
            'Something went wrong getting haptic information.',
            'error',
          );
          dispatch({type: UPDATE_COUNTER});
        }
      },
      null,
      true,
    );
  };
};

export const getDeviceList2 = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const endpoint = '/device/list';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      endpoint,
      null,
      response => {
        if (response.data) {
          dispatch({type: GET_DEVICE_LIST, data: response});
        } else {
          if (input.counter === 0) {
            dispatch({type: DEVICE_LIST_COUNTER});
          } else if (input.counter === 1) {
            showToast('There was a problem getting the device list.', 'error');
            dispatch({type: RESET_COUNTER});
          }
        }
      },
      null,
      true,
    );
  };
};

export const getDeviceListWhenDeleting = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const endpoint = '/device/list';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      endpoint,
      null,
      response => {
        //successCallback();
        //setTimeout(() => {
        dispatch({
          type: DEVICE_LIST_DELETING,
          data: response,
          isThermostat: input.isThermostat,
          macId: input.macId,
        });
        if (input.isThermostat) {
          turnOffLoader(dispatch, '/development/device/remove');
        } else {
          setTimeout(() => {
            turnOffLoader(dispatch, '/homeowner/deleteappliance');
          }, 1000);
        }

        //}, 2000);
      },
      null,
      true,
    );
  };
};

export const deleteScheduleOnStore = input => {
  return async dispatch => {
    turnOffLoader(dispatch, '/schedule/delete_schedule');
    dispatch({
      type: DELETE_SCHEDULE,
      data: {
        deviceId: input.deviceId,
        modelId: input.modelId,
      },
    });
  };
};

export const deleteSchedule = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const deleteEndpoint = '/schedule/delete_schedule';
    turnOnLoader(dispatch, '/schedule/delete_schedule');
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      deleteEndpoint,
      {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        model_id: input.modelId,
      },
      response => {
        if (response.message === 'Operation succeed') {
          successCallback();
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
    );
  };
};

export const deleteScheduleOnboardingBcc101 = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const deleteEndpoint = '/schedule/delete_schedule';
    //turnOnLoader(dispatch, '/schedule/delete_schedule');
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      deleteEndpoint,
      {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        model_id: input.modelId,
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: DELETE_SCHEDULE,
            data: {
              deviceId: input.deviceId,
              modelId: input.modelId,
            },
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const deleteScheduleNoEndPoint = input => {
  return async dispatch => {
    dispatch({
      type: DELETE_SCHEDULE,
      data: {
        deviceId: input.deviceId,
        modelId: input.modelId,
      },
    });
  };
};

export const updateLockDevice = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/config/device_lock';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        type: input.lockDevice ? '0' : '1',
        code: input.code,
      },
      response => {
        console.log('petition completed');
        if (response.message === 'Operation succeed') {
          if (successCallback) {
            successCallback();
          }

          dispatch({
            type: UPDATE_LOCK_DEVICE,
            data: {
              lockDevice: input.lockDevice,
              code: input.code,
            },
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      null,
      true,
    );
  };
};

/*

setTimeout(async () => {
          const pathStatus = `/control/status?device_id=${
            input.device_id
          }&timestamp=${new Date().valueOf()}`;
          await apiInterceptorForGetCustomApi(
            dispatch,
            'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
            pathStatus,
            null,
            async (responseStatus) => {
              successCallback(responseStatus);
              await dispatch({
                type: UPDATE_DEVICE_STATUS_INFO,
                data: responseStatus,
              });
              turnOffLoader(dispatch, path);
            },
            null,
            true,
          );
        }, 3000);
*/

export const deviceStatusWithTemperature = (input, successCallback) => {
  return async dispatch => {
    const pathStatus = `/control/status?device_id=${
      input.device_id
    }&timestamp=${new Date().valueOf()}`;
    await apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      pathStatus,
      null,
      responseStatus => {
        successCallback(responseStatus);
        //dispatch({
        //  type: UPDATE_DEVICE_STATUS_INFO,
        //  data: responseStatus,
        //});
        turnOffLoader(dispatch, '/config/temp_unit');
      },
      null,
      true,
    );
  };
};

export const updateTemperatureUnitWithStatus = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/config/temp_unit';
    turnOnLoader(dispatch, path);
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        device_id: input.device_id,
        timestamp: `${new Date().valueOf()}`,
        unit: input.unit,
      },
      async response => {
        if (response.message === 'Operation succeed') {
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }

        //turnOffLoader(dispatch, path);
      },
      null,
      true,
    );
  };
};

export const updateTemperatureUnit = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/config/temp_unit';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        device_id: input.device_id,
        timestamp: `${new Date().valueOf()}`,
        unit: input.unit,
      },
      response => {},
    );
  };
};

export const updateFirmware = (input, successCallback, errorCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/device/begin_migration';
    console.log('se manda llamar', {
      deviceId: input.deviceId,
      code: input.code,
    });
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        deviceId: input.deviceId,
        code: input.code,
      },
      response => {
        if (response.message === 'verificationCode saved successfully') {
          successCallback();
        } else {
          showToast(`Something went wrong. ${response.message}.`, 'error');
          errorCallback();
        }
        console.log('response', response);
      },
    );
  };
};

export const updateTemperatureSetting = input => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const path = '/config/temp_settings';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        device_id: input.device_id,
        timestamp: `${new Date().valueOf()}`,
        low: input.low,
        high: input.high,
        t_limit: input.t_limit,
        t_auto: input.t_auto,
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_TEMPERATURE_SETTINGS,
            data: {
              low: input.low,
              high: input.high,
              t_limit: input.t_limit,
              t_auto: input.t_auto,
            },
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const updateThermostatSelected = input => {
  return async dispatch => {
    dispatch({type: THERMOSTAT_SELECTED, data: input.data});
  };
};

export const updateScheduleOnStore = input => {
  return async dispatch => {
    dispatch({
      type: UPDATE_SCHEDULE,
      data: {
        macId: input.deviceId,
        modelId: input.modelId,
        name: input.name,
      },
    });
  };
};

export const updateScheduleOnBoardingBcc101 = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const getModelInfoUrl = `/schedule/get_model_info?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}&model_id=${input.modelId}`;
    //turnOnLoader(dispatch, '/schedule/set_model_info');
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      getModelInfoUrl,
      null,
      responseGet => {
        const setModelInfoPath = `/schedule/set_model_info`;
        if (responseGet.message === 'Operation succeed') {
          apiInterceptorForPostCustomApi(
            dispatch,
            baseUrl,
            setModelInfoPath,
            {
              device_id: input.deviceId,
              timestamp: `${new Date().valueOf()}`,
              mode: `${responseGet.mode}`,
              state: input.updatedState,
              limit: responseGet.limit,
              name: input.name,
              model_id: input.modelId,
              data: responseGet.data,
            },
            responseSet => {
              if (responseSet.message === 'Operation succeed') {
                //turnOffLoader(dispatch, '/schedule/set_model_info');
                //successCallback();
                dispatch({
                  type: UPDATE_SCHEDULE,
                  data: {
                    macId: input.deviceId,
                    modelId: input.modelId,
                    name: input.name,
                  },
                });
              } else {
                //TODO: the set failed
                //turnOffLoader(dispatch, '/schedule/set_model_info');
                showToast('Something went wrong.', 'error');
              }
            },
            null,
            true,
          );
        } else {
          //TODO: the get failed
          //turnOffLoader(dispatch, '/schedule/set_model_info');
          showToast('Something went wrong.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const updateSchedule = (input, successCallback) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const getModelInfoUrl = `/schedule/get_model_info?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}&model_id=${input.modelId}`;
    turnOnLoader(dispatch, '/schedule/set_model_info');
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      getModelInfoUrl,
      null,
      responseGet => {
        const setModelInfoPath = `/schedule/set_model_info`;
        if (responseGet.message === 'Operation succeed') {
          apiInterceptorForPostCustomApi(
            dispatch,
            baseUrl,
            setModelInfoPath,
            {
              device_id: input.deviceId,
              timestamp: `${new Date().valueOf()}`,
              mode: `${responseGet.mode}`,
              state: input.updatedState,
              limit: responseGet.limit,
              name: input.name,
              model_id: input.modelId,
              data: responseGet.data,
            },
            responseSet => {
              if (responseSet.message === 'Operation succeed') {
                //turnOffLoader(dispatch, '/schedule/set_model_info');
                successCallback();
                dispatch({
                  type: UPDATE_SCHEDULE,
                  data: {
                    macId: input.deviceId,
                    modelId: input.modelId,
                    name: input.name,
                  },
                });
              } else {
                //TODO: the set failed
                turnOffLoader(dispatch, '/schedule/set_model_info');
                showToast('Something went wrong.', 'error');
              }
            },
            null,
            true,
          );
        } else {
          //TODO: the get failed
          turnOffLoader(dispatch, '/schedule/set_model_info');
          showToast('Something went wrong.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const updateScheduleNoEndPoint = input => {
  return async dispatch => {
    dispatch({
      type: UPDATE_SCHEDULE,
      data: {
        macId: input.deviceId,
        modelId: input.modelId,
        name: input.name,
      },
    });
  };
};

export const setScheduleInfo = () => {
  return async dispatch => {
    dispatch({type: UPDATE_SCHEDULE_INFO});
  };
};

export const saveScheduleOnStore = input => {
  return async dispatch => {
    dispatch({
      type: SAVE_SCHEDULE_ON_STORE,
      data: {
        macId: input.deviceId,
        modelId: input.modelId,
        mode: input.mode,
        state: input.state,
        limit: input.limit,
        name: input.name,
        unit: input.unit,
        data: input.data,
      },
    });
  };
};

export const updatePeriodWhenCopy = input => {
  return async dispatch => {
    dispatch({
      type: UPDATE_SELECTED_SCHEDULE,
      data: input.model_id,
    });
  };
};

export const saveSchedule = (input, successCallback) => {
  return async dispatch => {
    const path = `/schedule/set_model_info`;
    apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        mode: `${input.mode}`,
        state: input.state,
        limit: input.limit,
        name: input.name,
        model_id: input.modelId,
        data: input.data,
      },
      response => {
        if (response.message === 'Operation succeed') {
          successCallback(response);
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      null,
      true,
    );
  };
};

export const setSelectedSchedule = input => {
  return async dispatch => {
    dispatch({type: UPDATE_SELECTED_SCHEDULE, data: input});
  };
};

export const saveNewScheduleBCC50 = input => {
  return async dispatch => {
    dispatch({type: SAVE_NEW_SCHEDULE_BCC_50, data: input});
  };
};

export const getDeviceStatusWhenChangingSchedule = (input, successCallback) => {
  return async dispatch => {
    const path = `/control/status?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      response => {
        if (response.message !== 'Operation succeed') {
          turnOffLoader(dispatch, '/schedule/set_model_info');
          successCallback();
        } else {
          turnOffLoader(dispatch, '/schedule/set_model_info');
          dispatch({
            type: UPDATE_DEVICE_STATUS_INFO_SHEDULE,
            data: response,
          });
        }
      },
      null,
      true,
    );
  };
};

export const getDeviceStatusWithNoLoadingScreen = (input, successCallback) => {
  return async dispatch => {
    const path = `/control/status?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      response => {
        if (response.message !== 'Operation succeed') {
          successCallback();
        } else {
          dispatch({
            type: UPDATE_DEVICE_STATUS_INFO,
            data: response,
          });
        }
      },
      null,
      true,
    );
  };
};

export const getResourceStatus = input => {
  return async dispatch => {
    const path = `/resourcestatus`;
    const baseUrl =
      'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com/development';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        resourceId: input.gatewayId,
      },
      response => {
        if (response.error) {
          showToast(response.error.message, 'error');
        } else {
          dispatch({type: RESOURCE_STATUS, data: response.data});
        }
      },
      error => {
        showToast(error.message, 'error');
      },
    );
  };
};

export const getLocationSuggestions = input => {
  return async dispatch => {
    const path = `/device/suggestionsplaceid?countryCode=${input.countryCode}&text=${input.location}`;
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      path,
      null,
      response => {
        dispatch({type: LOCATION_SUGGESTIONS, data: response.Results});
      },
      null,
      true,
    );
  };
};

export const getPlaceIdInformation = input => {
  return async dispatch => {
    const path = `/device/getplaceid?placeid=${input}`;
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    apiInterceptorForGetCustomApi(dispatch, baseUrl, path, null, response => {
      dispatch({type: PLACE_ID_INFORMATION, data: response.Place});
    });
  };
};

export const getDeviceStatus = (input, successCallback) => {
  return async dispatch => {
    const path = `/control/status?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    await apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      async response => {
        console.log('response status', response);
        successCallback(response);
        await dispatch({
          type: UPDATE_DEVICE_STATUS_INFO,
          data: response,
        });
      },
    );
  };
};

export const getDeviceStatusSchedule = (input, successCallback) => {
  return async dispatch => {
    const path = `/control/status?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    await apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      async response => {
        successCallback(response);
        await dispatch({
          type: UPDATE_DEVICE_STATUS_INFO,
          data: response,
        });
      },
      null,
      true,
    );
  };
};

export const updateSelected = input => {
  return async dispatch => {
    //let wasChanged = false;
    //let newInput = {...input};

    /*let temps = newInput.temp.split('-'); // 0 - cooling, 1 - heating
    if (parseInt(temps[1]) + parseInt(newInput.autoT) > parseInt(temps[0])) {
      let degreesToMove =
        parseInt(temps[1]) - parseInt(temps[0]) + parseInt(newInput.autoT);
      if (newInput.temp_unit === 'F') {
        if (parseInt(temps[0]) + degreesToMove <= 99) {
          //sumar deadband a cool
          wasChanged = true;
          newInput.temp = `${(parseInt(temps[0]) + degreesToMove)
            .toFixed(1)
            .toString()}-${temps[1]}`;
        } else if (parseInt(temps[1]) - degreesToMove >= 45) {
          //restar deadband a heating
          wasChanged = true;
          newInput.temp = `${temps[0]}-${(parseInt(temps[1]) - degreesToMove)
            .toFixed(1)
            .toString()}`;
        }
      } else {
        if (parseInt(temps[0]) + degreesToMove <= 38) {
          //sumar deadband a cool
          wasChanged = true;
          newInput.temp = `${(parseInt(temps[0]) + degreesToMove)
            .toFixed(1)
            .toString()}-${temps[1]}`;
        } else if (parseInt(temps[1]) - degreesToMove >= 7) {
          //restar deadband a heating
          wasChanged = true;
          newInput.temp = `${temps[0]}-${(parseInt(temps[1]) - degreesToMove)
            .toFixed(1)
            .toString()}`;
        }
      }
    }*/
    /*if (wasChanged) {
      const tempPath = '/development/control/temp';
 
      return apiInterceptorForPostCustomApi(
        dispatch,
        'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
        tempPath,
        {
          device_id: newInput.device_id,
          temp: newInput.temp,
          hold: newInput.hold,
          //unit: input.unit,
          timestamp: `${new Date().valueOf()}`,
        },
        () => {
          dispatch({
            type: UPDATE_SELECTED_DEVICE_INFO_BASED_ON_RESPONSE,
            data: {...newInput},
          });
        },
        null,
        true,
      );
    }*/
    dispatch({
      type: UPDATE_SELECTED_DEVICE_INFO_BASED_ON_RESPONSE,
      data: {...input},
    });
  };
};

export const endEventBanner = input => {
  return async dispatch => {
    const baseUrl =
      'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com/testing_evn';
    const path = '/updateoptout';

    apiInterceptorForPost(
      dispatch,
      path,
      {
        resourceId: input.macId,
      },
      response => {
        dispatch({type: REMOVE_BANNER});
      },
      error => {
        showToast('There was a problem. Try again later.', 'error');
      },
      'ttnacloudplatform-api-3.0',
    );
  };
};

export const getWeatherInfoWithNoLoading = (input, caseToCall) => {
  return async dispatch => {
    const path = '/development/device/weather';
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      path,
      null,
      response => {
        if (caseToCall) {
          dispatch({
            type: WEATHER_INFO,
            data: response,
          });
        } else {
          dispatch({
            type: ONLY_WEATHER_INFO,
            data: response,
          });
        }
      },
      null,
      true,
    );
  };
};

export const getWeatherInfo = (input, caseToCall) => {
  return async dispatch => {
    const path = '/development/device/weather';
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    apiInterceptorForGetCustomApi(dispatch, baseUrl, path, null, response => {
      if (response.message === 'Operation succeed') {
        if (caseToCall) {
          dispatch({
            type: WEATHER_INFO,
            data: response,
          });
        } else {
          dispatch({
            type: ONLY_WEATHER_INFO,
            data: response,
          });
        }
      } else {
        //showToast('Error getting weather information.', 'error');
        dispatch({type: UPDATE_COUNTER});
      }
    });
  };
};

export const cleanSelectedDevice = () => {
  return async dispatch => {
    dispatch({
      type: CLEAN_SELECTED_DEVICE,
    });
  };
};

export const getScheduleList = (input, successCallback) => {
  return async dispatch => {
    const path = `/schedule/get_model_list?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      response => {
        console.log('schedule list', response);
        dispatch({
          type: UPDATE_SCHEDULES,
          data: {macId: input.deviceId, schedules: response.data},
        });
      },
      null,
      true,
    );
  };
};

export const checkNewDevice = (input, successCallback, errorCallback) => {
  return async dispatch => {
    const path = '/development/device/check';
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        deviceId: input.deviceId,
        code: input.code,
        model: input.model,
      },
      response => {
        console.log('response', response);
        if (response.error && response.error !== '0') {
          errorCallback(response.error);
        } /* else if (response.error_code !== undefined) {
          console.log('asdf');
          errorCallback('205 : Firmware update required');
          //showToast(response.error_code.message, 'error');
        }*/ else if (
          (response.message && response.message.includes('error')) ||
          (response.message && response.message === 'Invalid request body') ||
          (response.message &&
            response.message.toLowerCase() ===
              'user is not authorized to access this resource')
        ) {
          showToast(response.message, 'error');
        } else {
          successCallback();
        }
      },
      null,
      true,
    );
  };
};

export const newDeviceInfo = input => {
  return async dispatch => {
    dispatch({type: NEW_DEVICE_INFO, data: input});
  };
};

export const addNewDevice = (input, successCallback, errorCallback) => {
  return async dispatch => {
    const path = '/development/device/add';
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    //https://9hiwm1jm25.execute-api.us-east-1.amazonaws.com/development/device/add
    //const baseUrl = 'https://9hiwm1jm25.execute-api.us-east-1.amazonaws.com';

    let geometry = undefined;
    let auxPlaceId = undefined;
    let newPlaceId = undefined;
    let body = {};
    if (input.placeId.TimeZoneData !== undefined) {
      geometry = {
        ...input.placeId.TimeZoneData,
      };
      auxPlaceId = input.placeId;
      delete auxPlaceId.TimeZoneData;
      if (auxPlaceId.isOnSchedule !== undefined) {
        delete auxPlaceId.isOnSchedule;
      }

      newPlaceId = {
        ...geometry,
        ...auxPlaceId,
      };
      body = {
        deviceId: input.deviceId,
        userId: input.userId,
        deviceName: input.deviceName,
        city: input.city,
        state: input.state,
        zipcode: input.zipcode,
        country: input.country,
        deviceType: input.deviceType,
        placeId: newPlaceId,
      };
    } else {
      body = {
        deviceId: input.deviceId,
        userId: input.userId,
        deviceName: input.deviceName,
        city: input.city,
        state: input.state,
        zipcode: input.zipcode,
        country: input.country,
        deviceType: input.deviceType,
      };
    }

    turnOnLoader(dispatch, path);

    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      body,
      response => {
        if (response.message !== 'Operation succeed') {
          turnOffLoader(dispatch, path);
          errorCallback(response.message);
        } else {
          //____
          const endpointList = '/development/device/list';
          apiInterceptorForGetCustomApi(
            dispatch,
            baseUrl,
            endpointList,
            null,
            responseL => {
              if (responseL.data) {
                dispatch({type: GET_DEVICE_LIST, data: responseL});
                turnOffLoader(dispatch, path);
                successCallback();
              } else {
                turnOffLoader(dispatch, path);
                showToast('There was an error. Try again.', 'error');
              }
            },
            null,
            true,
          );

          //____
        }
      },
      null,
      true,
    );
  };
};

export const updateThermostatTemperature = (input, successCallback) => {
  return async dispatch => {
    //const path = '/development/tj610/temp';
    const path = '/development/control/temp';
    console.log('petition started');
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.deviceId,
        temp: input.temp,
        hold: input.hold,
        //unit: input.unit,
        timestamp: `${new Date().valueOf()}`,
      },
      response => {
        console.log('petition completed');
        if (response.message === 'Operation succeed') {
          dispatch({type: UPDATE_THERMOSTAT_TEMP, data: input});
        } else {
          showToast('There was a problem. Try again later.');
        }
      },
      null,
      true,
    );
  };
};

export const registerLogin = (email, sub) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    const endpoint = '/homeowner/loginInfo';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      endpoint,
      {
        email,
        userSub: sub,
        timestamp: `${new Date().valueOf()}`,
      },
      response => {
        console.log('Response login', response);
      },
    );
  };
};

export const updateVibration = input => {
  return async dispatch => {
    dispatch({type: UPDATE_VIBRATION, data: input});
  };
};

export const deleteDevice = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/device/remove';
    turnOnLoader(dispatch, path);
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        deviceId: input.macId,
      },
      response => {
        successCallback(dispatch, path, response);
        //dispatch({type: DELETE_DEVICE, data: input});
      },
      null,
      true,
    );
  };
};

export const removePeriod = input => {
  return async dispatch => {
    dispatch({
      type: REMOVE_PERIOD,
      data: {selected: input.selected, index: input.index},
    });
  };
};

export const addPeriod = input => {
  return async dispatch => {
    dispatch({
      type: ADD_PERIOD,
      data: {
        selected: input.selected,
        info: input.info,
        alreadyExisting: input.alreadyExisting,
      },
    });
  };
};

export const editPeriod = input => {
  return async dispatch => {
    dispatch({
      type: EDIT_PERIOD,
      data: {
        selected: input.selected,
        info: input.info,
        periodNumber: input.periodNumber,
        alreadyExisting: input.alreadyExisting,
        scheduleInfo: input.scheduleInfo,
      },
    });
  };
};

export const getDeviceList = () => {
  return async dispatch => {
    const path = '/homeowner/devicelist';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({
          type: DEVICE_LIST,
          data: response.data.deviceList,
          isTermsConditionsAccepted: response.data.isTermsConditionsAccepted,
        });
        dispatch({
          type: SELECTED_DEVICE,
          data: response.data.deviceList[0],
        });
      },
      errorResponse => {
        //showToast(errorResponse, 'error');
      },
    );
  };
};
export const setSelectedDevice = value => {
  return async dispatch => {
    dispatch({type: SELECTED_DEVICE, data: value});
  };
};
export const setPrevSelectedDevice = value => {
  return async dispatch => {
    dispatch({type: PREV_SELECTED_DEVICE, data: value});
  };
};

export const prevBcc = value => {
  return async dispatch => {
    dispatch({type: PREV_BCC, data: value});
  };
};

export const selectBcc = value => {
  return async dispatch => {
    dispatch({type: SELECT_BCC, data: value});
  };
};
export const getStatusByDeviceId = deviceId => {
  return async dispatch => {
    const path = '/devices/status/' + deviceId;
    apiInterceptorForGet(dispatch, path, response => {
      dispatch({type: DEVICE_STATUS, data: response.data});
    });
  };
};
export const getDetailsByDeviceId = deviceId => {
  return async dispatch => {
    const path = '/homeowner/devicedetails/' + deviceId;

    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: DEVICE_DETAILS, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
      undefined,
      true,
    );
  };
};

export const getDetailsByDeviceId2 = deviceId => {
  return async dispatch => {
    const path = '/homeowner/devicedetails/' + deviceId;
    apiInterceptorForGetIDS(
      dispatch,
      path,
      response => {
        dispatch({type: DEVICE_DETAILS, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateHeatPumpInfoSettings = input => {
  return async dispatch => {
    dispatch({type: HEAT_PUMP_INFO, data: input});
  };
};

export const getHeatPumpInfo = gatewayId => {
  return async dispatch => {
    const baseurl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development/device/heatpump';
    const path = `?device_id=${gatewayId}&timestamp=${new Date().valueOf()}`;
    apiInterceptorForGetCustomApi(
      dispatch,
      baseurl,
      path,
      null,
      response => {
        dispatch({type: HEAT_PUMP_INFO, data: response});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateUtilityEnergySavings = input => {
  return async dispatch => {
    const baseUrl =
      'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com/testing_evn';
    const path = '/updateoptout';
    apiInterceptorForPost(
      dispatch,
      path,
      {
        resourceId: input.macId,
      },
      response => {},
      error => {},
      'ttnacloudplatform-api-3.0',
    );

    dispatch({
      type: UTILITY_ENERGY_SAVINGS,
      data: {
        macId: input.macId,
        energySavingsMode: input.energySavingsMode,
      },
    });

    dispatch({
      type: REMOVE_NOTIFICATION,
      data: {
        macId: input.macId,
      },
    });
  };
};

export const updateSelectedDevice = () => {
  return async dispatch => {
    dispatch({type: UPDATE_SELECTED});
  };
};

export const getUtilityEnergySavings = (gatewayId: string) => {
  return async dispatch => {
    const baseurl = 'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com';
    const path = '/development/enrollmentstatus';
    return apiInterceptorForPostIDS(
      dispatch,
      baseurl,
      path,
      {
        gatewayId: gatewayId,
      },
      (response: any) => {
        dispatch({type: GET_UTILITY_ENERGY_SAVINGS, data: response});
      },
      (errorResponse: any) => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateUtilityEnergySavings2 = (
  gatewayId: string,
  input: string,
) => {
  return async dispatch => {
    const baseurl = 'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com';
    const path = '/development/enrolldr';
    return apiInterceptorForPostIDS(
      dispatch,
      baseurl,
      path,
      {
        gatewayId: gatewayId,
        enroll: input,
      },
      (response: any) => {},
      (errorResponse: any) => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateHeatPumpInfo = (input: any) => {
  return async dispatch => {
    const baseurl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    const path = '/development/device/updateheatpumpinfo';
    const time = new Date().valueOf();
    let body = {};
    if (input.placeId.Geometry !== undefined) {
      body = {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        city: input.city,
        country: input.country,
        state: input.state,
        zipcode: input.zipcode,
        address1:
          input.address1.length <= 25
            ? input.address1
            : input.address1.substring(0, 25),
        address2: input.address2,
        placeId: input.placeId,
      };
    } else {
      body = {
        device_id: input.deviceId,
        timestamp: `${new Date().valueOf()}`,
        city: input.city,
        country: input.country,
        state: input.state,
        zipcode: input.zipcode,
        address1:
          input.address1.length <= 25
            ? input.address1
            : input.address1.substring(0, 25),
        address2: input.address2,
      };
    }
    apiInterceptorForPostCustomApi(
      dispatch,
      baseurl,
      path,
      body,
      (response: any) => {
        console.log('response', response);
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_HEAT_PUMP_INFO,
            data: {
              device_id: input.deviceId,
              timestamp: `${new Date().valueOf()}`,
              city: input.city,
              country: input.country,
              state: input.state,
              zipcode: input.zipcode,
              contractorMonitoringStatus: input.contractorMonitoringStatus,
              address1:
                input.address1.length <= 25
                  ? input.address1
                  : input.address1.substring(0, 25),
              address2: input.address2,
            },
          });
        } else {
          showToast(`There was a problem. ${response.message}.`, 'error');
        }
      },
      (errorResponse: any) => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const handleReloadHeatPumpInfo = () => {
  return {
    type: RELOAD_HEAT_PUMP_INFO,
  };
};

export const handleNoReloadHeatPumpInfo = () => {
  return {
    type: NO_RELOAD_HEAT_PUMP_INFO,
  };
};

export const updateContractorPermissionAccept = () => {
  return async dispatch => {
    dispatch({type: PERMISSION_CONTRACTOR_MONITORING_STATUS_ACCEPT});
  };
};

export const updateContractorPermissionDenied = () => {
  return async dispatch => {
    dispatch({type: PERMISSION_CONTRACTOR_MONITORING_STATUS_DENIED});
  };
};

export const weatherType = input => {
  return async dispatch => {
    dispatch({type: ACTUAL_WEATHER_TYPE, data: input});
  };
};
export const userFirstLogin = input => {
  return async dispatch => {
    dispatch({type: USER_FIRST_LOGIN, data: input});
  };
};
export const verifyGatewayId = (gatewayId, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/verificationcodevalidation/' + gatewayId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const addNewUnit = (input, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/addnewunit';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: ADD_NEW_UNIT, data: response.data});
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const addNewUnitIDSBCC = (input, successCallback, userId) => {
  return async dispatch => {
    const path = '/homeowner/addnewunit';
    apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      input,
      response => {
        console.log('response', response);
        if (response.data !== undefined) {
          const baseUrl =
            'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
          const endpointList = '/device/list';
          apiInterceptorForGetCustomApi(
            dispatch,
            baseUrl,
            endpointList,
            null,
            responseL => {
              successCallback();
            },
          );

          //successCallback();
        }
        if (response.error !== undefined) {
          showToast(response.error.message, 'error');
        }
      },
      errorResponse => {
        console.log('errorresponse', errorResponse);
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const addNewUnitIDS = (input, successCallback, userId) => {
  return async dispatch => {
    const path = '/homeowner/addnewunit';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        if (response.data !== undefined) {
          const baseUrl =
            'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
          const endpointList = '/device/list';
          apiInterceptorForGetCustomApi(
            dispatch,
            baseUrl,
            endpointList,
            null,
            responseL => {
              successCallback();
            },
          );

          //successCallback();
        }
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const editUnitInfo = (input, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/updateunit';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: EDIT_UNIT_INFO, data: response.data});
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateMonitoringStatus = (input, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/updatemonitoringstatus';
    apiInterceptorForPut(
      dispatch,
      path,
      input.data,
      response => {
        if (input.updateState) {
          dispatch({type: UPDATE_MONITORING_STATUS, data: response.data});
        }
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const markNotificationRead = input => {
  return async dispatch => {
    dispatch({type: MARK_NOTIFICATION_READ, data: input});
  };
};

export const notifications = input => {
  return async dispatch => {
    const path = '/homeowner/notifications';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        //Energy savings just for testing
        //response.data.Count = response.data.Count + 4;
        //response.data.ScannedCount = response.data.ScannedCount + 4;

        /*response.data.Items.push({
          data: 'Tesr',
          issueDate: new Date().valueOf(),
          notification: 'refrigerantLeakNotification',
          notificationType: 'refrigerantLeakNotification',
          userId: '4708dc43-9f7a-4a32-97a1-d6d52b8dbca1',
          userType: 'homeowner',
          ODUSerialNumber: '399A-000-012345-8733955691',
        });

        response.data.Items.push({
          data: 'Tesr',
          issueDate: new Date().valueOf(),
          notification: 'refrigerantLeakGrantAccess',
          notificationType: 'refrigerantLeakGrantAccess',
          userId: '4708dc43-9f7a-4a32-97a1-d6d52b8dbca3',
          userType: 'homeowner',
          ODUSerialNumber: '399A-000-012345-8733955691',
        });*/

        response.data.Items.forEach(element => {
          element.uniqueKey = element.userId + element.issueDate;
        });
        dispatch({type: NOTIFICATION_LIST, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const loadMore = input => {
  return async dispatch => {
    const path = '/homeowner/notifications';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        response.data.Items.forEach(element => {
          element.uniqueKey = element.userId + element.issueDate;
        });
        dispatch({type: UPDATE_HOMEOWNER_NOTIFICATIONS, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const clearHomeOwnerNotificationsCount = () => {
  return async dispatch => {
    dispatch({type: CLEAR_HOMEOWNERCOUNT, data: 0});
  };
};
export const addNewNotification = data => {
  return async dispatch => {
    dispatch({type: ADDNEWNOTIFICATION, data: data});
    dispatch({type: UPDATE_HOMEOWNERCOUNT});
  };
};

export const getFaqList = input => {
  return async dispatch => {
    const path = '/help';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: FAQ_LIST, data: response});
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    );
  };
};

export const unreadHomeownerNotificationCount = () => {
  return async dispatch => {
    const path = '/unreadnotificationcount';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({
          type: UNREAD_HOMEOWNER_NOTIFICATION,
          data: response.data.count,
        });
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateHomeOwnerTermsAndConditionFlag = successCallback => {
  return async dispatch => {
    dispatch({type: UPDATE_TERMS_AND_CONDITIONS_FLAG});
    successCallback();
  };
};

export const checkHoAnalyticsValue = val => {
  return async dispatch => {
    dispatch({type: UPDATE_HO_ANALYTICS_VALUE, data: val});
  };
};

export const updateSelectedUnitName = val => {
  return async dispatch => {
    dispatch({type: UPDATE_SELECTED_UNITNAME, data: val});
  };
};

export const updateAccesoryValues = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/control/accessory';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.deviceId,
        timestamp: new Date().valueOf().toString(),
        t_humidity: input.t_humidity,
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_SELECTED_ACCESORY,
            data: input,
            device_id: input.deviceId,
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
        successCallback();
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    ).then(r => {
      dispatch({
        type: UPDATE_SELECTED_ACCESORY,
        data: input,
        device_id: input.deviceId,
      });
    });
  };
};

export const getLocationDateTime = (input, successCallback) => {
  return async dispatch => {
    //const path = '/development/device/get_location';
    // const path = `/development/device/get_location?access_token=${'eyJraWQiOiJRdVN6TSt3XC9YdExydGZhNXpXdnZ4d0NLTk5sNkswRTRCeGloMjlGNzVaMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzOGEwMjc0MC1lNTQyLTRlMTEtOTA2NS0yZDdlOTkzZDUzYzAiLCJjb2duaXRvOmdyb3VwcyI6WyJIb21lT3duZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUGphVENkT2pNIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiM2FvZTYwYW12cmo4YzFiN202NGxsZjlhMnAiLCJvcmlnaW5fanRpIjoiZDNmYmViODMtZWM1Ny00MWViLTk0OGUtYzc1ZWRlNmZkNDUzIiwiZXZlbnRfaWQiOiI3YmNiYjg2OC02ZTY2LTQ4NGYtOThkYS02OWRkNzU0MDIzNWMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjgwNzkwMzAwLCJleHAiOjE2ODA4NzY3MDAsImlhdCI6MTY4MDc5MDMwMCwianRpIjoiZTE3NDNhZTktMDYxZS00MzIyLWI1YzYtZTY2NmEwZTE3NzA2IiwidXNlcm5hbWUiOiIzOGEwMjc0MC1lNTQyLTRlMTEtOTA2NS0yZDdlOTkzZDUzYzAifQ.hJ9tBv-SkHxL5gHHIMepqXC3k5-XWioB9teEWxOzQuE-KR2WLTLDI9ojfyNJJYFMXSKCZZTvzhzAngEh-zhh-_b_ZR5Yrky_7vgRmx248rH6v_MM0DM05mRAS_-F0uln7gW7G2ytgUWh5R9YzSfTO0zRnAFXeaJqYazLVYeBZDCVAQNSpjloHGkRnYG1oMPu0DrrM6gBVk0nYYGmoR8dHi7TJbfMFudMnkFrv8EBb5WHj5R8nHBhrGlHGuCqlhWnIWjJ9c8C2b2KLqvbZF5YtPvpsCkcBMvu3HKE_qXMwXZeNDmc4paJHVI7jFEZWi4MXt1jW3ZlBEBEkrnVRoy1rg'}&device_id=${input.deviceId}&timestamp=${new Date().valueOf()}`;
    const path = `/development/device/get_location?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    return apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      null,
      response => {
        if (response.message.toLowerCase().includes('error')) {
          showToast('There was a problem. Try again later.', 'error');
        }
        //successCallback(response);
        dispatch({
          type: UPDATE_DATETIME_TIMEZONE,
          data: response,
        });
      },
      errorResponse => {},
    );
  };
};

export const getLocationByDeviceId = (input, successCallback) => {
  return async dispatch => {
    //const path = '/development/device/get_location';
    // const path = `/development/device/get_location?access_token=${'eyJraWQiOiJRdVN6TSt3XC9YdExydGZhNXpXdnZ4d0NLTk5sNkswRTRCeGloMjlGNzVaMD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIzOGEwMjc0MC1lNTQyLTRlMTEtOTA2NS0yZDdlOTkzZDUzYzAiLCJjb2duaXRvOmdyb3VwcyI6WyJIb21lT3duZXIiXSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfUGphVENkT2pNIiwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiM2FvZTYwYW12cmo4YzFiN202NGxsZjlhMnAiLCJvcmlnaW5fanRpIjoiZDNmYmViODMtZWM1Ny00MWViLTk0OGUtYzc1ZWRlNmZkNDUzIiwiZXZlbnRfaWQiOiI3YmNiYjg2OC02ZTY2LTQ4NGYtOThkYS02OWRkNzU0MDIzNWMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIHBob25lIG9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNjgwNzkwMzAwLCJleHAiOjE2ODA4NzY3MDAsImlhdCI6MTY4MDc5MDMwMCwianRpIjoiZTE3NDNhZTktMDYxZS00MzIyLWI1YzYtZTY2NmEwZTE3NzA2IiwidXNlcm5hbWUiOiIzOGEwMjc0MC1lNTQyLTRlMTEtOTA2NS0yZDdlOTkzZDUzYzAifQ.hJ9tBv-SkHxL5gHHIMepqXC3k5-XWioB9teEWxOzQuE-KR2WLTLDI9ojfyNJJYFMXSKCZZTvzhzAngEh-zhh-_b_ZR5Yrky_7vgRmx248rH6v_MM0DM05mRAS_-F0uln7gW7G2ytgUWh5R9YzSfTO0zRnAFXeaJqYazLVYeBZDCVAQNSpjloHGkRnYG1oMPu0DrrM6gBVk0nYYGmoR8dHi7TJbfMFudMnkFrv8EBb5WHj5R8nHBhrGlHGuCqlhWnIWjJ9c8C2b2KLqvbZF5YtPvpsCkcBMvu3HKE_qXMwXZeNDmc4paJHVI7jFEZWi4MXt1jW3ZlBEBEkrnVRoy1rg'}&device_id=${input.deviceId}&timestamp=${new Date().valueOf()}`;
    const path = `/development/device/get_location?device_id=${
      input.deviceId
    }&timestamp=${new Date().valueOf()}`;
    return apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      null,
      response => {
        dispatch({
          type: UPDATE_LOCATION_SETTINGS,
          data: response,
          suggestions: false,
        });
      },
      errorResponse => {},
    );
  };
};

export const editLocationSettings = (
  input,
  deviceId,
  TimeZoneData,
  country,
  state,
) => {
  return async dispatch => {
    const path = '/development/device/set_location';
    let body = {};
    if (TimeZoneData.Label !== undefined) {
      let timeZoneSelected = TimeZoneData.TimeZone.Name.toString();
      var Moment = require('moment-timezone');
      let stringTimeZone = Moment().tz(timeZoneSelected).format().split('T');
      let stringTimeZoneTime = stringTimeZone[1].toString().substring(0, 8);
      let stringZone = stringTimeZone[1].toString().substring(8).split(':');
      let zone = Number(stringZone[0]);
      body = {
        device_id: deviceId,
        timestamp: new Date().valueOf().toString(),
        city: TimeZoneData.Municipality,
        country: country,
        state: state,
        zipcode: input.zipcode,
        zone: zone.toString(),
        placeId: {
          Country: TimeZoneData.Country,
          Geometry: TimeZoneData.Geometry,
          //  Interpolated: TimeZoneData.Interpolated,
          Label: TimeZoneData.Label,
          Municipality: TimeZoneData.Municipality,
          PostalCode: input.zipcode,
          Region: TimeZoneData.Region,
          Street: TimeZoneData.Street ? TimeZoneData.Street : '',
          SubRegion: TimeZoneData.SubRegion,
          TimeZone: TimeZoneData.TimeZone,
        },
      };
    } else {
      body = {
        device_id: deviceId,
        timestamp: new Date().valueOf().toString(),
        city: input.city,
        country: country,
        state: state,
        zipcode: input.zipcode,
      };
    }

    console.log('payload to send', body);
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      body,
      response => {
        console.log('response', response, body);
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_LOCATION_SETTINGS,
            suggestions: true,
            data: {
              Country: country === 'United States' ? 'USA' : 'CAN',
              Geometry: TimeZoneData.Geometry,
              //  Interpolated: TimeZoneData.Interpolated,
              Label: TimeZoneData.Label,
              Municipality: input.city,
              PostalCode: input.zipcode,
              Region: TimeZoneData.Region,
              Street: TimeZoneData.Street,
              SubRegion: TimeZoneData.SubRegion,
              TimeZone: TimeZoneData.TimeZone,
              zipcode: input.zipcode,
              city: input.city,
              state: state,
              country: country,
            },
          });
        } else {
          showToast(`There was a problem. ${response.message}.`, 'error');
        }
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    );
  };
};

export const getLSuggestions = (
  input,
  successCallback,
  country,
  errorCallback?,
) => {
  return async dispatch => {
    const path = `/development/device/suggestionsplaceid?countryCode=${country}&text=${input}`;
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    return apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      path,
      null,
      response => {
        /*  dispatch({
          type: UPDATE_LOCATION_SUGGESTIONS ,
          data: response, 
        });*/
        if (response.Results) {
          successCallback(response.Results, input);
        } else {
          //showToast('There was a problem getting suggestions.', 'error');
          if (errorCallback) {
            errorCallback();
          }
        }
      },
      errorResponse => {},
      true,
    );
  };
};

export const getLocationSuggestionsBcc = (input, successCallback, country) => {
  return async dispatch => {
    const path = `/development/device/getlocationsuggestions?zipcode=${input}&countrycode=${country}`;
    return apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      null,
      response => {
        /*  dispatch({
          type: UPDATE_LOCATION_SUGGESTIONS ,
          data: response, 
        });*/
        if (response.Results) {
          successCallback(response.Results, input);
        } else {
          //showToast('There was a problem getting suggestions.', 'error');
        }
      },
      errorResponse => {},
      true,
    );
  };
};

export const getPlaceId = (input, successCallback, updateLocationInfo) => {
  return async dispatch => {
    let timeZoneSelected = input.TimeZone.Name.toString();
    var Moment = require('moment-timezone');
    let stringTimeZone = Moment().tz(timeZoneSelected).format().split('T');
    let stringTimeZoneTime = stringTimeZone[1].toString().substring(0, 8);
    let stringZone = stringTimeZone[1].toString().substring(8).split(':');
    let Zone = Number(stringZone[0]);
    if (updateLocationInfo) {
      dispatch({
        type: UPDATE_LOCATION_SETTINGS,
        data: input,
        suggestions: true,
        zone: Zone.toString(),
      });
    }

    //successCallback(response.Results);
  };
};

export const unpairDevices = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/device/pairbccids';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.device_id,
        gatewayId: input.gatewayId,
      },
      response => {
        successCallback(response);
        //dispatch({
        //  type: UNPAIR_DEVICES,
        //  data: input,
        //});
      },
    );
  };
};

export const updateDeviceList = input => {
  return async dispatch => {
    dispatch({type: UPDATE_DEVICE_LIST, data: input});
  };
};

export const editDevice = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/device/edit';
    const baseUrl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      path,
      {
        deviceId: input.deviceId,
        deviceName: input.deviceName,
        deviceType: input.deviceType,
      },
      response => {
        if (response.message) {
          showToast(response.message, 'error');
        } else {
          dispatch({type: EDIT_DEVICE, data: input});
        }
      },
      null,
      true,
    );
  };
};

export const updateDevice = input => {
  return async dispatch => {
    const baseurl = 'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com';
    const path = '/development/device/';
    apiInterceptorForPostCustomApi(dispatch, baseurl, path, {}, response => {});
  };
};

export const pairSelectedDevice = input => {
  return async dispatch => {
    dispatch({type: PAIR_SELECTED_DEVICES, data: input});
  };
};

export const pairDevices = (input, successCallback) => {
  return async dispatch => {
    const path = '/development/device/pairbccids';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: input.device_id,
        gatewayId: input.gatewayId,
      },
      response => {
        successCallback(response);
        //getDeviceList2({userId: input.user});
        //dispatch({
        //  type: PAIR_DEVICES,
        //  data: input,
        //});
      },
    );
  };
};

export const updateSelectedIdsOdu = input => {
  return async dispatch => {
    dispatch({type: SELECTED_IDS_ODU, data: input});
  };
};

export const editDateTimeSettings = (input, deviceId) => {
  return async dispatch => {
    const path = '/development/config/date_time';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: deviceId,
        timestamp: new Date().valueOf().toString(),
        datetime: input.datetime,
        // d_hour: input.d_hour.toString(),
        //auto_time: input.auto_time.toString(),
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_DATETIME_SETTINGS,
            data: input.datetime,
            setting: 'datetime',
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    );
  };
};

export const editDateTimeHour = (input, deviceId) => {
  return async dispatch => {
    const path = '/development/config/d_hour';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: deviceId,
        timestamp: new Date().valueOf().toString(),
        d_hour: input.d_hour.toString(),
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_DATETIME_SETTINGS,
            data: input.d_hour.toString(),
            setting: 'hour',
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    );
  };
};

export const editDateTimeSettingsAuto = (input, deviceId) => {
  return async dispatch => {
    const path = '/development/config/auto_time';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id: deviceId,
        timestamp: new Date().valueOf().toString(),
        auto_time: input.auto_time.toString(),
      },
      response => {
        if (response.message === 'Operation succeed') {
          dispatch({
            type: UPDATE_DATETIME_SETTINGS,
            data: input.auto_time.toString(),
            setting: 'auto',
          });
        } else {
          showToast('There was a problem. Try again later.', 'error');
        }
      },
      errorResponse => {
        // showToast(errorResponse, 'error');
      },
    );
  };
};

export const deleteApplianceHomeOwner = (input, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/deleteappliance';
    let deleteApplianceList = {gatewayId: input};
    turnOnLoader(dispatch, path);
    apiInterceptorForPost(
      dispatch,
      path,
      deleteApplianceList,
      response => {
        //dispatch({
        //  type: DELETE_APPLIANCE,
        //  data: input[0],
        //});
        successCallback();
        //showToast('Successfully deleted', 'info');
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const deleteAppliance = (input, successCallback) => {
  return async dispatch => {
    const path = '/homeowner/deleteappliance';
    let deleteApplianceList = {gatewayId: input};
    apiInterceptorForPost(
      dispatch,
      path,
      deleteApplianceList,
      response => {
        dispatch({
          type: DELETE_APPLIANCE,
          data: input[0],
        });
        successCallback();
        showToast('Successfully deleted', 'info');
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const saveDateBCC50Schedule = input => {
  return async dispatch => {
    dispatch({type: SAVE_DATE_BCC50, data: input});
  };
};

export const saveTimeBCC50Schedule = input => {
  return async dispatch => {
    dispatch({
      type: SAVE_TIME_BCC50,
      data: input,
    });
  };
};

export const saveScheduleSelectedBCC50 = input => {
  return async dispatch => {
    dispatch({
      type: SCHEDULE_SELECTED_BCC50,
      data: input,
    });
  };
};

export const saveBCC50 = (input, successCallback) => {
  console.log('saveBCC50payload..', input);
  return async dispatch => {
    const path = '/development/device/confirmbcc50';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      input,
      response => {
        if (
          response.data === 'device added' ||
          response.message === 'device added'
        ) {
          showToast('Successfully added', 'info');
          successCallback(true);
        } else {
          showToast(response.message);
          successCallback(false);
        }
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getRuntimeSettings = (deviceId, successCallback) => {
  return async dispatch => {
    const path = `/config/runtime/status?device_id=${deviceId}&timestamp=${new Date().valueOf()}`;
    await apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      async response => {
        successCallback(response);
      },
    );
  };
};

export const resetRunTime = (device_id, type, successCallback) => {
  return async dispatch => {
    const path = '/development/config/runtime/reset';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        type,
      },
      response => {
        showToast('Successfully Reset', 'info');
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setupRunTime = (device_id, filterday, successCallback) => {
  return async dispatch => {
    const path = '/development/config/runtime/setup';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        filterday,
      },
      response => {
        showToast('Successfully Setup', 'info');
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const lockScreen = (device_id, type, code) => {
  return async dispatch => {
    const path = '/development/config/device_lock';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        type,
        code,
      },
      response => {
        showToast('Info saved successfully', 'info');
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setDeviceNameOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: SET_DEVICE_NAME_ONBOARDING,
      data: input,
    });
  };
};

export const setLocationOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: SET_LOCATION_ONBOARDING,
      data: input,
    });
  };
};

export const updateBrightness = (device_id, screen, s_time) => {
  return async dispatch => {
    const path = '/development/control/setbrightness';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        screen,
        s_time,
      },
      response => {
        showToast('Info saved successfully', 'info');
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getAdvancedSettings = (deviceId, successCallback) => {
  return async dispatch => {
    const path = `/config/advancedsettings/status?device_id=${deviceId}&timestamp=${new Date().valueOf()}`;
    await apiInterceptorForGetCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development',
      path,
      null,
      async response => {
        successCallback(response);
      },
    );
  };
};

export const setAdvancedSettings = (device_id, input, successCallback) => {
  return async dispatch => {
    const path = '/development/config/advancedsettings/system';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        fanDelay: input.fanDelay,
        fanOnDelay: input.fanOnDelay,
        fanOffDelay: input.fanOffDelay,
        minRunTime: input.minRunTime,
        antiShortTime: input.antiShortTime,
        cycleTime: input.cycleTime,
        heatDeadBand: input.heatDeadBand,
        coolDeadBand: input.coolDeadBand,
      },
      response => {
        showToast('Successfully Set', 'info');
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setAdccessSettings = (device_id, input, successCallback) => {
  return async dispatch => {
    const path = '/development/config/advancedsettings/installer';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        db: input.db,
        hc: input.hc,
        hsd: input.hsd,
        latching: input.latching,
        sc: input.sc,
        ss: input.ss,
        stageDelay: input.stageDelay,
        stageTemp: input.stageTemp,
      },
      response => {
        showToast('Successfully Set', 'info');
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateUnitConfiguration = input => {
  return async dispatch => {
    dispatch({
      type: UPDATE_INFO_UNIT_CONFIGURATION,
      data: input,
    });
  };
};

export const resetUnitConfiguration = () => {
  return async dispatch => {
    dispatch({
      type: RESET_INFO_UNIT_CONFIGURATION,
    });
  };
};

export const resetScheduleOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: RESET_SCHEDULE_ONBOARDING,
      data: input,
    });
  };
};

export const selectNoScheduleOnboarding = () => {
  return async dispatch => {
    dispatch({
      type: SELECT_NO_SCHEDULE_ONBOARDING,
    });
  };
};

export const addScheduleOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: ADD_SCHEDULE_ONBOARDING,
      data: {
        model_id: input.model_id,
        mode: input.mode,
        state: input.state,
        limit: input.limit,
        name: input.name,
        unit: input.unit,
        data: input.data,
      },
    });
  };
};

export const deleteScheduleOnBoarding = modelId => {
  return async dispatch => {
    dispatch({
      type: DELETE_SCHEDULE_ONBOARDING,
      data: {
        modelId: modelId,
      },
    });
  };
};

export const updateScheduleOnBoarding = modelId => {
  return async dispatch => {
    dispatch({
      type: UPDATE_SCHEDULE_ONBOARDING,
      data: {
        modelId: modelId,
      },
    });
  };
};

export const addPeriodOnBoarding = input => {
  return async dispatch => {
    dispatch({
      type: ADD_PERIOD_ONBOARDING,
      data: {
        selected: input.selected,
        info: input.info,
        selectedSchedule: input.selectedSchedule,
      },
    });
  };
};

export const removePeriodOnBoarding = input => {
  return async dispatch => {
    dispatch({
      type: REMOVE_PERIOD_ONBOARDING,
      data: {
        selected: input.selected,
        index: input.index,
        selectedSchedule: input.selectedSchedule,
      },
    });
  };
};

export const editPeriodOnBoarding = input => {
  return async dispatch => {
    dispatch({
      type: EDIT_PERIOD_ONBOARDING,
      data: {
        selected: input.selected,
        info: input.info,
        periodNumber: input.periodNumber,
        selectedSchedule: input.selectedSchedule,
      },
    });
  };
};

export const setisOnboardingBcc50 = input => {
  return async dispatch => {
    dispatch({
      type: SET_IS_ONBOARDING_BCC50,
      data: input,
    });
  };
};

export const setUnitConfigurationNoOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: SET_INFO_UNIT_CONFIGURATION_NO_ONBOARDING,
      data: input,
    });
  };
};

export const updateUnitConfigurationNoOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: UPDATE_INFO_UNIT_CONFIGURATION_NO_ONBOARDING,
      data: input,
    });
  };
};

export const setUnitConfigurationEndPoint = (
  device_id,
  input,
  successCallback,
) => {
  return async dispatch => {
    const path = '/development/config/advancedsettings/unitconfiguration';
    return apiInterceptorForPostCustomApi(
      dispatch,
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com',
      path,
      {
        device_id,
        timestamp: `${new Date().valueOf()}`,
        heatType: input.heatType,
        fanControl: input.fanControl,
        reverse: input.reverse,
        emHeat: input.emHeat,
        balPoint: input.balPoint,
        changeOver: input.changeOver,
        heatStage: input.heatStage,
        coolStage: input.coolStage,
        humiType: input.humiType,
        humidifer: input.humidifer,
        dehumidifer: input.dehumidifer,
      },
      response => {
        showToast('Successfully Set Unit Configuration', 'info');
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setSkipUnitConfigurationOnboarding = input => {
  return async dispatch => {
    dispatch({
      type: SET_SKIP_UNIT_CONFIGURATION_ONBOARDING,
      data: input,
    });
  };
};

export const setisOnboardingBcc101 = input => {
  return async dispatch => {
    dispatch({
      type: SET_IS_ONBOARDING_BCC101,
      data: input,
    });
  };
};

export const setUnitNameIds = input => {
  return async dispatch => {
    dispatch({
      type: SET_UNIT_NAME_IDS,
      data: input,
    });
  };
};
