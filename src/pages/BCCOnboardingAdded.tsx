import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {connect} from 'react-redux';
import BCCDashboardSchedule from './BCCDashboardSchedule';
import {
  getDeviceStatus,
  getScheduleList,
  newDeviceInfo,
  updateSelected,
} from '../store/actions/HomeOwnerActions';
import {Button, DeviceAdded} from '../components';
import {ScrollView} from 'react-native';
import {Dictionary} from '../utils/dictionary';

const BCCOnboardingAdded = ({
  navigation,
  selectedDevice,
  deviceList,
  nameDeviceOnboarding,
  isOnboardingBcc50,
}) => {
  const getListOfDevices = () => {
    let listOfDevices = [];
    deviceList.map(d => {
      if (d.deviceType.includes('IDS Arctic') && !d.paired) {
        d.isChecked = false;
        listOfDevices.push(d);
      }
    });

    return listOfDevices;
  };

  const goToAnotherDevice = () => {
    let list = getListOfDevices();
    //if (list.length != 0) {
    //  newDeviceInfo({
    //    deviceType: 'BCC101',
    //    macId: selectedDevice.macId,
    //    newDevice: true,
    //  });
    //  navigation.navigate('PairScreen');
    //} else {
    navigation.navigate('addAnotherDevice');
    //}
  };

  return (
    <View style={styles.mainContainer}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <View style={{flex: 1, marginHorizontal: 15}}>
        <DeviceAdded
          header={`${nameDeviceOnboarding} Thermostat`}
          description={Dictionary.addDevice.thermostatAdded}
          submit={() => {
            goToAnotherDevice();
          }}
          cancelAction={undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
    deviceList: state.homeOwner.deviceList2,
    newDeviceInfo: state.homeOwner.newDeviceInfo,
    nameDeviceOnboarding: state.homeOwner.nameDeviceOnboarding,
    isOnboardingBcc50: state.homeOwner.isOnboardingBcc50,
  };
};

const mapDispatchToProps = {
  newDeviceInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(BCCOnboardingAdded);
