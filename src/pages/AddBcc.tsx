import React, {useEffect, useState, useRef, useMemo} from 'react';
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
import Ping from 'react-native-ping';
import UserAnalytics from '../components/UserAnalytics';
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
  selectBcc,
  setisOnboardingBcc101,
  selectNoSchedule,
  selectNoScheduleOnStore,
  setSkipUnitConfigurationOnboarding,
  updateFirmware,
} from '../store/actions/HomeOwnerActions';
import {
  checkNewDevice,
  addNewDevice,
  getPlaceId,
  getLocationSuggestionsBcc,
  setSelectedDevice,
  newDeviceInfo,
  getLSuggestions,
  setisOnboardingBcc50,
  getDeviceStatus,
  getScheduleList,
  updateSelected,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import Clipboard from '@react-native-clipboard/clipboard';
//import Clipboard from"@react-native-community/clipboard"
import {Colors} from '../styles';
import {connectTCPPromise, exitCommand} from '../utils/HotSpotFunctions';
import BCCDashboardSchedule from './BCCDashboardSchedule';
import BCCDashboardScheduleOnBoarding from './BCCDashboardScheduleOnBoarding';
import ALERT_UPDATE from './../assets/images/alertupdate.svg';

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

const AddBcc = ({
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
  getLSuggestions,
  setisOnboardingBcc50,
  selectBcc,
  setisOnboardingBcc101,
  getDeviceStatus,
  getScheduleList,
  selectNoSchedule,
  updateFirmware,
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
  const [checkConnection, setCheckConnection] = useState(false);
  const [getStates, setGetStates] = useState(false);

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
  const [showUpdateModal, setShowupdateModal] = useState(false);

  const isBcc50Selected = () => {
    return navigation.getParam('device') === 'BCC50';
  };

  const handleDirection = value => {
    setChaseSuggestion(true);
    showOptions.current = false;
    dataDummie2.forEach(data => {
      if (data.Label == value) {
        showOptions.current = false;
        getPlaceId(data, null, true);
      }
    });
  };

  UserAnalytics('bcc_update_firmware');

  const printResponse = (text1, letter) => {
    let array = [];
    text1.map(data => {
      array.push(data.Label.toString());
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
      getLSuggestions(
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
        state: locationSelected[2] === 'undefined' ? '' : locationSelected[2],
        city: locationSelected[1] === 'undefined' ? '' : locationSelected[1],
        country:
          locationSelected[3] === '' ? address.country : locationSelected[3],
      });
    }
  }, [selectedD]);

  useEffect(() => {
    if (getStates) {
      if (wifiInformation.ssid != '' && wifiInformation.ssid != null) {
        connectTCPAction(
          wifiInformation.ssid,
          wifiInformation.password,
          scannedQR,
          confirmStep,
        );
        setWifiInformation({
          ssid: '',
          password: '',
        });
        setHotSpotInformation({
          ssid: '',
          password: '',
        });
        setSkipStatus(false);
        //setCheckConnection(false);
      }
    }
  }, [getStates]);

  useEffect(() => {
    if (isBcc50Selected()) {
      dispatch(setSkipUnitConfigurationOnboarding(false));
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
                if (checkConnection === false) {
                  validateInternet();
                }

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
    //setGetStates(false);
  };

  var vms = '0';

  const validateInternet = () => {
    setCheckConnection(true);
    vms = '0';
    checkingInternetConnection();
    setTimeout(() => {
      /*if (netInfo.isConnected == true && netInfo.isInternetReachable == true) {
        console.log('INTERNET');
      } else {
        console.log('NO INTERNET');
      }*/
      if (vms === '0') {
        setGetStates(true);
        /*  connectTCPAction(
          wifiInformation.ssid,
          wifiInformation.password,
          //scannedQR,
          BCC50macID,
          confirmStep,
        );
        console.log(
          'Calling TCPAction...',
          wifiInformation.ssid,
          wifiInformation.password,
          BCC50macID
        );
        setWifiInformation({
          ssid: '',
          password: '',
        });
        setHotSpotInformation({
          ssid: '',
          password: '',
        });*/
        //setSkipStatus(false);
        // setCheckConnection(false);
      } else {
        setCheckConnection(false);
      }
      setSkipStatus(true);
    }, 1000);
  };

  const checkingInternetConnection = async () => {
    vms = await Ping.start('www.google.com', {timeout: 1000});
  };

  useEffect(() => {
    if (skipStatus === true && stepCounter === 7 && checkConnection == false) {
      /*  connectTCPAction(
        wifiInformation.ssid,
        wifiInformation.password,
        scannedQR,
        confirmStep,
      );
      setWifiInformation({
        ssid: '',
        password: '',
      });
      setHotSpotInformation({
        ssid: '',
        password: '',
      });

      setSkipStatus(false);*/
      validateInternet();
    }
  }, [skipStatus]);

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
    changeHandlerManualEntry('macId', '', Enum.macId);
    changeHandlerManualEntry('tvc', '', Enum.tvc);
    setManualEntryError({
      macId: '',
      tvc: '',
    });
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
      changeHandlerManualEntry('macId', '', Enum.macId);
      changeHandlerManualEntry('tvc', '', Enum.tvc);
      setManualEntryError({
        macId: '',
        tvc: '',
      });
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
    } else if (stepCounter === 8) {
      setStepCounter(3);
    } else if (stepCounter === 9) {
      //setStepCounter(0);
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

  const [updateInfo, setUpdateInfo] = useState(true);

  useEffect(() => {
    if (stepCounter == 8) {
      getScheduleList({
        deviceId: manualEntry.macId,
        unit: `${selectedD.isFahrenheit ? 'F' : 'C'}`,
      });
      getDeviceStatus(
        {
          deviceId: manualEntry.macId,
        },
        response => {
          setUpdateInfo(true);
          updateSelected({...response});
        },
      );
    }
  }, [stepCounter]);

  const RenderSchedulesScreen = useMemo(() => {
    return (
      <BCCDashboardScheduleOnBoarding
        navigation={navigation}
        isFahrenheit={selectedD.isFahrenheit}
        selectedDevice={selectedD}
        schedules={selectedD.schedules}
        createStatusInterval={() => {}}
        setUpdateInfo={setUpdateInfo}
        isOnboardingBcc50={true}
      />
    );
  }, [selectedD.schedules]);

  return (
    <View style={styles.container}>
      <>
        <View style={styles.headerContainer}>
          {isBcc50Selected() && stepCounter === 4 ? null : (
            <View style={styles.headerDivision}>
              <TouchableOpacity
                accessible={true}
                accessibilityHint="Activate to go back to the BCC Dashboard screen."
                accessibilityRole="button"
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
        <View testID="ViewOptionScanQr" style={{paddingHorizontal: 20}}>
          <View
            accessible={true}
            accessibilityLabel={`${
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility
                : Dictionary.addDevice.addBcc.connectPhoneADA
            }. ${Dictionary.addDevice.addBcc.automaticEntry}. ${
              isBcc50Selected()
                ? Dictionary.addDevice.addBcc.useScanBcc50Accessibility
                : Dictionary.addDevice.addBcc.useScanBcc100Accessibility
            }`}>
            <CustomText
              allowFontScaling={true}
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
                  : Dictionary.addDevice.addBcc.connectPhoneADA
              }
            />
            {!isBcc50Selected() ? (
              <CustomText
                allowFontScaling={true}
                style={styles.marginTop32}
                text={Dictionary.addDevice.addBcc.automaticEntry}
                font={'bold'}
              />
            ) : null}
            <CustomText
              allowFontScaling={true}
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
          </View>
          <Button
            testID="ButtonOpenScanQr"
            style={styles.marginTop20}
            type="primary"
            onPress={grantCameraAccess}
            text={Dictionary.addDevice.addBcc.scanQr}
          />
          {isBcc50Selected() ? null : (
            <>
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
            </>
          )}
          {isBcc50Selected() ? null : (
            <>
              <CustomText
                allowFontScaling={true}
                style={styles.marginTop35}
                text="OR"
              />
              <Button
                testID="manualEntryButton"
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
          testID="qrScannerView"
          data={val => {
            if (navigation.getParam('device') !== 'BCC50') {
              const values = val.split('_');
              if (values[0] && values[1]) {
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
                    } else if (errorCode === '205') {
                      console.log('si entra');
                      setManualEntry({macId: values[0], tvc: values[1]});
                      setStepCounter(9);
                    } else {
                      showToast(
                        error.includes(':') ? error.split(' : ')[1] : error,
                        'error',
                      );
                    }
                  },
                );
              } else {
                showToast('Missing required parameters.', 'error');
              }
            } else {
              //validate new device
              const values = val.split('_');
              checkNewDevice(
                {
                  deviceId: values[0],
                  //deviceId:'98d863d2418aaaaaa',
                  code: '0000',
                  model: 'BCC50',
                },
                () => {
                  if ((val.toString().length = 21 && val.includes('_'))) {
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
                    setStepCounter(7);
                  } else {
                    setCancelShowScanner;
                    showToast('Incorrect QR Code', 'error');
                  }
                },
                error => {
                  const errorCode = error.split(' : ')[0];
                  if (errorCode === '201') {
                    setManualEntry({macId: values[0], tvc: ''});
                    setAlreadyRegisteredModal(true);
                  } else if (errorCode === '205') {
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
                    setStepCounter(9);
                  } else {
                    showToast(
                      error.includes(':') ? error.split(' : ')[1] : error,
                      'error',
                    );
                    setStepCounter(0);
                  }
                },
              );
              /* if ((val.toString().length = 21 && val.includes('_'))) {
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
                setStepCounter(7);
              } else {
                setCancelShowScanner;
                showToast('Incorrect QR Code', 'error');
              }*/
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
              <View
                accessible={true}
                accessibilityLabel={`${
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility
                    : Dictionary.addDevice.addBcc.alignPhoneADA
                }. ${Dictionary.addDevice.addBcc.manualEntry} ${
                  isBcc50Selected()
                    ? Dictionary.addDevice.addBcc
                        .manualEntryInstructionBcc50Accessibility
                    : Dictionary.addDevice.addBcc.manualEntryInstructionsADA
                }`}>
                <CustomText
                  allowFontScaling={true}
                  style={
                    isBcc50Selected() ? {marginTop: 16} : styles.marginTop35
                  }
                  text={
                    isBcc50Selected()
                      ? Dictionary.addDevice.addBcc.connectPhonebcc50
                      : Dictionary.addDevice.addBcc.alignPhone
                  }
                  accessibilityLabelText={
                    isBcc50Selected()
                      ? Dictionary.addDevice.addBcc
                          .connectPhonebcc50Accessibility
                      : Dictionary.addDevice.addBcc.alignPhone
                  }
                />
                <CustomText
                  allowFontScaling={true}
                  style={{marginTop: 46}}
                  text={Dictionary.addDevice.addBcc.manualEntry}
                  font="bold"
                />
                <CustomText
                  allowFontScaling={true}
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
              </View>

              {isBcc50Selected() ? (
                <View style={{marginTop: 59}}>
                  <CustomInputText
                    allowFontScaling={true}
                    disableCache={false}
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
                    allowFontScaling={true}
                    disableCache={false}
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
                      showToast('Password was copied to your clipboard.');
                    }}
                    buttonLabel={
                      <CustomText
                        allowFontScaling={true}
                        color={'#00629A'}
                        text={'Copy'}
                      />
                    }
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
                      testID="macIdField"
                      allowFontScaling={true}
                      accessibilityLabelText={
                        'Device MAC ID. Current input: ' + manualEntry.macId
                      }
                      disableCache={false}
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
                      testID="tvcField"
                      allowFontScaling={true}
                      accessibilityLabelText={
                        'Temporary verification code. Current input: ' +
                        manualEntry.tvc
                      }
                      disableCache={false}
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
                testID="submitManualEntry"
                onPress={() => {
                  //unit test purposes
                  //setStepCounter(9);
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
                      console.log(error);
                      const errorCode = error.split(' : ')[0];
                      if (errorCode === '201') {
                        //setManualEntry({macId: values[0], tvc: values[1]});
                        setAlreadyRegisteredModal(true);
                      } else if (errorCode === '205') {
                        setStepCounter(9);
                      } else {
                        showToast(
                          error.includes(':') ? error.split(' : ')[1] : error,
                          'error',
                        );
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
          testID="ViewLocation"
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          horizontal={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[
              styles.flex1,
              {justifyContent: 'space-between', paddingHorizontal: 20},
            ]}>
            <View>
              <View style={{marginTop: 17}}>
                <CustomInputText
                  allowFontScaling={true}
                  accessibilityLabelText={`${Dictionary.addDevice.addBcc.deviceLocation}. Current input: ${deviceLocation}`}
                  testID="DeviceLocationInput"
                  placeholder={Dictionary.addDevice.addBcc.deviceLocation}
                  value={deviceLocation}
                  onChange={val =>
                    changeHandlerDeviceLocation(
                      val.replace(/[^a-zA-Z 0-9]/g, ''),
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
                  maxLength={15}
                />
              </View>
              {isBcc50Selected() ? null : (
                <CustomInputText
                  allowFontScaling={true}
                  accessibilityLabelText={`Mac id: `}
                  style={styles.grayColor}
                  disabled={true}
                  isRequiredField={true}
                  placeholder={Dictionary.addDevice.addBcc.macId}
                  value={manualEntry.macId.toUpperCase()}
                />
              )}

              <CustomText
                allowFontScaling={true}
                size={18}
                style={{marginTop: 20}}
                text={Dictionary.addDevice.addBcc.addDeviceLocation}
                align={'left'}
                font={'bold'}
              />
              <CustomText
                allowFontScaling={true}
                text={Dictionary.addDevice.addBcc.selectCountry}
                align={'left'}
                style={{marginTop: 20}}
              />
              <View style={{flexDirection: 'row', marginVertical: 15}}>
                <Radiobutton
                  testID="UnitedStatesRadioButton"
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
                  testID="CanadaRadioButton"
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
                accessibilityLabelText={`Location. Select one of the location suggestions shown below once you start typing.`}
                testID={'LocationSugestionInput'}
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
                hideOptions={() => {
                  showOptions.current = false;
                }}
              />
              <CustomPicker
                allowFontScaling={true}
                accessibilityLabelText={`State. Current selected: ${address.state}`}
                //disabled={true}
                placeholder={
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? Dictionary.createProfile.state
                    : Dictionary.addDevice.addBcc.province
                }
                value={address.state}
                onChange={(text: any) => {
                  changeHandler(
                    'state',
                    abbrRegion(text.value, 'name'),
                    Enum.required,
                  );
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
                allowFontScaling={true}
                accessibilityLabelText={`City. Current selected: ${address.city}`}
                //disabled={true}
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
                allowFontScaling={true}
                accessibilityLabelText={`${
                  address.country === Dictionary.addDevice.addBcc.unitedStates
                    ? Dictionary.createProfile.zipcode
                    : Dictionary.addDevice.addBcc.postalCode
                }. Current selected: ${address.zipCode}`}
                //disabled={true}
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
                    ? address.country ===
                      Dictionary.addDevice.addBcc.unitedStates
                      ? Dictionary.createProfile.zipcodeRequired
                      : Dictionary.createProfile.postalCodeRequired
                    : ''
                }
              />
            </View>

            <Button
              testID="ButtonConfirmLocationNext"
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
                  dispatch(selectNoScheduleOnStore());
                  dispatch(setDeviceNameOnboarding({name: deviceLocation}));
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
                      //setStepCounter(4);
                      selectBcc(manualEntry.macId);
                      setisOnboardingBcc101(true);
                      setText('');
                      setAddress({
                        country: 'United States',
                        state: '',
                        city: '',
                        zipCode: '',
                      });
                      dispatch(selectNoScheduleOnStore());
                      selectNoSchedule(
                        {
                          deviceId: manualEntry.macId,
                          mode: '1',
                          distr: '1',
                        },
                        () => {
                          setStepCounter(8);
                        },
                      );
                    },
                    error => {
                      showToast(`There was a problem. ${error}.`, 'error');
                    },
                  );
                }
              }}
              text={isBcc50Selected() ? 'Next' : Dictionary.button.proceed}
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
                setisOnboardingBcc50(true);
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
          testID="ViewMakeSureWifi"
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
              allowFontScaling={true}
              font={'regular'}
              text={Dictionary.addDevice.addBcc.phoneConnected}
              style={{marginBottom: 26}}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.setupThermostat}
              font={'regular'}
            />
          </View>
          <View>
            <Button
              testID="NextMakeSureWifi"
              text={'Next'}
              type={'primary'}
              onPress={() => setStepCounter(6)}
            />
            <Button
              testID="SkipMakeSureWifi"
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
          testID="ViewSSID_and_Password"
          style={{
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingTop: 24,
          }}>
          <View>
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.wifiInfo}
              font={'medium'}
              style={{marginBottom: 51}}
            />
            <CustomInputText
              allowFontScaling={true}
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
              allowFontScaling={true}
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
            allowFontScaling={true}
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
            allowFontScaling={true}
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
          <View style={{marginTop: 32}}>
            <TipsList />
          </View>
        </View>
      )}
      {stepCounter === 8 && (
        <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
          {RenderSchedulesScreen}
          <View style={{marginHorizontal: 15}}>
            <Button
              testID="NextSSIDandPassword"
              onPress={() => {
                navigation.navigate('BCCOnboardingAdded');
              }}
              type={'primary'}
              text={Dictionary.button.proceed}
            />
          </View>
        </ScrollView>
      )}
      {stepCounter === 9 && (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            marginHorizontal: 16,
          }}>
          <View style={{width: '100%'}}>
            <View style={{alignItems: 'center', marginVertical: 30}}>
              <ALERT_UPDATE />
            </View>

            <CustomText
              text={Dictionary.addDevice.addBcc.firmwareUpdate.screenTitle}
              font="bold"
              style={{marginBottom: 16}}
              allowFontScaling={true}
              size={16}
            />
            <CustomText
              text={Dictionary.addDevice.addBcc.firmwareUpdate.screenHeader}
              style={{marginBottom: 20}}
              allowFontScaling={true}
              size={16}
            />
            <CustomText
              text={Dictionary.addDevice.addBcc.firmwareUpdate.screenText}
              style={{marginBottom: 50}}
              allowFontScaling={true}
              size={16}
            />
          </View>
          <View>
            <CustomText
              text={Dictionary.addDevice.addBcc.firmwareUpdate.updateToContinue}
              style={{marginBottom: 20}}
              allowFontScaling={true}
              size={16}
            />
            <Button
              testID="updateFirmwareAction"
              type="primary"
              text={'Update'}
              onPress={() => {
                //setShowupdateModal(true);
                updateFirmware(
                  {
                    deviceId: manualEntry.macId,
                    code: manualEntry.tvc,
                  },
                  () => {
                    setShowupdateModal(true);
                  },
                  () => {
                    if (isBcc50Selected()) {
                      setStepCounter(3);
                    } else {
                      setStepCounter(0);
                    }
                  },
                );
              }}
            />
            <Button
              testID="cancelUpdateFirmware"
              type="secondary"
              text={'Cancel'}
              onPress={() => {
                //setStepCounter(0);
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
              }}
            />
          </View>
        </View>
      )}
      <ModalComponent
        modalVisible={showUpdateModal}
        closeModal={() => setShowupdateModal(false)}>
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.modalTitle}
          font="bold"
          style={{marginBottom: 20}}
          allowFontScaling={true}
        />
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.updateQueued}
          allowFontScaling={true}
        />
        <View
          style={{
            backgroundColor: '#D1E4FF',
            width: '100%',
            paddingVertical: 10,
            marginTop: 16,
            marginBottom: 16,
          }}>
          <CustomText
            text={Dictionary.addDevice.addBcc.firmwareUpdate.updateEstimate}
            style={{color: '#008ECF'}}
            allowFontScaling={true}
          />
        </View>
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.updateNotify}
          allowFontScaling={true}
        />

        <View style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.firmwareUpdate.updateOfflineADA
            }
            allowFontScaling={true}
            size={12}
            align="left"
            newline={true}
            text={Dictionary.addDevice.addBcc.firmwareUpdate.updateOffline}
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
        <View style={{width: '100%'}}>
          <Button
            testID="updateButtonInModal"
            text={'Next'}
            type="primary"
            onPress={() => {
              setShowupdateModal(false);
              if (isBcc50Selected()) {
                setStepCounter(7);
              } else {
                setStepCounter(3);
              }
            }}
          />
        </View>
      </ModalComponent>
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
              text={Dictionary.addDevice.addBcc.qrCodeLocation}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.qrCodeLocationADA}.`}
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
                text={Dictionary.addDevice.addBcc.step1}
                ADA={Dictionary.addDevice.addBcc.step1ADA}
              />
              <FindQRTooltip
                number={'2'}
                text={Dictionary.addDevice.addBcc.step2}
                ADA={Dictionary.addDevice.addBcc.step2ADA}
              />
              <FindQRTooltip
                number={'3'}
                text={Dictionary.addDevice.addBcc.step3}
                ADA={Dictionary.addDevice.addBcc.step3ADA}
              />
              <FindQRTooltip
                number={'4'}
                text={Dictionary.addDevice.addBcc.step4}
                ADA={Dictionary.addDevice.addBcc.step4ADA}
              />
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
  tipSection: {
    flexDirection: 'row',
    marginTop: 22,
    marginBottom: 14,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
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
  getLSuggestions,
  setisOnboardingBcc50,
  selectBcc,
  setisOnboardingBcc101,
  getScheduleList,
  getDeviceStatus,
  updateSelected,
  selectNoSchedule,
  updateFirmware,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddBcc);
