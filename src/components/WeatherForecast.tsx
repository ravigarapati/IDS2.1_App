import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {CustomText} from './../components';

type WeatherForecastProps = {
  day: string;
  temperature: string;
  icon: string;
  accessibilityLabelDay?: string;
  accessibilityLabelTemperature?: string;
  accessibilityLabelImage?: string;
};

export default function WeatherForecast({
  day,
  temperature,
  icon,
  accessibilityLabelDay = '',
  accessibilityLabelTemperature = '',
  accessibilityLabelImage = '',
}: WeatherForecastProps) {
  return (
    <View style={styles.container}>
      <CustomText
        allowFontScaling={true}
        accessible={true}
        accessibilityLabelText={accessibilityLabelDay}
        text={day}
        size={10}
        color={'#FFFFFF'}
        font={'regular'}
        style={styles.day}
      />
      <CustomText
        allowFontScaling={true}
        accessible={true}
        accessibilityLabelText=" "
        text={temperature}
        size={12}
        color={'#FFFFFF'}
        font={'medium'}
        style={styles.temperature}
      />
      <View
        accessibilityLabel={accessibilityLabelImage}
        style={styles.imageContainer}>
        <Image style={styles.imageStyle} source={icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  day: {
    marginBottom: 1,
  },
  temperature: {
    marginBottom: 9,
  },
  imageContainer: {
    height: 20,
    justifyContent: 'center',
  },
  imageStyle: {
    height: 20,
    width: 20,
  },
});
