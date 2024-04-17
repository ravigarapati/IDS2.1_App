/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TextStyle,
  KeyboardTypeOptions,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import {Colors, Typography} from '../styles';
import CustomText from './CustomText';
import InfoTooltip from './InfoTooltip';
import {Image} from 'react-native';
import BoschIcon from './BoschIcon';

type customInputTextProps = {
  style?: TextStyle | TextStyle[];
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  errorText?: string;
  value?: string;
  onChange?: any;
  maxLength?: number;
  Icon?: any;
  isSvgIcon?: boolean;
  iconColor?: string;
  iconSize?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  delimiterType?:
    | 'none'
    | 'phoneNumber'
    | 'serialNumber'
    | 'bluetoothId'
    | 'postalCode';
  isRequiredField?: boolean;
  tooltip?: string;
  autoopenTooltip?: boolean;
  secureTextEntry?: boolean;
  buttonFunctionality?: any;
  buttonLabel?: any;
  showButton?: boolean;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  onSubmitEditing?: any;
  testID?: string;
  containerColor?: string;
  placeholderTextColor?: string;
  prStyle?: boolean;
  icon?: any;
  disableCache?: any;
  allowFontScaling?: boolean;
};

export default function CustomInputText({
  style,
  placeholder,
  keyboardType = 'default',
  disabled = false,
  value,
  onChange,
  errorText = '',
  maxLength,
  Icon,
  isSvgIcon = false,
  iconColor = Colors.black,
  iconSize = 24,
  autoCapitalize = 'none',
  delimiterType = 'none',
  isRequiredField = false,
  tooltip = '',
  autoopenTooltip = false,
  secureTextEntry = false,
  buttonFunctionality = undefined,
  buttonLabel = undefined,
  showButton = true,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
  onSubmitEditing,
  testID = '',
  containerColor,
  placeholderTextColor,
  prStyle,
  icon = undefined,
  disableCache = true,
  allowFontScaling = false,
}: customInputTextProps) {
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureField, setIsSecureField] = useState(secureTextEntry);
  function handleTextChange(changedtext) {
    if (delimiterType !== 'none') {
      let delimitedText = addDelimiter(changedtext);
      onChange(delimitedText);
    } else {
      onChange(changedtext);
    }
    setIsInputChanged(true);
  }
  const delimeterData = {
    phoneNumber: {index: [3, 7], delimiter: '-', regex: /-/g},
    serialNumber: {index: [4, 8, 15], delimiter: '-', regex: /-/g},
    bluetoothId: {index: [5, 8], delimiter: '_', regex: /_/g},
    postalCode: {index: [3], delimiter: ' ', regex: / /g},
  };
  const splitAt = index => x => [x.slice(0, index), x.slice(index)];

  function addDelimiter(text) {
    var delimeterIndexList = delimeterData[delimiterType].index;
    var delimiterChar = delimeterData[delimiterType].delimiter;
    var len = text.length;
    if (len > value.length) {
      text = text.replace(delimeterData[delimiterType].regex, '');
      delimeterIndexList.forEach(index => {
        if (len >= index) {
          text = splitAt(index)(text).join(delimiterChar);
        }
      });
    }
    return text;
  }

  const underlineColor =
    errorText !== ''
      ? Colors.darkRed
      : disabled
      ? Colors.grayDisabled
      : Colors.black;

  return (
    <View style={[styles.container, {backgroundColor: containerColor}]}>
      {(isInputChanged || isFocused || value !== '') && (
        <Text
          style={[
            allowFontScaling == undefined || !allowFontScaling
              ? styles.inputTextLabel
              : styles.inputTextLabelNoScale,
            disabled ? {color: 'rgba(191, 192, 194, 1)'} : {},
          ]}>
          {placeholder}
          {isRequiredField && value === '' && (
            <Text style={{color: Colors.darkRed}}> *</Text>
          )}
        </Text>
      )}
      {tooltip !== '' ? (
        <View>
          <View
            style={[
              {borderBottomColor: underlineColor},
              allowFontScaling == undefined || !allowFontScaling
                ? styles.textInput
                : styles.textInputAllow,
              styles.textInputView,
              isFocused && styles.backgroundFocus,
              style,
            ]}>
            <TextInput
              autoCorrect={disableCache}
              spellCheck={disableCache}
              testID={testID}
              style={[
                Platform.OS === 'ios' && styles.paddingVertical10,
                {borderBottomColor: underlineColor},
                isFocused && styles.backgroundFocus,
                {flex: 1},
                allowFontScaling == undefined || !allowFontScaling
                  ? {...Typography.boschReg16}
                  : {...Typography.boschReg16NoScale},
                disabled ? {color: 'rgba(191, 192, 194, 1)'} : {},
                {color: '#000'},
                prStyle === true && value != '' && {padding: 0},
              ]}
              placeholderTextColor={
                placeholderTextColor ? placeholderTextColor : Colors.mediumGray
              }
              //placeholder={
              //  isFocused ? '' : placeholder + (isRequiredField ? '*' : '')
              //}
              keyboardType={keyboardType}
              value={value}
              editable={!disabled}
              selectTextOnFocus={!disabled}
              onChangeText={changedtext => handleTextChange(changedtext)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              blurOnSubmit
              maxLength={maxLength}
              underlineColorAndroid="transparent"
              autoCapitalize={autoCapitalize}
              secureTextEntry={isSecureField}
              onSubmitEditing={onSubmitEditing}
              accessibilityLabel={
                accessibilityLabelText ? accessibilityLabelText : ''
              }
              accessibilityHint={
                accessibilityHintText ? accessibilityHintText : ''
              }
            />
            <Text style={styles.placeholder}>
              {isFocused || value !== '' ? '' : placeholder}
              {isRequiredField && (
                <Text style={styles.mandatoryPlaceholder}>
                  {isFocused || value !== '' ? '' : '*'}
                </Text>
              )}
            </Text>

            <InfoTooltip
              positionHorizontal="right"
              positionVertical="bottom"
              showDefault={autoopenTooltip}
              text={tooltip}
              accessiblityLabel={
                'Opens a tooltip to get more information about this input field'
              }
            />
          </View>
          {errorText !== '' && (
            <CustomText
              align="left"
              size={12}
              font="medium"
              color={Colors.darkRed}
              text={errorText}
              style={styles.errorTextLabel}
            />
          )}
        </View>
      ) : (
        <View>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              autoCorrect={disableCache}
              spellCheck={disableCache}
              style={[
                style,
                allowFontScaling == undefined || !allowFontScaling
                  ? styles.textInput
                  : styles.textInputAllow,
                Platform.OS === 'ios' && styles.paddingVertical10,
                {borderBottomColor: underlineColor},
                isFocused && styles.backgroundFocus,
                disabled ? {color: 'rgba(191, 192, 194, 1)'} : {},
                prStyle ? {flex: 1} : {width: '100%'},
                prStyle === true && value != '' && {padding: 0},
              ]}
              placeholderTextColor={
                placeholderTextColor ? placeholderTextColor : Colors.mediumGray
              }
              //placeholder={
              //  isFocused ? '' : placeholder + (isRequiredField ? '*' : '')
              //}
              keyboardType={keyboardType}
              testID={testID}
              value={value}
              editable={!disabled}
              selectTextOnFocus={!disabled}
              onChangeText={changedtext => handleTextChange(changedtext)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              blurOnSubmit
              maxLength={maxLength}
              underlineColorAndroid="transparent"
              autoCapitalize={autoCapitalize}
              secureTextEntry={isSecureField}
              onSubmitEditing={onSubmitEditing}
              accessibilityLabel={
                accessibilityLabelText
                  ? accessibilityLabelText +
                    (secureTextEntry
                      ? isSecureField
                        ? 'Secure field, currently hidden'
                        : 'Secure field, currently shown'
                      : '')
                  : ''
              }
              accessibilityHint={
                accessibilityHintText ? accessibilityHintText : ''
              }
            />
            {icon != '' && value != '' && (
              <BoschIcon
                name={icon}
                size={iconSize}
                color={iconColor}
                style={[
                  style,
                  styles.iconStyle,
                  Platform.OS === 'ios' && styles.paddingVertical10,
                  {borderBottomColor: underlineColor},
                  {padding: 0},
                  isFocused && styles.backgroundFocus,
                ]}
              />
            )}
          </View>

          <Text style={[styles.placeholder, styles.topMargin10]}>
            {isFocused || value !== '' ? '' : placeholder}
          </Text>
          {secureTextEntry && (
            <Pressable
              style={{
                position: 'absolute',
                top: isSecureField ? 13 : 15,
                right: 10,
              }}
              onPress={() => setIsSecureField(!isSecureField)}>
              {isSecureField ? (
                <Image
                  accessibilityLabel={'Button to show private info.'}
                  style={{resizeMode: 'contain'}}
                  source={require('./../assets/images/watch-off.png')}
                />
              ) : (
                <Image
                  accessibilityLabel={'Button to hide private info.'}
                  source={require('./../assets/images/watch-on.png')}
                />
              )}
            </Pressable>
          )}
          {buttonFunctionality && showButton && (
            <Pressable
              style={{position: 'absolute', right: 10, top: 10}}
              onPress={buttonFunctionality}>
              {buttonLabel}
            </Pressable>
          )}
          {errorText !== '' && (
            <CustomText
              align="left"
              size={12}
              font="medium"
              color={Colors.darkRed}
              text={errorText}
              style={styles.errorTextLabel}
            />
          )}
        </View>
      )}
      {isSvgIcon ? (
        <View
          style={{
            position: 'absolute',
            top:
              isFocused == true && errorText !== ''
                ? 0
                : isFocused == true && errorText == ''
                ? 24
                : isFocused == false && errorText !== ''
                ? 0
                : isFocused == false && errorText == ''
                ? 10
                : 0,
            right: 10,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon fill="#000" width={15} height={15} />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            top:
              isFocused == true && errorText !== ''
                ? 0
                : isFocused == true && errorText == ''
                ? 24
                : isFocused == false && errorText !== ''
                ? 0
                : isFocused == false && errorText == ''
                ? 10
                : 0,
            right: 10,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={Icon} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    // borderColor: Colors.darkRed,
    // borderWidth: 1,
  },
  inputTextLabel: {
    ...Typography.boschMedium12,
    color: Colors.black,
    // paddingVertical: 3,
    paddingHorizontal: 10,
  },
  inputTextLabelNoScale: {
    ...Typography.boschMedium12NoScale,
    color: Colors.black,
    // paddingVertical: 3,
    paddingHorizontal: 10,
  },
  errorTextLabel: {
    paddingVertical: 3,
  },
  backgroundFocus: {
    backgroundColor: Colors.lightGray,
  },
  textInput: {
    ...Typography.boschReg16,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    color: Colors.black,
  },
  textInputAllow: {
    ...Typography.boschReg16NoScale,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    color: Colors.black,
  },
  iconStyle: {
    borderBottomWidth: 1,
    paddingHorizontal: 5,
  },
  paddingVertical10: {
    paddingVertical: 10,
  },
  textInputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    fontSize: 17,
    color: Colors.mediumGray,
    zIndex: -1,
  },
  topMargin10: {
    top: 10,
  },
  mandatoryPlaceholder: {
    color: Colors.darkRed,
  },
});
