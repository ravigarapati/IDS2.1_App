import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import CustomText from './CustomText';
import RadioButton from './Radiobutton';

type OptionProps = {
  option: any;
  disable: boolean;
  setWasChanged: any;
  setCurrent: any;
  renderIcon: any;
  currentSelected: any;
  enableHint: string;
  disableHint: string;
  borderBottomColorIsDisabled?: boolean;
};

export default function Option({
  option,
  setWasChanged,
  setCurrent,
  renderIcon,
  currentSelected,
  disable,
  enableHint,
  disableHint,
  borderBottomColorIsDisabled,
}: OptionProps) {
  return (
    <Pressable
      onPress={() => {
        if (!disable) {
          setWasChanged(true);
          setCurrent(option.id);
        }
      }}
      accessible={true}
      accessibilityLabel={`${option.name}`}
      accessibilityRole={'radiogroup'}
      accessibilityHint={disable ? enableHint : disableHint}
      accessibilityActions={[{name: 'activate'}]}
      onAccessibilityAction={() => {
        setWasChanged(true);
        setCurrent(option.id);
      }}
      importantForAccessibility={
        disable === true ? 'no-hide-descendants' : 'auto'
      }
      accessibilityElementsHidden={disable === true ? true : false}
      key={`${option.name} container`}
      style={
        borderBottomColorIsDisabled
          ? styles.optionContainer2
          : styles.optionContainer
      }>
      <View key={`${option.name} subcontainer`} style={{flexDirection: 'row'}}>
        <View style={{paddingHorizontal: 16}}>{renderIcon(option)}</View>

        <CustomText
          allowFontScaling={true}
          color={disable ? Colors.grayDisabled : Colors.black}
          font={'medium'}
          key={option.name}
          text={option.description}
          align={'left'}
          size={18}
        />
      </View>

      <RadioButton
        disabled={disable}
        key={`${option.name} radio`}
        checked={currentSelected === option.id}
        handleCheck={value => {
          setWasChanged(true);
          setCurrent(option.id);
        }}
        text=""
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContainer2: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
