import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  AppState,
  Pressable,
  ToastAndroid,
} from 'react-native';
import {
  CustomText,
  Button,
  CustomInputText,
  BoschIcon,
  CustomPicker,
  CustomAutoCompleteInput,
} from '../components';
import CodeScanner from '../components/CodeScanner';
import DeviceAdded from '../components/DeviceAdded';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {validateInputField} from '../utils/Validator';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Icons} from '../utils/icons';
import {showToast} from '../components/CustomToast';
import ModalComponent from '../components/ModalComponent';
import Radiobutton from '../components/Radiobutton';
import wifiReborn from 'react-native-wifi-reborn';
import {
  connectWifi,
  getInitConf,
  connectTCPAction,
  setSchedule,
  exitCom,
  calculateDevicePassword,
  setDeviceNameOnboarding,
  setLocationOnboarding,
  UPDATE_BCC50MACID,
} from '../store/actions/HomeOwnerActions';
import {
  checkNewDevice,
  addNewDevice,
  getPlaceId,
  getLocationSuggestionsBcc,
  setSelectedDevice,
  newDeviceInfo,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Clipboard from '@react-native-clipboard/clipboard';
//import Clipboard from"@react-native-community/clipboard"
import {Colors} from '../styles';
import {connectTCPPromise, exitCommand} from '../utils/HotSpotFunctions';

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

const FindQRTooltip = ({number, text}) => {
  return (
    <View style={{flexDirection: 'row', marginBottom: 6}}>
      <CustomText text={`${number}.`} style={{marginRight: 6}} />
      <CustomText align="left" text={text} />
    </View>
  );
};

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
          align={'left'}
          color={'#00629A'}
          text={header}
          font={'bold'}
          accessibilityLabelText={`${sequence}${header}.`}
        />
        <CustomText
          align={'left'}
          text={description}
          color={'#00629A'}
          accessibilityLabelText={`${description}.`}
        />
      </View>
    </View>
  );
};

function abbrRegion(input, to) {
  var states = [
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['American Samoa', 'AS'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['Armed Forces Americas', 'AA'],
    ['Armed Forces Europe', 'AE'],
    ['Armed Forces Pacific', 'AP'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['District Of Columbia', 'DC'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Guam', 'GU'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Marshall Islands', 'MH'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Northern Mariana Islands', 'NP'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Puerto Rico', 'PR'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['US Virgin Islands', 'VI'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
  ];

  // So happy that Canada and the US have distinct abbreviations
  var provinces = [
    ['Alberta', 'AB'],
    ['British Columbia', 'BC'],
    ['Manitoba', 'MB'],
    ['New Brunswick', 'NB'],
    ['Newfoundland', 'NF'],
    ['Northwest Territory', 'NT'],
    ['Nova Scotia', 'NS'],
    ['Nunavut', 'NU'],
    ['Ontario', 'ON'],
    ['Prince Edward Island', 'PE'],
    ['Quebec', 'QC'],
    ['Saskatchewan', 'SK'],
    ['Yukon', 'YT'],
  ];

  var regions = states.concat(provinces);

  var i; // Reusable loop variable
  if (to == 'abbr') {
    input = input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    for (i = 0; i < regions.length; i++) {
      if (regions[i][0] == input) {
        return regions[i][1];
      }
    }
  } else if (to == 'name') {
    input = input.toUpperCase();
    for (i = 0; i < regions.length; i++) {
      if (regions[i][1] == input) {
        return regions[i][0];
      }
    }
  }
}

const AddBccWIFI = ({
  navigation,
  user,
  checkNewDevice,
  addNewDevice,
  getPlaceId,
  getLocationSuggestionsBcc,
  selectedD,
  setSelectedDevice,
  newDeviceInfo,
  deviceList,
  BCC50macID,
  UPDATE_BCC50MACID,
}) => {
  const [stepCounter, setStepCounter] = useState(
    // navigation.getParam('device') === 'BCC50' ? 5 : 0,
    navigation.getParam('device') === 'BCC50' ? 3 : 0,
  );
  const [deviceLocation, setDeviceLocation] = useState('');
  const [deviceLocationError, setDeviceLocationError] = useState({
    deviceLocation: '',
  });

  const [macId, setMacId] = useState('');
  const [siglasUSState, setSiglasUSState] = useState(Enum.stateList);
  const [siglasCanProvince, setSiglasCanProvince] = useState(Enum.provineList);
  const [verificationCode, setVerificationCode] = useState('');
  const [validMacId, setValidMac] = useState(false);
  const [validTvc, setValidTvc] = useState(false);
  const [manualEntryError, setManualEntryError] = useState({
    macId: '',
    tvc: '',
  });
  const [findQrCore, setFindQrCode] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    macId: '',
    tvc: '',
  });
  const [manualEntrySelected, setManualEntrySelected] = useState(false);
  const [alreadyRegisteredModal, setAlreadyRegisteredModal] = useState(false);
  const [address, setAddress] = useState({
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
  });
  const [wifiInformation, setWifiInformation] = useState({
    ssid: '',
    password: '',
  });
  const [hotSpotInformation, setHotSpotInformation] = useState({
    ssid: '',
    password: '',
  });
  const [errorData, setErrorData] = useState({
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });
  const [text, setText] = useState('');
  const [skipFlag, setSkipFlag] = useState(false);
  const [dataAutoComplete, setDataAutoComplete] = useState(['']);
  const [dataDummie2, setDatadataDummie2] = useState(['']);
  const [scannedQR, setScannedQR] = useState('');
  const [skipStatus, setSkipStatus] = useState(false);
  const [flowSelect, setFlowSelect] = useState(0);

  const appState = useRef(AppState.currentState);
  const ipState = useRef('');
  const [currentIpAddress, setCurrentIpAddress] = useState('');
  const hotspotName = useRef('');
  const hotspotPassword = useRef('');
  const [placeId, setPlaceId] = useState({});
  const [chaseSuggestion, setChaseSuggestion] = useState(false);
  const showOptions = useRef(false);
  const selectedValue = useRef(true);
  const dispatch = useDispatch();
  const [alreadyChosen, setAlreadyChosed] = useState(true);

  const isBcc50Selected = () => {
    return navigation.getParam('device') === 'BCC50';
  };

  const handleDirection = value => {
    setChaseSuggestion(true);
    showOptions.current = false;
    dataDummie2.forEach(data => {
      if (data.Text.toString() === value && data.PlaceId) {
        getPlaceId(
          data.PlaceId.toString(),
          () => {
            showOptions.current = false;
          },
          true,
        );
      }
    });
  };

  const printResponse = (text1, letter) => {
    let array = [];
    text1.map(data => {
      if (data.PlaceId) {
        array.push(data.Text.toString());
      }
    });
    //if (
    //  array.length != 0 &&
    //  selectedValue.current &&
    //  (letter !== '' || letter.length > 3)
    //) {
    //  showOptions.current = true;
    //} else {
    //  showOptions.current = false;
    //}
    setDataAutoComplete(array);
    setDatadataDummie2(text1);
  };

  const getSuggestions = letter => {
    if (letter.length > 2 && alreadyChosen) {
      setAlreadyChosed(true);
      showOptions.current = true;
      getLocationSuggestionsBcc(
        letter,
        printResponse,
        address.country === 'United States' ? 'USA' : 'CAN',
      );
    } else {
      setDataAutoComplete(['']);
      showOptions.current = false;
    }
  };

  const getListOfDevices = () => {
    let listOfDevices = [];
    deviceList.map(d => {
      if (d.deviceType.includes('IDS Arctic') && !d.paired) {
        d.isChecked = false;
        listOfDevices.push(d);
      }
    });

    return listOfDevices;
  };

  useEffect(() => {
    if (selectedD.location !== undefined && chaseSuggestion) {
      setChaseSuggestion(false);
      setPlaceId(selectedD);
      const locationSelected = selectedD.location.toString().split(',');
      let stateComplete = '';
      let acronymState = [{}];
      if (address.country === 'United States') {
        acronymState = siglasUSState;
      } else {
        acronymState = siglasCanProvince;
      }
      acronymState.forEach(val => {
        if (val.value === locationSelected[2]) {
          stateComplete = val.label;
        }
      });

      setAddress({
        ...address,
        zipCode:
          locationSelected[0] !== 'undefined'
            ? address.country === 'United States'
              ? locationSelected[0].length > 5
                ? locationSelected[0].substring(0, 5)
                : locationSelected[0]
              : locationSelected[0]
            : '',
        // state: stateComplete,
        state:
          locationSelected[2] === 'undefined'
            ? ''
            : abbrRegion(locationSelected[2], 'abbr'),
        city: locationSelected[1] === 'undefined' ? '' : locationSelected[1],
        country:
          locationSelected[3] === '' ? address.country : locationSelected[3],
      });
    }
  }, [selectedD]);

  useEffect(() => {
    if (isBcc50Selected() && Platform.OS === 'ios') {
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
              //if(ipState.current !== state.details.ipAddress && hotspotName.current !== '' && hotspotPassword.current !== ''){
              //setManualEntry({macId: 'qwerasdfzxcv', tvc: ''});
              //setStepCounter(3);
              //setManualEntry({macId: 'qwerasdfzxcv', tvc: ''});
              if (stepCounter === 3) {
                setSkipStatus(true);
              }
            }
          } else {
            ipState.current = state.details.ipAddress;
            setCurrentIpAddress(ipState.current);
          }

          appState.current = nextAppState;
        });
        //return () => {
        //  unsubscribe();
        //};
      });

      return () => {
        //subscription();
      };
    }
  }, []);

  const confirmStep = () => {
    setSkipStatus(false);
    setStepCounter(4);
  };

  useEffect(() => {}, [selectedD]);

  useEffect(() => {
    if (skipStatus === true && stepCounter === 7) {
      connectTCPAction(
        wifiInformation.ssid,
        wifiInformation.password,
        scannedQR,
        confirmStep,
      );
      setSkipStatus(false);
    }
  }, [skipStatus]);

  const [currentSSID, setCurrentSSID] = useState();

  const getCurrentSSID = () => {
    wifiReborn.getCurrentWifiSSID().then(ssid => setCurrentSSID(ssid));
  };

  const connectToDevice50 = (ssidDev, passwordDev, scanned) => {
    wifiReborn.connectToProtectedSSID(ssidDev, passwordDev, false, false).then(
      () => {
        //setSkipStatus(false);
        //setStepCounter(4);
        ToastAndroid.show('Connected succesfully to BCC50', ToastAndroid.SHORT);
        connectTCPAction(
          wifiInformation.ssid,
          wifiInformation.password,
          scanned,
          confirmStep,
        );
      },
      () => {
        showToast('Connected Failed to BCC50.', 'error');
      },
    );
  };

  const saveMacIdAndTvc = () => {
    //if (manualEntry.macId === '987987987987') {
    //  setAlreadyRegisteredModal(true);
    //} else {
    if (true) setStepCounter(3);
    //  else showToast('MAC ID/verification code is not valid', 'error');
    //}
  };

  const setShowScanner = () => {
    saveMacIdAndTvc();
  };

  const goToAnotherDevice = () => {
    let list = getListOfDevices();
    //if (list.length != 0) {
    //  newDeviceInfo({
    //    deviceType: 'BCC101',
    //    macId: manualEntry.macId,
    //    newDevice: true,
    //  });
    //  navigation.navigate('PairScreen');
    //} else {
    navigation.navigate('addAnotherDevice');
    //}
  };

  const setCancelShowScanner = () => {
    setStepCounter(0);
  };

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

  const onBack = () => {
    setAddress({
      country: 'United States',
      state: '',
      city: '',
      zipCode: '',
    });
    setText('');
    if (stepCounter === 0) {
      if (isBcc50Selected()) {
        //setStepCounter(5);
        setStepCounter(6);
      } else {
        navigation.navigate('Add');
      }
    } else if (stepCounter === 5) {
      if (isBcc50Selected()) {
        setStepCounter(3);
      } else {
        navigation.navigate('Add');
      }
    } else if (stepCounter == 1 || stepCounter == 2) {
      setMacId('');
      setVerificationCode('');
      setStepCounter(0);
      hotspotName.current = '';
      hotspotPassword.current = '';
      setHotSpotInformation({ssid: '', password: ''});
    } else if (stepCounter == 3) {
      if (manualEntrySelected) {
        setStepCounter(2);
      } else {
        if (isBcc50Selected()) {
          navigation.navigate('Add');
        } else {
          setStepCounter(1);
        }
      }
      setMacId('');
      setVerificationCode('');
    } else if (stepCounter == 4) {
      if (isBcc50Selected()) {
        setStepCounter(7);
      } else {
        setStepCounter(3);
      }
    } else if (stepCounter === 6) {
      setStepCounter(5);
    } else if (stepCounter === 7) {
      hotspotName.current = '';
      hotspotPassword.current = '';
      setHotSpotInformation({ssid: '', password: ''});
      setStepCounter(1);
      /*connectTCPAction(
        wifiInformation.ssid,
        wifiInformation.password,
        scannedQR,
        confirmStep,
      );*/

      //UPDATE_BCC50MACID(scannedQR);
    }
  };

  const setHotspotInfo = (field, value) => {
    setHotSpotInformation(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const setWifiInfo = (field, value) => {
    setWifiInformation(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const setFormValue = (field, value) => {
    setAddress(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const changeHandler = (field, value, pattern) => {
    setFormValue(field, value);
    if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }
  };

  const setErrorValue = (field, value) => {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const changeHandlerDeviceLocation = (value, pattern) => {
    setDeviceLocation(value);
    let validation = validateInputField(value, pattern);
    setErrorDevice('deviceLocation', validation.errorText);
  };

  const setErrorDevice = (field, value) => {
    setDeviceLocationError(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const setMaualEntryValue = (field, value) => {
    setManualEntry(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const changeHandlerManualEntry = (field, value, pattern) => {
    setMaualEntryValue(field, value);
    let validation = validateInputField(value, pattern);
    setManualEntryErrorValue(field, validation.errorText);
  };

  const setManualEntryErrorValue = (field, value) => {
    setManualEntryError(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const connectToBCC50Connection = () => {
    return new Promise((resolve, reject) => {
      connectTCPAction();
      resolve(true);
    });
  };
  const connectToBCC50 = async () => {
    //connectTCPAction();
    await connectToBCC50Connection();
    connectWifi(wifiInformation.ssid, wifiInformation.password, scannedQR);
  };

  const cancelAction = () => {
    //navigation.navigate('BCCDashboard', {selectedDevice: selectedD});
    exitCom();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <>
        <View style={styles.headerContainer}>
          {isBcc50Selected() && stepCounter === 4 ? null : (
            <View style={styles.headerDivision}>
              <TouchableOpacity
                style={styles.headerBackButton}
                onPress={() => onBack()}>
                <BoschIcon
                  name={Icons.backLeft}
                  size={24}
                  style={styles.marginHorizontal10}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.headerTitle}>
            <Text
              style={{
                fontSize: 21,
                marginVertical: 10,
              }}>
              {Dictionary.addDevice.addDevice}
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {stepCounter === 0 && (
        <View style={{paddingHorizontal: 20}}>
          <CustomText
            style={{
              marginTop: isBcc50Selected() ? 16 : 28,
            }}
            text={
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.connectPhonebcc50
                : Dictionary.addDevice.addBcc.connectPhone
            }
            accessibilityLabelText={
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility
                : Dictionary.addDevice.addBcc.connectPhone
            }
          />
          <CustomText
            style={styles.marginTop32}
            text={Dictionary.addDevice.addBcc.automaticEntry}
            font={'bold'}
          />
          <CustomText
            style={styles.marginTop10}
            text={
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.useScanBcc50
                : Dictionary.addDevice.addBcc.useScanBcc100
            }
            accessibilityLabelText={
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.useScanBcc50Accessibility
                : Dictionary.addDevice.addBcc.useScanBcc100Accessibility
            }
          />
          <Button
            style={styles.marginTop20}
            type="primary"
            onPress={() => {
              grantCameraAccess();
              setFlowSelect(1);
              getCurrentSSID();
            }}
            // text={Dictionary.addDevice.addBcc.scanQr}
            text={'ScanQR Flow1'}
          />
          <Button
            style={styles.marginTop20}
            type="primary"
            onPress={() => {
              grantCameraAccess();
              setFlowSelect(2);
            }}
            //text={Dictionary.addDevice.addBcc.scanQr}
            text={'ScanQR Flow2'}
          />
          <Pressable
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
                text={'Help me find my QR code'}
                style={{
                  color: Colors.darkBlue,
                }}
              />
              <CustomText
                text={'____________________________'}
                style={{
                  color: Colors.darkBlue,
                  marginTop: -23,
                }}
              />
            </View>
          </Pressable>
          {isBcc50Selected() ? null : (
            <>
              <CustomText style={styles.marginTop35} text="OR" />
              <Button
                style={styles.marginTop41}
                type="secondary"
                onPress={() => {
                  setStepCounter(2);
                  setManualEntrySelected(true);
                }}
                text={Dictionary.addDevice.addBcc.manualEntry1}
              />
            </>
          )}
        </View>
      )}
      {stepCounter === 1 && (
        <CodeScanner
          data={val => {
            if (navigation.getParam('device') !== 'BCC50') {
              const values = val.split('_');
              checkNewDevice(
                {
                  deviceId: values[0],
                  code: values[1],
                  model: 'BCC100',
                },
                () => {
                  setMacId(values[0]);
                  setManualEntry({macId: values[0], tvc: values[1]});
                  saveMacIdAndTvc();
                },
                error => {
                  const errorCode = error.split(' : ')[0];
                  if (errorCode === '201') {
                    setManualEntry({macId: values[0], tvc: values[1]});
                    setAlreadyRegisteredModal(true);
                  } else {
                    showToast(error.split(' : ')[1], 'error');
                  }
                },
              );
            } else {
              //validate new device
              const values = val.split('_');
              UPDATE_BCC50MACID(val);
              // setHotspotInfo('ssid', values[0]);
              setHotspotInfo('ssid', 'BCC50_' + values[0].slice(-4));
              setHotspotInfo('password', calculateDevicePassword(val));
              //setHotspotInfo('password', values[1]);
              hotspotName.current = values[0];
              hotspotPassword.current = values[1];
              // setManualEntry({macId: 'qwerasdfzxcv', tvc: ''});
              setManualEntry({macId: values[0], tvc: ''});
              setScannedQR(val);

              Platform.OS === 'ios'
                ? setStepCounter(7)
                : flowSelect === 1
                ? setStepCounter(7)
                : connectToDevice50(
                    'BCC50_' + values[0].slice(-4),
                    calculateDevicePassword(val),
                    val,
                  );
            }
          }}
          onClose={() => {}}
          onCancel={setCancelShowScanner}
          textToDisplay={Dictionary.addDevice.addBcc.alignScanner}
        />
      )}
      {stepCounter === 2 && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[
              styles.flex1,
              {
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              },
            ]}>
            <View>
              <CustomText
                style={isBcc50Selected() ? {marginTop: 16} : styles.marginTop35}
                text={
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc.connectPhonebcc50
                    : Dictionary.addDevice.addBcc.alignPhone
                }
                accessibilityLabelText={
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility
                    : Dictionary.addDevice.addBcc.alignPhone
                }
              />
              <CustomText
                style={{marginTop: 46}}
                text={Dictionary.addDevice.addBcc.manualEntry}
                font="bold"
              />
              <CustomText
                style={isBcc50Selected() ? {marginTop: 10} : {marginTop: 31}}
                text={
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc.manualEntryInstructionBcc50
                    : Dictionary.addDevice.addBcc.manualEntryInstructions
                }
                accessibilityLabelText={
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc
                        .manualEntryInstructionBcc50Accessibility
                    : Dictionary.addDevice.addBcc.manualEntryInstructions
                }
              />
              {isBcc50Selected() ? (
                <View style={{marginTop: 59}}>
                  <CustomInputText
                    placeholder={Dictionary.addDevice.addBcc.deviceSsid}
                    value={hotSpotInformation.ssid}
                    maxLength={12}
                    isRequiredField={true}
                    onChange={val => {
                      hotspotName.current = val;
                      setHotspotInfo('ssid', val);
                    }}
                    accessibilityLabelText={
                      Dictionary.addDevice.addBcc.deviceSsid
                    }
                    accessibilityHintText={
                      Dictionary.addDevice.addBcc.deviceSsidAccessibility
                    }
                  />
                  <CustomInputText
                    placeholder={Dictionary.addDevice.addBcc.devicePassword}
                    value={hotSpotInformation.password}
                    maxLength={12}
                    isRequiredField={true}
                    onChange={val => {
                      hotspotPassword.current = val;
                      setHotspotInfo('password', val);
                    }}
                    buttonFunctionality={() => {
                      Clipboard.setString(hotSpotInformation.password);
                    }}
                    buttonLabel={<CustomText color={'#00629A'} text={'Copy'} />}
                    showButton={hotSpotInformation.password.length !== 0}
                    accessibilityLabelText={
                      Dictionary.addDevice.addBcc.devicePassword
                    }
                    accessibilityHintText={
                      Dictionary.addDevice.addBcc.devicePasswordAccessibility
                    }
                  />
                  <View style={{marginTop: 39}}>
                    <TipsList />
                  </View>
                </View>
              ) : (
                <View>
                  <View style={{marginTop: 30}}>
                    <CustomInputText
                      placeholder={Dictionary.addDevice.addBcc.deviceMacId}
                      value={manualEntry.macId}
                      maxLength={12}
                      isRequiredField={true}
                      onChange={val => {
                        changeHandlerManualEntry('macId', val, Enum.macId);
                      }}
                      errorText={
                        manualEntryError.macId
                          ? Dictionary.addDevice.addBcc.macIdRequired
                          : ''
                      }
                    />
                  </View>
                  <View style={{marginTop: 15}}>
                    <CustomInputText
                      placeholder={
                        Dictionary.addDevice.addBcc.temporaryVerificationCode
                      }
                      keyboardType={'numeric'}
                      value={manualEntry.tvc}
                      maxLength={4}
                      isRequiredField={true}
                      onChange={val => {
                        val = val.replace(/[^0-9]/g, '');
                        changeHandlerManualEntry('tvc', val, Enum.tvc);
                      }}
                      errorText={
                        manualEntryError.tvc
                          ? Dictionary.addDevice.addBcc.verificationCodeRequired
                          : ''
                      }
                    />
                  </View>
                </View>
              )}
            </View>
            {navigation.getParam('device') !== 'BCC50' && (
              <Button
                disabled={
                  manualEntryError.macId !== '' ||
                  manualEntryError.tvc !== '' ||
                  manualEntry.macId === '' ||
                  manualEntry.tvc === ''
                }
                type="primary"
                onPress={() => {
                  checkNewDevice(
                    {
                      deviceId: manualEntry.macId,
                      code: manualEntry.tvc,
                      model: 'BCC100',
                    },
                    () => {
                      saveMacIdAndTvc();
                    },
                    error => {
                      //saveMacIdAndTvc();
                      const errorCode = error.split(' : ')[0];
                      switch (errorCode) {
                        case '201':
                          setAlreadyRegisteredModal(true);
                          break;
                        case '204':
                        case '203':
                          showToast(error.split(' : ')[1], 'error');
                      }
                    },
                  );
                }}
                text={'Next'}
              />
            )}
          </View>
        </ScrollView>
      )}
      {stepCounter === 3 && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[
              styles.flex1,
              {justifyContent: 'space-between', paddingHorizontal: 20},
            ]}>
            <View>
              <View style={{marginTop: 17}}>
                <CustomInputText
                  placeholder={Dictionary.addDevice.addBcc.deviceLocation}
                  value={deviceLocation}
                  onChange={val =>
                    changeHandlerDeviceLocation(
                      val.replace(/[^a-zA-Z ]/g, ''),
                      Enum.deviceLocation,
                    )
                  }
                  isRequiredField={true}
                  autoCapitalize="sentences"
                  tooltip={Dictionary.addDevice.addBcc.tooltipMessage}
                  autoopenTooltip={true}
                  errorText={
                    deviceLocationError.deviceLocation
                      ? Dictionary.addDevice.addBcc.deviceLocationRequired
                      : ''
                  }
                  maxLength={20}
                />
              </View>
              {isBcc50Selected() ? null : (
                <CustomInputText
                  style={styles.grayColor}
                  disabled={true}
                  isRequiredField={true}
                  placeholder={Dictionary.addDevice.addBcc.macId}
                  value={manualEntry.macId.toUpperCase()}
                />
              )}

              <CustomText
                size={18}
                style={{marginTop: 20}}
                text={Dictionary.addDevice.addBcc.addDeviceLocation}
                align={'left'}
                font={'bold'}
              />
              <CustomText
                text={Dictionary.addDevice.addBcc.selectCountry}
                align={'left'}
                style={{marginTop: 20}}
              />
              <View style={{flexDirection: 'row', marginVertical: 15}}>
                <Radiobutton
                  accessibilityLabelText={
                    Dictionary.addDevice.addBcc.unitedStates
                  }
                  accessibilityHintText={
                    Dictionary.addDevice.addBcc.unitedStatesAccessibility
                  }
                  checked={
                    address.country === Dictionary.addDevice.addBcc.unitedStates
                  }
                  handleCheck={() => {
                    setAddress({
                      country: '',
                      state: '',
                      city: '',
                      zipCode: '',
                    });
                    changeHandler(
                      'country',
                      Dictionary.addDevice.addBcc.unitedStates,
                      null,
                    );
                    showOptions.current = false;
                    setText('');
                    changeHandler('state', '', null);
                  }}
                  text={Dictionary.addDevice.addBcc.unitedStates}
                  style={{marginRight: 30}}
                />
                <Radiobutton
                  accessibilityLabelText={Dictionary.addDevice.addBcc.canada}
                  accessibilityHintText={
                    Dictionary.addDevice.addBcc.canadaAccessibility
                  }
                  checked={
                    address.country === Dictionary.addDevice.addBcc.canada
                  }
                  handleCheck={() => {
                    setAddress({
                      country: '',
                      state: '',
                      city: '',
                      zipCode: '',
                    });
                    changeHandler(
                      'country',
                      Dictionary.addDevice.addBcc.canada,
                      null,
                    );
                    showOptions.current = false;
                    setText('');
                    changeHandler('state', '', null);
                  }}
                  text={Dictionary.addDevice.addBcc.canada}
                />
              </View>

              <CustomAutoCompleteInput
                accessibilityHintText={'Text field to select your location'}
                setValue={value => {
                  showOptions.current = false;
                  selectedValue.current = false;
                  handleDirection(value);
                  setAlreadyChosed(false);
                  setTimeout(() => {
                    setAlreadyChosed(true);
                  }, 800);
                }}
                value={text}
                data={dataAutoComplete}
                placeholder="Location"
                //onSelect={() => }
                additionalFunction={getSuggestions}
                showOptions={showOptions.current}
              />

              <CustomPicker
                disabled={true}
                placeholder={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? Dictionary.createProfile.state
                    : Dictionary.addDevice.addBcc.province
                }
                value={address.state}
                onChange={(text: any) => {
                  changeHandler('state', text.value, Enum.required);
                }}
                options={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? Enum.stateList
                    : Enum.provineList
                }
                iteratorKey="key"
                iteratorLabel="label"
                isRequiredField={true}
                showFieldLabel={true}
              />
              <CustomInputText
                disabled={true}
                autoCapitalize="words"
                placeholder={Dictionary.createProfile.city}
                value={address.city}
                onChange={(text: any) => {
                  text = text.replace(/[^a-zA-Z ]/g, '');
                  changeHandler('city', text, Enum.cityPattern);
                }}
                isRequiredField={true}
                errorText={
                  errorData.city ? Dictionary.createProfile.cityRequired : ''
                }
              />
              <CustomInputText
                disabled={true}
                autoCapitalize="words"
                placeholder={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? Dictionary.createProfile.zipcode
                    : Dictionary.addDevice.addBcc.postalCode
                }
                value={address.zipCode}
                maxLength={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? 5
                    : 7
                }
                keyboardType={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? 'numeric'
                    : 'default'
                }
                onChange={(text: any) => {
                  if (
                    address.country === Dictionary.addDevice.addBcc.unitedStates
                  ) {
                    text = text.replace(/[^0-9]/g, '');
                  }

                  changeHandler(
                    'zipCode',
                    text,
                    address.country === Dictionary.addDevice.addBcc.unitedStates
                      ? Enum.zipCodePattern
                      : Enum.postalCodePattern,
                  );
                }}
                isRequiredField={true}
                delimiterType="postalCode"
                errorText={
                  errorData.zipCode
                    ? Dictionary.createProfile.zipcodeRequired
                    : ''
                }
              />
            </View>

            <Button
              disabled={
                deviceLocation === '' ||
                address.country === '' ||
                address.city === '' ||
                address.state === '' ||
                address.zipCode === '' ||
                deviceLocationError.deviceLocation !== '' ||
                errorData.country !== '' ||
                errorData.city !== '' ||
                errorData.state !== '' ||
                errorData.zipCode !== ''
              }
              type="primary"
              onPress={() => {
                if (isBcc50Selected()) {
                  //setStepCounter(4);
                  setStepCounter(5);
                  dispatch(setDeviceNameOnboarding({name: deviceLocation}));
                  dispatch(
                    setLocationOnboarding({
                      city: address.city,
                      state: address.state,
                      zipcode: address.zipCode,
                      country: address.country,
                      placeid: placeId,
                    }),
                  );
                } else {
                  addNewDevice(
                    {
                      deviceId: manualEntry.macId,
                      userId: user.attributes.sub,
                      deviceName: deviceLocation,
                      city: address.city,
                      state: address.state,
                      zipcode: address.zipCode,
                      country: address.country,
                      deviceType: navigation.getParam('device'),
                      placeId: placeId,
                    },
                    () => {
                      setStepCounter(4);
                      setText('');
                      setAddress({
                        country: 'United States',
                        state: '',
                        city: '',
                        zipCode: '',
                      });
                    },
                    error => {
                      showToast('There was a problem. Try Again.', 'error');
                    },
                  );
                }
              }}
              text={isBcc50Selected() ? 'Next' : Dictionary.button.submit}
            />
          </View>
        </ScrollView>
      )}
      {stepCounter === 4 && (
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <DeviceAdded
            header={`${deviceLocation} Thermostat`}
            description={Dictionary.addDevice.thermostatAdded}
            submit={() => {
              if (isBcc50Selected()) {
                setSelectedDevice({
                  deviceName: 'BCC50Test',
                  deviceType: 'BCC50',
                  isThermostat: true,
                  isOn: true,
                  mode: 0,
                  isMonitoring: null,
                  setPoint: 74,
                  heatingSetpoint: 74,
                  coolingSetpoint: 79,
                  current: 76,
                  //mode: mode,
                  macId: wifiInformation.ssid,
                  isOnSchedule: true,
                  stage: 3,
                  isConnected: true,
                  acceleratedHeating: false,
                  schedules: [
                    {
                      default_home: '1',
                      limit: '71-81',
                      mode: '1',
                      model_id: '1',
                      name: 'Home',
                      state: '0',
                    },
                    {
                      default_home: '1',
                      limit: '71-81',
                      mode: '1',
                      model_id: '2',
                      name: 'Vacation',
                      state: '0',
                    },
                  ],
                });
                navigation.navigate('UnitConfiguration');
              } else {
                goToAnotherDevice();
              }
            }}
            cancelAction={isBcc50Selected() ? cancelAction : undefined}
          />
        </View>
      )}
      {stepCounter === 5 && (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
          }}>
          <View accessible={true}>
            <Image
              style={{alignSelf: 'center', marginTop: 84, marginBottom: 37}}
              source={require('./../assets/images/smarthome.png')}
            />
            <CustomText
              font={'regular'}
              text={Dictionary.addDevice.addBcc.phoneConnected}
              style={{marginBottom: 26}}
            />
            <CustomText
              text={Dictionary.addDevice.addBcc.setupThermostat}
              font={'regular'}
            />
          </View>
          <View>
            <Button
              text={'Next'}
              type={'primary'}
              onPress={() => setStepCounter(6)}
            />
            <Button
              text={'Skip'}
              type={'secondary'}
              onPress={() => {
                setSkipFlag(true);
                setStepCounter(0);
              }}
            />
          </View>
        </View>
      )}
      {stepCounter === 6 && (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingTop: 24,
          }}>
          <View>
            <CustomText
              text={Dictionary.addDevice.addBcc.wifiInfo}
              font={'medium'}
              style={{marginBottom: 51}}
            />
            <CustomInputText
              autoCapitalize="words"
              placeholder={Dictionary.addDevice.addBcc.wifiSsid}
              value={wifiInformation.ssid}
              onChange={(text: any) => {
                setWifiInfo('ssid', text);
              }}
              isRequiredField={true}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.wifiSsid}.`}
            />
            <CustomInputText
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
              onPress={() => setStepCounter(0)}
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
      {stepCounter === 7 && (
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <CustomInputText
            placeholder={Dictionary.addDevice.addBcc.deviceSsid}
            value={hotSpotInformation.ssid}
            maxLength={12}
            isRequiredField={true}
            onChange={val => {
              setHotspotInfo('ssid', val);
            }}
          />
          <CustomInputText
            placeholder={Dictionary.addDevice.addBcc.devicePassword}
            value={hotSpotInformation.password}
            maxLength={12}
            isRequiredField={true}
            onChange={val => {
              setHotspotInfo('password', val);
            }}
            buttonFunctionality={() => {
              Clipboard.setString(hotSpotInformation.password);
            }}
            buttonLabel={
              <CustomText
                color={'#00629A'}
                text={Platform.OS === 'ios' ? 'Copy' : null}
              />
            }
          />
          {Platform.OS === 'ios' ? (
            <View style={{marginTop: 32}}>
              <TipsList />
            </View>
          ) : (
            <Button
              type="primary"
              text={'Connect to BCC50'}
              onPress={() => {
                connectToDevice50(
                  hotSpotInformation.ssid,
                  hotSpotInformation.password,
                  scannedQR,
                );
              }}
            />
          )}
        </View>
      )}
      <ModalComponent
        modalVisible={alreadyRegisteredModal}
        closeModal={() => setAlreadyRegisteredModal(false)}>
        <View style={{width: '97%'}}>
          <CustomText
            text={'Warning!'}
            font={'bold'}
            newline={true}
            size={18}
          />
          <CustomText
            text={Dictionary.addDevice.addBcc.deviceAlreadyRegistered}
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.deviceAlreadyRegisteredAccessibility
            }
            newline={true}
          />
          <CustomText
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
        modalVisible={findQrCore}
        closeModal={() => setFindQrCode(false)}>
        <View style={{width: '98%'}}>
          <CustomText
            text={Dictionary.addDevice.addBcc.findQrCode}
            font={'bold'}
            color={Colors.darkGray}
            size={18}
            style={{marginBottom: 16}}
          />
          <CustomText
            text={Dictionary.addDevice.addBcc.qrCodeLocation}
            accessibilityLabelText={Dictionary.addDevice.addBcc.qrCodeLocation}
            newline={true}
          />
          <CustomText
            text={Dictionary.addDevice.addBcc.stepsToFind}
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.shareAccountAccessibility
            }
            style={{marginBottom: 6}}
          />

          <View style={{marginBottom: 24}}>
            <FindQRTooltip
              number={'1'}
              text={Dictionary.addDevice.addBcc.step1}
            />
            <FindQRTooltip
              number={'2'}
              text={Dictionary.addDevice.addBcc.step2}
            />
            <FindQRTooltip
              number={'3'}
              text={Dictionary.addDevice.addBcc.step3}
            />
            <FindQRTooltip
              number={'4'}
              text={Dictionary.addDevice.addBcc.step4}
            />
          </View>

          <Button
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

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    selectedD: state.homeOwner.selectedDevice,
    newDeviceInfo: state.homeOwner.newDeviceInfo,
    deviceList: state.homeOwner.deviceList2,
    BCC50macID: state.homeOwner.BCC50macID,
  };
};

const mapDispatchToProps = {
  checkNewDevice,
  addNewDevice,
  setSelectedDevice,
  getPlaceId,
  getLocationSuggestionsBcc,
  newDeviceInfo,
  UPDATE_BCC50MACID,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBccWIFI);
