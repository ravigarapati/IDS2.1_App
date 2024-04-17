import React from 'react';
import {View, TouchableHighlight, StyleSheet} from 'react-native';
import BoschIcon from './BoschIcon';
import {Colors} from '../styles';
import CustomText from './CustomText';
type Button = {
  text: string | number;
  type: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: {};
  commonStyle?: {};
  textStyle?: {};
  icon?: string;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  testID?: string;
};
export default function Button({
  text,
  onPress,
  type = 'primary',
  disabled = false,
  style,
  textStyle,
  commonStyle = {},
  icon = '',
  accessibilityLabelText = '',
  accessibilityHintText = '',
  testID = '',
}: Button) {
  const isDisabled = disabled;
  const disabledView =
    type === 'primary'
      ? {backgroundColor: Colors.grayDisabled}
      : {backgroundColor: Colors.white};

  var [isPress, setIsPress] = React.useState(false);

  var touchPropsPrimary = {
    activeOpacity: 1,
    underlayColor: Colors.blueOnPress,
    onPressOut: () => setIsPress(false),
    onPressIn: () => setIsPress(true),
  };

  var touchPropsSecondary = {
    activeOpacity: 1,
    underlayColor: Colors.white,
    onPressOut: () => setIsPress(false),
    onPressIn: () => setIsPress(true),
  };

  return (
    <View style={style}>
      {type === 'primary' && (
        <TouchableHighlight
          testID={testID}
          accessibilityLabel={
            accessibilityLabelText ? accessibilityLabelText : undefined
          }
          accessibilityHint={
            accessibilityHintText ? accessibilityHintText : undefined
          }
          importantForAccessibility={
            disabled === true ? 'no-hide-descendants' : 'auto'
          }
          accessibilityElementsHidden={disabled === true ? true : false}
          onPress={onPress}
          disabled={isDisabled}
          {...touchPropsPrimary}
          style={[
            styles.common,
            commonStyle,
            styles.primaryContainer,
            isDisabled ? disabledView : {},
            isPress
              ? styles.borderOnPress
              : isDisabled
              ? styles.borderDisabled
              : styles.border,
          ]}
          accessibilityRole={'button'}>
          <View style={styles.flexRow}>
            {icon !== '' && (
              <BoschIcon
                size={20}
                name={icon}
                color={Colors.white}
                style={styles.icon}
              />
            )}
            <CustomText
              allowFontScaling={true}
              style={{...textStyle}}
              text={text.toString()}
              color={Colors.white}
            />
          </View>
        </TouchableHighlight>
      )}
      {type === 'secondary' && (
        <TouchableHighlight
          testID={testID}
          accessibilityLabel={
            accessibilityLabelText ? accessibilityLabelText : undefined
          }
          accessibilityHint={
            accessibilityHintText ? accessibilityHintText : undefined
          }
          importantForAccessibility={
            disabled === true ? 'no-hide-descendants' : 'auto'
          }
          accessibilityElementsHidden={disabled === true ? true : false}
          onPress={onPress}
          disabled={isDisabled}
          {...touchPropsSecondary}
          style={[
            styles.common,
            isDisabled ? disabledView : {},
            commonStyle,
            isPress
              ? styles.borderOnPress
              : isDisabled
              ? styles.borderDisabled
              : styles.border,
          ]}
          accessibilityRole={'button'}>
          <View style={styles.flexRow}>
            {icon !== '' && (
              <BoschIcon
                size={20}
                name={icon}
                color={
                  isPress
                    ? Colors.blueOnPress
                    : isDisabled
                    ? Colors.grayDisabled
                    : Colors.darkBlue
                }
                style={styles.icon}
              />
            )}
            <CustomText
              allowFontScaling={true}
              style={{...textStyle}}
              text={text.toString()}
              color={
                isPress
                  ? Colors.blueOnPress
                  : isDisabled
                  ? Colors.grayDisabled
                  : Colors.darkBlue
              }
            />
          </View>
        </TouchableHighlight>
      )}
      {type === 'tertiary' && (
        <TouchableHighlight
          testID={testID}
          accessibilityLabel={
            accessibilityLabelText ? accessibilityLabelText : undefined
          }
          accessibilityHint={
            accessibilityHintText ? accessibilityHintText : undefined
          }
          importantForAccessibility={
            disabled === true ? 'no-hide-descendants' : 'auto'
          }
          accessibilityElementsHidden={disabled === true ? true : false}
          onPress={onPress}
          disabled={isDisabled}
          {...touchPropsSecondary}
          style={[styles.tertiary, isDisabled ? disabledView : {}]}
          accessibilityRole={'button'}>
          <View style={styles.flexRow}>
            {icon !== '' && (
              <BoschIcon
                size={20}
                name={icon}
                color={
                  isPress
                    ? Colors.blueOnPress
                    : isDisabled
                    ? Colors.grayDisabled
                    : Colors.darkBlue
                }
                style={styles.icon}
              />
            )}
            <CustomText
              allowFontScaling={true}
              style={{...textStyle}}
              text={text.toString()}
              color={
                isPress
                  ? Colors.blueOnPress
                  : isDisabled
                  ? Colors.grayDisabled
                  : Colors.darkBlue
              }
            />
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  common: {
    paddingVertical: 15,
    marginVertical: 5,
    alignItems: 'center',
  },
  border: {
    borderColor: Colors.darkBlue,
    borderWidth: 1,
  },
  borderOnPress: {
    borderColor: Colors.blueOnPress,
    borderWidth: 1,
  },
  borderDisabled: {
    borderColor: Colors.grayDisabled,
    borderWidth: 1,
  },
  icon: {
    paddingRight: 5,
    height: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryContainer: {
    backgroundColor: Colors.darkBlue,
  },
  tertiary: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});
