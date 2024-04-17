import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Linking,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  AppState,
  Pressable,
} from 'react-native';
import {
  BoschIcon,
  Button,
  CodeScanner,
  CustomInputText,
  CustomText,
  ModalComponent,
} from '../components';
import {validateInputField} from '../utils/Validator';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {PERMISSIONS, request} from 'react-native-permissions';
import {Dictionary} from '../utils/dictionary';
import {showToast} from '../components/CustomToast';
import {
  checkNewDevice,
  updateFirmware,
} from '../store/actions/HomeOwnerActions';
import {connect} from 'react-redux';
import {Enum} from '../utils/enum';

const AddBccUpdate = ({checkNewDevice, updateFirmware, navigation}) => {
  const [findQrCore, setFindQrCode] = useState(false);
  const [stepCounter, setStepCounter] = useState(0);
  const [showUpdateModal, setShowupdateModal] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    macId: '',
    tvc: '',
  });
  const [manualEntryError, setManualEntryError] = useState({
    macId: '',
    tvc: '',
  });

  const grantCameraAccess = () => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    ).then(res => {
      if (res === 'blocked' || res === 'denied') {
        Alert.alert(
          Dictionary.addDevice.addBcc.cameraNotAuthorized,
          Dictionary.addDevice.addBcc.changeSettings,
          [
            {
              text: Dictionary.button.close,
              onPress: () => setStepCounter(0),
              style: 'cancel',
            },
            {
              text: Dictionary.button.change,
              onPress: () => Linking.openSettings(),
              style: 'default',
            },
          ],
        );
      } else {
        setStepCounter(1);
        //setManualEntrySelected(false);
      }
    });
  };

  const FindQRTooltip = ({number, text, ADA}) => {
    return (
      <View
        style={{flexDirection: 'row', marginBottom: 6}}
        accessible={true}
        accessibilityLabel={`${number}. ${ADA}`}>
        <CustomText
          allowFontScaling={true}
          text={`${number}.`}
          style={{marginRight: 6}}
        />
        <CustomText allowFontScaling={true} align="left" text={text} />
      </View>
    );
  };

  const setMaualEntryValue = (field, value) => {
    setManualEntry(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const changeHandlerManualEntry = (field, value, pattern) => {
    setMaualEntryValue(field, value);
    let validation = validateInputField(value, pattern);
    setManualEntryErrorValue(field, validation.errorText);
  };

  const setManualEntryErrorValue = (field, value) => {
    setManualEntryError(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const setCancelShowScanner = () => {
    changeHandlerManualEntry('macId', '', Enum.macId);
    changeHandlerManualEntry('tvc', '', Enum.tvc);
    setManualEntryError({
      macId: '',
      tvc: '',
    });
    setStepCounter(0);
  };

  return (
    <View style={{flex: 1}}>
      <Image
        style={styles.headerRibbon}
        source={require('../assets/images/header_ribbon.png')}
      />
      {stepCounter === 0 && (
        <View style={{paddingHorizontal: 20}}>
          <View
            accessible={true}
            accessibilityLabel={`${Dictionary.addDevice.addBcc.connectPhoneADA}. ${Dictionary.addDevice.addBcc.automaticEntry}. ${Dictionary.addDevice.addBcc.useScanBcc100Accessibility}`}>
            <CustomText
              allowFontScaling={true}
              style={{
                marginTop: 28,
              }}
              text={Dictionary.addDevice.addBcc.connectPhone}
              accessibilityLabelText={
                Dictionary.addDevice.addBcc.connectPhoneADA
              }
            />

            <CustomText
              allowFontScaling={true}
              style={styles.marginTop10}
              text={Dictionary.addDevice.addBcc.useScanBcc100}
              accessibilityLabelText={
                Dictionary.addDevice.addBcc.useScanBcc100Accessibility
              }
            />
          </View>
          <Button
            testID="ButtonOpenScanQr"
            style={styles.marginTop20}
            type="primary"
            onPress={grantCameraAccess}
            text={Dictionary.addDevice.addBcc.scanQr}
          />

          <>
            <Pressable
              testID="ButtonToOpenModalHelpFindQr"
              style={styles.findQrCodeButton}
              onPress={() => {
                setFindQrCode(true);
              }}>
              <BoschIcon
                size={20}
                name={Icons.infoTooltip}
                color={Colors.mediumBlue}
                accessibilityLabel={'Info'}
              />
              <View style={styles.marginLeft12}>
                <CustomText
                  allowFontScaling={true}
                  text={'Help me find my QR code'}
                  style={{
                    color: Colors.darkBlue,
                  }}
                />
                <CustomText
                  allowFontScaling={true}
                  accessibilityLabelText=" "
                  text={'____________________________'}
                  style={{
                    color: Colors.darkBlue,
                    marginTop: -23,
                  }}
                />
              </View>
            </Pressable>
          </>

          <>
            <CustomText
              allowFontScaling={true}
              style={styles.marginTop35}
              text="OR"
            />
            <Button
              testID="manualEntryButton"
              style={styles.marginTop41}
              type="secondary"
              onPress={() => {
                setStepCounter(2);
                //setManualEntrySelected(true);
              }}
              text={Dictionary.addDevice.addBcc.manualEntry1}
            />
          </>
        </View>
      )}
      {stepCounter === 1 && (
        <CodeScanner
          testID="qrScannerView"
          data={val => {
            const values = val.split('_');
            if (values[0] && values[1]) {
              //setShowupdateModal(true);
              checkNewDevice(
                {
                  deviceId: values[0],
                  code: values[1],
                  model: 'BCC100',
                },
                () => {
                  updateFirmware(
                    {
                      deviceId: values[0],
                      code: values[1],
                    },
                    () => {
                      setShowupdateModal(true);
                    },
                    () => {
                      setStepCounter(0);
                    },
                  );
                },
                error => {
                  const errorCode = error.split(' : ')[0];
                  if (errorCode === '201' || errorCode === '205') {
                    //setManualEntry({macId: values[0], tvc: values[1]});
                    //setAlreadyRegisteredModal(true);
                    updateFirmware(
                      {
                        deviceId: values[0],
                        code: values[1],
                      },
                      () => {
                        setShowupdateModal(true);
                      },
                      () => {
                        setStepCounter(0);
                      },
                    );
                  } else {
                    showToast(
                      error.includes(':') ? error.split(' : ')[1] : error,
                      'error',
                    );
                  }
                },
              );
            } else {
              showToast('Missing required parameters.', 'error');
            }
          }}
          onClose={() => {}}
          onCancel={setCancelShowScanner}
          textToDisplay={Dictionary.addDevice.addBcc.alignScanner}
        />
      )}

      {stepCounter === 2 && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}>
          <View
            style={[
              styles.flex1,
              {
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              },
            ]}>
            <View>
              <View
                accessible={true}
                accessibilityLabel={`${Dictionary.addDevice.addBcc.alignPhoneADA}. ${Dictionary.addDevice.addBcc.manualEntry} ${Dictionary.addDevice.addBcc.manualEntryInstructionsADA}`}>
                <CustomText
                  allowFontScaling={true}
                  style={styles.marginTop35}
                  text={Dictionary.addDevice.addBcc.alignPhone}
                  accessibilityLabelText={
                    Dictionary.addDevice.addBcc.alignPhone
                  }
                />
                <CustomText
                  allowFontScaling={true}
                  style={{marginTop: 46}}
                  text={Dictionary.addDevice.addBcc.manualEntry}
                  font="bold"
                />
                <CustomText
                  allowFontScaling={true}
                  style={{marginTop: 31}}
                  text={Dictionary.addDevice.addBcc.manualEntryInstructions}
                  accessibilityLabelText={
                    Dictionary.addDevice.addBcc.manualEntryInstructions
                  }
                />
              </View>

              <View>
                <View style={{marginTop: 30}}>
                  <CustomInputText
                    testID="macIdField"
                    allowFontScaling={true}
                    accessibilityLabelText={
                      'Device MAC ID. Current input: ' + manualEntry.macId
                    }
                    disableCache={false}
                    placeholder={Dictionary.addDevice.addBcc.deviceMacId}
                    value={manualEntry.macId}
                    maxLength={12}
                    isRequiredField={true}
                    onChange={val => {
                      changeHandlerManualEntry('macId', val, Enum.macId);
                    }}
                    errorText={
                      manualEntryError.macId
                        ? Dictionary.addDevice.addBcc.macIdRequired
                        : ''
                    }
                  />
                </View>
                <View style={{marginTop: 15}}>
                  <CustomInputText
                    testID="tvcField"
                    allowFontScaling={true}
                    accessibilityLabelText={
                      'Temporary verification code. Current input: ' +
                      manualEntry.tvc
                    }
                    disableCache={false}
                    placeholder={
                      Dictionary.addDevice.addBcc.temporaryVerificationCode
                    }
                    keyboardType={'numeric'}
                    value={manualEntry.tvc}
                    maxLength={4}
                    isRequiredField={true}
                    onChange={val => {
                      val = val.replace(/[^0-9]/g, '');
                      changeHandlerManualEntry('tvc', val, Enum.tvc);
                    }}
                    errorText={
                      manualEntryError.tvc
                        ? Dictionary.addDevice.addBcc.verificationCodeRequired
                        : ''
                    }
                  />
                </View>
              </View>
            </View>
            <Button
              disabled={
                manualEntryError.macId !== '' ||
                manualEntryError.tvc !== '' ||
                manualEntry.macId === '' ||
                manualEntry.tvc === ''
              }
              type="primary"
              testID="submitManualEntry"
              onPress={() => {
                //unit test purposes
                //setStepCounter(9);
                //setShowupdateModal(true);

                checkNewDevice(
                  {
                    deviceId: manualEntry.macId,
                    code: manualEntry.tvc,
                    model: 'BCC100',
                  },
                  () => {
                    //saveMacIdAndTvc();
                    updateFirmware(
                      {
                        deviceId: manualEntry.macId,
                        code: manualEntry.tvc,
                      },
                      () => {
                        setShowupdateModal(true);
                      },
                      () => {
                        setStepCounter(0);
                      },
                    );
                  },
                  error => {
                    //saveMacIdAndTvc();
                    console.log(error);
                    const errorCode = error.split(' : ')[0];
                    if (errorCode === '201' || errorCode === '205') {
                      //setManualEntry({macId: values[0], tvc: values[1]});
                      //setAlreadyRegisteredModal(true);
                      updateFirmware(
                        {
                          deviceId: manualEntry.macId,
                          code: manualEntry.tvc,
                        },
                        () => {
                          setShowupdateModal(true);
                        },
                        () => {
                          setStepCounter(0);
                        },
                      );
                    } else {
                      showToast(
                        error.includes(':') ? error.split(' : ')[1] : error,
                        'error',
                      );
                    }
                  },
                );
              }}
              text={'Submit'}
            />
          </View>
        </ScrollView>
      )}

      <ModalComponent
        modalVisible={showUpdateModal}
        closeModal={() => setShowupdateModal(false)}>
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.modalTitle}
          font="bold"
          style={{marginBottom: 20}}
          allowFontScaling={true}
        />
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.updateQueued}
          allowFontScaling={true}
        />
        <View
          style={{
            backgroundColor: '#D1E4FF',
            width: '100%',
            paddingVertical: 10,
            marginTop: 16,
            marginBottom: 16,
          }}>
          <CustomText
            text={Dictionary.addDevice.addBcc.firmwareUpdate.updateEstimate}
            style={{color: '#008ECF'}}
            allowFontScaling={true}
          />
        </View>
        <CustomText
          text={Dictionary.addDevice.addBcc.firmwareUpdate.updateNotify}
          allowFontScaling={true}
        />

        <View style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            accessibilityLabelText={
              Dictionary.addDevice.addBcc.firmwareUpdate.updateOfflineADA
            }
            allowFontScaling={true}
            size={12}
            align="left"
            newline={true}
            text={Dictionary.addDevice.addBcc.firmwareUpdate.updateOffline}
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
        <View style={{width: '100%'}}>
          <Button
            testID="updateButtonInModal"
            text={'Close'}
            type="primary"
            onPress={() => {
              setShowupdateModal(false);
              setStepCounter(0);
              navigation.navigate('HomeTabs');
              /*if (isBcc50Selected()) {
                setStepCounter(7);
              } else {
                setStepCounter(3);
              }*/
            }}
          />
        </View>
      </ModalComponent>

      <ModalComponent
        testID="ModalHelpFindQr"
        modalVisible={findQrCore}
        closeModal={() => setFindQrCode(false)}>
        <View style={{width: '98%'}}>
          <View accessible={true}>
            <CustomText
              allowFontScaling={true}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.findQrCode}.`}
              text={Dictionary.addDevice.addBcc.findQrCode}
              font={'bold'}
              color={Colors.darkGray}
              size={18}
              style={{marginBottom: 16}}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.qrCodeLocation}
              accessibilityLabelText={`${Dictionary.addDevice.addBcc.qrCodeLocationADA}.`}
              newline={true}
            />
            <CustomText
              allowFontScaling={true}
              text={Dictionary.addDevice.addBcc.stepsToFind}
              accessibilityLabelText={Dictionary.addDevice.addBcc.stepsToFind}
              style={{marginBottom: 6}}
            />

            <View style={{marginBottom: 24}}>
              <FindQRTooltip
                number={'1'}
                text={Dictionary.addDevice.addBcc.step1}
                ADA={Dictionary.addDevice.addBcc.step1ADA}
              />
              <FindQRTooltip
                number={'2'}
                text={Dictionary.addDevice.addBcc.step2}
                ADA={Dictionary.addDevice.addBcc.step2ADA}
              />
              <FindQRTooltip
                number={'3'}
                text={Dictionary.addDevice.addBcc.step3}
                ADA={Dictionary.addDevice.addBcc.step3ADA}
              />
              <FindQRTooltip
                number={'4'}
                text={Dictionary.addDevice.addBcc.step4}
                ADA={Dictionary.addDevice.addBcc.step4ADA}
              />
            </View>
          </View>

          <Button
            testID="CloseModalHelpFindQr"
            type="secondary"
            text={Dictionary.button.close}
            onPress={() => {
              setFindQrCode(false);
            }}
          />
        </View>
      </ModalComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  thirdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 37,
  },
  flex1: {
    flex: 1,
  },
  flexRowDirection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  marginTop35: {
    marginTop: 35,
  },
  marginTop32: {
    marginTop: 32,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop41: {
    marginTop: 41,
  },
  marginTop20: {
    marginTop: 20,
  },
  inputTextContainer: {
    flexDirection: 'row',
    marginTop: 33,
  },
  inputTextContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  grayColor: {
    color: 'rgba(213,213,213,1)',
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  confirmationPageContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  marginHorizontal10: {marginHorizontal: 10},
  findQrCodeButton: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marginLeft12: {marginLeft: 12},
  tipSection: {
    flexDirection: 'row',
    marginTop: 22,
    marginBottom: 14,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
});

const mapDispatchToProps = {
  checkNewDevice,
  updateFirmware,
};

export default connect(null, mapDispatchToProps)(AddBccUpdate);
