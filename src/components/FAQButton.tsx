import React from 'react';
import {AccessibilityRole, Pressable, StyleSheet} from 'react-native';
import CustomText from './CustomText';
import {Colors} from '../styles';

type FAQButtonProps = {
  text: string;
  isPressed: boolean;
  onPress: any;
  accessibilityLabelText?: string;
  accessibilityHintText?: string;
  accessibilityRoleText?: AccessibilityRole;
};

export default function FAQButton({
  text,
  isPressed,
  onPress,
  accessibilityLabelText,
  accessibilityHintText,
  accessibilityRoleText,
}: FAQButtonProps) {
  return (
    <Pressable
      accessible={true}
      accessibilityLabel={
        accessibilityLabelText ? accessibilityLabelText : undefined
      }
      accessibilityRole={
        accessibilityRoleText ? accessibilityRoleText : undefined
      }
      accessibilityHint={
        accessibilityHintText ? accessibilityHintText : undefined
      }
      onPress={() => onPress(text)}
      style={[
        styles.container,
        {
          backgroundColor: isPressed
            ? Colors.mediumBlue
            : Colors.grayBackground,
        },
      ]}>
      <CustomText
        color={isPressed ? Colors.white : Colors.black}
        text={text}
        size={12}
        font={'regular'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 50,
    marginBottom: 24,
  },
});
