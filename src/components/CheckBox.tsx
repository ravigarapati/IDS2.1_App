import React, { useState } from 'react';
import BoschIcon from './BoschIcon';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Colors} from '../styles';
import CustomText from './CustomText';
import {Icons} from '../utils/icons';

type checkBoxProps = {
  checked: boolean;
  onChange?: any;
  style?: {};
  textStyle?: {};
  text?: string;
  props?: any;
  accessibilityLabel?: string;
  lines?: number;
  disabled?: boolean;
};

export default function CheckBox({
  checked,
  onChange,
  style,
  textStyle,
  text,
  accessibilityLabel,
  lines,
  disabled = false,
  ...props
}: checkBoxProps) {

  const [showText, setShowText] = useState(false) 

  return (
    <View style={[styles.container, style]} {...props}>
      <TouchableOpacity
        onPress={() => {
          !disabled ? onChange(!checked) : null;
        }}
        style={text && styles.marginRight10}
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{checked: checked}}>
        <View
          style={[
            checked ? styles.checkBoxSelected : styles.checkBoxUnselected,
          ]}>
          {checked && (
            <BoschIcon name={Icons.checkmark} size={24} color={Colors.white} style={{height: 24}} />
          )}
        </View>
      </TouchableOpacity>
      {text && 
      <View>
      {!lines &&<CustomText style={textStyle} text={text} align="left" />}
      {lines &&( 
      <View>  
        <CustomText style={textStyle} text={text} noOfLines={showText ? undefined : lines} align="left" />
        <TouchableOpacity onPress={() => setShowText(!showText)}>
          <CustomText style={textStyle} color={Colors.mediumBlue} text={showText ? 'Show less' : 'Show more' } align="left" />
        </TouchableOpacity>
      </View>
        )}
        </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginVertical: 20,
  },
  checkBoxSelected: {
    backgroundColor: Colors.darkBlue,
    width: 24,
    height: 24,
  },
  checkBoxUnselected: {
    backgroundColor: Colors.mediumGray,
    width: 24,
    height: 24,
  },
  marginRight10: {
    marginRight: 10,
  },
});
