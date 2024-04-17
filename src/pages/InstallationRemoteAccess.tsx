import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {
  Button,
  CustomInputText,
  CustomText,
  InfoTooltip,
  Banner,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {validateInputField} from '../utils/Validator';
import {Enum} from '../utils/enum';
import * as ContractorActions from '../store/actions/ContractorActions';
import {useSelector, useDispatch} from 'react-redux';
import {Icons} from '../utils/icons';
import moment from 'moment';
import {showToast} from '../components/CustomToast';

export default function InstallationRemoteAccess() {
  const dispatch = useDispatch();
  /** const gatewayId and remoteAccessGranted are hard coded till further list API is available. */
  const gatewayId = useSelector(
    state => state.contractor.selectedUnit.gateway.gatewayId,
  );
  const [userData, setUserData] = useState({
    phoneNumber: '',
    email: '',
    gatewayId: gatewayId,
    requestDate: null,
  });
  const [errorData, setErrorData] = useState({
    phoneNumber: null,
    email: null,
  });
  const [formValid, setFormValid] = useState(false);
  // const [showBanner, setShowBanner] = useState(false);
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const [remoteAccessGranted, setRemoteAccessGranted] = useState(
    selectedUnit && selectedUnit.remoteAccessGranted,
  );
  const remoteRequestSent = selectedUnit.remoteRequestSent;
  const demoMode = useSelector(state => state.notification.demoStatus);
  const banner = {
    requestSent: {
      iconName: Icons.checkmarkFrame,
      iconColor: Colors.darkGreen,
      text: Dictionary.remoteRequest.requestSent,
      background: Colors.lightGreen,
    },
    accessDenied: {
      iconName: Icons.alertWarning,
      iconColor: Colors.darkYellow,
      text: Dictionary.remoteRequest.accessDenied,
      background: Colors.lightYellow,
    },
    accessGranted: {
      iconName: Icons.checkmarkFrame,
      iconColor: Colors.darkGreen,
      text: Dictionary.remoteRequest.accessGranted,
      background: Colors.lightGreen,
    },
  };
  useEffect(() => {
    if (errorData.phoneNumber === '' || errorData.email === '') {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorData]);

  useEffect(() => {
    setRemoteAccessGranted(selectedUnit.remoteAccessGranted);
  }, [selectedUnit.remoteAccessGranted]);

  function setFormValue(field, value) {
    setUserData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  useEffect(() => {
    if (
      selectedUnit.warrantyInfo &&
      selectedUnit.warrantyInfo.ODUWarrantyDetails
    ) {
      setUserData(prevData => ({
        ...prevData,
        phoneNumber: selectedUnit.warrantyInfo.ODUWarrantyDetails.phoneNumber,
      }));
    }
  }, [selectedUnit]);

  function changeHandler(field, value, pattern) {
    setFormValue(field, value);
    let validation = validateInputField(value, pattern);
    setErrorValue(field, validation.errorText);
  }

  function setErrorValue(field, value) {
    setErrorData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  function sendRequest() {
    var date = new Date();
    /** Date is sent in mm/dd/yyyy format */
    var formattedDate = moment(date).format('MM/DD/YYYY');
    setFormValue('requestDate', formattedDate);
    let data = Object.assign(userData);
    // if (data.phoneNumber) {
    //   data.phoneNumber = Enum.phoneNumberPrefix + data.phoneNumber;
    // }
    data.requestDate = formattedDate;
    dispatch(ContractorActions.requestRemoteAccess(data));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {remoteAccessGranted !== null && remoteAccessGranted && (
        <Banner data={banner.accessGranted} />
      )}
      {/* {remoteAccessGranted !== null && !remoteAccessGranted && (
        <Banner data={banner.accessGranted} />
      )} */}
      {remoteRequestSent && !remoteAccessGranted && (
        <Banner data={banner.requestSent} />
      )}

      {!remoteRequestSent &&
        !remoteAccessGranted &&
        selectedUnit.systemStatus.toLowerCase() !== Enum.status.pending && (
          <Banner data={banner.accessDenied} />
        )}
      <View style={styles.padding20}>
        <View style={[styles.tooltipRow]}>
          <CustomText text={Dictionary.remoteRequest.title} />
          <InfoTooltip
            positionVertical="bottom"
            text={Dictionary.remoteRequest.tooltipText}
          />
        </View>
        <View style={[styles.spaceEvenly]}>
          <CustomInputText
            placeholder={Dictionary.remoteRequest.homeownerPhoneNumber}
            keyboardType="numeric"
            value={
              selectedUnit.homeOwnerDetails !== null &&
              selectedUnit.systemStatus.toLowerCase() !== Enum.status.pending &&
              selectedUnit.homeOwnerDetails.phoneNumber
                ? (userData.phoneNumber =
                    selectedUnit.homeOwnerDetails.phoneNumber)
                : userData.phoneNumber
            }
            delimiterType="phoneNumber"
            maxLength={Enum.phoneNumberPattern.length}
            disabled={
              selectedUnit.homeOwnerDetails !== null &&
              selectedUnit.systemStatus.toLowerCase() !== Enum.status.pending &&
              (selectedUnit.homeOwnerDetails.phoneNumber) &&
              remoteAccessGranted
                ? true
                : remoteAccessGranted
            }
            onChange={(text: any) =>
              changeHandler('phoneNumber', text, Enum.phoneNumberPattern)
            }
            isRequiredField={true}
            errorText={
              errorData.phoneNumber && userData.phoneNumber.length !== 0
                ? Dictionary.error.phoneNumberPatternError
                : ''
            }
          />
          <CustomText
            font="light-italic"
            size={14}
            text={Dictionary.remoteRequest.msgAndDataRatesApply}
          />
          {/* <CustomText
            text={Dictionary.remoteRequest.andOr}
            align="left"
            style={[styles.paddingVertical10, styles.marginTop30]}
          /> */}
          {/* <CustomInputText
            placeholder={Dictionary.remoteRequest.homeownerEmail}
            disabled={remoteAccessGranted}
            value={userData.email}
            onChange={(text: any) =>
              changeHandler('email', text, Enum.emailPattern)
            }
            isRequiredField={true}
            errorText={
              errorData.email && userData.email.length !== 0
                ? errorData.email
                : ''
            }
          /> */}
        </View>
      </View>
      <View style={[styles.buttonContainer, styles.padding20]}>
        {userData.requestDate != null && (
          <View>
            <CustomText
              color={Colors.black}
              size={12}
              font={'light-italic'}
              text={
                Dictionary.remoteRequest.lastRequestSentOn +
                ' ' +
                userData.requestDate
              }
              newline={true}
            />
          </View>
        )}
        <Button
          disabled={
            selectedUnit.homeOwnerDetails !== null &&
            selectedUnit.systemStatus.toLowerCase() !== Enum.status.pending &&
            selectedUnit.homeOwnerDetails.phoneNumber &&
            !remoteAccessGranted
              ? false
              : !formValid || remoteAccessGranted
          }
          text={Dictionary.button.sendRequest}
          type="primary"
          onPress={() => {
            demoMode
              ? showToast(Dictionary.demoMode.functionNotAvailable, 'info')
              : sendRequest();
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  flex1: {
    flex: 1,
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  alignCenter: {
    alignItems: 'center',
  },
  padding5: {
    padding: 5,
  },
  padding10: {
    padding: 10,
  },
  padding20: {
    padding: 20,
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  marginTop30: {
    marginTop: 30,
  },
});
