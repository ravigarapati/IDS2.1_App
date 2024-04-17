import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import OptionText from '../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
  ModalComponent,
  CustomInputText,
} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {connect} from 'react-redux';
import {validateInputField} from '../utils/Validator';

import GearsImage from '../assets/images/gears.svg';

import LockIcon from '../assets/images/Lock-screen.svg';

const ScreenAdvancedSettings = ({navigation, selectedDevice}) => {
  const accessCodePattern = {
    minlength: 4,
    maxlength: 4,
    required: true,
    pattern: '1886',
  };

  const [manualEntryError, setManualEntryError] = useState({
    accessCode: '',
  });
  const [manualEntry, setManualEntry] = useState({
    accessCode: '',
  });

  useEffect(() => {}, []);

  const [value, setValue] = React.useState('');
  const timeout = React.useRef(null);

  const onChangeHandler = value => {
    value = value.replace(/[^0-9]/g, '');
    changeHandlerManualEntry('accessCode', value, accessCodePattern);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (value == '1886') {
        setManualEntry({accessCode: ''});
        navigation.navigate('ScreenAdvancedSettings2');
      }
    }, 100);
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <CustomText
              text={'Advanced Settings'}
              size={21}
              allowFontScaling={true}
              font="medium"
              style={{
                marginVertical: 8,
              }}
            />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <ScrollView>
        <View>
          <View style={{paddingHorizontal: 15}}>
            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 25,
                },
              ]}>
              <View style={{marginBottom: 15}}>
                <GearsImage width={75} height={75} fill="#000" />
              </View>
              <View style={{paddingHorizontal: 10}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'regular'}
                  text={
                    'Advanced settings allows installers to configure system and thermostat settings'
                  }
                  align={'center'}
                  size={16}
                />
              </View>
            </View>
            <View>
              <CustomInputText
                accessibilityLabelText="Access code."
                accessibilityHintText="Input the access code to access to the advanced settings of the device."
                testID="CodeTextInput"
                placeholder={
                  Dictionary.bccDashboard.settings.advanced_settingsScreen
                    .accessCode
                }
                keyboardType={'numeric'}
                value={manualEntry.accessCode}
                maxLength={4}
                isRequiredField={true}
                onChange={val => {
                  onChangeHandler(val);
                }}
                errorText={
                  manualEntryError.accessCode
                    ? Dictionary.bccDashboard.settings.advanced_settingsScreen
                        .accessCode
                    : ''
                }
                Icon={LockIcon}
                isSvgIcon={true}
              />
            </View>
            <View style={styles.tipSection}>
              <BoschIcon
                size={20}
                name={Icons.infoTooltip}
                color={Colors.mediumBlue}
                accessibilityLabel={'Info'}
              />
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={
                  'Professional Access Code is required to access Advanced Settings.'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'Professional Access Code is required to access Advanced Settings.'
                }
                style={[styles.flexShrink1, styles.paddingLeft5]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
    paddingVertical: 25,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 20,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 12,
  },
  marginHorizontal10: {marginHorizontal: 10},
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
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

export default connect(mapStateToProps)(ScreenAdvancedSettings);
