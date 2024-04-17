/**
 * @file Register Warranty is a tab in the installation dashboard for Constractor.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Linking,
} from 'react-native';
import {
  BoschIcon,
  Button,
  CustomInputText,
  CustomText,
  ToggleButton,
  SectionHeading,
  CustomDialogBox,
  CustomPicker,
  CheckBox,
} from '../components';
import {useFocusEffect} from 'react-navigation-hooks';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import * as ContractorActions from '../store/actions/ContractorActions';
import {useDispatch, useSelector} from 'react-redux';
import {validateInputField} from '../utils/Validator';
import {Enum} from '../utils/enum';
import {Icons} from '../utils/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {check} from 'react-native-permissions';
import {Auth} from 'aws-amplify';
import Radiobutton from '../components/Radiobutton';
import {Mock} from '../utils/Mock';
import {showToast} from '../components/CustomToast';

const Collapsible = ({title, children}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.marginVertical10}>
      <TouchableWithoutFeedback onPress={() => setOpen(!open)}>
        <View style={styles.collapsible} accessibilityState={{expanded: open}}>
          <CustomText align="left" font="bold" text={title} />
          <BoschIcon
            name={open ? Icons.up : Icons.down}
            size={30}
            style={{height: 30}}
          />
        </View>
      </TouchableWithoutFeedback>
      {open && <View style={styles.padding20}>{children}</View>}
    </View>
  );
};

const AddComponentButton = ({title, type, navigation}) => {
  const demoMode = useSelector(state => state.notification.demoStatus);
  return (
    <Button
      type="secondary"
      text={title}
      icon={Icons.addFrame}
      onPress={() =>
        demoMode
          ? showToast(Dictionary.demoMode.functionNotAvailable, 'info')
          : navigation.navigate('AddWarranty', {
              title: title,
              type: type,
            })
      }
    />
  );
};

const ComponentRegistered = ({text, data}) => {
  return (
    <View style={[styles.flexRow, styles.padBottom10]}>
      <BoschIcon
        name={Icons.alertSuccessFilled}
        size={24}
        color={Colors.darkGreen}
        accessibilityLabel={'Registered'}
        style={{height: 24}}
      />
      <View style={styles.padLeft10}>
        <CustomText font="bold" align="left" text={text} />
        <CustomText text={data.modelNumber} align="left" size={12} />
        <CustomText text={data.serialNumber} align="left" size={12} />
        <Text style={styles.installationDate}>
          {data.installationDate}
          <Text style={{color: Colors.darkRed}}> * </Text>
        </Text>
      </View>
    </View>
  );
};
const Disclaimer = () => {
  return (
    <Text style={[styles.star, styles.padVertical10]}>
      {'* '}
      <Text style={[styles.installationDateInfo]}>
        {Dictionary.installationDashboard.installationDateInfo}
      </Text>
    </Text>
  );
};
export default function InstallationRegisterWarranty(props: any) {
  const systemStatus = useSelector(
    state => state.contractor.selectedUnit.systemStatus,
  );
  const demoMode = useSelector(state => state.notification.demoStatus);
  const dispatch = useDispatch();
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const warrantyDetails =
    demoMode &&
    ((systemStatus.toLowerCase() === Enum.status.pending &&
      selectedUnit.gateway.gatewayId === '399A-001-823330-8733955691') ||
      (systemStatus.toLowerCase() === Enum.status.normal &&
        selectedUnit.gateway.gatewayId === '399A-001-284075-8733955691'))
      ? Mock.registerWarranty
      : useSelector(state =>
          state.contractor.selectedUnit.warrantyInfo
            ? state.contractor.selectedUnit.warrantyInfo
            : {},
        );
  const [showRegister, setShowRegister] = useState(false);
  const [checkMark, setCheckMark] = useState(false);
  // const [showWarranty, setShowWarranty] = useState(false);

  const accessToken = useSelector(
    state => state.contractor.prTokenDetails.prToken,
  );
  const tokenTimestamp = useSelector(
    state => state.contractor.prTokenDetails.prTokenTimestamp,
  );
  const ppAccountCreated = useSelector(
    state => state.contractor.ppAccountCreated,
  );
  const ppAccountCompleted = useSelector(
    state => state.contractor.ppAccountCompleted,
  );

  const [showPopup, setShowPopup] = useState(false);
  const [showSignUpPopup, setShowSignUpPopup] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [showRegisteredPopup, setShowRegisteredPopup] = useState(false);
  const initialized = useRef(false);

  const [userData, setUserData] = useState({
    name: '',
    country: 'US',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    applicationType: 1,
    phoneNumber: '',
  });
  const [disableHomeOwnerInfo, setDisableHomeOwnerInfo] = useState({
    name: false,
    country: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    email: false,
    phoneNumber: false,
  });
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [odu, setOdu] = useState(null);
  const [airHandler, setAirHandler] = useState(null);
  const [furnace, setFurnace] = useState(null);
  const [casedCoil, setCasedCoil] = useState(null);
  const [errorData, setErrorData] = useState({
    name: null,
    address: null,
    city: null,
    state: null,
    zipCode: null,
    email: null,
    phoneNumber: null,
  });
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (
      (errorData.name === '' &&
        errorData.address === '' &&
        errorData.city === '' &&
        errorData.state === '' &&
        errorData.zipCode === '' &&
        errorData.email === '' &&
        errorData.phoneNumber === '' &&
        checkMark) ||
      (disableHomeOwnerInfo.name &&
        disableHomeOwnerInfo.address &&
        disableHomeOwnerInfo.city &&
        disableHomeOwnerInfo.state &&
        disableHomeOwnerInfo.zipCode &&
        disableHomeOwnerInfo.email &&
        disableHomeOwnerInfo.phoneNumber &&
        checkMark)
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData, checkMark]);

  useEffect(() => {
    if (!demoMode) {
      dispatch(
        ContractorActions.getWarrantyInfo(selectedUnit.gateway.gatewayId),
      );
    }
    // didFocusEvent();
  }, []);

  useEffect(() => {
    if (selectedUnit.odu.installedAddress && selectedUnit.homeOwnerDetails) {
      let fullAddress = selectedUnit.odu.installedAddress.address;
      let addressList = fullAddress.split(',');
      let address = '';
      for (let i = 0; i < addressList.length - 3; i++) {
        address = address + ' ' + addressList[i];
      }
      let city = addressList[addressList.length - 3];
      let state = addressList[addressList.length - 2];
      let zipCode = addressList[addressList.length - 1];
      let country = 'US';
      let name =
        selectedUnit.homeOwnerDetails.firstName +
        ' ' +
        selectedUnit.homeOwnerDetails.lastName;
      let email = selectedUnit.homeOwnerDetails.email;

      let phoneNumber =
        selectedUnit &&
        selectedUnit.homeOwnerDetails &&
        selectedUnit.homeOwnerDetails.phoneNumber;

      setUserData({
        name: name ? name.trim() : '',
        country: country,
        address: address ? address.trim() : '',
        city: city ? city.trim() : '',
        state: state ? state.trim() : '',
        zipCode: zipCode ? zipCode.trim() : '',
        email: email ? email.trim() : '',
        applicationType: 1,
        phoneNumber: phoneNumber ? phoneNumber.trim() : '',
      });

      setDisableHomeOwnerInfo({
        name: name ? true : false,
        country: country ? true : false,
        address: address ? true : false,
        city: city ? true : false,
        state: state ? true : false,
        zipCode: zipCode ? true : false,
        email: email ? true : false,
        phoneNumber: phoneNumber ? true : false,
      });
    }
  }, []);

  // const didFocusEvent = () => {
  //   props.navigation.addListener('didFocus', () => {
  //     AsyncStorage.getItem('WarrantyPopup').then((value) => {
  //       value === 'hide' ? setShowWarranty(false) : setShowWarranty(true);
  //     });
  //   });
  // };

  /*useEffect(() => {
    if (
      userData.name &&
      userData.address &&
      userData.zipCode &&
      ((userData.country === 'US' && userData.zipCode.length === 5) ||
      (userData.country === 'CA' && userData.zipCode.length === 6)) &&
      userData.phoneNumber &&
      userData.phoneNumber.length === 12 &&
      userData.email &&
      userData.city &&
      userData.state &&
      checkMark
    ) {
      setFormValid(true);
    }
  }, [userData]);*/

  useEffect(() => {
    setOdu(null);
    setAirHandler(null);
    setFurnace(null);
    setCasedCoil(null);
    if (Object.keys(warrantyDetails).length !== 0) {
      if (
        warrantyDetails.applicationType &&
        warrantyDetails.ODUWarrantyDetails
      ) {
        setShowRegister(true);
      } else {
        setShowRegister(false);
      }
      if (warrantyDetails.components && warrantyDetails.components.length > 0) {
        let data = warrantyDetails.components;
        setAirHandler(
          data.find(item => item.componentType === Enum.airHandler),
        );
        setCasedCoil(data.find(item => item.componentType === Enum.casedCoil));
        setFurnace(data.find(item => item.componentType === Enum.furnace));
        setShowDisclaimer(true);
      }
      if (warrantyDetails.ODUInstallationDate !== null) {
        setOdu({
          installationDate: warrantyDetails.ODUInstallationDate,
          serialNumber: warrantyDetails.ODUSerialNumber,
          modelNumber: warrantyDetails.ODUModelNumber,
        });
        setShowDisclaimer(true);
      }
    }
    //didFocusEvent();
  }, [warrantyDetails]);

  function checkTimestamps() {
    let currentTimestamp = new Date().getTime();
    let timeDiff = (currentTimestamp - tokenTimestamp) / 1000;
    if (tokenTimestamp === 0) {
      currentUser();
    } else if ((!ppAccountCompleted && timeDiff > 5) || timeDiff >= 3600) {
      currentUser();
    }
  }

  const currentUser = async () => {
    try {
      // attributes are only updated here until re-auth
      // so grab attributes from here
      const session = await Auth.currentSession();

      const attributes = await Auth.currentUserInfo();
      let body = {
        username: attributes.username,
      };
      dispatch(ContractorActions.getSKIDAccessToken(body));
    } catch (error) {}
  };

  useFocusEffect(() => {
    if (!demoMode) {
      if (!initialized.current) {
        initialized.current = true;
        if (!ppAccountCompleted || tokenTimestamp === 0) {
          checkTimestamps();
        }
      }
    }
  });

  useEffect(() => {
    if (accessToken != '' && (!ppAccountCreated || !ppAccountCompleted)) {
      let data = {
        AccessToken: accessToken,
      };
      dispatch(ContractorActions.getPPAccountInformation(data));
    }
  }, [accessToken]);

  useEffect(() => {
    if (!demoMode) {
      if (!ppAccountCreated) {
        setShowPopup(true);
        setShowSignUpPopup(true);
        setShowCompletePopup(false);
      } else if (!ppAccountCompleted) {
        setShowPopup(true);
        setShowSignUpPopup(false);
        setShowCompletePopup(true);
      } else {
        setShowPopup(false);
        setShowSignUpPopup(false);
        setShowCompletePopup(false);
      }
    }
  }, [ppAccountCreated]);

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function setData(field, value, pattern?) {
    setUserData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showRegister && !showPopup && (
        <View>
          <SectionHeading
            title={Dictionary.installationDashboard.homeownerInfo}
          />
          <View style={styles.padding20}>
            <CustomInputText
              placeholder={Dictionary.productRegistration.homeownerName}
              //{Dictionary.installationDashboard.homeownerName}
              onChange={val => setData('name', val, Enum.fullNamePattern)}
              value={userData.name}
              disabled={disableHomeOwnerInfo.name}
              isRequiredField={true}
              errorText={errorData.name ? errorData.name : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.phoneNumber}
              //{Dictionary.installationDashboard.phoneNumber}
              onChange={val =>
                setData('phoneNumber', val, Enum.phoneNumberPattern)
              }
              value={userData.phoneNumber}
              disabled={disableHomeOwnerInfo.phoneNumber}
              isRequiredField={true}
              errorText={errorData.phoneNumber ? errorData.phoneNumber : ''}
              delimiterType="phoneNumber"
              keyboardType="numeric"
              maxLength={12}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.email}
              //{Dictionary.installationDashboard.email}
              onChange={val => setData('email', val, Enum.emailPattern)}
              value={userData.email}
              disabled={disableHomeOwnerInfo.email}
              isRequiredField={true}
              errorText={errorData.email ? errorData.email : ''}
            />
            {/* <View style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal:5, paddingVertical:15}}>
              <Radiobutton
                accessibilityLabelText={
                  "United States"
                }
                accessibilityHintText={
                  "Select United States"
                }
                checked={
                  userData.country === 'US'
                  //Dictionary.addDevice.addBcc.unitedStates
                }
                disabled={disableHomeOwnerInfo.country}
                handleCheck={() => {
                  setUserData((prevData) =>({
                    ...prevData,
                    country: 'US',
                    address: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address: null,
                    state: null,
                    city: null,
                    zipCode: null,
                  }))
                 
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
                  userData.country === 'CA'
                }
                disabled={disableHomeOwnerInfo.country}
                handleCheck={() => {
                  setUserData((prevData) =>({
                    ...prevData,
                    country: 'CA',
                    address: '',
                    state: '',
                    city: '',
                    zipCode: '',
                  }));
                  setErrorData((prevData) =>({
                    ...prevData,
                    address: null,
                    state: null,
                    city: null,
                    zipCode: null,
                  }))
                 
                }}
                text={"Canada"}
              />
            </View> */}

            <CustomInputText
              placeholder={
                Dictionary.productRegistration.unitInstallationAddress
              }
              onChange={val => setData('address', val, Enum.address1Pattern)}
              value={userData.address}
              disabled={
                (userData.country == '' ? true : false) ||
                disableHomeOwnerInfo.address
              }
              isRequiredField={true}
              errorText={errorData.address ? errorData.address : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.city}
              onChange={val => setData('city', val, Enum.address1Pattern)}
              value={userData.city}
              disabled={
                (userData.country == '' ? true : false) ||
                disableHomeOwnerInfo.city
              }
              isRequiredField={true}
              errorText={errorData.city ? errorData.city : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomPicker
              placeholder={Dictionary.productRegistration.state}
              value={userData.state}
              onChange={(state: any) =>
                setData('state', state.value, Enum.address2Pattern)
              }
              options={
                userData.country == 'US' ? Enum.stateList : Enum.provincelist
              }
              //iteratorKey="index"
              iteratorLabel="label"
              disabled={
                (userData.country == '' ? true : false) ||
                disableHomeOwnerInfo.state
              }
              isRequiredField={true}
              showFieldLabel={true}
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.zipCode}
              onChange={val =>
                userData.country == 'CA'
                  ? setData('zipCode', val, Enum.zipCodePatternCA)
                  : setData('zipCode', val, Enum.zipCodePattern)
              }
              value={userData.zipCode}
              disabled={
                (userData.country == '' ? true : false) ||
                disableHomeOwnerInfo.zipCode
              }
              maxLength={
                userData.country == 'CA'
                  ? Enum.zipCodePatternCA.length
                  : Enum.zipCodePattern.length
              }
              isRequiredField={true}
              errorText={errorData.zipCode ? errorData.zipCode : ''}
              autoCapitalize="characters"
              keyboardType={userData.country == 'US' ? 'numeric' : 'default'}
              prStyle={true}
            />

            <View style={styles.marginHorizontal10}>
              <CheckBox
                checked={checkMark}
                onChange={setCheckMark}
                text={Dictionary.productRegistration.acknowledgement}
                lines={3}
                style={styles.checkboxStyle}
              />
            </View>
          </View>

          <SectionHeading
            title={Dictionary.installationDashboard.applicationType}
            info={Dictionary.installationDashboard.applicationTypeInfo}
            tooltipPosition="top"
          />
          <ToggleButton
            button1={Dictionary.installationDashboard.commercial}
            button2={Dictionary.installationDashboard.residential}
            style={styles.padding20}
            pressed={userData.applicationType}
            onChange={val => setData('applicationType', val, null)}
          />
          <Button
            type="primary"
            text={Dictionary.button.next}
            style={[styles.marginHorizontal20, styles.marginBottom20]}
            disabled={!formValid}
            onPress={() => {
              let warrantyInfo = {
                gatewayId: selectedUnit.gateway.gatewayId,
                ODUSerialNumber: selectedUnit.odu.serialNumber,
                //country: userData.country,
                address:
                  userData.address.trim() +
                  ', ' +
                  userData.city.trim() +
                  ', ' +
                  userData.state.trim() +
                  ', ' +
                  userData.zipCode,
                name: userData.name.trim(),
                email: userData.email.trim(),
                applicationType: userData.applicationType
                  ? Enum.residential
                  : Enum.commercial,
                phoneNumber: userData.phoneNumber,
              };
              demoMode
                ? showToast(Dictionary.demoMode.functionNotAvailable, 'info')
                : dispatch(ContractorActions.addWarrantyInfo(warrantyInfo));
            }}
          />
        </View>
      )}
      {showRegister && !showPopup && (
        <View>
          <View style={styles.padding20}>
            {odu && (
              <ComponentRegistered
                text={Dictionary.installationDashboard.odu + ' Registered'}
                data={odu}
              />
            )}
            {airHandler && (
              <ComponentRegistered
                text={
                  Dictionary.installationDashboard.airHandler + ' Registered'
                }
                data={airHandler}
              />
            )}
            {furnace && (
              <ComponentRegistered
                text={Dictionary.installationDashboard.furnace + ' Registered'}
                data={furnace}
              />
            )}
            {casedCoil && (
              <ComponentRegistered
                text={
                  Dictionary.installationDashboard.casedCoil + ' Registered'
                }
                data={casedCoil}
              />
            )}
            {showDisclaimer && <Disclaimer />}
            {!odu && (
              <AddComponentButton
                type={Enum.odu}
                title={'Register ' + Dictionary.installationDashboard.odu}
                navigation={props.navigation}
              />
            )}
            {!airHandler && !furnace && !casedCoil && (
              <AddComponentButton
                type={Enum.airHandler}
                title={
                  'Register ' + Dictionary.installationDashboard.airHandler
                }
                navigation={props.navigation}
              />
            )}
            {!furnace && !airHandler && (
              <AddComponentButton
                type={Enum.furnace}
                title={'Register ' + Dictionary.installationDashboard.furnace}
                navigation={props.navigation}
              />
            )}
            {!casedCoil && !airHandler && (
              <AddComponentButton
                type={Enum.casedCoil}
                title={'Register ' + Dictionary.installationDashboard.casedCoil}
                navigation={props.navigation}
              />
            )}
          </View>
          <Collapsible title={Dictionary.installationDashboard.homeownerInfo}>
            {selectedUnit &&
            selectedUnit.odu &&
            selectedUnit.odu.installedAddress &&
            selectedUnit.homeOwnerDetails ? (
              <>
                <CustomText
                  text={
                    selectedUnit.homeOwnerDetails.firstName
                      ? selectedUnit.homeOwnerDetails.firstName +
                        ' ' +
                        selectedUnit.homeOwnerDetails.lastName
                      : ''
                  }
                  align="left"
                  size={12}
                />
                <CustomText
                  text={
                    selectedUnit.odu.installedAddress.address
                      ? selectedUnit.odu.installedAddress.address
                      : ''
                  }
                  align="left"
                  size={12}
                />
                <CustomText
                  text={
                    selectedUnit.homeOwnerDetails.phoneNumber &&
                    selectedUnit.homeOwnerDetails.phoneNumber !== ''
                      ? selectedUnit.homeOwnerDetails.phoneNumber
                      : ''
                  }
                  align="left"
                  size={12}
                />
                <CustomText
                  text={
                    selectedUnit.homeOwnerDetails.email
                      ? selectedUnit.homeOwnerDetails.email
                      : ''
                  }
                  align="left"
                  size={12}
                />
              </>
            ) : (
              <>
                <CustomText
                  text={
                    warrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails.name
                      ? warrantyDetails.ODUWarrantyDetails.name
                      : ''
                  }
                  align="left"
                  size={12}
                />
                <CustomText
                  text={
                    warrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails.address
                      ? warrantyDetails.ODUWarrantyDetails.address
                      : '' + warrantyDetails &&
                        warrantyDetails.ODUWarrantyDetails &&
                        warrantyDetails.ODUWarrantyDetails.zipCode
                      ? warrantyDetails.ODUWarrantyDetails.zipCode
                      : ''
                  }
                  align="left"
                  size={12}
                />
                {warrantyDetails &&
                warrantyDetails.ODUWarrantyDetails &&
                warrantyDetails.ODUWarrantyDetails.phoneNumber &&
                warrantyDetails.ODUWarrantyDetails.phoneNumber !== '' ? (
                  <CustomText
                    text={
                      warrantyDetails &&
                      warrantyDetails.ODUWarrantyDetails &&
                      warrantyDetails.ODUWarrantyDetails.phoneNumber
                        ? warrantyDetails.ODUWarrantyDetails.phoneNumber
                        : ''
                    }
                    align="left"
                    size={12}
                  />
                ) : null}
                <CustomText
                  text={
                    warrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails &&
                    warrantyDetails.ODUWarrantyDetails.email
                      ? warrantyDetails.ODUWarrantyDetails.email
                      : ''
                  }
                  align="left"
                  size={12}
                />
              </>
            )}
          </Collapsible>
          <Collapsible title={Dictionary.installationDashboard.applicationType}>
            <View style={styles.flexRow}>
              <BoschIcon
                name={Icons.alertSuccessFilled}
                size={24}
                color={Colors.darkGreen}
                style={{height: 24}}
              />
              <CustomText
                style={styles.padLeft10}
                text={
                  warrantyDetails.applicationType === Enum.commercial
                    ? Dictionary.installationDashboard.commercial
                    : Dictionary.installationDashboard.residential
                }
                align="left"
                size={16}
              />
            </View>
          </Collapsible>
        </View>
      )}

      {showSignUpPopup && (
        <View style={styles.inviteContractorContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.containerPop}>
              <CustomText
                text={Dictionary.productRegistration.pPAccountNeededTitle}
                align="center"
                font="bold"
              />
              <CustomText
                text={Dictionary.productRegistration.pPAccountNeeded}
                align="center"
                style={{padding: 10, paddingBottom: 20}}
              />
              <View style={styles.graycontainer}>
                <CustomText
                  text={'Benefits:'}
                  align="center"
                  style={{padding: 10}}
                />
                <View style={styles.flexcontainer}>
                  <BoschIcon
                    name={Icons.medal}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Medal'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.customerService}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Customer Service'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.barChartSearch}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Bar Chart Search'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits1}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits2}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits3}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                </View>
              </View>
              <Button
                type="primary"
                //disabled={selectedContractorId === ''}
                text={Dictionary.productRegistration.pPAccountNeededButton}
                style={{paddingTop: 10}}
                onPress={() =>
                  Linking.openURL(
                    'https://bosch-us-home.thernovo-dev.com/profile',
                  )
                }
              />
            </View>
          </View>
        </View>
      )}
      {showCompletePopup && (
        <View style={styles.inviteContractorContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.containerPop}>
              <CustomText
                text={Dictionary.productRegistration.pPIncompleteAccountTitle}
                align="center"
                font="bold"
              />
              <CustomText
                text={Dictionary.productRegistration.pPIncompleteAccount}
                align="center"
                style={{padding: 10}}
              />
              <View style={styles.graycontainer}>
                <CustomText
                  text={'Benefits:'}
                  align="center"
                  style={{padding: 10}}
                />
                <View style={styles.flexcontainer}>
                  <BoschIcon
                    name={Icons.medal}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Medal'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.customerService}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Customer Service'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <BoschIcon
                    name={Icons.barChartSearch}
                    size={45}
                    color={Colors.blueOnPress}
                    accessibilityLabel={'Bar Chart Search'}
                    style={[styles.flexitem, {textAlign: 'center'}]}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits1}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits2}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.pPBenefits3}
                    align="center"
                    //font='bold'
                    size={15}
                    style={styles.flexitem}
                  />
                </View>
              </View>

              <Button
                type="primary"
                //disabled={selectedContractorId === ''}
                text={Dictionary.productRegistration.pPIncompleteAccountButton}
                style={{paddingTop: 10}}
                onPress={() =>
                  Linking.openURL(
                    'https://bosch-us-home.thernovo-dev.com/profile',
                  )
                }
              />
            </View>
          </View>
        </View>
      )}

      {/* {!showRegister && !odu && !airHandler && !furnace && !casedCoil && (
        <CustomDialogBox
          visible={showWarranty}
          text={Dictionary.installationDashboard.installationAbc}
          textLink={Dictionary.installationDashboard.installationAbcLink}
          storageName={'WarrantyPopup'}
          buttonText={Dictionary.button.acknowledge}
          callbackFunc={() => {
            setShowWarranty(false);
          }}
        />
      )} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  grayBackground: {
    backgroundColor: Colors.lightGray,
  },
  padding20: {
    padding: 20,
  },
  collapsible: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  marginVertical10: {
    marginVertical: 10,
  },
  marginHorizontal20: {
    marginHorizontal: 20,
  },
  marginBottom20: {
    marginBottom: 20,
  },
  homeownerTitle: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  padVertical10: {
    paddingVertical: 10,
  },
  star: {
    color: Colors.darkRed,
  },
  installationDateInfo: {
    ...Typography.boschMedium12,
    color: Colors.black,
  },
  installationDate: {
    ...Typography.boschReg12,
    color: Colors.black,
  },
  flexRow: {
    flexDirection: 'row',
  },
  padLeft10: {
    paddingLeft: 10,
  },
  padBottom10: {
    paddingBottom: 10,
  },
  checkboxStyle: {
    marginVertical: 15,
    paddingRight: 10,
    alignItems: 'flex-start',
  },
  marginHorizontal10: {
    paddingRight: 40,
    marginVertical: 15,
  },
  containerPop: {
    ...Typography.alignCenter,
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: Colors.blur,
    flex: 1,
  },
  modalContainer: {
    flexGrow: 1,
    maxHeight: '100%',
    //overflow: 'hidden',
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.mediumGray,
    backgroundColor: Colors.white,
    padding: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inviteContractorContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blur,
  },

  graycontainer: {
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  flexcontainer: {
    flexDirection: 'row',
    //flex: 1,
    flexWrap: 'wrap',
  },
  flexitem: {
    flexBasis: '33%',
    paddingVertical: 5,
  },
  flexitem2: {
    flexBasis: '50%',
    padding: 5,
    paddingVertical: 5,
  },
});
