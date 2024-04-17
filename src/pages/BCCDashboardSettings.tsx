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

function BCCDashboardSettings({
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
      name: Dictionary.bccDashboard.settings.temperature,
      icon: THEMOMETER,
      onPress: () => {
        navigation.navigate('Temperature', {
          interval: interval,
          createStatusInterval: createStatusInterval,
          setAuxHold: setAuxHold,
          setUpdateInfo: setUpdateInfo,
        });
      },
      hint: Dictionary.bccDashboard.settings.temperatureHint,
    },
    {
      name: Dictionary.bccDashboard.settings.dateTime,
      icon: CALENDAR,
      hint: Dictionary.bccDashboard.settings.dateTimeHint,
      onPress: () => {
        navigation.navigate('DateTime', {
          createStatusInterval: createStatusInterval,
          setUpdateInfo: setUpdateInfo,
          setIs24hrs: setIs24hrs,
          is24hrs: is24hrs,
          stopStatus: stopStatus,
        });
      },
    },
    {
      name: Dictionary.bccDashboard.settings.location,
      icon: LOCATION,
      onPress: () => {
        navigation.navigate('Location');
      },
      hint: Dictionary.bccDashboard.settings.locationHint,
    },
    {
      name: Dictionary.bccDashboard.settings.screen,
      icon: SCREEN,
      onPress: () => {
        navigation.navigate('ScreenSettings', {
          interval: interval,
          createStatusInterval: createStatusInterval,
          setAuxHold: setAuxHold,
          setUpdateInfo: setUpdateInfo,
        });
      },
      hint: Dictionary.bccDashboard.settings.screenHint,
    },
    {
      name: Dictionary.bccDashboard.settings.runtime,
      icon: RUNTIME,
      onPress: () => {
        navigation.navigate('RuntimeSettings', {
          createStatusInterval: createStatusInterval,
        });
      },
      hint: Dictionary.bccDashboard.settings.runtimeHint,
    },
    {
      name: 'Wi-Fi',
      icon: WIFI,
      onPress: () => {
        navigation.navigate('ReconnectWiFi');
      },
      hint: 'Wi-Fi',
    },
    {
      name: Dictionary.bccDashboard.settings.deviceInformation,
      icon: DEVICE_INFORMATION,
      onPress: () => {
        setUpdateInformation(true);
        if (
          (deviceInformation.deviceId === undefined ||
            deviceInformation.deviceId == '') &&
          (deviceInformation.hd === undefined || deviceInformation.hd == '') &&
          (deviceInformation.model === undefined ||
            deviceInformation.model == '') &&
          (deviceInformation.sw === undefined || deviceInformation.sw == '')
        ) {
          showToast(
            'Device information is not available at this time.',
            'error',
          );
        } else {
          navigation.navigate('DeviceInformation', {
            deviceInformation: deviceInformation,
          });
        }
      },
      hint: Dictionary.bccDashboard.settings.deviceInformationHint,
    },
    {
      name: Dictionary.bccDashboard.settings.advanced_settings,
      icon: ADVANCED_SETTINGS,
      onPress: () => {
        navigation.navigate('ScreenAdvancedSettings');
      },
      hint: Dictionary.bccDashboard.settings.advanced_settingsHint,
    },
  ];

  const settings = [
    {
      name: Dictionary.bccDashboard.settings.temperature,
      icon: THEMOMETER,
      onPress: () => {
        navigation.navigate('Temperature', {
          interval: interval,
          createStatusInterval: createStatusInterval,
          setAuxHold: setAuxHold,
          setUpdateInfo: setUpdateInfo,
        });
      },
      hint: Dictionary.bccDashboard.settings.temperatureHint,
    },
    {
      name: Dictionary.bccDashboard.settings.dateTime,
      icon: CALENDAR,
      hint: Dictionary.bccDashboard.settings.dateTimeHint,
      onPress: () => {
        navigation.navigate('DateTime', {
          createStatusInterval: createStatusInterval,
          setUpdateInfo: setUpdateInfo,
          setIs24hrs: setIs24hrs,
          is24hrs: is24hrs,
          stopStatus: stopStatus,
        });
      },
    },
    {
      name: Dictionary.bccDashboard.settings.location,
      icon: LOCATION,
      onPress: () => {
        navigation.navigate('Location');
      },
      hint: Dictionary.bccDashboard.settings.locationHint,
    },
    {
      name: Dictionary.bccDashboard.settings.lockScreen,
      icon: LOCK,
      onPress: () => {
        navigation.navigate('LockScreen', {
          interval: interval,
          createStatusInterval: createStatusInterval,
          setAuxHold: setAuxHold,
          setUpdateInfo: setUpdateInfo,
          lockedDevice: lockedDevice,
          setLockedDevice: setLockedDevice,
          setLockCode: setLockCode,
          lockCode: lockCode,
          stopStatus: stopStatus,
        });
      },
      hint: Dictionary.bccDashboard.settings.lockScreenHint,
    },
    {
      name: Dictionary.bccDashboard.settings.deviceInformation,
      icon: DEVICE_INFORMATION,
      onPress: () => {
        setUpdateInformation(true);
        if (
          (deviceInformation.deviceId === undefined ||
            deviceInformation.deviceId == '') &&
          (deviceInformation.hd === undefined || deviceInformation.hd == '') &&
          (deviceInformation.model === undefined ||
            deviceInformation.model == '') &&
          (deviceInformation.sw === undefined || deviceInformation.sw == '')
        ) {
          showToast(
            'Device information is not available at this time.',
            'error',
          );
        } else {
          navigation.navigate('DeviceInformation', {
            deviceInformation: deviceInformation,
          });
        }
      },
      hint: Dictionary.bccDashboard.settings.deviceInformationHint,
    },
  ];

  return (
    <View style={styles.container}>
      {(deviceInformation.model == 'BCC50' ? settingsBCC50 : settings).map(
        o => (
          <DeviceSetting
            testID={o.name}
            key={o.name}
            accessibilityHintText={o.hint}
            name={o.name}
            Icon={o.icon}
            onPress={o.onPress}
          />
        ),
      )}
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
)(BCCDashboardSettings);
