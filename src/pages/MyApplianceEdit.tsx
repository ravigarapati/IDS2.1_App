import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  CustomInputText,
  CustomPicker,
  CustomText,
  InfoTooltip,
  ToggleButton,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {validateInputField} from '../utils/Validator';
import * as HomeOwnerActions from '../store/actions/HomeOwnerActions';
import {useDispatch} from 'react-redux';
import UserAnalytics from '../components/UserAnalytics';
import Radiobutton from '../components/Radiobutton';

export default function MyApplianceEdit(props) {
  const dispatch = useDispatch();
  const data = props.navigation.getParam('data');
  const namesList = props.navigation.getParam('namesList');
  const [unitName, setUnitName] = useState(data.deviceName);
  const [contractorMonitoringStatus, setContractorMonitoringStatus] = useState(
    data.contractorMonitoringStatus ? 1 : 0,
  );
  const [address, setAddress] = useState({
    address1: data.oduInstallationAddress.address.address1,
    address2: data.oduInstallationAddress.address.address2,
    city: data.oduInstallationAddress.address.city,
    country: data.oduInstallationAddress.address.country ? data.oduInstallationAddress.address.country : 'US',
    state: data.oduInstallationAddress.address.state,
    zipCode: data.oduInstallationAddress.address.zipCode,
  });
  const [errorData, setErrorData] = useState({
    unitName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [formValid, setFormValid] = useState(false);

  UserAnalytics('ids_my_appliance_edit');

  useEffect(() => {
    checkNameState()
    if (
      errorData.unitName === '' &&
      errorData.address1 === '' &&
      errorData.city === '' &&
      errorData.state === '' &&
      errorData.zipCode === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  useEffect(() => {
    if (namesList.trim() !== unitName.trim()) {
      if (namesList.includes(unitName.trim())) {
        setErrorValue('unitName', Dictionary.error.nameExists);
      }
    }
  }, [data.deviceName, namesList, unitName]);

  const checkNameState = () =>{
    let newState = ''
    let array = (address.country == 'US'||address.country == 'United States') ? Enum.stateList : Enum.provincelist
    if(address.state.length>2)
    {
      newState = (array.find((item)=>item.label==address.state))?.value
      setAddress({
        address1: data.oduInstallationAddress.address.address1,
        address2: data.oduInstallationAddress.address.address2,
        city: data.oduInstallationAddress.address.city,
        country: data.oduInstallationAddress.address.country ? data.oduInstallationAddress.address.country : 'US',
        state: newState,
        zipCode: data.oduInstallationAddress.address.zipCode,
      })
    }
  }

  function setAddressData(key, value) {
    setAddress(prevData => ({
      ...prevData,
      [key]: value,
    }));
  }
  function nameChangeHandler(value, pattern) {
    const name = value && value.replace(/\s\s+/g, ' ');
    setUnitName(name);
    let validation = validateInputField(name, pattern);
    setErrorValue('unitName', validation.errorText);
  }
  function permissionChangeHandler(value) {
    setContractorMonitoringStatus(value);
  }
  function adddressChangeHandler(key, value, pattern) {
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

  const goToMyAppliance = () => {
    props.navigation.navigate('MyAppliance');
  };

  const updateValues = () => {
    let remoteAccess = contractorMonitoringStatus ? true : false;
    let addressWithoutTrailingComma = {
      address1: address.address1.replace(/[,\s]+$/g, ''),
      address2: address.address2.replace(/[,\s]+$/g, ''),
      city: address.city.replace(/[,\s]+$/g, ''),
      //country: address.country,
      state: address.state,
      zipCode: address.zipCode,
    };
    var addressChanged = false;
    for (let key in address) {
      if (data.oduInstallationAddress.address[key] !== address[key]) {
        addressChanged = true;
        break;
      }
    }

    if (
      data.deviceName.trim() !== unitName.trim() ||
      data.contractorMonitoringStatus !== remoteAccess ||
      addressChanged
    ) {
      let updatedValues = {
        ODUInstalledAddress: addressWithoutTrailingComma,
        ODUName: unitName,
        contractorMonitoringStatus: remoteAccess,
        gatewayId: data.macId,
        addressChanged: addressChanged,
      };
      dispatch(HomeOwnerActions.editUnitInfo(updatedValues, goToMyAppliance));
    } else {
      props.navigation.goBack();
    }
  };

  return (
    <ScrollView
      // keyboardShouldPersistTaps="handled" Commented to avoid tooltip issue
      contentContainerStyle={[styles.container]}>
      <CustomInputText
        autoCapitalize="words"
        placeholder={Dictionary.myAppliance.unitName}
        value={unitName}
        onChange={(text: any) => nameChangeHandler(text, Enum.address1Pattern)}
        isRequiredField={true}
        errorText={errorData.unitName ? errorData.unitName : ''}
      />
    {/* <CustomText
              newline={false}
              text={Dictionary.productRegistration.country}
              size={15}
              align={"left"}
              font={"medium"}
              style={{ paddingHorizontal:5, paddingTop: 10 }}
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
                  address.country === 'US' || address.country === undefined
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
                    address1: '',
                    city: '',
                    state: '',
                    zipCode: '',
                  }));
                }}
                text={'United States'}
                  //Dictionary.addDevice.addBcc.unitedStates}
                style={{marginRight: 30}}
                disabled={true}
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
                    address1: '',
                    city: '',
                    state: '',
                    zipCode: '',
                  }));
                }}
                text={"Canada"}
                disabled={true}
              />
            </View> */}

            <CustomInputText
              placeholder={
                Dictionary.createProfile.address1
              }
              onChange={(val) => adddressChangeHandler('address1', val, Enum.address1Pattern)}
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
              onChange={(val) => adddressChangeHandler('address2', val, Enum.address1Pattern)}
              value={address.address2}
              disabled={address.country == '' ? true : false}
              isRequiredField={false}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.city}
              onChange={(val) => adddressChangeHandler('city', val, Enum.cityPattern)}
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
                adddressChangeHandler('state', state.value, Enum.required)
              }
              options={(address.country == 'US'||address.country == 'United States') ? Enum.stateList : Enum.provincelist}
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
                address.country=='CA' ? adddressChangeHandler('zipCode', val, Enum.zipCodePatternCA) : adddressChangeHandler('zipCode', val, Enum.zipCodePattern)}
              value={address.zipCode}
              disabled={address.country == '' ? true : false}
              maxLength={address.country == 'CA' ? Enum.zipCodePatternCA.length : Enum.zipCodePattern.length}
              isRequiredField={true}
              errorText={errorData.zipCode ? errorData.zipCode : ''}
              autoCapitalize="characters"
              keyboardType={(address.country == 'US'||address.country == 'United States') ? "numeric" : "default"}
              prStyle={true}
            />
      
      <View style={styles.toggleView}>
        <View style={styles.monitoringRow}>
          <CustomText
            text={Dictionary.myAppliance.monitoringStatus}
            align="left"
            size={12}
            font="medium"
          />
          <InfoTooltip text={Dictionary.myAppliance.monitoringStatusInfo} />
        </View>
        <ToggleButton
          button1="Deny"
          button2="Grant"
          pressed={contractorMonitoringStatus}
          onChange={val => permissionChangeHandler(val)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          type="primary"
          disabled={!formValid}
          text={Dictionary.button.save}
          onPress={() => updateValues()}
        />
        <Button
          style={styles.marginTop10}
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
  buttonContainer: {
    paddingTop: 10,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  monitoringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleView: {
    flexShrink: 1,
    paddingVertical: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
});
