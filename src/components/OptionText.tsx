import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Dictionary} from '../utils/dictionary';
import {Colors} from '../styles';
import CustomText from './CustomText';
import RadioButton from './Radiobutton';

type OptionProps = {
  option: any;
  disable: boolean;
  setWasChanged: any;
  setCurrent: any;
  showIcon?: boolean;
  renderIcon: any;
  currentSelected: any;
  enableHint: string;
  disableHint: string;
  borderBottomColorIsDisabled?: boolean;
  showChildren?: boolean;
  renderChildren?: any;
  showDescription?: boolean;
  accessibilityLabelText?: string;
  optionFontSize?: number;
  descriptionFontSize?: number;
};

export default function OptionText({
  option,
  setWasChanged,
  setCurrent,
  showIcon,
  renderIcon,
  currentSelected,
  disable,
  enableHint,
  disableHint,
  borderBottomColorIsDisabled,
  showChildren,
  renderChildren,
  showDescription,
  optionFontSize,
  descriptionFontSize,
  accessibilityLabelText = undefined,
}: OptionProps) {
  return (
    <View
      key={`${option.name} container`}
      style={
        borderBottomColorIsDisabled
          ? styles.optionContainer2
          : styles.optionContainer
      }>
      <Pressable
        onPress={() => {
          setWasChanged(true);
          setCurrent(option.id);
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
        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View key={`${option.name} subcontainer`}>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {showIcon ? (
              <View style={{paddingRight: 16}}>{renderIcon(option)}</View>
            ) : null}
            <CustomText
              allowFontScaling={true}
              color={disable ? Colors.grayDisabled : Colors.black}
              font={'medium'}
              key={option.name}
              text={option.name}
              align={'left'}
              size={optionFontSize ? optionFontSize : 18}
            />
          </View>
          {showDescription ? (
            <View style={{width: '90%', marginBottom: 10}}>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'regular'}
                text={option.description}
                align={'left'}
                size={descriptionFontSize ? descriptionFontSize : 16}
              />
            </View>
          ) : null}
        </View>
        <View>
          <RadioButton
            testID={option.name}
            disabled={disable}
            key={`${option.name} radio`}
            checked={currentSelected === option.id}
            handleCheck={value => {
              setWasChanged(true);
              setCurrent(option.id);
            }}
            text=""
            containerStyle={{marginRight: -10}}
          />
        </View>
      </Pressable>
      {showChildren ? renderChildren() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  optionContainer2: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
