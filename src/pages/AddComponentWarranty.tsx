/**
 * @file Add components for Warranty Registration.
 * @author Krishna Priya Elango
 *
 */
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {
  CustomText,
  InfoTooltip,
  Button,
  CustomInputText,
  BoschIcon,
  Link,
} from '../components';
import {Colors, Typography} from '../styles';
import CodeScanner from '../components/CodeScanner';
import {Dictionary} from '../utils/dictionary';
import {useSelector, useDispatch} from 'react-redux';
import * as ContractorActions from '../store/actions/ContractorActions';
import {Enum} from '../utils/enum';
import DateTimePicker from '@react-native-community/datetimepicker';
import {showToast} from '../components/CustomToast';
import {validateInputField} from '../utils/Validator';
import {Icons} from '../utils/icons';
import moment from 'moment';
import UserAnalytics from '../components/UserAnalytics';
import {scanButton} from '../utils/ScanPermissions';

export default function InstallationRemoteAccess(props: any) {
  const dispatch = useDispatch();
  var warrantyDetails = useSelector(
    state => state.contractor.selectedUnit.warrantyInfo,
  );
  const title =
    props.navigation.getParam('title').replace('Add', '') +
    Dictionary.common.serialNumber;
  const today = new Date();
  const minimumDate = new Date(new Date().getFullYear() - 1, 0, 1);
  const [date, setDate] = useState(today);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [errorText, setErrorText] = useState('');
  const isODU = props.navigation.getParam('type') === 'ODU' ? true : false;
  const componentType = props.navigation.getParam('type');
  const image = Enum.images[componentType];
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const contractorId = useSelector(
    state => state.contractor.contractorDetails.contractorId,
  );
  const accessToken = useSelector(
    state => state.contractor.prTokenDetails.prToken,
  );

  const type = props.navigation.getParam('type').toLowerCase();
  UserAnalytics('ids_register_' + type);

  const onChangeTextHandler = (text, pattern) => {
    setSerialNumber(text);
    let validation = validateInputField(text, pattern);
    if (validation.errorText && validation.errorText !== '') {
      setErrorText(Dictionary.error.serialNumberError);
    } else {
      setErrorText('');
    }
  };

  useEffect(() => {
    let pattern = new RegExp(Enum.serialNumberPattern.pattern);
    if (scannedData !== '') {
      if (pattern.test(scannedData)) {
        setSerialNumber(scannedData);
        showToast(Dictionary.common.scannedSuccessfully, 'success');
        setErrorText('');
        setScannedData('');
      } else {
        showToast(Dictionary.error.invalidBarCode, 'error');
        setScannedData('');
        setSerialNumber('');
      }
    }
  }, [scannedData]);

  const onSubmit = () => {
    let warrantyData = {
      gatewayId: warrantyDetails.gatewayId,
      ODUSerialNumber: warrantyDetails.ODUSerialNumber,
      componentType: componentType,
      serialNumber: isODU ? warrantyDetails.ODUSerialNumber : serialNumber,
      installationDate: moment(date).format('MM/DD/YYYY'),
      registeredDate: moment(today).format('MM/DD/YYYY'),
      applicationType: warrantyDetails.applicationType,
    };
    let fullAddress = warrantyDetails.ODUWarrantyDetails.address;

    let addressList = fullAddress.split(',');
    let address = '';
    for (let i = 0; i < addressList.length - 3; i++) {
      address = address + ' ' + addressList[i];
    }
    let street = addressList[addressList.length - 4];
    let city = addressList[addressList.length - 3];
    let state = addressList[addressList.length - 2];
    let zipCode = addressList[addressList.length - 1];

    let name = warrantyDetails.ODUWarrantyDetails.name;
    let email = warrantyDetails.ODUWarrantyDetails.email;

    let phoneNumber =
      warrantyDetails &&
      warrantyDetails.ODUWarrantyDetails &&
      warrantyDetails.ODUWarrantyDetails.phoneNumber;

    let registryData = {
      SerialNumber: isODU ? warrantyDetails.ODUSerialNumber : serialNumber,
      InstallationDate: moment(date).format('MM/DD/YYYY'),
      ReferenceCode: '',
      ExtendedWarranty: false,
      Address: {
        Name: name,
        Street: street,
        Line2: '',
        PostalCode: zipCode,
        City: city,
        Province: state,
        CountryCode: 'US',
      },
      ContractorId: contractorId,
      Questionnaire: {
        ApplicationType: warrantyDetails.applicationType
          ? Enum.residential.toLowerCase()
          : Enum.commercial.toLowerCase(),
        Consent:
          'Yes, I have read and acknowledge the third party consent disclosure',
        Email: email,
        PhoneNumber: phoneNumber,
      },
      AccessToken: accessToken,
    };
    //dispatch(ContractorActions.productRegistrationSetHomeowner(userData));
    dispatch(ContractorActions.installationDashboardRegister(registryData));
    dispatch(ContractorActions.addComponent(warrantyData, props.navigation));
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <View style={{flex: 1}}>
      {!showScanner && (
        <ScrollView contentContainerStyle={styles.container}>
          {isODU && (
            <View>
              <CustomText
                text={Dictionary.common.outdoorUnit}
                font="bold"
                align="left"
              />
              <CustomText
                text={
                  Dictionary.common.serialNumber +
                  ': ' +
                  warrantyDetails.ODUSerialNumber
                }
                align="left"
                size={12}
              />
              <CustomText
                text={
                  Dictionary.common.modelNumber +
                  ': ' +
                  warrantyDetails.ODUModelNumber
                }
                align="left"
                size={12}
              />
            </View>
          )}
          {!isODU && (
            <View>
              <View style={styles.titleRow}>
                <CustomText text={title} align="left" />
                {/* <InfoTooltip positionVertical="bottom">
                  <Image style={styles.image} source={image} />
                </InfoTooltip> */}
              </View>
              <Image style={styles.image} source={image} />
              <Button
                type="primary"
                text={Dictionary.button.scanBarcode}
                style={styles.padVertical20}
                onPress={() => scanButton(setShowScanner)}
                icon={Icons.barcodeScan}
              />
              <CustomText text={Dictionary.common.or} newline={true} />
              <CustomText
                text={Dictionary.installationDashboard.typeSerialNumber}
                align="left"
                newline={true}
              />
              <View>
                <CustomInputText
                  placeholder={title}
                  onChange={val =>
                    onChangeTextHandler(val, Enum.serialNumberPattern)
                  }
                  value={serialNumber}
                  maxLength={26}
                  autoCapitalize="characters"
                  isRequiredField={true}
                  errorText={errorText}
                  delimiterType="serialNumber"
                />
              </View>
            </View>
          )}

          <View style={styles.padVertical20}>
            <Text style={styles.datePickerTitle}>
              {Dictionary.installationDashboard.installationDate}
              <Text style={{color: Colors.darkRed}}> * </Text>
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.datepicker}>
                <CustomText
                  text={moment(date).format('MM/DD/YYYY')}
                  style={styles.padVertical10}
                />
                <BoschIcon
                  name={Icons.calendar}
                  size={25}
                  color={Colors.darkBlue}
                  accessibilityLabel={'date picker'}
                  style={{height: 25}}
                />
              </View>
            </TouchableOpacity>
            <Text style={[styles.star, styles.padVertical10]}>
              {'* '}
              <Text style={styles.disclaimer}>
                {Dictionary.installationDashboard.installationDateInfo}
              </Text>
            </Text>
            {/* <Text style={[styles.star]}>
              {'* '}
              <Text style={[styles.disclaimer]}>
                {Dictionary.installationDashboard.installationAbc}
                <Link
                  text={Dictionary.installationDashboard.installationAbcLink}
                  url={Dictionary.installationDashboard.installationAbcLink}
                  size={12}
                />
              </Text>
            </Text> */}
          </View>

          {showDatePicker && (
            <DateTimePicker
              onChange={(event, selectedDate) => {
                onDateChange(event, selectedDate);
              }}
              value={date}
              maximumDate={today}
              minimumDate={minimumDate}
              mode="date"
              onTouchCancel={() => setShowDatePicker(false)}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button
              disabled={isODU ? false : errorText !== '' || serialNumber === ''}
              text={Dictionary.button.register}
              type="primary"
              onPress={() => onSubmit()}
            />
          </View>
        </ScrollView>
      )}
      {showScanner && (
        <CodeScanner data={setScannedData} onClose={setShowScanner} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 20,
    flexGrow: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  padVertical20: {
    paddingVertical: 20,
  },
  padVertical10: {
    paddingVertical: 10,
  },
  datepicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    ...Typography.boschMedium12,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  disclaimer: {
    ...Typography.boschMedium12,
    color: Colors.black,
  },
  star: {
    color: Colors.darkRed,
  },
  image: {
    margin: 20,
    alignSelf: 'center',
  },
});
