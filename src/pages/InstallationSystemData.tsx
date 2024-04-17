import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Linking,
  Platform,
} from 'react-native';
import {CustomPicker, CustomText, Button, Banner, Link} from '../components';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {useSelector, useDispatch} from 'react-redux';
import InstallationLiveData from './InstallationLiveData';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {Enum} from '../utils/enum';
import {EnergyUsageGraph} from './EnergyUsageGraph';
import * as ContractorActions from '../store/actions/ContractorActions';
import {Icons} from '../utils/icons';
import {showToast} from '../components/CustomToast';
import {requestLocationPermission} from '../utils/BleCommunicator';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {BleManager} from 'react-native-ble-plx';
import moment, {months} from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import UserAnalytics from '../components/UserAnalytics';
import {Mock} from '../utils/Mock';

const bleManager = new BleManager();

const RemoteData = ({selectedUnit}) => {
  const demoMode = useSelector(state => state.notification.demoStatus);
  const energyUsage = useSelector(state => state.contractor.energyUsage);
  const [energyUsageMock, setEnergyUsageMock] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (!demoMode) {
      dispatch(
        ContractorActions.getUsageGraphByDeviceId(
          selectedUnit.gateway.gatewayId,
        ),
      );
    } else {
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      let newArray = [];
      for (var i = 0; i < 3; i++) {
        currentYear = --currentYear;
        let obj = {};
        let objMonths = {};
        for (var j = 0; j <= 11; j++) {
          var randomnum = (Math.random() * (50000 - 10000) + 10000).toFixed(10);
          objMonths[`${j}`] = parseFloat(randomnum);
        }
        obj.months = objMonths;
        obj.year = currentYear.toString();
        newArray.push(obj);
      }
      if (currentMonth != 0) {
        let objMonths = {};
        for (var i = currentMonth; i >= 1; i--) {
          var randomnum = (Math.random() * (50000 - 10000) + 10000).toFixed(10);
          currentMonth = --currentMonth;
          objMonths[`${currentMonth}`] = parseFloat(randomnum);
        }
        let obj = {
          months: objMonths,
          year: new Date().getFullYear().toString(),
        };
        newArray.push(obj);
      }

      newArray.sort((a, b) => a.year - b.year);
      setEnergyUsageMock({
        data: newArray,
        deviceId: '399A-175-000009-8733955691',
      });
    }
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomText
        text={Dictionary.systemData.homeownerUsageGraph}
        font="bold"
        newline={true}
      />
      <EnergyUsageGraph deviceData={demoMode ? energyUsageMock : energyUsage} />
    </ScrollView>
  );
};

export default function InstallationSystemData(props: any) {
  const [bleConnected, setBleConnected] = useState(false);
  const systemDataOptions = [
    {key: 1, label: Dictionary.systemData.viewOnsiteData},
    {key: 2, label: Dictionary.systemData.viewRemoteData},
  ];
  const [viewChosen, setViewChosen] = useState(systemDataOptions[0].label);
  const remoteAccessGranted = useSelector(
    state => state.contractor.selectedUnit.remoteAccessGranted,
  );
  const status = useSelector(state =>
    state.contractor.selectedUnit.systemStatus.toLowerCase(),
  );
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const [liveBanner, setLiveBanner] = useState('');
  const [liveFaultCode, setLiveFaultCode] = useState('');
  const bleConnectedToDevice = useSelector(
    state => state.contractor.deviceConnectedToBle,
  );
  const connectedDeviceData = useSelector(
    state => state.contractor.deviceDetails,
  );
  const [enableConnect, setEnableConnect] = useState(false);
  const [alert, setAlert] = useState(null);
  const fault = useSelector(state => state.contractor.faultStatusOnNormalUnit);
  const demoMode = useSelector(state => state.notification.demoStatus);
  const dispatch = useDispatch();

  UserAnalytics('ids_unit_dashboard');

  useEffect(() => {
    if (
      (selectedUnit.faultCode === '' ||
        selectedUnit.faultCode === null ||
        selectedUnit.faultCode === undefined) &&
      liveBanner === 'alert' &&
      (status === 'normal' || status === 'pending' || status === 'offline')
    ) {
      setAlert(status === 'normal' && fault !== '' ? true : false);
      let date = new Date().getTime();
      dispatch(
        ContractorActions.updateLiveFaultData({
          gatewayId: selectedUnit.gateway.gatewayId,
          dataReceivedOn: moment(date).format('YYMMDDHHMMSS'),
          faultData: liveFaultCode,
        }),
      );
    }
  }, [liveBanner]);

  useEffect(() => {
    let date = new Date().getTime();
    if (liveFaultCode !== '') {
      dispatch(
        ContractorActions.updateLiveFaultData({
          gatewayId: selectedUnit.gateway.gatewayId,
          dataReceivedOn: moment(date).format('YYMMDDHHMMSS'),
          faultData: liveFaultCode,
        }),
      );
    }
  }, [liveFaultCode]);

  useEffect(() => {
    if (bleConnectedToDevice) {
      if (connectedDeviceData.name === selectedUnit.gateway.bluetoothId) {
        setBleConnected(true);
      } else {
        setEnableConnect(true);
        showToast(
          Dictionary.bleCommunicator.connectedToAnotherGateway,
          'error',
        );
      }
    }
  }, []);

  const banner = {
    normal: {
      iconName: Icons.normalPin,
      iconColor: Colors.darkGreen,
      text: Dictionary.systemData.statusNormal,
      background: Colors.lightGreen,
    },
    offline: {
      iconName: Icons.offlinePin,
      iconColor: Colors.darkGray,
      text: Dictionary.systemData.statusOffline,
      tooltipText: remoteAccessGranted
        ? Dictionary.systemData.offlineAccessGranted
        : Dictionary.systemData.offlineAccessDenied,
      background: Colors.lightGray,
    },
    alert: {
      iconName: Icons.alertPin,
      iconColor: Colors.darkRed,
      text:
        Dictionary.systemData.statusAlert +
        (liveFaultCode !== ''
          ? liveFaultCode
          : fault !== ''
          ? fault
          : selectedUnit.faultCode),
      background: Colors.lightRed,
    },
    pending: {
      iconName: Icons.refreshPin,
      iconColor: Colors.darkYellow,
      text: Dictionary.systemData.statusDenied,
      tooltipText: Dictionary.systemData.actionReqiuredTooltip,
      background: Colors.lightYellow,
    },
  };

  const viewRemoteDataWarning = {
    iconName: Icons.alertWarning,
    iconColor: Colors.darkYellow,
    background: Colors.lightYellow,
  };

  const viewRemoteDataWarningText = {
    offline: {
      text: remoteAccessGranted
        ? Dictionary.systemData.remoteDataOffline
        : Dictionary.systemData.remoteDataAccessDenied,
    },
    pending: {
      text: Dictionary.systemData.noData,
    },
  };

  const openSettings = () => {
    Platform.OS === 'ios'
      ? Linking.openURL('App-Prefs:Bluetooth')
      : BluetoothStateManager.openSettings();
  };

  const connectBLE = () => {
    if (demoMode) {
      setBleConnected(true);
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
              setBleConnected(true);
            }
          } else {
            subscription.remove();
            try {
              setBleConnected(true);
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
                  setBleConnected(false);
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

  return (
    <ScrollView style={[styles.container]}>
      <Banner
        data={
          (status === 'normal' ||
            status === 'pending' ||
            status === 'offline') &&
          liveBanner !== ''
            ? banner[liveBanner]
            : status === 'normal' && fault !== ''
            ? banner.alert
            : banner[status]
        }
        {...(status === Enum.status.alert || liveBanner === Enum.status.alert
          ? {navigation: props.navigation}
          : {})}
      />
      <View style={[styles.flexRow, styles.viewChooser]}>
        {/** Icon and the dropdown to choose Onsite data and remote data */}
        {viewChosen === Dictionary.systemData.viewOnsiteData && (
          <Image
            source={
              bleConnected ? Icons.bluetoothImage : Icons.bluetoothOffImage
            }
            style={styles.bluetoothIcon}
          />
        )}
        <CustomPicker
          placeholder={Dictionary.createProfile.pleaseSelect + 'system data'}
          value={viewChosen}
          onChange={(text: any) => {
            console.log(text);
            if (text.label) {
              setViewChosen(text.label);
            }
          }}
          options={systemDataOptions}
          //iteratorKey="key"
          iteratorLabel="label"
          showFieldLabel={false}
          style={styles.viewPicker}
        />
      </View>
      {viewChosen === Dictionary.systemData.viewOnsiteData && (
        /** onsite data */
        <>
          {!bleConnected /** BLE not connected */ ? (
            <View style={[styles.container, styles.bleBlock]}>
              <CustomText
                size={21}
                font="bold"
                text={Dictionary.systemData.connectToBle}
                newline={true}
              />
              <Text style={styles.text}>
                {Dictionary.systemData.bleConnectionInfo1}
                <Link
                  text={Dictionary.systemData.settings}
                  onPress={() => openSettings()}
                />
              </Text>
              <CustomText
                text={Dictionary.systemData.bleConnectionInfo2}
                align="left"
                style={styles.marginHorizontal10}
                newline={true}
              />
              <View style={styles.pin}>
                <CustomText
                  text={Dictionary.bleCommunicator.blePin}
                  align="left"
                />
                <CustomText
                  font="bold"
                  text={selectedUnit.gateway.bluetoothPassword + '  '}
                  align="left"
                />
                <View style={styles.alignSelf}>
                  <Link
                    text={Dictionary.common.copy}
                    onPress={() => {
                      Clipboard.setString(
                        selectedUnit.gateway.bluetoothPassword,
                      );
                      showToast(Dictionary.common.copied, 'info');
                    }}
                  />
                </View>
              </View>

              <Image
                style={styles.image}
                source={require('../assets/images/powerUpODU.gif')}
              />
              <Button
                type="primary"
                onPress={() => connectBLE()}
                text={Dictionary.button.connect}
                disabled={enableConnect}
              />
            </View>
          ) : (
            /** BLE already connected */
            <InstallationLiveData
              setBleConnected={setBleConnected}
              navigation={props.navigation}
              setLiveBanner={setLiveBanner}
              setLiveFaultCode={setLiveFaultCode}
            />
          )}
        </>
      )}

      {viewChosen === Dictionary.systemData.viewRemoteData && (
        /** Remote data */
        <>
          {(status === Enum.status.normal || status === Enum.status.alert) && (
            <RemoteData selectedUnit={selectedUnit} />
          )}

          {(status === Enum.status.offline ||
            status === Enum.status.pending) && (
            <View style={styles.container}>
              <View
                style={[styles.flexRow, styles.alignCenter, styles.bleBlock]}>
                <Banner
                  data={{
                    ...viewRemoteDataWarning,
                    ...viewRemoteDataWarningText[status],
                    warningBanner: true,
                  }}
                />
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  padding5: {
    padding: 5,
  },
  padRight10: {
    paddingRight: 10,
  },
  marginHorizontal10: {
    marginHorizontal: 10,
  },
  image: {
    margin: 20,
    alignSelf: 'center',
  },
  padding20: {
    padding: 20,
  },
  bleBlock: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  alignSelf: {
    alignSelf: 'flex-end',
  },
  viewChooser: {
    alignSelf: 'center',
    alignItems: 'center',
    margin: 15,
  },
  viewPicker: {
    width: '80%',
  },
  padding10: {
    padding: 10,
  },
  text: {
    ...Typography.boschReg16,
    paddingLeft: 10,
  },
  bluetoothIcon: {
    marginRight: 10,
    height: 26,
    width: 26,
  },
  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});
