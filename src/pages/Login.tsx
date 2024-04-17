import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Linking,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AppState,
} from 'react-native';
import Amplify, {Auth, Hub} from 'aws-amplify';
import {Colors, Typography} from '../styles';
import {BoschIcon, Button, CustomText} from '../components';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import awsconfig from '../../aws-exports';
import {useDispatch} from 'react-redux';
import * as authActions from '../store/actions/AuthActions';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';
import crashlytics from '@react-native-firebase/crashlytics';
import {registerDeviceTokenWithSNS} from '../store/actions/NotificationActions';
import {Dictionary} from '../utils/dictionary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLatestVersion} from '../store/actions/AuthActions';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    showInRecents: true,
    ephemeralWebSession: true,
  });
  if (type === 'success') {
    if (Platform.OS === 'ios') {
      Linking.openURL(newUrl);
    } else {
      //Linking.openURL(newUrl);
    }
  } else {
    Hub.dispatch('browserClosed', {
      event: 'cancel',
      data: 'User clicked close button',
    });
  }
}
Amplify.configure({
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener,
  },
});

function Login(props) {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const appState = useRef(AppState.currentState);
  // const [versionChange, setVersionChange] = useState(false);
  // const localVersion = Dictionary.common.appVersion;
  let previousState = '';

  // const versionCheck = () => {
  //   dispatch(
  //     getLatestVersion((successCallback) => {
  //       let globalVersion =
  //         Platform.OS === 'ios'
  //           ? successCallback.iosLatestVersion
  //           : successCallback.andriodLatestVersion;
  //       if (globalVersion !== localVersion) {
  //         setVersionChange(true);
  //       } else {
  //         setVersionChange(false);
  //       }
  //     }),
  //   );
  // };

  useEffect(() => {
    Amplify.configure({
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        urlOpener,
      },
    });

    // versionCheck();
    AppState.addEventListener('change', nextAppState => {
      if (AppState.currentState === 'inactive') {
        previousState = 'inactive';
      }
      if (AppState.currentState === 'background') {
        previousState = 'background';
      }
      if (AppState.currentState === 'active') {
        // versionCheck();
      }
      if (AppState.currentState === 'active' && previousState !== 'inactive') {
        InAppBrowser.close();
        setShowLoader(false);
      }
      appState.current = nextAppState;
    });
  }, []);
  useEffect(() => {
    var mounted = true;
    crashlytics().log('Login');
    Hub.listen('browserClosed', ({payload: {event, data}}) => {
      switch (event) {
        case 'cancel':
          setShowLoader(false);
          break;
        default:
          break;
      }
    });
    Hub.listen('auth', ({payload: {event, data}}) => {
      if (mounted) {
        switch (event) {
          case 'signIn':
            setShowLoader(true);
            getUser();
            AsyncStorage.setItem('isLoggedIn', 'true');
            break;
          case 'signIn_failure':
          case 'cognitoHostedUI_failure':
            setShowLoader(false);
            break;
          default:
            InAppBrowser.close();
        }
      }
    });
    return () => {
      mounted = false;
    };
  });

  async function getUser() {
    Auth.currentAuthenticatedUser()
      .then(userData => {
        dispatch(
          HomeOwnerActions.registerLogin(
            userData.attributes.email,
            userData.attributes.sub,
          ),
        );
        setShowLoader(true);
        crashlytics().setUserId(userData.attributes.sub);
        dispatch(registerDeviceTokenWithSNS());

        dispatch(authActions.setCurrentUser(userData));
        AsyncStorage.setItem('forceLogout8', 'true');
        if (userData.attributes['custom:role']) {
          crashlytics().setAttribute(
            'role',
            userData.attributes['custom:role'],
          );
          if (userData.attributes['custom:role'] === Enum.roles.contractor) {
            props.navigation.navigate('Contractor');
          } else if (
            userData.attributes['custom:role'] === Enum.roles.homeowner
          ) {
            props.navigation.navigate('HomeOwner');
          } else if (
            userData.attributes['custom:role'] ===
            Enum.roles.contractorPowerUser
          ) {
            props.navigation.navigate('ContractorPowerUser');
          }
        } else {
          props.navigation.replace('CreateProfile');
        }
      })
      .catch(err => {
        crashlytics().recordError(err);
      });
  }

  return (
    <>
      <View
        // style={[styles.container, {opacity: versionChange ? 0.7 : 1}]}
        // pointerEvents={versionChange ? 'none' : 'auto'}
        style={[styles.container]}>
        <View style={styles.alignCenter}>
          <BoschIcon
            name={Icons.myBrandFrame}
            color={(Colors.darkBlue, Colors.darkBlue)}
            size={120}
            accessibilityLabel={'Profile'}
            style={{height: 120}}
          />
        </View>
        <View>
          <Button
            type="primary"
            onPress={() => {
              // Auth.federatedSignIn({customProvider: 'IDS-TTNA'});
              Auth.federatedSignIn({customProvider: 'IDS-TTNA'})
                .then(cred => {
                  // If success, you will get the AWS credentials
                  return Auth.currentAuthenticatedUser();
                })
                .then(user => {
                  // If success, the user object you passed in Auth.federatedSignIn
                })
                .catch(e => {});

              setShowLoader(true);
            }}
            text={Dictionary.common.signIn}
          />
          <Button
            type="secondary"
            onPress={() => {
              //Auth.federatedSignIn({customProvider: 'IDS-TTNA'});
              Linking.openURL(
                'https://stage.singlekey-id.com/en-us/sign-up/',
                null,
              );
              setShowLoader(true);
              /*InAppBrowser.open(
                'https://stage.singlekey-id.com/en-us/sign-up/',
                {
                  // iOS Properties
                  dismissButtonStyle: 'done',
                  preferredBarTintColor: '#FFFFFF',
                  preferredControlTintColor: '#4676ee',
                  readerMode: false,
                  animated: true,
                  modalPresentationStyle: 'automatic',
                  modalTransitionStyle: 'coverVertical',
                  modalEnabled: true,
                  enableBarCollapsing: true,
                  // Android Properties
                  showTitle: false,
                  toolbarColor: '#FFFFFF',
                  secondaryToolbarColor: 'black',
                  navigationBarColor: 'black',
                  navigationBarDividerColor: 'white',
                  enableUrlBarHiding: true,
                  enableDefaultShare: false,
                  forceCloseOnRedirection: false,
                  showInRecents: true,
                  // Specify full animation resource identifier(package:anim/name)
                  // or only resource name(in case of animation bundled with app).
                  animations: {
                    startEnter: 'slide_in_bottom',
                    startExit: 'slide_out_top',
                    endEnter: 'slide_in_top',
                    endExit: 'slide_out_bottom',
                  },
                },
              );*/
            }}
            text={Dictionary.common.signUp}
          />
        </View>
        {showLoader && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Colors.darkBlue} />
          </View>
        )}
      </View>
      {/* {versionChange && (
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <CustomText
              text={Dictionary.common.newVersion}
              align="center"
              style={styles.modalTitle}
            />
            <CustomText
              text={Dictionary.common.version}
              align="center"
              style={styles.modalTitle}
            />
            <Button
              type="primary"
              onPress={() => {
                setVersionChange(false);
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? Dictionary.common.appStoreUrl
                    : Dictionary.common.playStoreUrl,
                );
              }}
              text={Dictionary.common.update}
            />
          </View>
        </View>
      )} */}
    </>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: Colors.white,
  },
  alignCenter: {
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
  },
  text: {
    ...Typography.boschReg16,
    fontSize: 12,
  },
  fullWidth: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  padLeft5: {
    paddingLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  contentContainer: {
    width: '95%',
    borderWidth: 0.5,
    borderColor: Colors.mediumGray,
    backgroundColor: Colors.white,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: Colors.darkGray,
    marginBottom: 20,
  },
});
