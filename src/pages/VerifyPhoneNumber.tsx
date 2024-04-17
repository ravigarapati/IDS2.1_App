import React, {useState} from 'react';
import {
  CustomText,
  CustomInputText,
  Button,
  BoschIcon,
  CustomPicker,
} from '../components';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {Enum} from '../utils/enum';
import {Keyboard, StyleSheet, View} from 'react-native';
import * as authActions from '../store/actions/AuthActions';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {validateInputField} from '../utils/Validator';
import {Auth} from 'aws-amplify';
import {Icons} from '../utils/icons';

export default function VerifyPhoneNumber({verificationStatus, role}) {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    phoneNumber: '',
    enterCode: '',
  });
  const [errorData, setErrorData] = useState({
    phoneNumber: null,
    enterCode: null,
  });
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const userFromStore = useSelector(state => state.auth.user);
  const authObject = useSelector(state => state.auth.currentUser);
  const [prefix, setPrefix] = useState('');
  const [prefixLabel, setPrefixLabel] = useState('');

  function setCurrentStepValue(stepNumber) {
    dispatch(authActions.setCurrentStep(stepNumber));
  }

  function setUserAttributes() {
    /** Phone number is sent to Cognito without dashes but to DynamoDB with dashes */
    let phoneNumber = userData.phoneNumber.replace(/-/g, '');
    let user = {
      phone_number: '+1' + phoneNumber,
    };
    dispatch(
      authActions.updateUserAttributes(userFromStore, user, response => {}),
    );
    let userDetail = {phoneNumber: userData.phoneNumber};
    dispatch(authActions.updateUserObject(userDetail));
  }

  function resendSMS() {
    authActions.verifyCurrentUserAttribute('phone_number');
  }
  function verifyPhoneNumber() {
    authActions.verifyCurrentUserAttributeSubmit(
      'phone_number',
      userData.enterCode,
      response => {
        let userObj = {
          role: role,
          email: userFromStore.attributes.email,
        };

        let user = {
          'custom:role': role,
        };
        dispatch(
          authActions.updateUserAttributes(userFromStore, user, response => {}),
        );
        dispatch(authActions.updateUserObject(userObj));

        setVerificationSuccess(true);
        verificationStatus(true);
      },
    );
  }

  function setFormValue(field, value) {
    setUserData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function changeHandler(field, value, pattern) {
    setFormValue(field, value);
    /* if (pattern) {
      let validation = validateInputField(value, pattern);
      setErrorValue(field, validation.errorText);
    }*/
  }

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function createProfileSuccess() {
    Auth.currentAuthenticatedUser({
      bypassCache: true,
    }).then(userData1 => {
      dispatch(authActions.setCurrentUser(userData1));
    });
    setCurrentStepValue(4);
  }

  function createProfile() {
    if (authObject.role === 'HomeOwner') {
      dispatch(
        authActions.createProfileHomeOwner(
          {
            firstName: authObject.firstName,
            lastName: authObject.lastName,
            phoneNumber: authObject.phoneNumber, //.replace(/-/g, ''),
          },
          createProfileSuccess,
        ),
      );
    } else {
      dispatch(authActions.createProfile(authObject, createProfileSuccess));
    }
  }
  return (
    <View style={[styles.flex1, styles.spaceEvenly, styles.container]}>
      {!verificationSuccess ? (
        <>
          {role === Enum.roles.homeowner ? (
            <CustomInputText
              disableCache={false}
              placeholder={'Phone Number'}
              maxLength={12}
              delimiterType="phoneNumber"
              keyboardType="numeric"
              value={userData.phoneNumber}
              onChange={(text: any) => {
                changeHandler('phoneNumber', text, Enum.phoneNumberPattern);
                setShowResend(false);
              }}
              isRequiredField={true}
              errorText={
                errorData.phoneNumber
                  ? Dictionary.error.phoneNumberPatternError
                  : ''
              }
            />
          ) : (
            <CustomInputText
              disableCache={false}
              placeholder={Dictionary.createProfile.personalPhoneNumber}
              maxLength={16}
              delimiterType="phoneNumber"
              keyboardType="numeric"
              value={userData.phoneNumber}
              onChange={(text: any) => {
                changeHandler('phoneNumber', text, Enum.phoneNumberPattern);
                setShowResend(false);
              }}
              isRequiredField={true}
              errorText={
                errorData.phoneNumber
                  ? Dictionary.error.phoneNumberPatternError
                  : ''
              }
            />
          )}
          <CustomText
            style={{...Typography.boschReg16}}
            newline={true}
            text={
              !showResend
                ? Dictionary.createProfile.descSMS
                : Dictionary.createProfile.resendSMSdesc
            }
          />
          {!showResend && (
            <Button
              type="primary"
              text={Dictionary.createProfile.sendSMS}
              /*  disabled={
                userData.phoneNumber === '' ||
                userData.phoneNumber.length !==
                  Enum.phoneNumberPattern.length ||
                errorData.phoneNumber
                  ? true
                  : false
              }*/
              onPress={() => {
                Keyboard.dismiss();
                setUserAttributes();
                setShowResend(true);
                verificationStatus(verificationSuccess);
              }}
            />
          )}
          <CustomText
            font="light-italic"
            size={14}
            text={Dictionary.remoteRequest.msgAndDataRatesApply}
          />
          <CustomInputText
            placeholder={Dictionary.createProfile.verificationCode}
            keyboardType="numeric"
            maxLength={6}
            value={userData.enterCode}
            style={styles.paddingTop10}
            onChange={(text: any) => changeHandler('enterCode', text, null)}
          />
          <View style={styles.buttonContainer}>
            <Button
              type="primary"
              /*disabled={
                userData.phoneNumber.length !==
                  Enum.phoneNumberPattern.length ||
                userData.enterCode.length !== 6
                  ? true
                  : false
              }*/
              text={Dictionary.createProfile.verifyPhoneNumber}
              onPress={() => {
                Keyboard.dismiss();
                verifyPhoneNumber();
              }}
            />
            {showResend && (
              <Button
                type="tertiary"
                text={Dictionary.createProfile.resendSMS}
                disabled={
                  userData.phoneNumber === '' ||
                  userData.phoneNumber.length !==
                    Enum.phoneNumberPattern.length ||
                  errorData.phoneNumber
                    ? true
                    : false
                }
                onPress={() => {
                  Keyboard.dismiss();
                  resendSMS();
                }}
              />
            )}
          </View>
        </>
      ) : (
        <>
          <View>
            <CustomText
              font="medium"
              size={12}
              align="left"
              text={Dictionary.createProfile.personalPhoneNumber}
            />
            <View
              style={[
                styles.flexRow,
                styles.alignCenter,
                styles.greenBorder,
                styles.spaceBetween,
              ]}>
              <CustomText
                font="regular"
                size={16}
                align="left"
                text={userData.phoneNumber}
              />
              <BoschIcon
                size={40}
                name={Icons.checkmark}
                color={Colors.darkGreen}
                style={{height: 40}}
              />
            </View>
          </View>
          <CustomText
            font="regular"
            size={16}
            newline={true}
            style={styles.marginTop20}
            text={Dictionary.createProfile.verificationSuccess}
          />
          <View style={styles.buttonContainer}>
            <Button
              type="primary"
              text={Dictionary.button.finishProfile}
              onPress={() => {
                createProfile();
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  paddingTop10: {
    paddingTop: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  greenBorder: {
    borderBottomColor: Colors.darkGreen,
    borderBottomWidth: 1,
  },
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    flexGrow: 1,
  },
  marginTop20: {
    marginTop: 20,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
