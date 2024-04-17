/**
 * @file Live Data is a tab in the installation dashboard for Constractor.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {
  Banner,
  BoschIcon,
  Button,
  ConfirmationDialog,
  CustomText,
  Link,
  SectionHeading,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {liveData, model18M, model20G} from '../utils/enum';
import {useSelector, useDispatch} from 'react-redux';
import {
  requestLocationPermission,
  getRandomString,
  bleDataMapper,
} from '../utils/BleCommunicator';
import {BleManager} from 'react-native-ble-plx';
import {showToast} from '../components/CustomToast';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';
import * as ContractorActions from '../store/actions/ContractorActions';
import crashlytics from '@react-native-firebase/crashlytics';
import {updateDeviceAlreadyConnected} from '../store/actions/ContractorActions';
import UserAnalytics from '../components/UserAnalytics';
import DeviceInfo from 'react-native-device-info';

const bleManager = new BleManager();
const ThermostatCall = ({selected, name}) => {
  const demoMode = useSelector(state => state.notification.demoStatus);
  if (demoMode) {
    name === 'Y (Compressor)' ? (selected = true) : (selected = false);
  }
  const unselectedColor = {
    borderColor: selected ? Colors.darkGreen : Colors.white,
    backgroundColor: selected ? Colors.white : Colors.grayDisabled,
  };
  const selectedColor = {
    backgroundColor: selected ? Colors.darkGreen : Colors.grayDisabled,
  };
  return (
    <View style={styles.flexRowCenter}>
      <View style={[styles.unselected, unselectedColor]}>
        <View style={[styles.selected, selectedColor]} />
      </View>
      <CustomText text={name} />
    </View>
  );
};

const CompressorLoadSlider = ({compressorLoad, compressorFreq}) => {
  const demoMode = useSelector(state => state.notification.demoStatus);
  if (demoMode) {
    compressorLoad = 0;
    compressorFreq = 0;
  }
  const width = Dimensions.get('window').width - 80;
  const compressorLoadPercentage = (compressorLoad / 110) * 100;
  const calculateLeft = val => {
    return (val * width) / 110;
  };
  const ScaleText = ({val}) => {
    return (
      <CustomText
        text={val.toString() + '%'}
        size={10}
        style={[styles.scaleText, {left: calculateLeft(val) - 5}]}
      />
    );
  };
  return (
    <View style={[styles.sliderGray, {width: width}, styles.paddingBottom10]}>
      <View
        style={[styles.sliderBlue, {width: compressorLoadPercentage + '%'}]}>
        <View style={styles.triangleBlack} />
      </View>
      <CustomText
        text={compressorFreq + ' Hz'}
        align="left"
        size={14}
        style={[
          styles.sliderVal,
          {left: (compressorLoadPercentage - 5).toString() + '%'},
        ]}
      />
      <View style={styles.scaleMarker} />
      <View style={[styles.scaleMarker, {left: calculateLeft(25)}]} />
      <View style={[styles.scaleMarker, {left: calculateLeft(50)}]} />
      <View style={[styles.scaleMarker, {left: calculateLeft(75)}]} />
      <View style={[styles.scaleMarker, {left: calculateLeft(100)}]} />
      <View style={[styles.scaleMarker, {left: calculateLeft(110)}]} />
      <ScaleText val={0} />
      <ScaleText val={25} />
      <ScaleText val={50} />
      <ScaleText val={75} />
      <ScaleText val={100} />
      <ScaleText val={110} />
    </View>
  );
};
const DipSwitch = ({state}) => {
  return state ? (
    <Image
      source={require('../assets/images/switch_on.png')}
      style={styles.dipSwitchImage}
    />
  ) : (
    <Image
      source={require('../assets/images/switch_off.png')}
      style={styles.dipSwitchImage}
    />
  );
};
const DipSwitchInfo = ({text, align, close}) => {
  switch (align) {
    case 'start':
      align = {left: 30};
      break;
    case 'center':
      align = {alignSelf: 'center'};
      break;
    case 'end':
      align = {right: 30};
      break;
  }
  return (
    <View style={styles.infoContainer}>
      <View style={[styles.flexRow]}>
        <CustomText
          text={text}
          size={12}
          style={styles.infoText}
          align="left"
        />
        <TouchableOpacity
          style={[styles.close]}
          onPress={() => {
            console.log('close');
            close(-1);
          }}>
          <BoschIcon name={Icons.close} size={25} style={{height: 25}} />
        </TouchableOpacity>
      </View>

      <View style={[styles.triangleCommon, styles.triangleGray, align]} />
      <View style={[styles.triangleCommon, styles.triangleWhite, align]} />
    </View>
  );
};
export default function InstallationLiveData({
  setBleConnected,
  navigation,
  setLiveBanner,
  setLiveFaultCode,
}) {
  const dispatch = useDispatch();
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const modelNumber = selectedUnit.odu.modelNumber;
  const runningModesList = [0, 2, 3];
  const j2List = [2, 3, 4, 5];
  const [showInfo, setShowInfo] = useState(-1);
  const [compressorLoad, setCompressorLoad] = useState(0);
  const [limitedCondition, setLimitedCondition] = useState('');
  const [outdoorTempRangeCheck, setOutdoorTempRangeCheck] = useState(
    Colors.mediumGray,
  );
  const bleConnectedToDevice = useSelector(
    state => state.contractor.deviceConnectedToBle,
  );
  const connectedDeviceData = useSelector(
    state => state.contractor.deviceDetails,
  );
  const demoMode = useSelector(state => state.notification.demoStatus);

  UserAnalytics('ids_live_data');

  const outdoorTempError = {
    iconName: Icons.alertError,
    iconColor: Colors.darkRed,
    background: Colors.lightRed,
  };
  const limitedConditionBanner = {
    iconName: Icons.alertWarning,
    iconColor: Colors.darkYellow,
    background: Colors.lightYellow,
    tooltipText: Dictionary.limitedCondition.tooltipText,
  };
  /** For the BLE Communication */
  const [bleData, setBleData] = useState({
    runningMode: 0, //can be 0, 2, 3 //Modbus 30002
    forceMode: 0,
    defrostMode: 0,
    oilReturnMode: 0,
    yCall: 0, //can be 0 or 1 //Modbus 10011
    bCall: 0, //can be 0 or 1 //Modbus 10012
    wCall: 0, //can be 0 or 1 //Modbus 10013
    j2: 3, //J2 can be 2/3/4/5 //Modbus 30027
    'sw4-1': 0, //Modbus 10002
    'sw4-2': 0, //Modbus 10003
    'sw4-3': 0, //Modbus 10004
    'sw4-4': 0, //Modbus 10005
    'sw5-1': 0, //Modbus 10006
    'sw5-2': 0, //Modbus 10007
    compressorFreq: 0, //Modbus 30003
    outdoorTemp: 0, //Modbus 30005);
    condenserCoilTemp: 255, //Modbus 30018
    highCompressorDischargeTemp: 255, //Modbus 30020
    controlBoardOverheated: 255, //Modbus 30021
    compOverCurrentProtection: 255, //Modbus 30022
    lowVoltage: 255, //Modbus 30023
  });
  const intervalRef = useRef(null);
  const bleRef = useRef(null);
  const deviceRef = useRef(null);
  const [showLoader, setShowLoader] = useState(false);
  const [stopScanConfirmation, setStopScanConfirmation] = useState(false);
  var scrollViewRef = useRef<ScrollView>();
  const [unitModeLabel, setUnitModelLabel] = useState('');
  const unitStatus = useSelector(state =>
    state.contractor.selectedUnit.systemStatus.toLowerCase(),
  );

  useEffect(() => {
    let limitedConditionParameters = [
      'lowVoltage',
      'compOverCurrentProtection',
      'controlBoardOverheated',
      'highCompressorDischargeTemp',
      'condenserCoilTemp',
    ];
    let limitedConditionDoesExist = [];
    limitedConditionParameters.forEach(item => {
      if (item === 'lowVoltage') {
        if (bleData[item] >= 50 && bleData[item] < 100) {
          limitedConditionDoesExist.push({
            key: item,
            value: bleData[item],
          });
        }
      } else {
        if (bleData[item] >= 0 && bleData[item] < 255) {
          limitedConditionDoesExist.push({
            key: item,
            value: bleData[item],
          });
        }
      }
    });
    let limitedConditionVal = limitedConditionDoesExist
      .sort((a, b) => (a.value > b.value ? 1 : -1))
      .filter(function (data) {
        return data.value === limitedConditionDoesExist[0].value;
      });
    let result =
      limitedConditionVal.length > 0
        ? Dictionary.limitedCondition[limitedConditionVal[0].key]
        : '';
    setLimitedCondition(result);
  }, [
    bleData.condenserCoilTemp,
    bleData.highCompressorDischargeTemp,
    bleData.controlBoardOverheated,
    bleData.compOverCurrentProtection,
    bleData.lowVoltage,
    bleData,
  ]);
  useEffect(() => {
    if (
      bleData.forceMode === 0 &&
      bleData.defrostMode === 0 &&
      bleData.oilReturnMode === 0
    ) {
      setUnitModelLabel(liveData.unitMode.noMode[bleData.runningMode]);
    } else {
      if (bleData.defrostMode === 1) {
        setUnitModelLabel(liveData.unitMode.defrostMode);
        return;
      }
      if (bleData.forceMode === 1) {
        setUnitModelLabel(liveData.unitMode.forceMode[bleData.runningMode]);
        return;
      }
      if (bleData.oilReturnMode === 1) {
        setUnitModelLabel(liveData.unitMode.oilReturnMode[bleData.runningMode]);
        return;
      }
    }
  }, [
    bleData.defrostMode,
    bleData.forceMode,
    bleData.oilReturnMode,
    bleData.runningMode,
  ]);

  useEffect(() => {
    const compressorLoadCalc = () => {
      if (bleData.runningMode === 0) {
        return 0;
      } else if (
        runningModesList.includes(bleData.runningMode) &&
        j2List.includes(bleData.j2)
      ) {
        if (model20G.includes(modelNumber)) {
          return (
            (bleData.compressorFreq /
              liveData.compressorLoadCalc.model20G[bleData.runningMode][
                bleData.j2
              ]) *
            100
          );
        }
        if (model18M.includes(modelNumber)) {
          return (
            (bleData.compressorFreq /
              liveData.compressorLoadCalc.model18M[bleData.runningMode][
                bleData.j2
              ]) *
            100
          );
        }
      }
    };
    setCompressorLoad(compressorLoadCalc());
  }, [
    bleData.compressorFreq,
    bleData.j2,
    bleData.runningMode,
    j2List,
    modelNumber,
    runningModesList,
  ]);

  useEffect(() => {
    const outdoorTempRangeCheckFunc = () => {
      if (demoMode) {
        bleData.outdoorTemp = 53;
      }
      if (bleData.runningMode === 0) {
        return Colors.mediumGray;
      } else if (runningModesList.includes(bleData.runningMode)) {
        if (model20G.includes(modelNumber)) {
          return bleData.outdoorTemp >=
            liveData.outdoorTempLimits.model20G[bleData.runningMode].LB &&
            bleData.outdoorTemp <=
              liveData.outdoorTempLimits.model20G[bleData.runningMode].UB
            ? Colors.darkGreen
            : Colors.darkRed;
        }
        if (model18M.includes(modelNumber)) {
          return bleData.outdoorTemp >=
            liveData.outdoorTempLimits.model18M[bleData.runningMode].LB &&
            bleData.outdoorTemp <=
              liveData.outdoorTempLimits.model18M[bleData.runningMode].UB
            ? Colors.darkGreen
            : Colors.darkRed;
        }
      }
    };
    setOutdoorTempRangeCheck(outdoorTempRangeCheckFunc());
  }, [bleData.outdoorTemp, bleData.runningMode, modelNumber, runningModesList]);

  /** On Page Load */
  useEffect(() => {
    connectBLE();
    !demoMode ? setShowLoader(true) : setShowLoader(false);
    /** Device need not be unpaired on unload */
    // return () => {
    //   // componentWillUnmount events
    //   if (deviceRef.current) {
    //     bleManager
    //       .isDeviceConnected(deviceRef.current)
    //       .then((value) => {
    //         if (value === true) {
    //           console.log('isDeviceConnected');
    //           bleManager
    //             .cancelDeviceConnection(deviceRef.current)
    //             .then((cancelled) => {
    //               dispatch(ContractorActions.setBleStatus(false));
    //               console.log(cancelled);
    //               console.log('cancelDeviceConnection');
    //             })
    //             .catch((error) => {
    //               console.log(error);
    //               //  showToast(error,'error');
    //             });
    //         }
    //       })
    //       .catch((error1) => {
    //         console.log(error1);
    //         showToast(error1, 'error');
    //       });
    //   }
    // };
  }, []);

  const connectBLE = () => {
    if (demoMode) {
      // scanAndConnect();
      //establishConnection();
      setShowLoader(false);
      console.log('BLE in demo mode');
    } else {
      const subscription = bleManager.onStateChange(async state => {
        if (state === 'PoweredOn') {
          console.log('PoweredOn!!!!!');
          /** Location needs to be enabled for BLE Scanning on Android 6.0 */
          if (Platform.OS === 'android') {
            const permission = await requestLocationPermission();
            if (!permission) {
              console.warn('location permission denied');
              showToast(
                Dictionary.bleCommunicator.locationPermissionDenied,
                'info',
              );
              return;
            } else {
              subscription.remove();
              try {
                scanAndConnect();
              } catch (err) {
                console.log(err);
              }
            }
          } else {
            subscription.remove();
            try {
              scanAndConnect();
            } catch (err) {
              console.log(err);
            }
          }
        } else if (state === 'PoweredOff') {
          if (Platform.OS === 'android') {
            /** requestToEnable is possible only for Android */
            try {
              BluetoothStateManager.requestToEnable()
                .then(result => {
                  console.log('Enable BLE');
                  // console.log(result);
                  if (result) {
                    console.log('user accepted to enable bluetooth');
                  } else {
                    console.log('user denied to enable bluetooth');
                  }
                })
                .catch(function (error) {
                  console.log(error);
                  showToast(
                    Dictionary.bleCommunicator.blePermissionDenied,
                    'error',
                  );
                  setBleStore(false);
                });
            } catch (e) {
              console.log('error' + e);
            }
          } else {
            /** For iOS, open the seetings so that the user can enable it */
            showToast(Dictionary.bleCommunicator.blePermissionDenied, 'info');
            Linking.openURL('App-Prefs:Bluetooth');
          }
        } else if (state === 'Unauthorized') {
          /** For iOS, open the seetings so that the user can enable it */
          showToast(Dictionary.bleCommunicator.blePermissionDenied, 'info');
          BluetoothStateManager.openSettings();
        }
      }, true);
    }
  };

  const setTimer = () => {
    intervalRef.current = setInterval(() => {
      console.log('setTimeout');
      setStopScanConfirmation(true);
    }, 15000);
  };
  const scanSuccessHandler = device => {
    //setShowLoader(false);
    bleManager.stopDeviceScan();
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    deviceRef.current = device.id;
  };

  // In-order to disconnect Bluetooth instances and redux stores
  // Invoked while getting error or on disconnect click
  const setBleStore = status => {
    if (!status) {
      dispatch(ContractorActions.setBleStatus(status));
      setBleConnected(status);
      setLiveFaultCode('');
      setLiveBanner('');
      dispatch(updateDeviceAlreadyConnected(null));
    }
  };

  const disconnectBLE = () => {
    console.log('Disconnect clicked');
    if (demoMode) {
      setBleStore(false);
    } else {
      if (connectedDeviceData && connectedDeviceData.id) {
        bleManager
          .isDeviceConnected(connectedDeviceData.id)
          .then(value => {
            if (value === true) {
              bleManager
                .cancelDeviceConnection(connectedDeviceData.id)
                .then(cancelled => {
                  setBleStore(false);
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error1 => {
            console.log(error1);
            showToast(error1, 'error');
          });
      }
    }
  };
  const deviceDisconnectionHandler = device => {
    /** Show Toast on Device disconnect */
    bleManager.onDeviceDisconnected(
      device.id,
      (connectionError, connectionData) => {
        if (connectionError) {
          showToast(connectionError, 'error');
          console.log(connectionError);
        }
        console.log('Device is disconnected');
        setBleStore(false);
      },
    );
  };

  const setNewBleData = obj => {
    const tempList = {...obj};
    setBleData(tempList);
  };

  const monitorCharacteristicForService = async device => {
    device.monitorCharacteristicForService(
      Enum.bleConnectionInfo.customServiceUUID,
      Enum.bleConnectionInfo.readCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          setShowLoader(false);
          console.log('Error in monitorCharacteristicForService');
          console.log('Error reason', error.reason);
          if (error.reason && error.reason.toLowerCase().includes('22')) {
            showToast(Dictionary.bleCommunicator.pairingError, 'error');
          }
          if (error.errorCode === 403 && error.reason) {
            if (error.reason.toLowerCase().includes('authentication')) {
              showToast(Dictionary.bleCommunicator.pairingError, 'error');
            } else if (error.reason.toLowerCase().includes('encryption')) {
              showToast(Dictionary.bleCommunicator.incorrectPin, 'error');
            } else if (
              error.message &&
              error.message
                .toLowerCase()
                .includes('notify change failed for device')
            ) {
              showToast(
                Dictionary.bleCommunicator.connectionFailedRestartApp,
                'error',
              );
            } else {
              console.log('BLE disconnected ', error.reason);
              crashlytics().log('BLE disconnected ' + error);
            }
          } else if (error.errorCode && error.errorCode === 600) {
            crashlytics().log('error.errorCode - 600 ' + error);
            showToast(Dictionary.bleCommunicator.updateSystemPackage, 'error');
          } else if (error.errorCode && error.errorCode === 205) {
            console.log('error.errorCode - 205 ', error.errorCode);
            crashlytics().log('error.errorCode - 205 ' + error);
            showToast(Dictionary.bleCommunicator.pairingError, 'error');
          } else if (error.errorCode && error.errorCode === 201) {
            console.log('error.errorCode - 201 ', error.errorCode);
            crashlytics().log('error.errorCode - 201 ' + error);
          } else {
            console.log('BLE disconnected ', error);
            crashlytics().log('BLE disconnected ' + error);
          }
          setBleStore(false);
          return;
        }
        setShowLoader(false);
        //  console.log(characteristic.value);
        let newObj = {};
        newObj = bleDataMapper(characteristic.value);
        if (newObj) {
          /** update the values to the redux store */
          dispatch(ContractorActions.setGatewayLiveData(newObj));
          let liveDataObject = {};
          for (let key in newObj) {
            if (key === '30036') {
              if (newObj[key] !== '' && unitStatus !== 'normal') {
                setLiveFaultCode(/*selectedUnit.faultCode*/ newObj[key]);
                setLiveBanner('alert');
                dispatch(
                  ContractorActions.faultStatusOnNormalUnits(
                    //selectedUnit.faultCode,
                    newObj[key],
                  ),
                );
              } else if (newObj['30036']) {
                setLiveFaultCode(newObj['30036']);
                setLiveBanner('alert');
                dispatch(
                  ContractorActions.faultStatusOnNormalUnits(newObj['30036']),
                );
              } else if (newObj['30036'] === '') {
                setLiveFaultCode('');
                setLiveBanner('');
                dispatch(ContractorActions.faultStatusOnNormalUnits(''));
              }
            }
            let newKey = Enum.bleVarMapping[key];
            if (newKey) {
              liveDataObject[newKey] = newObj[key];
            }
          }
          let bleDataObj = Object.assign(bleData, liveDataObject);
          setNewBleData(bleDataObj);
          dispatch(updateDeviceAlreadyConnected(device));
          dispatch(ContractorActions.setBleStatus(true));
        }
      },
    );
  };

  const connectDevice = async device => {
    return device.discoverAllServicesAndCharacteristics();
  };

  const writeCharacteristic = async device => {
    let randomNumber = getRandomString(4);
    /** input a random number to “f76aa911-6535-4020-9b1f-395ab4e9a678” within 10s */
    return device.writeCharacteristicWithResponseForService(
      Enum.bleConnectionInfo.customServiceUUID,
      Enum.bleConnectionInfo.randomNumberCharacteristicUUID,
      randomNumber,
    );
  };
  const handleError = error => {
    console.warn(error);
    if (error.reason) {
      if (
        error.reason.toLowerCase().includes('peer') ||
        error.iosErrorCode === 14
      ) {
        showToast(Dictionary.bleCommunicator.peerRemovedPairingError, 'error');
      } else {
        showToast(error.reason, 'error');
      }
    } else if (error.message) {
      showToast(error.message, 'error');
    } else {
      console.log('BLE disconnected ', error);
      crashlytics().log('BLE disconnected ' + error);
    }
    setBleStore(false);
  };

  const requestBLEPermissions = async () => {
    if (Platform.OS === 'android') {
      const res1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (Number(DeviceInfo.getSystemVersion()) > 12) {
        const res2 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const res3 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        );
        const res4 = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        if (res2 === 'granted' && res3 === 'granted' && res4 === 'granted') {
          establishConnection();
          return;
        }
      }

      //if (res2 === 'granted' && res3 === 'granted' && res4 === 'granted') {
      establishConnection();
      //}
    } else {
      establishConnection();
    }
  };

  const establishConnection = () => {
    bleManager.startDeviceScan(null, null, async (error, device) => {
      bleRef.current = bleManager;
      if (error) {
        if (error.errorCode && error.errorCode === 600) {
          abortBleScan();
          crashlytics().log('BLE permissions not enabled');
          showToast(Dictionary.bleCommunicator.enableBlePermissions, 'error');
        } else if (error.reason) {
          showToast(error.reason, 'error');
        } else if (error.message) {
          showToast(error.message, 'error');
        } else {
          console.log('BLE disconnected ', error);
          crashlytics().log('BLE disconnected ' + error);
        }
        console.log('Handle error - scanning will be stopped automatically');
        return;
      }
      console.log('Devices');
      // Check if it is a device you are looking for based on device name
      if (device.name === selectedUnit.gateway.bluetoothId) {
        // Stop scanning as we have found the device.
        scanSuccessHandler(device);
        // Establish Device connection.
        device
          .connect()
          .then(async deviceData => {
            deviceDisconnectionHandler(deviceData);
            /** Discover All Services and Characteristics */
            await connectDevice(device)
              .then(async services => {
                console.log('services');
                await bleManager
                  .isDeviceConnected(device.id)
                  .then(async value => {
                    if (value === true) {
                      await writeCharacteristic(device)
                        .then(async characteristics => {
                          setTimeout(() => {
                            console.log('characteristics');
                            dispatch(ContractorActions.setBleStatus(true));
                            monitorCharacteristicForService(device)
                              .then(() => {
                                console.log('monitorCharacteristicForService');
                              })
                              .catch(error1 => {
                                handleError(error1);
                              });
                          }, 1000);
                        })
                        .catch(error2 => {
                          handleError(error2);
                        });
                    }
                  })
                  .catch(error3 => {
                    handleError(error3);
                  });
              })
              .catch(error4 => {
                handleError(error4);
              });
          })
          .catch(error5 => {
            handleError(error5);
          });
      }
    });
  };

  const scanAndConnect = () => {
    try {
      if (bleConnectedToDevice) {
        monitorCharacteristicForService(connectedDeviceData)
          .then(() => {
            console.log('monitorCharacteristicForService');
          })
          .catch(error1 => {
            handleError(error1);
          });
      } else {
        /** Timer to abort after 15s if device is not discoverable */
        setTimer();
        requestBLEPermissions();
      }
    } catch (exception) {
      handleError(exception);
    }
  };

  const abortBleScan = () => {
    setStopScanConfirmation(false);
    if (bleRef && bleRef.current) {
      bleRef.current.stopDeviceScan();
    }
    if (intervalRef && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setBleStore(false);
    setShowLoader(false);
  };

  return (
    <ScrollView
      // nestedScrollEnabled={true}
      contentContainerStyle={styles.container}
      ref={scrollViewRef}
      // onContentSizeChange={() => {
      //   if (showInfo !== -1) {
      //     scrollViewRef?.current?.scrollToEnd({animated: true});
      //   }
      // }}
    >
      <SectionHeading
        title={Dictionary.installationDashboard.thermostatCall}
        info={Dictionary.installationDashboard.thermostatCallInfo}
        tooltipPosition="bottom"
      />
      <View style={[styles.sectionContainer, styles.pad20]}>
        <CustomText
          text={Dictionary.installationDashboard.unitMode + unitModeLabel}
          align="left"
          newline={true}
        />
        <View style={[styles.flexRowCenter, styles.spaceEvenly]}>
          <ThermostatCall
            selected={bleData.yCall}
            name={Dictionary.installationDashboard.yCall}
          />
          <ThermostatCall
            selected={bleData.bCall}
            name={Dictionary.installationDashboard.bCall}
          />
        </View>
      </View>
      <SectionHeading
        title={Dictionary.installationDashboard.compressorLoad}
        info={Dictionary.installationDashboard.compressorLoadInfo}
        tooltipPosition="top"
      />
      <View style={[styles.sectionContainer, styles.pad20]}>
        <CompressorLoadSlider
          compressorLoad={compressorLoad}
          compressorFreq={bleData.compressorFreq.toString()}
        />
      </View>
      <View style={[styles.sectionContainer, styles.padVertical10]}>
        {limitedCondition !== '' && (
          <Banner
            data={{
              ...limitedConditionBanner,
              text: limitedCondition,
            }}
          />
        )}
      </View>
      <SectionHeading
        title={Dictionary.installationDashboard.outdoorTemp}
        {...(model20G.includes(modelNumber)
          ? {info: Dictionary.installationDashboard.outdoorTempInfo20G}
          : model18M.includes(modelNumber)
          ? {info: Dictionary.installationDashboard.outdoorTempInfo18M}
          : {})}
        tooltipPosition="top"
      />
      <View style={[styles.sectionContainer, styles.padVertical10]}>
        <View style={[styles.flexRowCenter, styles.padVertical10]}>
          <BoschIcon
            name={Icons.temperature}
            size={50}
            color={outdoorTempRangeCheck}
            accessibilityLabel={'outdoor Temperature Range Check'}
            style={{height: 50}}
          />
          <CustomText text={bleData.outdoorTemp + ' °F'} />
        </View>
        {outdoorTempRangeCheck === Colors.darkRed && (
          <Banner
            data={{
              ...outdoorTempError,
              text:
                bleData.outdoorTemp +
                ' °F' +
                Dictionary.installationDashboard.outdoorTempError,
            }}
          />
        )}
      </View>

      <SectionHeading title={Dictionary.installationDashboard.dipSwitches} />
      <View style={styles.sectionContainer}>
        <View style={[styles.flexRow, styles.dipswitchInfo]}>
          <BoschIcon
            name={Icons.infoTooltip}
            size={24}
            style={[styles.padRight5, {height: 24}]}
          />
          <CustomText
            align="left"
            size={12}
            text={Dictionary.installationDashboard.dipSwitchesInfo}
          />
        </View>
        <View style={[styles.flexRowCenter, styles.spaceEvenly, styles.pad20]}>
          <TouchableOpacity
            onPress={() => {
              showInfo === 0 ? setShowInfo(-1) : setShowInfo(0);
            }}
            style={styles.switchContainer}>
            <CustomText text={Dictionary.installationDashboard.sw4} />
            <View style={styles.flexRow}>
              <DipSwitch state={bleData['sw4-1']} />
              <DipSwitch state={bleData['sw4-2']} />
              <DipSwitch state={bleData['sw4-3']} />
              <DipSwitch state={bleData['sw4-4']} />
              <CustomText text="*" style={styles.alignEnd} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => {
              showInfo === 1 ? setShowInfo(-1) : setShowInfo(1);
            }}>
            <CustomText text={Dictionary.installationDashboard.sw5} />
            <View style={styles.flexRow}>
              <DipSwitch state={bleData['sw5-1']} />
              <DipSwitch state={bleData['sw5-2']} />
              <CustomText text="*" style={styles.alignEnd} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchContainer}
            onPress={() => {
              showInfo === 2 ? setShowInfo(-1) : setShowInfo(2);
            }}>
            <CustomText text={Dictionary.installationDashboard.j2} />
            <View style={styles.flexRow}>
              <DipSwitch state={bleData.j2 === 3 || bleData.j2 === 5 ? 1 : 0} />
              <CustomText text="*" style={styles.alignStart} />
              <View style={styles.switchStateLabel}>
                <CustomText text={Dictionary.button.on} size={10} />
                <CustomText text={Dictionary.button.off} size={10} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {showInfo === 0 && (
        <DipSwitchInfo
          align="start"
          text={Dictionary.installationDashboard.sw4Info}
          close={setShowInfo}
        />
      )}
      {showInfo === 1 && (
        <DipSwitchInfo
          align="center"
          text={Dictionary.installationDashboard.sw5Info}
          close={setShowInfo}
        />
      )}
      {showInfo === 2 && (
        <DipSwitchInfo
          align="end"
          text={Dictionary.installationDashboard.j2Info}
          close={setShowInfo}
        />
      )}
      <SectionHeading title={Dictionary.installationDashboard.advancedInfo} />
      <View
        style={[
          styles.sectionContainer,
          styles.pad20,
          styles.liveCheckpoint,
          styles.flexRow,
          styles.flex1,
        ]}>
        <View style={[styles.flex48, styles.borderRight]}>
          <Link
            text={Dictionary.installationDashboard.liveCheckpoint}
            type="arrow"
            onPress={() => {
              dispatch(ContractorActions.checkCheckpointValue(0));
              navigation.navigate('LiveCheckpointValues');
            }}
          />
        </View>
        <View style={styles.flex04}>{/* <Text>{''}</Text> */}</View>
        <View style={styles.flex48}>
          <Link
            text={Dictionary.installationDashboard.history}
            type="arrow"
            onPress={() => {
              dispatch(ContractorActions.checkCheckpointValue(2));
              navigation.navigate('LiveCheckpointValues');
            }}
          />
        </View>
      </View>
      <Button
        type="primary"
        onPress={() => disconnectBLE()}
        text={'Disconnect'}
        style={styles.disconnect}
      />
      {showLoader && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.darkBlue} />
        </View>
      )}
      <ConfirmationDialog
        visible={stopScanConfirmation}
        text={Dictionary.bleCommunicator.discoveryFailed}
        primaryButton={Dictionary.button.ok}
        primaryButtonOnPress={abortBleScan}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGray,
    flexGrow: 1,
  },
  unselected: {
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    width: 20,
    marginRight: 5,
  },
  selected: {
    borderRadius: 7,
    left: 2,
    top: 2,
    height: 14,
    width: 14,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    width: '100%',
  },
  pad20: {
    padding: 20,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  triangleBlack: {
    backgroundColor: Colors.transparent,
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    right: -5,
    bottom: 10,
    alignSelf: 'flex-end',
  },
  switchContainer: {
    backgroundColor: Colors.lightBlue,
    padding: 5,
  },
  flexRow: {
    flexDirection: 'row',
  },
  switchStateLabel: {
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    paddingLeft: 10,
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  alignStart: {
    alignSelf: 'flex-start',
  },
  dipSwitchImage: {
    width: 20,
    height: 50,
    margin: 3,
  },
  infoContainer: {
    borderColor: Colors.mediumGray,
    borderWidth: 1,
    backgroundColor: Colors.white,
    width: '90%',
    alignSelf: 'center',
    flex: 1,
    padding: 5,
  },
  infoText: {
    paddingLeft: 10,
    paddingVertical: 10,
    paddingRight: 5,
  },
  triangleCommon: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderLeftWidth: 10,
    borderLeftColor: Colors.transparent,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderRightColor: Colors.transparent,
  },
  triangleGray: {
    top: -10,
    borderBottomColor: Colors.mediumGray,
  },
  triangleWhite: {
    top: -8.5,
    borderBottomColor: Colors.white,
  },
  close: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  errorContainer: {
    backgroundColor: Colors.lightRed,
    marginTop: 10,
  },
  padLeft10: {
    paddingLeft: 10,
  },
  scaleText: {
    position: 'absolute',
    top: 20,
  },
  scaleMarker: {
    position: 'absolute',
    top: 10,
    borderLeftWidth: 1,
    height: 8,
  },
  sliderVal: {
    position: 'absolute',
    bottom: 25,
  },
  sliderBlue: {
    backgroundColor: Colors.darkBlue,
    height: 10,
    position: 'absolute',
  },
  sliderGray: {
    backgroundColor: Colors.lightGray,
    height: 10,
    marginVertical: 30,
    alignSelf: 'center',
  },
  padVertical10: {
    paddingVertical: 10,
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
  liveCheckpoint: {
    paddingBottom: 30,
  },
  paddingBottom10: {
    paddingBottom: 10,
  },
  dipswitchInfo: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  padRight5: {
    paddingRight: 5,
  },
  disconnect: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.mediumGray,
  },
  flex48: {
    flex: 0.48,
  },
  flex04: {
    flex: 0.04,
  },
  flex1: {
    flex: 1,
  },
});
