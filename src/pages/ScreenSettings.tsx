import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';

import ThermostatImage from './../assets/images/device-thermostat-BCC100-72 COLOR.svg';
import SunImage from './../assets/images/sun.svg';
import ClockImage from './../assets/images/clock.svg';

import {
  getDeviceInformation,
  getDeviceStatus,
  getDeviceStatusWithNoLoadingScreen,
  lockScreen,
  updateBrightness,
  updateSelected,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';

const brightnessModes = [
  {
    id: 1,
    name: 'Low',
    description: 'Low',
  },
  {
    id: 2,
    name: 'Medium',
    description: 'Medium',
  },
  {
    id: 3,
    name: 'High',
    description: 'High',
  },
];

const timeOutModes = [
  {
    id: 1,
    name: '20 sec',
    description: '20 sec',
  },
  {
    id: 2,
    name: '1 min',
    description: '1 min',
  },
  {
    id: 3,
    name: '3 min',
    description: '3 min',
  },
];

function ScreenSettings({
  navigation,
  getDeviceInformation,
  deviceInformation,
  selectedDevice,
}) {
  const dispatch = useDispatch();
  const [updateInformation, setUpdateInformation] = useState(false);
  const [loockScreen, setLoockScreen] = useState(selectedDevice.type);
  const [idleScreen, setIdleScreen] = useState(false);
  const [brightnessMode, setBrightnessMode] = useState(
    parseInt(selectedDevice.screen),
  );
  const [timeOutMode, setTimeOutMode] = useState(
    parseInt(selectedDevice.s_time),
  );
  const [wasChanged, setWasChanged] = useState(false);

  const switchLoockScreen = value => {
    let val = 0;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    for (const num of array) {
      let result = num.toString().substring(0, 4);
      val = parseInt(result);
    }
    if (value) {
      setLoockScreen(0);
      dispatch(lockScreen(selectedDevice.macId, '0', val.toString()));
    } else if (!value) {
      setLoockScreen(1);
      dispatch(lockScreen(selectedDevice.macId, '1', ''));
    }
  };

  const setBrightnessChanged = value => {
    setBrightnessMode(value);
    dispatch(
      updateBrightness(
        selectedDevice.macId,
        value.toString(),
        timeOutMode.toString(),
      ),
    );
  };

  const setTimeOutChanged = value => {
    setTimeOutMode(value - 1);
    dispatch(
      updateBrightness(
        selectedDevice.macId,
        brightnessMode.toString(),
        (value - 1).toString(),
      ),
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
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
              text={'Screen'}
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
      <ScrollView>
        <View>
          <View style={{paddingHorizontal: 15}}>
            <View
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 35,
                },
                styles.optionContainer,
              ]}>
              <View>
                <ThermostatImage width={75} height={75} fill="#000" />
              </View>
              <View style={{paddingHorizontal: 60}}>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'regular'}
                  text={'Configure your thermostat screen settings'}
                  align={'center'}
                  size={16}
                />
              </View>
            </View>
            <View style={styles.optionContainer}>
              <SwitchContent
                titleFontSize={16}
                testID="LoockScreenSwitch"
                initialText={'Lock Screen'}
                switchStatus={value => switchLoockScreen(value)}
                accesoryOn={loockScreen == 0 ? true : false}
                marginTop={0}
                paddingHorizontal={5}
                marginHorizontal={-5}
                borderBottomColor={'transparent'}
                initialEventOff={true}
                accessibilityLabelText={`Lock Screen.`}
                accessibilityHintText={`Activate to ${
                  loockScreen === 0 ? 'unlock' : 'lock'
                } the screen.`}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View style={{marginRight: 15}}>
                <SunImage width={25} height={25} fill="#000" />
              </View>
              <View>
                <CustomText
                  allowFontScaling={true}
                  accessibilityHintText="Set the amount of brightness of the screen below."
                  color={Colors.black}
                  font={'bold'}
                  text={'Brightness'}
                  align={'left'}
                  size={16}
                />
              </View>
            </View>
            <View style={{marginBottom: 10}}>
              {brightnessModes.map(item => {
                return (
                  <OptionText
                    key={item.name}
                    option={item}
                    setCurrent={setBrightnessChanged}
                    setWasChanged={setWasChanged}
                    renderIcon={() => null}
                    currentSelected={brightnessMode}
                    disable={false}
                    showDescription={false}
                    enableHint=""
                    disableHint={`Set the brightness of the screen as ${item.name}.`}
                    optionFontSize={16}
                  />
                );
              })}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View style={{marginRight: 15}}>
                <ClockImage width={25} height={25} fill="#000" />
              </View>
              <View>
                <CustomText
                  allowFontScaling={true}
                  accessibilityHintText="Set the time the screen will take to timeout below."
                  color={Colors.black}
                  font={'bold'}
                  text={'Timeout'}
                  align={'left'}
                  size={16}
                />
              </View>
            </View>
            <View>
              {timeOutModes.map(item => {
                return (
                  <OptionText
                    key={item.name}
                    option={item}
                    setCurrent={setTimeOutChanged}
                    setWasChanged={setWasChanged}
                    renderIcon={() => null}
                    currentSelected={timeOutMode + 1}
                    disable={false}
                    showDescription={false}
                    enableHint=""
                    disableHint={`Timeout the screen of the device after ${item.name}.`}
                    optionFontSize={16}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = state => {
  return {
    deviceStatus: state.homeOwner.deviceInformation,
    selectedDevice: state.homeOwner.selectedDevice,
  };
};

const mapDispatchToProps = {
  getDeviceInformation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenSettings);

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
    marginBottom: 15,
  },
  tipSection: {
    flexDirection: 'row',
    marginTop: 33,
  },
  flexShrink1: {
    flexShrink: 1,
  },
  paddingLeft5: {
    paddingLeft: 12,
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
