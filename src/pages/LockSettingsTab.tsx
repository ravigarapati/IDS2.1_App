import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import SwitchToggle from 'react-native-switch-toggle';
import {Colors} from '../styles';
import {Icons} from '../utils/icons';
import LOCK_SETTINGS from '../assets/images/LockSettings.svg';
import {
  BoschIcon,
  CustomInputText,
  CustomText,
  InfoTooltip,
  ToggleButton,
} from './../components';
import {connect} from 'react-redux';
import {updateLockDevice} from '../store/actions/HomeOwnerActions';

function LockSettingsTab({selectedDevice, updateLockDevice, navigation}) {
  const [enabled, setEnabled] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isUpdated, setIsUpdated] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setEnabled(navigation.state.params.lockedDevice);
    setAccessCode(navigation.state.params.lockCode);
  }, []);

  useEffect(() => {
    if (
      isUpdated &&
      selectedDevice.lockedDevice !== undefined &&
      selectedDevice.lockCode !== undefined
    ) {
      setEnabled(selectedDevice.lockedDevice);
      setAccessCode(selectedDevice.lockCode);
    }
  }, [selectedDevice]);

  let stopStatus = () => {
    clearTimeout(timeoutRef.current);
    setIsUpdated(false);
    timeoutRef.current = setTimeout(() => {
      setIsUpdated(true);
    }, 14000);
  };

  const updateLockAction = () => {
    stopStatus();
    navigation.state.params.stopStatus();
    navigation.state.params.createStatusInterval();
    /*setTimeout(() => {
      navigation.state.params.createStatusInterval();
    }, 3000);*/
    navigation.state.params.setUpdateInfo(false);
    //clearInterval(navigation.state.params.interval);
    let val = 0;
    if (!enabled) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);

      for (const num of array) {
        let result = num.toString().substring(0, 4);
        val = parseInt(result);
      }
      navigation.state.params.setLockCode(val.toString());
      navigation.state.params.setLockedDevice(true);
      setAccessCode(val.toString());
    } else {
      setAccessCode('');
      navigation.state.params.setLockedDevice(false);
      navigation.state.params.setLockCode('');
    }
    updateLockDevice({
      deviceId: selectedDevice.macId,
      lockDevice: !enabled,
      code: val == 0 ? '' : val.toString(),
    });
    setEnabled(!enabled);
    //navigation.state.params.createStatusInterval();
  };

  const onBack = () => {
    clearTimeout(timeoutRef.current);
    navigation.goBack();
  };

  return (
    <View style={{backgroundColor: 'white', flex: 1, alignItems: 'center'}}>
      <View style={styles.headerContainer}>
        <View style={styles.headerDivision}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => {
              onBack();
            }}>
            <BoschIcon
              name={Icons.backLeft}
              size={24}
              style={styles.marginHorizontal10}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTitle}>
          <CustomText text={'Lock Device'} size={21} font="medium" />
        </View>
      </View>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />

      <LOCK_SETTINGS style={{marginTop: 24, marginBottom: 16}} fill="#000" />
      <CustomText
        accessibilityLabelText={
          'Lock your thermostat screen to prevent unauthorized changes.'
        }
        text={'Lock your thermostat screen to prevent\nunauthorized changes'}
        font="regular"
      />
      <View
        accessible={true}
        accessibilityHint={`Activate to ${
          enabled ? 'unlock' : 'lock'
        } the device.`}
        accessibilityActions={[{name: 'activate'}]}
        onAccessibilityAction={updateLockAction}
        style={styles.lockSeciton}>
        <CustomText text={'Lock Screen'} size={18} />
        <View
          style={{
            marginTop: -16,
          }}>
          <SwitchToggle
            testID={'lockDevice'}
            switchOn={enabled}
            onPress={updateLockAction}
            circleColorOff="#FFFFFF"
            circleColorOn="#FFFFFF"
            backgroundColorOn="#00629A"
            backgroundColorOff="#71767C"
            containerStyle={styles.switchContainerStyle}
            circleStyle={styles.switchCircleStyle}
          />
        </View>
      </View>
      <View style={styles.accessCodeSection}>
        <CustomInputText
          accessibilityLabelText={
            enabled
              ? `Access code:`
              : "Access code: the device is unlocked, there's no generated access code."
          }
          testID={'code'}
          disabled={true}
          placeholder={'Access Code'}
          value={accessCode}
          maxLength={12}
          onChange={val => {}}
          //errorText={manualEntryError.macId ? 'MAC ID is Required' : ''}
        />
        <View style={styles.tipSection}>
          <BoschIcon
            size={20}
            name={Icons.infoTooltip}
            color={Colors.mediumBlue}
            accessibilityLabel={'Info'}
          />
          <CustomText
            accessibilityLabelText={
              'Screen lock disables the buttons on your thermostat screen.'
            }
            size={12}
            align="left"
            newline={true}
            text={
              'Screen lock disables the buttons on your\nthermostat screen.'
            }
            style={[styles.flexShrink1, styles.paddingLeft5]}
          />
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  updateLockDevice,
};

const styles = StyleSheet.create({
  lockSeciton: {
    flexDirection: 'row',
    paddingVertical: 20,
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#BFC0C2',
    paddingHorizontal: 16,
  },
  switchContainerStyle: {
    marginTop: 16,
    width: 48,
    height: 24,
    borderRadius: 25,
    padding: 5,
    marginHorizontal: 1,
  },
  switchCircleStyle: {
    width: 12,
    height: 12,
    borderRadius: 20,
  },
  accessCodeSection: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
  headerContainer: {
    backgroundColor: '#ffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
    paddingTop: 7,
  },
  headerDivision: {
    flexDirection: 'column',
    flex: 0.15,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  headerBackButton: {
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 24,
  },
  headerRibbon: {height: 8, width: '100%'},
  marginHorizontal10: {marginHorizontal: 10},
});

export default connect(mapStateToProps, mapDispatchToProps)(LockSettingsTab);
