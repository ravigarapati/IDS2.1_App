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
const DROP_ICON = require('../assets/images/drop.png');

function RelativeHumidityHysteresisScreen({
  navigation,
  getDeviceInformation,
  deviceInformation,
  selectedDevice,
}) {
  const dispatch = useDispatch();
  const [HSD, setHSD] = useState('');
  const [HSDValues, setHSD_Values] = useState(
    Array.from({length: (5 - 3) / 1 + 1}, (_, i) => `${3 + i * 1} %`),
  );

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

          setHSD(hsd);

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

  const setHandlerHsd = async selected => {
    let replacementArray = HSDValues[selected ? selected['0'] : 0].split(' ');
    let replacement = replacementArray[0];
    setHSD(replacement.toString());

    setValues({...values, hsd: replacement});
    await setAdvancedSettings({...values, hsd: replacement.toString()});
    dispatch({
      type: 'SHOW_LOADING',
      data: true,
    });
    setTimeout(() => {
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
            <View>
              <CustomWheelPick
                type={'picker'}
                testID="RelativeHumidityHysteresisWheel"
                blur={true}
                edit={true}
                accessibilityHintText={
                  'Activate to open the modal to select the relative humidity.'
                }
                pickerWidth={'100%'}
                placeholder={'Set to'}
                value={HSD + '%'}
                isRequiredField={true}
                values={HSDValues}
                defaultIndex={0}
                defaultValue={HSDValues[0]}
                icon={DROP_ICON}
                onConfirm={selected => {
                  setHandlerHsd(selected);
                }}
                accessibilityWheelPickerValue={['the relative humidity.']}
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
                  'Use the humidity hysteresis to adjust the activation and deactivation of the humidification & dehumidification calls (H/DH terminal).'
                }
                size={12}
                align="left"
                newline={true}
                text={
                  'Use the humidity hysteresis to adjust the activation and deactivation of the humidification & dehumidification calls (H/DH terminal).'
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
)(RelativeHumidityHysteresisScreen);

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
