import React, {useState, useEffect, useRef} from 'react';
import {
  CustomText,
  CustomInputText,
  Button,
  InfoTooltip,
  CustomPicker,
} from '../components';
import {Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as authActions from '../store/actions/AuthActions';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch, useSelector} from 'react-redux';
import {validateInputField} from '../utils/Validator';
import DeviceAdded from '../components/DeviceAdded';
import {BoschIcon} from '../components';
import {Icons} from '../utils/icons';
import Radiobutton from '../components/Radiobutton';
import {FlatList, TouchableHighlight} from 'react-native-gesture-handler';
import {newDeviceInfo} from '../store/actions/HomeOwnerActions';
import {connect} from 'react-redux';

const width = Dimensions.get('screen').width;

function HomeOwnerAddAddress(props) {
  const dispatch = useDispatch();
  const addressFromStore = useSelector(state => state.auth.currentAddress);
  const [stepCounter, setStepCounter] = useState(0);
  const [address, setAddress] = useState({
    verificationCode: addressFromStore.verificationCode,
    address1: addressFromStore.address1,
    address2: addressFromStore.address2,
    city: addressFromStore.city,
    country: 'United States',
    state: addressFromStore.state,
    zipcode: addressFromStore.zipcode,
  });
  const [errorData, setErrorData] = useState({
    verificationCode: addressFromStore.verificationCode ? '' : null,
    address1: addressFromStore.address1 ? '' : null,
    address2: '',
    city: addressFromStore.city ? '' : null,
    country: '',
    state: addressFromStore.state ? '' : null,
    zipcode: addressFromStore.zipcode ? '' : null,
  });
  const [formValid, setFormValid] = useState(false);
  const user = useSelector(state => state.auth.user);
  const locationSuggestions = useSelector(
    state => state.homeOwner.locationSuggestions,
  );
  const locationInformation = useSelector(
    state => state.homeOwner.locationInformation,
  );
  const devices = useSelector(state => state.homeOwner.deviceList2);

  const [isChanged, setIsChanged] = useState(true);
  const [location2, setLocation2] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState({});
  const [placeIdInfo, setPlaceIdInfo] = useState({});
  const [HPumpInfo, setHPumpInfo] = useState('');
  const alreadySelected = useRef(false);
  const [loaded, setLoaded] = useState(false);

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

  function getListOfDevices() {
    let listOfDevices = [];
    props.deviceList.map(d => {
      if (d.deviceType.includes('BCC') && !d.paired) {
        d.isChecked = false;
        listOfDevices.push(d);
      }
    });
    return listOfDevices;
  }

  function goToAnotherDevice() {
    let list = getListOfDevices();
    let addressCommaSeparated = [
      address.address1.replace(/[,\s]+$/g, ''),
      ...(address.address2 !== ''
        ? [address.address2.replace(/[,\s]+$/g, '')]
        : []),
      address.city.replace(/[,\s]+$/g, ''),
      address.state,
      address.zipcode,
    ].join(', ');
    props.newDeviceInfo({deviceType: 'IDS', macId: '', newDevice: true});

    dispatch(
      authActions.setUserAddress({
        country: '',
        verificationCode: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
      }),
    );
    setAddress({
      country: '',
      verificationCode: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
    });

    props.navigation.navigate('HomeOwnerRemoteAccessHeatpump', {
      address: addressCommaSeparated,
      username: user.attributes.name,
      gatewayId: address.verificationCode,
      navigateTo: 'addAnotherDevice',
      updateState: false,
    });
    setStepCounter(0)
  }

  useEffect(() => {
    if (
      errorData.verificationCode === '' &&
      errorData.address1 === '' &&
      errorData.city === '' &&
      errorData.state === '' &&
      errorData.zipcode === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (
      locationSuggestions.length > 0 &&
      address.address1.length > 0 &&
      !alreadySelected.current &&
      loaded
    ) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [locationSuggestions]);

  useEffect(() => {
    if (locationInformation.Municipality) {
      let addressAux = locationInformation.Label.split(',');
      let address1 = addressAux[0];
      let zipcode = '';
      setFormValid(true);
      changeHandler(
        'address1',
        address1.length >= 25 ? address1.substring(0, 25) : address1,
        Enum.address1Pattern,
      );
      changeHandler('city', locationInformation.Municipality, Enum.cityPattern);
      changeHandler(
        'state',
        abbrRegion(locationInformation.Region, 'abbr'),
        Enum.required,
      );
      if (
        locationInformation.PostalCode &&
        locationInformation.PostalCode.includes('-')
      ) {
        zipcode = locationInformation.PostalCode.split('-')[0];
      } else {
        zipcode = locationInformation.PostalCode;
      }
      changeHandler(
        'zipcode',
        zipcode,
        address.country === 'United States'
          ? Enum.zipCodePattern
          : Enum.postalCodePattern,
      );
    }
  }, [locationInformation]);

  function setCurrentStepValue(stepNumber) {
    dispatch(authActions.setCurrentStep(stepNumber));
  }
  function setUserAttributes() {
    let user = {
      address: {
        address1: address.address1.replace(/[,\s]+$/g, ''),
        address2: address.address2.replace(/[,\s]+$/g, ''),
        city: address.city.replace(/[,\s]+$/g, ''),
        //country: address.country,
        state: address.state,
        zipCode: address.zipcode,
      },
      gatewayId: address.verificationCode,
    };

    dispatch(authActions.updateUserObject(user));
    addDeviceIDS();

    //setCurrentStepValue(3);
  }

  function deviceAdded() {
    setStepCounter(1);
  }
  function addDeviceIDS() {
    console.log(devices);
    let heatpumpName = 'Heat Pump';
    if (devices !== null && devices !== undefined && devices.length !== 0) {
      let quantity = 0;
      devices.map(d => {
        if (d.deviceType !== undefined && d.deviceType.includes('IDS')) {
          quantity++;
        }
      });
      heatpumpName = `Heat Pump ${quantity + 1}`;
    }
    console.log(heatpumpName);
    setHPumpInfo(heatpumpName);
    let body;
    if (placeIdInfo.TimeZone !== undefined) {
      let timeZoneSelected = placeIdInfo.TimeZone.Name.toString();
      var Moment = require('moment-timezone');
      let stringTimeZone = Moment().tz(timeZoneSelected).format().split('T');
      let stringTimeZoneTime = stringTimeZone[1].toString().substring(0, 8);
      let stringZone = stringTimeZone[1].toString().substring(8).split(':');
      let zone = Number(stringZone[0]);
      body = {
        ODUName: heatpumpName,
        gatewayId: address.verificationCode,
        placeId: placeIdInfo,
        zone: zone.toString(),
        ODUInstalledAddress: {
          address1: address.address1.replace(/[,\s]+$/g, ''),
          address2: address.address2.replace(/[,\s]+$/g, ''),
          city: address.city.replace(/[,\s]+$/g, ''),
          state: address.state,
          zipCode: address.zipcode,
          country: address.country,
        },
      };
    } else {
      body = {
        ODUName: heatpumpName,
        gatewayId: address.verificationCode,
        ODUInstalledAddress: {
          address1: address.address1.replace(/[,\s]+$/g, ''),
          address2: address.address2.replace(/[,\s]+$/g, ''),
          city: address.city.replace(/[,\s]+$/g, ''),
          state: address.state,
          zipCode: address.zipcode,
          country: address.country,
        },
      };
    }

    dispatch(
      HomeOwnerActions.addNewUnitIDSBCC(
        body,
        deviceAdded,
        props.user.attributes.sub,
      ),
    );
  }

  function checkVerificationCode() {
    let gatewayId = address.verificationCode;
    dispatch(HomeOwnerActions.verifyGatewayId(gatewayId, setUserAttributes));
    //setUserAttributes();
  }

  function setFormValue(field, value) {
    setAddress(prevData => ({
      ...prevData,
      [field]: value,
    }));
    dispatch(authActions.setUserAddress(address));
  }

  function changeHandler(field, value, pattern) {
    setFormValue(field, value);
    if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }
  }

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function onBack() {
    dispatch(
      authActions.setUserAddress({
        country: '',
        verificationCode: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
      }),
    );
    setAddress({
      country: '',
      verificationCode: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
    });
    if (stepCounter === 0) {
      if (props.navigation.getParam('addAnother')) {
        props.navigation.navigate('Add', {
          addAnother: true,
          showBackButton: true,
        });
      } else {
        props.navigation.navigate('Add');
      }
    } else {
      setStepCounter(0);
    }
  }

  const handleSelection = item => {
    alreadySelected.current = true;
    setShowSuggestions(false);
    Keyboard.dismiss();
    setIsChanged(false);
    setFormValid(true);
    if (item.Municipality) {
      setPlaceIdInfo(item);
      let addressAux = item.Label.split(',');
      let address1 = addressAux[0];
      let zipcode = '';
      setFormValid(true);
      changeHandler(
        'address1',
        address1.length >= 25 ? address1.substring(0, 25) : address1,
        Enum.address1Pattern,
      );
      changeHandler('city', item.Municipality, Enum.cityPattern);
      changeHandler('state', item.Region, Enum.required);
      if (item.PostalCode && item.PostalCode.includes('-')) {
        zipcode = item.PostalCode.split('-')[0];
      } else {
        zipcode = item.PostalCode;
      }
      changeHandler(
        'zipcode',
        zipcode,
        address.country === 'United States'
          ? Enum.zipCodePattern
          : Enum.postalCodePattern,
      );
    }
    //dispatch(HomeOwnerActions.getPlaceIdInformation(item.PlaceId));
  };

  return (
    <View style={[styles.flex1]}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel="Back."
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

          <View style={styles.headerTitle}>
            <Text
              style={{
                fontSize: 21,
                marginVertical: 8,
              }}>
              {Dictionary.addDevice.addUnit}
            </Text>
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      {stepCounter === 0 && (
        <ScrollView
          style={[styles.container]}
          horizontal={false}
          contentContainerStyle={[
            {justifyContent: 'space-between'},
            styles.flexGrow1,
          ]}>
          <View>
            <View
              style={[
                styles.flexRow,
                styles.spaceBetween,
                styles.alignCenter,
                {marginTop: 32},
              ]}>
              <CustomText
                allowFontScaling={true}
                font="bold"
                align="left"
                text={Dictionary.createProfile.addUnit}
              />
            </View>
            <CustomInputText
              allowFontScaling={true}
              accessibilityLabelText="Verification code"
              accessibilityHintText="Input the verification code provided by your contractor at the time of the unit installation."
              disableCache={false}
              autoCapitalize="characters"
              placeholder={Dictionary.addDevice.addBcc.verificationCode}
              value={address.verificationCode}
              maxLength={26}
              onChange={(text: any) => {
                //text = text.replace(/[^0-9-]/g, '');
                changeHandler(
                  'verificationCode',
                  text,
                  Enum.serialNumberPattern,
                );
              }}
              isRequiredField={true}
              errorText={
                errorData.verificationCode
                  ? Dictionary.createProfile.verificationCodeRequired
                  : ''
              }
              delimiterType="serialNumber"
              tooltip={Dictionary.createProfile.verificationCodeTooltip}
            />
            <CustomText
              allowFontScaling={true}
              align="left"
              font="bold"
              style={{marginTop: 35}}
              text={Dictionary.createProfile.unitInstallationAddress}
            />

            {/*<CustomText
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
                  setShowSuggestions(false);
                  setAddress({
                    verificationCode: address.verificationCode,
                    address1: '',
                    address2: '',
                    country: '',
                    state: '',
                    city: '',
                    zipcode: '',
                  });
                  setFormValid(false);
                  changeHandler(
                    'country',
                    Dictionary.addDevice.addBcc.unitedStates,
                    null,
                  );
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
                checked={address.country === Dictionary.addDevice.addBcc.canada}
                handleCheck={() => {
                  setShowSuggestions(false);
                  setAddress({
                    verificationCode: address.verificationCode,
                    address1: '',
                    address2: '',
                    country: '',
                    state: '',
                    city: '',
                    zipcode: '',
                  });
                  setFormValid(false);
                  changeHandler(
                    'country',
                    Dictionary.addDevice.addBcc.canada,
                    null,
                  );
                  changeHandler('state', '', null);
                }}
                text={Dictionary.addDevice.addBcc.canada}
              />
            </View>*/}

            <CustomInputText
              allowFontScaling={true}
              disableCache={false}
              autoCapitalize="words"
              accessibilityLabelText={`Address 1. Current address selected: ${address.address1} Select one of the location suggestions shown below once you start typing.`}
              placeholder={Dictionary.createProfile.address1}
              value={address.address1}
              maxLength={25}
              onSubmitEditing={() => {
                setShowSuggestions(false);
              }}
              onChange={(text: any) => {
                alreadySelected.current = false;
                changeHandler('address1', text, Enum.address1Pattern);
                let countryCode = '';
                if (address.country == 'United States') {
                  countryCode = 'USA';
                } else {
                  countryCode = 'CAN';
                }
                if (text.length > 2) {
                  dispatch(
                    HomeOwnerActions.getLocationSuggestions({
                      location: text,
                      countryCode: countryCode,
                    }),
                  );
                } else {
                  setShowSuggestions(false);
                }
              }}
              isRequiredField={true}
              errorText={
                errorData.address1
                  ? Dictionary.createProfile.address1Required
                  : ''
              }
            />
            {showSuggestions && (
              <View
                style={[
                  styles.overlay,
                  {
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    marginTop: -10,
                  },
                ]}>
                <ScrollView horizontal={true}>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    keyboardShouldPersistTaps="always"
                    initialNumToRender={4}
                    onEndReachedThreshold={0.5}
                    data={locationSuggestions}
                    renderItem={({item}) => (
                      <TouchableHighlight
                        style={{width: width - 25, marginLeft: -10}}
                        onPressIn={() => {
                          setLocation2(item.Label);
                          setSelectedName(item.Label);
                        }}
                        onPressOut={() => {
                          setSelectedName('');
                          setSelectedSuggestion(item);
                          setIsChanged(false);
                        }}
                        onPress={() => {
                          handleSelection(item);
                        }}>
                        <View style={[styles.suggestionElementView]}>
                          <CustomText
                            allowFontScaling={true}
                            style={[
                              styles.flatListElements,
                              selectedName !== '' && selectedName === item.Label
                                ? {
                                    backgroundColor: 'rgba(0, 73, 117, 1)',
                                    color: 'white',
                                  }
                                : {},
                            ]}
                            text={item.Label}
                            align="left"
                          />
                        </View>
                      </TouchableHighlight>
                    )}
                  />
                </ScrollView>
              </View>
            )}
            <CustomInputText
              allowFontScaling={true}
              accessibilityLabelText={`Address 2. Current address: ${address.address2}`}
              disableCache={false}
              autoCapitalize="words"
              placeholder={Dictionary.createProfile.address2}
              value={address.address2}
              maxLength={25}
              onChange={(text: any) =>
                changeHandler('address2', text, Enum.address2Pattern)
              }
            />
            <CustomInputText
              allowFontScaling={true}
              accessibilityLabelText={`City. Current information: `}
              disableCache={false}
              autoCapitalize="words"
              placeholder={Dictionary.createProfile.city}
              value={address.city}
              maxLength={25}
              onChange={(text: any) =>
                changeHandler('city', text, Enum.cityPattern)
              }
              isRequiredField={true}
              errorText={
                errorData.city ? Dictionary.createProfile.cityRequired : ''
              }
            />
            <CustomPicker
              allowFontScaling={true}
              accessibilityLabelText={`State. Current state: ${address.state}.`}
              placeholder={
                address.country === 'United States'
                  ? Dictionary.createProfile.state
                  : 'Province'
              }
              accessibilityHintText="Activate to open modal to select the state."
              value={address.state}
              onChange={(text: any) => {
                changeHandler('state', text.label, Enum.required);
              }}
              options={
                address.country === 'United States'
                  ? Enum.stateList
                  : Enum.provineList
              }
              iteratorKey="key"
              iteratorLabel="label"
              isRequiredField={true}
              errorText={
                errorData.state ? Dictionary.createProfile.stateRequired : ''
              }
              showFieldLabel={true}
            />
            <CustomInputText
              allowFontScaling={true}
              accessibilityLabelText={`${
                address.country === 'United States'
                  ? Dictionary.createProfile.zipcode
                  : 'Postal Code'
              }. Current value: ${address.zipcode}`}
              disableCache={false}
              autoCapitalize="words"
              placeholder={
                address.country === 'United States'
                  ? Dictionary.createProfile.zipcode
                  : 'Postal Code'
              }
              value={address.zipcode}
              maxLength={address.country === 'United States' ? 5 : 7}
              keyboardType={
                address.country === 'United States' ? 'numeric' : 'default'
              }
              onChange={(text: any) => {
                if (address.country === 'United States') {
                  text = text.replace(/[^0-9]/g, '');
                } else if (address.country === 'Canada' && text[3] !== ' ') {
                  if (text.length === 4) {
                    let auxText = `${text.substring(0, 3)} ${text[3]}`;
                    text = auxText;
                  }
                }

                changeHandler(
                  'zipcode',
                  text,
                  address.country === 'United States'
                    ? Enum.zipCodePattern
                    : Enum.postalCodePattern,
                );
              }}
              isRequiredField={true}
              errorText={
                errorData.zipcode
                  ? address.country === 'United States'
                    ? Dictionary.createProfile.zipcodeRequired
                    : 'Postal Code required'
                  : ''
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              type="primary"
              disabled={
                errorData.verificationCode !== '' ||
                address.address1 === '' ||
                address.city === '' ||
                address.state === '' ||
                address.zipcode === '' ||
                address.zipcode.length < 5
              }
              text={Dictionary.button.submit}
              onPress={() => checkVerificationCode()}
            />
          </View>
        </ScrollView>
      )}
      {stepCounter === 1 && (
        <View style={[styles.flex1, styles.confirmationPageContainer]}>
          <DeviceAdded
            header={HPumpInfo}
            description={Dictionary.addDevice.idsAdded}
            submit={goToAnotherDevice}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingTop: 20,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  marginTop15: {marginTop: 15},
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  flexGrow1: {
    flexGrow: 1,
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
  flatListElements: {
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 14,
    paddingBottom: 14,
  },
  suggestionElementView: {
    width: '100%',
    paddingLeft: 8,
  },
  overlay: {
    width: '100%',
  },
});

const mapStateToProps = state => {
  return {
    deviceList: state.homeOwner.deviceList2,
    user: state.auth.user,
  };
};

const mapDispatchToProps = {
  newDeviceInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeOwnerAddAddress);
