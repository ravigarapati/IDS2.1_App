import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  Image,
  AppState,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import ModalComponent from '../components/ModalComponent';
import {Dictionary} from '../utils/dictionary';
import {PERMISSIONS, request} from 'react-native-permissions';
import Clipboard from '@react-native-clipboard/clipboard';
import DeviceAddedWiFi from '../components/DeviceAddedWiFi';
import WIFI from './../assets/images/WifiBlue.svg';
import NetInfo from '@react-native-community/netinfo';
import {showToast} from '../components/CustomToast';
import {CustomText, Button, CustomInputText, BoschIcon} from '../components';
import {
  connectTCPAction,
  exitCom,
  calculateDevicePassword,
} from '../store/actions/HomeOwnerActions';
import CodeScanner from '../components/CodeScanner';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';

const ReconnectWiFi = ({navigation}) => {
  const [wifiInformation, setWifiInformation] = useState({
    ssid: '',
    password: '',
  });
  const [hotSpotInformation, setHotSpotInformation] = useState({
    ssid: '',
    password: '',
  });

  const FindQRTooltip = ({number, text, ADA}) => {
    return (
      <View
        style={{flexDirection: 'row', marginBottom: 6}}
        accessible={true}
        accessibilityLabel={`${number}. ${ADA}`}>
        <CustomText
          allowFontScaling={true}
          text={`${number}.`}
          style={{marginRight: 6}}
        />
        <CustomText allowFontScaling={true} align="left" text={text} />
      </View>
    );
  };
  const TIPS = [
    {
      header: 'Copy Password',
      description: 'Please copy the password.',
      icon: require('./../assets/images/copy.png'),
      sequence: 'First step:',
    },
    {
      header: 'Open Wi-Fi Settings & connect to BCC50_XXXX',
      description: 'Open settings, click Wi-Fi, and select the BCC50 device.',
      icon: require('./../assets/images/settings-engine.png'),
      sequence: 'Second step:',
    },
    {
      header: 'Paste Password',
      description: 'Use the copied password to connect.',
      icon: require('./../assets/images/paste.png'),
      sequence: 'Third step:',
    },
    {
      header: 'Return to the app',
      description: 'Return to the app once connected.',
      icon: require('./../assets/images/Return.png'),
      sequence: 'Fourth step:',
    },
  ];
  const TipsList = () => (
    <View
      accessible={true}
      style={{
        backgroundColor: '#D1E4FF',
        flexDirection: 'row',
        paddingTop: 19,
        paddingBottom: 11,
      }}>
      <View style={{width: '18%'}}>
        <Image
          style={{alignSelf: 'center'}}
          source={require('./../assets/images/light.png')}
        />
      </View>
      <View style={{width: '82%'}}>
        <CustomText
          allowFontScaling={true}
          style={{marginBottom: 5}}
          align={'left'}
          color={'#00629A'}
          text={'Tips:'}
        />
        {TIPS.map(t => (
          <TipSection
            key={t.header}
            header={t.header}
            sequence={t.sequence}
            description={t.description}
            icon={t.icon}
          />
        ))}
      </View>
    </View>
  );

  const TipSection = ({
    header,
    description,
    sequence,
    icon = null,
    style = undefined,
  }) => {
    return (
      <View style={style ? style : {flexDirection: 'row', marginBottom: 20}}>
        <View style={{flexDirection: 'row', width: '21%'}}>
          <View style={{marginRight: 11, marginTop: 10}}>
            <Image source={require('./../assets/images/tiparrow.png')} />
          </View>
          {icon && (
            <View style={{marginRight: 11, marginTop: 10}}>
              <Image source={icon} />
            </View>
          )}
        </View>

        <View style={{width: '79%'}}>
          <CustomText
            allowFontScaling={true}
            align={'left'}
            color={'#00629A'}
            text={header}
            font={'bold'}
            accessibilityLabelText={`${sequence}${header}.`}
          />
          <CustomText
            allowFontScaling={true}
            align={'left'}
            text={description}
            color={'#00629A'}
            accessibilityLabelText={`${description}.`}
          />
        </View>
      </View>
    );
  };
  const [manualEntry, setManualEntry] = useState({
    macId: '',
    tvc: '',
  });
  const cancelAction = () => {
    //navigation.navigate('BCCDashboard', {selectedDevice: selectedD});
    //exitCom();
    navigation.navigate('Home');
  };
  const setCancelShowScanner = () => {
    setStepCounter(0);
  };
  const setHotspotInfo = (field, value) => {
    setHotSpotInformation(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const hotspotName = useRef('');
  const hotspotPassword = useRef('');
  const ipState = useRef('');
  const setWifiInfo = (field, value) => {
    setWifiInformation(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  const [manualEntrySelected, setManualEntrySelected] = useState(false);
  const appState = useRef(AppState.currentState);
  const [alreadyRegisteredModal, setAlreadyRegisteredModal] = useState(false);
  const [scannedQR, setScannedQR] = useState('');
  const [findQrCore, setFindQrCode] = useState(false);
  const [stepCounter, setStepCounter] = useState(
    // navigation.getParam('device') === 'BCC50' ? 5 : 0,
    navigation.getParam('device') === 'BCC50' ? 3 : 0,
  );

  const grantCameraAccess = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then(res => {
      if (res === 'blocked' || res === 'denied') {
        Alert.alert(
          Dictionary.addDevice.addBcc.cameraNotAuthorized,
          Dictionary.addDevice.addBcc.changeSettings,
          [
            {
              text: Dictionary.button.close,
              onPress: () => setStepCounter(0),
              style: 'cancel',
            },
            {
              text: Dictionary.button.change,
              onPress: () => Linking.openSettings(),
              style: 'default',
            },
          ],
        );
      } else {
        setStepCounter(1);
        setManualEntrySelected(false);
      }
    });
  };

  const confirmStep = () => {
    setStepCounter(4);
  };

  const sendSSIDPassword = () => {
    connectTCPAction(
      wifiInformation.ssid,
      wifiInformation.password,
      scannedQR,
      confirmStep,
    );
    // setStepCounter(4);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const unsubscribe = NetInfo.addEventListener(state => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          if (
            true &&
            hotspotName.current !== '' &&
            hotspotPassword.current !== ''
          ) {
            setStepCounter(6);
          }
        } else {
          ipState.current = state.details.ipAddress;
        }
        appState.current = nextAppState;
      });
    });
    return () => {};
  }, []);

  return (
    <View>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <CustomText
              text={'Wi-Fi'}
              size={21}
              allowFontScaling={true}
              font="medium"
              style={{
                marginVertical: 8,
              }}
            />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {stepCounter === 0 && (
        <View
          testID="ViewOptionScanQr"
          style={{paddingHorizontal: 20, marginTop: 20}}>
          <View
            accessible={true}
            accessibilityLabel={`${Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility}. ${Dictionary.addDevice.addBcc.automaticEntry}. ${Dictionary.addDevice.addBcc.useScanBcc50Accessibility}`}>
            <View style={{alignItems: 'center'}}>
              <WIFI fill="#000" />
            </View>
            <CustomText
              allowFontScaling={true}
              style={{
                marginTop: 16,
              }}
              text={Dictionary.addDevice.addBcc.connectPhonebcc50WiFi}
              accessibilityLabelText={
                Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility
              }
            />
            <CustomText
              allowFontScaling={true}
              style={styles.marginTop32}
              text={Dictionary.addDevice.addBcc.automaticEntry}
              font={'bold'}
            />
            <CustomText
              allowFontScaling={true}
              style={styles.marginTop10}
              text={Dictionary.addDevice.addBcc.useScanBcc50WiFi}
              accessibilityLabelText={
                Dictionary.addDevice.addBcc.useScanBcc50Accessibility
              }
            />
          </View>
          <Button
            testID="ButtonOpenScanQr"
            style={styles.marginTop20}
            type="primary"
            onPress={grantCameraAccess}
            text={Dictionary.addDevice.addBcc.scanQr}
          />
          <Pressable
            testID="ButtonToOpenModalHelpFindQr"
            style={styles.findQrCodeButton}
            onPress={() => {
              setFindQrCode(true);
            }}>
            <BoschIcon
              size={20}
              name={Icons.infoTooltip}
              color={Colors.mediumBlue}
              accessibilityLabel={'Info'}
            />
            <View style={styles.marginLeft12}>
              <CustomText
                allowFontScaling={true}
                text={'Help me find my QR code'}
                style={{
                  color: Colors.darkBlue,
                }}
              />
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText=" "
                text={'____________________________'}
                style={{
                  color: Colors.darkBlue,
                  marginTop: -23,
                }}
              />
            </View>
          </Pressable>
          <>
            <CustomText
              allowFontScaling={true}
              style={styles.marginTop35}
              text="OR"
            />
            <Button
              style={styles.marginTop41}
              type="secondary"
              onPress={() => {
                setStepCounter(7);
                setManualEntrySelected(true);
              }}
              text={Dictionary.addDevice.addBcc.manualEntry1}
            />
          </>
        </View>
      )}
      {stepCounter === 1 && (
        <View style={{height: 600}}>
          <CodeScanner
            testID="qrScannerView"
            data={val => {
              //validate new device
              if ((val.toString().length = 21 && val.includes('_'))) {
                const values = val.split('_');
                setScannedQR(val);
                let ssidChar = 'BCC50_' + values[0].slice(-4);
                setHotspotInfo('ssid', ssidChar);
                let pass = calculateDevicePassword(val);
                setHotspotInfo('password', pass);
                //setHotspotInfo('password', values[1]);
                hotspotName.current = values[0];
                hotspotPassword.current = values[1];
                // setManualEntry({macId: 'qwerasdfzxcv', tvc: ''});
                setManualEntry({macId: values[0], tvc: ''});
                // setScannedQR(val);
                setStepCounter(7);
              } else {
                setCancelShowScanner;
                showToast('Incorrect QR Code', 'error');
              }
            }}
            height={1000}
            onClose={() => {}}
            onCancel={setCancelShowScanner}
            textToDisplay={Dictionary.addDevice.addBcc.alignScanner}
          />
        </View>
      )}
      {stepCounter === 7 && (
        <View style={{paddingHorizontal: 20}}>
          <CustomInputText
            accessibilityLabelText={'Device SSID of your BCC50.'}
            placeholder={Dictionary.addDevice.addBcc.deviceSsid}
            value={hotSpotInformation.ssid}
            maxLength={12}
            isRequiredField={true}
            onChange={val => {
              setHotspotInfo('ssid', val);
            }}
          />
          <CustomInputText
            accessibilityLabelText={'Password of your BCC50.'}
            accessibilityHintText="Make sure you copy the password using the copy button at the right, so you can paste it as follows on the below tips."
            placeholder={Dictionary.addDevice.addBcc.devicePassword}
            value={hotSpotInformation.password}
            maxLength={12}
            isRequiredField={true}
            onChange={val => {
              setHotspotInfo('password', val);
            }}
            buttonFunctionality={() => {
              Clipboard.setString(hotSpotInformation.password);
              showToast('Password was copied to your clipboard.');
            }}
            buttonLabel={
              <CustomText
                allowFontScaling={true}
                color={'#00629A'}
                text={'Copy'}
              />
            }
          />
          <View style={{marginTop: 0}}>
            <TipsList />
          </View>
        </View>
      )}
      {stepCounter === 6 && (
        <View
          testID="ViewSSID_and_Password"
          style={{
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 24,
            height: '98%',
          }}>
          <View>
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.wifiInfo}
              font={'medium'}
              style={{marginBottom: 51}}
            />
            <CustomInputText
              testID="wifiSSID_input"
              autoCapitalize="words"
              placeholder={Dictionary.addDevice.addBcc.wifiSsid}
              value={wifiInformation.ssid}
              onChange={(text: any) => {
                setWifiInfo('ssid', text);
              }}
              isRequiredField={true}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.wifiSsid}. Enter the SSID of your wifi network.`}
            />
            <CustomInputText
              testID="wifiPassword_input"
              autoCapitalize="words"
              placeholder={Dictionary.addDevice.addBcc.wifiPassword}
              value={wifiInformation.password}
              onChange={(text: any) => {
                setWifiInfo('password', text);
              }}
              isRequiredField={true}
              secureTextEntry={true}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.wifiPassword}.`}
            />
          </View>
          <View>
            <Button
              testID="NextSSIDandPassword"
              onPress={() => {
                //setStepCounter(0)
                sendSSIDPassword();
              }}
              disabled={
                wifiInformation.password === '' || wifiInformation.ssid === ''
              }
              type={'primary'}
              text={'Next'}
            />
            <Button
              type={'secondary'}
              text={'Cancel'}
              onPress={() => setStepCounter(5)}
            />
          </View>
        </View>
      )}
      {stepCounter === 4 && (
        <View>
          <DeviceAddedWiFi
            header={`Wi-Fi Connected`}
            description={Dictionary.addDevice.thermostatAddedWiFi}
            submit={() => {
              navigation.navigate('HomeTabs');
            }}
            cancelAction={cancelAction}
          />
        </View>
      )}
      <ModalComponent
        modalVisible={alreadyRegisteredModal}
        closeModal={() => setAlreadyRegisteredModal(false)}>
        <View style={{width: '97%'}}>
          <CustomText
            allowFontScaling={true}
            text={'Warning!'}
            font={'bold'}
            newline={true}
            size={18}
          />
          <CustomText
            allowFontScaling={true}
            text={Dictionary.addDevice.addBcc.deviceAlreadyRegistered}
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.deviceAlreadyRegisteredAccessibility
            }
            newline={true}
          />
          <CustomText
            allowFontScaling={true}
            text={Dictionary.addDevice.addBcc.shareAccount}
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.shareAccountAccessibility
            }
            newline={true}
          />

          <Button
            type="primary"
            text={'Continue'}
            onPress={() => {
              setAlreadyRegisteredModal(false);
              setStepCounter(3);
            }}
          />
          <Button
            type="secondary"
            text={'Cancel'}
            onPress={() => {
              setManualEntry({
                macId: '',
                tvc: '',
              });
              setAlreadyRegisteredModal(false);
            }}
          />
        </View>
      </ModalComponent>

      <ModalComponent
        testID="ModalHelpFindQr"
        modalVisible={findQrCore}
        closeModal={() => setFindQrCode(false)}>
        <View style={{width: '98%'}}>
          <View accessible={true}>
            <CustomText
              allowFontScaling={true}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.findQrCode}.`}
              text={Dictionary.addDevice.addBcc.findQrCode}
              font={'bold'}
              color={Colors.darkGray}
              size={18}
              style={{marginBottom: 16}}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.qrCodeLocationWiFi}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.qrCodeLocationADAWiFi}.`}
              newline={true}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.stepsToFind}
              accessibilityLabelText={Dictionary.addDevice.addBcc.stepsToFind}
              style={{marginBottom: 6}}
            />

            <View style={{marginBottom: 24}}>
              <FindQRTooltip
                number={'1'}
                text={Dictionary.addDevice.addBcc.step1WiFi}
                ADA={Dictionary.addDevice.addBcc.step1ADAWiFi}
              />
              <FindQRTooltip
                number={'2'}
                text={Dictionary.addDevice.addBcc.step2WiFi}
                ADA={Dictionary.addDevice.addBcc.step2ADAWiFi}
              />
              <FindQRTooltip
                number={'3'}
                text={Dictionary.addDevice.addBcc.step3WiFi}
                ADA={Dictionary.addDevice.addBcc.step3ADAWiFi}
              />
              <View style={styles.toolTipWiFiHelpQR}>
                <BoschIcon
                  size={20}
                  name={Icons.infoTooltip}
                  color={Colors.mediumBlue}
                  accessibilityLabel={'Info'}
                />
                <CustomText
                  allowFontScaling={true}
                  text={Dictionary.addDevice.addBcc.step4WiFi}
                  accessibilityLabelText={Dictionary.addDevice.addBcc.step4WiFi}
                  style={styles.toolTipWiFiText}
                />
              </View>
            </View>
          </View>

          <Button
            testID="CloseModalHelpFindQr"
            type="secondary"
            text={Dictionary.button.close}
            onPress={() => {
              setFindQrCode(false);
            }}
          />
        </View>
      </ModalComponent>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  thirdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 37,
  },
  toolTipWiFiHelpQR: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  toolTipWiFiText: {
    fontSize: 13,
  },
  flex1: {
    flex: 1,
  },
  flexRowDirection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  marginTop35: {
    marginTop: 35,
  },
  marginTop32: {
    marginTop: 32,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop41: {
    marginTop: 41,
  },
  marginTop20: {
    marginTop: 20,
  },
  inputTextContainer: {
    flexDirection: 'row',
    marginTop: 33,
  },
  inputTextContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  grayColor: {
    color: 'rgba(213,213,213,1)',
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  confirmationPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  marginHorizontal10: {marginHorizontal: 10},
  findQrCodeButton: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginLeft12: {marginLeft: 12},
});

export default ReconnectWiFi;
