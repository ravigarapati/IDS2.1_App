import React, {useState} from 'react';
import {View, StyleSheet, Text, TextStyle} from 'react-native';
import {Colors, Typography} from '../styles';
import {Dictionary} from '../utils/dictionary';
import ModalSelector from 'react-native-modal-selector';
import {BoschIcon, CustomText} from '.';
import {Icons} from '../utils/icons';

type modalSelectorProps = {
  style?: TextStyle | TextStyle[];
  placeholderStyle?: TextStyle | TextStyle[];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: any;
  options?: any;
  iteratorKey?: string;
  iteratorLabel?: string;
  errorText?: string;
  showFieldLabel?: boolean;
  isRequiredField?: boolean;
  prStyle?: boolean;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  allowFontScaling?: boolean;
};

export default function CustomPicker({
  style,
  placeholder = Dictionary.createProfile.pleaseSelect,
  disabled = false,
  value,
  onChange,
  options = [],
  iteratorKey = 'label',
  iteratorLabel = 'value',
  errorText = '',
  showFieldLabel = false,
  isRequiredField = false,
  prStyle = false,
  accessibilityLabelText = undefined,
  accessibilityHintText = undefined,
  allowFontScaling = false,
}: modalSelectorProps) {
  const [showLabel, setShowLabel] = useState(false);

  function handleValueChange(val) {
    if (val !== 0) {
      onChange(val);
      setShowLabel(true);
    }
  }
  return (
    <View
      style={[
        style,
        styles.container,
        {borderBottomColor: disabled ? Colors.grayDisabled : Colors.black},
      ]}>
      {showFieldLabel && value !== '' && (
        <Text style={[styles.inputTextLabel, prStyle === true && {padding: 0}]}>
          {placeholder}
        </Text>
      )}
      <ModalSelector
        data={options}
        disabled={disabled}
        keyExtractor={item => item[iteratorKey]}
        labelExtractor={item => item[iteratorLabel]}
        supportedOrientations={['portrait']}
        onChange={itemValue => handleValueChange(itemValue)}
        closeOnChange={true}
        initValue={placeholder}
        selectedKey={value}
        optionTextStyle={styles.optionTextStyle}
        backdropPressToClose={true}
        overlayStyle={styles.overlayStyle}
        selectStyle={styles.selectStyle}>
        <View
          accessible={true}
          accessibilityLabel={
            accessibilityLabelText ? accessibilityLabelText : ''
          }
          accessibilityRole={'menu'}
          accessibilityHint={accessibilityHintText ? accessibilityHintText : ''}
          style={[styles.internalTextElement, styles.spaceBetween]}>
          <View style={styles.placeholderStyle}>
            {value ? (
              <CustomText
                allowFontScaling={allowFontScaling}
                text={value}
                align="left"
                color={disabled ? Colors.grayDisabled : Colors.black}
              />
            ) : (
              <View style={{flexDirection: 'row'}}>
                <CustomText
                  allowFontScaling={allowFontScaling}
                  text={placeholder}
                  align="left"
                  color={Colors.mediumGray}
                  newline={false}
                />
              </View>
            )}
          </View>
          <View style={styles.pickerIcon}>
            <BoschIcon
              name={Icons.down}
              color={disabled ? Colors.grayDisabled : Colors.black}
              size={25}
              accessibilityLabel={placeholder + 'Picker'}
              style={{height: 25}}
            />
          </View>
        </View>
      </ModalSelector>
      {errorText !== '' && (
        <CustomText
          allowFontScaling={allowFontScaling}
          align="left"
          size={12}
          font="medium"
          color={Colors.darkRed}
          text={errorText}
          style={styles.errorTextLabel}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderBottomColor: Colors.black,
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  picker: {
    ...Typography.boschReg16,
    color: Colors.black,
    borderColor: Colors.transparent,
    borderBottomColor: Colors.black,
  },
  pickerIcon: {
    alignItems: 'flex-end',
    marginLeft: 5,
  },
  pickerContent: {
    color: Colors.darkGray,
    backgroundColor: 'transparent',
  },
  inputTextLabel: {
    ...Typography.boschMedium12,
    color: Colors.black,
    paddingBottom: 10,
  },
  placeholderStyle: {
    color: Colors.mediumGray,
    marginLeft: 5,
  },
  errorTextLabel: {
    paddingVertical: 3,
  },
  optionTextStyle: {color: Colors.black},
  overlayStyle: {backgroundColor: Colors.darkGray, opacity: 0.9},
  selectStyle: {borderColor: Colors.transparent},
  internalTextElement: {flexDirection: 'row'},
  spaceBetween: {
    justifyContent: 'space-between',
  },
});
