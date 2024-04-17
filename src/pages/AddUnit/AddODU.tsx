/**
 * @file Add new unit. Lets Contractor add a new unit.
 * @author Krishna Priya Elango
 *
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {Colors} from '../../styles';
import {
  CustomText,
  Button,
  CustomInputText,
  CodeScanner,
} from '../../components';
import {Dictionary} from '../../utils/dictionary';
import {Enum} from '../../utils/enum';
import {showToast} from '../../components/CustomToast';
import {useDispatch} from 'react-redux';
import * as ContractorActions from '../../store/actions/ContractorActions';
import {validateInputField} from '../../utils/Validator';
import {Icons} from '../../utils/icons';
import UserAnalytics from '../../components/UserAnalytics';
import {scanButton} from '../../utils/ScanPermissions';

export default function AddODU(props: any) {
  const dispatch = useDispatch();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [errorText, setErrorText] = useState('');
  const onChangeTextHandler = (text, pattern) => {
    setSerialNumber(text);
    let validation = validateInputField(text, pattern);
    if (validation.errorText && validation.errorText !== '') {
      setErrorText(Dictionary.error.serialNumberError);
    } else {
      setErrorText('');
    }
  };

  UserAnalytics('ids_add_odu');

  useEffect(() => {
    let pattern = new RegExp(Enum.serialNumberPattern.pattern);
    if (scannedData) {
      if (pattern.test(scannedData)) {
        setSerialNumber(scannedData);
        showToast(Dictionary.common.oduScanned, 'success');
        setErrorText('');
        setScannedData('');
      } else {
        showToast(Dictionary.error.notEligible, 'error');
        setScannedData('');
        setSerialNumber('');
      }
    }
  }, [scannedData]);

  return (
    <View style={{flex: 1}}>
      {!showScanner && (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <View style={styles.barcodeTitle}>
              <View style={styles.titleText}>
                <CustomText
                  text={Dictionary.addUnit.scanOdu}
                  font="medium"
                  size={21}
                />
              </View>
            </View>
            <CustomText newline={true} text={Dictionary.addUnit.oduText} />
            <Image
              style={styles.image}
              source={require('../../assets/images/oduBarcode.png')}
            />
            <Button
              style={styles.padVertical15}
              text={Dictionary.button.scanBarcode}
              type="primary"
              onPress={() => scanButton(setShowScanner)}
              icon={Icons.barcodeScan}
            />
            <CustomText newline={true} text={Dictionary.common.or} />
            <CustomText
              newline={true}
              text={Dictionary.addUnit.enterSerialNumber}
            />
            <CustomInputText
              placeholder={Dictionary.addUnit.oduInputText}
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
            <View style={styles.buttonContainer}>
              <Button
                style={styles.padTop30}
                disabled={errorText !== '' || serialNumber === ''}
                type="primary"
                text={Dictionary.button.submit}
                onPress={() =>
                  dispatch(
                    ContractorActions.verifyOduSerialNumber(
                      serialNumber,
                      props.navigation,
                    ),
                  )
                }
              />
            </View>
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
    // flexGrow: 1,
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
