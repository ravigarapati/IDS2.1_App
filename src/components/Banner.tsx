import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dictionary } from '../utils/dictionary';
import BoschIcon from './BoschIcon';
import CustomText from './CustomText';
import InfoTooltip from './InfoTooltip';
import Link from './Link';

type dataProps = {
  data: {
    background: string;
    iconColor: string;
    iconName: string;
    text: string;
    tooltipText?: string;
    warningBanner?: boolean;
  };
  navigation?: any;
};
export default function Banner({ data, navigation }: dataProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: data.background,
        },
      ]}>
      <View style={[
        styles.flexRow,
        data.warningBanner ? styles.warningBannerFlexRow : styles.iconFlexRow]}>
        <BoschIcon name={data.iconName} color={data.iconColor}
          style={data.warningBanner ? styles.warningBannerIcon : styles.icon} />
        <CustomText
          color={data.iconColor}
          style={[styles.textPadding]}
          text={data.text}
          align="left"
        />
      </View>
      {data.tooltipText && (
        <View>
          <InfoTooltip positionVertical="bottom" text={data.tooltipText} />
        </View>
      )}
      {data.text.includes(Dictionary.systemData.statusAlert) && (
        <Link
          text="Service"
          type="arrow"
          onPress={() => {
            navigation.navigate('Service');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textPadding: {
    paddingLeft: 10,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  warningBannerIcon: {
    marginTop: 5,
    fontSize: 32,
    height: 32,
  },
  warningBannerFlexRow: {
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  iconFlexRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    fontSize: 26,
    height: 26,
  },
});
