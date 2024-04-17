import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import InfoTooltip from './InfoTooltip';
import CustomText from './CustomText';
import { Colors } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BoschIcon from './BoschIcon';
import { Icons } from '../utils/icons';

type SectionHeadingProps = {
  title: string;
  info?: string;
  tooltipPosition?: 'top' | 'bottom';
  navigation?: any;
};
export default function SectionHeading({
  title,
  info,
  tooltipPosition = 'top',
  navigation,
}: SectionHeadingProps) {
  return (
    <View
      accessible={true}
      style={[
        styles.sectionHeading,
        info ? styles.paddingVertical5 : styles.paddingVertical15,
      ]}>
      <CustomText
        accessibilityLabelText={`${title} section`}
        align="left"
        font="bold"
        text={title}
      />
      {info && <InfoTooltip text={info} positionVertical={tooltipPosition} />}
      {navigation && <TouchableOpacity onPress={navigation}><BoschIcon color='#004975' name={Icons.edit} size={25} /></TouchableOpacity>}

    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: Colors.lightGray,
  },
  paddingVertical5: {
    paddingVertical: 5,
  },
  paddingVertical15: {
    paddingVertical: 15,
  },
});
