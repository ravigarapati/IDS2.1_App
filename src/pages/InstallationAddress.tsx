import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import {Colors} from '../styles';
import {
  Button,
  CustomInputText,
  CustomSettingsInput,
  CustomPicker,
  CustomText,
} from '../components';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import {
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
  getPlaceIdInformation,
  getLocationSuggestions,
  updateHeatPumpInfoSettings,
} from '../store/actions/HomeOwnerActions';
import {Enum} from '../utils/enum';
import Radiobutton from '../components/Radiobutton';
import {FlatList, TouchableHighlight} from 'react-native-gesture-handler';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch, useSelector} from 'react-redux';

const width = Dimensions.get('screen').width;

const InstallationAddress = ({
  navigation,
  heatPumpInfo,
  reloadHeatPumpInfo,
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
  locationInformation,
  getPlaceIdInformation,
  getLocationSuggestions,
  selectedDevice,
  idsSelectedDevice,
  updateHeatPumpInfoSettings,
}) => {
  const [data, setData] = useState([heatPumpInfo]);
  const [formValues, setFormValues] = useState({
    verificationCode: '',
    city: data[0].city,
    country: 'United States',
    state: data[0].state,
    address1: data[0].address1,
    address2: data[0].address2,
    zipcode: data[0].zipcode,
  });
  const [state, setState] = useState<any>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location2, setLocation2] = useState('');
  const locationSuggestions = useSelector(
    state => state.homeOwner.locationSuggestions,
  );
  const [selectedName, setSelectedName] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState({});
  const [isChanged, setIsChanged] = useState(true);
  const [placeIdInfo, setPlaceIdInfo] = useState({});

  const handleSave = (formValues: any) => {
    //updateHeatPumpInfo(formValues);
    /*updateHeatPumpInfoSettings({
      address1: formValues.address1,
      address2: formValues.address2,
      city: formValues.city,
      state: formValues.state,
      zipcode: formValues.zipcode,
      contractorMonitoringStatus: heatPumpInfo.contractorMonitoringStatus,
      device_id: heatPumpInfo.device_id,
      startDate: heatPumpInfo.startDate ? heatPumpInfo.startDate : '',
    });*/
    updateHeatPumpInfo({
      ...formValues,
      deviceId: idsSelectedDevice,
      contractorMonitoringStatus: heatPumpInfo.contractorMonitoringStatus,
      placeId: placeIdInfo,
    });
    //handleReloadHeatPumpInfo();

    navigation.goBack();
  };

  const handleValues = (
    formValues: any,
    setFormValues: any,
    newValue: any,
    typeValue: string,
  ) => {
    typeValue === 'adress1'
      ? setFormValues({
          ...formValues,
          address1: newValue,
        })
      : typeValue === 'adress2'
      ? setFormValues({
          ...formValues,
          address2: newValue,
        })
      : typeValue === 'city'
      ? setFormValues({
          ...formValues,
          city: newValue,
        })
      : typeValue === 'state'
      ? setFormValues({
          ...formValues,
          //state: JSON.stringify(newValue.label).toString().replace(/"/g, ''),
          state: newValue,
        })
      : typeValue === 'zipcode'
      ? setFormValues({
          ...formValues,
          zipcode: newValue,
        })
      : null;
  };

  useEffect(() => {
    console.log('heatpumpinfo', heatPumpInfo);
  }, []);

  useEffect(() => {
    if (locationInformation.Municipality) {
      let addressAux = locationInformation.Label.split(',');
      let address1 = addressAux[0];
      let zipcode = '';
      if (
        locationInformation.PostalCode &&
        locationInformation.PostalCode.includes('-')
      ) {
        zipcode = locationInformation.PostalCode.split('-')[0];
      } else {
        zipcode = locationInformation.PostalCode;
      }
      setFormValues({
        ...formValues,
        city: locationInformation.Municipality,
        zipcode: zipcode,
        state: locationInformation.Region,
        address1: address1.length >= 25 ? address1.substring(0, 25) : address1,
        address2: '',
      });
      //handleValues(
      //  formValues,
      //  setFormValues,
      //  locationInformation.PostalCode,
      //  'zipcode',
      //);
      //handleValues(
      //  formValues,
      //  setFormValues,
      //  locationInformation.Municipality,
      //  'city',
      //);
      //handleValues(
      //  formValues,
      //  setFormValues,
      //  locationInformation.Region,
      //  'state',
      //);
    }
  }, [locationInformation]);

  const handleSelection = item => {
    setShowSuggestions(false);
    Keyboard.dismiss();
    setIsChanged(false);
    if (item.Municipality) {
      console.log('location information', item);
      setPlaceIdInfo(item);
      let addressAux = item.Label.split(',');
      let address1 = addressAux[0];
      let zipcode = '';
      if (item.PostalCode && item.PostalCode.includes('-')) {
        zipcode = item.PostalCode.split('-')[0];
      } else {
        zipcode = item.PostalCode;
      }
      setFormValues({
        ...formValues,
        city: item.Municipality,
        zipcode: zipcode,
        state: item.Region,
        address1: address1.length >= 25 ? address1.substring(0, 25) : address1,
        address2: '',
      });
    }
  };

  return (
    <ScrollView
      horizontal={false}
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}>
      <View>
        {/*<View style={{flexDirection: 'row', marginVertical: 15, margin: 16}}>
          <Radiobutton
            accessibilityLabelText={Dictionary.addDevice.addBcc.unitedStates}
            accessibilityHintText={
              Dictionary.addDevice.addBcc.unitedStatesAccessibility
            }
            checked={
              formValues.country === Dictionary.addDevice.addBcc.unitedStates
            }
            handleCheck={() => {
              setShowSuggestions(false);
              setFormValues({
                verificationCode: '',
                address1: '',
                address2: '',
                country: Dictionary.addDevice.addBcc.unitedStates,
                state: '',
                city: '',
                zipcode: '',
              });
              //changeHandler(
              //  'country',
              //  Dictionary.addDevice.addBcc.unitedStates,
              //  null,
              //);
              //changeHandler('state', '', null);
            }}
            text={Dictionary.addDevice.addBcc.unitedStates}
            style={{marginRight: 30}}
          />
          <Radiobutton
            accessibilityLabelText={Dictionary.addDevice.addBcc.canada}
            accessibilityHintText={
              Dictionary.addDevice.addBcc.canadaAccessibility
            }
            checked={formValues.country === Dictionary.addDevice.addBcc.canada}
            handleCheck={() => {
              setShowSuggestions(false);
              setFormValues({
                verificationCode: '',
                address1: '',
                address2: '',
                country: Dictionary.addDevice.addBcc.canada,
                state: '',
                city: '',
                zipcode: '',
              });
              //changeHandler(
              //  'country',
              //  Dictionary.addDevice.addBcc.canada,
              //  null,
              //);
              //changeHandler('state', '', null);
            }}
            text={Dictionary.addDevice.addBcc.canada}
          />
        </View>*/}
        <View style={styles.inputsView}>
          <CustomInputText
            autoCapitalize="words"
            placeholder={Dictionary.createProfile.address1}
            value={formValues.address1 ? formValues.address1 : ''}
            maxLength={25}
            onSubmitEditing={() => {
              setShowSuggestions(false);
            }}
            onChange={(text: any) => {
              if (text.length > 0) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }

              handleValues(formValues, setFormValues, text, 'adress1');
              let countryCode = '';
              if (formValues.country == 'United States') {
                countryCode = 'USA';
              } else {
                countryCode = 'CAN';
              }

              getLocationSuggestions({
                location: formValues.address1,
                countryCode: countryCode,
              });
            }}
            isRequiredField={true}
          />
          {showSuggestions && locationSuggestions.length != 0 && (
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
            placeholder={Dictionary.installationAddress.address2}
            value={formValues.address2 ? formValues.address2 : ''}
            autoCapitalize="words"
            onChange={(text: any) => {
              handleValues(formValues, setFormValues, text, 'adress2');
            }}
          />
          <CustomInputText
            placeholder={Dictionary.installationAddress.city}
            value={formValues.city ? formValues.city : ''}
            autoCapitalize="words"
            onChange={(text: any) => {
              handleValues(formValues, setFormValues, text, 'city');
            }}
            isRequiredField={true}
          />
          <CustomPicker
            placeholder={Dictionary.installationAddress.state}
            value={formValues.state ? formValues.state : ''}
            onChange={(text: any) => {
              handleValues(formValues, setFormValues, text.label, 'state');
            }}
            options={Enum.stateList}
            iteratorKey="key"
            iteratorLabel="label"
            isRequiredField={true}
            showFieldLabel={true}
          />
          <CustomInputText
            placeholder={Dictionary.installationAddress.zipCode}
            value={formValues.zipcode ? formValues.zipcode : ''}
            autoCapitalize="words"
            onChange={(text: any) => {
              handleValues(formValues, setFormValues, text, 'zipcode');
            }}
            isRequiredField={true}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          text={Dictionary.installationAddress.save}
          type="primary"
          onPress={() => handleSave(formValues)}
          disabled={
            formValues.address1.length == 0 ||
            formValues.state.length == 0 ||
            formValues.city.length == 0 ||
            formValues.zipcode.length < 5
          }
        />
        <Button
          text={Dictionary.installationAddress.cancel}
          type="secondary"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
};

const mapStateToProps = state => {
  return {
    heatPumpInfo: state.homeOwner.heatPumpInfo,
    reloadHeatPumpInfo: state.homeOwner.reloadHeatPumpInfo,
    locationInformation: state.homeOwner.locationInformation,
    selectedDevice: state.homeOwner.selectedDevice,
    idsSelectedDevice: state.homeOwner.idsSelectedDevice,
  };
};

const mapDispatchToProps = {
  updateHeatPumpInfo,
  handleReloadHeatPumpInfo,
  getPlaceIdInformation,
  getLocationSuggestions,
  updateHeatPumpInfoSettings,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstallationAddress);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inputsView: {
    paddingHorizontal: 15,
  },
  buttons: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
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
