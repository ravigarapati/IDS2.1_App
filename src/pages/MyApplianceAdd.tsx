import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  CustomInputText,
  CustomPicker,
  CustomText,
  InfoTooltip,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {validateInputField} from '../utils/Validator';
import {useSelector, useDispatch} from 'react-redux';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import {showToast} from '../components/CustomToast';
import UserAnalytics from '../components/UserAnalytics';
import Radiobutton from '../components/Radiobutton';

export default function MyApplianceAdd(props) {
  const dispatch = useDispatch();
  const deviceListLength = useSelector(
    state => state.homeOwner.deviceList.length,
  );
  const deviceList = useSelector(state => state.homeOwner.deviceList);
  const user = useSelector(state => state.auth.user);
  const [verificationCode, setVerificationCode] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    country: 'US',
    state: '',
    zipCode: '',
  });
  const [errorData, setErrorData] = useState({
    verificationCode: null,
    address1: null,
    address2: '',
    city: null,
    country: '',
    state: null,
    zipCode: null,
  });

  UserAnalytics('ids_my_appliance_add');

  useEffect(() => {
    if (
      errorData.verificationCode === '' &&
      errorData.address1 === '' &&
      errorData.city === '' &&
      errorData.country === '' &&
      errorData.state === '' &&
      errorData.zipCode === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  function setAddressData(key, value) {
    setAddress(prevData => ({
      ...prevData,
      [key]: value,
    }));
  }
  function onChangeVerificationCode(text, pattern) {
    setVerificationCode(text);
    let validation = validateInputField(text, pattern);
    setErrorValue('verificationCode', validation.errorText);
  }
  function addressChangeHandler(key, value, pattern) {
    setAddressData(key, value);
    let validation = validateInputField(value, pattern);
    setErrorValue(key, validation.errorText);
  }

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  const onAddSuccess = () => {
    let addressCommaSeparated = [
      address.address1.replace(/[,\s]+$/g, ''),
      ...(address.address2 !== ''
        ? [address.address2.replace(/[,\s]+$/g, '')]
        : []),
      address.city.replace(/[,\s]+$/g, ''),
      address.state,
      address.zipCode,
    ].join(', ');
    props.navigation.navigate('HomeOwnerRemoteAccess', {
      address: addressCommaSeparated,
      username: user.attributes.name,
      gatewayId: verificationCode,
      navigateTo: 'MyAppliance',
      updateState: true,
    });
    showToast(Dictionary.myAppliance.addSuccess, 'success');
  };
  const addUnit = () => {
    let addressWithoutTrailingComma = {
      address1: address.address1.replace(/[,\s]+$/g, ''),
      address2: address.address2.replace(/[,\s]+$/g, ''),
      city: address.city.replace(/[,\s]+$/g, ''),
      //country: address.country,
      state: address.state,
      zipCode: address.zipCode,
    };
    let oduOrderList = [];
    let maxValue = 0;
    for (let i = 0; i < deviceListLength; i++) {
      let oduName = deviceList[i].ODUName;
      oduName = oduName.replace(/\s+/g, '');
      if (oduName.toLowerCase().search('boschheatpump') === 0) {
        let splitList;
        if (/\d/.test(oduName)) {
          splitList = oduName.match(/\d+/g);
          oduOrderList.push(splitList[0]);
          if (oduOrderList.length > 0) {
            maxValue = Math.max(...oduOrderList);
          }
        } else {
          oduOrderList.push(splitList);
        }
      }
    }

    let data = {
      gatewayId: verificationCode,
      ODUInstalledAddress: addressWithoutTrailingComma,
      ODUName: 'Bosch Heat Pump ' + (maxValue + 1),
    };
    dispatch(HomeOwnerActions.addNewUnit(data, onAddSuccess));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.container]}>
      <View style={[styles.flexRow, styles.spaceBetween, styles.alignCenter]}>
        <CustomText align="left" text={Dictionary.createProfile.addUnit} />
        <InfoTooltip
          positionVertical="bottom"
          text={Dictionary.createProfile.verificationCodeTooltip}
        />
      </View>
      <CustomInputText
        autoCapitalize="characters"
        placeholder={Dictionary.createProfile.enterVerificationCode}
        value={verificationCode}
        onChange={(text: any) =>
          onChangeVerificationCode(text, Enum.serialNumberPattern)
        }
        isRequiredField={true}
        errorText={errorData.verificationCode ? errorData.verificationCode : ''}
        maxLength={26}
        delimiterType="serialNumber"
      />
      <CustomText
        align="left"
        style={styles.marginVertical10}
        text={Dictionary.createProfile.unitInstallationAddress}
      />
      {/* <CustomText
              newline={false}
              text={Dictionary.productRegistration.country}
              size={15}
              align={"left"}
              font={"medium"}
              style={{ paddingHorizontal:5, paddingTop: 0 }}
              />
      <View style={{flexDirection: 'row', marginVertical: 10, paddingHorizontal:5, paddingVertical:10}}> 
              <Radiobutton
                accessibilityLabelText={
                  "United States"
                }
                accessibilityHintText={
                  "Select United States"
                }
                checked={
                  address.country === 'US'
                  //Dictionary.addDevice.addBcc.unitedStates
                }
                handleCheck={() => {
                  setAddress((prevData) =>({
                    ...prevData,
                    country: 'US',
                    address1: '',
                    address2: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address1: null,
                    city: null,
                    state: null,
                    zipCode: null,
                  }));
                }}
                text={'United States'}
                  //Dictionary.addDevice.addBcc.unitedStates}
                style={{marginRight: 30}}
              />
              <Radiobutton
                accessibilityLabelText={
                  'Canada'
                }
                accessibilityHintText={
                  'Select Canada'
                }
                checked={
                  address.country === 'CA'
                }
                handleCheck={() => {
                  setAddress((prevData) =>({
                    ...prevData,
                    country: 'CA',
                    address1: '',
                    address2: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address1: null,
                    city: null,
                    state: null,
                    zipCode: null,
                  }));
                }}
                text={"Canada"}
              />
            </View> */}

            <CustomInputText
              placeholder={
                Dictionary.createProfile.address1
              }
              onChange={(val) => addressChangeHandler('address1', val, Enum.address1Pattern)}
              value={address.address1}
              disabled={address.country == '' ? true : false}
              isRequiredField={true}
              errorText={errorData.address1 ? errorData.address1 : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={
                Dictionary.createProfile.address2
              }
              onChange={(val) => addressChangeHandler('address2', val, Enum.address1Pattern)}
              value={address.address2}
              disabled={address.country == '' ? true : false}
              isRequiredField={false}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.city}
              onChange={(val) => addressChangeHandler('city', val, Enum.cityPattern)}
              value={address.city}
              disabled={address.country == '' ? true : false}
              isRequiredField={true}
              errorText={errorData.city ? errorData.city : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomPicker
              placeholder={Dictionary.productRegistration.state}
              value={address.state}
              onChange={(state: any) =>
                addressChangeHandler('state', state.value, Enum.required)
              }
              options={address.country == 'US' ? Enum.stateList : Enum.provincelist}
              //iteratorKey="index"
              iteratorLabel="label"
              disabled={address.country == '' ? true : false}
              isRequiredField={true}
              showFieldLabel={true}
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.createProfile.zipcode}
              onChange={(val) => 
                address.country=='CA' ? addressChangeHandler('zipCode', val, Enum.zipCodePatternCA) : addressChangeHandler('zipCode', val, Enum.zipCodePattern)}
              value={address.zipCode}
              disabled={address.country == '' ? true : false}
              maxLength={address.country == 'CA' ? Enum.zipCodePatternCA.length : Enum.zipCodePattern.length}
              isRequiredField={true}
              errorText={errorData.zipCode ? errorData.zipCode : ''}
              autoCapitalize="characters"
              keyboardType={address.country == 'US' ? "numeric" : "default"}
              prStyle={true}
            />

      <View style={styles.buttonContainer}>
        <Button
          type="primary"
          disabled={!formValid}
          text={Dictionary.button.save}
          onPress={() => addUnit()}
        />
        <Button
          style={styles.marginVertical10}
          type="secondary"
          text={Dictionary.button.cancel}
          onPress={() => props.navigation.goBack()}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
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
  marginVertical10: {
    marginVertical: 10,
  },
});
