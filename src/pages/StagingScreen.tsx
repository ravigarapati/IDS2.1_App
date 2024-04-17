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
import CLOCK from '../assets/images/clock.svg';
import THERMOMETER from '../assets/images/temperature1.svg';
import { CustomWheelPick } from '../components/CustomWheelPick';

function StagingScreen({
  navigation,
  getDeviceInformation,
  deviceInformation,
  selectedDevice,
}) {
  const dispatch = useDispatch();
  const [latching, setLatching] = useState('');

  const [StageDelay, setStageDelay] = useState('');
  const [StageDelayValues, setStageDelayValues] = useState(
    Array.from({length: (90 - 3) / 1 + 1}, (_, i) => `${3 + i * 1} min`),
  );

  const [StageTemp, setStageTemp] = useState('');
  const [StageTempValues, setStageTempValues] = useState(
    selectedDevice.isFahrenheit
      ? Array.from({length: (15 - 0.0) / 1 + 1}, (_, i) => `${0 + i * 1} °F`)
      : Array.from({length: (9 - 0) / 1 + 1}, (_, i) => `${0 + i * 1} °C`),
  );

  const switchLatching = async value => {
    if (value) {
      setLatching('1');
      setValues({...values, latching: '1'});
      await setAdvancedSettings({...values, latching: '1'});
      /* istanbul ignore next */ dispatch({
        type: 'SHOW_LOADING',
        data: true,
      });
      /* istanbul ignore next */ setTimeout(() => {
        loadRunTimeValues();
      }, 2000);
    } else if (!value) {
      setLatching('0');
      setValues({...values, latching: '0'});
      await setAdvancedSettings({...values, latching: '0'});
      /* istanbul ignore next */ dispatch({
        type: 'SHOW_LOADING',
        data: true,
      });
      /* istanbul ignore next */ setTimeout(() => {
        loadRunTimeValues();
      }, 2000);
    }
  };

  const [values, setValues] = useState({});

  useEffect(() => {
    loadRunTimeValues();
  }, []);

  function loadRunTimeValues() {
    return new Promise<void>((resolve, reject) => {
      /* istanbul ignore next */ dispatch(
        getAdvancedSettings(selectedDevice.macId, response => {
          const fanDelay = response.fanDelay;
          const fanOnDelay = response.fanOnDelay;
          const fanOffDelay = response.fanOffDelay;
          const minRunTime = response.minRunTime;
          const antiShortTime = response.antiShortTime;
          const cycleTime = response.cycleTime;
          const heatDeadBand = response.heatDeadBand;
          const coolDeadBand = response.coolDeadBand;

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

          setStageDelay(stageDelay);
          setStageTemp(stageTemp);
          setLatching(latching);

          resolve();
        }),
      );
    });
  }
  function setAdvancedSettings(value) {
    /* istanbul ignore next */ return new Promise<void>((resolve, reject) => {
      dispatch(
        setAdccessSettings(selectedDevice.macId, value, response => {
          resolve();
        }),
      );
    });
  }

  const setHandlerStageDelay = async selected => {
    let replacementArray =
      StageDelayValues[selected ? selected['0'] : 0].split(' ');
    let replacement = replacementArray[0];
    setStageDelay(replacement.toString());

    setValues({...values, stageDelay: replacement});
    await setAdvancedSettings({...values, stageDelay: replacement.toString()});
    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    setTimeout(() => {
      loadRunTimeValues();
    }, 2000);
  };

  const setHandlerStageTemp = async selected => {
    let replacementArray =
      StageTempValues[selected ? selected['0'] : 0].split(' ');
    let replacement = replacementArray[0];
    setStageTemp(replacement.toString());

    setValues({...values, stageTemp: replacement});
    await setAdvancedSettings({...values, stageTemp: replacement.toString()});
    /* istanbul ignore next */ dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    /* istanbul ignore next */ setTimeout(() => {
      loadRunTimeValues();
    }, 2000);
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
            <View style={styles.optionContainer}>
              <View>
                <SwitchContent
                  testID="LatchingSwitch"
                  initialText={'Latching'}
                  switchStatus={value => switchLatching(value)}
                  accesoryOn={latching == 1 ? true : false}
                  marginTop={0}
                  paddingHorizontal={5}
                  marginHorizontal={-5}
                  borderBottomColor={'transparent'}
                  initialEventOff={true}
                  accessibilityLabelText="Latching"
                  accessibilityHintText={`Activate to ${
                    latching == 1 ? 'disable' : 'enable'
                  } latching.`}
                />
              </View>
              <View style={[styles.tipSection, {marginTop: 10}]}>
                <BoschIcon
                  size={20}
                  name={Icons.infoTooltip}
                  color={Colors.mediumBlue}
                  accessibilityLabel={'Info'}
                />
                <CustomText
                  allowFontScaling={true}
                  accessibilityLabelText={
                    'Enabling latching will prevent cycling between stages once set point is met.'
                  }
                  size={12}
                  align="left"
                  newline={true}
                  text={
                    'Enabling latching will prevent cycling between stages once set point is met.'
                  }
                  style={[styles.flexShrink1, styles.paddingLeft5]}
                />
              </View>
            </View>
            <View style={styles.optionContainer}>
              <View style={{marginVertical: 15}}>
                <View>
                  <CustomText
                    allowFontScaling={true}
                    color={Colors.black}
                    font={'bold'}
                    text={'Stage Delay'}
                    align={'left'}
                    size={18}
                  />
                </View>
              </View>
              <View>
                <CustomWheelPick
                  type={'picker'}
                  testID="StageDelayWheel"
                  blur={true}
                  edit={true}
                  accessibilityHintText={
                    'Activate to open a modal to select the time delay.'
                  }
                  pickerWidth={'100%'}
                  placeholder={'Time Delay'}
                  value={StageDelay}
                  isRequiredField={true}
                  values={StageDelayValues}
                  defaultIndex={0}
                  defaultValue={StageDelayValues[0]}
                  isSvgIcon={true}
                  icon={<CLOCK fill="#000" />}
                  onConfirm={selected => {
                    setHandlerStageDelay(selected);
                  }}
                  accessibilityWheelPickerValue={[' the time delay.']}
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
                    'Set the time delay between stage up and stage down logic for multi-stage equipment.'
                  }
                  size={12}
                  align="left"
                  newline={true}
                  text={
                    'Set the time delay between stage up and stage down logic for multi-stage equipment.'
                  }
                  style={[styles.flexShrink1, styles.paddingLeft5]}
                />
              </View>
            </View>
            <View style={{marginVertical: 15}}>
              <View>
                <CustomText
                  allowFontScaling={true}
                  color={Colors.black}
                  font={'bold'}
                  text={'Stage Temp'}
                  align={'left'}
                  size={18}
                />
              </View>
            </View>
            <View>
              <CustomWheelPick
                type={'picker'}
                testID="StageTempWheel"
                blur={true}
                edit={true}
                accessibilityHintText={
                  'Activate to open the modal to select the Temperature Delay'
                }
                pickerWidth={'100%'}
                placeholder={'Temperature Delay'}
                value={
                 ((parseInt(StageTemp)==50)?(parseInt(StageTemp) / 10):StageTemp) + (selectedDevice.isFahrenheit ? ' °F' : ' °C')
                }
                isRequiredField={true}
                values={StageTempValues}
                defaultValue={0}
                isSvgIcon={true}
                icon={<THERMOMETER fill="#000" />}
                onConfirm={selected => {
                  setHandlerStageTemp(selected);
                }}
                accessibilityWheelPickerValue={[' the temperature delay.']}
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
                  'Set the temperature delay between the stage up and stage down logic for multistage equipment.'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'Set the temperature delay between the stage up and stage down logic for multistage equipment.'
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

export default connect(mapStateToProps, mapDispatchToProps)(StagingScreen);

const styles = StyleSheet.create({
  optionContainer: {
    borderBottomWidth: 1,
    borderColor: '#BFC0C2',
    marginBottom: 20,
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
