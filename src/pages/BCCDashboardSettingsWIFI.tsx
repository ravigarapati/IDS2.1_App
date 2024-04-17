import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import {CustomText} from '../components';
import DeviceSetting from '../components/DeviceSetting';
import {connect} from 'react-redux';
import {getDeviceInformation} from '../store/actions/HomeOwnerActions';
import {Dictionary} from '../utils/dictionary';
import THEMOMETER from './../assets/images/Temperature.svg';
import CALENDAR from './../assets/images/Date-time.svg';
import LOCATION from './../assets/images/Location.svg';
import WIFI from './../assets/images/Wifismall.svg';
import SCREEN from './../assets/images/device-thermostat-BCC100-72.svg';
import RUNTIME from './../assets/images/runtime.svg';
import DEVICE_INFORMATION from './../assets/images/Device-info.svg';
import LOCK from './../assets/images/Lock-screen.svg';
import ADVANCED_SETTINGS from './../assets/images/advanced-settings.svg';
import {Colors} from '../styles';
import PAIRING from './../assets/images/link-connected-settings.svg';
import {create} from 'react-test-renderer';
import {showToast} from '../components/CustomToast';
const height = Dimensions.get('screen').height;
function BCCDashboardSettingsWIFI({
  navigation,
  getDeviceInformation,
  selectedDevice,
  deviceInformation,
  interval,
  createStatusInterval,
  setAuxHold,
  setUpdateInfo,
  lockedDevice,
  setLockedDevice,
  setLockCode,
  lockCode,
  setIs24hrs,
  is24hrs,
  stopStatus,
}) {
  const [updateInformation, setUpdateInformation] = useState(false);
  const settingsBCC50 = [
    {
      name: 'Wi-Fi',
      icon: WIFI,
      onPress: () => {
        navigation.navigate('ReconnectWiFi');
      },
      hint: 'Wi-Fi',
    },
  ];

  return (
    <View style={styles.container}>
      {settingsBCC50.map(o => (
        <DeviceSetting
          testID={o.name}
          key={o.name}
          accessibilityHintText={o.hint}
          name={o.name}
          Icon={o.icon}
          onPress={o.onPress}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {backgroundColor: Colors.white, height: height * 0.78},
});
const mapStateToProps = state => {
  return {
    deviceInformation: state.homeOwner.deviceInformation,
  };
};
const mapDispatchToProps = {
  getDeviceInformation,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BCCDashboardSettingsWIFI);
