/**
 * @file Register Warranty is a tab in the installation dashboard for Constractor.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Button,
  CustomInputText,
  CheckBox,
  BoschIcon,
  CustomText,
  CustomPicker,
} from '../../components';
import {Colors, Typography} from '../../styles';
import {Dictionary} from '../../utils/dictionary';
import * as ContractorActions from '../../store/actions/ContractorActions';
import {useDispatch, useSelector} from 'react-redux';
import {validateInputField} from '../../utils/Validator';
import {Enum} from '../../utils/enum';
import {Auth} from 'aws-amplify';
import {Icons} from '../../utils/icons';
import InAppReview from 'react-native-in-app-review';
import {Mock} from '../../utils/Mock';

export default function AddHomeOwnerInfo(props) {
  const dispatch = useDispatch();

  const demoMode = useSelector(state => state.notification.demoStatus);

  const productDetails = useSelector(state => state.contractor.prProductInfo);
  const contractorId = useSelector(
    state => state.contractor.contractorDetails.contractorId,
  );
  const productInfo = useSelector(state => state.contractor.prProductInfo);
  const homeownerInfo = useSelector(state => state.contractor.prHomeownerInfo);

  const [showRegister, setShowRegister] = useState(false);
  const [checkMark, setCheckMark] = useState(demoMode ? true : false);
  const [userData, setUserData] = useState(
    demoMode
      ? Mock.productRegistration.homeownerInfo
      : {
          fullName: '',
          country: 'US',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          email: '',
          applicationType: 1,
          phoneNumber: '',
        },
  );
  const [disableHomeOwnerInfo, setDisableHomeOwnerInfo] = useState({
    fullName: demoMode ? true : false,
    country: '',
    address: demoMode ? true : false,
    city: demoMode ? true : false,
    state: demoMode ? true : false,
    zipCode: demoMode ? true : false,
    email: demoMode ? true : false,
    phoneNumber: demoMode ? true : false,
  });
  const [errorData, setErrorData] = useState({
    fullName: null,
    country: '',
    address: null,
    city: null,
    state: null,
    zipCode: null,
    email: null,
    phoneNumber: null,
  });
  const [formValid, setFormValid] = useState(demoMode ? true : false);
  const accessToken = useSelector(
    state => state.contractor.prTokenDetails.prToken,
  );
  const tokenTimestamp = useSelector(
    state => state.contractor.prTokenDetails.prTokenTimestamp,
  );
  const showRegisteredPopup = useSelector(
    state => state.contractor.prPopups.showRegisteredPopup,
  );
  const showHomeownerPopup = useSelector(
    state => state.contractor.prPopups.showHomeownerPopup,
  );

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
  useEffect(() => {
    if (showHomeownerPopup) {
      props.homeownerStatus(true);
    }
  }, []);

  useEffect(() => {
    if (
      (errorData.fullName === '' &&
        errorData.country === '' &&
        errorData.address === '' &&
        errorData.city === '' &&
        errorData.state === '' &&
        errorData.zipCode === '' &&
        errorData.email === '' &&
        errorData.phoneNumber === '' &&
        checkMark) ||
      demoMode
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData, checkMark]);

  useEffect(() => {
    //dispatch(ContractorActions.getWarrantyInfo(selectedUnit.gateway.gatewayId));
    // didFocusEvent();
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
      userData.fullName &&
      userData.country &&
      userData.address &&
      userData.zipCode &&
      userData.zipCode.length >= 5 &&
      userData.phoneNumber &&
      userData.phoneNumber.length === 12 &&
      userData.email &&
      userData.city &&
      userData.state &&
      checkMark
   ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [userData, checkMark]);*/

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
      if (validation.errorText != '') {
        setErrorValue(field, Dictionary.error[field + 'Error']);
      } else {
        setErrorValue(field, '');
      }
    }
  }

  const rateApp = () => {
    InAppReview.isAvailable();

    // trigger UI InAppreview
    InAppReview.RequestInAppReview();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showRegisteredPopup && !showHomeownerPopup && (
        <View>
          <View>
            <CustomInputText
              placeholder={Dictionary.productRegistration.homeownerName}
              onChange={val => setData('fullName', val, Enum.fullNamePattern)}
              value={userData.fullName}
              disabled={disableHomeOwnerInfo.fullName}
              isRequiredField={true}
              errorText={errorData.fullName ? errorData.fullName : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.email}
              onChange={val => setData('email', val, Enum.emailPattern)}
              value={userData.email}
              disabled={disableHomeOwnerInfo.email}
              isRequiredField={true}
              errorText={errorData.email ? errorData.email : ''}
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.phone}
              onChange={(text: any) => {
                setData('phoneNumber', text, Enum.phoneNumberPattern);
              }}
              value={userData.phoneNumber}
              disabled={disableHomeOwnerInfo.phoneNumber}
              isRequiredField={true}
              delimiterType="phoneNumber"
              maxLength={Enum.phoneNumberPattern.length}
              keyboardType="numeric"
              errorText={errorData.phoneNumber ? errorData.phoneNumber : ''}
              autoCapitalize="words"
              prStyle={true}
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
                  userData.country === 'US'
                  //Dictionary.addDevice.addBcc.unitedStates
                }
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
                  userData.country === 'CA'
                }
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
                Dictionary.productRegistration.unitInstallationAddress
              }
              onChange={val => setData('address', val, Enum.address1Pattern)}
              value={userData.address}
              disabled={userData.country == '' ? true : false}
              isRequiredField={true}
              errorText={errorData.address ? errorData.address : ''}
              autoCapitalize="words"
              prStyle={true}
            />
            <CustomInputText
              placeholder={Dictionary.productRegistration.city}
              onChange={val => setData('city', val, Enum.address1Pattern)}
              value={userData.city}
              disabled={userData.country == '' ? true : false}
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
              disabled={userData.country == '' ? true : false}
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
              disabled={userData.country == '' ? true : false}
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
                disabled={demoMode}
              />
            </View>
          </View>
          <Button
            type="primary"
            text={Dictionary.button.submit}
            //style={[styles.padding10]}
            disabled={!formValid}
            onPress={() => {
              if (!demoMode) {
                let currentTime = new Date().getTime();
                let timeDiff = (currentTime - tokenTimestamp) / 1000;
                if (timeDiff >= 3600) {
                  currentUser();
                }
              }
              let data = {
                SerialNumber: productDetails.serialNumber,
                InstallationDate: productDetails.installationDate,
                ReferenceCode: '',
                ExtendedWarranty: false,
                Address: {
                  Name: userData.fullName,
                  Street: userData.address,
                  Line2: '',
                  PostalCode: userData.zipCode,
                  City: userData.city,
                  Province: userData.state,
                  CountryCode: userData.country,
                },
                ContractorId: contractorId,
                Questionnaire: {
                  ApplicationType: productDetails.applicationType
                    ? Enum.residential.toLowerCase()
                    : Enum.commercial.toLowerCase(),
                  Consent:
                    'Yes, I have read and acknowledge the third party consent disclosure',
                  Email: userData.email,
                  PhoneNumber: userData.phoneNumber,
                },
                AccessToken: accessToken,
              };
              props.homeownerStatus(true);
              demoMode
                ? dispatch(
                    ContractorActions.productRegistrationSetHomeowner(userData),
                  )
                : dispatch(
                    ContractorActions.productRegistrationRegister(
                      data,
                      userData,
                    ),
                  );
            }}
          />
        </View>
      )}
      {showRegisteredPopup && (
        <View style={styles.containerPop}>
          <View style={styles.inviteContractorContainer}>
            <View style={styles.modalContainer}>
              <BoschIcon
                name={Icons.alertSuccess}
                size={100}
                color={Colors.darkGreen}
                accessibilityLabel={'Registered'}
                style={{textAlign: 'center', height: 100}}
              />
              <CustomText
                text={Dictionary.productRegistration.successfullRegister}
                align="center"
                style={{padding: 10}}
              />
              <View style={[styles.graycontainer2, {padding: 10}]}>
                <View style={styles.flexcontainer}>
                  <CustomText
                    text={Dictionary.productRegistration.modelNumberPopup}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={productInfo.modelNumber}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.homeownerNamePopup}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.fullName}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                </View>
              </View>
              <View style={[styles.flexRow, styles.padding10]}>
                <BoschIcon
                  size={24}
                  name={Icons.infoTooltip}
                  //style={styles.paddingTop5}
                />

                <CustomText
                  text={
                    Dictionary.productRegistration.warrantyCertificateTooltip +
                    homeownerInfo.email +
                    Dictionary.productRegistration.warrantyCertificateTooltip2
                  }
                  align="left"
                  size={12}
                  //style={{paddingLeft:10}}
                />
              </View>

              <View style={styles.paddingTop10}>
                <Button
                  type="primary"
                  text={Dictionary.productRegistration.registerAnotherProduct}
                  onPress={() => {
                    props.homeownerStatus(false);
                    dispatch(ContractorActions.prResetFlow());
                    rateApp();
                  }}
                />
                <Button
                  type="secondary"
                  text={Dictionary.common.home}
                  onPress={() => {
                    props.homeownerStatus(false);
                    dispatch(ContractorActions.prResetFlow());
                    dispatch(ContractorActions.prCleanInfo);
                    props.navigation.navigate('Home');
                    rateApp();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      )}
      {showHomeownerPopup && !showRegisteredPopup && (
        <View style={styles.containerPop}>
          <View style={styles.inviteContractorContainer}>
            <View style={styles.modalContainer}>
              <CustomText
                text={Dictionary.productRegistration.sameHomeownerRegister}
                align="center"
                style={{padding: 10}}
              />
              <View style={[styles.graycontainer2, {padding: 10}]}>
                <View style={styles.flexcontainer}>
                  <CustomText
                    text={Dictionary.productRegistration.popUpName}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.fullName}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.popUpEmail}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.email}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.popUpAddress}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.address}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.city}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.city}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.state}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.state}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={Dictionary.productRegistration.zipCode}
                    align="left"
                    //font='bold'
                    size={12}
                    style={styles.flexitem2}
                  />
                  <CustomText
                    text={homeownerInfo.zipCode}
                    align="left"
                    font="medium"
                    size={12}
                    style={styles.flexitem2}
                  />
                </View>
              </View>

              <View style={styles.paddingTop10}>
                <Button
                  type="primary"
                  text={Dictionary.productRegistration.proceed}
                  onPress={() => {
                    let data = {
                      SerialNumber: productDetails.serialNumber,
                      InstallationDate: productDetails.installationDate,
                      ReferenceCode: '',
                      ExtendedWarranty: false,
                      Address: {
                        Name: homeownerInfo.fullName,
                        Street: homeownerInfo.address,
                        Line2: '',
                        PostalCode: homeownerInfo.zipCode,
                        City: homeownerInfo.city,
                        Province: homeownerInfo.state,
                        CountryCode: homeownerInfo.country,
                      },
                      ContractorId: contractorId,
                      Questionnaire: {
                        ApplicationType: productDetails.applicationType
                          ? Enum.residential.toLowerCase()
                          : Enum.commercial.toLowerCase(),
                        Consent:
                          'Yes, I have read and acknowledge the third party consent disclosure',
                        Email: homeownerInfo.email,
                        PhoneNumber: homeownerInfo.phoneNumber,
                      },
                      AccessToken: accessToken,
                    };
                    props.homeownerStatus(true);
                    demoMode
                      ? dispatch(
                          ContractorActions.productRegistrationSetHomeowner(
                            userData,
                          ),
                        )
                      : dispatch(
                          ContractorActions.productRegistrationRegister(
                            data,
                            homeownerInfo,
                          ),
                        );
                  }}
                />
                <Button
                  type="secondary"
                  text={Dictionary.productRegistration.registerAnotherHomeowner}
                  onPress={() => {
                    props.homeownerStatus(false);
                    dispatch(ContractorActions.registerNewHomeowner());
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
    padding: 20,
  },
  containerPop: {
    backgroundColor: Colors.blur,
    flexGrow: 1,
    paddingHorizontal: 0,
  },
  grayBackground: {
    backgroundColor: Colors.lightGray,
  },
  padding20: {
    padding: 20,
  },
  collapsible: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexBasis: 33.3333,
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
  modalContainer: {
    flexGrow: 1,
    maxHeight: '100%',
    overflow: 'hidden',
    width: '100%',
    borderWidth: 0.5,
    borderColor: Colors.mediumGray,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  borderStyle: {
    borderBottomColor: Colors.mediumGray,
    borderBottomWidth: 1,
  },
  padding10: {
    padding: 10,
  },
  selected: {
    backgroundColor: Colors.darkBlue,
    padding: 10,
  },
  unselected: {
    backgroundColor: Colors.transparent,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  graycontainer: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    padding: 10,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  graycontainer2: {
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    paddingHorizontal: 10,
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
