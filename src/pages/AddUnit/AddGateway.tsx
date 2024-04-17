/**
 * @file Add new unit. Lets Contractor add a new unit.
 * @author Krishna Priya Elango
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
} from 'react-native';
import {Colors} from '../../styles';
import {
  CustomText,
  Button,
  CustomInputText,
  CodeScanner,
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

export default function AddGateway(props: any) {
  const dispatch = useDispatch();
  const selectedUnit = useSelector(state => state.contractor.selectedUnit);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [bluetoothID, setBluetoothID] = useState('');
  const [bluetoothPassword, setBluetoothPassword] = useState('');
  const [gatewayID, setGatewayID] = useState('');
  const [errorText, setErrorText] = useState({
    bluetoothId: null,
    bluetoothPassword: null,
    gatewayId: null,
  });
  const [formValid, setFormValid] = useState(false);
  UserAnalytics('ids_add_gateway');
  const bluetoothIdOnChange = (text, pattern) => {
    if (text.length === 1) {
      text = 'BOSCH_HP_' + text;
    } else {
      let identifier = text.slice(9, text.length);
      text = 'BOSCH_HP_' + identifier;
    }
    setBluetoothID(text);
    let validation = validateInputField(text, pattern);
    if (validation.errorText && validation.errorText !== '') {
      setError('bluetoothId', Dictionary.error.bluetoothIdError);
    } else {
      setError('bluetoothId', '');
    }
  };

  const bluetoothPasswordOnChange = (text, pattern) => {
    setBluetoothPassword(text);
    let validation = validateInputField(text, pattern);
    if (validation.errorText && validation.errorText !== '') {
      setError('bluetoothPassword', Dictionary.error.patternError);
    } else {
      setError('bluetoothPassword', '');
    }
  };

  const gatewayIdOnChange = (text, pattern) => {
    setGatewayID(text);
    let validation = validateInputField(text, pattern);
    if (validation.errorText && validation.errorText !== '') {
      setError('gatewayId', Dictionary.error.serialNumberError);
    } else {
      setError('gatewayId', '');
    }
  };

  const resetAction = StackActions.reset({
    index: 1,
    actions: [
      NavigationActions.navigate({
        routeName: 'ContractorHome',
        params: {tab: 'list'},
      }),
      NavigationActions.navigate({routeName: 'AddUnitSuccess'}),
    ],
  });

  const screenType = props.navigation.state.routeName;

  useEffect(() => {
    function reset() {
      setBluetoothID('');
      setBluetoothPassword('');
      setGatewayID('');
      setError('bluetoothId', null);
      setError('bluetoothPassword', null);
      setError('gatewayId', null);
    }
    if (scannedData) {
      let data = scannedData
        .replace(/“/g, '"')
        .replace(/”/g, '"')
        .replace('.', '')
        .replace('""', '","')
        .replace('"MID","', '"MID":"');
      if (
        (data.includes('BID') && data.includes('PIN') && data.includes('SN')) ||
        (data.includes('BID') &&
          data.includes('PIN') &&
          data.includes('SN') &&
          data.includes('MID'))
      ) {
        try {
          let jsonData = JSON.parse('{' + data + '}');
          setBluetoothID(jsonData.BID);
          setBluetoothPassword(jsonData.PIN);
          setGatewayID(jsonData.SN);
          showToast(Dictionary.common.gatewayScanned, 'success');
          setError('bluetoothId', '');
          setError('bluetoothPassword', '');
          setError('gatewayId', '');
        } catch (error) {
          showToast(Dictionary.error.invalidQrCode, 'error');
          reset();
        }
      } else {
        showToast(Dictionary.error.invalidQrCode, 'error');
        reset();
      }
    }
    setScannedData('');
  }, [scannedData]);

  function setError(field, value) {
    setErrorText(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }

  useEffect(() => {
    if (
      errorText.bluetoothId === '' &&
      errorText.bluetoothPassword === '' &&
      errorText.gatewayId === ''
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [errorText]);

  const onSubmit = () => {
    let data = {};
    if (screenType === 'ReplaceGateway') {
      data = {
        gatewayId: gatewayID,
        oldGatewayId: selectedUnit.gateway.gatewayId,
        bluetoothId: bluetoothID,
        bluetoothPassword: bluetoothPassword,
      };
    } else {
      data = {
        ODUSerialNumber: selectedUnit.odu.serialNumber,
        gatewayId: gatewayID,
        bluetoothId: bluetoothID,
        bluetoothPassword: bluetoothPassword,
        ODUModelNumber: selectedUnit.odu.modelNumber,
        lastWorkedOn: moment(new Date()).format('MM/DD/YYYY'),
      };
    }

    dispatch(
      screenType === 'ReplaceGateway'
        ? ContractorActions.replaceGateway(data, props.navigation)
        : ContractorActions.addGatewayUnit(data, resetAction, props.navigation),
    );
  };
  return (
    <View style={{flex: 1}}>
      {!showScanner && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.barcodeTitle}>
            <View style={styles.titleText}>
              <CustomText
                text={Dictionary.addUnit.scanGateway}
                font="medium"
                size={21}
                align="center"
              />
            </View>
          </View>
          <CustomText
            newline={true}
            text={
              screenType === 'ReplaceGateway'
                ? Dictionary.addUnit.scanGatewayTextReplace
                : Dictionary.addUnit.scanGatewayText
            }
          />

          <Image
            style={styles.image}
            source={require('../../assets/images/powerUpODUHighlighted.jpg')}
          />

          <Button
            style={styles.padVertical15}
            text={Dictionary.button.scanQrcode}
            type="primary"
            onPress={() => scanButton(setShowScanner)}
            icon={Icons.qrCode}
          />
          <CustomText newline={true} text={Dictionary.common.or} />
          <CustomText
            newline={true}
            text={Dictionary.addUnit.enterGatewayDetails}
          />
          <CustomInputText
            placeholder={Dictionary.addUnit.bluetoothId}
            onChange={val => bluetoothIdOnChange(val, Enum.bluetoothIdPattern)}
            value={bluetoothID}
            maxLength={15}
            autoCapitalize="characters"
            isRequiredField={true}
            errorText={errorText.bluetoothId ? errorText.bluetoothId : ''}
            delimiterType="bluetoothId"
          />
          <CustomInputText
            placeholder={Dictionary.addUnit.bluetoothPassword}
            onChange={val =>
              bluetoothPasswordOnChange(val, Enum.bluetoothPasswordPattern)
            }
            value={bluetoothPassword}
            maxLength={6}
            keyboardType="visible-password"
            isRequiredField={true}
            errorText={
              errorText.bluetoothPassword ? errorText.bluetoothPassword : ''
            }
          />
          <CustomInputText
            placeholder={Dictionary.addUnit.gatewayId}
            onChange={val => gatewayIdOnChange(val, Enum.serialNumberPattern)}
            value={gatewayID}
            maxLength={26}
            isRequiredField={true}
            errorText={errorText.gatewayId ? errorText.gatewayId : ''}
            autoCapitalize="characters"
            delimiterType="serialNumber"
          />

          <View style={styles.buttonContainer}>
            <Button
              style={styles.padTop30}
              disabled={!formValid}
              type="primary"
              text={Dictionary.button.submit}
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
    // marginHorizontal: 20,
    padding: 20,
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
  padVertical15: {
    paddingVertical: 15,
  },
  padTop30: {
    paddingTop: 30,
  },
});
