import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  FlatList,
  Text,
  AccessibilityActionEvent,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  CustomText,
  Button,
  CustomInputText,
  CustomPicker,
  CustomAutoCompleteInput,
  BoschIcon,
} from '../components';
import {Colors} from '../styles';
import {validateInputField} from '../utils/Validator';
import Radiobutton from '../components/Radiobutton';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import LOCATION_SETTINGS from '../assets/images/LocationSettings.svg';
import {
  updateLocation,
  getLocationByDeviceId,
  editLocationSettings,
  getLocationSuggestionsBcc,
  getLSuggestions,
  getPlaceId,
} from '../store/actions/HomeOwnerActions';
import {Icons} from '../utils/icons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Location({
  devices,
  selectedD,
  getLocationByDeviceId,
  editLocationSettings,
  getLocationSuggestionsBcc,
  getLSuggestions,
  navigation,
  getPlaceId,
}) {
  const [wasChanged, setWasChanged] = useState(false);
  const [text, setText] = useState('');
  const [cities, setCities] = useState(Enum.citiesStatesAndCountries);
  const [isEdition, setIsEdition] = useState(false);
  const [deviceLocation, setDeviceLocation] = useState('');
  const [deviceLocationError, setDeviceLocationError] = useState({
    deviceLocation: '',
  });
  const [selectDevice, setSelectDevice] = useState({});
  const [siglasUSState, setSiglasUSState] = useState(Enum.stateList);
  const [siglasCanProvince, setSiglasCanProvince] = useState(Enum.provineList);
  const [dataAutoComplete, setDataAutoComplete] = useState(['']);
  const [dataDummie, setdataDummie] = useState([]);
  const [itemSelected, setitemSelected] = '';
  const [dataDummie2, setDatadataDummie2] = useState(['']);
  const [loadInfo, setLoadInfo] = useState(true);
  const [TimeZoneData, setTimeZoneData] = useState({});
  const [TimeZone, setTimeZone] = useState();
  const showOptions = useRef(false);
  const selectedValue = useRef(true);
  const [chageSuggestion, setChaseSuggestion] = useState(false);
  const [placeId, setPlaceId] = useState({});
  const [addressAux, setAddressAux] = useState({
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
  });

  const [address, setAddress] = useState({
    country: 'United States',
    state: '',
    city: '',
    zipCode: '',
  });
  const [errorData, setErrorData] = useState({
    country: '',
    state: '',
    city: '',
    zipCode: '',
  });

  const [manualEntry, setManualEntry] = useState({
    macId: '',
    tvc: '',
  });

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

  const setFormValue = (field, value) => {
    setAddress(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const findState = state => {
    let stateComplete = '';
    let acronymState = [{}];

    if (address.country === 'United States') {
      acronymState = siglasUSState;
    } else {
      acronymState = siglasCanProvince;
    }
    acronymState.forEach(val => {
      if (val.label === state) {
        stateComplete = val.value;
      }
    });
    return stateComplete;
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

  useEffect(() => {
    if (selectedD.location !== undefined && loadInfo) {
      setLoadInfo(false);
      const locationSelected = selectedD.location.toString().split(',');
      let stateComplete = '';
      let acronymState = [{}];
      if (locationSelected[3] === 'United States') {
        acronymState = siglasUSState;
      } else {
        acronymState = siglasCanProvince;
      }
      acronymState.forEach(val => {
        if (val.value === locationSelected[2]) {
          stateComplete = val.label;
        }
      });

      //"location": "93428,Cambria,California,USA"
      console.log('locationSelected', locationSelected);
      setAddress({
        ...address,
        zipCode:
          locationSelected[3] === 'United States'
            ? locationSelected[0].length > 5
              ? locationSelected[0].substring(0, 5)
              : locationSelected[0]
            : locationSelected[0],
        // state: stateComplete,
        state: locationSelected[2],
        city: locationSelected[1],
        country: locationSelected[3],
      });
      setAddressAux({
        ...address,
        zipCode:
          locationSelected[3] === 'United States'
            ? locationSelected[0].length > 5
              ? locationSelected[0].substring(0, 5)
              : locationSelected[0]
            : locationSelected[0],
        // state: stateComplete,
        state: locationSelected[2],
        city: locationSelected[1],
        country: locationSelected[3],
      });
    }
  }, [selectedD]);

  const saveChanges = () => {
    //const acronymState = findState(address.state);
    /*const acronymState = findState(TimeZoneData.Region);
    let strCountry = '';
    if (TimeZoneData.Country === 'USA') {
      strCountry = 'United States';
    } else if (TimeZoneData.Country === 'CAN') {
      strCountry = 'Canada';
    }*/
    console.log('address', address.city);
    editLocationSettings(
      {
        city: address.city,
        country: address.country,
        state: address.state,
        zipcode: address.zipCode,
      },
      selectedD.macId,
      TimeZoneData,
      address.country,
      address.state,
    );
    navigation.navigate('BCCDashboard');
  };

  const handleDirection = value => {
    setChaseSuggestion(true);
    dataDummie2.forEach(data => {
      if (data && data.Label === value) {
        showOptions.current = false;
        getPlaceId(data, null, true);
        setTimeZoneData(data);
      }
    });
  };

  useEffect(() => {
    if (chageSuggestion) {
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

  const printResponse = (text1, letter) => {
    let array = [];
    if (text1.length === 0) {
      showOptions.current = false;
    }
    text1.map(data => {
      array.push(data.Label);
    });
    setDataAutoComplete(array);
    setDatadataDummie2(text1);
  };

  const getSuggestions = letter => {
    if (letter.length > 2) {
      showOptions.current = true;
      getLSuggestions(
        letter,
        printResponse,
        address.country === 'United States' ? 'USA' : 'CAN',
        () => {
          showOptions.current = false;
        },
      );
    } else {
      setDataAutoComplete(['']);
      showOptions.current = false;
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View style={Styles.locationContainer}>
      <View style={Styles.headerContainer}>
        <View style={Styles.headerDivision}>
          <TouchableOpacity
            style={Styles.headerBackButton}
            onPress={() => {
              onBack();
            }}>
            <BoschIcon
              name={Icons.backLeft}
              size={24}
              style={Styles.marginHorizontal10}
            />
          </TouchableOpacity>
        </View>

        <View style={Styles.headerTitle}>
          <CustomText
            text={'Location'}
            size={21}
            allowFontScaling={true}
            font="medium"
          />
        </View>
      </View>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      {isEdition ? (
        <View style={Styles.locatorContainer}>
          <View style={{alignItems: 'center'}}>
            <LOCATION_SETTINGS fill="#000" testID="ImageEdit" />
            <CustomText
              allowFontScaling={true}
              style={{marginTop: 16}}
              color={Colors.black}
              font={'regular'}
              text={
                'Enter your device installation address\nto receive accurate weather data'
              }
              align={'center'}
            />
          </View>
          <ScrollView style={{paddingHorizontal: 16}}>
            <CustomText
              allowFontScaling={true}
              size={16}
              style={{marginTop: 20, marginBottom: 30}}
              text={'Add Your Device Installation Address'}
              align={'left'}
              font={'bold'}
            />
            <CustomText
              allowFontScaling={true}
              text={'Select your country'}
              align={'left'}
              style={{marginTop: 20}}
            />
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 15,
              }}>
              <Radiobutton
                accessibilityLabelText={'United States'}
                accessibilityHintText={
                  'Press it to select United States as the country where the thermostat will be installed'
                }
                checked={address.country === 'United States'}
                handleCheck={() => {
                  setAddress({
                    country: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  });
                  changeHandler('country', 'United States', null);
                  changeHandler('state', '', null);
                  showOptions.current = false;
                  setText('');
                  setText('');
                }}
                text={'United States'}
                style={{marginRight: 30}}
                testID="RadioButtonUSA"
              />
              <Radiobutton
                accessibilityLabelText={'Canada'}
                accessibilityHintText={
                  'Press it to select Canada as the country where the thermostat will be installed'
                }
                checked={address.country === 'Canada'}
                handleCheck={() => {
                  setAddress({
                    country: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  });
                  changeHandler('country', 'Canada', null);
                  changeHandler('state', '', null);
                  showOptions.current = false;
                  setText('');
                  setText('');
                }}
                text={'Canada'}
                testID="radioCanada"
              />
            </View>
            <CustomAutoCompleteInput
              accessibilityHintText={
                "Text field to select your location, once you start typing you'll need to select one of the suggestions shown below."
              }
              setValue={value => {
                setText(value);
                setLoadInfo(false);
                handleDirection(value);
                showOptions.current = false;
                selectedValue.current = false;
              }}
              value={text}
              data={dataAutoComplete}
              placeholder="Location"
              //onSelect={() => }
              additionalFunction={getSuggestions}
              showOptions={showOptions.current}
              // testID='txtCompleteLocation'
              data-testid="txtCompleteLocation"
              hideOptions={() => {
                showOptions.current = false;
              }}
            />
            <View>
              <CustomInputText
                allowFontScaling={true}
                //disabled={true}
                autoCapitalize="words"
                placeholder={
                  address.country === 'United States'
                    ? Dictionary.createProfile.zipcode
                    : Dictionary.addDevice.addBcc.postalCode
                }
                value={address.zipCode}
                maxLength={address.country === 'United States' ? 5 : 7}
                keyboardType={
                  address.country === 'United States' ? 'numeric' : 'default'
                }
                onChange={(text: any) => {
                  if (address.country === 'United States') {
                    text = text.replace(/[^0-9]/g, '');
                  }

                  changeHandler(
                    'zipCode',
                    text,
                    address.country === 'United States'
                      ? Enum.zipCodePattern
                      : Enum.postalCodePattern,
                  );
                }}
                isRequiredField={true}
                delimiterType="postalCode"
                errorText={
                  errorData.zipCode
                    ? address.country === 'United States'
                      ? Dictionary.createProfile.zipcodeRequired
                      : Dictionary.createProfile.postalCodeRequired
                    : ''
                }
                testID="txtZipCodeEdit"
              />
              <CustomInputText
                allowFontScaling={true}
                testID="txtCityEdit"
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
              {/*<CustomInputText
                autoCapitalize="words"
                placeholder={
                  address.country === 'United States'
                    ? Dictionary.createProfile.state
                    : Dictionary.addDevice.addBcc.province
                }
                value={address.state}
                isRequiredField={true}
                errorText={
                  errorData.city ? Dictionary.createProfile.cityRequired : ''
                }
              />*/}
              <CustomPicker
                allowFontScaling={true}
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
            </View>
            <View
              style={{
                paddingBottom: 32,
                marginTop: 41,
              }}>
              <Button
                /* accessibilityHintText={
                  !wasChanged
                    ? Dictionary.modeSelection.submitDisabledButton
                    : `${Dictionary.Accesories.saveChangesAccesory} ${currentMode}.`
                }*/
                disabled={
                  address.state === '' ||
                  address.city === '' ||
                  address.country === '' ||
                  address.zipCode === '' ||
                  errorData.city !== '' ||
                  errorData.country !== '' ||
                  errorData.state !== '' ||
                  errorData.zipCode !== ''
                }
                text={'Save'}
                type={'primary'}
                onPress={() => {
                  saveChanges();
                }}
                testID="SaveChanges"
              />
              <Button
                text={'Cancel'}
                type={'secondary'}
                onPress={() => {
                  setIsEdition(false);
                  console.log('asdas', addressAux);
                  setAddress({
                    zipCode: addressAux.zipCode,
                    // state: stateComplete,
                    state: addressAux.state,
                    city: addressAux.city,
                    country: addressAux.country,
                  });
                }}
                testID="Cancel"
              />
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={Styles.dataContainer}>
          <View style={{alignContent: 'center', alignItems: 'center'}}>
            <LOCATION_SETTINGS fill="#000" />
            <CustomText
              allowFontScaling={true}
              style={{marginTop: 16}}
              color={Colors.black}
              text={
                'Enter your device installation address\nto receive accurate weather data'
              }
              align={'center'}
              font="regular"
            />
          </View>

          <ScrollView
          // keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{flexGrow: 1}}
          >
            <View
              style={Styles.editLabel}
              accessible={true}
              accessibilityLabel="Installation Address."
              accessibilityHint="Find the current location information below, or activate to update the location."
              accessibilityActions={[{name: 'activate'}]}
              onAccessibilityAction={(event: AccessibilityActionEvent) => {
                switch (event.nativeEvent.actionName) {
                  case 'activate':
                    setIsEdition(true);
                    break;
                }
              }}>
              <CustomText
                allowFontScaling={true}
                size={16}
                style={{
                  textAlignVertical: 'center',
                  paddingLeft: 17,
                }}
                text={'Installation Address'}
                align={'left'}
                font={'medium'}
              />
              <Pressable
                style={{marginRight: 27, alignSelf: 'center'}}
                onPress={() => {
                  setIsEdition(true);
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 17.07,
                  }}
                  source={require('./../assets/images/editLocation.png')}
                  testID="EditionPressable"
                />
              </Pressable>
            </View>
            <View
              style={[
                Styles.flex1,
                {justifyContent: 'space-between', paddingHorizontal: 20},
              ]}>
              <View pointerEvents="none">
                <CustomInputText
                  allowFontScaling={true}
                  autoCapitalize="words"
                  placeholder={Dictionary.editProfile.country}
                  value={address.country}
                  onChange={(text: any) => {
                    text = text.replace(/[^a-zA-Z ]/g, '');
                    changeHandler('city', text, Enum.cityPattern);
                  }}
                  isRequiredField={false}
                  errorText={
                    errorData.city ? Dictionary.createProfile.cityRequired : ''
                  }
                  //disabled={true}
                  testID="txtCountry"
                />
                <CustomInputText
                  allowFontScaling={true}
                  autoCapitalize="words"
                  placeholder={
                    address.country === 'United States'
                      ? Dictionary.createProfile.state
                      : Dictionary.addDevice.addBcc.province
                  }
                  value={address.state}
                  onChange={(text: any) => {
                    text = text.replace(/[^a-zA-Z ]/g, '');
                    changeHandler('city', text, Enum.cityPattern);
                  }}
                  isRequiredField={false}
                  // disabled={true}
                  errorText={
                    errorData.city ? Dictionary.createProfile.cityRequired : ''
                  }
                  testID="txtState"
                />
                <CustomInputText
                  allowFontScaling={true}
                  autoCapitalize="words"
                  placeholder={Dictionary.createProfile.city}
                  value={address.city}
                  onChange={(text: any) => {
                    text = text.replace(/[^a-zA-Z ]/g, '');
                    changeHandler('city', text, Enum.cityPattern);
                  }}
                  isRequiredField={false}
                  errorText={
                    errorData.city ? Dictionary.createProfile.cityRequired : ''
                  }
                  testID="txtCity"
                />
                <CustomInputText
                  allowFontScaling={true}
                  testID="txtZipCode"
                  autoCapitalize="words"
                  placeholder={
                    address.country === 'United States'
                      ? Dictionary.createProfile.zipcode
                      : Dictionary.addDevice.addBcc.postalCode
                  }
                  value={address.zipCode}
                  maxLength={address.country === 'United States' ? 5 : 7}
                  keyboardType="numeric"
                  onChange={(text: any) => {
                    if (address.country === 'United States') {
                      text = text.replace(/[^0-9]/g, '');
                    }

                    changeHandler(
                      'zipCode',
                      text,
                      address.country === 'United States'
                        ? Enum.zipCodePattern
                        : Enum.postalCodePattern,
                    );
                  }}
                  isRequiredField={false}
                  delimiterType="postalCode"
                  errorText={
                    errorData.zipCode
                      ? Dictionary.createProfile.zipcodeRequired
                      : ''
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
const Styles = StyleSheet.create({
  locationContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  locatorImage: {
    width: 49.44,
    height: 76,
  },
  locatorContainer: {
    marginTop: 24,
    //alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  dataContainer: {
    marginTop: 24,
    //alignItems: 'center',
    flex: 1,
  },
  radioContainer: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
    paddingLeft: 13,
    alignSelf: 'flex-start',
    paddingTop: 22,
  },
  flex1: {
    flex: 1,
    //backgroundColor:'red'
  },
  grayColor: {
    color: 'rgba(213,213,213,1)',
  },
  scrollViewContainer: {
    width: '100%',
  },
  editLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 32,
    marginBottom: 24,
    height: 48,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 0,
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 7,
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
  marginHorizontal10: {marginHorizontal: 10},
});

const mapStateToProps = state => {
  return {
    devices: state.homeOwner.deviceList2,
    selectedD: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  updateLocation,
  getLocationByDeviceId,
  editLocationSettings,
  getLocationSuggestionsBcc,
  getPlaceId,
  getLSuggestions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
