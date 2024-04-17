import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import OptionText from '../components/OptionText';
import {
  BoschIcon,
  CustomText,
  Button,
  ProgressIndicator,
  SwitchContent,
  CustomWheelPicker,
} from '../components';
import {Icons} from '../utils/icons';
import {Colors} from '../styles';
import {Dictionary} from '../utils/dictionary';
import {
  getAdvancedSettings,
  getDeviceInformation,
  lockScreen,
  setAdccessSettings,
} from '../store/actions/HomeOwnerActions';
import {connect, useDispatch} from 'react-redux';
import { CustomWheelPick } from '../components/CustomWheelPick';

function SensivityLevelScreen({
  navigation,
  getDeviceInformation,
  deviceInformation,
  selectedDevice,
}) {
  const dispatch = useDispatch();
  const [Level, setLevel] = useState('');
  const [LevelValues, setLevelValues] = useState(
    Array.from({length: (9 - 1) / 1 + 1}, (_, i) => `${1 + i * 1} `),
  );

  const [values, setValues] = useState({});

  useEffect(() => {
    loadRunTimeValues();
  }, []);

  function loadRunTimeValues() {
    return new Promise<void>((resolve, reject) => {
      /* istanbul ignore next */ dispatch(
        getAdvancedSettings(selectedDevice.macId, response => {
          const db = response.db;
          const hc = response.hc;
          const hc_adjustedReading = response.hc_adjustedReading;
          const hsd = response.hsd;
          const humidity = response.humidity;
          const latching = response.latching;
          const room_temp = response.room_temp;
          const sc = response.sc;
          const sc_adjustedReading = response.sc_adjustedReading;
          const ss = response.ss;
          const stageDelay = response.stageDelay;
          const stageTemp = response.stageTemp;

          setValues({
            db,
            hc,
            hsd,
            latching,
            sc,
            ss,
            stageDelay,
            stageTemp,
          });

          setLevel(ss);

          resolve();
        }),
      );
    });
  }

  function setAdvancedSettings(value) {
    return new Promise<void>((resolve, reject) => {
      dispatch(
        setAdccessSettings(selectedDevice.macId, value, response => {
          resolve();
        }),
      );
    });
  }

  const setHandleLevel = async selected => {
    let replacementArray = LevelValues[selected['0']].split(' ');
    let replacement = replacementArray[0];
    setLevel(replacement.toString());

    setValues({...values, ss: replacement});
    await setAdvancedSettings({...values, ss: replacement.toString()});
    await loadRunTimeValues();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <Image
        style={{height: 8, width: '100%'}}
        source={require('../assets/images/header_ribbon.png')}
      />
      <ScrollView>
        <View>
          <View style={{padding: 15}}>
            <View>
              <CustomWheelPick
                type={'picker'}
                testID="SensivityLevelWheel"
                blur={true}
                edit={true}
                accessibilityHintText={
                  'Activate to open the modal to select the sensivity level.'
                }
                pickerWidth={'100%'}
                placeholder={'Level'}
                value={Level}
                isRequiredField={true}
                values={LevelValues}
                defaultIndex={0}
                defaultValue={LevelValues[0]}
                onConfirm={selected => {
                  setHandleLevel(selected);
                }}
                accessibilityWheelPickerValue={[' the level of sensivity.']}
              />
            </View>
            <View style={styles.tipSection}>
              <BoschIcon
                size={20}
                name={Icons.infoTooltip}
                color={Colors.mediumBlue}
                accessibilityLabel={'Info'}
              />
              <CustomText
                allowFontScaling={true}
                accessibilityLabelText={
                  'The default Sensivity Level for room temperature is 5. The lower the level, the more your system will cycle to maintain setpoint.'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'The default Sensivity Level for room temperature is 5. The lower the level, the more your system will cycle to maintain setpoint.'
                }
                style={[styles.flexShrink1, styles.paddingLeft5]}
              />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SensivityLevelScreen);

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
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
});
