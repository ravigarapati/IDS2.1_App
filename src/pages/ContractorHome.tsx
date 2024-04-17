import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  PixelRatio,
  AppState,
  Platform,
  Linking,
  Alert,
  Text,
} from 'react-native';
import {Colors, Typography} from '../styles';
import {
  BoschIcon,
  CustomInputText,
  Button,
  ConfirmationDialog,
  CustomText,
  CustomPicker,
  ContractorHomeWalkthrough,
  InfoTooltip,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ContractorActions from '../store/actions/ContractorActions';
import ContractorHomeMapView from './ContractorHomeMapView';
import ContractorHomeListView from './ContractorHomeListView';
import {NavigationActions} from 'react-navigation';
import {Enum, userRole} from '../utils/enum';
import {Icons} from '../utils/icons';
import messaging from '@react-native-firebase/messaging';
import * as authActions from '../store/actions/AuthActions';
import {
  updateTermsAndConditions,
  updateUserState,
  getLatestVersion,
} from '../store/actions/AuthActions';
import {
  getActiveNotificationList,
  getArchiveNotificationList,
  updateActiveNotificationList,
  getSettingConfiguration,
  unreadNotificationCount,
} from '../store/actions/NotificationActions';
import {showToast} from '../components/CustomToast';
import {validateInputField} from '../utils/Validator';
import UserAnalytics from '../components/UserAnalytics';
import analytics from '@react-native-firebase/analytics';
import {removeDeviceToken} from '../store/actions/NotificationActions';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Amplify, {Auth, Hub} from 'aws-amplify';
import awsconfig from '../../aws-exports';
import {Mock} from '../utils/Mock';
import variables from '../utils/HomeIdsValue';

export default function ContractorHome(props) {
  const user = useSelector(state => state.auth.user);
  const stateValue = useSelector(
    state => state.contractor.contractorDetails.isAdmin,
  );
  const mapMarkersList = useSelector(state => state.contractor.mapMarkersList);
  const mapMarkersListPending = useSelector(
    state => state.contractor.mapMarkersListPending,
  );
  const companyDetails = useSelector(
    state => state.contractor.contractorDetails.company,
  );
  const isTermsConditionsAccepted = useSelector(
    state => state.contractor.contractorDetails.isTermsConditionsAccepted,
  );
  const appState = useRef(AppState.currentState);
  const [currentTab, setCurrentTab] = useState(
    props.navigation.getParam('tab'),
  );
  const [showFilter, setShowFilter] = useState(false);
  const [userType, setUserType] = useState('');
  const [checkFilter, setCheckFilter] = useState('');
  const filterOptions = {
    list: ['Alert', 'Offline', 'Normal', 'Pending', 'All'],
    map: ['Alert', 'Offline', 'Normal', 'All'],
  };
  const tabs = [
    {label: 'map', icon: Icons.map},
    {label: 'list', icon: Icons.listView},
  ];
  const rippleEffect = TouchableNativeFeedback.Ripple(
    Colors.mediumGray,
    false,
    25,
  );
  const [appliedFilter, setAppliedFilter] = useState('All');
  var unitsList = useSelector(state => state.contractor.unitsList);
  const [filteredList, setFilteredList] = useState(unitsList);
  const [filteredMapMarkers, setFilteredMapMarkers] = useState(mapMarkersList);
  const dispatch = useDispatch();
  const isAdminRemoved = useSelector(
    state => state.contractor.contractorDetails.isAdminRemoved,
  );
  const [contractorRemoved, setContractorRemoved] = useState(false);
  const notificationSelectedUnit = useSelector(
    state => state.contractor.selectedUnit,
  );
  const [selectedOduModelNumber, setOduModelNumber] = useState(
    notificationSelectedUnit.odu.modelNumber,
  );
  // const [versionChange, setVersionChange] = useState(false);
  // const localVersion = Dictionary.common.appVersion;
  const demoMode = useSelector(state => state.notification.demoStatus);
  const unitFilterList = demoMode ? Mock.deviceList : unitsList;
  const mapFilterList = demoMode ? Mock.mapMarkerDemoList : mapMarkersList;

  useEffect(() => {
    setContractorRemoved(isAdminRemoved);
  }, [isAdminRemoved]);
  const [updateInfo, setUpdateInfo] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    state: '',
    zipCode: '',
    companyPhoneNumber: '',
  });
  const [formValid, setFormValid] = useState(false);
  const [errorData, setErrorData] = useState({
    companyName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zipCode: null,
    companyPhoneNumber: null,
  });
  const {navigation} = props;
  useEffect(() => {
    setCurrentTab(variables.tab);
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        props.navigation.addListener('didFocus', () => {
          dispatch(
            ContractorActions.getUnitsList(successCallback => {
              const {unitsList} = successCallback;
              if (unitsList && unitsList.length === 0) {
                setCurrentTab(variables.tab);
              }
              else{
                setCurrentTab(variables.tab);
              }
              //unitsList && unitsList.length === 0
              //  ? setCurrentTab(tabs[0].label)
              //  : '';
            }),
          );
          setContractorRemoved(isAdminRemoved);
          setShowFilter(false);
          setAppliedFilter('All');
        });
      }
    });
  }, [props.navigation]);

  useEffect(() => {
    // dispatch(
    //   getLatestVersion((successCallback) => {
    //     let globalVersion =
    //       Platform.OS === 'ios'
    //         ? successCallback.iosLatestVersion
    //         : successCallback.andriodLatestVersion;
    //     if (globalVersion !== localVersion) {
    //       setVersionChange(true);
    //     } else {
    //       setVersionChange(false);
    //     }
    //   }),
    // );

    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        AppState.addEventListener('change', nextAppState => {
          AsyncStorage.getItem('isLoggedIn').then(value => {
            if (value === 'true') {
              if (appState.current === 'active' && Platform.OS === 'ios') {
                dispatch(
                  getActiveNotificationList(res => {
                    verifyNotificationLogOut(res);
                  }),
                );
                dispatch(unreadNotificationCount());
              }
            }
          });
        });
      }
    });
  }, []);

  useEffect(() => {
    if (companyDetails) {
      let fullAddress = companyDetails.address;
      let addressList = fullAddress.split(',');
      let address = '';
      let address1;
      let address2;

      if (addressList.length === 5) {
        address1 = addressList[addressList.length - 5];
        address2 = addressList[addressList.length - 4];
      } else if (addressList.length > 5) {
        for (let i = 0; i < addressList.length - 4; i++) {
          address = address + addressList[i] + ', ';
        }
        address1 = address;
        address2 = addressList[addressList.length - 4];
      } else {
        address1 = addressList[addressList.length - 4];
      }
      let city = addressList[addressList.length - 3];
      let state = addressList[addressList.length - 2];
      let zipCode = addressList[addressList.length - 1];
      let companyName = companyDetails.name;
      let companyPhoneNumber = companyDetails.phoneNumber;
      let country = companyDetails.country;
      setCompanyData({
        companyName: companyName ? companyName.trim() : '',
        address1: address1 ? address1.trim() : '',
        address2: address2 ? address2.trim() : '',
        city: city ? city.trim() : '',
        country: country ? country : 'US',
        state: state ? state.trim() : '',
        zipCode: zipCode ? zipCode.trim() : '',
        companyPhoneNumber: companyPhoneNumber ? companyPhoneNumber.trim() : '',
      });
    }
  }, [companyDetails]);

  useEffect(() => {
    if (
      errorData.companyName === '' &&
      errorData.address1 === '' &&
      errorData.city === '' &&
      errorData.state === '' &&
      errorData.zipCode === '' &&
      errorData.companyPhoneNumber === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  useEffect(() => {
    if (
      companyData.companyName &&
      companyData.address1 &&
      companyData.city &&
      companyData.country &&
      companyData.state &&
      companyData.zipCode &&
      companyData.zipCode.length === 5 &&
      companyData.companyPhoneNumber &&
      companyData.companyPhoneNumber.length === 12
    ) {
      setFormValid(true);
    }
  }, [companyData]);

  UserAnalytics(stateValue === true ? 'ids_admin_home' : 'ids_contractor_home');

  const didFocusEvent = () => {
    props.navigation.addListener('didFocus', () => {
      AsyncStorage.getItem('forceLogout8').then(value => {
        if (value === 'true') {
          dispatch(unreadNotificationCount());
        }
      });
    });
  };

  const idpIdToken = useSelector(
    state => state.auth.user.attributes['custom:id_token'],
  );

  async function callurl(url, redirectUrl) {
    await InAppBrowser.isAvailable();
    const {type, url: newUrl} = await InAppBrowser.openAuth(
      `https://stage.singlekey-id.com/auth/connect/endsession?post_logout_redirect_uri=idsmobileapp://&id_token_hint=${idpIdToken}&state=STATE`,
      redirectUrl,
      {
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
        ephemeralWebSession: true,
      },
    );

    if (type === 'success') {
      Linking.openURL(newUrl);
    } else {
      Hub.dispatch('browserClosed', {
        event: 'cancel',
        data: 'User clicked close button',
      });
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

  useEffect(() => {
    AsyncStorage.getItem('forceLogout8').then(value => {
      if (value === 'true') {
        dispatch(ContractorActions.getUnitsList());
        dispatch(
          getActiveNotificationList(res => {
            verifyNotificationLogOut(res);
          }),
        );
        dispatch(getArchiveNotificationList({}));
        setTimeout(() => {
          dispatch(
            getSettingConfiguration(returnValue => {
              dispatch(
                ContractorActions.checkAnalyticsValue(
                  returnValue.settings.userAnalytics,
                ),
              );
            }),
          );
        }, 2000);
        dispatch(unreadNotificationCount());
        didFocusEvent();
        let ratio = PixelRatio.get();
        const input = {
          role: 'contractor',
          imageSize:
            ratio >= 1 && ratio < 2
              ? 'image1x'
              : ratio >= 2 && ratio < 3
              ? 'image2x'
              : 'image3x',
        };
        dispatch(ContractorActions.getFaqList(input));

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          dispatch(
            getActiveNotificationList(res => {
              verifyNotificationLogOut(res);
            }),
          );
          dispatch(unreadNotificationCount());
        });
      }
    });
  }, []);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(initialMessage => {
        if (initialMessage != null || initialMessage != undefined) {
          props.navigation.navigate('Notification', {isSearch: false});
        }
      });

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage != null || remoteMessage != undefined) {
        props.navigation.navigate('Notification', {isSearch: false});
      }
    });
  }, []);

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
      }
    });
  }, [isTermsConditionsAccepted, unitsList]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showToast('New notification received', 'info');
      const {data} = remoteMessage;
      const {notification, ODUSerialNumber} = data;
      dispatch(
        getActiveNotificationList(res => {
          verifyNotificationLogOut(res);
        }),
      );
      dispatch(unreadNotificationCount());
      // dispatch(updateActiveNotificationList(remoteMessage.data));
      if (
        notification === 'remoteAccessGranted' ||
        notification === 'remoteAccessRevoked'
      ) {
        notificationRefresh(ODUSerialNumber);
      }
    });

    return unsubscribe;
  }, [selectedOduModelNumber]);

  useEffect(() => {
    if (currentTab === 'map' && appliedFilter === 'Pending') {
      setAppliedFilter('All');
      setCheckFilter('Pending');
    } else if (currentTab === 'list' && checkFilter === 'Pending') {
      setAppliedFilter('Pending');
      setCheckFilter('');
    }
  }, [currentTab]);

  useEffect(() => {
    if (appliedFilter === 'All') {
      setFilteredList(unitFilterList);
      setFilteredMapMarkers(mapFilterList);
    } else {
      setCheckFilter('');
      setFilteredList(
        unitFilterList.filter(
          item => item.systemStatus === appliedFilter.toUpperCase(),
        ),
      );
      setFilteredMapMarkers(
        mapFilterList.filter(
          item => item.systemStatus === appliedFilter.toUpperCase(),
        ),
      );
    }
  }, [appliedFilter, mapMarkersList, unitsList]);

  useEffect(() => {
    setOduModelNumber(
      notificationSelectedUnit &&
        notificationSelectedUnit.odu &&
        notificationSelectedUnit.odu.modelNumber,
    );
  }, [notificationSelectedUnit]);

  const navigateToAddUnit = () => {
    let role = 'Admin';
    //stateValue === true ? role : (role = 'Installer');
    if (!stateValue === true) {
      role = 'Installer';
    }
    analytics().logEvent('ids_add_unit', {
      role: role,
      openedThrough: currentTab,
    });
    AsyncStorage.getItem('MountAntenna').then(value => {
      if (value === 'hide') {
        AsyncStorage.getItem('PowerUpODU').then(val => {
          if (val === 'hide') {
            props.navigation.navigate('AddODU');
          } else {
            props.navigation.navigate('PowerUpODU');
          }
        });
      } else {
        props.navigation.navigate('MountAntenna');
        //props.navigation.navigate('AddODU');
      }
    });
  };

  const goToDashboard = unit => {
    dispatch(ContractorActions.setSelectedUnit(unit)).then(() => {
      if (unit.systemStatus.toLowerCase() === Enum.status.pending) {
        NavigationActions.navigate({routeName: 'Installation'});
        props.navigation.navigate('RemoteAccess');
      } else {
        props.navigation.navigate('Installation');
      }
    });
  };

  const notificationRefresh = ODUSerialNumber => {
    dispatch(
      ContractorActions.getUnitsList(responseData => {
        const {unitsList} = responseData;
        const unitData = unitsList.filter(
          value =>
            value && value.odu && value.odu.serialNumber === ODUSerialNumber,
        );
        const {odu, gateway} = unitData && unitData[0];
        const {modelNumber} = odu;
        const {gatewayId} = gateway;
        if (modelNumber === selectedOduModelNumber) {
          dispatch(ContractorActions.getWarrantyInfo(gatewayId));
          dispatch(ContractorActions.setSelectedUnit(unitData[0]));
        }
      }),
    );
  };

  const refresh = () => {
    dispatch(
      ContractorActions.getUnitsList(successCallback => {
        const {unitsList} = successCallback;
        if (unitsList && unitsList.length === 0) {
          setCurrentTab('list');
        }
        else{
          setCurrentTab(variables.tab);
        }
        //unitsList && unitsList.length === 0 ? setCurrentTab(tabs[1].label) : '';
      }),
    );
  };
  const listDeleted = () => {
    if (unitsList && unitsList.length === 1) {
      setCurrentTab(variables.tab);
    }
    else{
      setCurrentTab(variables.tab);
    }
    //unitsList && unitsList.length === 1 ? setCurrentTab(tabs[0].label) : '';
  };

  const NoUnits = () => {
    return (
      <View style={[styles.padding20, styles.flex1]}>
        <ImageBackground
          style={[
            styles.padding20,
            styles.flex1,
            styles.justifyCenter,
            styles.marginBottom30,
          ]}
          source={require('../assets/images/nounit_mapview.png')}>
          {mapMarkersListPending.length === 0 && (
            <CustomText
              text={Dictionary.home.noUnits}
              font="bold"
              size={21}
              newline={true}
            />
          )}
          {mapMarkersListPending.length === 0 && (
            <CustomText text={Dictionary.home.addFirstUnit} newline={true} />
          )}
          {mapMarkersList.length === 0 &&
            mapMarkersListPending.length !== 0 && (
              <CustomText text={Dictionary.home.pendingUnit} newline={true} />
            )}
        </ImageBackground>
        {mapMarkersListPending.length === 0 && (
          <CustomText text={Dictionary.home.registerWarranty} newline={true} />
        )}
        <Button
          type="primary"
          text={Dictionary.button.registerProduct}
          onPress={() => {
            dispatch(ContractorActions.prCleanInfo());
            props.navigation.navigate('ProductInfo');
          }}
        />
      </View>
    );
  };
  const FilterDropdown = ({list}) => {
    return (
      <View style={styles.filterView}>
        {list.map(filter => (
          <TouchableOpacity
            onPress={() => {
              setShowFilter(false);
              setAppliedFilter(filter);
            }}
            key={filter}
            style={[
              styles.filterItem,
              {
                backgroundColor:
                  filter === appliedFilter ? Colors.darkBlue : Colors.white,
              },
            ]}>
            <CustomText
              align="left"
              text={filter}
              color={filter === appliedFilter ? Colors.white : Colors.black}
              key={filter}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const saveCompanyInfo = () => {
    let compDetails = {
      companyName: companyData.companyName,
      companyPhoneNumber: companyData.companyPhoneNumber,
      companyAddress: {
        address1: companyData.address1,
        address2: companyData.address2,
        city: companyData.city,
        //country: companyData.country,
        state: companyData.state,
        zipCode: companyData.zipCode,
      },
      addressChanged: true,
    };
    setUpdateInfo(false);
    if (unitsList && unitsList.length === 0) {
      setCurrentTab(variables.tab);
    }
    else{
      setCurrentTab(variables.tab);
    }
    //unitsList && unitsList.length === 0 ? setCurrentTab(tabs[0].label) : '';
    dispatch(
      ContractorActions.contractorRequest(compDetails, () => {
        dispatch(ContractorActions.getUnitsList());
      }),
    );
  };

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function setData(field, value, pattern) {
    setCompanyData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }
  }

  const verifyNotificationLogOut = res => {
    const arrayNotifications = res.data.Items;

    const exist = arrayNotifications.find(
      element => element.notificationType == 'userDeleted',
    );
    if (exist) {
      Alert.alert(
        'Bosch EasyAir App',
        Dictionary.common.userDeleted,
        [
          {
            text: 'Ok',
            onPress: () => {
              logout();
            },
          },
        ],
        {cancelable: true},
      );
    }
  };

  // Logout Android --->
  async function callurlLogOut(url, redirectUrl) {
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
        callurlLogOut,
      },
    });
  // Logout Android Ends --->

  const logout = () => {
    if (Platform.OS !== 'ios') {
      callurlLogOut();
    }
    dispatch(removeDeviceToken(props.navigation));
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowFilter(false);
      }}>
      <View style={styles.container}>
        <ContractorHomeWalkthrough />
        <CustomText
          noOfLines={1}
          allowFontScaling={false}
          style={[
            styles.welcomeText,
            demoMode ? styles.paddingDemo : styles.padding20,
          ]}
          text={
            Dictionary.createProfile.welcomeUser + user.attributes.name + '!'
          }
        />
        {demoMode ? (
          <View style={[styles.flexRow, styles.justifyCenter]}>
            <CustomText
              noOfLines={1}
              text={Dictionary.settings.demoMode}
              font={'light-italic'}
              style={styles.paddingTop10}
            />
            <InfoTooltip
              positionHorizontal="right"
              positionVertical="bottom"
              text={Dictionary.demoMode.limitedFunctionality}
            />
          </View>
        ) : null}
        <View style={[styles.tabView]}>
          <View style={[styles.flexRow, styles.flex1]}>
            {tabs.map(tab => (
              <TouchableNativeFeedback
                background={rippleEffect}
                key={tab.label}
                onPress={() => {
                 if (unitsList && unitsList.length > 0 || demoMode) {
                    setCurrentTab(tab.label);
                    variables.tab=tab.label
                  }
                  setShowFilter(false);
                }}>
                <View>
                  <BoschIcon
                    name={tab.icon}
                    size={28}
                    style={styles.tabIcon}
                    color={
                      currentTab === tab.label
                        ? Colors.darkBlue
                        : (unitsList && unitsList.length > 0) || demoMode
                        ? Colors.black
                        : Colors.grayDisabled
                    }
                    accessibilityLabel={tab.label + 'view'}
                  />
                  {currentTab === tab.label &&
                  ((unitsList && unitsList.length > 0) || demoMode) ? (
                    <View style={styles.tabUnderline} />
                  ) : null}
                </View>
              </TouchableNativeFeedback>
            ))}
            {((unitsList && unitsList.length > 0) || demoMode) && (
              <View>
                <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
                  <BoschIcon
                    name={
                      appliedFilter !== 'All'
                        ? Icons.successFilter
                        : Icons.filter
                    }
                    size={28}
                    style={styles.tabIcon}
                    accessibilityLabel={'Filter'}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {unitsList && (
            <>
              <Button
                type="tertiary"
                text={Dictionary.button.addNewUnit}
                icon={Icons.addFrame}
                onPress={() =>
                  demoMode
                    ? showToast(Dictionary.demoMode.functionNotAvailable)
                    : navigateToAddUnit()
                }
              />
            </>
          )}
        </View>
        {currentTab === 'map' && (
          <View style={[styles.flex1]}>
            {((filteredMapMarkers &&
              mapMarkersList &&
              mapMarkersList.length > 0) ||
              demoMode) && (
              <>
                <ContractorHomeMapView
                  companyDetails={companyDetails}
                  goToDashboard={goToDashboard}
                  mapMarkersList={filteredMapMarkers}
                />
                {showFilter && <FilterDropdown list={filterOptions.map} />}
              </>
            )}
            {mapMarkersList && mapMarkersList.length === 0 && !demoMode && (
              <NoUnits />
            )}
          </View>
        )}
        {currentTab === 'list' && (
          <View style={[styles.flex1]}>
            {((unitsList && unitsList.length > 0) || demoMode) && (
              <>
                <ContractorHomeListView
                  unitsList={filteredList}
                  refresh={refresh}
                  goToDashboard={goToDashboard}
                  listDeleted={listDeleted}
                />
                {showFilter && <FilterDropdown list={filterOptions.list} />}
              </>
            )}
            {unitsList && unitsList.length === 0 && !demoMode && <NoUnits />}
          </View>
        )}

        <View>
          {contractorRemoved && (
            <View>
              <ConfirmationDialog
                visible={contractorRemoved}
                title={Dictionary.adminPortal.disassociated}
                text={Dictionary.adminPortal.disassociated2}
                textAlign={'center'}
                textColor={'#43464A'}
                warningAlertText={Dictionary.adminPortal.warningAlert}
                primaryButton={Dictionary.button.updateInfo}
                primaryButtonOnPress={() => {
                  setContractorRemoved(false);
                  setTimeout(() => {
                    setUpdateInfo(true);
                  }, 200);
                }}
              />
            </View>
          )}
          {updateInfo && (
            <View>
              <Modal
                animationType="none"
                transparent={true}
                visible={updateInfo}>
                <ScrollView contentContainerStyle={styles.popupContainer}>
                  <View style={styles.modalContainer}>
                    <View style={styles.contentContainer}>
                      <CustomText
                        text={Dictionary.adminPortal.updateCompanyInfo}
                        align="center"
                        color={'#43464A'}
                      />
                      <View>
                        <CustomInputText
                          placeholder={Dictionary.companyInfo.companyName}
                          onChange={val =>
                            setData('companyName', val, Enum.companyNamePattern)
                          }
                          value={companyData.companyName}
                          isRequiredField={true}
                          errorText={
                            errorData.companyName
                              ? Dictionary.companyInfo.companyNameRequired
                              : ''
                          }
                          style={{color: '#43464A'}}
                        />
                        {/* <CustomText
                          newline={false}
                          text={Dictionary.productRegistration.country}
                          size={15}
                          align={"left"}
                          font={"medium"}
                          style={{ paddingHorizontal:5, paddingTop: 0 }}
                          />
                  <View style={{flexDirection: 'row', marginVertical: 10, paddingHorizontal:5, paddingVertical:10}}> 
                          <Radiobutton
                            accessibilityLabelText={
                              "United States"
                            }
                            accessibilityHintText={
                              "Select United States"
                            }
                            checked={
                              companyData.country === 'US'
                              //Dictionary.addDevice.addBcc.unitedStates
                            }
                            handleCheck={() => {
                              setCompanyData((prevData) =>({
                                ...prevData,
                                country: 'US',
                                address1: '',
                                address2: '',
                                state: '',
                                city: '',
                                zipCode: '',
                              }));
                              setErrorData((prevData) =>({
                                ...prevData,
                                address1: null,
                                city: null,
                                state: null,
                                zipCode: null,
                              }));
                            }}
                            text={'United States'}
                              //Dictionary.addDevice.addBcc.unitedStates}
                            style={{marginRight: 30}}
                          />
                          <Radiobutton
                            accessibilityLabelText={
                              'Canada'
                            }
                            accessibilityHintText={
                              'Select Canada'
                            }
                            checked={
                              companyData.country === 'CA'
                            }
                            handleCheck={() => {
                              setCompanyData((prevData) =>({
                                ...prevData,
                                country: 'CA',
                                address1: '',
                                address2: '',
                                state: '',
                                city: '',
                                zipCode: '',
                              }));
                              setErrorData((prevData) =>({
                                ...prevData,
                                address1: null,
                                city: null,
                                state: null,
                                zipCode: null,
                              }));
                            }}
                            text={"Canada"}
                          />
                        </View> */}

                        <CustomInputText
                          disableCache={false}
                          placeholder={Dictionary.createProfile.address1}
                          onChange={val =>
                            setData('address1', val, Enum.address1Pattern)
                          }
                          value={companyData.address1}
                          disabled={companyData.country == '' ? true : false}
                          isRequiredField={true}
                          errorText={
                            errorData.address1 ? errorData.address1 : ''
                          }
                          autoCapitalize="words"
                          prStyle={true}
                        />
                        <CustomInputText
                          disableCache={true}
                          placeholder={Dictionary.createProfile.address2}
                          onChange={val =>
                            setData('address2', val, Enum.address1Pattern)
                          }
                          value={companyData.address2}
                          disabled={companyData.country == '' ? true : false}
                          isRequiredField={false}
                          autoCapitalize="words"
                          prStyle={true}
                        />
                        <CustomInputText
                          disableCache={false}
                          placeholder={Dictionary.productRegistration.city}
                          onChange={val =>
                            setData('city', val, Enum.cityPattern)
                          }
                          value={companyData.city}
                          disabled={companyData.country == '' ? true : false}
                          isRequiredField={true}
                          errorText={errorData.city ? errorData.city : ''}
                          autoCapitalize="words"
                          prStyle={true}
                        />
                        <CustomPicker
                          placeholder={Dictionary.productRegistration.state}
                          value={companyData.state}
                          onChange={(state: any) =>
                            setData('state', state.value, Enum.required)
                          }
                          options={
                            companyData.country == 'US'
                              ? Enum.stateList
                              : Enum.provincelist
                          }
                          //iteratorKey="index"
                          iteratorLabel="label"
                          disabled={companyData.country == '' ? true : false}
                          isRequiredField={true}
                          showFieldLabel={true}
                          prStyle={true}
                        />
                        <CustomInputText
                          disableCache={false}
                          placeholder={Dictionary.createProfile.zipcode}
                          onChange={val =>
                            companyData.country == 'CA'
                              ? setData('zipCode', val, Enum.zipCodePatternCA)
                              : setData('zipCode', val, Enum.zipCodePattern)
                          }
                          value={companyData.zipCode}
                          disabled={companyData.country == '' ? true : false}
                          maxLength={
                            companyData.country == 'CA'
                              ? Enum.zipCodePatternCA.length
                              : Enum.zipCodePattern.length
                          }
                          isRequiredField={true}
                          errorText={errorData.zipCode ? errorData.zipCode : ''}
                          autoCapitalize="characters"
                          keyboardType={
                            companyData.country == 'US' ? 'numeric' : 'default'
                          }
                          prStyle={true}
                        />
                        <CustomInputText
                          placeholder={Dictionary.companyInfo.phoneNo}
                          onChange={val =>
                            setData(
                              'companyPhoneNumber',
                              val,
                              Enum.phoneNumberPattern,
                            )
                          }
                          value={companyData.companyPhoneNumber}
                          delimiterType="phoneNumber"
                          maxLength={Enum.phoneNumberPattern.length}
                          keyboardType="numeric"
                          isRequiredField={true}
                          errorText={
                            errorData.companyPhoneNumber
                              ? Dictionary.companyInfo.phoneNoRequired
                              : ''
                          }
                          style={{color: '#43464A'}}
                        />
                      </View>
                      <View style={[styles.paddingVertical10]}>
                        <Button
                          type="primary"
                          text={Dictionary.button.submit}
                          disabled={!formValid}
                          onPress={() => saveCompanyInfo()}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </Modal>
            </View>
          )}
        </View>
        {/* {versionChange && (
          <View>
            <ConfirmationDialog
              visible={versionChange}
              title={Dictionary.common.newVersion}
              text={Dictionary.common.version}
              textAlign={'center'}
              textColor={'#43464A'}
              primaryButton={'Update'}
              primaryButtonOnPress={() => {
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? Dictionary.common.appStoreUrl
                    : Dictionary.common.playStoreUrl,
                );
                dispatch(removeDeviceToken(props.navigation));
              }}
            />
          </View>
        )} */}
      </View>
    </TouchableWithoutFeedback>
  );
  // };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  padding20: {
    padding: 20,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  paddingDemo: {
    paddingBottom: 0,
    padding: 20,
  },
  welcomeText: {
    ...Typography.boschMedium21,
  },
  demoText: {
    ...Typography.boschMedium16,
  },
  tabView: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  tabIcon: {
    padding: 10,
  },
  tabUnderline: {
    borderBottomColor: Colors.darkBlue,
    borderBottomWidth: 2,
  },
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  padLeft5: {
    paddingLeft: 5,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  filterView: {
    left: 100,
    position: 'absolute',
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.darkRed,
    top: 5,
    right: 10,
    position: 'absolute',
  },
  marginBottom30: {
    marginBottom: 30,
  },
  // Modal
  popupContainer: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  contentContainer: {
    width: '90%',
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
  paddingVertical10: {
    paddingVertical: 10,
  },
  marginBottom: {
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blur,
  },
  // padding20: {
  //   padding: 20,
  // },
});
