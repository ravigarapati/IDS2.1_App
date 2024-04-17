import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  FlatList,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CustomText,
  Button,
  CustomInputText,
  CustomPicker,
  CustomAutoCompleteInput,
} from '../components';
import {Colors} from '../styles';
import {validateInputField} from '../utils/Validator';
import Radiobutton from '../components/Radiobutton';
import {Enum} from '../utils/enum';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import {
  updateLocation,
  getLocationByDeviceId,
  editLocationSettings,
  getLocationSuggestionsBcc,
  getPlaceId,
} from '../store/actions/HomeOwnerActions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function Location({
  devices,
  selectedD,
  getLocationByDeviceId,
  editLocationSettings,
  getLocationSuggestionsBcc,
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
  const [showOptions, setShowOptions] = useState(false);

  /*  const [dataDummie, setdataDummie] = useState([
   {}
  ]);*/

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

  useEffect(() => {
    getLocationByDeviceId({
      deviceId: selectedD.macId,
    });
  }, []);

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

  useEffect(() => {
    if (selectedD.location !== undefined) {
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

      //"location": "93428,Cambria,California,USA"

      setAddress({
        ...address,
        zipCode: locationSelected[0],
        // state: stateComplete,
        state: locationSelected[2],
        city: locationSelected[1],
        country: locationSelected[3],
      });
    }
  }, [selectedD]);

  const saveChanges = () => {
    //const acronymState = findState(address.state);
    const acronymState = findState(selectedD.TimeZoneData.Region);
    let strCountry = '';
    if (selectedD.TimeZoneData.Country === 'USA') {
      strCountry = 'United States';
    } else if (selectedD.TimeZoneData.Country === 'CAN') {
      strCountry = 'Canada';
    }
    editLocationSettings(
      {
        city: address.city,
        country: address.country,
        state: acronymState,
        zipcode: address.zipCode,
      },
      selectedD.macId,
      selectedD.TimeZoneData,
      selectedD.TimeZoneZone,
      strCountry,
      acronymState,
    );
    navigation.navigate('BCCDashboard');
  };

  const handleDirection = value => {
    dataDummie2.forEach(data => {
      if (data.Text.toString() === value) {
        getPlaceId(data.PlaceId.toString());
      }
    });
  };
  const printResponse = text => {
    let array = [];
    text.map(data => {
      if (data.PlaceId) {
        array.push(data.Text.toString());
      }
    });
    if (array.length != 0) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    setDataAutoComplete(array);
    setDatadataDummie2(text);
  };

  const getSuggestions = letter => {
    if (letter.length > 4) {
      getLocationSuggestionsBcc(
        letter,
        printResponse,
        address.country === 'United States' ? 'USA' : 'CAN',
      );
    } else {
      setDataAutoComplete(['']);
    }
  };

  return (
    <View style={Styles.locationContainer}>
      {isEdition ? (
        <View style={Styles.locatorContainer}>
          <View style={{alignItems: 'center'}}>
            <Image
              style={Styles.locatorImage}
              source={require('./../assets/images/locatorColored.png')}
            />
            <CustomText
              style={{marginTop: 16}}
              color={Colors.black}
              font={'medium'}
              text={
                'Enter your device installation address to receive accurate weather data'
              }
              align={'center'}
              size={16}
            />

            <ScrollView style={Styles.scrollViewContainer}>
              <View
                style={[
                  {
                    flex: 1,
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  },
                ]}>
                <CustomText
                  size={16}
                  style={{marginTop: 20}}
                  text={'Add Your Device Installation Address'}
                  align={'left'}
                  font={'bold'}
                />
                <CustomText
                  text={'Select your country'}
                  align={'left'}
                  style={{marginTop: 20}}
                />
                <View style={{flexDirection: 'row', marginVertical: 15}}>
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
                      setShowOptions(false);
                      setText('');
                    }}
                    text={'United States'}
                    style={{marginRight: 30}}
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
                      setShowOptions(false);
                      setText('');
                    }}
                    text={'Canada'}
                  />
                </View>
                <CustomAutoCompleteInput
                  accessibilityHintText={'Text field to select your location'}
                  setValue={value => {
                    setText(value);
                    handleDirection(value);
                  }}
                  value={text}
                  data={dataAutoComplete}
                  placeholder="Location"
                  //onSelect={() => }
                  additionalFunction={getSuggestions}
                  showOptions={showOptions}
                />
                <View pointerEvents="none">
                  <CustomInputText
                    autoCapitalize="words"
                    placeholder={
                      address.country === 'United States'
                        ? Dictionary.createProfile.zipcode
                        : Dictionary.addDevice.addBcc.postalCode
                    }
                    value={address.zipCode}
                    maxLength={address.country === 'United States' ? 5 : 7}
                    keyboardType={
                      address.country === 'United States'
                        ? 'numeric'
                        : 'default'
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
                        ? Dictionary.createProfile.zipcodeRequired
                        : ''
                    }
                  />
                  <CustomInputText
                    autoCapitalize="words"
                    placeholder={Dictionary.createProfile.city}
                    value={address.city}
                    onChange={(text: any) => {
                      text = text.replace(/[^a-zA-Z ]/g, '');
                      changeHandler('city', text, Enum.cityPattern);
                    }}
                    isRequiredField={true}
                    errorText={
                      errorData.city
                        ? Dictionary.createProfile.cityRequired
                        : ''
                    }
                  />
                  <CustomInputText
                    autoCapitalize="words"
                    placeholder={
                      address.country === 'United States'
                        ? Dictionary.createProfile.state
                        : Dictionary.addDevice.addBcc.province
                    }
                    value={address.state}
                    isRequiredField={true}
                    errorText={
                      errorData.city
                        ? Dictionary.createProfile.cityRequired
                        : ''
                    }
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              marginHorizontal: 16,
              paddingBottom: 32,
            }}>
            <Button
              /* accessibilityHintText={
                  !wasChanged
                    ? Dictionary.modeSelection.submitDisabledButton
                    : `${Dictionary.Accesories.saveChangesAccesory} ${currentMode}.`
                }*/
              // disabled={!wasChanged}

              text={'Save'}
              type={'primary'}
              onPress={() => {
                saveChanges();
              }}
            />
            <Button
              text={'Cancel'}
              type={'secondary'}
              onPress={() => {
                setIsEdition(false);
              }}
            />
          </View>
        </View>
      ) : (
        <View style={Styles.dataContainer}>
          <View style={{alignContent: 'center', alignItems: 'center'}}>
            <Image
              style={Styles.locatorImage}
              source={require('./../assets/images/locatorColored.png')}
            />
            <CustomText
              style={{width: 344, height: 45, marginTop: 16}}
              color={Colors.black}
              font={'medium'}
              text={
                'Enter your device installation address to receive accurate weather data'
              }
              align={'center'}
              size={16}
            />
          </View>

          <ScrollView
          // keyboardShouldPersistTaps="handled"
          // contentContainerStyle={{flexGrow: 1}}
          >
            <View style={Styles.editLabel}>
              <CustomText
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
                />
                <CustomInputText
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
                />
                <CustomInputText
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
                />
                <CustomInputText
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
    width: '100%',
    marginTop: 32,
    marginBottom: 24,
    height: 48,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 0,
  },
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
