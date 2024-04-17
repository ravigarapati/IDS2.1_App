import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import CustomText from './CustomText';
import {Colors} from '../styles';

type RadiobuttonProps = {
  style?: any;
  checked: boolean;
  handleCheck?: any;
  text?: string;
  containerStyle?: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  disabled?: boolean;
  testID?: string;
};

const Radiobutton = ({
  checked,
  handleCheck,
  text,
  style,
  containerStyle,
  accessibilityLabelText = '',
  accessibilityHintText = '',
  disabled = false,
  testID = '',
}: RadiobuttonProps) => {
  return (
    <View
      accessible={true}
      accessibilityLabel={
        accessibilityLabelText ? accessibilityLabelText : undefined
      }
      accessibilityHint={
        accessibilityHintText ? accessibilityHintText : undefined
      }
      onAccessibilityTap={() => handleCheck()}
      style={[{flexDirection: 'row'}, containerStyle]}>
      <TouchableOpacity
        testID={testID}
        disabled={disabled}
        onPress={() => {
          handleCheck();
        }}>
        <View
          style={[
            styles.radioButton,
            {
              backgroundColor: disabled
                ? Colors.grayDisabled
                : checked
                ? 'rgba(0, 73, 117, 1)'
                : 'rgba(164, 171, 179, 1)',
            },
          ]}>
          {checked ? <View style={styles.checkedRadioButton} /> : null}
        </View>
      </TouchableOpacity>
      <CustomText
        size={16}
        text={`  ${text}`}
        allowFontScaling={true}
        style={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedRadioButton: {
    height: 15,
    width: 15,
    borderRadius: 12,
    borderColor: 'blue',
    backgroundColor: 'white',
  },
});

export default Radiobutton;
