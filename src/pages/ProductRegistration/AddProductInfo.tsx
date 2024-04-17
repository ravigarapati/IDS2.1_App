/**
 * @file Add Product Information. Lets Contractor add product information for registrations.
 * @author Joel Macias
 *
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Colors, Typography} from '../../styles';
import {
  CustomText,
  Button,
  CustomInputText,
  CodeScanner,
  BoschIcon,
  SectionHeading,
  ToggleButton,
} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import {Enum} from '../../utils/enum';
import {NavigationActions, StackActions} from 'react-navigation';
import {showToast} from '../../components/CustomToast';
import {useDispatch, useSelector} from 'react-redux';
import * as ContractorActions from '../../store/actions/ContractorActions';
import {validateInputField} from '../../utils/Validator';
import {Icons} from '../../utils/icons';
import moment from 'moment';
import UserAnalytics from '../../components/UserAnalytics';
import {scanButton} from '../../utils/ScanPermissions';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Mock} from '../../utils/Mock';

export default function AddProductInfo(props) {
  const dispatch = useDispatch();
  const today = new Date();
  const demoMode = useSelector(state => state.notification.demoStatus);
  const minimumDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
  const [validDate, setValidDate] = useState(demoMode ? true : false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const productInfo = useSelector(state => state.contractor.prProductInfo);
  const [modelNumber, setModelNumber] = useState(productInfo.modelNumber);
  const [description, setDescription] = useState(
    productInfo.productDescription,
  );
  const [serialNumber, setSerialNumber] = useState(productInfo.serialNumber);
  const [applicationType, setApplicationType] = useState(
    productInfo.applicationType,
  );
  const [errorText, setErrorText] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [productData, setProductData] = useState({
    serialNumber: demoMode
      ? Mock.productRegistration.productInfo[0].serialNumber
      : productInfo.serialNumber,
    modelNumber: demoMode
      ? Mock.productRegistration.productInfo[0].modelNumber
      : productInfo.modelNumber,
    productDescription: demoMode
      ? Mock.productRegistration.productInfo[0].productDescription
      : productInfo.productDescription,
    installationDate: demoMode
      ? Mock.productRegistration.productInfo[0].installationDate
      : productInfo.installationDate,
    applicationType: demoMode
      ? Mock.productRegistration.productInfo[0].applicationType
      : productInfo.applicationType,
  });

  UserAnalytics('ids_add_pr_productInfo');

  function getProductInfo(value) {
    let data = {
      serialNumber: value,
    };
    dispatch(ContractorActions.verifyPRSerialNumber(data)).then(() => {});
  }
  const onApplicationTypeChange = value => {
    setApplicationType(value);
    setProductData(prevData => ({
      ...prevData,
      applicationType: value,
    }));
  };

  const onSerialNumberChange = (value, pattern) => {
    setProductData(prevData => ({
      ...prevData,
      serialNumber: value,
    }));
    setSerialNumber(value);
    if (value.slice(value.lastIndexOf('-') + 1, 20) === '5178') {
      pattern = Enum.prSerialNumberPattern23;
    }
    let validation = validateInputField(value, pattern);
    if (!validation.match) {
      setErrorText(Dictionary.error.prSerialNumberError);
    } else {
      setErrorText('');
      getProductInfo(value);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setProductData(prevData => ({
        ...prevData,
        installationDate: selectedDate,
      }));
      setValidDate(true);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  function scanAction() {
    scanButton(setShowScanner);
    props.scannerStatus(true);
  }

  useEffect(() => {
    let pattern = new RegExp(Enum.prSerialNumberPattern.pattern);
    var value;
    if (scannedData !== '') {
      // Checks if scanned data has '-'
      if (!scannedData.includes('-')) {
        let first = scannedData.slice(0, 4);
        let second = scannedData.slice(4, 7);
        let third = scannedData.slice(7, 13);
        let last = scannedData.slice(13, scannedData.length);
        value = first + '-' + second + '-' + third + '-' + last;
      } else {
        value = scannedData;
      }
      if (value.slice(value.lastIndexOf('-') + 1, 20) === '5178') {
        pattern = new RegExp(Enum.prSerialNumberPattern23.pattern);
      }
      if (pattern.test(value)) {
        onSerialNumberChange(value, Enum.prSerialNumberPattern);
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

  useEffect(() => {
    if (!demoMode) {
      setProductData(prevData => ({
        ...prevData,
        //serialNumber: productInfo.serialNumber,
        modelNumber: productInfo.modelNumber,
        productDescription: productInfo.productDescription,
      }));
      if (
        productInfo.modelNumber === '' &&
        productInfo.productDescription === '' &&
        productInfo.serialNumber === ''
      ) {
        setProductData(prevData => ({
          ...prevData,
          serialNumber: productInfo.serialNumber,
        }));
        setErrorText('');
      } else if (
        productInfo.modelNumber === '' &&
        productInfo.productDescription === '' &&
        serialNumber != ''
      ) {
        setErrorText('Invalid serial number');
      }
      if (productInfo.installationDate === null) {
        setValidDate(false);
        setShowDatePicker(false);
      }
    }
  }, [productInfo]);

  useEffect(() => {
    if (
      errorText === '' &&
      productData.serialNumber != '' &&
      productData.modelNumber != '' &&
      productData.productDescription != '' &&
      validDate === true &&
      productData.applicationType != 2
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [productData, errorText, validDate]);

  function setCurrentStepValue(stepNumber) {
    dispatch(ContractorActions.setCurrentStep(stepNumber));
  }

  function setProductInfo() {
    let product = {
      serialNumber: productData.serialNumber,
      modelNumber: productData.modelNumber,
      productDescription: productData.productDescription,
      installationDate: productData.installationDate,
      applicationType: productData.applicationType,
    };
    dispatch(ContractorActions.setProductInfo(product));
    setCurrentStepValue(1);
  }
  return (
    <View style={{flex: 1}}>
      {!showScanner && (
        <ScrollView contentContainerStyle={styles.graycontainer}>
          <Button
            text={Dictionary.button.scanBarcode}
            type="secondary"
            onPress={() => scanAction()}
            icon={Icons.qrCode}
            disabled={demoMode}
          />

          <Button
            type="tertiary"
            textStyle={{textDecorationLine: 'underline'}}
            text={Dictionary.button.snLocator}
            icon={Icons.search}
            onPress={() => props.navigation.navigate('SerialNumberLocator')}
          />

          <CustomText newline={false} text={Dictionary.common.or} size={12} />
          <CustomInputText
            placeholder={Dictionary.productRegistration.serialNumber}
            onChange={val =>
              onSerialNumberChange(val, Enum.prSerialNumberPattern)
            }
            value={productData.serialNumber}
            maxLength={26}
            isRequiredField={true}
            errorText={errorText ? errorText : ''}
            autoCapitalize="characters"
            delimiterType="serialNumber"
            containerColor={Colors.lightGray}
            placeholderTextColor={Colors.black}
            prStyle={true}
            icon={errorText === '' ? Icons.checkmark : ''}
            iconColor={Colors.darkGreen}
            iconSize={30}
            disabled={demoMode}
          />
        </ScrollView>
      )}
      {!showScanner && (
        <ScrollView contentContainerStyle={styles.container}>
          <CustomInputText
            placeholder={Dictionary.productRegistration.modelNumber}
            value={productData.modelNumber}
            //maxLength={15}
            autoCapitalize="characters"
            isRequiredField={true}
            disabled={true}
            prStyle={true}
            style={{color: Colors.darkRed}}
          />
          <CustomInputText
            placeholder={Dictionary.productRegistration.description}
            value={productData.productDescription}
            //maxLength={15}
            autoCapitalize="characters"
            isRequiredField={true}
            disabled={true}
            prStyle={true}
            style={{color: Colors.darkRed}}
          />
          {!demoMode && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(!showDatePicker)}>
              {validDate && (
                <Text style={styles.inputTextLabel}>
                  {Dictionary.productRegistration.installationDate}
                  <Text style={{color: Colors.darkRed}}> *</Text>
                </Text>
              )}
              <View
                style={validDate ? styles.datepickerFilled : styles.datepicker}>
                <CustomText
                  text={
                    validDate
                      ? moment(productData.installationDate).format(
                          'MM-DD-YYYY',
                        )
                      : Dictionary.productRegistration.installationDate
                  }
                  style={
                    validDate ? {paddingVertical: 5} : styles.padVertical10
                  }
                />
                <BoschIcon
                  name={Icons.calendar}
                  size={25}
                  color={Colors.darkBlue}
                  accessibilityLabel={'date picker'}
                />
              </View>
            </TouchableOpacity>
          )}
          {demoMode && (
            <CustomInputText
              placeholder={Dictionary.productRegistration.installationDate}
              value={moment(productData.installationDate).format('MM-DD-YYYY')}
              //maxLength={15}
              autoCapitalize="characters"
              isRequiredField={true}
              disabled={true}
              prStyle={true}
              style={{color: Colors.darkRed}}
            />
          )}
          {showDatePicker && (
            <DateTimePicker
              onChange={(event, selectedDate) => {
                onDateChange(event, selectedDate);
              }}
              value={validDate ? productData.installationDate : today}
              maximumDate={today}
              minimumDate={minimumDate}
              mode="date"
              onTouchCancel={() => setShowDatePicker(false)}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )}
        </ScrollView>
      )}
      {!showScanner && (
        <View style={{backgroundColor: Colors.white, paddingTop: 10}}>
          <SectionHeading
            title={Dictionary.installationDashboard.applicationType}
            info={Dictionary.installationDashboard.applicationTypeInfo}
            tooltipPosition="top"
          />
          <ToggleButton
            button1={Dictionary.productRegistration.commercial}
            button2={Dictionary.productRegistration.residential}
            style={styles.padding20}
            pressed={productData.applicationType}
            onChange={val => (!demoMode ? onApplicationTypeChange(val) : null)}
            disabled={demoMode}
          />

          <View style={styles.buttonContainer}>
            <Button
              style={styles.padding20}
              disabled={!formValid}
              type="primary"
              text={Dictionary.button.next}
              onPress={() => setProductInfo()}
            />
          </View>
        </View>
      )}
      {showScanner && (
        <CodeScanner
          data={setScannedData}
          onClose={() => {
            setShowScanner(false);
            props.scannerStatus(false);
          }}
          height={(Dimensions.get('screen').height * 2) / 3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    // marginHorizontal: 20,
    padding: 20,
    flexGrow: 1,
  },
  graycontainer: {
    backgroundColor: Colors.lightGray,
    // marginHorizontal: 20,
    padding: 10,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  image: {
    margin: 20,
    alignSelf: 'center',
  },
  barcodeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    alignSelf: 'center',
    flex: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  padVertical10: {
    paddingTop: 10,
  },
  padVertical15: {
    paddingVertical: 15,
  },
  padTop30: {
    paddingTop: 30,
  },
  padding20: {
    padding: 20,
  },
  datepicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 10,
  },
  datepickerFilled: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  inputTextLabel: {
    ...Typography.boschMedium12,
    color: Colors.black,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
});
