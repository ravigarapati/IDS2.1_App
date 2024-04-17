import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, PixelRatio, AppState, Platform} from 'react-native';
import {MaterialTopTabBar} from 'react-navigation-tabs';
import {Colors} from '../styles';
import {useSelector} from 'react-redux';
import * as homeOwnerActions from '../store/actions/HomeOwnerActions';
import * as NotificationActions from '../store/actions/NotificationActions';
import {useDispatch} from 'react-redux';
import {CustomPicker} from '../components';
import {Dictionary} from '../utils/dictionary';
import {showToast} from '../components/CustomToast';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import {
  updateTermsAndConditions,
  updateUserState,
} from '../store/actions/AuthActions';
import {userRole} from '../utils/enum';
import {Auth} from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Amplify, {Hub} from 'aws-amplify';
import awsconfig from '../../aws-exports';

export const HomeOwnerTabs = props => {
  const previouslySelectedDevice = useSelector(
    state => state.homeOwner.selectedDevice,
  );
  const selectedDevice = useSelector(state => state.homeOwner.selectedUnitName);
  const deviceList = useSelector(state => state.homeOwner.deviceList);
  const dispatch = useDispatch();
  const {navigation} = props;
  const isTermsConditionsAccepted = useSelector(
    state => state.homeOwner.isTermsConditionsAccepted,
  );
  const idsSelectedDevice = useSelector(
    state => state.homeOwner.idsSelectedDevice,
  );
  const appState = useRef(AppState.currentState);
  const [userType, setUserType] = useState('');
  useEffect(() => {
    if (isTermsConditionsAccepted === false) {
      AsyncStorage.getItem('isLoggedin').then(value => {
        if (value === 'true') {
          userRole().then(response => {
            AsyncStorage.setItem('userRole', response);
            navigation.replace('Terms');
          });
        } else if (value === 'false') {
          AsyncStorage.getItem('termsAcceptedVersion').then(value => {
            if (value) {
              userRole().then(response => {
                // dispatch(updateUserState(response));
                AsyncStorage.setItem('userRole', response);
                setUserType(response);

                let input = {
                  versionId: value.toString(),
                  userGroup: response,
                };
                dispatch(
                  updateTermsAndConditions(input, () => {
                    AsyncStorage.setItem('isLoggedin', 'true');
                  }),
                );
              });
            }
          });
        }
      });
    } else if (isTermsConditionsAccepted === true) {
      AsyncStorage.setItem('isLoggedin', 'true');
    }
  }, [isTermsConditionsAccepted, deviceList]);

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        dispatch(homeOwnerActions.getDeviceList());
      }
    });

    // userRole().then((response) => {
    //   dispatch(updateUserState(response));
    //   setUserType(response);
    // });
  }, []);

  // Logout Android --->
  async function callurl(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?&id_token_hint=${idpIdToken}&state=STATE`,
      `idsmobileapp://`,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        showInRecents: true,
        ephemeralWebSession: true,
      },
    );
    if (type === 'success') {
      //Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
      InAppBrowser.close();
    }
  }
  Platform.OS !== 'ios' &&
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        callurl,
      },
    });
  // Logout Android Ends --->

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
      } else {
        dispatch(removeDeviceToken(props.navigation));
        setTimeout(() => {
          if (Platform.OS !== 'ios') {
            callurl();
          }
        }, 100);

        AsyncStorage.setItem('forceLogout8', 'true');
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        messaging()
          .getInitialNotification()
          .then(initialMessage => {
            if (initialMessage != null || initialMessage != undefined) {
              props.navigation.navigate('HomeOwnerNotification');
            }
          });

        messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage != null || remoteMessage != undefined) {
            props.navigation.navigate('HomeOwnerNotification');
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        AppState.addEventListener('change', nextAppState => {
          AsyncStorage.getItem('isLoggedIn').then(value => {
            if (value === 'true') {
              if (appState.current === 'active' && Platform.OS === 'ios') {
                dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
                dispatch(homeOwnerActions.notifications({}));
              }
            }
          });
        });
      }
    });
  }, []);
  const onDeviceChange = val => {
    dispatch(homeOwnerActions.updateSelectedUnitName(val));
    if (deviceList) {
      let device = deviceList.find(data => data.gatewayId === val.gatewayId);
      dispatch(homeOwnerActions.setSelectedDevice(device));
      dispatch(homeOwnerActions.setPrevSelectedDevice(device));
      dispatch(homeOwnerActions.getUsageGraphByDeviceId(idsSelectedDevice));
    }
  };

  const didFocusEvent = () => {
    props.navigation.addListener('didFocus', () => {
      dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
      dispatch(homeOwnerActions.getDeviceList());
    });
  };
  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        dispatch(homeOwnerActions.notifications({}));
        dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
        dispatch(
          NotificationActions.getSettingConfiguration(returnValue => {
            dispatch(
              homeOwnerActions.checkHoAnalyticsValue(
                returnValue.settings.userAnalytics,
              ),
            );
          }),
        );
        didFocusEvent();
        let ratio = PixelRatio.get();
        const input = {
          role: 'homeowner',
          imageSize:
            ratio >= 1 && ratio < 2
              ? 'image1x'
              : ratio >= 2 && ratio < 3
              ? 'image2x'
              : 'image3x',
        };
        dispatch(homeOwnerActions.getFaqList(input));

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
          dispatch(homeOwnerActions.notifications({}));
          // dispatch(homeOwnerActions.addNewNotification(remoteMessage.data));
        });

        const unsubscribe = messaging().onMessage(async remoteMessage => {
          showToast('New notification received', 'info');
          dispatch(homeOwnerActions.unreadHomeownerNotificationCount());
          dispatch(homeOwnerActions.notifications({}));
          //dispatch(homeOwnerActions.addNewNotification(remoteMessage.data));
        });

        return unsubscribe;
      }
    });
  }, []);

  return (
    <View style={{backgroundColor: Colors.white}}>
      {/* <CustomPicker
        placeholder={Dictionary.myAppliance.unitName + ':'}
        value={
          selectedDevice.ODUName
            ? selectedDevice.ODUName
            : deviceList && deviceList.length > 0 && deviceList[0].ODUName
        }
        onChange={(val) => onDeviceChange(val)}
        style={styles.pickerStyle}
        options={deviceList}
        iteratorKey="gatewayId"
        iteratorLabel="ODUName"
        showFieldLabel={true}
      /> */}
      <MaterialTopTabBar {...props} />
    </View>
  );
};
const styles = StyleSheet.create({
  pickerStyle: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
