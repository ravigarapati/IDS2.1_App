import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  Image,
  AppState,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import ModalComponent from '../components/ModalComponent';
import {Dictionary} from '../utils/dictionary';
import {PERMISSIONS, request} from 'react-native-permissions';
import {connect, useDispatch} from 'react-redux';
import Clipboard from '@react-native-clipboard/clipboard';
import DeviceAddedWiFi from '../components/DeviceAddedWiFi';
import {Enum} from '../utils/enum';
import {validateInputField} from '../utils/Validator';
import WIFI from './../assets/images/WifiBlue.svg';
import {
  getPlaceId,
  getLSuggestions,
  setisOnboardingBcc50,
  setDeviceNameOnboarding,
  setLocationOnboarding,
  UPDATE_BCC50MACID,
  checkNewDevice,
  resetScheduleOnboarding,
  resetUnitConfiguration,
  setSkipUnitConfigurationOnboarding,
  updateFirmware,
} from '../store/actions/HomeOwnerActions';
import Radiobutton from '../components/Radiobutton';
import NetInfo from '@react-native-community/netinfo';
import {showToast} from '../components/CustomToast';
import {
  CustomText,
  Button,
  CustomInputText,
  BoschIcon,
  CustomAutoCompleteInput,
  CustomPicker,
} from '../components';
import {
  connectTCPAction,
  exitCom,
  calculateDevicePassword,
} from '../store/actions/HomeOwnerActions';
import CodeScanner from '../components/CodeScanner';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {schedules} from '../utils/Schedules';
import {Dimensions} from 'react-native';
import ALERT_UPDATE from './../assets/images/alertupdate.svg';

const SkipSetupBCC50 = ({
  navigation,
  getPlaceId,
  getLSuggestions,
  selectedD,
  UPDATE_BCC50MACID,
  BCC50macID,
  checkNewDevice,
  updateFirmware,
}) => {
  const [wifiInformation, setWifiInformation] = useState({
    ssid: '',
    password: '',
  });
  const [hotSpotInformation, setHotSpotInformation] = useState({
    ssid: '',
    password: '',
  });

  const [MACIDInfo, setMACIDInfo] = useState({
    MacID: '',
    TemporaryVerificationCode: '',
  });
  const [deviceLocation, setDeviceLocation] = useState('');
  const [text, setText] = useState('');
  const showOptions = useRef(false);
  const selectedValue = useRef(true);
  const [siglasUSState, setSiglasUSState] = useState(Enum.stateList);
  const [siglasCanProvince, setSiglasCanProvince] = useState(Enum.provineList);
  const [chaseSuggestion, setChaseSuggestion] = useState(false);
  const [alreadyChosen, setAlreadyChosed] = useState(true);
  const [dataDummie2, setDatadataDummie2] = useState(['']);
  const [dataAutoComplete, setDataAutoComplete] = useState(['']);
  const [placeId, setPlaceId] = useState({});
  const [showUpdateModal, setShowupdateModal] = useState(false);
  const dispatch = useDispatch();
  const [deviceLocationError, setDeviceLocationError] = useState({
    deviceLocation: '',
  });
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

  const printResponse = (text1, letter) => {
    let array = [];
    text1.map(data => {
      array.push(data.Label.toString());
    });
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
  const [address, setAddress] = useState({
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
  });
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
  const changeHandler = (field, value, pattern) => {
    setFormValue(field, value);
    if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }
  };
  const [errorData, setErrorData] = useState({
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });
  const setErrorValue = (field, value) => {
    setErrorData(prevData => ({
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

  const setMACIDInformation = (field, value) => {
    setMACIDInfo(prevData => ({
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
    navigation.getParam('device') === 'BCC50' ? 0 : 0,
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
    //console.log(selectedD,BCC50macID);
  }, [selectedD]);

  return (
    <View style={styles.container}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      {stepCounter === 0 && (
        <View
          testID="ViewOptionScanQr"
          style={{paddingHorizontal: 20, marginTop: 20}}>
          <View
            accessible={true}
            accessibilityLabel={`${Dictionary.addDevice.addBcc.connectPhonebcc50Accessibility}. ${Dictionary.addDevice.addBcc.automaticEntry}. ${Dictionary.addDevice.addBcc.useScanBcc50Accessibility}`}>
            <CustomText
              allowFontScaling={true}
              style={{
                marginTop: 16,
              }}
              text={Dictionary.addDevice.addBcc.connectPhonebcc50}
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
              style={[styles.marginTop10, {textAlign: 'center', fontSize: 15}]}
              text={Dictionary.addDevice.addBcc.connectPhonebcc50Skip}
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
                setStepCounter(8);
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
                MACIDInfo.MacID = values[0];
                MACIDInfo.TemporaryVerificationCode = values[1];
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
                setStepCounter(8);
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
      {stepCounter === 3 && (
        <ScrollView
          testID="ViewLocation"
          keyboardShouldPersistTaps="handled"
          horizontal={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[
              styles.flex1,
              {justifyContent: 'space-between', paddingHorizontal: 20},
            ]}>
            <View>
              <View style={{marginTop: 1}}>
                <CustomInputText
                  allowFontScaling={true}
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
                <CustomInputText
                  allowFontScaling={true}
                  accessibilityLabelText={`Mac id: `}
                  style={styles.grayColor}
                  disabled={true}
                  isRequiredField={true}
                  placeholder={Dictionary.addDevice.addBcc.macId}
                  value={MACIDInfo.MacID.toUpperCase()}
                />
              </View>
              <CustomText
                allowFontScaling={true}
                size={18}
                style={{marginTop: 20, fontSize: 17}}
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
                //setStepCounter(8);
                dispatch(setisOnboardingBcc50(true));
                dispatch(setSkipUnitConfigurationOnboarding(true));
                dispatch(resetUnitConfiguration());
                dispatch(resetScheduleOnboarding(schedules));
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
                let mac = MACIDInfo.MacID + '_MacID';
                UPDATE_BCC50MACID(mac);
                navigation.navigate('Schedule');
              }}
              text={'Next'}
            />
          </View>
        </ScrollView>
      )}
      {stepCounter === 8 && (
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
            <View style={{marginTop: 40}}>
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={`${Dictionary.addDevice.addBcc.connectPhone}.`}
                text={Dictionary.addDevice.addBcc.connectPhone}
                font={'bold'}
                color={Colors.darkGray}
                size={18}
                style={{marginBottom: 16}}
              />
              <CustomText
                allowFontScaling={true}
                text={Dictionary.addDevice.addBcc.manualEntrySkipSetup}
                accessibilityLabelText={`${Dictionary.addDevice.addBcc.qrCodeLocationADASkipSetup}.`}
                newline={true}
                style={{fontSize: 15, marginBottom: 32}}
              />
              <CustomInputText
                allowFontScaling={true}
                accessibilityLabelText={'Device SSID of your BCC50.'}
                accessibilityHintText={'Device SSID of your BCC50.'}
                placeholder={Dictionary.addDevice.addBcc.deviceMacId}
                value={MACIDInfo.MacID}
                maxLength={12}
                onChange={val => {
                  setMACIDInformation('MacID', val);
                }}
              />
              <CustomInputText
                allowFontScaling={true}
                accessibilityLabelText={'Temporary Verification Code.'}
                accessibilityHintText="Temporary Verification Code."
                keyboardType={'numeric'}
                maxLength={4}
                placeholder={
                  Dictionary.addDevice.addBcc.temporaryVerificationCode
                }
                value={MACIDInfo.TemporaryVerificationCode}
                onChange={val => {
                  setMACIDInformation('TemporaryVerificationCode', val);
                }}
              />
            </View>
            <View>
              <Button
                type="primary"
                text={'Next'}
                onPress={() => {
                  //setStepCounter(9);
                  checkNewDevice(
                    {
                      deviceId: MACIDInfo.MacID,
                      code: MACIDInfo.TemporaryVerificationCode,
                      model: 'BCC50',
                    },
                    () => {
                      setStepCounter(3);
                    },
                    error => {
                      const errorCode = error.split(' : ')[0];
                      console.log('errorcode', errorCode);
                      if (errorCode === '201') {
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
                  //setStepCounter(3);
                }}
              />
            </View>
          </View>
        </ScrollView>
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
                updateFirmware(
                  {
                    deviceId: MACIDInfo.MacID,
                    code: MACIDInfo.TemporaryVerificationCode,
                  },
                  () => {
                    setShowupdateModal(true);
                  },
                  () => {
                    setStepCounter(0);
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
                setStepCounter(0);
                //setMacId('');
                //setVerificationCode('');
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
              setStepCounter(3);
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
        blur
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
              text={Dictionary.addDevice.addBcc.qrCodeLocationSkipSetup}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.qrCodeLocationADASkipSetup}.`}
              newline={true}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.stepsToFind}
              accessibilityLabelText={Dictionary.addDevice.addBcc.stepsToFind}
              style={{marginBottom: 6, fontSize: 16, fontWeight: '600'}}
            />

            <View style={{marginBottom: 24}}>
              <FindQRTooltip
                number={'1'}
                text={Dictionary.addDevice.addBcc.step1Skip}
                ADA={Dictionary.addDevice.addBcc.step1SkipADA}
              />
              <FindQRTooltip
                number={'2'}
                text={Dictionary.addDevice.addBcc.step2Skip}
                ADA={Dictionary.addDevice.addBcc.step2SkipADA}
              />
              <FindQRTooltip
                number={'3'}
                text={Dictionary.addDevice.addBcc.step3Skip}
                ADA={Dictionary.addDevice.addBcc.step3SkipADA}
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
  getPlaceId,
  getLSuggestions,
  UPDATE_BCC50MACID,
  checkNewDevice,
  updateFirmware,
};

export default connect(mapStateToProps, mapDispatchToProps)(SkipSetupBCC50);
