import React, {useEffect} from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {Colors, Typography} from '../styles';
import {scaleFont} from '../styles/mixins';
type CustomTextProps = {
  style?: TextStyle | TextStyle[];
  font?: 'regular' | 'bold' | 'light' | 'medium' | 'light-italic';
  size?: number;
  align?: 'center' | 'left' | 'right' | 'justify';
  color?: string;
  text?: any;
  newline?: boolean;
  noOfLines?: number;
  accessible?: boolean;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  ref?: any;
  children?: any;
  allowFontScaling?: boolean;
};
export default function CustomText({
  font,
  style,
  size = 16,
  align = 'center',
  color = Colors.black,
  text = 'Text',
  newline = false,
  noOfLines = 0,
  accessible = true,
  accessibilityLabelText = '',
  accessibilityHintText = '',
  ref,
  children,
  allowFontScaling = false,
}: CustomTextProps) {
  if (newline) {
    text = text + '\n';
  }
  let textStyle = {};
  switch (font) {
    case 'regular':
      textStyle = styles.regular;
      break;
    case 'bold':
      textStyle = styles.bold;
      break;
    case 'light':
      textStyle = styles.light;
      break;
    case 'medium':
      textStyle = styles.medium;
      break;
    case 'light-italic':
      textStyle = styles.lightItalic;
      break;
    default:
      textStyle = styles.regular;
      break;
  }

  const alignment = {textAlign: align};
  const textColor = {color: color};
  const customSize = {
    fontSize: size,
    lineHeight: size * 1.5,
    flexShrink: 1,
  };
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;

  // To bold text within a sentence --wrapTags
  // Works for only one occurence in a sentence
  const wrapTags = txt => {
    const textArray = txt ? txt.toString().split(/(\*.*\*)/g) : '';
    if (textArray && textArray.length > 0) {
      textArray.forEach((element, i) => {
        if (/\*.*\*/g.test(element)) {
          textArray[i] = (
            <Text ref={ref} key={i} style={styles.bold}>
              {element.replace(/\*/g, '')}
            </Text>
          );
        }
      });
    }
    return textArray;
  };
  text = wrapTags(text);

  return (
    <Text
      accessible={accessible}
      accessibilityLabel={
        accessibilityLabelText ? accessibilityLabelText : undefined
      }
      accessibilityHint={
        accessibilityHintText ? accessibilityHintText : undefined
      }
      // allowFontScaling={true}
      numberOfLines={noOfLines}
      style={[
        {...alignment},
        {...textColor},
        !allowFontScaling
          ? {...customSize}
          : {fontSize: size, lineHeight: size * 1.5},
        //{...customSize},
        textStyle,
        {...passedStyles},
      ]}>
      {text}
      {children ? children : null}
    </Text>
  );
}
const styles = StyleSheet.create({
  regular: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
  bold: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  light: {
    fontFamily: Typography.FONT_FAMILY_LIGHT,
  },
  medium: {
    fontFamily: Typography.FONT_FAMILY_MEDIUM,
  },
  lightItalic: {
    fontFamily: Typography.FONT_FAMILY_LIGHT_ITALIC,
  },
});
