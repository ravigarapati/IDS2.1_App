import React, {useState, useEffect} from 'react';
import {CustomText, CustomInputText, Button, CustomPicker} from '../components';
import {Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {StyleSheet, View} from 'react-native';
import * as authActions from '../store/actions/AuthActions';
import {useDispatch, useSelector} from 'react-redux';
import {validateInputField} from '../utils/Validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Radiobutton from '../components/Radiobutton';

export default function ContractorAddAddress() {
  const dispatch = useDispatch();
  const addressFromStore = useSelector(state => state.auth.currentAddress);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: addressFromStore.companyName,
    country: addressFromStore.country,
    address1: addressFromStore.address1,
    address2: addressFromStore.address2,
    city: addressFromStore.city,
    state: addressFromStore.state,
    zipcode: addressFromStore.zipcode,
    phoneNumber: addressFromStore.phoneNumber,
  });
  const [errorData, setErrorData] = useState({
    companyName: addressFromStore.companyName ? '' : null,
    country: '',
    address1: addressFromStore.address1 ? '' : null,
    address2: '',
    city: addressFromStore.city ? '' : null,
    state: addressFromStore.state ? '' : null,
    zipcode: addressFromStore.zipcode ? '' : null,
    phoneNumber: addressFromStore.phoneNumber ? '' : null,
  });
  const [formValid, setFormValid] = useState(false);
  const [termVersion, setTermVersion] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('termsAcceptedVersion').then(value => {
      setTermVersion(value);
    });
  }, []);

  useEffect(() => {
    if (
      errorData.companyName === '' &&
      errorData.country === '' &&
      errorData.address1 === '' &&
      errorData.city === '' &&
      errorData.state === '' &&
      errorData.zipcode === '' &&
      errorData.phoneNumber === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  function setCurrentStepValue(stepNumber) {
    dispatch(authActions.setCurrentStep(stepNumber));
  }

  const checkDetails = () => {
    const {companyName, phoneNumber} = companyDetails;
    dispatch(
      authActions.checkAdminDetails(
        {
          companyName: companyName,
          companyPhoneNumber: phoneNumber,
        },
        setUserAttributes,
      ),
    );
  };

  function setUserAttributes() {
    let user = {
      companyAddress: {
        address1: companyDetails.address1.replace(/[,\s]+$/g, ''),
        address2: companyDetails.address2.replace(/[,\s]+$/g, ''),
        city: companyDetails.city.replace(/[,\s]+$/g, ''),
        //country: companyDetails.country,
        state: companyDetails.state,
        zipCode: companyDetails.zipcode,
      },
      companyName: companyDetails.companyName,
      companyPhoneNumber: companyDetails.phoneNumber,
      termsConditionsVersionId: termVersion,
    };
    dispatch(authActions.updateUserObject(user));
    setCurrentStepValue(3);
  }

  function setFormValue(field, value) {
    setCompanyDetails(prevData => ({
      ...prevData,
      [field]: value,
    }));
    dispatch(authActions.setUserAddress(companyDetails));
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

  return (
    <View style={[styles.flex1]}>
      <CustomInputText
        disableCache={false}
        autoCapitalize="words"
        placeholder={Dictionary.createProfile.companyName}
        value={companyDetails.companyName}
        onChange={(text: any) =>
          changeHandler('companyName', text, Enum.companyNamePattern)
        }
        isRequiredField={true}
        errorText={
          errorData.companyName
            ? Dictionary.createProfile.companyNameRequired
            : ''
        }
      />
      {/* <CustomText
              newline={false}
              text={Dictionary.productRegistration.country}
              size={15}
              align={"left"}
              font={"medium"}
              style={{ paddingHorizontal:5, paddingTop: 20 }}
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
                  companyDetails.country === 'US'
                  //Dictionary.addDevice.addBcc.unitedStates
                }
                handleCheck={() => {
                  setCompanyDetails((prevData) =>({
                    ...prevData,
                    country: 'US',
                    address1: '',
                    address2: '',
                    state: '',
                    city: '',
                    zipcode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address1: null,
                    city: null,
                    state: null,
                    zipcode: null,
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
                  companyDetails.country === 'CA'
                }
                handleCheck={() => {
                  setCompanyDetails((prevData) =>({
                    ...prevData,
                    country: 'CA',
                    address1: '',
                    address2: '',
                    state: '',
                    city: '',
                    zipcode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address1: null,
                    city: null,
                    state: null,
                    zipcode: null,
                  }));
                }}
                text={"Canada"}
              />
            </View> */}

      <CustomInputText
        disableCache={false}
        placeholder={Dictionary.createProfile.address1}
        onChange={val => changeHandler('address1', val, Enum.address1Pattern)}
        value={companyDetails.address1}
        disabled={companyDetails.country == '' ? true : false}
        isRequiredField={true}
        errorText={errorData.address1 ? errorData.address1 : ''}
        autoCapitalize="words"
        prStyle={true}
      />
      <CustomInputText
        disableCache={false}
        placeholder={Dictionary.createProfile.address2}
        onChange={val => changeHandler('address2', val, Enum.address1Pattern)}
        value={companyDetails.address2}
        disabled={companyDetails.country == '' ? true : false}
        isRequiredField={false}
        autoCapitalize="words"
        prStyle={true}
      />
      <CustomInputText
        disableCache={false}
        placeholder={Dictionary.productRegistration.city}
        onChange={val => changeHandler('city', val, Enum.cityPattern)}
        value={companyDetails.city}
        disabled={companyDetails.country == '' ? true : false}
        isRequiredField={true}
        errorText={errorData.city ? errorData.city : ''}
        autoCapitalize="words"
        prStyle={true}
      />
      <CustomPicker
        disableCache={false}
        placeholder={Dictionary.productRegistration.state}
        value={companyDetails.state}
        onChange={(state: any) =>
          changeHandler('state', state.value, Enum.required)
        }
        options={
          companyDetails.country == 'US' ? Enum.stateList : Enum.provincelist
        }
        //iteratorKey="index"
        iteratorLabel="label"
        disabled={companyDetails.country == '' ? true : false}
        isRequiredField={true}
        showFieldLabel={true}
        prStyle={true}
      />
      <CustomInputText
        disableCache={false}
        placeholder={Dictionary.createProfile.zipcode}
        onChange={val =>
          companyDetails.country == 'CA'
            ? changeHandler('zipcode', val, Enum.zipCodePatternCA)
            : changeHandler('zipcode', val, Enum.zipCodePattern)
        }
        value={companyDetails.zipcode}
        disabled={companyDetails.country == '' ? true : false}
        maxLength={
          companyDetails.country == 'CA'
            ? Enum.zipCodePatternCA.length
            : Enum.zipCodePattern.length
        }
        isRequiredField={true}
        errorText={errorData.zipcode ? errorData.zipcode : ''}
        autoCapitalize="characters"
        keyboardType={companyDetails.country == 'US' ? 'numeric' : 'default'}
        prStyle={true}
      />

      <CustomInputText
        disableCache={false}
        autoCapitalize="words"
        placeholder={Dictionary.createProfile.phoneNumber}
        value={companyDetails.phoneNumber}
        delimiterType="phoneNumber"
        maxLength={Enum.phoneNumberPattern.length}
        keyboardType="numeric"
        onChange={(text: any) =>
          changeHandler('phoneNumber', text, Enum.phoneNumberPattern)
        }
        isRequiredField={true}
        errorText={
          errorData.phoneNumber ? Dictionary.error.phoneNumberPatternError : ''
        }
      />
      <View style={[styles.buttonContainer, styles.marginTop10]}>
        <CustomText text={Dictionary.createProfile.pressNext} newline={true} />
        <Button
          type="primary"
          disabled={!formValid}
          text={Dictionary.button.next}
          onPress={() => checkDetails()}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  marginTop10: {marginTop: 10},
  marginTop15: {marginTop: 15},
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
});
