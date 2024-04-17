import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CURRENT_USER,
  CURRENT_STEP,
  UPDATE_CURRENT_USER,
  LOGOUT,
  TERMS_AND_CONDITIONS,
  LATEST_VERSION,
  SET_STEP_TITLES,
  SET_USER_ROLE,
  SET_SHOW_ROLE,
  SET_USER_ADDRESS,
  RESET_USER,
  SET_USER_NAME,
} from '../labels/AuthLabels';
import {Auth} from 'aws-amplify';
import {showToast} from '../../components/CustomToast';
import {
  apiInterceptorForPost,
  apiInterceptorForPostCustomApi,
  openApiInterceptorForGet,
  apiInterceptorForPostAPI,
} from './CommonActions';
import ClearCache from 'oa-react-native-clear-cache';

export const setCurrentUser = user => {
  return async dispatch => {
    dispatch({type: CURRENT_USER, user: user});
    ClearCache.clearAppCache(() => {});
  };
};
export const setCurrentStep = stepNumber => {
  return async dispatch => {
    dispatch({type: CURRENT_STEP, data: stepNumber});
  };
};
export const updateUserAttributes = (userFromStore, data, callback?) => {
  return async dispatch => {
    Auth.updateUserAttributes(userFromStore, data)
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch(error => {
        showToast(error.message, 'error');
      });
  };
};

export const verifyCurrentUserAttribute = attribute => {
  Auth.verifyCurrentUserAttribute(attribute)
    .then(() => {})
    .catch(error => {
      showToast(error.message, 'error');
    });
};

export const verifyCurrentUserAttributeSubmit = (
  attribute,
  value,
  callback?,
) => {
  Auth.verifyCurrentUserAttributeSubmit(attribute, value)
    .then(() => {
      if (callback) {
        callback();
      }
    })
    .catch(error => {
      showToast(error.message, 'error');
    });
};

export const updateUserObject = attributes => {
  return async dispatch => {
    dispatch({type: UPDATE_CURRENT_USER, data: attributes});
  };
};

export const checkAdminDetails = (attr, callback?) => {
  return async dispatch => {
    const path = '/checkadmindetails';
    apiInterceptorForPost(
      dispatch,
      path,
      attr,
      response => {
        callback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const createProfile = (userData, callback?) => {
  return async dispatch => {
    const path = '/registration';
    apiInterceptorForPost(
      dispatch,
      path,
      userData,
      response => {
        callback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const createProfileHomeOwner = (userData, callback?) => {
  return async dispatch => {
    const baseUrl =
      'https://r9nzt6y3ui.execute-api.us-east-1.amazonaws.com/development';
    apiInterceptorForPostCustomApi(
      dispatch,
      baseUrl,
      '/user/register',
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        type: 'HomeOwner',
        timestamp: `${new Date().valueOf()}`,
      },
      response => {
        if (response.message) {
          if (
            response.message === 'Operation succeed' ||
            response.message.startsWith("'e")
          ) {
            callback();
          } else if (
            response.message === 'The user account has already registered'
          ) {
            showToast(response.message, 'info');
          } else {
            showToast(response.message, 'error');
          }
        }
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const logout = () => {
  return async dispatch => {
    dispatch({type: LOGOUT, data: {}});
    // clear the storage
    ClearCache.getAppCacheSize(data => {});
    ClearCache.clearAppCache(() => {});
    await AsyncStorage.removeItem('persist:root').then(() => {});
  };
};

export const getTermsandcondition = () => {
  return async dispatch => {
    const path = '/termsandconditions';
    openApiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: TERMS_AND_CONDITIONS, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateTermsAndConditions = (input, successCallback) => {
  return async dispatch => {
    const path = '/termsandconditions';
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

export const deleteUser = (userRole, successCallback) => {
  return async dispatch => {
    const path = `/deleteuser/${userRole.type}`;
    apiInterceptorForPost(
      dispatch,
      path,
      {},
      response => {
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const getLatestVersion = (successCallback?: any) => {
  return async dispatch => {
    const path = '/latestappversion';
    openApiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: LATEST_VERSION, data: response.data});
        successCallback && successCallback(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setStepTitles = stepTitles => {
  return async dispatch => {
    dispatch({type: SET_STEP_TITLES, data: stepTitles});
  };
};

export const setUserRole = userRole => {
  return async dispatch => {
    dispatch({type: SET_USER_ROLE, data: userRole});
  };
};

export const setShowRole = showRole => {
  return async dispatch => {
    dispatch({type: SET_SHOW_ROLE, data: showRole});
  };
};

export const setUserName = userName => {
  return async dispatch => {
    dispatch({type: SET_USER_NAME, data: userName});
  };
};

export const setUserAddress = userAddress => {
  return async dispatch => {
    dispatch({type: SET_USER_ADDRESS, data: userAddress});
  };
};

export const resetUser = () => {
  return async dispatch => {
    dispatch({type: RESET_USER});
  };
};