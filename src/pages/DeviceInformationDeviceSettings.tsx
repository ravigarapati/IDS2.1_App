import React, {useEffect} from 'react';
import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {BoschIcon, CustomText} from '../components';
import {Dictionary} from '../utils/dictionary';
import DEVICE_SETTINGS from '../assets/images/DeviceInfoSettings.svg';
import {Icons} from '../utils/icons';

function Info({section, value, title}) {
  return (
    <View
      accessible={true}
      accessibilityLabel={`${title}: ${value}`}
      style={styles.infoContainer}>
      <CustomText
        allowFontScaling={true}
        style={styles.info}
        align={'left'}
        text={`${section}:`}
      />
      <CustomText
        allowFontScaling={true}
        style={styles.info}
        align={'left'}
        text={value}
      />
    </View>
  );
}

export default function DeviceInformationDeviceSettings({navigation}) {
  return (
    <View style={styles.container}>
      <>
        <View style={styles.headerContainer}>
          <View style={styles.headerDivision}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}>
              <BoschIcon
                name={Icons.backLeft}
                size={24}
                style={styles.marginHorizontal10}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTitle}>
            <CustomText
              text={'Device Information'}
              size={21}
              allowFontScaling={true}
              font="medium"
              style={{
                marginVertical: 8,
              }}
            />
          </View>
        </View>
        <Image
          style={styles.headerRibbon}
          source={require('../assets/images/header_ribbon.png')}
        />
      </>
      <View style={styles.imageContainer}>
        <DEVICE_SETTINGS fill="#000" />
      </View>

      <CustomText
        allowFontScaling={true}
        style={styles.screenDescription}
        text={Dictionary.bccDashboard.settings.deviceInformationScreen.title}
        accessibilityLabelText={
          Dictionary.bccDashboard.settings.deviceInformationScreen.titleLabel
        }
        font="regular"
      />
      <CustomText
        allowFontScaling={true}
        style={styles.deviceHeader}
        align="left"
        text={Dictionary.bccDashboard.settings.deviceInformationScreen.device}
        accessibilityLabelText={
          Dictionary.bccDashboard.settings.deviceInformationScreen.description
        }
      />
      <View style={styles.marginTop24}>
        <Info
          section={'Model'}
          value={navigation.getParam('deviceInformation').model}
          title={'Device Modal'}
        />
        <Info
          section={'SW Version'}
          value={navigation.getParam('deviceInformation').sw}
          title={'Software version'}
        />
        <Info
          section={'HD Version'}
          value={navigation.getParam('deviceInformation').hd}
          title={'Hardware version'}
        />
        <Info
          section={'MAC ID'}
          value={navigation.getParam('deviceInformation').deviceId}
          title={'MAC ID'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
  imageContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  infoContainer: {
    flexDirection: 'row',
    marginLeft: 17,
    marginBottom: 15,
  },
  info: {
    width: '50%',
  },
  marginTop24: {
    marginTop: 24,
  },
  deviceHeader: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 13,
    paddingLeft: 17,
  },
  screenDescription: {
    marginTop: 23,
    marginBottom: 32,
  },
  marginHorizontal10: {marginHorizontal: 10},
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
});
