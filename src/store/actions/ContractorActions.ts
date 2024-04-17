import {
  apiInterceptorForGet,
  apiInterceptorForGetCustomApi,
  apiInterceptorForPost,
  apiInterceptorForPostPR,
} from './CommonActions';
import {
  CONTRACTOR_LIST,
  WARRANTY_INFO,
  ADD_WARRANTY_INFO,
  ADD_COMPONENT,
  REQUEST_SENT_SUCCESS,
  ADD_GATEWAY_UNIT,
  VERIFY_ODU,
  SET_SELECTED_UNIT,
  GET_UNITS_LIST,
  ENERGY_USAGE_DATA,
  GATEWAY_LIVE_DATA,
  TROUBLESHOOTING,
  BLE_STATUS,
  CHECKPOINT_VALUE,
  SET_CHARGEUNIT_VALUE,
  GET_CHARGEUNIT_VALUE,
  INVITED_CONTRACTOR_LIST,
  FAQ_LIST,
  ADMIN_EDIT_ACCESS,
  ADMIN_INVITE_CONTRACTOR,
  ADMIN_REMOVE_CONTRACTOR,
  REPLACE_GATEWAY_UNIT,
  DELETE_UNITS,
  UPDATE_DEVICE_ALREADY_CONNECTED,
  UPDATE_TERMS_AND_CONDITIONS_FLAG,
  FAULT_STATUS_ON_NORMAL_UNITS,
  UPDATE_ANALYTICS_VALUE,
  UPDATE_CHECKPOINT_VALUE,
  MOUNT_ANTENNA_HIDE,
  POWERUP_ODU_HIDE,
  PR_CURRENT_STEP,
  PR_PRODUCT_INFO,
  PR_VERIFY_PRODUCT,
  PR_INVALID_PRODUCT,
  PR_SNL_GET_PRODUCTS,
  PR_SNL_GET_PRODUCT_TYPES,
  PR_SNL_GET_PRODUCT_IMAGES,
  PR_REGISTER,
  PP_VERIFY_USER,
  PR_SET_HOMEOWNER,
  PR_SAVE_TOKEN,
  PP_RESPONSE,
  PR_REGISTER_NEW_HOMEOWNER,
  PR_RESET_FLOW,
  PR_CLEAN,
  UPDATE_FAULT_CODE,
} from '../labels/ContractorLabels';
import {showToast} from '../../components/CustomToast';

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

export const getContractorList = () => {
  return async dispatch => {
    const path = '/contractor/companycontractors';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: CONTRACTOR_LIST, data: response.data});
      },
      errorResponse => {
        if (
          errorResponse.toLowerCase() !==
          'no contractor associated to the company!'
        ) {
          showToast(errorResponse, 'error');
        }

        dispatch({type: CONTRACTOR_LIST, data: []});
      },
    );
  };
};

export const getInvitedContractorList = () => {
  return async dispatch => {
    const path = '/contractor/requestedcontractors';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: INVITED_CONTRACTOR_LIST, data: response.data});
      },
      errorResponse => {
        dispatch({type: INVITED_CONTRACTOR_LIST, data: []});
      },
    );
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
      null,
      true,
    );
  };
};

export const adminEditUnitsAccess = (input, successCallback) => {
  return async dispatch => {
    const path = '/contractor/admineditunitsaccess';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        successCallback();
        dispatch({type: ADMIN_EDIT_ACCESS, data: input});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const searchContractor = (phoneNumber, successCallback) => {
  return async dispatch => {
    const path = '/contractor/searchbyphonenumber/' + phoneNumber;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        successCallback(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const sendInvite = (input, successCallback) => {
  return async dispatch => {
    const path = '/contractor/invitecontractor';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: ADMIN_INVITE_CONTRACTOR, data: response.data});
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const adminPortalDelete = input => {
  return async dispatch => {
    const path = '/contractor/removecontractor';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: ADMIN_REMOVE_CONTRACTOR, data: input});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getUnitsList = (successCallback?: any) => {
  return async dispatch => {
    const path = '/contractor/listview';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: GET_UNITS_LIST, data: response.data});
        successCallback && successCallback(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const deleteUnits = (input, callback) => {
  return async dispatch => {
    const path = '/contractor/removeunitlistview';
    apiInterceptorForPost(
      dispatch,
      path,
      {listOfUnits: input},
      response => {
        dispatch({type: DELETE_UNITS, data: input});
        callback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setSelectedUnit = data => {
  return async dispatch => {
    dispatch({type: SET_SELECTED_UNIT, data: data});
  };
};

export const getWarrantyInfo = deviceId => {
  return async dispatch => {
    const path = '/contractor/registerwarranty/' + deviceId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: WARRANTY_INFO, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const addWarrantyInfo = input => {
  return async dispatch => {
    const path = '/contractor/registerwarranty/addwarrantyinfo';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: ADD_WARRANTY_INFO, data: input});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const addComponent = (input, navigation) => {
  return async dispatch => {
    const path = '/contractor/registerwarranty/addcomponent';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: ADD_COMPONENT, data: response.data});
        navigation.goBack();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const requestRemoteAccess = input => {
  return async dispatch => {
    const path = '/contractor/remoterequest';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: REQUEST_SENT_SUCCESS, data: true});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const verifyOduSerialNumber2 = (serialNumber, navigation, IDS) => {
  return async dispatch => {
    // const baseUrl = 'https://f9wv5giwb3.execute-api.us-east-1.amazonaws.com/testing_evn';
    const baseUrl =
      'https://93wcx0em15.execute-api.us-east-1.amazonaws.com/dev';
    const path = '/contractor/validatenewunit/' + serialNumber;
    apiInterceptorForGetCustomApi(
      dispatch,
      baseUrl,
      path,
      null,
      response => {
        if (response.error) {
          showToast(response.error.message, 'error');
        }
        dispatch({type: VERIFY_ODU, data: response.data});
        navigation.navigate('AddGateway', {
          IDS: response.data.ODUModelNumber.includes('3.0') ? '30' : '20',
        });
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const verifyOduSerialNumber = (serialNumber, navigation) => {
  return async dispatch => {
    const path = '/contractor/validatenewunit/' + serialNumber;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: VERIFY_ODU, data: response.data});
        navigation.navigate('AddGateway');
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const addGatewayUnit = (input, resetAction, navigation) => {
  return async dispatch => {
    const path = '/contractor/addnewunit';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        //resetAction();
        navigation.dispatch(resetAction);
        dispatch({
          type: ADD_GATEWAY_UNIT,
          data: input,
          firmwareVersion: response.data.data.firmwareVersion,
        });
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const replaceGateway = (input, navigation) => {
  return async dispatch => {
    const path = '/contractor/replacegatewayunit';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        navigation.replace('ReplaceUnitSuccess');
        dispatch({type: REPLACE_GATEWAY_UNIT, data: input});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setGatewayLiveData = data => {
  return async dispatch => {
    dispatch({type: GATEWAY_LIVE_DATA, data: data});
  };
};

export const getTroubleshootingData = deviceId => {
  return async dispatch => {
    const path = '/contractor/troubleshooting/' + deviceId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: TROUBLESHOOTING, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setBleStatus = data => {
  return async dispatch => {
    dispatch({type: BLE_STATUS, data: data});
  };
};

export const getCheckpointData = deviceId => {
  return async dispatch => {
    const path = '/contractor/checkpoint/' + deviceId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: CHECKPOINT_VALUE, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const postCheckpointData = body => {
  return async dispatch => {
    const path = '/contractor/checkpoint';
    apiInterceptorForPost(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: CHECKPOINT_VALUE, data: response.data});
      },
      errorResponse => {},
    );
  };
};

export const postDemoCheckpointData = body => {
  return async dispatch => {
    dispatch({type: CHECKPOINT_VALUE, data: body});
  };
};

export const setChargeUnitValue = (body, successCallback) => {
  return async dispatch => {
    const path = '/contractor/chargeunit';
    apiInterceptorForPost(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: SET_CHARGEUNIT_VALUE, data: response.data});
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getChargeUnitValue = deviceId => {
  return async dispatch => {
    const path = '/contractor/chargeunit/' + deviceId;
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: GET_CHARGEUNIT_VALUE, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getCompanyInvite = successCallback => {
  return async dispatch => {
    const path = '/contractor/companyinvite';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        successCallback(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const respondToCompanyInvite = (
  body,
  successCallback,
  failureCallback,
) => {
  return async dispatch => {
    const path = '/contractor/companyinvite';
    apiInterceptorForPost(
      dispatch,
      path,
      body,
      response => {
        successCallback();
        showToast(response.data, 'success');
      },
      errorResponse => {
        failureCallback();
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateLiveFaultData = body => {
  return async dispatch => {
    const path = '/contractor/faultdata';
    apiInterceptorForPost(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: UPDATE_FAULT_CODE, data: body.faultData});
      },
      errorResponse => {
        //showToast(errorResponse, 'error');
      },
    );
  };
};

export const contractorRequest = (input, successCallback) => {
  return async dispatch => {
    const path = '/contractor/updatecompany';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const liveCheckPointEmail = input => {
  return async dispatch => {
    const path = '/contractor/livecheckpointemail';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        showToast(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateDeviceAlreadyConnected = data => {
  return async dispatch => {
    dispatch({type: UPDATE_DEVICE_ALREADY_CONNECTED, data: data});
  };
};

export const updateTermsAndConditionFlag = successCallback => {
  return async dispatch => {
    dispatch({type: UPDATE_TERMS_AND_CONDITIONS_FLAG});
    successCallback();
  };
};

export const faultStatusOnNormalUnits = data => {
  return async dispatch => {
    dispatch({type: FAULT_STATUS_ON_NORMAL_UNITS, data: data});
  };
};

export const checkAnalyticsValue = val => {
  return async dispatch => {
    dispatch({type: UPDATE_ANALYTICS_VALUE, data: val});
  };
};

export const checkCheckpointValue = val => {
  return async dispatch => {
    dispatch({type: UPDATE_CHECKPOINT_VALUE, data: val});
  };
};

export const setChargeUnitDemoValues = (body, successCallback) => {
  return async dispatch => {
    dispatch({type: SET_CHARGEUNIT_VALUE, data: body});
    successCallback();
  };
};

export const setMountAntennaHide = data => {
  return async dispatch => {
    dispatch({type: MOUNT_ANTENNA_HIDE, data: data});
  };
};

export const setPowerUpOduHide = data => {
  return async dispatch => {
    dispatch({type: POWERUP_ODU_HIDE, data: data});
  };
};

export const setCurrentStep = val => {
  return async dispatch => {
    dispatch({type: PR_CURRENT_STEP, data: val});
  };
};

export const setProductInfo = val => {
  return async dispatch => {
    dispatch({type: PR_PRODUCT_INFO, data: val});
  };
};

export const verifyPRSerialNumber = body => {
  return async dispatch => {
    const path = '/productregistration';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        if (response.data.Item.registrationStatus === 'true') {
          showToast('Serial number already registered.', 'error');
          dispatch({type: PR_INVALID_PRODUCT});
        } else {
          dispatch({type: PR_VERIFY_PRODUCT, data: response.data});
        }
      },
      errorResponse => {
        if (errorResponse == 'Please check the information entered') {
          showToast('Check serial number entered', 'error');
          dispatch({type: PR_INVALID_PRODUCT});
        } else {
          showToast(errorResponse, 'error');
          dispatch({type: PR_INVALID_PRODUCT});
        }
      },
    );
  };
};

export const serialNumberLocatorGetProducts = body => {
  return async dispatch => {
    const path = '/productregistration';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: PR_SNL_GET_PRODUCTS, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
        //dispatch({type: PR_INVALID_PRODUCT})        ;
      },
    );
  };
};

export const serialNumberLocatorGetProductTypes = index => {
  return async dispatch => {
    dispatch({type: PR_SNL_GET_PRODUCT_TYPES, data: index});
  };
};

export const serialNumberLocatorGetProductImages = index => {
  return async dispatch => {
    dispatch({type: PR_SNL_GET_PRODUCT_IMAGES, data: index});
  };
};

export const productRegistrationSetHomeowner = data => {
  return async dispatch => {
    dispatch({type: PR_SET_HOMEOWNER, data: data});
  };
};

export const productRegistrationRegister = (body, homeownerData) => {
  return async dispatch => {
    const path = '/productregistration/registration';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: PR_SET_HOMEOWNER, data: homeownerData});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const installationDashboardRegister = body => {
  return async dispatch => {
    const path = '/productregistration/registration';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: PR_REGISTER, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const prResetFlow = () => {
  return async dispatch => {
    dispatch({type: PR_RESET_FLOW});
  };
};

export const registerNewHomeowner = () => {
  return async dispatch => {
    dispatch({type: PR_REGISTER_NEW_HOMEOWNER});
  };
};

export const getSKIDAccessToken = body => {
  return async dispatch => {
    const path = '/productregistration/getaccesstoken';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: PR_SAVE_TOKEN, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
        //dispatch({type: PR_INVALID_PRODUCT})        ;
      },
    );
  };
};

export const getPPAccountInformation = body => {
  return async dispatch => {
    const path = '/productregistration/validateuserregistration';
    apiInterceptorForPostPR(
      dispatch,
      path,
      body,
      response => {
        dispatch({type: PP_RESPONSE, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
        //dispatch({type: PR_INVALID_PRODUCT})        ;
      },
    );
  };
};

export const prCleanInfo = () => {
  return async dispatch => {
    dispatch({type: PR_CLEAN});
  };
};
