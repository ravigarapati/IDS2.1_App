import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
} from '../components';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';

type RuntimeOptionProps = {
  name: string;
  date: string;
  time: string;
  Icon: any;
  setup?: boolean;
  onPressButtonPrimary?: any;
  onPressButtonSecondary?: any;
  accessibilityHintText?: string;
  isSvg?: boolean;
  testIDReset?: string;
  testIDSetup?: string;
};

const RuntimeOption = ({
  name,
  date,
  time,
  Icon,
  setup,
  onPressButtonPrimary,
  onPressButtonSecondary,
  accessibilityHintText,
  isSvg,
  testIDReset,
  testIDSetup,
}: RuntimeOptionProps) => {
  return (
    <View style={styles.optionContainer}>
      <View
        style={{flexDirection: 'row', marginBottom: 15}}
        accessible={true}
        accessibilityLabel={`${name}. ${date}. ${time}.`}>
        <View style={{flexDirection: 'row', flex: 0.5}}>
          <View style={styles.image}>
            {isSvg === undefined || isSvg ? (
              <Icon fill="#000" />
            ) : (
              <Image source={Icon} />
            )}
          </View>
          <View>
            <View>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'bold'}
                text={name}
                align={'left'}
                size={16}
              />
            </View>
            <View>
              <CustomText
                allowFontScaling={true}
                color={Colors.black}
                font={'regular'}
                text={date}
                align={'left'}
                size={12}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <View>
            <CustomText
              allowFontScaling={true}
              color={Colors.black}
              font={'regular'}
              text={time}
              align={'left'}
              size={12}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexDirection: 'row',
        }}>
        <View style={{width: 170}}>
          {setup ? (
            <Button
              testID={testIDSetup}
              type="secondary"
              text={Dictionary.button.setup}
              onPress={onPressButtonSecondary}
            />
          ) : (
            false
          )}
        </View>

        <View style={{width: 170}}>
          <Button
            testID={testIDReset}
            type="primary"
            text={Dictionary.button.reset}
            onPress={onPressButtonPrimary}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
    paddingVertical: 25,
  },
  image: {
    marginRight: 15,
  },
});

export default RuntimeOption;
