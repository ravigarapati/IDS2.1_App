import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Platform,
  Linking,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {showToast} from '../components/CustomToast';
import {useSelector, useDispatch} from 'react-redux';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';
import {chargeUnitRange} from '../utils/enum';
import crashlytics from '@react-native-firebase/crashlytics';
import * as ContractorActions from '../store/actions/ContractorActions';
import {updateDeviceAlreadyConnected} from '../store/actions/ContractorActions';
import {BleManager} from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {
  requestLocationPermission,
  getRandomString,
  bleDataMapper,
} from '../utils/BleCommunicator';
import {Colors} from '../styles';
import {
  Banner,
  Button,
  ConfirmationDialog,
  CustomText,
  InfoTooltip,
} from '../components';
import {Icons} from '../utils/icons';
const bleManager = new BleManager();

export default function InstallationSubcoolSuperheat({
  setBleConnected,
  setLiveBanner,
  setLiveFaultCode,
  navigation,
}) {
  const [showLoader, setShowLoader] = useState(false);
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const modelNumber = selectedUnit.odu.modelNumber;
  const dispatch = useDispatch();
  const unitStatus = useSelector(state =>
    state.contractor.selectedUnit.systemStatus.toLowerCase(),
  );
  const connectedDeviceData = useSelector(
    state => state.contractor.deviceDetails,
  );
  const gatewayId = useSelector(
    state => state.contractor.selectedUnit.gateway.gatewayId,
  );
  const [stopScanConfirmation, setStopScanConfirmation] = useState(false);
  const [validatorInput, setValidatorInput] = useState(null);
  const [subcoolInput, setSubcoolInput] = useState('');
  const [superheatInput, setSuperheatInput] = useState('');
  const enterValue = Dictionary.installationDashboard.enterValue;
  const bleRef = useRef(null);
  const intervalRef = useRef(null);
  const deviceRef = useRef(null);
  var scrollViewRef = useRef<ScrollView>();
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
    subCool: 0, //Modbus 30034
    superHeat: 0, //Modbus 30035
  });

  const bleConnectedToDevice = useSelector(
    state => state.contractor.deviceConnectedToBle,
  );

  useEffect(() => {
    connectBLE();
    setShowLoader(true);
  }, []);

  const setBleStore = status => {
    if (!status) {
      dispatch(ContractorActions.setBleStatus(status));
      setBleConnected(status);
      setLiveFaultCode('');
      setLiveBanner('');
      dispatch(updateDeviceAlreadyConnected(null));
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

  const scanSuccessHandler = device => {
    //setShowLoader(false);
    bleManager.stopDeviceScan();
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    deviceRef.current = device.id;
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
      crashlytics().log('BLE disconnected ' + error);
    }
    setBleStore(false);
  };

  const setNewBleData = obj => {
    const tempList = {...obj};
    setBleData(tempList);
  };

  const deviceDisconnectionHandler = device => {
    /** Show Toast on Device disconnect */
    bleManager.onDeviceDisconnected(
      device.id,
      (connectionError, connectionData) => {
        if (connectionError) {
          showToast(connectionError, 'error');
        }
        setBleStore(false);
      },
    );
  };

  const monitorCharacteristicForService = async device => {
    device.monitorCharacteristicForService(
      Enum.bleConnectionInfo.customServiceUUID,
      Enum.bleConnectionInfo.readCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          setShowLoader(false);
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
              crashlytics().log('BLE disconnected ' + error);
            }
          } else if (error.errorCode && error.errorCode === 600) {
            crashlytics().log('error.errorCode - 600 ' + error);
            showToast(Dictionary.bleCommunicator.updateSystemPackage, 'error');
          } else if (error.errorCode && error.errorCode === 205) {
            crashlytics().log('error.errorCode - 205 ' + error);
            showToast(Dictionary.bleCommunicator.pairingError, 'error');
          } else if (error.errorCode && error.errorCode === 201) {
            crashlytics().log('error.errorCode - 201 ' + error);
          } else {
            crashlytics().log('BLE disconnected ' + error);
          }
          setBleStore(false);
          return;
        }
        setShowLoader(false);
        let newObj = {};
        newObj = bleDataMapper(characteristic.value);
        if (newObj) {
          /** update the values to the redux store */
          dispatch(ContractorActions.setGatewayLiveData(newObj));
          let liveDataObject = {};
          for (let key in newObj) {
            if (key === '30036') {
              if (selectedUnit.faultCode && unitStatus !== 'normal') {
                setLiveFaultCode(selectedUnit.faultCode);
                setLiveBanner('alert');
                dispatch(
                  ContractorActions.faultStatusOnNormalUnits(
                    selectedUnit.faultCode,
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

          // __________________________ Validations _____________________________

          const range = chargeUnitRange;
          const banner = {
            success: {
              iconName: Icons.checkmarkFrame,
              iconColor: Colors.darkGreen,
              background: Colors.lightGreen,
            },
            alert: {
              iconName: Icons.alertError,
              iconColor: Colors.darkRed,
              background: Colors.lightRed,
            },
          };

          function checkSuperheatRange(LB, UB, superheatVal) {
            if (
              superheatVal >= range[bleDataObj.j2].SH[LB] &&
              superheatVal <= range[bleDataObj.j2].SH[UB]
            ) {
              return {
                superheat: true,
                message: Dictionary.installationDashboard.chargedCorrectly,
              };
            } else if (superheatVal > range[bleDataObj.j2].SH[UB]) {
              return {
                superheat: false,
                message: Dictionary.installationDashboard.superheatHigh,
              };
            } else if (superheatVal < range[bleDataObj.j2].SH[LB]) {
              return {
                superheat: false,
                message: Dictionary.installationDashboard.superheatLow,
              };
            }
          }
          function checkSubcoolRange(LB, UB, subcoolVal, superheatVal) {
            let subcoolCheck = {};
            let superheatCheck = {};
            if (
              subcoolVal >= range[bleDataObj.j2].SC[LB] &&
              subcoolVal <= range[bleDataObj.j2].SC[UB]
            ) {
              subcoolCheck = {
                subcool: true,
                message: Dictionary.installationDashboard.chargedCorrectly,
              };
              superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
            } else if (subcoolVal < range[bleDataObj.j2].SC[LB]) {
              subcoolCheck = {
                subcool: false,
                message: Dictionary.installationDashboard.subcoolLow,
              };
              superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
            } else if (subcoolVal > range[bleDataObj.j2].SC[UB]) {
              subcoolCheck = {
                subcool: false,
                message: Dictionary.installationDashboard.subcoolHigh,
              };
              superheatCheck = checkSuperheatRange(LB, UB, superheatVal);
            }
            return {subcoolCheck, superheatCheck};
          }
          function rangeCheck(subcool, superheat) {
            const subcoolVal = subcool;
            const superheatVal = superheat;
            var check1 = null;
            var check2 = null;
            check1 = checkSubcoolRange('LB', 'UB', subcoolVal, superheatVal);
            check2 = checkSubcoolRange('LB2', 'UB2', subcoolVal, superheatVal);
            if (
              (check1.subcoolCheck.subcool &&
                check1.superheatCheck.superheat) ||
              (check2.subcoolCheck.subcool && check2.superheatCheck.superheat)
            ) {
              return {
                subcool: true,
                superheat: true,
                banner: {
                  ...banner.success,
                  text: Dictionary.installationDashboard.chargedCorrectly,
                },
              };
            } else if (
              (check1.subcoolCheck.subcool &&
                !check1.superheatCheck.superheat) ||
              (check2.subcoolCheck.subcool && !check2.superheatCheck.superheat)
            ) {
              return {
                subcool: true,
                superheat: false,
                banner: {
                  ...banner.alert,
                  text: !check1.superheatCheck.superheat
                    ? check1.superheatCheck.message
                    : check2.superheatCheck.message,
                },
              };
            } else if (
              !check1.subcoolCheck.subcool ||
              !check2.subcoolCheck.subcool
            ) {
              return {
                subcool: false,
                superheat:
                  check1.superheatCheck.superheat ||
                  check2.superheatCheck.superheat,
                banner: {
                  ...banner.alert,
                  text: !check1.subcoolCheck.subcool
                    ? check1.subcoolCheck.message
                    : check2.subcoolCheck.message,
                },
              };
            }
          }
          setValidatorInput(
            rangeCheck(bleDataObj.subCool, bleDataObj.superHeat),
          );
          // __________________________ End Validations _________________________

          dispatch(updateDeviceAlreadyConnected(device));
          dispatch(ContractorActions.setBleStatus(true));
        }
      },
    );
  };

  const setTimer = () => {
    intervalRef.current = setInterval(() => {
      setStopScanConfirmation(true);
    }, 15000);
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

  const connectDevice = async device => {
    return device.discoverAllServicesAndCharacteristics();
  };

  const scanAndConnect = () => {
    try {
      if (bleConnectedToDevice) {
        monitorCharacteristicForService(connectedDeviceData)
          .then(() => {})
          .catch(error1 => {
            handleError(error1);
          });
      } else {
        /** Timer to abort after 15s if device is not discoverable */
        setTimer();
        bleManager.startDeviceScan(null, null, async (error, device) => {
          bleRef.current = bleManager;
          if (error) {
            if (error.errorCode && error.errorCode === 600) {
              abortBleScan();
              crashlytics().log('BLE permissions not enabled');
              showToast(
                Dictionary.bleCommunicator.enableBlePermissions,
                'error',
              );
            } else if (error.reason) {
              showToast(error.reason, 'error');
            } else if (error.message) {
              showToast(error.message, 'error');
            } else {
              crashlytics().log('BLE disconnected ' + error);
            }
            return;
          }
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
                    await bleManager
                      .isDeviceConnected(device.id)
                      .then(async value => {
                        if (value === true) {
                          await writeCharacteristic(device)
                            .then(async characteristics => {
                              setTimeout(() => {
                                dispatch(ContractorActions.setBleStatus(true));
                                monitorCharacteristicForService(device)
                                  .then(() => {})
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
      }
    } catch (exception) {
      handleError(exception);
    }
  };

  const connectBLE = () => {
    const subscription = bleManager.onStateChange(async state => {
      if (state === 'PoweredOn') {
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
            await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
              interval: 10000,
              fastInterval: 5000,
            })
              .then(data => {
                subscription.remove();
                scanAndConnect();
              })
              .catch(errorMessage => {
                showToast(
                  Dictionary.bleCommunicator.blePermissionDenied,
                  'error',
                );
                setBleStore(false);
              });
          }
        } else {
          subscription.remove();
          try {
            scanAndConnect();
          } catch (err) {}
        }
      } else if (state === 'PoweredOff') {
        if (Platform.OS === 'android') {
          /** requestToEnable is possible only for Android */
          BluetoothStateManager.requestToEnable()
            .then(result => {
              if (result) {
              } else {
              }
            })
            .catch(function (error) {
              showToast(
                Dictionary.bleCommunicator.blePermissionDenied,
                'error',
              );
              setBleStore(false);
            });
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
  };

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollViewRef}>
      <View style={[styles.paddingHorizontal20]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 33,
          }}>
          <CustomText text={'System Capacity'} font={'bold'} />
          <View style={{borderBottomWidth: 1}}>
            <CustomText
              style={{paddingVertical: 5, paddingHorizontal: 20}}
              text={`${bleData.j2} ton`}
            />
          </View>
        </View>
        <View style={[styles.row, styles.grayContainer]}>
          <View style={styles.flex1}>
            <CustomText
              text={Dictionary.installationDashboard.subcool}
              size={14}
              font="bold"
              style={styles.paddingVertical10}
            />
            <View style={[styles.row, styles.paddingHorizontal20]}>
              {validatorInput && (
                <Image
                  source={
                    validatorInput.subcool
                      ? Icons.checkmarkFilledImage
                      : Icons.abortFilledImage
                  }
                />
              )}

              <TextInput
                placeholder={''}
                keyboardType="number-pad"
                value={bleData.subCool.toString()}
                onChangeText={(text: any) => {
                  //setSubcoolInput(text.replace(/[^0-9]/, ''));
                }}
                style={[
                  styles.textInput,
                  Platform.OS === 'ios' && styles.paddingVertical10,
                  validatorInput
                    ? validatorInput.subcool
                      ? styles.valid
                      : styles.invalid
                    : {},
                ]}
                maxLength={2}
              />
              <CustomText
                align="left"
                text={Dictionary.installationDashboard.tempUnit}
              />
            </View>
          </View>
          <View style={styles.flex1}>
            <CustomText
              text={Dictionary.installationDashboard.superheat}
              size={14}
              font="bold"
              style={styles.paddingVertical10}
            />
            <View style={[styles.row, styles.paddingHorizontal20]}>
              {validatorInput && (
                <Image
                  source={
                    validatorInput.superheat
                      ? Icons.checkmarkFilledImage
                      : Icons.abortFilledImage
                  }
                />
              )}
              <TextInput
                placeholder={''}
                keyboardType="number-pad"
                value={bleData.superHeat.toString()}
                onChangeText={(text: any) => {
                  //setSuperheatInput(text.replace(/[^0-9]/, ''));
                }}
                style={[
                  styles.textInput,
                  Platform.OS === 'ios' && styles.paddingVertical10,
                  validatorInput
                    ? validatorInput.superheat
                      ? styles.valid
                      : styles.invalid
                    : {},
                ]}
                maxLength={2}
              />
              <CustomText
                align="left"
                text={Dictionary.installationDashboard.tempUnit}
              />
            </View>
          </View>
          <View style={styles.tooltip}>
            <InfoTooltip positionVertical="top">
              <Image
                style={[styles.chargeUnitImage]}
                source={require('../assets/images/chargeunit_table.png')}
              />
            </InfoTooltip>
          </View>
        </View>
        {validatorInput && <Banner data={validatorInput.banner} />}
        <Button
          disabled={
            validatorInput &&
            validatorInput.banner.text !== 'System charged correctly'
          }
          style={{marginTop: 25}}
          text={'Save'}
          onPress={() => {
            if (validatorInput.banner.text === 'System charged correctly') {
              let date = new Date().getTime();
              let currentDate = new Date();
              dispatch(
                ContractorActions.setChargeUnitValue(
                  {
                    methodType: 'method1',
                    subcool:
                      bleData.subCool +
                      Dictionary.installationDashboard.tempUnit,
                    superheat:
                      bleData.superHeat +
                      Dictionary.installationDashboard.tempUnit,
                    lastSavedDate: date,
                    gatewayId: gatewayId,
                  },
                  () => {
                    showToast(Dictionary.common.saveSuccess, 'success');
                  },
                ),
              );
            }
          }}
        />
      </View>
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
  container: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 20,
    flexGrow: 1,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  pickerStyle: {
    marginBottom: 0,
    marginHorizontal: 20,
  },
  chargeUnitImage: {
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  grayContainer: {
    backgroundColor: Colors.white,
    padding: 15,
  },
  textInput: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    flex: 1,
    textAlign: 'center',
  },
  valid: {
    marginLeft: 10,
    borderBottomColor: Colors.darkGreen,
  },
  invalid: {
    marginLeft: 10,
    borderBottomColor: Colors.darkRed,
  },
  width60: {
    width: '60%',
  },
  width40: {
    width: '40%',
  },
  width77: {
    width: '77%',
  },
  width23: {
    width: '23%',
  },
  tooltip: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop20: {
    marginTop: 20,
  },
  marginBot20: {
    marginBottom: 20,
  },
  marginBot30: {
    marginBottom: 30,
  },
  pad15: {
    padding: 15,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  paddingHorizontal20: {
    paddingHorizontal: 20,
  },
  marginLeft20: {
    marginLeft: 20,
  },
  tabUnderline: {
    borderBottomColor: Colors.darkBlue,
    borderBottomWidth: 2,
  },
  tabView: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1,
    marginBottom: 20,
  },
  tabPadding: {
    paddingVertical: 10,
  },
  optionWrapper: {
    fontSize: 16,
    padding: 15,
    flex: 1,
    height: '100%',
    width: '100%',
  },
  deviceTypePlaceholder: {
    color: 'black',
    paddingVertical: 3,
    fontSize: 10,
  },
  fontSize12: {
    fontSize: 12,
  },
  dropdown: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontsize16: {
    fontSize: 16,
  },
  fontBlackColor: {
    color: 'black',
  },
  fontGrayColor: {
    color: 'rgba(223,223,223,1)',
  },
  arrowIcon: {
    height: 20,
    width: 20,
  },
  bluetoothIcon: {
    marginRight: 10,
    height: 26,
    width: 26,
  },
});
