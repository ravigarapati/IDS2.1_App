import {
  UPDATE_COUNT,
  GET_ACTIVE_NOTIFICATIONS,
  GET_ARCHIVE_NOTIFICATIONS,
  CLEAR_COUNT,
  UPDATE_ACTIVE_NOTIFICATIONS,
  MOVE_TO_ARCHIVE,
  UPDATE_ARCHIVE_NOTIFICATIONS,
  SEARCH_ARCHIVENOTIFICATION,
  GET_SETTING_CONFIGURATION,
  SET_SETTING_CONFIGURATION,
  SAVED_ARCHIVENOTIFICATIONS,
  SET_ISSUEDATE,
  UNREAD_NOTIFICATION_COUNT,
  UPDATE_SEARCHED_ACTIVE_NOTIFICATIONS,
  SET_DEMO_MODE,
} from './../labels/NotificationLabels';
import {showToast} from '../../components/CustomToast';
import {Auth} from 'aws-amplify';
import {
  apiInterceptorForGet,
  apiInterceptorForPost,
  apiInterceptorForPut,
} from './CommonActions';
import messaging from '@react-native-firebase/messaging';
import Clipboard from '@react-native-clipboard/clipboard';
import {Alert, Platform, PermissionsAndroid} from 'react-native';
import * as authActions from '../actions/AuthActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkNotifications} from 'react-native-permissions';

// Get the device token
async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
  }
}

async function requestNotifPermission() {
  try {
    const notificationStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (notificationStatus === 'never_ask_again') {
    }
  } catch (err) {
    console.warn(err);
  }
}

function getDeviceToken(callback) {
  messaging()
    .getToken()
    .then(token => {
      Alert.alert('Notification Token', token, [
        {text: 'Copy', onPress: () => Clipboard.setString(token)},
      ]);
      callback(token);
    });
}
export const registerDeviceTokenWithSNS = () => {
  return async dispatch => {
    const path = '/generateendpointarn';
    if (Platform.OS === 'ios') {
      requestNotificationPermission();
    } else {
      requestNotifPermission();
    }

    messaging()
      .getToken()
      .then(token => {
        // Alert.alert('Notification Token', token, [
        //   {text: 'Copy', onPress: () => Clipboard.setString(token)},
        // ]);
        let input = {token: token};
        apiInterceptorForPost(
          dispatch,
          path,
          input,
          response => {},
          errorResponse => {
            showToast(errorResponse, 'error');
          },
        );
      });
  };
};

export const updateNotificationsCount = count => {
  return async dispatch => {
    dispatch({type: UNREAD_NOTIFICATION_COUNT, data: count});
  };
};

export const clearNotificationsCount = () => {
  return async dispatch => {
    dispatch({type: CLEAR_COUNT, data: 0});
  };
};

export const getActiveNotificationListHomeOwner = (input, successCallback?) => {
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
        successCallback(response);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
      null,
      true,
    );
  };
};

export const getActiveNotificationList = (successCallback?) => {
  return async dispatch => {
    const path = '/contractor/activenotifications';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        response.data.Items.forEach(element => {
          element.uniqueKey = element.userId + element.issueDate;
        });
        dispatch({type: GET_ACTIVE_NOTIFICATIONS, data: response.data.Items});
        if (successCallback) {
          successCallback(response);
        }
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const updateActiveNotificationList = data => {
  return async dispatch => {
    dispatch({type: UPDATE_ACTIVE_NOTIFICATIONS, data: data});
    dispatch({type: UPDATE_COUNT});
  };
};

export const getArchiveNotificationList = input => {
  return async dispatch => {
    const path = '/contractor/paginatedarchivenotifications';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        response.data.Items.forEach(element => {
          element.uniqueKey = element.userId + element.issueDate;
        });
        if (Object.keys(input).length === 0) {
          dispatch({type: GET_ARCHIVE_NOTIFICATIONS, data: response.data});
        } else {
          dispatch({type: UPDATE_ARCHIVE_NOTIFICATIONS, data: response.data});
        }
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const moveNotificationToArchive = (issueDate, successCallback) => {
  return async dispatch => {
    const path = '/contractor/movetoarchive';
    const input = {issueDate: issueDate};
    apiInterceptorForPut(
      dispatch,
      path,
      input,
      response => {
        dispatch({type: MOVE_TO_ARCHIVE, data: issueDate});
        successCallback();
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const removeDeviceToken = props => {
  return async dispatch => {
    const path = '/removearnendpoint';
    messaging()
      .getToken()
      .then(token => {
        let input = {token: token};
        apiInterceptorForPut(
          dispatch,
          path,
          input,
          response => {
            Auth.signOut()
              .then(() => {
                props.navigate('Auth');
                AsyncStorage.setItem('isLoggedIn', 'false');
                dispatch(authActions.logout());
              })
              .catch(err => {});
          },
          errorResponse => {
            showToast(errorResponse, 'error');
          },
        );
      });
  };
};
export const searchArchiveNotification = input => {
  return async dispatch => {
    const path = '/contractor/searcharchivenotifications';
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {
        response.data.forEach(element => {
          element.uniqueKey = element.userId + element.issueDate;
        });
        dispatch({type: SEARCH_ARCHIVENOTIFICATION, data: response.data});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const savedArchiveNotification = () => {
  return async dispatch => {
    dispatch({type: SAVED_ARCHIVENOTIFICATIONS});
  };
};
export const filterArchiveNotification = data => {
  return async dispatch => {
    dispatch({type: SEARCH_ARCHIVENOTIFICATION, data: data});
  };
};
export const getSettingConfiguration = successCallback => {
  return async dispatch => {
    const path = '/settings';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: GET_SETTING_CONFIGURATION, data: response.data});
        successCallback(response.data);
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const setSettingConfiguration = setconfig => {
  return async dispatch => {
    const path = '/settings';
    apiInterceptorForPost(
      dispatch,
      path,
      setconfig,
      response => {
        dispatch({type: SET_SETTING_CONFIGURATION, data: setconfig});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};
export const setIssueDate = data => {
  return async dispatch => {
    dispatch({type: SET_ISSUEDATE, data: data});
  };
};
export const updateActiveNotification = data => {
  return async dispatch => {
    dispatch({type: UPDATE_SEARCHED_ACTIVE_NOTIFICATIONS, data: data});
  };
};

export const setNotificationRead = issueDate => {
  return async dispatch => {
    const path = '/marknotificationread';
    const input = {issueDate: issueDate};
    apiInterceptorForPost(
      dispatch,
      path,
      input,
      response => {},
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const unreadNotificationCount = () => {
  return async dispatch => {
    const path = '/unreadnotificationcount';
    apiInterceptorForGet(
      dispatch,
      path,
      response => {
        dispatch({type: UNREAD_NOTIFICATION_COUNT, data: response.data.count});
      },
      errorResponse => {
        showToast(errorResponse, 'error');
      },
    );
  };
};

export const setDemoModeGlobal = data => {
  return async dispatch => {
    dispatch({type: SET_DEMO_MODE, data: data});
  };
};
