import React from 'react';
import {View, Image, StyleSheet, Pressable} from 'react-native';
import CustomText from './CustomText';

type DeviceSettingProps = {
  name: string;
  Icon: any;
  onPress: any;
  accessibilityHintText?: string;
  isSvg?: boolean;
  testID?: string;
};

export default function DeviceSetting({
  name,
  Icon,
  onPress,
  accessibilityHintText,
  isSvg,
  testID = '',
}: DeviceSettingProps) {
  return (
    <Pressable
      testID={testID}
      accessible={true}
      accessibilityRole="button"
      accessibilityHint={accessibilityHintText}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.informationContainer}>
        <View style={styles.image}>
          {isSvg === undefined || isSvg ? (
            <Icon fill="#000" />
          ) : (
            <Image source={Icon} />
          )}
        </View>
        <CustomText
          text={name}
          align={'left'}
          allowFontScaling={true}
          size={16}
        />
      </View>
      <Image
        source={require('./../assets/images/Arrow.png')}
        style={styles.nextImage}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  informationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 70,
    alignItems: 'center',
  },
  nextImage: {
    marginRight: 9,
  },
});
